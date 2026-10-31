# ✨ Linkyy: Product Spec & Plan

> "1 link để flex hết, bán luôn, nhận tip luôn."

Tài liệu này mô tả sản phẩm, kế hoạch triển khai và **toàn bộ chức năng frontend và backend** của Linkyy.
Ký hiệu độ ưu tiên dùng xuyên suốt:
- **P0**: bắt buộc có trong MVP
- **P1**: làm trong giai đoạn beta và launch
- **P2**: để sau khi đã có user

---

## 1. Mô tả sản phẩm

### 1.1 Vấn đề
Creator Gen Z ở VN hiện đang bán preset, template, ebook hay nhận donate theo kiểu thủ công:
1. Để link Linktree hoặc Facebook ở bio. Mấy công cụ này **không hỗ trợ thanh toán nội địa**.
2. Khách inbox hỏi giá. Creator gửi số tài khoản, ngồi check sao kê, rồi gửi file bằng tay qua Drive.
3. Kết quả: rep chậm thì mất khách, 2 giờ sáng vẫn phải trả lời inbox, và không có số liệu gì để biết bán chạy hay không.

### 1.2 Giải pháp
Linkyy là **trang bio đẹp, bán đồ digital và nhận tip, thanh toán VietQR có xác nhận tự động**:
- Khách bấm link ở bio, chọn sản phẩm, quét QR hoặc mở thẳng app ngân hàng, rồi nhận file qua email **trong vài giây**. Khách không cần tạo tài khoản.
- Creator không phải trả lời inbox, không phải check sao kê, không phải gửi file. Ngủ dậy là thấy đơn 💸

### 1.3 Người dùng
| Vai trò | Mô tả | Cần gì |
|---------|-------|--------|
| **Creator** | 16–28 tuổi: TikToker, designer, artist, streamer, người bán template Notion | Trang đẹp, setup nhanh, tiền về liền, có số liệu |
| **Buyer / Fan** | Follower lướt TikTok/IG, chủ yếu dùng điện thoại, mở link bằng trình duyệt trong app | Mua thật nhanh (dưới 30 giây), không phải đăng ký |
| **Admin** | Team Linkyy | Kiểm duyệt nội dung, hỗ trợ user, theo dõi giao dịch |

### 1.4 Điểm khác biệt (USP)
- **VietQR native**: xác nhận thanh toán tự động, có deeplink mở app ngân hàng trên điện thoại.
- **Theme đúng gu Gen Z**: y2k, clean girl, dark academia, cyber, kawaii, bento grid, chuyển động mượt.
- **Tiếng Việt 100%**, giá bằng VND, gói trả phí rẻ hơn một ly trà sữa/tuần.

### 1.5 Đối thủ
Linktree, Beacons, Stan Store, Ko-fi, cùng mấy nền tảng donate trong nước. Điểm yếu chung của đối thủ quốc tế là không có thanh toán VN và không giao file tự động bằng VND.

### 1.6 Mô hình thanh toán ⚠️ (quan trọng)
Nếu Linkyy **giữ tiền hộ** creator (thu tiền vào tài khoản Linkyy rồi chi trả lại), việc đó có thể bị coi là **dịch vụ trung gian thanh toán, cần giấy phép của NHNN**. Vì vậy:

| Mode | Cách chạy | Khi nào |
|------|-----------|---------|
| **A. Direct (MVP)** | Creator tự kết nối tài khoản **payOS** của họ. Tiền đi **thẳng vào tài khoản ngân hàng của creator**, Linkyy chỉ nhận webhook để giao file | **P0**, an toàn pháp lý hơn |
| **B. Linkyy Pay** | Linkyy thu hộ, giữ số dư, rồi chi trả (payout) | **P2**, chỉ làm khi đã có tư vấn luật hoặc hợp tác với đơn vị trung gian có giấy phép |

> Việc cần làm trước khi launch: hỏi luật sư hoặc kế toán về (1) trung gian thanh toán, (2) đăng ký website/sàn TMĐT với Bộ Công Thương, (3) nghĩa vụ thuế của nền tảng TMĐT và của người bán cá nhân, (4) bảo vệ dữ liệu cá nhân (Nghị định 13/2023 và Luật Bảo vệ dữ liệu cá nhân).

### 1.7 Gói giá (cập nhật theo Mode A)
| Gói | Giá | Quyền lợi |
|-----|-----|-----------|
| **Free** | 0đ | 1 trang, 3 sản phẩm, tối đa 20 đơn/tháng, analytics 7 ngày, có watermark "made with Linkyy" |
| **Pro** | 49k/tháng hoặc 490k/năm | Không giới hạn sản phẩm và đơn, mã giảm giá, analytics đầy đủ, custom domain, bỏ watermark, Meta/TikTok Pixel, email capture |
| **Theme Store** (P2) | 19k–99k/theme | Creator thiết kế theme để bán, Linkyy ăn 30% |
| **Linkyy Pay** (P2) | Phí 5%/giao dịch | Dành cho creator không muốn tự setup payOS (cần có pháp lý trước) |

