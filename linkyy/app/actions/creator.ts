"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { linkBlockSchema, MAX_ONBOARDING_LINKS, newBlockId, type LinkBlock } from "@/lib/blocks";
import { publicPageTag } from "@/lib/public-page";
import { createClient } from "@/lib/supabase/server";
import { themeSettingsSchema } from "@/lib/themes";
import { normalizeUsername, USERNAME_MESSAGES, type UsernameStatus } from "@/lib/username";

// Every action re-validates input and re-checks the session; the database
// (RLS + column grants + RPC checks) is the final line of defence.

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

const GENERIC_ERROR = "Có lỗi xíu, thử lại nha 🙏";
const NOT_SIGNED_IN = "Phiên đăng nhập hết hạn, đăng nhập lại nha";

async function authed() {
  const user = await getSessionUser();
  if (!user) return null;
  return { user, supabase: await createClient() };
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

function logError(action: string, error: unknown) {
  console.error(`[actions/${action}]`, error);
}

type Ctx = NonNullable<Awaited<ReturnType<typeof authed>>>;

async function currentUsername(ctx: Ctx): Promise<string | null> {
  const { data } = await ctx.supabase.from("profiles").select("username").eq("id", ctx.user.id).maybeSingle();
  return data?.username ?? null;
}

/** Drop cached public pages so visitors (and the creator) see changes now. */
function invalidatePublicPages(...usernames: (string | null | undefined)[]) {
  for (const u of new Set(usernames)) if (u) updateTag(publicPageTag(u));
}

// --- username ----------------------------------------------------------------

export async function claimUsername(raw: string): Promise<ActionResult<{ username: string }>> {
  const ctx = await authed();
  if (!ctx) return fail(NOT_SIGNED_IN);

  const username = normalizeUsername(String(raw ?? ""));
  const previous = await currentUsername(ctx);
  const { data, error } = await ctx.supabase.rpc("claim_username", { new_username: username });
  if (error) {
    logError("claimUsername", error);
    return fail(GENERIC_ERROR);
  }

  const status = data as UsernameStatus;
  if (status !== "ok") return fail(USERNAME_MESSAGES[status] ?? GENERIC_ERROR);

  // The old handle now 404s; the new one may have a cached "not found".
  invalidatePublicPages(previous, username);
  revalidatePath("/dashboard", "layout");
  return { ok: true, data: { username } };
}

// --- profile -----------------------------------------------------------------

const profileSchema = z.object({
  display_name: z.string().trim().min(1, "Điền tên hiển thị nha").max(50, "Tên tối đa 50 ký tự"),
  bio: z.string().trim().max(160, "Bio tối đa 160 ký tự"),
});

export async function saveProfile(input: { display_name: string; bio: string }): Promise<ActionResult> {
  const ctx = await authed();
  if (!ctx) return fail(NOT_SIGNED_IN);

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? GENERIC_ERROR);

  const { error } = await ctx.supabase.from("profiles").update(parsed.data).eq("id", ctx.user.id);
  if (error) {
    logError("saveProfile", error);
    return fail(GENERIC_ERROR);
  }
  invalidatePublicPages(await currentUsername(ctx));
  revalidatePath("/dashboard", "layout");
  return { ok: true, data: undefined };
}

// --- theme -------------------------------------------------------------------

export async function saveTheme(preset: string): Promise<ActionResult> {
  const ctx = await authed();
  if (!ctx) return fail(NOT_SIGNED_IN);

  const parsed = themeSettingsSchema.safeParse({ preset });
  if (!parsed.success) return fail("Theme không tồn tại");

  const { error } = await ctx.supabase.from("pages").update({ theme: parsed.data }).eq("user_id", ctx.user.id);
  if (error) {
    logError("saveTheme", error);
    return fail(GENERIC_ERROR);
  }
  return { ok: true, data: undefined };
}

// --- links (onboarding: replaces the draft with these links) -----------------

export async function saveOnboardingLinks(
  links: { id?: string; title: string; url: string }[],
): Promise<ActionResult<{ links: LinkBlock[] }>> {
  const ctx = await authed();
  if (!ctx) return fail(NOT_SIGNED_IN);
  if (!Array.isArray(links) || links.length > MAX_ONBOARDING_LINKS) return fail(`Tối đa ${MAX_ONBOARDING_LINKS} link thôi nha`);

  const blocks: LinkBlock[] = [];
  for (const [i, link] of links.entries()) {
    if (!link?.title?.trim() && !link?.url?.trim()) continue; // empty row
    const parsed = linkBlockSchema.safeParse({
      id: typeof link.id === "string" && /^[a-z0-9]{6,40}$/i.test(link.id) ? link.id : newBlockId(),
      type: "link",
      title: link.title,
      url: link.url,
      enabled: true,
    });
    if (!parsed.success) return fail(`Link #${i + 1}: ${parsed.error.issues[0]?.message ?? "chưa đúng"}`);
    blocks.push(parsed.data);
  }

  const { error } = await ctx.supabase.from("pages").update({ draft_blocks: blocks }).eq("user_id", ctx.user.id);
  if (error) {
    logError("saveOnboardingLinks", error);
    return fail(GENERIC_ERROR);
  }
  return { ok: true, data: { links: blocks } };
}

// --- publishing --------------------------------------------------------------

export async function publishAndFinishOnboarding(): Promise<ActionResult<{ username: string }>> {
  const ctx = await authed();
  if (!ctx) return fail(NOT_SIGNED_IN);

  const published = await ctx.supabase.rpc("publish_page");
  if (published.error) {
    logError("publish", published.error);
    return fail(/username/i.test(published.error.message) ? "Chọn username trước đã nha" : GENERIC_ERROR);
  }

  const done = await ctx.supabase.rpc("complete_onboarding");
  if (done.error || !done.data) {
    logError("completeOnboarding", done.error);
    return fail(GENERIC_ERROR);
  }

  const username = await currentUsername(ctx);
  invalidatePublicPages(username);
  revalidatePath("/dashboard", "layout");
  return { ok: true, data: { username: username ?? "" } };
}

export async function setPublished(publish: boolean): Promise<ActionResult> {
  const ctx = await authed();
  if (!ctx) return fail(NOT_SIGNED_IN);

  const { error } = publish ? await ctx.supabase.rpc("publish_page") : await ctx.supabase.rpc("unpublish_page");
  if (error) {
    logError("setPublished", error);
    return fail(GENERIC_ERROR);
  }
  invalidatePublicPages(await currentUsername(ctx));
  revalidatePath("/dashboard", "layout");
  return { ok: true, data: undefined };
}
