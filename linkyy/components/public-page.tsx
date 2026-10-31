/* eslint-disable @next/next/no-img-element -- avatars can come from any https host the creator sets; next/image would need an allow-list. */
import type { CSSProperties } from "react";
import { detectPlatform, type Block, type Platform } from "@/lib/blocks";
import { FONT_VARS, type Theme } from "@/lib/themes";
import { cn } from "@/lib/utils";

// Pure component (no hooks, no server-only imports): used by the real public
// page, the onboarding live preview and the landing page demo.

export type PublicProfile = {
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  is_verified?: boolean;
};

const PLATFORM_EMOJI: Record<Platform, string> = {
  tiktok: "🎵",
  instagram: "📸",
  youtube: "▶️",
  facebook: "📘",
  threads: "🧵",
  x: "𝕏",
  spotify: "🎧",
  discord: "🎮",
  zalo: "💬",
  shopee: "🛍️",
  github: "🐙",
  web: "🔗",
};

function initials(name: string, username: string) {
  const source = name.trim() || username;
  const parts = source.split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

export function PublicPage({
  profile,
  theme,
  blocks,
  showWatermark = true,
  compact = false,
  homeHref = "/",
}: {
  profile: PublicProfile;
  theme: Theme;
  blocks: Block[];
  showWatermark?: boolean;
  /** Fill the parent (phone mockups) instead of the viewport. */
  compact?: boolean;
  homeHref?: string;
}) {
  const visible = blocks.filter((b) => b.enabled);
  const style = {
    background: theme.background,
    color: theme.text,
    fontFamily: FONT_VARS[theme.font],
    "--lk-muted": theme.muted,
    "--lk-accent": theme.accent,
  } as CSSProperties;

  const buttonStyle: CSSProperties = {
    background: theme.button.background,
    color: theme.button.text,
    border: theme.button.border,
    boxShadow: theme.button.shadow,
    borderRadius: theme.radius,
    backdropFilter: theme.button.blur ? "blur(12px)" : undefined,
    WebkitBackdropFilter: theme.button.blur ? "blur(12px)" : undefined,
  };

  return (
    <div className={cn("w-full", compact ? "min-h-full" : "min-h-dvh")} style={style}>
      <main className={cn("mx-auto flex w-full max-w-md flex-col items-center px-5", compact ? "py-8" : "py-12 sm:py-16")}>
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt=""
            referrerPolicy="no-referrer"
            className="size-24 rounded-full object-cover"
            style={{ border: `3px solid ${theme.accent}` }}
          />
        ) : (
          <div
            aria-hidden
            className="grid size-24 place-items-center rounded-full text-2xl font-bold"
            style={{ background: theme.accent, color: theme.dark ? "#111" : "#fff" }}
          >
            {initials(profile.display_name, profile.username)}
          </div>
        )}

        <h1 className="mt-4 flex items-center gap-1.5 text-center text-2xl leading-tight font-bold">
          {profile.display_name || `@${profile.username}`}
          {profile.is_verified ? (
            <span title="Đã xác minh" className="text-base" style={{ color: theme.accent }}>
              ✔︎
            </span>
          ) : null}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--lk-muted)" }}>
          @{profile.username}
        </p>
        {profile.bio ? (
          <p className="mt-3 max-w-xs text-center text-[15px] leading-relaxed whitespace-pre-line">{profile.bio}</p>
        ) : null}

        <ul className="mt-8 flex w-full flex-col gap-3">
          {visible.map((block) =>
            block.type === "link" ? (
              <li key={block.id}>
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow ugc"
                  className="relative flex min-h-14 w-full items-center justify-center px-12 py-3 text-center text-[15px] font-semibold transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
                  style={buttonStyle}
                >
                  <span aria-hidden className="absolute left-4 text-lg">
                    {PLATFORM_EMOJI[detectPlatform(block.url)]}
                  </span>
                  <span className="line-clamp-2 break-words">{block.title}</span>
                </a>
              </li>
            ) : (
              <li key={block.id} className="px-2 text-center text-[15px] leading-relaxed whitespace-pre-line" style={{ color: "var(--lk-muted)" }}>
                {block.text}
              </li>
            ),
          )}
          {visible.length === 0 ? (
            <li className="text-center text-sm" style={{ color: "var(--lk-muted)" }}>
              Chưa có link nào 👀
            </li>
          ) : null}
        </ul>

        {showWatermark ? (
          <a
            href={homeHref}
            className="mt-12 rounded-full px-3 py-1.5 text-xs font-semibold opacity-80 transition-opacity hover:opacity-100"
            style={{ background: theme.dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)" }}
          >
            made with Linkyy ✨
          </a>
        ) : null}
      </main>
    </div>
  );
}

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-[300px] rounded-[44px] border-[3px] border-ink bg-ink p-2.5 shadow-pop-lg", className)}>
      <div className="absolute top-4 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" />
      <div className="h-[600px] overflow-y-auto rounded-[34px] bg-white [scrollbar-width:none]">{children}</div>
    </div>
  );
}
