# Architecture

## Nguyên tắc

Ứng dụng content-first, front-end only và tách logic tạo prompt khỏi UI. Server Components đọc MDX khi build; Client Components chỉ dùng khi có tương tác.

## Cấu trúc

```text
app/                 Routes, metadata, layout
components/          UI tái sử dụng và Prompt Builder
content/             lessons, games, gallery dưới dạng MDX
hooks/               localStorage hook
lib/content.ts       Content repository
lib/prompt-engine/   Types và template tạo prompt
public/              Static assets
```

## Luồng dữ liệu

MDX → `lib/content.ts` → Server Page → card/detail. Prompt form → `PromptInput` → `buildPrompt()` → preview/copy/export. Bản nháp được serialize vào `teachermate-prompt-draft` trong localStorage.

## Mở rộng

Thêm collection mới qua content repository; thêm game trong `lib/constants.ts` và file MDX tương ứng; thêm biến thể prompt trong `lib/prompt-engine`. Không đặt nội dung khóa học trực tiếp trong component.