### 1.8 KPI
- **Activation**: tỉ lệ đăng ký xong rồi publish trang trong 24 giờ, mục tiêu 60% trở lên
- **First sale**: tỉ lệ creator có đơn đầu tiên trong 14 ngày
- **Checkout conversion**: số đơn đã thanh toán chia cho số lần bấm "Mua"
- **Pro conversion**: 5–10% tổng số creator active
- **GMV/tháng**, **MRR**, **churn**

---

## 2. Kế hoạch triển khai

### Phase 0: Validate (1 tuần)
- [ ] Phỏng vấn 15–20 creator: họ đang bán gì, bán thế nào, đau ở đâu
- [ ] Làm landing page waitlist (Next.js + form lưu Supabase), chạy vài video TikTok để test nhu cầu
- [ ] Đăng ký payOS, test sandbox; mua domain `linkyy.vn` (hoặc `.app`)
- [ ] Hỏi pháp lý (mục 1.6)
- [ ] Vẽ design system trên Figma: màu, font, component, 8 theme
- **Đạt khi**: có 100 email waitlist trở lên và 10 creator đồng ý dùng beta

### Phase 1: MVP (tuần 1–4)
| Tuần | Việc | Bàn giao |
|------|------|----------|
| **1** | Setup repo, CI, DB schema, auth (Google + magic link), claim username, onboarding wizard, khung dashboard | Đăng nhập được, có username |
| **2** | Page editor (kéo thả block P0, live preview), theme system, trang public `/@username` (cache, OG image), tracking view/click | Publish được trang bio |
| **3** | Kết nối payOS (Mode A), CRUD sản phẩm và upload file, checkout VietQR, webhook, giao file qua email, flow tip | Bán được đơn đầu tiên end-to-end |
| **4** | Dashboard tổng quan, quản lý đơn, analytics cơ bản, giới hạn gói Free, landing page, trang pháp lý, QA trên điện thoại (in-app browser của TikTok/IG) | Sẵn sàng cho beta |

### Phase 2: Private beta (tuần 5–6)
- Onboard 20–50 creator, ngồi hỗ trợ setup payOS 1-1
- Sửa bug, tối ưu onboarding, đo funnel bằng PostHog
- Thêm các block P1, email capture, mã giảm giá, referral

### Phase 3: Launch (tuần 7–8)
- Gói Pro (thanh toán VietQR, gia hạn thủ công kèm email nhắc), custom domain
- Marketing: series TikTok "build in public", hợp tác 5–10 creator tầm micro, seed trong các group designer, Notion, Lightroom
- Admin panel đủ dùng: kiểm duyệt nội dung và hỗ trợ user

### Phase 4: Growth (tháng 3–6)
- Overlay donate cho OBS, membership theo tháng, khóa học mini, Theme Store
- AI viết mô tả sản phẩm, AI gợi ý giá, gợi ý theme từ ảnh avatar
- Linkyy Pay (Mode B) nếu pháp lý cho phép; app mobile bằng Expo

### Chi phí vận hành ước tính (lúc đầu)
Vercel Pro (~$20), Supabase Pro (~$25), Resend (free rồi ~$20), domain (~300–700k/năm), PostHog và Sentry dùng free tier.
Tổng khoảng **1,5–2 triệu/tháng**. Bán được khoảng 40 gói Pro là hòa vốn. (Giá tham khảo, nhớ check lại khi triển khai.)

---

## 3. Tech stack

| Lớp | Công nghệ |
|-----|-----------|
| Framework | Next.js (App Router, Server Components, Server Actions) + React 19 + TypeScript |
| UI | Tailwind CSS v4, shadcn/ui, Motion, Lucide icons, Sonner (toast) |
| Editor | dnd-kit (kéo thả), Tiptap (rich text), react-colorful (chọn màu) |
| Form / validate | React Hook Form + Zod (dùng chung schema cho client và server) |
| Data | TanStack Query (client), Zustand (state của editor) |
| DB | Supabase Postgres + Drizzle ORM + Row Level Security |
| Auth | Supabase Auth (Google OAuth + magic link) |
| Storage | Supabase Storage: bucket `public` cho ảnh, bucket `private` cho file sản phẩm |
| Thanh toán | payOS (VietQR) qua `@payos/node` |
| Email | Resend + React Email |
| Job / cron | Trigger.dev hoặc Vercel Cron |
| Rate limit | Upstash Redis + `@upstash/ratelimit` |
| Anti-spam | Cloudflare Turnstile |
| OG image | `next/og` (Satori) |
| Analytics | Tự track event của creator; PostHog cho product analytics của Linkyy |
| Monitoring | Sentry |
| Deploy | Vercel (+ Vercel Domains API cho custom domain) |

