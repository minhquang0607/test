# 🌟 Linkyy v2: Sáng tạo · Ổn định · Rẻ

Bản này bổ sung cho [`LINKYY.md`](LINKYY.md). Nếu hai bản ghi khác nhau về **gói giá, roadmap hay storage**, lấy theo bản này.

Ba trụ cột để giữ chân người dùng:
1. **Sáng tạo**: có những tính năng mà creator không tìm thấy ở link-in-bio nào khác, nhất là ở VN.
2. **Ổn định**: trang không chết, đơn không mất, giá không tự nhiên tăng.
3. **Rẻ**: rẻ thật sự, và rẻ một cách công bằng (bạn chưa kiếm ra tiền thì bạn chưa phải trả).

---

## 0. Định vị mới

> **Linkyy không chỉ là link-in-bio. Đây là nơi fan ủng hộ creator.**

Linktree và đối thủ chỉ phục vụ **creator**. Linkyy phục vụ **cả creator lẫn fan**:
- Fan có sổ fan, level, con dấu sưu tập, và có lý do để quay lại.
- Creator có fan quay lại thì bán được nhiều hơn, nên càng không muốn rời đi.
- Giữ chân bằng giá trị thật, không phải bằng cách khóa dữ liệu (dữ liệu luôn export được, xem mục 2).

---

## 1. Signature features

> Thẳng thắn: mình không dám chắc 100% chưa ai trên thế giới làm từng tính năng riêng lẻ. Nhưng **gom tất cả lại, gắn với VietQR và văn hóa VN** thì mình chưa thấy link-in-bio nào làm.

| # | Tính năng | Một câu mô tả | Giữ chân ai | Độ khó | Phase |
|---|-----------|---------------|-------------|--------|-------|
| 1 | 🔊 **Loa Ting Ting** | Tiền về là điện thoại đọc to: "Ting ting! Đã nhận 49 nghìn đồng" | Creator | Thấp | MVP |
| 2 | 🫧 **Bio Sống** | Hiện số người đang xem; có người tip thì pháo hoa bay trên màn hình của mọi người | Fan + Creator | Trung bình | Beta |
| 3 | 🎟️ **Fan Passport** | Sổ fan: sưu tập con dấu, lên level fan, nhận perk theo level | **Fan** | Trung bình | Beta → Launch |
| 4 | ⚡ **Drop Mode** | Mở bán giới hạn kiểu săn sneaker: đếm ngược, hàng chờ, slot nhảy realtime | Fan + Creator | Trung bình | Beta |
| 5 | 💌 **Hỏi Xoáy** | Hộp hỏi ẩn danh; tip kèm câu hỏi thì được ưu tiên trả lời; câu trả lời xuất thành card story | Fan + Creator | Thấp–TB | Beta |
| 6 | 🔓 **Mời Bạn Mở Khóa** | Mời 3 bạn là nhận preset free | Creator (growth) | Thấp | Beta |
| 7 | 🛍️ **Tủ Đồ Affiliate** | Dán link Shopee/TikTok Shop là thành tủ đồ đẹp, có thống kê click từng món | Creator | Thấp | Beta |
| 8 | 🔥 **Streak & Milestone** | Chuỗi tuần có đơn, huy hiệu; đạt mốc được thưởng ngày Pro | Creator | Thấp | Beta |
| 9 | 🎪 **Booth Mode** | Bán ở fest/hội chợ: catalog trên điện thoại, QR đúng số tiền, loa đọc to, chốt sổ cuối ngày | Creator (artist) | Trung bình | Launch |
| 10 | 🎨 **Commission Board** | Nhận commission: brief, cọc 50%, theo dõi tiến độ, duyệt bản nháp, trả nốt rồi nhận file gốc | Creator (artist) | Cao | Launch |
| 11 | 🧠 **Smart Rules** | Trang tự đổi theo nguồn vào, giờ, ngày; tự A/B test rồi chọn bản thắng | Creator | Trung bình | Launch |
| 12 | 🎁 **Bio Wrapped** | Tổng kết tháng/năm cho creator và fan, xuất card 9:16 để share | Cả hai (viral) | Thấp–TB | Launch (kịp cuối năm) |
| 13 | 🧑‍🤝‍🧑 **Mua Chung** | Rủ đủ 3 người là được giá nhóm; giữ chỗ trước, đủ người mới trả tiền | Fan (viral) | Trung bình | Growth |
| 14 | 🤖 **Trợ Lý Trả Lời Thay** | AI trả lời câu hỏi về sản phẩm 24/7 dựa trên thông tin creator cung cấp | Creator | Trung bình | Growth |

