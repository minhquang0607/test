import { z } from "zod";

export type ThemeFont = "sans" | "display" | "serif" | "mono" | "round";

export type Theme = {
  id: ThemePresetId;
  name: string;
  emoji: string;
  vibe: string;
  dark: boolean;
  /** Any CSS `background` value. */
  background: string;
  text: string;
  muted: string;
  accent: string;
  font: ThemeFont;
  radius: string;
  button: {
    background: string;
    text: string;
    border: string;
    shadow: string;
    blur?: boolean;
  };
};

export const THEME_PRESET_IDS = ["clean", "y2k", "academia", "cyber", "kawaii", "matcha", "sunset", "brutal"] as const;
export type ThemePresetId = (typeof THEME_PRESET_IDS)[number];
export const DEFAULT_THEME: ThemePresetId = "clean";

export const THEMES: Record<ThemePresetId, Theme> = {
  clean: {
    id: "clean",
    name: "Clean Girl",
    emoji: "🤍",
    vibe: "Kem sữa, nhẹ nhàng, sạch sẽ",
    dark: false,
    background: "linear-gradient(180deg, #fdf8f3 0%, #f4e9df 100%)",
    text: "#3b2f2a",
    muted: "#8a776c",
    accent: "#c58b6b",
    font: "sans",
    radius: "999px",
    button: { background: "#ffffff", text: "#3b2f2a", border: "1px solid #ecdccf", shadow: "0 6px 18px -10px rgba(91,60,40,.35)" },
  },
  y2k: {
    id: "y2k",
    name: "Y2K Chrome",
    emoji: "💿",
    vibe: "Hồng tím lấp lánh, kính mờ",
    dark: false,
    background: "linear-gradient(135deg, #ff9de2 0%, #b7a6ff 45%, #a6e3ff 100%)",
    text: "#2b0a3d",
    muted: "#5b3a73",
    accent: "#ff3fa4",
    font: "round",
    radius: "18px",
    button: {
      background: "rgba(255,255,255,.5)",
      text: "#2b0a3d",
      border: "1px solid rgba(255,255,255,.85)",
      shadow: "0 8px 24px -12px rgba(80,0,120,.45), inset 0 1px 0 rgba(255,255,255,.9)",
      blur: true,
    },
  },
  academia: {
    id: "academia",
    name: "Dark Academia",
    emoji: "📜",
    vibe: "Thư viện cũ, nâu trầm, serif",
    dark: true,
    background: "radial-gradient(120% 80% at 50% 0%, #3d322b 0%, #221c18 70%)",
    text: "#efe4d2",
    muted: "#b9a88f",
    accent: "#c9a66b",
    font: "serif",
    radius: "6px",
    button: { background: "rgba(255,240,215,.04)", text: "#efe4d2", border: "1px solid #6b5848", shadow: "none" },
  },
  cyber: {
    id: "cyber",
    name: "Cyber Neon",
    emoji: "🦾",
    vibe: "Đen tuyền, neon xanh hồng",
    dark: true,
    background:
      "radial-gradient(60% 50% at 20% 0%, rgba(255,43,214,.25) 0%, transparent 60%), radial-gradient(60% 50% at 80% 100%, rgba(0,255,200,.2) 0%, transparent 60%), #07070d",
    text: "#e6fffb",
    muted: "#8bd8cc",
    accent: "#00ffc8",
    font: "mono",
    radius: "4px",
    button: {
      background: "rgba(0,255,200,.06)",
      text: "#e6fffb",
      border: "1px solid #00ffc8",
      shadow: "0 0 18px -6px rgba(0,255,200,.8)",
    },
  },
  kawaii: {
    id: "kawaii",
    name: "Kawaii",
    emoji: "🎀",
    vibe: "Hồng pastel, bo tròn, dễ thương",
    dark: false,
    background: "radial-gradient(#ffd3e6 1.5px, transparent 1.5px) 0 0 / 22px 22px, linear-gradient(180deg, #fff0f6 0%, #eef5ff 100%)",
    text: "#5b3a52",
    muted: "#9a6f8c",
    accent: "#ff7eb6",
    font: "round",
    radius: "24px",
    button: { background: "#ffffff", text: "#5b3a52", border: "2px solid #ffc2da", shadow: "0 4px 0 #ffc2da" },
  },
  matcha: {
    id: "matcha",
    name: "Matcha Latte",
    emoji: "🍵",
    vibe: "Xanh trà, chill, tối giản",
    dark: false,
    background: "linear-gradient(180deg, #f1f5ea 0%, #e3ecd6 100%)",
    text: "#2f3b26",
    muted: "#6b7a5c",
    accent: "#6b8f47",
    font: "sans",
    radius: "14px",
    button: { background: "#6b8f47", text: "#f7fbf1", border: "1px solid #5d7d3d", shadow: "0 6px 16px -10px rgba(47,59,38,.6)" },
  },
  sunset: {
    id: "sunset",
    name: "Hoàng Hôn",
    emoji: "🌅",
    vibe: "Cam đào, ấm áp, mùa hè",
    dark: false,
    background: "linear-gradient(165deg, #ff7e5f 0%, #feb47b 55%, #ffe2a8 100%)",
    text: "#3a1607",
    muted: "#6e3416",
    accent: "#e8452c",
    font: "display",
    radius: "16px",
    button: { background: "rgba(255,255,255,.78)", text: "#3a1607", border: "1px solid rgba(255,255,255,.9)", shadow: "0 10px 24px -14px rgba(120,30,0,.6)" },
  },
  brutal: {
    id: "brutal",
    name: "Neo Brutal",
    emoji: "🧱",
    vibe: "Viền đen dày, màu gắt, chất chơi",
    dark: false,
    background: "#fff6d6",
    text: "#111111",
    muted: "#4a4a4a",
    accent: "#ff5c39",
    font: "display",
    radius: "0px",
    button: { background: "#ffde59", text: "#111111", border: "2.5px solid #111111", shadow: "4px 4px 0 #111111" },
  },
};

export const themeSettingsSchema = z.object({
  preset: z.enum(THEME_PRESET_IDS),
});
export type ThemeSettings = z.infer<typeof themeSettingsSchema>;

/** Stored JSON → theme; unknown or broken values fall back to the default. */
export function resolveTheme(raw: unknown): Theme {
  const parsed = themeSettingsSchema.safeParse(raw);
  return THEMES[parsed.success ? parsed.data.preset : DEFAULT_THEME];
}

export const FONT_VARS: Record<ThemeFont, string> = {
  sans: "var(--font-be-vietnam)",
  display: "var(--font-bricolage)",
  serif: "var(--font-playfair)",
  mono: "var(--font-space-mono)",
  round: "var(--font-baloo)",
};
