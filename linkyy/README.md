# ✦ Linkyy

Trang bio cho creator Gen Z VN: link, shop đồ digital, nhận tip qua VietQR.
Spec đầy đủ ở [`../docs/LINKYY.md`](../docs/LINKYY.md) và [`../docs/LINKYY_SIGNATURE.md`](../docs/LINKYY_SIGNATURE.md).

## Trạng thái: MVP tuần 1 ✅

| Có rồi | Ghi chú |
|--------|---------|
| Landing + claim username | Check username còn trống theo thời gian thực, demo phone có 8 theme |
| Đăng nhập Google + magic link | Supabase Auth (PKCE), chống open redirect |
| Onboarding 5 bước | Username → hồ sơ → theme → link → publish, có live preview |
| Trang public `/@username` | Cache theo tag, render lại khi creator đổi |
| Dashboard shell | Tổng quan + checklist, Cài đặt (hồ sơ, đổi username, ẩn/hiện trang) |
| DB schema + RLS | `profiles`, `pages`, luật username, RPC, quyền theo cột |
| Test | 75 unit test + 17 test SQL chạy trên Postgres thật |

**Tuần 2**: editor kéo thả, thêm block, upload avatar, OG image, snapshot tĩnh, analytics view/click.

## Chạy local

```bash
cd linkyy
npm install
cp .env.example .env.local   # điền Supabase URL + publishable key
npm run dev                   # http://localhost:3000
```

### Setup Supabase (một lần)

1. Tạo project trên [supabase.com](https://supabase.com).
2. **Chạy migration**: mở SQL Editor, dán nội dung `supabase/migrations/20261031000000_init.sql` rồi Run.
   Hoặc dùng CLI: `npx supabase link --project-ref <ref>` rồi `npx supabase db push`.
3. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000` (lúc deploy thì đổi thành domain thật)
   - Redirect URLs: `http://localhost:3000/auth/callback`, `https://<domain>/auth/callback`
4. **Authentication → Providers → Google**: bật lên, dán Client ID/Secret lấy từ Google Cloud Console.
   Ở Google, thêm Authorized redirect URI là `https://<project-ref>.supabase.co/auth/v1/callback`.
5. **(Nên làm) Email template**: để magic link mở được ở trình duyệt khác với trình duyệt đã bấm gửi (vd mở bằng app Gmail), sửa link trong template **Magic Link** và **Confirm signup** thành:
   ```
   {{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email
   ```
   Không sửa thì flow mặc định (PKCE) vẫn chạy, nhưng chỉ khi mở link trong cùng trình duyệt đã gửi.

## Scripts

| Lệnh | Việc |
|------|------|
| `npm run dev` | Dev server |
| `npm run build` | Build production |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` + `tsc` |
| `npm test` | Vitest. Test DB chỉ chạy khi có `TEST_DATABASE_URL` |

Chạy test DB ở local (cần Postgres 15+ và một superuser; mỗi lần chạy tạo một DB tạm rồi xóa):

```bash
TEST_DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres npm test
```

## Kiến trúc

```
proxy.ts                    Next 16 "proxy" (thay middleware): rewrite /@user → /u/user, refresh session, redirect
app/
  page.tsx                  Landing
  login/                    Đăng nhập (Google + magic link)
  auth/callback|signout     Route handler cho Supabase Auth
  onboarding/               Wizard 5 bước
  dashboard/                Shell + tổng quan + cài đặt
  u/[username]/             Trang public (cache theo tag)
  api/username/check        Kiểm tra username còn trống
  actions/creator.ts        Server Actions (validate bằng Zod, re-check session)
lib/
  auth.ts                   Data Access Layer: getSessionUser, requireCreator…
  public-page.ts            Đọc trang public: 'use cache' + cacheTag
  blocks.ts                 Schema block + chuẩn hóa URL (chặn javascript:)
  username.ts, themes.ts    Luật username, 8 theme preset
  supabase/                 Client cho server, browser và proxy, kèm DB types
supabase/migrations/        SQL: bảng, RLS, column grants, RPC
tests/                      unit + db (SQL thật)
```

### Mô hình bảo mật
- **RLS** bật trên mọi bảng; anon **không** đọc trực tiếp được bảng nào.
- **Quyền theo cột**: user chỉ được tự sửa `display_name`, `bio`, `avatar_url`, `theme`, `draft_blocks`. Còn `username`, publish và onboarding phải đi qua RPC `SECURITY DEFINER`, có validate. `plan`, `role` thì user không đụng tới được.
- Trang public chỉ đọc qua `get_public_page()`, chỉ trả về field public.
- Block lưu dạng JSONB nên lúc render luôn parse lại bằng Zod. Block hỏng hoặc URL `javascript:` bị bỏ qua.
- Proxy chỉ redirect kiểu "lạc quan"; kiểm tra quyền thật nằm ở DAL và trong DB.

### Lệch so với spec (cố ý)
- **Chưa dùng Drizzle**: tuần 1 dùng `supabase-js` + RLS, vì khi đi qua PostgREST thì RLS tự áp theo JWT của user. Drizzle sẽ thêm khi cần query phức tạp chạy bằng service role (job, admin).
- **Cache Components** của Next 16 bật mặc định: phần đọc session stream sau `<Suspense>`, trang public cache theo tag `page:<username>`, đổi gì thì `updateTag`.
