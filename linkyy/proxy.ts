import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { safeNext } from "@/lib/safe-next";

const PROTECTED = ["/dashboard", "/onboarding"];
const AUTH_PAGES = ["/login"];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/** Redirect without losing cookies (and no-cache headers) from a token refresh. */
function redirectKeepingSession(url: URL, from: NextResponse) {
  const res = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) res.headers.set(header, value);
  }
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // linkyy.vn/@username → /u/username. In the App Router a folder starting
  // with "@" is a parallel-route slot, so the pretty URL is a rewrite.
  // Public pages never touch the session, so no auth cookies get set on
  // responses that a CDN may cache.
  const handle = /^\/(?:@|%40)([^/]+)(\/.*)?$/i.exec(pathname);
  if (handle) {
    const url = request.nextUrl.clone();
    url.pathname = `/u/${handle[1].toLowerCase()}${handle[2] ?? ""}`;
    return NextResponse.rewrite(url);
  }
  if (pathname === "/u" || pathname.startsWith("/u/")) {
    return NextResponse.next();
  }

  const { response, claims } = await updateSession(request);

  if (!claims && matches(pathname, PROTECTED)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return redirectKeepingSession(url, response);
  }

  if (claims && matches(pathname, AUTH_PAGES)) {
    const url = request.nextUrl.clone();
    const target = safeNext(request.nextUrl.searchParams.get("next"));
    const [targetPath, targetQuery = ""] = target.split("?");
    url.pathname = targetPath;
    url.search = targetQuery ? `?${targetQuery}` : "";
    return redirectKeepingSession(url, response);
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except static assets, image optimization and API routes
    // (API routes create their own Supabase client when they need one).
    "/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