### 1.1 🔊 Loa Ting Ting
- **Cách chạy**: có đơn hoặc tip là điện thoại đọc to *"Ting ting! Linkyy đã nhận 49.000 đồng từ Minh Anh"*, giống loa thanh toán ở quán.
- **Sound pack**: giọng chuẩn, giọng meme, giọng "idol". Sau này bán trong Theme Store.
- **Kỹ thuật**:
  - Khi dashboard/PWA đang mở: phát audio ghép từ các clip số đọc sẵn (hoặc Web Speech API tiếng Việt).
  - Khi app chạy nền: gửi Web Push, kèm bot Telegram gửi tin nhắn thoại.
- **Giới hạn cần nói rõ với user**:
  - iOS chỉ nhận Web Push khi đã "Thêm vào màn hình chính".
  - Push chạy nền không phát được giọng tùy chỉnh, nên phải dựa vào Telegram (hoặc Zalo ZNS dạng add-on trả phí).
- **Vì sao giữ chân**: mỗi đơn là một lần sướng. Creator sẽ quay clip "ting ting" đăng TikTok, coi như Linkyy được quảng cáo miễn phí.

### 1.2 🫧 Bio Sống
- Hiện "👀 12 người đang xem" trên trang.
- **Tip bay**: có người tip là sticker hoặc pháo hoa và dòng "Lan vừa bao trà sữa 🧋" bay ngang màn hình của **mọi người đang xem**. Social proof ngay tại chỗ.
- Tip có thể kèm sticker động hoặc voice 5 giây. Voice phải được creator duyệt rồi mới hiện công khai.
- **Kỹ thuật cho rẻ**: đếm người xem bằng heartbeat 30 giây ghi vào Redis (không giữ websocket). Riêng tip thì broadcast qua SSE hoặc Supabase Realtime, và chỉ mở kết nối khi tab đang hiện.

### 1.3 🎟️ Fan Passport
- Fan đăng nhập bằng email đã dùng khi mua/tip (magic link, không cần mật khẩu) là thấy sổ fan của mình.
- **Con dấu (stamp)**:
  - Mỗi creator có con dấu riêng, tự up hoặc tạo từ template.
  - Mua hoặc tip lần đầu là được đóng dấu.
  - Có dấu giới hạn cho sự kiện: drop, sinh nhật creator, kỷ niệm 1 năm.
- **Level fan theo từng creator**: tính theo tổng ủng hộ, gồm Bronze, Silver, Gold, Diamond. Creator tự đặt perk cho từng level:
  - Mã giảm giá tự áp
  - File độc quyền
  - Tên hiện trên Wall of supporters
  - Vào Drop sớm
  - Ưu tiên nhận commission
- **Khám phá**: "Fan của X cũng ủng hộ Y". Chỉ dùng dữ liệu tổng hợp, ẩn danh, có opt-in.
- **Quyền riêng tư**: sổ fan mặc định private, fan tự bật public nếu muốn.
- **Vì sao giữ chân**:
  - Fan có lý do quay lại: sưu tập và lên level.
  - Creator không muốn rời vì cả hệ thống level và perk của fan nằm ở Linkyy. Rời đi thì mất **giá trị**, không phải bị khóa dữ liệu.
  - Hiệu ứng mạng lưới: creator mới vào Linkyy sẽ được fan sẵn có trong hệ thống tìm thấy.