### Cấu trúc thư mục
```
linkyy/
├─ app/
│  ├─ (marketing)/           # landing, pricing, explore, legal
│  ├─ (auth)/                # login, verify, onboarding
│  ├─ (dashboard)/dashboard/ # overview, editor, products, orders, tips, analytics, settings, billing
│  ├─ (admin)/admin/
│  ├─ u/[username]/          # trang public (middleware rewrite /@username → /u/username)
│  │  └─ p/[slug]/           # trang chi tiết sản phẩm
│  ├─ checkout/[orderId]/    # trang hiện QR và trạng thái đơn
│  ├─ d/[token]/             # tải file
│  └─ api/                   # webhooks, track, cron, og, uploads
├─ components/{ui,blocks,editor,dashboard,themes}/
├─ lib/{db,auth,payos,email,storage,analytics,ratelimit,crypto,validators}/
├─ db/{schema.ts,migrations/}
├─ emails/                   # template React Email
├─ jobs/                     # job của Trigger.dev
└─ middleware.ts             # map /@username, custom domain, bảo vệ route
```
> Lưu ý: trong App Router, folder bắt đầu bằng `@` là parallel route. Vì vậy URL `/@username` phải được middleware rewrite sang `/u/username`.

---

## 4. Chức năng FRONTEND

### 4.1 Marketing site (public)
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Landing page | Hero có demo trang bio động, khoe tính năng, bảng giá, FAQ, CTA claim username ngay trên hero | P0 |
| Claim username | Ô nhập `linkyy.vn/@___` báo ngay còn trống hay không (debounce), xong chuyển qua bước đăng ký | P0 |
| Trang Pricing | So sánh Free và Pro, gạt qua lại tháng/năm | P0 |
| Trang pháp lý | Điều khoản, chính sách bảo mật, chính sách hoàn tiền, nội dung bị cấm | P0 |
| 404 / 500 | Trang lỗi có meme, đúng chất Gen Z | P0 |
| Explore / Showcase | Gallery trang creator nổi bật, lọc theo danh mục | P1 |
| Blog / SEO | Bài hướng dẫn kiểu "cách bán preset Lightroom", viết bằng MDX | P2 |
| Song ngữ | Tiếng Việt mặc định, có thêm tiếng Anh (next-intl) | P2 |

### 4.2 Auth & Onboarding
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Đăng nhập Google | OAuth | P0 |
| Magic link email | Đăng nhập không cần mật khẩu | P0 |
| Onboarding wizard | 5 bước: username, avatar + tên + bio, chọn theme, thêm 3 link đầu tiên, publish. Có thanh tiến độ | P0 |
| Checklist kích hoạt | Hiện trên dashboard: "Kết nối payOS", "Thêm sản phẩm đầu tiên", "Share link lên bio TikTok" | P0 |
| Import từ social | Dán link TikTok/IG để lấy avatar và tên | P2 |

### 4.3 Trang public của creator `/@username`
**Hiển thị chung**
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Render block | Hiện trang theo `published_blocks` và theme đã chọn | P0 |
| Mobile-first | Tối ưu cho trình duyệt trong app TikTok/IG/FB/Zalo, LCP dưới 1,5 giây | P0 |
| SEO | Meta title/description, OG image động (avatar + tên + theme), JSON-LD | P0 |
| Nút Share và QR | Copy link, Web Share API, tải mã QR của trang | P0 |
| Watermark | Footer "made with Linkyy ✨" cho gói Free | P0 |
| Báo cáo vi phạm | Link "Báo cáo trang này" | P0 |
| Cổng 18+ | Màn hình cảnh báo nếu creator bật chế độ nội dung nhạy cảm | P1 |
| Hiệu ứng | Motion khi vào trang, hover nút, nền gradient/noise động | P1 |

**Các loại block**
| Block | Ưu tiên |
|-------|---------|
| Header / Profile (avatar, tên, bio, tick xanh, pronouns) | P0 |
| Link button (icon, thumbnail, kiểu nhấn mạnh: rung, bóng) | P0 |
| Social icons row (TikTok, IG, YouTube, FB, Threads, X, Discord, Zalo) | P0 |
| Text (markdown đơn giản) | P0 |
| Image | P0 |
| Embed (YouTube, TikTok, Spotify, SoundCloud) | P0 |
| Product card (một sản phẩm hoặc dạng grid) | P0 |
| Tip box ("Bao tui ly trà sữa 🧋") | P0 |
| Divider / Spacer | P0 |
| Gallery / Carousel | P1 |
| Email capture (newsletter) | P1 |
| Link group (nhóm link thu gọn được) | P1 |
| Countdown (đếm ngược ngày drop sản phẩm) | P1 |
| FAQ accordion | P1 |
| Wall of supporters (hiện tip và lời nhắn được ghim) | P1 |
| Hẹn giờ link (chỉ hiện từ ngày A đến ngày B) | P1 |
| Map, Contact form, Testimonials, Poll | P2 |
| Booking (đặt lịch call 1-1) | P2 |

