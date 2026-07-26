# Tập huấn Google AI Studio

Nền tảng học qua thực hành giúp giáo viên biến giáo án thành game hoặc website học tập với Google AI Studio.

## Tính năng

- Lộ trình 7 bài học lưu bằng MDX.
- Prompt Builder 4 bước, preview, copy, download và mở AI Studio.
- Thư viện 10 cấu trúc game và 19 trải nghiệm có prompt chi tiết: 3 Tiểu học, 11 THCS–THPT, 5 STEM.
- Tự lưu bản nháp bằng localStorage.
- Kết nối tùy chọn Google Gemini hoặc OpenAI bằng API key cá nhân.
- Tự lấy model theo quyền thực tế của key, hỗ trợ chọn tự động, thủ công và fallback có kiểm soát.
- Responsive, SEO metadata, sitemap và accessibility cơ bản.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Đây là ứng dụng Next.js nên không mở `index.html` trực tiếp; route trang chủ nằm ở `app/page.tsx`. Kiểm tra production bằng `npm run lint && npm run typecheck && npm run build`.

## Công nghệ

Next.js App Router, TypeScript, Tailwind CSS 4, MDX, Lucide Icons và localStorage.

Xem [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) để thêm nội dung và [DEPLOYMENT.md](./DEPLOYMENT.md) để triển khai. Vercel tự nhận diện framework khi bạn import GitHub repository, không cần đổi build command.

## Bảo mật API key

Website không bắt buộc API key. Người dùng vẫn xem khóa học, thư viện, FAQ và dùng Prompt Builder cơ bản bình thường; modal chỉ mở khi họ chủ động dùng một tính năng AI hoặc bấm **Kết nối AI**.

API key được gửi qua các endpoint `/api/ai/*` tới đúng nhà cung cấp đã chọn để xác thực, lấy danh sách model hoặc thực hiện tác vụ. Key không nằm trong URL, log, response, GitHub, Redis hay database. Nếu người dùng không chọn ghi nhớ, khóa nằm trong `sessionStorage`; nếu chủ động chọn ghi nhớ, khóa nằm trong `localStorage` của thiết bị đó.

Danh sách model được lấy động từ Google Gemini hoặc OpenAI theo quyền truy cập thực tế. Logic tác vụ không gắn cứng một model cụ thể; hệ thống ưu tiên model ổn định, chi phí thấp và chỉ fallback với lỗi model, quota, rate limit hoặc dịch vụ tạm thời.

Bộ đếm lượt truy cập hoạt động độc lập với hệ thống API key và không nhận hoặc lưu key của người dùng.

