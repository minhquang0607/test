# 💡 Ý tưởng dự án web cho Gen Z (có kiếm tiền được)

## TL;DR

Mình chọn **Linkyy**: link-in-bio kết hợp mini shop bán đồ digital cho creator Gen Z ở VN, thanh toán bằng **VietQR**.
Tiền vào từ ngày đầu nhờ phí giao dịch và gói Pro. Bản MVP code trong khoảng 4 tuần là xong.

---

## 1. Shortlist ý tưởng

| # | Ý tưởng | Vibe | Kiếm tiền | Độ khó | Rủi ro |
|---|---------|------|-----------|--------|--------|
| ⭐ 1 | **Linkyy**: link-in-bio + bán preset, template, ebook, khóa học mini, nhận donate qua VietQR | Creator economy | Phí giao dịch + gói Pro | Trung bình | Phải cạnh tranh với Linktree/Beacons, nhưng tụi đó chưa có thanh toán nội địa |
| 2 | **Kèo**: lên kèo đi chơi, vote địa điểm, chia bill qua VietQR | Hội bạn thân | Quán trả tiền để được đề xuất, affiliate voucher | Trung bình | Phải gom đủ user rồi mới bán được cho quán |
| 3 | **FitCheck AI**: up ảnh outfit, AI chấm điểm và gợi ý phối đồ kèm link mua | Thời trang | Affiliate Shopee/TikTok Shop + premium | Trung bình–cao | Gọi AI tốn tiền, cần kiểm duyệt ảnh |
| 4 | **Focus Room**: phòng học chung online, có pomodoro, streak, nhạc lofi | Study-with-me | Freemium + bán skin/theme | Thấp–trung bình | User bỏ ngang nhiều, khó giữ chân |
| 5 | **Wrapped Everything**: tạo card tổng kết kiểu Spotify Wrapped cho bất cứ thứ gì (năm học, crush, chi tiêu) | Viral | Ads + mở khóa template | Thấp | Hot nhanh nguội cũng nhanh |

**Vì sao chọn #1?** Có dòng tiền thật ngay từ đầu, không cần chờ đông user mới kiếm được. Mỗi creator dùng là tự đem trang của mình đi share cho follower, nên growth tự chạy. Và thanh toán VietQR là thứ mà Linktree hay Beacons không có ở VN.

---

## 2. Linkyy: chi tiết sản phẩm

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
