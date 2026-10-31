import { z } from "zod";

// Week 1 ships two block types; the editor (week 2) adds more to the union.
// Blocks are stored as JSONB and can be written by the owner directly through
// the Supabase API, so the public renderer always re-parses them with
// parseBlocks() and silently drops anything invalid.

export const MAX_BLOCKS = 100;
export const LINK_TITLE_MAX = 80;
export const TEXT_MAX = 500;
export const MAX_ONBOARDING_LINKS = 5;

/**
 * Accepts what people actually type ("tiktok.com/@me", " https://x.com ")
 * and returns a normalized http(s) URL, or null. Blocks javascript:, data:
 * and friends, which would otherwise be a stored-XSS hole in <a href>.
 */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw || raw.length > 2048) return null;

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  // "localhost:3000" or "x.com:443" look like a scheme; only trust real ones.
  const candidate = hasScheme && !/^[a-z0-9.-]+:\d+/i.test(raw) ? raw : `https://${raw.replace(/^\/+/, "")}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!url.hostname.includes(".") || url.hostname.startsWith(".") || url.hostname.endsWith(".")) return null;
  if (url.username || url.password) return null;
  return url.href;
}

const safeUrl = z.string().transform((value, ctx) => {
  const url = normalizeUrl(value);
  if (!url) {
    ctx.addIssue({ code: "custom", message: "Link chưa đúng, thử dạng tiktok.com/@ban nha" });
    return z.NEVER;
  }
  return url;
});

const blockId = z.string().min(1).max(40);

export const linkBlockSchema = z.object({
  id: blockId,
  type: z.literal("link"),
  title: z.string().trim().min(1, "Đặt tên cho link nha").max(LINK_TITLE_MAX),
  url: safeUrl,
  enabled: z.boolean().default(true),
});

export const textBlockSchema = z.object({
  id: blockId,
  type: z.literal("text"),
  text: z.string().trim().min(1).max(TEXT_MAX),
  enabled: z.boolean().default(true),
});

export const blockSchema = z.discriminatedUnion("type", [linkBlockSchema, textBlockSchema]);

export type LinkBlock = z.output<typeof linkBlockSchema>;
export type TextBlock = z.output<typeof textBlockSchema>;
export type Block = z.output<typeof blockSchema>;

/** Lenient parse for rendering: keeps valid blocks, drops the rest. */
export function parseBlocks(raw: unknown): Block[] {
  if (!Array.isArray(raw)) return [];
  const out: Block[] = [];
  for (const item of raw.slice(0, MAX_BLOCKS)) {
    const parsed = blockSchema.safeParse(item);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}

export function newBlockId(): string {
  return globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

// ---------------------------------------------------------------------------
// Platform detection (icon + default title for links)
// ---------------------------------------------------------------------------

export type Platform =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "facebook"
  | "threads"
  | "x"
  | "spotify"
  | "discord"
  | "zalo"
  | "shopee"
  | "github"
  | "web";

const PLATFORM_HOSTS: [Platform, string[]][] = [
  ["tiktok", ["tiktok.com"]],
  ["instagram", ["instagram.com", "instagr.am"]],
  ["youtube", ["youtube.com", "youtu.be"]],
  ["facebook", ["facebook.com", "fb.com", "fb.me", "m.me"]],
  ["threads", ["threads.net", "threads.com"]],
  ["x", ["x.com", "twitter.com"]],
  ["spotify", ["spotify.com", "spotify.link"]],
  ["discord", ["discord.gg", "discord.com"]],
  ["zalo", ["zalo.me"]],
  ["shopee", ["shopee.vn", "shp.ee"]],
  ["github", ["github.com"]],
];

export const PLATFORM_LABELS: Record<Platform, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  threads: "Threads",
  x: "X",
  spotify: "Spotify",
  discord: "Discord",
  zalo: "Zalo",
  shopee: "Shopee",
  github: "GitHub",
  web: "Website",
};

export function detectPlatform(url: string): Platform {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return "web";
  }
  for (const [platform, hosts] of PLATFORM_HOSTS) {
    if (hosts.some((h) => host === h || host.endsWith(`.${h}`))) return platform;
  }
  return "web";
}
