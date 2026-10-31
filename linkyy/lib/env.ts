// Read lazily so `next build` works without secrets; anything that actually
// talks to Supabase fails loudly with a helpful message instead.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing env ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

export function supabaseEnv() {
  return {
    url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    key: required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  };
}

/** Canonical origin used for auth redirects. Never derived from request headers. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

/** Host shown in the UI, e.g. "linkyy.vn". */
export function siteHost(): string {
  return new URL(siteUrl()).host;
}
