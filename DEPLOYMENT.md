# Deployment

## Vercel

1. Đẩy repository lên GitHub.
2. Import repository trong Vercel.
3. Framework preset: Next.js; build command: `npm run build`.
4. Không cần biến môi trường cho v1.0.
5. Sau deploy, cập nhật domain trong `metadataBase` và `sitemap.ts`.

## Kiểm tra sau deploy

- Mở mọi route chính và một bài học/game chi tiết.
- Tạo prompt, tải file và mở AI Studio.
- Refresh Prompt Builder để xác nhận bản nháp còn nguyên.
- Kiểm tra Lighthouse, link ngoài và viewport điện thoại.

Node.js 20 LTS trở lên được khuyến nghị.
