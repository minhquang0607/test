import { describe, expect, it } from "vitest";
import { blockSchema, detectPlatform, normalizeUrl, parseBlocks } from "@/lib/blocks";

describe("normalizeUrl", () => {
  it.each([
    ["tiktok.com/@mai", "https://tiktok.com/@mai"],
    ["  https://www.instagram.com/mai/ ", "https://www.instagram.com/mai/"],
    ["HTTP://Example.com", "http://example.com/"],
    ["shopee.vn:443/abc", "https://shopee.vn/abc"],
    ["//zalo.me/0900", "https://zalo.me/0900"],
  ])("%j → %j", (input, expected) => expect(normalizeUrl(input)).toBe(expected));

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "javascript://example.com/%0aalert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox",
    "mailto:a@b.com",
    "",
    "   ",
    "localhost",
    "http://localhost:3000",
    "https://user:pass@example.com",
    "not a url",
    `https://example.com/${"a".repeat(2100)}`,
  ])("rejects %j", (input) => expect(normalizeUrl(input)).toBeNull());
});

describe("blockSchema", () => {
  it("normalizes link URLs and trims titles", () => {
    const block = blockSchema.parse({ id: "abc123", type: "link", title: "  TikTok ", url: "tiktok.com/@x" });
    expect(block).toEqual({ id: "abc123", type: "link", title: "TikTok", url: "https://tiktok.com/@x", enabled: true });
  });

  it("rejects dangerous URLs", () => {
    expect(blockSchema.safeParse({ id: "a", type: "link", title: "x", url: "javascript:alert(1)" }).success).toBe(false);
  });
});

describe("parseBlocks", () => {
  it("keeps valid blocks and drops junk written straight to the database", () => {
    const blocks = parseBlocks([
      { id: "1", type: "link", title: "ok", url: "https://a.vn" },
      { id: "2", type: "link", title: "xss", url: "javascript:alert(1)" },
      { id: "3", type: "evil", html: "<script>" },
      "string",
      null,
      { id: "4", type: "text", text: "hello" },
    ]);
    expect(blocks.map((b) => b.id)).toEqual(["1", "4"]);
  });

  it("returns [] for non-arrays", () => {
    expect(parseBlocks({ not: "an array" })).toEqual([]);
    expect(parseBlocks(null)).toEqual([]);
  });
});

describe("detectPlatform", () => {
  it.each([
    ["https://www.tiktok.com/@a", "tiktok"],
    ["https://vt.tiktok.com/xyz", "tiktok"],
    ["https://youtu.be/x", "youtube"],
    ["https://open.spotify.com/x", "spotify"],
    ["https://shopee.vn/x", "shopee"],
    ["https://nottiktok.com/x", "web"],
    ["https://tiktok.com.evil.vn/x", "web"],
  ])("%s → %s", (url, platform) => expect(detectPlatform(url)).toBe(platform));
});
