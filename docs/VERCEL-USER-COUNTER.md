# Bộ đếm người dùng trên Vercel

## Kiến trúc

Frontend tạo một UUID ngẫu nhiên và lưu tại `localStorage` với tên `site_visitor_id`. Component gửi UUID đến `POST /api/visit`; server băm SHA-256 trước khi dùng làm khóa Redis. `GET /api/stats` chỉ trả tổng lượt truy cập, lượt hôm nay, số người đang online và thời gian cập nhật.

Upstash Redis lưu dữ liệu qua REST API từ Vercel Functions. Token chỉ tồn tại trong biến môi trường phía server, không được gửi tới trình duyệt. Website không thu thập hoặc lưu IP, API key OpenAI, tên, email hay nội dung người dùng.

## File liên quan

- `lib/analytics.ts`: giao tiếp Upstash, đếm nguyên tử bằng Lua, ngày theo múi giờ Việt Nam.
- `app/api/visit/route.ts`: xác thực UUID, chống cache và ghi nhận hoạt động.
- `app/api/stats/route.ts`: trả thống kê công khai với cache ngắn.
- `components/visit-stats.tsx`: tạo visitor ID, gọi API và hiển thị số liệu.
- `components/platform-shell.tsx`: đặt bộ đếm ở thanh bên phải.
- `app/globals.css`: giao diện và trạng thái tải.

## Tạo Upstash Redis

1. Đăng nhập Upstash và tạo một Redis database ở khu vực gần người dùng.
2. Mở phần REST API của database.
3. Sao chép `UPSTASH_REDIS_REST_URL` và `UPSTASH_REDIS_REST_TOKEN`.
4. Không chép token vào mã nguồn, tài liệu, ảnh chụp màn hình hoặc GitHub.

## Cấu hình Vercel

1. Mở Vercel → Project → Settings → Environment Variables.
2. Thêm `UPSTASH_REDIS_REST_URL` và `UPSTASH_REDIS_REST_TOKEN`.
3. Chọn Production và Preview; chọn Development nếu dùng `vercel dev`.
4. Lưu biến và redeploy commit mới nhất.

## Chạy local

Sao chép `.env.example` thành `.env.local`, điền hai biến Upstash rồi chạy:

```powershell
npm.cmd install
npm.cmd run dev
```

Không có biến Redis, website vẫn chạy; bộ đếm luôn hiển thị trạng thái chờ kết nối và hai API trả lỗi `503` có kiểm soát.

## Quy tắc và kiểm thử

- Mỗi lần mở hoặc tải lại website tăng tổng và lượt hôm nay ngay lập tức.
- Visitor được xem là online nếu có hoạt động trong 5 phút gần nhất.
- Ngày được tính theo `Asia/Ho_Chi_Minh`.
- F5 được xem là một lượt truy cập mới và tăng bộ đếm thêm `1`.
- Thử visitor mới bằng cửa sổ trình duyệt khác hoặc xóa riêng key `site_visitor_id` trong localStorage.
- Kiểm tra `GET /api/stats` không trả visitor ID hoặc dữ liệu cá nhân.

Chạy kiểm tra mã nguồn:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Điều chỉnh thời gian

Trong `lib/analytics.ts`:

- Đổi `ONLINE_SECONDS` để thay ngưỡng online.
- Đổi `DAILY_TTL_SECONDS` để thay thời gian giữ khóa thống kê theo ngày.

## Gỡ bỏ

1. Xóa `<VisitStats/>` và import tương ứng trong `components/platform-shell.tsx`.
2. Xóa `components/visit-stats.tsx`, `app/api/visit`, `app/api/stats` và `lib/analytics.ts`.
3. Xóa các lớp CSS bắt đầu bằng `.visit-` và hai biến môi trường trên Vercel.

## Bảo mật và quyền riêng tư

Redis token chỉ được đọc trong server routes. Visitor UUID được băm một chiều trước khi dùng trong Redis; ID thô không được lưu phía server. API giới hạn visitor ID ở UUID hợp lệ, không log request body hoặc secret, và endpoint ghi nhận luôn dùng `Cache-Control: no-store`.
