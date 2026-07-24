# Tập huấn Google AI Studio

Nền tảng học qua thực hành giúp giáo viên biến giáo án thành game hoặc website học tập với Google AI Studio.

## Tính năng

- Lộ trình 7 bài học lưu bằng MDX.
- Prompt Builder 4 bước, preview, copy, download và mở AI Studio.
- Thư viện 10 dạng game, prompt nâng cấp, gallery và FAQ.
- Tự lưu bản nháp bằng localStorage; không backend, database hay đăng nhập.
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

