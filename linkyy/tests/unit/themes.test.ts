import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, resolveTheme, THEME_PRESET_IDS, THEMES } from "@/lib/themes";

describe("themes", () => {
  it("has a complete definition for every preset id", () => {
    for (const id of THEME_PRESET_IDS) {
      expect(THEMES[id].id).toBe(id);
      expect(THEMES[id].name.length).toBeGreaterThan(0);
    }
  });

  it("resolves stored settings and falls back on junk", () => {
    expect(resolveTheme({ preset: "cyber" }).id).toBe("cyber");
    expect(resolveTheme({ preset: "nope" }).id).toBe(DEFAULT_THEME);
    expect(resolveTheme("y2k").id).toBe(DEFAULT_THEME);
    expect(resolveTheme(null).id).toBe(DEFAULT_THEME);
  });

  it("matches the database default theme", async () => {
    const { readFileSync } = await import("node:fs");
    const sql = readFileSync("supabase/migrations/20261031000000_init.sql", "utf8");
    expect(sql).toContain(`'{"preset": "${DEFAULT_THEME}"}'::jsonb`);
  });
});