### 1.4 ⚡ Drop Mode
- Creator đặt lịch drop. Trang bio hiện đếm ngược và nút "Nhắc tui", nhắc qua email, Web Push hoặc Telegram.
- Đến giờ mở bán, nếu đông người thì vào **hàng chờ ảo** theo thứ tự. Trang hiện "87 người đang chờ" và số slot còn lại nhảy realtime.
- Fan level Gold trở lên được vào sớm 10 phút (kết hợp với Fan Passport).
- Hết slot thì chuyển sang waitlist cho đợt sau.
- **Kỹ thuật**: hàng chờ dùng Upstash Redis (sorted set + token); chống bán vượt slot bằng row lock (đã có trong spec mục 5.5).

### 1.5 💌 Hỏi Xoáy
- Hộp hỏi ẩn danh trên bio. Hỏi **miễn phí**; tip kèm câu hỏi thì được đẩy lên đầu hàng.
  - Không có kiểu "trả tiền mới được hỏi", nên không phát sinh chuyện hoàn tiền. Hợp với Mode A.
- Creator trả lời bằng chữ, ảnh hoặc video ngắn. Câu trả lời tự xuất thành **card story 9:16** để đăng TikTok/IG, kéo traffic về lại bio.
- **Kiểm duyệt**:
  - Lọc từ tục, dùng model nhỏ chấm điểm toxic trước khi câu hỏi tới tay creator.
  - Creator chặn được người gửi (theo device hash).

### 1.6 🔓 Mời Bạn Mở Khóa
- Creator đặt điều kiện cho sản phẩm 0đ hoặc mã giảm giá, ví dụ "mời 3 bạn để mở khóa". Fan nhận link riêng; bạn của fan vào link và xác nhận email thì được tính.
- **Chống gian lận**:
  - Email bắt buộc xác nhận.
  - Chặn email tạm (danh sách domain disposable).
  - Giới hạn theo IP/device hash.
- Creator được thêm email và traffic. Linkyy được thêm lượt người biết tới.

### 1.7 🛍️ Tủ Đồ Affiliate
- Dán link affiliate Shopee/TikTok Shop/Lazada, Linkyy lấy preview từ OG tags. Creator chỉnh lại ảnh và giá nếu cần, rồi hiển thị dạng tủ đồ hoặc outfit.
- Bấm vào món nào là mở app sàn tương ứng. Có thống kê click theo từng món.
- Đây là thứ creator VN cần hằng ngày mà link-in-bio nước ngoài làm không tới.

### 1.8 🔥 Streak & Milestone
- Có chuỗi "tuần có đơn" và huy hiệu cho các mốc: đơn đầu tiên, 1 triệu đầu tiên, 100 fan, 1 năm trên Linkyy.
- Đạt mốc được thưởng ngày Pro miễn phí hoặc theme độc quyền. Vừa giữ chân, vừa đúng tinh thần "rẻ".

### 1.9 🎪 Booth Mode
- **Bối cảnh**: artist alley, comic fest, chợ phiên, hội chợ ở trường.
- **Cách chạy**:
  1. Chọn món trên catalog (điện thoại/tablet).
  2. Màn hình hiện QR đúng số tiền.
  3. Loa Ting Ting đọc to khi tiền về.
  4. Tồn kho tự trừ.
- **Sản phẩm vật lý bán tại chỗ** (sticker, print, móc khóa): chỉ dùng trong Booth Mode, không làm vận chuyển.
- In standee QR: xuất PDF khổ A5/A6, quét vào là ra catalog.
- Cuối ngày chốt sổ: tổng thu, món bán chạy, xuất CSV.
- **Mất mạng**: catalog được cache trong PWA; vẫn hiện được QR tĩnh của creator, có tiền thì đối soát sau.

