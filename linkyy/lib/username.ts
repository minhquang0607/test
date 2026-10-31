// Keep FORMAT in sync with public.is_valid_username_format() in the
// migration — both are tested against tests/fixtures/username-cases.ts.
// Reserved words and taken names are only checked in the database.

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 24;
const FORMAT = /^[a-z0-9][a-z0-9._]{1,22}[a-z0-9]$/;
const DOUBLE_SEPARATOR = /[._]{2}/;

export type UsernameStatus = "ok" | "invalid" | "reserved" | "taken" | "cooldown" | "banned";

export const USERNAME_MESSAGES: Record<UsernameStatus, string> = {
  ok: "Ngon, username này còn trống ✨",
  invalid: "3–24 ký tự: chữ thường, số, dấu . hoặc _ (không đứng đầu, cuối hay đứng liền nhau)",
  reserved: "Username này không dùng được, chọn cái khác nha",
  taken: "Có người lấy mất rồi 😭 thử thêm số hoặc dấu chấm xem",
  cooldown: "Bạn vừa đổi username gần đây, đợi đủ 30 ngày mới đổi tiếp được nha",
  banned: "Tài khoản đang bị khóa, liên hệ support giúp tụi mình nha",
};

/** What the user typed → what we store. Strips a leading "@" and spaces around. */
export function normalizeUsername(input: string): string {
  return input.trim().replace(/^@+/, "").toLowerCase();
}

export function isValidUsernameFormat(candidate: string): boolean {
  return FORMAT.test(candidate) && !DOUBLE_SEPARATOR.test(candidate);
}

/**
 * Turns a display name into a username suggestion:
 * "Nguyễn Minh Anh" → "nguyen.minh.anh". Returns "" if nothing usable.
 */
export function suggestUsername(name: string): string {
  const ascii = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase();

  let s = ascii
    .replace(/[^a-z0-9._\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, ".")
    .replace(/[._]{2,}/g, ".")
    .replace(/^[._]+|[._]+$/g, "")
    .slice(0, USERNAME_MAX)
    .replace(/[._]+$/g, "");

  if (s.length < USERNAME_MIN) s = "";
  return isValidUsernameFormat(s) ? s : "";
}
