import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidUsernameFormat, normalizeUsername, type UsernameStatus } from "@/lib/username";

// GET /api/username/check?u=minh.anh → { status: "ok" | "invalid" | "reserved" | "taken" }
// Uses the caller's session when present, so your own username reads as "ok".
// TODO(week 4): rate limit with Upstash once it is provisioned.
export async function GET(request: NextRequest) {
  const username = normalizeUsername(request.nextUrl.searchParams.get("u") ?? "");
  const headers = { "Cache-Control": "no-store" };

  if (!isValidUsernameFormat(username)) {
    return NextResponse.json({ username, status: "invalid" satisfies UsernameStatus }, { headers });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("username_status", { candidate: username });
  if (error) {
    return NextResponse.json({ error: "check_failed" }, { status: 502, headers });
  }
  return NextResponse.json({ username, status: data as UsernameStatus }, { headers });
}