### 4.4 Sản phẩm và Checkout (phía buyer)
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Trang chi tiết sản phẩm `/@u/p/[slug]` | Gallery ảnh, mô tả rich text, giá, giá gạch, số đã bán, nút "Mua ngay" | P0 |
| Form checkout | Email (bắt buộc), tên, ghi chú, có Turnstile chống spam | P0 |
| Trang thanh toán VietQR | Hiện QR, số tiền, nội dung chuyển khoản, đồng hồ đếm ngược 15 phút, trạng thái realtime (polling/SSE) | P0 |
| **Mở app ngân hàng** | Trên điện thoại không thể tự quét QR trên chính màn hình mình, nên phải có: nút deeplink mở app ngân hàng, nút "Lưu ảnh QR", nút copy số tài khoản, số tiền, nội dung | P0 |
| Trang thành công | Confetti 🎉, link tải ngay, báo "đã gửi email" | P0 |
| Trang tải file `/d/[token]` | Danh sách file, nút tải, số lượt tải còn lại | P0 |
| Tìm lại đơn | "Mất link tải?", nhập email để được gửi lại link | P0 |
| Pay what you want | Buyer tự nhập giá, có giá tối thiểu | P1 |
| Nhập mã giảm giá | Áp mã ngay ở trang checkout | P1 |
| Review sản phẩm | Buyer đã mua được để lại đánh giá | P2 |

### 4.5 Tip (phía fan)
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Chọn mức tip | Có sẵn 10k / 20k / 50k / 100k hoặc tự nhập | P0 |
| Lời nhắn | Tên (hoặc ẩn danh), lời nhắn tối đa 200 ký tự | P0 |
| Thanh toán và cảm ơn | Dùng chung flow VietQR, xong hiện animation cảm ơn | P0 |
| Mục tiêu donate | Thanh tiến độ kiểu "Gom 2 triệu mua tablet mới" | P1 |

### 4.6 Dashboard của creator
**Tổng quan**
| Chức năng | Ưu tiên |
|-----------|---------|
| Thẻ số liệu: view, click, doanh thu hôm nay và 7 ngày; đơn mới nhất | P0 |
| Checklist kích hoạt, banner nâng cấp Pro | P0 |
| Trung tâm thông báo (đơn mới, tip mới) theo realtime | P1 |

**Page Editor**
| Chức năng | Ưu tiên |
|-----------|---------|
| Kéo thả để sắp xếp block (dnd-kit), thêm, xóa, nhân bản block | P0 |
| Panel cài đặt riêng cho từng block | P0 |
| Live preview trong khung điện thoại, xem trước bản desktop | P0 |
| Tự lưu bản nháp, nút Publish / Unpublish | P0 |
| Undo / Redo | P1 |
| Bật/tắt từng block mà không cần xóa | P0 |
| Theme picker (8 preset) | P0 |
| Tùy chỉnh theme: màu, font, nền (màu, gradient, ảnh, video), kiểu nút, bo góc | P1 |
| Cài đặt SEO (meta title, description, ảnh share) | P1 |
| Lịch sử phiên bản, khôi phục bản cũ | P2 |

**Sản phẩm**
| Chức năng | Ưu tiên |
|-----------|---------|
| Danh sách sản phẩm (draft/active/archived), bật/tắt nhanh | P0 |
| Tạo/sửa: tiêu đề, slug, mô tả (Tiptap), ảnh bìa, gallery, giá, giá gạch | P0 |
| Upload nhiều file (kéo thả, có thanh tiến độ), giới hạn dung lượng theo gói | P0 |
| Hoặc giao bằng link ngoài (Notion/Drive) thay cho file | P0 |
| Nhân bản, lưu trữ sản phẩm | P1 |
| Giới hạn số lượng bán ("chỉ 50 slot") | P1 |
| Pay what you want | P1 |
| Giao license key (dán danh sách key, mỗi đơn lấy 1 key) | P2 |

**Mã giảm giá** (Pro)
| Chức năng | Ưu tiên |
|-----------|---------|
| Tạo mã giảm % hoặc số tiền cố định, giới hạn lượt dùng, hạn dùng, áp cho sản phẩm cụ thể | P1 |

**Đơn hàng và Tip**
| Chức năng | Ưu tiên |
|-----------|---------|
| Bảng đơn hàng: lọc theo trạng thái/ngày, tìm theo email | P0 |
| Chi tiết đơn, gửi lại email giao file | P0 |
| Xuất CSV | P1 |
| Đánh dấu đã hoàn tiền thủ công | P1 |
| Danh sách tip và lời nhắn, ghim lên Wall of supporters, ẩn tin nhắn | P0 / P1 |

**Khách hàng và Subscriber**
| Chức năng | Ưu tiên |
|-----------|---------|
| Danh sách người mua (email, tổng chi, số đơn) | P1 |
| Danh sách subscriber từ block email capture, xuất CSV | P1 |
| Gửi email broadcast tới subscriber | P2 |

**Analytics**
| Chức năng | Ưu tiên |
|-----------|---------|
| Biểu đồ view, unique visitor, click theo thời gian | P0 |
| CTR từng link/block | P0 |
| Nguồn traffic (TikTok, IG, FB, Zalo, direct), thiết bị, tỉnh/thành | P1 |
| Funnel: view → bấm mua → tạo đơn → thanh toán | P1 |
| Biểu đồ doanh thu, sản phẩm bán chạy | P1 |
| Chọn khoảng thời gian (Free chỉ xem 7 ngày) | P0 |

