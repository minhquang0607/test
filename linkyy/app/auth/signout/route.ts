import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

// POST only, so a stray <img src="/auth/signout"> can't log people out.
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", siteUrl()), { status: 303 });
}