### 1.10 🎨 Commission Board
- Creator mở "5 slot commission tháng này", đặt bảng giá theo loại (chibi, half body, full body) và các add-on.
- **Luồng**:
  1. Fan gửi brief (form tùy biến, kèm ảnh tham khảo).
  2. Creator nhận đơn hoặc báo giá.
  3. Fan đặt **cọc 50%** qua VietQR.
  4. Theo dõi tiến độ: Phác thảo → Lên màu → Hoàn thiện, có ảnh preview đóng watermark.
  5. Fan duyệt hoặc yêu cầu sửa (giới hạn số lần).
  6. Trả nốt phần còn lại thì mở file gốc.
- Có hàng đợi công khai (tên ẩn danh) để fan biết mình đang đứng thứ mấy.
- **Vì sao giữ chân**: cả quy trình làm ăn của artist nằm trên Linkyy, thay cho inbox Facebook lộn xộn.

### 1.11 🧠 Smart Rules
- **Cú pháp**: Nếu [nguồn vào / giờ / ngày / lần đầu hay quay lại / thiết bị / tỉnh] thì [hiện / ẩn / đổi thứ tự block, đổi theme].
- **Mẫu có sẵn**:
  - "Khách từ TikTok thấy preset trước"
  - "Sau 22h tự chuyển theme đêm"
  - "Sinh nhật mình thì đổi theme party và giảm 20%"
- **Auto A/B**: thử 2 tiêu đề nút, đủ 200 click thì tự chọn bản thắng.
- **Kỹ thuật**: trang vẫn được cache. Rule áp ở client bằng một script nhỏ, hoặc tạo biến thể cache theo nguồn vào, để không phải render lại mỗi lượt xem.

### 1.12 🎁 Bio Wrapped
- **Cho creator**, hằng tháng và cuối năm: doanh thu, top fan, link hot nhất, "giờ vàng" bán hàng.
- **Cho fan**: "Năm nay bạn đã ủng hộ 7 creator", con dấu hiếm nhất.
- Card 9:16, một chạm là share.
- Nếu ra kịp cuối năm, đây là cú hích marketing miễn phí lớn nhất.

### 1.13 🧑‍🤝‍🧑 Mua Chung
- Creator bật "Nhóm 3 người giảm 30%".
- Người đầu tiên tạo nhóm và nhận link mời; bạn bè **giữ chỗ bằng email, chưa phải trả tiền**.
- Đủ người trong 24 giờ: mọi người nhận link thanh toán giá nhóm, hạn 2 giờ.
- Không đủ người: chọn mua giá thường hoặc thôi.
- Vì không ai trả tiền trước nên không cần hoàn tiền. Hợp với Mode A.

### 1.14 🤖 Trợ Lý Trả Lời Thay
- Bong bóng chat trên trang sản phẩm. Trợ lý chỉ trả lời dựa trên mô tả sản phẩm, FAQ và chính sách mà creator viết.
- Không biết thì nói không biết, và chuyển câu hỏi về cho creator.
- Có thể gợi ý sản phẩm phù hợp, kèm nút "Mua luôn".
- **Kiểm soát chi phí**:
  - Dùng model nhỏ, giá rẻ, có prompt caching.
  - Giới hạn số tin trên mỗi visitor.
  - Quota: Free 50 câu/tháng, Pro 500 câu/tháng.

---

## 2. Ổn định là tính năng, không chỉ là chuyện kỹ thuật