**Settings**
| Chức năng | Ưu tiên |
|-----------|---------|
| Hồ sơ: tên, avatar, bio, đổi username (có cooldown 30 ngày) | P0 |
| **Kết nối payOS**: nhập Client ID, API Key, Checksum Key, bấm "Kiểm tra kết nối", có hướng dẫn từng bước kèm ảnh | P0 |
| Cài đặt thông báo (email khi có đơn hoặc tip) | P0 |
| Custom domain: nhập domain, hiện bản ghi DNS cần thêm, trạng thái verify | P1 |
| Gắn Meta Pixel / TikTok Pixel / GA4 ID | P1 |
| Thông báo qua Telegram/Discord webhook khi có đơn | P2 |
| Xóa tài khoản, xuất dữ liệu cá nhân | P0 |

**Billing**
| Chức năng | Ưu tiên |
|-----------|---------|
| Xem gói hiện tại và ngày hết hạn | P1 |
| Nâng cấp Pro (tháng hoặc năm) bằng VietQR | P1 |
| Lịch sử thanh toán, hóa đơn | P1 |
| Hủy hoặc không gia hạn | P1 |

**Referral**
| Chức năng | Ưu tiên |
|-----------|---------|
| Link giới thiệu, thống kê số người đăng ký và số người lên Pro, phần thưởng đã nhận | P1 |

### 4.7 Admin panel
| Chức năng | Ưu tiên |
|-----------|---------|
| Tìm user, xem chi tiết, khóa/mở khóa, gắn tick xanh | P1 |
| Hàng đợi báo cáo vi phạm: xem trang/sản phẩm bị báo cáo, gỡ, cảnh cáo | P1 |
| Xem tổng quan đơn hàng và webhook lỗi | P1 |
| Dashboard hệ thống: số user mới, MRR, GMV | P1 |
| Quản lý theme preset, bật/tắt feature flag | P2 |
| Audit log hành động của admin | P1 |
| Giả lập đăng nhập (impersonate) để hỗ trợ user, có ghi log | P2 |

### 4.8 Yêu cầu chung cho UI
- Responsive, mobile-first; dashboard dùng thoải mái trên điện thoại vì creator chủ yếu xài điện thoại
- Có dark mode
- Skeleton khi đang tải, toast báo lỗi/thành công, empty state có minh họa dễ thương
- Accessibility: điều hướng được bằng bàn phím, đủ độ tương phản (theme preset phải qua kiểm tra contrast)
- Error boundary, offline banner
- PWA cho dashboard: "Thêm vào màn hình chính" (P2)

---

## 5. Chức năng BACKEND

### 5.1 Auth & User
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Supabase Auth | Google OAuth + magic link, session dạng cookie (SSR) | P0 |
| Tạo profile | Trigger khi đăng ký thì tạo dòng trong `profiles` | P0 |
| Kiểm tra username | Regex `^[a-z0-9._]{3,24}$`, chặn từ dành riêng (`admin`, `api`, `dashboard`...), lọc từ tục, unique | P0 |
| Phân quyền | Role `creator` / `admin`; RLS: creator chỉ đọc/ghi dữ liệu của chính mình | P0 |
| Middleware bảo vệ route | `/dashboard/*` bắt buộc đăng nhập, `/admin/*` chỉ admin | P0 |
| Xóa tài khoản | Xóa mềm, 30 ngày sau xóa hẳn kèm file trên storage | P0 |

### 5.2 Page Service
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| CRUD page | Mỗi creator 1 page; lưu `draft_blocks` và `published_blocks` dạng JSONB | P0 |
| Validate block | Zod discriminated union theo `block.type`, giới hạn số block và độ dài text | P0 |
| Publish | Copy draft sang published, gọi `revalidateTag('page:<username>')` | P0 |
| Cache trang public | Server Component + cache theo tag; trang được cache rồi, chỉ render lại khi publish | P0 |
| Kiểm tra URL an toàn | Check link qua Google Safe Browsing API khi lưu | P1 |
| Lưu lịch sử phiên bản | Bảng `page_versions` | P2 |

### 5.3 Media & Storage
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Signed upload URL | Client upload thẳng lên storage, server chỉ ký URL | P0 |
| Validate file | MIME/đuôi file có trong whitelist, dung lượng theo gói (Free 100MB/file, Pro 2GB/file) | P0 |
| Tối ưu ảnh | `next/image` + resize/webp khi upload avatar/cover | P0 |
| Bucket private | File sản phẩm không bao giờ public, chỉ truy cập được qua signed URL ngắn hạn | P0 |
| Dọn file mồ côi | Cron xóa file đã upload nhưng không gắn vào sản phẩm nào sau 24 giờ | P1 |
| Quét virus | ClamAV hoặc dịch vụ ngoài | P2 |

