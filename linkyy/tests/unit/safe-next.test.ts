import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/safe-next";

describe("safeNext", () => {
  it.each([
    ["/dashboard", "/dashboard"],
    ["/onboarding?claim=mai", "/onboarding?claim=mai"],
    ["/a/../dashboard", "/dashboard"],
  ])("allows %j", (input, expected) => expect(safeNext(input)).toBe(expected));

  it.each([
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "javascript:alert(1)",
    "evil.com",
    "/\t/evil.com",
    "",
    null,
    undefined,
  ])("falls back for %j", (input) => expect(safeNext(input as string | null | undefined)).toBe("/dashboard"));

  it("uses the provided fallback", () => {
    expect(safeNext("https://evil.com", "/onboarding")).toBe("/onboarding");
  });
});
