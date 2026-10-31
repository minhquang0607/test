# 💡 Ý tưởng dự án web cho Gen Z (có kiếm tiền được)

## 0. Stack nền dùng chung cho mọi ý tưởng

| Lớp | Thư viện |
|-----|----------|
| Framework | Next.js (App Router, Server Actions) + React 19 + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui + Motion (Framer Motion cũ) |
| State / data fetching | TanStack Query + Zustand + Zod |
| DB / ORM | Supabase hoặc Neon (Postgres) + Drizzle ORM |
| Auth | Better Auth / Clerk / Supabase Auth |
| Rate limit, cache | Upstash Redis |
| Job nền | Trigger.dev / Inngest |
| Thanh toán | payOS (VietQR), MoMo, Stripe nếu bán ra nước ngoài |
| Theo dõi | PostHog (analytics) + Sentry (lỗi) |
| Deploy | Vercel / Cloudflare |

---

## 1. List ý tưởng

| # | Ý tưởng | Thư viện "đinh" | Kiếm tiền |
|---|---------|-----------------|-----------|
| ⭐ 1 | **Linkyy**: link-in-bio + bán đồ digital (preset, template, ebook) + nhận donate qua VietQR | dnd-kit, Motion, `@vercel/og`, payOS, Resend | Phí 5%/giao dịch + Pro 49k/tháng |
| 2 | **ClipForge**: dán link hoặc up video, tự cắt highlight, gắn sub kiểu TikTok, xuất video dọc | **Remotion** (render video bằng React), FFmpeg.wasm, Whisper (speech-to-text), Trigger.dev | Mua credit render + gói tháng |
| 3 | **FitCheck AI**: up ảnh outfit, AI chấm điểm, gợi ý phối đồ, tìm món tương tự để mua | Vercel AI SDK + Claude (vision), `@imgly/background-removal`, pgvector | Affiliate Shopee/TikTok Shop + premium |
| 4 | **Speakie**: luyện nói tiếng Anh/Hàn/Nhật bằng voice với AI nhập vai (order cà phê ở Seoul, phỏng vấn xin việc...) | **LiveKit Agents** (voice realtime), Claude, TTS (ElevenLabs), STT (Deepgram) | Subscription 79k/tháng hoặc bán theo phút |
| 5 | **Lofi Room 3D**: phòng học chung có pomodoro, avatar ngồi học trong phòng 3D, voice chat | **React Three Fiber** + drei, LiveKit, Liveblocks (presence), Howler.js | Bán skin phòng/avatar + Pro |
| 6 | **Kèo**: lên kèo đi chơi, vote quán realtime trên map, chia bill bằng VietQR | MapLibre GL + Goong Maps, Supabase Realtime, Serwist (PWA) | Quán trả phí boost + affiliate voucher |
| 7 | **Moodboard Collab**: vẽ moodboard/vision board chung với hội bạn trên canvas vô hạn | **tldraw SDK** hoặc Excalidraw, Yjs, Unsplash API, AI gợi ý bảng màu | Pro template + in poster/sticker theo yêu cầu (POD) |
| 8 | **Wrapped Everything**: tạo card tổng kết viral (năm học, chi tiêu, "roast" playlist) | **GSAP** ScrollTrigger, Satori, html-to-image, Claude để viết roast | Ads + mở khóa template + nhận làm campaign cho brand (B2B) |
| 9 | **Pass Đồ**: chợ pass đồ si/secondhand, quẹt trái phải như app hẹn hò, chat trực tiếp | **Convex** (realtime DB), Typesense/Meilisearch, Motion (cử chỉ quẹt), Cloudinary | Phí đẩy tin + hoa hồng ship |
| 10 | **QuizBattle**: up PDF bài học, AI tạo quiz, đấu realtime với bạn bè | PartyKit / Socket.io, Claude (sinh câu hỏi), unpdf, Rive (animation) | Pro cho lớp học/CLB + ads |

### Nên chọn cái nào?
- **Muốn có tiền nhanh nhất**: #1 Linkyy. Thu phí trên từng giao dịch nên có user là có tiền.
- **Muốn flex kỹ thuật**: #2 ClipForge hoặc #4 Speakie. Làm video và AI voice realtime, cực hợp để bỏ vào portfolio.
- **Muốn viral**: #8 Wrapped hoặc #3 FitCheck. Kết quả là ảnh/card nên người dùng tự share.