### 5.4 Kết nối thanh toán (payOS, Mode A)
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Lưu credential | Client ID, API Key, Checksum Key **mã hóa AES-256-GCM** (key nằm trong env), không bao giờ trả về client | P0 |
| Verify kết nối | Gọi thử API payOS và tự đăng ký webhook URL `/api/webhooks/payos/<creatorId>` | P0 |
| Ngắt kết nối / xoay key | Đổi key thì phải verify lại | P0 |

### 5.5 Checkout & Order
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Tạo đơn | Kiểm tra sản phẩm active, creator đã kết nối payOS, quota của gói Free, mã giảm giá; tính `amount`; tạo `order_code` (số nguyên unique); `status = pending`, `expires_at = +15 phút` | P0 |
| Tạo payment link | Gọi payOS `createPaymentLink`, lưu `payment_link_id`, trả QR data, thông tin tài khoản và deeplink cho client | P0 |
| Trạng thái đơn | `GET /api/orders/[id]/status`, chỉ trả trạng thái (không lộ PII); client polling mỗi 2–3 giây hoặc dùng SSE | P0 |
| Webhook | Xác thực chữ ký bằng checksum key của creator tương ứng → **idempotent** (lưu `webhook_events`, bỏ qua event trùng) → so khớp số tiền → `paid` → chạy job giao hàng | P0 |
| Hết hạn đơn | Cron mỗi 5 phút: đơn pending quá hạn chuyển `expired` và gọi cancel trên payOS | P0 |
| Đối soát | Cron hỏi payOS trạng thái các đơn pending, phòng trường hợp webhook bị miss | P0 |
| Hủy đơn | Buyer bấm hủy ở trang QR | P0 |
| Rate limit + Turnstile | Mỗi IP tối đa 10 đơn/giờ, chặn spam tạo đơn | P0 |
| Mã giảm giá | Validate rồi tăng `used_count` một cách atomic khi đơn chuyển paid | P1 |
| Pay what you want | Validate giá buyer nhập không thấp hơn `min_price` | P1 |
| Giới hạn slot | Trừ `max_sales` có khóa (transaction hoặc row lock), chống bán quá số slot | P1 |

### 5.6 Fulfillment (giao hàng)
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Tạo download token | Token ngẫu nhiên 32 byte, DB chỉ lưu hash; hạn 30 ngày, tối đa 10 lượt tải | P0 |
| Endpoint tải `/d/[token]` | Validate, tăng đếm lượt, redirect sang signed URL sống 60 giây | P0 |
| Email giao hàng | React Email gồm hóa đơn, link tải, thông tin creator | P0 |
| Email cho creator | "Ting ting 💸 bạn vừa bán được ..." | P0 |
| Gửi lại email | Từ dashboard, hoặc buyer tự tìm lại đơn bằng email (có rate limit, chỉ gửi tới đúng email đã mua) | P0 |
| Giao bằng link ngoài | Gửi link Notion/Drive thay cho file | P0 |
| Retry | Gửi email lỗi thì job tự retry theo exponential backoff | P0 |
| License key | Mỗi đơn lấy 1 key chưa dùng (atomic) | P2 |

### 5.7 Tip
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Tạo tip | Dùng chung pipeline thanh toán với order, phân biệt bằng `type = tip` | P0 |
| Lọc lời nhắn | Lọc từ tục và link spam | P0 |
| Realtime | Đẩy event lên Supabase Realtime để báo cho dashboard (sau này dùng cho overlay OBS) | P1 |
| Mục tiêu donate | Cộng dồn số tiền vào goal | P1 |

### 5.8 Billing của Linkyy (gói Pro)
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Mua Pro | Thanh toán qua tài khoản payOS **của Linkyy** (webhook riêng `/api/webhooks/payos/platform`) | P1 |
| Kích hoạt / gia hạn | Cộng thêm `plan_expires_at`; tạo bản ghi `subscriptions` | P1 |
| Nhắc gia hạn | Email báo trước 7 ngày, 1 ngày và đúng ngày hết hạn (VietQR không tự trừ tiền hằng tháng) | P1 |
| Hạ gói khi hết hạn | Cron: hết hạn cộng 3 ngày ân hạn thì về Free; dữ liệu vượt quota bị ẩn chứ không xóa | P1 |
| Kiểm tra quota | Hàm `assertQuota(user, 'products' / 'orders_month' / 'file_size')` dùng chung | P0 |

### 5.9 Analytics
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Endpoint nhận event | `POST /api/track` chạy ở edge, nhận `navigator.sendBeacon` gồm view, click, checkout_start | P0 |
| Lọc bot | Lọc theo user-agent, rate limit | P0 |
| Unique visitor không dùng cookie | `hash(ip + ua + ngày + salt)`, không lưu IP thô | P0 |
| Geo / device / referrer | Lấy từ header của Vercel (`x-vercel-ip-country`, city), parse UA, chuẩn hóa referrer (tiktok, instagram...) | P1 |
| Rollup | Cron hằng giờ gom `events` vào `daily_stats`; xóa event thô sau 90 ngày | P1 |
| API cho dashboard | Query theo khoảng ngày, chặn theo gói (Free 7 ngày) | P0 |

