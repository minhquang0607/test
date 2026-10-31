"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { siteUrl } from "@/lib/env";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";

export type MagicLinkState =
  | { status: "idle" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string; email?: string };

const emailSchema = z.email({ error: "Email chưa đúng nè" }).max(254);

function callbackUrl(next: string) {
  return `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function sendMagicLink(_prev: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const rawEmail = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(formData.get("next")?.toString());

  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Email chưa đúng nè", email: rawEmail };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { emailRedirectTo: callbackUrl(next), shouldCreateUser: true },
  });

  if (error) {
    const rateLimited = error.status === 429 || /rate limit|security purposes/i.test(error.message);
    return {
      status: "error",
      email: parsed.data,
      message: rateLimited ? "Gửi nhiều quá rồi, đợi 1 phút rồi thử lại nha ⏳" : "Không gửi được email, thử lại xíu nha",
    };
  }
  return { status: "sent", email: parsed.data };
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData.get("next")?.toString());
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(next) },
  });
  if (error || !data.url) {
    redirect(`/login?error=oauth&next=${encodeURIComponent(next)}`);
  }
  redirect(data.url);
}
