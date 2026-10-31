import { describe, expect, it } from "vitest";
import { isValidUsernameFormat, normalizeUsername, suggestUsername } from "@/lib/username";
import { INVALID_USERNAMES, VALID_USERNAMES } from "../fixtures/username-cases";

describe("username format", () => {
  it.each(VALID_USERNAMES)("accepts %j", (u) => expect(isValidUsernameFormat(u)).toBe(true));
  it.each(INVALID_USERNAMES)("rejects %j", (u) => expect(isValidUsernameFormat(u)).toBe(false));
});

describe("normalizeUsername", () => {
  it("strips @, trims and lowercases", () => {
    expect(normalizeUsername("  @@Minh.Anh ")).toBe("minh.anh");
  });
  it("does not silently drop other characters", () => {
    expect(normalizeUsername("minh anh")).toBe("minh anh");
  });
});

describe("suggestUsername", () => {
  it.each([
    ["Nguyễn Minh Anh", "nguyen.minh.anh"],
    ["Đặng Thị Đào", "dang.thi.dao"],
    ["  Mai -- Edit  ", "mai.edit"],
    ["Bé Bơ 🧈", "be.bo"],
    ["__x__", ""],
    ["Trần Thị Thanh Thảo Nguyên Phương", "tran.thi.thanh.thao.nguy"],
  ])("%j → %j", (name, expected) => {
    const s = suggestUsername(name);
    expect(s).toBe(expected);
    if (s) expect(isValidUsernameFormat(s)).toBe(true);
  });
});