Phần dưới đi sâu vào #1 Linkyy. Spec đầy đủ (plan, toàn bộ chức năng FE/BE, API, DB) nằm ở [`docs/LINKYY.md`](docs/LINKYY.md). Lưu ý: mô hình thanh toán và bảng giá trong spec đã được chỉnh lại vì lý do pháp lý, xem mục 1.6 của spec.

---

## 2. Deep-dive #1: Linkyy

### Người dùng
- **Creator** (16–28 tuổi): TikToker, designer bán preset Lightroom, người bán template Notion, artist nhận commission, streamer nhận donate.
- **Người mua**: follower của mấy creator này. Họ lướt TikTok, bấm link ở bio, quét QR là mua xong, không cần tạo tài khoản.

### Tính năng MVP
1. **Trang bio kéo thả**: bố cục bento grid, có sẵn theme (y2k, clean girl, dark academia, cyber...), nhúng được TikTok, Spotify, YouTube.
2. **Shop digital**: up file (PDF, ZIP, preset...), đặt giá. Khách thanh toán qua VietQR (dùng payOS hoặc Casso), webhook xác nhận xong thì gửi link tải qua email.
3. **Donate / Tip**: nút "Bao tui ly trà sữa 🧋", số tiền tùy chọn, có hiện lời nhắn lên OBS khi đang stream (để v2).
4. **Analytics**: lượt xem, lượt click, doanh thu, nguồn traffic (TikTok, IG, FB).
5. **Đăng nhập**: Google hoặc magic link, username là `linkyy.vn/@tên`.

### Kiếm tiền 💸
| Gói | Giá | Quyền lợi |
|-----|-----|-----------|
| Free | 0đ | 1 trang, 3 sản phẩm, **phí 5%/giao dịch**, có watermark |
| Pro | 49k/tháng | Không giới hạn sản phẩm, **0% phí**, custom domain, analytics xịn, bỏ watermark |
| Theme shop | 19k–99k/theme | Creator thiết kế theme để bán, sàn ăn 30% |

Tính thử: 1.000 creator, trong đó 10% lên Pro là 4,9 triệu/tháng. Cộng thêm phí 5% trên khoảng 100 triệu GMV của nhóm free là 5 triệu nữa. Tổng gần **10 triệu/tháng** từ một sản phẩm indie.

### Tech stack
- **Frontend + Backend**: Next.js 15 (App Router, Server Actions) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Framer Motion (animation phải mượt thì mới ra chất Gen Z)
- **DB / Auth / Storage**: Supabase (Postgres + RLS + Storage để lưu file sản phẩm)
- **Thanh toán**: payOS (VietQR), sau này thêm MoMo
- **Email**: Resend + React Email
- **Deploy**: Vercel; ảnh OG share được generate động bằng `@vercel/og`
- **Analytics**: PostHog

### Data model (bản rút gọn)
```
users(id, email, username, plan, created_at)
pages(id, user_id, theme, blocks jsonb, published)
products(id, user_id, title, price, file_path, cover_url, active)
orders(id, product_id, buyer_email, amount, fee, status, payos_order_code, paid_at)
tips(id, user_id, amount, message, status, paid_at)
events(id, page_id, type, ref, created_at)   -- view / click
```

### Luồng thanh toán
```
Khách bấm "Mua" → tạo order (pending) → gọi payOS tạo link/QR
→ khách quét QR → payOS bắn webhook → xác thực chữ ký
→ order = paid → tạo signed URL cho file → gửi email cho khách
```

---

## 3. Roadmap 4 tuần

- **Tuần 1**: setup Next.js + Supabase, làm auth, chọn username, editor trang bio (block link, text, ảnh, embed).
- **Tuần 2**: theme system, trang public `/@username` (SSR + OG image), tracking view/click.
- **Tuần 3**: sản phẩm digital, tích hợp payOS, webhook, gửi file qua email, làm tính năng tip.
- **Tuần 4**: dashboard analytics, gói Pro, landing page, rủ 20 creator dùng thử beta.

## 4. Growth hack cho Gen Z 🚀
- Mỗi trang free có badge "made with Linkyy ✨" ở footer, coi như quảng cáo miễn phí.
- Mời bạn bè đăng ký thì được tặng 1 tháng Pro.
- Seed qua TikTok: quay video "mình kiếm được X triệu từ bán preset" kèm link Linkyy.
- Hợp tác với cộng đồng designer, Notion, Lightroom trên Facebook Groups và Discord.

## 5. Mở rộng (v2+)
- Overlay donate cho OBS khi livestream
- Bán khóa học mini (video + bài học)
- Membership / fan club đăng ký theo tháng
- AI viết mô tả sản phẩm, AI gợi ý giá
- App mobile (Expo)
