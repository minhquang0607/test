import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PageRow, Profile } from "@/lib/supabase/database.types";

// Data Access Layer: the real authorization checks live here and in the
// database (RLS). proxy.ts only does optimistic redirects.

export type SessionUser = { id: string; email: string | null };

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
});

export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return user;
}

export const getMyProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) throw error;
  return data;
});

export const getMyPage = cache(async (): Promise<PageRow | null> => {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("pages").select("*").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  return data;
});

export function isOnboarded(profile: Profile | null): boolean {
  return Boolean(profile?.username && profile.onboarded_at);
}

/**
 * For /dashboard: signed in AND onboarded, otherwise redirect. Cached per
 * request, so the layout and the page can both call it for free.
 */
export const requireCreator = cache(async () => {
  const user = await requireUser("/dashboard");
  const profile = await getMyProfile();
  if (!profile || !isOnboarded(profile)) redirect("/onboarding");
  return { user, profile: profile as Profile & { username: string } };
});