### 5.10 Custom domain (Pro)
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Thêm domain | Gọi Vercel Domains API để thêm domain vào project, trả bản ghi DNS cần cấu hình | P1 |
| Verify | Cron/nút bấm kiểm tra cấu hình, SSL do Vercel tự cấp | P1 |
| Routing | Middleware đọc `Host`, map sang username (cache trong Redis) | P1 |

### 5.11 Notifications
| Chức năng | Ưu tiên |
|-----------|---------|
| Bảng `notifications` cho thông báo trong app + Realtime | P1 |
| Email transactional: welcome, magic link, đơn mới, tip mới, nhắc gia hạn | P0 |
| Webhook Telegram/Discord | P2 |

### 5.12 Moderation & Safety
| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| API báo cáo | Lưu `reports`, có rate limit | P0 |
| Danh sách nội dung cấm | Nội dung lậu/vi phạm bản quyền, lừa đảo, 18+ trái phép, cờ bạc | P0 |
| Lọc từ khóa | Áp lên tên sản phẩm, bio, lời nhắn tip | P1 |
| Hành động của admin | Ẩn trang, khóa tài khoản, ghi lý do vào audit log | P1 |
| Quy trình khiếu nại bản quyền | Form khiếu nại → gỡ nội dung → thông báo cho creator | P1 |

### 5.13 Referral
| Chức năng | Ưu tiên |
|-----------|---------|
| Tạo `referral_code`, gắn cookie attribution 30 ngày khi vào bằng `?ref=` | P1 |
| Người được giới thiệu trả Pro lần đầu thì người giới thiệu được +1 tháng Pro (chạy qua job) | P1 |

### 5.14 Email capture
| Chức năng | Ưu tiên |
|-----------|---------|
| `POST /api/subscribe` có Turnstile, double opt-in | P1 |
| Xuất CSV, hủy đăng ký | P1 |

### 5.15 Bảo mật & vận hành
- **Validate** mọi input bằng Zod ở server; Server Actions luôn kiểm tra quyền sở hữu dữ liệu
- **RLS** bật trên mọi bảng; service role chỉ dùng trong webhook và job
- **Secret**: credential payOS của creator được mã hóa; xoay key định kỳ
- **Webhook**: verify chữ ký, idempotent, trả 200 thật nhanh rồi xử lý trong job
- **Rate limit** cho auth, checkout, track, subscribe, report, tìm lại đơn
- **Logging & monitoring**: Sentry, log có cấu trúc, cảnh báo khi webhook lỗi tăng đột biến
- **Backup**: Supabase PITR; sao lưu storage định kỳ
- **Dữ liệu cá nhân**: chỉ thu thập ít nhất có thể (email buyer), có chính sách bảo mật, cho phép xóa/xuất dữ liệu
- **Test**: unit test cho pricing, quota, webhook; e2e bằng Playwright cho flow claim username → publish → mua → tải file (dùng sandbox payOS hoặc mock)

### 5.16 Cron / Background jobs
| Job | Tần suất | Ưu tiên |
|-----|----------|---------|
| `expire-orders` | 5 phút | P0 |
| `reconcile-payments` | 10 phút | P0 |
| `send-fulfillment-email` | Theo event | P0 |
| `rollup-analytics` | 1 giờ | P1 |
| `plan-expiry-reminders` + `downgrade-expired` | Hằng ngày | P1 |
| `verify-custom-domains` | 15 phút | P1 |
| `cleanup-orphan-uploads` | Hằng ngày | P1 |
| `purge-deleted-accounts` + `purge-old-events` | Hằng ngày | P1 |

---

## 6. API

### Route Handlers (public hoặc bên thứ ba gọi vào)
| Method | Path | Mục đích |
|--------|------|----------|
| GET | `/api/username/check?u=` | Kiểm tra username còn trống |
| POST | `/api/checkout` | Tạo đơn sản phẩm và trả QR |
| POST | `/api/tips` | Tạo tip và trả QR |
| GET | `/api/orders/[id]/status` | Trạng thái đơn (dùng cho polling) |
| POST | `/api/orders/[id]/cancel` | Buyer hủy đơn |
| POST | `/api/orders/lookup` | Gửi lại link tải theo email |
| GET | `/d/[token]` | Tải file |
| POST | `/api/webhooks/payos/[creatorId]` | Webhook đơn của creator |
| POST | `/api/webhooks/payos/platform` | Webhook billing của Linkyy |
| POST | `/api/track` | Nhận event analytics |
| POST | `/api/subscribe` | Email capture |
| POST | `/api/report` | Báo cáo vi phạm |
| GET | `/api/og/[username]` | Tạo OG image |
| POST | `/api/uploads/sign` | Ký URL upload |
| GET | `/api/cron/*` | Các cron job (bảo vệ bằng `CRON_SECRET`) |

### Server Actions (dashboard, bắt buộc đăng nhập)
`updateProfile`, `saveDraftBlocks`, `publishPage`, `updateTheme`, `createProduct`, `updateProduct`, `archiveProduct`, `attachFile`, `removeFile`, `createDiscount`, `resendOrderEmail`, `markRefunded`, `pinTip`, `hideTip`, `connectPayOS`, `disconnectPayOS`, `addCustomDomain`, `removeCustomDomain`, `startProCheckout`, `updateNotificationPrefs`, `deleteAccount`, `exportMyData`