### 2.1 Cam kết công khai (in lên trang Pricing)
| Cam kết | Nội dung |
|---------|----------|
| 🛡️ **Trang bất tử** | Trang bio vẫn sống kể cả khi server Linkyy gặp sự cố |
| 💯 **Không mất đơn** | Mỗi đơn đã trả tiền đều được giao file, có hệ thống đối soát tự động |
| 💸 **Bồi thường thật** | Trang public down tổng cộng hơn 30 phút trong một tháng thì mọi creator bị ảnh hưởng được +1 tháng Pro |
| 🔒 **Khóa giá** | Giá bạn đăng ký là giá bạn trả mãi mãi, kể cả khi bảng giá tăng |
| 🚫 **Không quảng cáo, không thu %** | Không bao giờ chèn quảng cáo vào trang creator; Mode A không thu phần trăm giao dịch |
| 📦 **Dữ liệu là của bạn** | Export toàn bộ trang (HTML tĩnh), sản phẩm, khách hàng (CSV) bằng một nút, kể cả gói Free |
| 📊 **Minh bạch** | Status page công khai, báo cáo sự cố (post-mortem) công khai |

### 2.2 Cách làm cho được như vậy
| Cơ chế | Chi tiết |
|--------|----------|
| **Snapshot tĩnh** | Mỗi lần publish, render trang thành HTML tĩnh rồi lưu lên R2. CDN phục vụ theo `stale-if-error`, nên origin hay DB có chết thì trang vẫn hiện |
| **Checkout dự phòng** | Nếu payOS lỗi, chuyển sang VietQR tĩnh (số tài khoản của creator, nội dung là mã đơn). Đơn chuyển trạng thái "chờ đối soát", sau đó đối soát lại hoặc creator xác nhận tay. Không để mất khách |
| **Outbox pattern** | Webhook chỉ ghi event rồi trả 200. Job xử lý sau, có retry, có dead-letter queue và cảnh báo |
| **Synthetic monitoring** | Cứ 10 phút một bot Playwright chạy thử flow mua bằng sandbox; lỗi là báo ngay |
| **Editor không mất chữ** | Autosave vào IndexedDB và lên server; khi mở 2 tab cùng lúc thì cảnh báo xung đột |
| **Theme có version** | Update hệ thống không tự đổi giao diện trang của creator; creator tự bấm nâng cấp theme |
| **Release an toàn** | Có feature flag và rollout từ từ (canary); migration DB luôn tương thích ngược |
| **Backup** | Postgres PITR, backup R2 hằng tuần, mỗi quý chạy thử restore một lần |

### 2.3 Mục tiêu (SLO)
| Chỉ số | Mục tiêu |
|--------|----------|
| Uptime trang public | 99,95% |
| Uptime checkout | 99,9% |
| TTFB trang public (p95) | Dưới 200ms |
| Thời gian từ lúc trả tiền tới lúc nhận email file (p95) | Dưới 30 giây |
| Tỉ lệ đơn đã trả tiền mà không giao được | 0% |

---

## 3. Rẻ thật, rẻ công bằng

### 3.1 Bảng giá mới (thay cho mục 1.7 trong LINKYY.md)
| Gói | Giá | Có gì |
|-----|-----|-------|
| **Free** | 0đ mãi mãi | Link không giới hạn, 5 sản phẩm, 30 đơn/tháng, **0% phí**, Loa Ting Ting, Bio Sống, Fan Passport cơ bản, export dữ liệu |
| **Pro** | 49k/tháng · 449k/năm | Không giới hạn, Drop Mode, Smart Rules, Booth Mode, Commission Board, custom domain, analytics đầy đủ, bỏ watermark |
| ⭐ **Pro Công Bằng** | **0đ** cho tháng nào doanh thu qua Linkyy dưới 500k | Áp dụng tự động cho mọi user Pro. **Chưa kiếm ra tiền thì chưa phải trả tiền** |
| **Pro Sinh Viên** | 25k/tháng | Xác minh bằng email trường hoặc thẻ sinh viên |
| **Day Pass** | 5k/24 giờ | Mở Pro đúng ngày drop |
| **Founding 100** | 299k/năm, khóa giá trọn đời | 100 creator đầu tiên, có huy hiệu Founding |
| **Kiếm Pro free** | 0đ | Mời bạn, giữ streak, đạt milestone |
| **Add-on** | Theo dùng | Thông báo qua Zalo ZNS (tính theo tin), sound pack, theme |

