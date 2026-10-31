import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { INVALID_USERNAMES, VALID_USERNAMES } from "../fixtures/username-cases";

// Runs the real migrations against a throwaway Postgres database.
// Set TEST_DATABASE_URL (a superuser connection) to enable, e.g.
//   TEST_DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
const ADMIN_URL = process.env.TEST_DATABASE_URL;
const ROOT = path.resolve(__dirname, "../..");

describe.skipIf(!ADMIN_URL)("supabase migrations", () => {
  const dbName = `linkyy_test_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  let admin: Client;
  let db: Client;

  beforeAll(async () => {
    admin = new Client({ connectionString: ADMIN_URL });
    await admin.connect();
    await admin.query(`create database ${dbName}`);

    const url = new URL(ADMIN_URL!);
    url.pathname = `/${dbName}`;
    db = new Client({ connectionString: url.toString() });
    await db.connect();

    await db.query(readFileSync(path.join(ROOT, "tests/db/supabase-stub.sql"), "utf8"));
    const dir = path.join(ROOT, "supabase/migrations");
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
      await db.query(readFileSync(path.join(dir, file), "utf8"));
    }
  });

  afterAll(async () => {
    await db?.end();
    if (admin) {
      await admin.query(`drop database if exists ${dbName} with (force)`);
      await admin.end();
    }
  });

  // --- helpers --------------------------------------------------------------

  async function createUser(meta: Record<string, unknown> = {}, email = `${randomUUID()}@test.vn`) {
    const { rows } = await db.query<{ id: string }>(
      "insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id",
      [email, meta],
    );
    return rows[0].id;
  }

  /** Runs `fn` inside a transaction as the given Supabase role (and user). */
  async function as<T>(role: "anon" | "authenticated", uid: string | null, fn: () => Promise<T>): Promise<T> {
    await db.query("begin");
    try {
      await db.query(`set local role ${role}`);
      await db.query("select set_config('request.jwt.claim.sub', $1, true)", [uid ?? ""]);
      const result = await fn();
      await db.query("commit");
      return result;
    } catch (error) {
      await db.query("rollback");
      throw error;
    }
  }

  const asUser = <T>(uid: string, fn: () => Promise<T>) => as("authenticated", uid, fn);
  const asAnon = <T>(fn: () => Promise<T>) => as("anon", null, fn);

  async function rpc<T = unknown>(sql: string, params: unknown[] = []): Promise<T> {
    const { rows } = await db.query(sql, params);
    return Object.values(rows[0] ?? {})[0] as T;
  }

  const claim = (uid: string, username: string) =>
    asUser(uid, () => rpc<string>("select public.claim_username($1)", [username]));

  // --- signup trigger --------------------------------------------------------

  it("creates a profile and an empty page for every new auth user", async () => {
    const uid = await createUser({ full_name: "Minh Anh", avatar_url: "https://lh3.googleusercontent.com/a/x" });

    const { rows } = await db.query("select * from public.profiles where id = $1", [uid]);
    expect(rows[0]).toMatchObject({
      display_name: "Minh Anh",
      avatar_url: "https://lh3.googleusercontent.com/a/x",
      username: null,
      plan: "free",
      role: "creator",
    });

    const page = await db.query("select theme, draft_blocks, published_at from public.pages where user_id = $1", [uid]);
    expect(page.rows[0]).toEqual({ theme: { preset: "clean" }, draft_blocks: [], published_at: null });
  });

  it("falls back to the email prefix and drops non-https avatars", async () => {
    const uid = await createUser({ avatar_url: "http://insecure.example/a.png" }, "tieu.long@test.vn");
    const { rows } = await db.query("select display_name, avatar_url from public.profiles where id = $1", [uid]);
    expect(rows[0]).toEqual({ display_name: "tieu.long", avatar_url: null });
  });

  // --- username rules ---------------------------------------------------------

  it("agrees with the shared username format fixtures", async () => {
    for (const u of VALID_USERNAMES) {
      expect(await rpc("select public.is_valid_username_format($1)", [u]), u).toBe(true);
    }
    for (const u of INVALID_USERNAMES) {
      expect(await rpc("select public.is_valid_username_format($1)", [u]), u).toBe(false);
    }
  });

  it("reports reserved, blocked, taken and ok usernames", async () => {
    const owner = await createUser();
    expect(await claim(owner, "chi.pheo")).toBe("ok");

    const status = (u: string) => asAnon(() => rpc<string>("select public.username_status($1)", [u]));
    expect(await status("admin")).toBe("reserved");
    expect(await status("dashboard")).toBe("reserved");
    expect(await status("linkyy.support")).toBe("reserved"); // substring
    expect(await status("dm.hoang")).toBe("reserved"); // word segment
    expect(await status("salon")).toBe("ok"); // "lon" is word-only
    expect(await status("cacao")).toBe("ok"); // "cac" is word-only
    expect(await status("chi.pheo")).toBe("taken");
    expect(await status("  CHI.PHEO ")).toBe("taken"); // normalized
    expect(await status("a")).toBe("invalid");
  });

  it("lets a user claim, keep and change a username before onboarding", async () => {
    const uid = await createUser();
    expect(await claim(uid, "Thi.No")).toBe("ok");
    expect(await claim(uid, "thi.no")).toBe("ok"); // already mine
    expect(await claim(uid, "thi.no.2")).toBe("ok"); // free change pre-onboarding
    const { rows } = await db.query("select username from public.profiles where id = $1", [uid]);
    expect(rows[0].username).toBe("thi.no.2");
  });

  it("refuses usernames owned by someone else", async () => {
    const a = await createUser();
    const b = await createUser();
    expect(await claim(a, "lao.hac")).toBe("ok");
    expect(await claim(b, "lao.hac")).toBe("taken");
    expect(await claim(b, "admin")).toBe("reserved");
    expect(await claim(b, "no")).toBe("invalid");
  });

  it("enforces a 30-day cooldown on changes after onboarding", async () => {
    const uid = await createUser();
    expect(await claim(uid, "ba.kien")).toBe("ok");
    expect(await asUser(uid, () => rpc("select public.complete_onboarding()"))).toBe(true);

    expect(await claim(uid, "ba.kien.new")).toBe("ok"); // first change after onboarding
    expect(await claim(uid, "ba.kien.again")).toBe("cooldown");

    await db.query("update public.profiles set username_changed_at = now() - interval '31 days' where id = $1", [uid]);
    expect(await claim(uid, "ba.kien.again")).toBe("ok");
  });

  it("blocks banned users from claiming", async () => {
    const uid = await createUser();
    await db.query("update public.profiles set is_banned = true where id = $1", [uid]);
    expect(await claim(uid, "bi.khoa")).toBe("banned");
  });

  it("requires a session to claim", async () => {
    await expect(asAnon(() => rpc("select public.claim_username('anon.user')"))).rejects.toThrow(/permission denied/);
  });

  // --- RLS & column privileges -------------------------------------------------

  it("only lets owners read their own profile", async () => {
    const a = await createUser();
    const b = await createUser();
    const rows = await asUser(a, async () => (await db.query("select id from public.profiles")).rows);
    expect(rows).toEqual([{ id: a }]);
    expect(rows).not.toContainEqual({ id: b });
  });

  it("denies anon any direct table access", async () => {
    await expect(asAnon(() => db.query("select * from public.profiles"))).rejects.toThrow(/permission denied/);
    await expect(asAnon(() => db.query("select * from public.pages"))).rejects.toThrow(/permission denied/);
    await expect(asAnon(() => db.query("select * from public.reserved_usernames"))).rejects.toThrow(/permission denied/);
  });

  it("lets owners edit safe columns only", async () => {
    const uid = await createUser();
    await asUser(uid, () => db.query("update public.profiles set display_name = 'Mới', bio = 'hi' where id = $1", [uid]));
    const { rows } = await db.query("select display_name, bio from public.profiles where id = $1", [uid]);
    expect(rows[0]).toEqual({ display_name: "Mới", bio: "hi" });

    for (const column of ["plan = 'pro'", "role = 'admin'", "is_verified = true", "username = 'hack'", "onboarded_at = now()"]) {
      await expect(
        asUser(uid, () => db.query(`update public.profiles set ${column} where id = $1`, [uid])),
        column,
      ).rejects.toThrow(/permission denied/);
    }
    await expect(
      asUser(uid, () => db.query("update public.pages set published_at = now() where user_id = $1", [uid])),
    ).rejects.toThrow(/permission denied/);
  });

  it("silently ignores updates to other people's rows", async () => {
    const a = await createUser();
    const b = await createUser({ full_name: "Nạn Nhân" });
    const result = await asUser(a, () => db.query("update public.profiles set display_name = 'pwned' where id = $1", [b]));
    expect(result.rowCount).toBe(0);
    const { rows } = await db.query("select display_name from public.profiles where id = $1", [b]);
    expect(rows[0].display_name).toBe("Nạn Nhân");
  });

  it("enforces length and shape constraints", async () => {
    const uid = await createUser();
    await expect(
      asUser(uid, () => db.query("update public.profiles set bio = repeat('a', 161) where id = $1", [uid])),
    ).rejects.toThrow(/profiles_bio_len/);
    await expect(
      asUser(uid, () => db.query("update public.profiles set avatar_url = 'javascript:alert(1)' where id = $1", [uid])),
    ).rejects.toThrow(/profiles_avatar_url_https/);
    await expect(
      asUser(uid, () => db.query(`update public.pages set draft_blocks = '{"a":1}' where user_id = $1`, [uid])),
    ).rejects.toThrow(/pages_draft_blocks_array/);
  });

  // --- publishing --------------------------------------------------------------

  it("publishes the draft and exposes it only through get_public_page", async () => {
    const uid = await createUser({ full_name: "Xuân Tóc Đỏ" });
    expect(await claim(uid, "xuan.toc.do")).toBe("ok");

    const blocks = [{ id: "1", type: "link", title: "TikTok", url: "https://tiktok.com/@xtd", enabled: true }];
    await asUser(uid, () =>
      db.query(`update public.pages set draft_blocks = $1, theme = '{"preset":"y2k"}' where user_id = $2`, [
        JSON.stringify(blocks),
        uid,
      ]),
    );

    const publicPage = () => asAnon(() => rpc<Record<string, unknown> | null>("select public.get_public_page($1)", ["Xuan.Toc.Do"]));
    expect(await publicPage()).toBeNull(); // not published yet

    await asUser(uid, () => rpc("select public.publish_page()"));
    expect(await publicPage()).toMatchObject({
      username: "xuan.toc.do",
      display_name: "Xuân Tóc Đỏ",
      plan: "free",
      theme: { preset: "y2k" },
      blocks,
    });

    // Editing the draft does not leak to the live page until re-published.
    await asUser(uid, () => db.query(`update public.pages set draft_blocks = '[]', theme = '{"preset":"cyber"}' where user_id = $1`, [uid]));
    expect(await publicPage()).toMatchObject({ blocks, theme: { preset: "y2k" } });

    await asUser(uid, () => rpc("select public.unpublish_page()"));
    expect(await publicPage()).toBeNull();
  });

  it("hides banned creators and reports expired Pro as free", async () => {
    const uid = await createUser();
    expect(await claim(uid, "het.han")).toBe("ok");
    await asUser(uid, () => rpc("select public.publish_page()"));

    await db.query("update public.profiles set plan = 'pro', plan_expires_at = now() - interval '1 day' where id = $1", [uid]);
    expect(await asAnon(() => rpc("select public.get_public_page('het.han')"))).toMatchObject({ plan: "free" });

    await db.query("update public.profiles set is_banned = true where id = $1", [uid]);
    expect(await asAnon(() => rpc("select public.get_public_page('het.han')"))).toBeNull();
  });

  it("refuses to publish or finish onboarding without a username", async () => {
    const uid = await createUser();
    await expect(asUser(uid, () => rpc("select public.publish_page()"))).rejects.toThrow(/claim a username first/);
    expect(await asUser(uid, () => rpc("select public.complete_onboarding()"))).toBe(false);
  });
});