---

## 7. Database schema

```sql
profiles        (id uuid PK → auth.users, email, username UNIQUE, display_name, avatar_url, bio,
                 role, plan, plan_expires_at, referral_code UNIQUE, referred_by, is_verified,
                 is_banned, deleted_at, created_at)
pages           (id, user_id UNIQUE, theme jsonb, draft_blocks jsonb, published_blocks jsonb,
                 seo jsonb, is_sensitive, published_at, updated_at)
payment_accounts(id, user_id UNIQUE, provider 'payos', client_id, api_key_enc, checksum_key_enc,
                 webhook_registered_at, verified_at, status)
products        (id, user_id, slug, title, description jsonb, price int, compare_at_price int,
                 pwyw bool, min_price int, cover_url, gallery jsonb, delivery_type 'file'|'link'|'license',
                 external_url, max_sales int, sales_count int, status, created_at,
                 UNIQUE(user_id, slug))
product_files   (id, product_id, storage_path, filename, size_bytes, mime, created_at)
license_keys    (id, product_id, key_enc, order_id NULL, used_at)                 -- P2
discount_codes  (id, user_id, code, type '%'|'fixed', value, max_uses, used_count, expires_at,
                 product_ids uuid[], UNIQUE(user_id, code))
orders          (id, order_code bigint UNIQUE, type 'product'|'tip', seller_id, product_id NULL,
                 buyer_email, buyer_name, note, amount int, discount_code_id, status
                 'pending'|'paid'|'expired'|'cancelled'|'refunded', payment_link_id,
                 expires_at, paid_at, created_at)
tip_details     (order_id PK, display_name, message, is_anonymous, is_pinned, is_hidden)
downloads       (id, order_id, token_hash UNIQUE, max_downloads, download_count, expires_at)
webhook_events  (id, provider, source 'creator'|'platform', order_code, signature_ok, payload jsonb,
                 processed_at, UNIQUE(provider, order_code, source))
subscriptions   (id, user_id, plan, interval 'month'|'year', amount, order_code, period_start,
                 period_end, status)
subscribers     (id, user_id, email, confirmed_at, unsubscribed_at, source, UNIQUE(user_id, email))
events          (id bigserial, page_owner_id, type 'view'|'click'|'checkout_start', target_id,
                 referrer_host, country, city, device, visitor_hash, created_at)   -- partition theo tháng
daily_stats     (user_id, date, views, uniques, clicks jsonb, checkouts, orders, revenue,
                 PK(user_id, date))
custom_domains  (id, user_id UNIQUE, domain UNIQUE, status, verified_at)
notifications   (id, user_id, type, payload jsonb, read_at, created_at)
reports         (id, target_type, target_id, reason, details, reporter_email, status, handled_by)
referrals       (id, referrer_id, referee_id UNIQUE, status, rewarded_at)
audit_logs      (id, actor_id, action, target_type, target_id, meta jsonb, created_at)
waitlist        (id, email UNIQUE, source, created_at)                             -- Phase 0
```

### Sơ đồ luồng checkout
```
Buyer                Linkyy (Next.js)                 payOS              Creator bank
  │  Bấm "Mua"           │                               │                    │
  │─────────────────────▶│ validate, tạo order pending   │                    │
  │                      │──── createPaymentLink ───────▶│                    │
  │◀──── QR + deeplink ──│◀──────── qrCode, link ────────│                    │
  │  Chuyển khoản ───────────────────────────────────────────────────────────▶│
  │                      │◀──── webhook (đã ký) ─────────│◀── báo có tiền ────│
  │                      │ verify chữ ký, idempotent → paid → job giao hàng   │
  │◀── polling: paid ────│                               │                    │
  │◀── email + link tải ─│                               │                    │
```

---

## 8. Rủi ro & cách xử lý
| Rủi ro | Cách xử lý |
|--------|------------|
| Pháp lý (trung gian thanh toán, TMĐT, thuế) | Dùng Mode A cho MVP, hỏi luật sư trước khi launch |
| Creator ngại setup payOS | Video hướng dẫn 2 phút, hỗ trợ 1-1 trong beta, sau này cân nhắc Mode B |
| Bán nội dung lậu hoặc lừa đảo | Danh sách nội dung cấm, nút báo cáo, quy trình khiếu nại bản quyền, khóa tài khoản |
| Webhook bị miss | Job đối soát định kỳ + idempotency |
| Trình duyệt trong app TikTok/IG chạy lỗi | QA kỹ trên máy thật, dùng deeplink và nút lưu ảnh QR, tránh popup |
| Phụ thuộc vào payOS | Thiết kế `PaymentProvider` interface để sau này thêm Casso, MoMo |
| Đối thủ lớn vào VN | Bám chặt điểm mạnh địa phương: VietQR, giá VND, cộng đồng, theme đúng gu |
