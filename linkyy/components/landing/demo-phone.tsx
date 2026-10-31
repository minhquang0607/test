"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PhoneFrame, PublicPage } from "@/components/public-page";
import type { Block } from "@/lib/blocks";
import { THEME_PRESET_IDS, THEMES, type ThemePresetId } from "@/lib/themes";
import { cn } from "@/lib/utils";

const DEMO_BLOCKS: Block[] = [
  { id: "1", type: "link", title: "Preset Lightroom “Sài Gòn Mưa” 🌧️", url: "https://example.com/preset", enabled: true },
  { id: "2", type: "link", title: "Kênh TikTok chính chủ", url: "https://www.tiktok.com/@linkyy.demo", enabled: true },
  { id: "3", type: "link", title: "Playlist học bài chill", url: "https://open.spotify.com/", enabled: true },
  { id: "4", type: "text", text: "Nhận edit ảnh & commission tháng 11 ✍️", enabled: true },
  { id: "5", type: "link", title: "Ib mình qua Zalo", url: "https://zalo.me/", enabled: true },
];

export function DemoPhone() {
  const [preset, setPreset] = useState<ThemePresetId>("y2k");

  return (
    <div className="flex flex-col items-center gap-5">
      <PhoneFrame className="rotate-[2deg]">
        <AnimatePresence mode="wait">
          <motion.div
            key={preset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            <PublicPage
              compact
              profile={{ username: "mai.edit", display_name: "Mai Edit Ảnh", bio: "Designer 2k5 · bán preset & template ✦ Sài Gòn", avatar_url: null, is_verified: true }}
              theme={THEMES[preset]}
              blocks={DEMO_BLOCKS}
            />
          </motion.div>
        </AnimatePresence>
      </PhoneFrame>
      <div className="flex max-w-[340px] flex-wrap justify-center gap-2" role="radiogroup" aria-label="Thử theme">
        {THEME_PRESET_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={preset === id}
            onClick={() => setPreset(id)}
            className={cn(
              "rounded-full border-2 px-3 py-1 text-xs font-semibold transition-all",
              preset === id ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white hover:border-ink",
            )}
          >
            {THEMES[id].emoji} {THEMES[id].name}
          </button>
        ))}
      </div>
    </div>
  );
}
