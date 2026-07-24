# Development Guide

## Lệnh chính

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Thêm bài học

Tạo `content/lessons/slug.mdx` với frontmatter `title`, `description`, `duration`, `order`, `color`. Nội dung hỗ trợ Markdown và component `Tip`, `Check`, `Warning`.

## Thêm game

Thêm metadata vào `gameTypes` trong `lib/constants.ts`, sau đó tạo file cùng slug tại `content/games`. Nếu game cần quy tắc prompt riêng, mở rộng `buildPrompt` thay vì xử lý trong component.

## Quy ước

- Giữ Server Component mặc định; chỉ thêm `use client` cho tương tác.
- Không hardcode nội dung khóa học trong page/component.
- Mọi control cần label, focus state và dùng được bằng bàn phím.
- Kiểm tra ở 360px, 768px, 1024px và 1440px.
