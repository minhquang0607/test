import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { parseBlocks, type Block } from "@/lib/blocks";
import { supabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";
import { resolveTheme, type Theme } from "@/lib/themes";
import { isValidUsernameFormat, normalizeUsername } from "@/lib/username";

const payloadSchema = z.object({
  username: z.string(),
  display_name: z.string(),
  bio: z.string(),
  avatar_url: z
    .string()
    .nullable()
    .transform((v) => (v && v.startsWith("https://") ? v : null)),
  is_verified: z.boolean(),
  plan: z.enum(["free", "pro"]),
  theme: z.unknown(),
  blocks: z.unknown(),
  is_sensitive: z.boolean(),
  published_at: z.string(),
});

export type PublicPageData = {
  profile: { username: string; display_name: string; bio: string; avatar_url: string | null; is_verified: boolean };
  plan: "free" | "pro";
  theme: Theme;
  blocks: Block[];
  isSensitive: boolean;
};

/** Cache tag for one creator's public page. Invalidate it whenever what
 * get_public_page() returns could change (publish, profile, username). */
export function publicPageTag(username: string) {
  return `page:${username}`;
}

export async function getPublicPage(rawHandle: string): Promise<PublicPageData | null> {
  let handle: string;
  try {
    handle = normalizeUsername(decodeURIComponent(rawHandle));
  } catch {
    return null; // malformed percent-encoding
  }
  if (!isValidUsernameFormat(handle)) return null;
  return loadPublicPage(handle);
}

/**
 * Reads a published page as an anonymous visitor: no cookies are read or
 * written, so the result is safe to share between visitors and cache.
 * "Not found" (null) is cached too, under the same tag, so claiming a
 * username must invalidate it.
 */
async function loadPublicPage(handle: string): Promise<PublicPageData | null> {
  "use cache";
  cacheTag(publicPageTag(handle));
  cacheLife("hours");

  const { url, key } = supabaseEnv();
  const supabase = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data, error } = await supabase.rpc("get_public_page", { handle });
  if (error) throw new Error(`get_public_page failed: ${error.message}`);
  if (!data) return null;

  const parsed = payloadSchema.safeParse(data);
  if (!parsed.success) throw new Error("get_public_page returned an unexpected shape");

  const p = parsed.data;
  return {
    profile: { username: p.username, display_name: p.display_name, bio: p.bio, avatar_url: p.avatar_url, is_verified: p.is_verified },
    plan: p.plan,
    theme: resolveTheme(p.theme),
    blocks: parseBlocks(p.blocks),
    isSensitive: p.is_sensitive,
  };
}
