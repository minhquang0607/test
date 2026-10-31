// Shared by the TS unit tests and the SQL tests so lib/username.ts and the
// database CHECK constraint can never drift apart.

export const VALID_USERNAMES = [
  "abc",
  "minhanh",
  "minh.anh",
  "minh_anh",
  "m1nh",
  "123",
  "a.b_c",
  "abcdefghijklmnopqrstuvwx", // 24 chars
];

export const INVALID_USERNAMES = [
  "",
  "ab", // too short
  "abcdefghijklmnopqrstuvwxy", // 25 chars
  ".minh",
  "minh.",
  "_minh",
  "minh_",
  "minh..anh",
  "minh._anh",
  "minh anh",
  "minh-anh",
  "MinhAnh", // must already be lowercase at this level
  "minhánh",
  "minh@anh",
];
