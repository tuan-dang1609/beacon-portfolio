# Hướng dẫn setup OBS với Camera Overlay

## Vấn đề

OBS Browser Source **KHÔNG THỂ** truy cập camera qua `getUserMedia()` vì lý do bảo mật của Chromium Embedded Framework (CEF).

## Giải pháp: Dùng Window Capture

### Bước 1: Mở Overlay trong Browser riêng

1. Mở **Google Chrome** (hoặc Edge, Firefox)
2. Truy cập: `http://localhost:5173?id=YOUR_DISCORD_ID`
   - Thay `YOUR_DISCORD_ID` bằng Discord ID của bạn
3. **Quan trọng:** Cho phép camera khi browser hỏi
4. Thu nhỏ cửa sổ browser (không đóng)

### Bước 2: Setup Window Capture trong OBS

1. Trong OBS, click **+** ở Sources
2. Chọn **Window Capture**
3. Đặt tên: "Discord Voice Overlay"
4. Settings:
   - **Window:** Chọn Chrome window với overlay
   - **Capture Method:** Windows 10 (1903 and up)
   - ✅ **Client Area** (bỏ titlebar)
5. Click **OK**

### Bước 3: Xóa Background (Optional)

Nếu muốn background trong suốt:

1. Right-click lên Window Capture source → **Filters**
2. Click **+** → **Chroma Key**
3. Settings:
   - **Key Color Type:** Custom
   - **Key Color:** Black (`#000000`)
   - **Similarity:** 400-500
   - **Smoothness:** 80-100

### Bước 4: Test

1. Bật camera trong Discord
2. Video sẽ hiện ngay trong OBS! 🎉

---

## Giải pháp thay thế: OBS Virtual Camera

Nếu muốn dùng Browser Source (không cần Window Capture):

### Bước 1: Enable OBS Virtual Camera

1. Trong OBS: **Start Virtual Camera**
2. Một virtual webcam sẽ được tạo

### Bước 2: Trong Discord

1. **User Settings** → **Voice & Video**
2. **Camera:** Chọn **OBS Virtual Camera**
3. Bật camera trong voice channel

### Bước 3: Trong Browser Overlay

1. Mở `http://localhost:5173?id=YOUR_DISCORD_ID&device=obs`
2. Overlay sẽ tự động chọn OBS Virtual Camera

**Nhược điểm:** Bạn sẽ không thấy camera thật của mình trong Discord, chỉ thấy OBS scene.

---

## Khuyến nghị

✅ **Dùng Window Capture** - Đơn giản nhất và hoạt động tốt nhất!