> Pro Công Bằng chạy được vì Linkyy biết doanh thu qua webhook. Cuối tháng nếu doanh thu đạt 500k trở lên thì gửi link thanh toán VietQR. Creator không trả thì tháng sau tự về gói Free, dữ liệu vẫn giữ nguyên.

### 3.2 Giữ chi phí thấp để bán được giá thấp
| Khoản | Cách làm |
|-------|----------|
| Tải file (thường tốn nhất) | Lưu file sản phẩm trên **Cloudflare R2**, không tính phí egress |
| Lượt xem trang | Snapshot tĩnh và cache trên CDN, gần như không tốn compute |
| Email | Bắt đầu bằng free tier của Resend, đông lên thì chuyển sang Amazon SES (khoảng $0,10 mỗi 1.000 email) |
| Thông báo | Telegram bot và Web Push miễn phí; Zalo ZNS tốn tiền nên làm add-on |
| Realtime | Heartbeat ghi vào Redis thay vì giữ websocket; SSE chỉ mở khi tab đang hiện |
| AI | Model nhỏ, prompt caching, quota theo gói |
| Analytics | Gom theo ngày (rollup), event thô chỉ giữ 90 ngày |
| Hosting | Bắt đầu với Vercel; khi băng thông lớn thì cân nhắc chuyển sang Cloudflare (OpenNext) |

**Mục tiêu**: chi phí hạ tầng của mỗi creator Free dưới 1.000đ/tháng. Như vậy gói Free hào phóng được mà không lỗ.

---

## 4. Vòng lặp giữ chân

```
        ┌──────────── Creator share link bio ─────────────┐
        ▼                                                 │
   Fan vào trang ──▶ Bio Sống (thấy người khác tip) ──▶ Mua / Tip / Hỏi Xoáy
        ▲                                                 │
        │                                                 ▼
 Drop Mode nhắc fan quay lại          🔊 Ting ting! Creator sướng, quay clip đăng TikTok
        ▲                                                 │
        │                                                 ▼
 Fan Passport: con dấu, level, perk ◀── Creator đặt perk cho fan trung thành
        │                                                 │
        ▼                                                 ▼
 "Fan của X cũng thích Y"            Streak, Milestone, Wrapped ──▶ share ──▶ creator mới
 ──▶ creator mới có fan ngay ──────────────────────────────▶ Linkyy lớn lên
```

| Loại giữ chân | Đến từ đâu |
|---------------|------------|
| **Thói quen** | Ting ting mỗi đơn, streak, Wrapped hằng tháng |
| **Giá trị tích lũy** | Level và perk của fan, lịch sử commission, con dấu đã phát |
| **Mạng lưới** | Fan Passport khám phá creator chéo nhau, Mua Chung, Mời Bạn Mở Khóa |
| **Niềm tin** | Trang bất tử, khóa giá, Pro Công Bằng, export dữ liệu |

---

## 5. Roadmap cập nhật

| Phase | Thời gian | Nội dung |
|-------|-----------|----------|
| 0. Validate | 1 tuần | Như cũ. Thêm việc: hỏi creator xem họ thích signature feature nào nhất |
| 1. MVP | **5 tuần** (thêm 1 tuần) | Toàn bộ P0 cũ, cộng: **Loa Ting Ting**, **snapshot tĩnh + checkout dự phòng**, **export dữ liệu**, lưu file trên R2 |
| 2. Beta | Tuần 6–8 | Bio Sống, Fan Passport v1 (con dấu + level), Drop Mode, Hỏi Xoáy, Mời Bạn Mở Khóa, Tủ Đồ Affiliate, Streak |
| 3. Launch | Tuần 9–11 | Pro + Pro Công Bằng + Founding 100, Booth Mode, Commission Board, Smart Rules, Bio Wrapped, status page |
| 4. Growth | Tháng 4–6 | Mua Chung, Trợ Lý AI, perk nâng cao trong Fan Passport, Theme Store và sound pack, overlay OBS |

---

## 6. Bổ sung kỹ thuật

### Bảng DB mới
```sql
fans              (id, email UNIQUE, display_name, avatar_url, is_public, created_at)
stamps            (id, creator_id, name, image_url, kind 'default'|'event', limited_count, starts_at, ends_at)
fan_stamps        (fan_id, stamp_id, order_id, earned_at, PK(fan_id, stamp_id))
fan_levels        (creator_id, fan_id, total_support int, level, updated_at, PK(creator_id, fan_id))
level_perks       (id, creator_id, level, type 'discount'|'file'|'early_access'|'wall', config jsonb)
drops             (id, creator_id, product_id, starts_at, early_access_level, slots, status)
drop_reminders    (id, drop_id, email, channel, sent_at)
questions         (id, creator_id, body, tip_order_id NULL, status, answer jsonb, answered_at, sender_hash)
invite_unlocks    (id, product_id, inviter_email, code UNIQUE, required int, confirmed int, unlocked_at)
invite_visits     (id, unlock_id, invitee_email, confirmed_at, device_hash)
affiliate_items   (id, creator_id, url, platform, title, image_url, price_text, position)
milestones        (id, creator_id, kind, reached_at, reward jsonb)
booth_sessions    (id, creator_id, name, started_at, closed_at, summary jsonb)
physical_items    (id, creator_id, title, price, stock, image_url)          -- chỉ dùng cho Booth Mode
commissions       (id, creator_id, fan_email, type, brief jsonb, quote int, deposit_order_id,
                   final_order_id, status, revision_count, queue_position)
commission_updates(id, commission_id, stage, preview_url, note, created_at)
page_rules        (id, page_id, conditions jsonb, actions jsonb, priority, ab_variant, enabled)
group_buys        (id, product_id, size, discount_pct, leader_email, expires_at, status)
group_members     (id, group_buy_id, email, joined_at, order_id NULL)
push_subscriptions(id, owner_type 'creator'|'fan', owner_id, endpoint, keys jsonb)
page_snapshots    (id, page_id, version, r2_key, created_at)
```

### Thay đổi trong stack
- **Storage**: file sản phẩm chuyển từ Supabase Storage sang **Cloudflare R2** (dùng S3 SDK, signed URL). Ảnh public vẫn qua CDN.
- **Realtime**: Upstash Redis (đếm người xem, hàng chờ Drop) và SSE / Supabase Realtime (tip bay, slot).
- **Push**: Web Push (VAPID, thư viện `web-push`) và Telegram Bot API.
- **Card share**: `next/og` (Satori) cho card Wrapped và card trả lời Hỏi Xoáy.
- **Monitoring**: thêm Playwright synthetic check và status page (ví dụ Upptime chạy trên GitHub Pages, miễn phí).

---

## 7. Rủi ro & điều cần kiểm tra
| Vấn đề | Ghi chú |
|--------|---------|
| Nhồi quá nhiều tính năng | Mỗi phase chỉ ship vài cái, đo bằng dữ liệu, cái nào không ai dùng thì bỏ |
| Pro Công Bằng làm giảm doanh thu | Đổi lại được niềm tin và giữ chân. Theo dõi MRR theo cohort; mức 500k có thể chỉnh |
| Fan Passport đụng tới dữ liệu cá nhân | Opt-in rõ ràng, mặc định private, có chức năng xóa dữ liệu, tuân thủ quy định bảo vệ dữ liệu cá nhân của VN |
| Mời Bạn Mở Khóa và Mua Chung | Kiểm tra quy định về khuyến mại; chống gian lận bằng xác nhận email và device hash |
| Voice tip và Hỏi Xoáy có thể bị lạm dụng | Creator duyệt trước khi hiện, lọc bằng AI, có nút chặn |
| Web Push trên iOS bị giới hạn | Hướng dẫn "Thêm vào màn hình chính", dùng Telegram làm kênh chính |
