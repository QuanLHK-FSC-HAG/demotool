<div align="center">

# 🎓 Vibe Coding cùng Google AI Studio

### Biến ý tưởng dạy học thành game và website tương tác

<img src="./FSC%20HAG.jpg" alt="Trường Tiểu học, THCS và THPT FPT Hậu Giang" width="100%" />

<br />

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google AI Studio](https://img.shields.io/badge/Google_AI_Studio-Powered-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

> **Mỗi giáo viên là một nhà sáng tạo học liệu số.**

</div>

---

## 📖 Giới thiệu

Đây là nền tảng học qua thực hành dành cho giáo viên, giúp chuyển một ý tưởng, bài học hoặc giáo án thành **game giáo dục**, **website tương tác** và **học liệu số** với sự hỗ trợ của **Google AI Studio**.

Dự án được xây dựng phục vụ hoạt động tập huấn và chia sẻ chuyên môn tại **Trường Tiểu học, THCS và THPT FPT Hậu Giang**.

Nền tảng tập trung vào trải nghiệm đơn giản: giáo viên chọn dạng sản phẩm, xây dựng prompt theo từng bước, sao chép sang AI Studio và tiếp tục chỉnh sửa sản phẩm theo nhu cầu thực tế.

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 📚 Lộ trình học tập | Gồm 7 bài học được tổ chức bằng MDX, phù hợp để học tuần tự hoặc tra cứu nhanh. |
| 🧩 Prompt Builder | Quy trình 4 bước giúp giáo viên xây dựng prompt rõ ràng và có cấu trúc. |
| 👀 Xem trước nội dung | Kiểm tra prompt trước khi sao chép hoặc tải xuống. |
| 📋 Sao chép nhanh | Sao chép prompt để sử dụng trực tiếp trong Google AI Studio. |
| 🎮 Thư viện ý tưởng | Cung cấp 10 dạng game, prompt nâng cấp, thư viện sản phẩm và câu hỏi thường gặp. |
| 💾 Tự lưu bản nháp | Nội dung đang làm được lưu trên trình duyệt bằng `localStorage`. |
| 🔑 API key cá nhân | Người dùng có thể kết nối OpenAI API key để sử dụng một số tính năng hỗ trợ. |
| 📱 Responsive | Giao diện thích ứng với máy tính, máy tính bảng và điện thoại. |
| ♿ Khả năng tiếp cận | Có metadata SEO, sitemap và các thiết lập accessibility cơ bản. |

---

## 🚀 Quy trình sử dụng

```text
Chọn bài học hoặc dạng sản phẩm
              ↓
Điền thông tin vào Prompt Builder
              ↓
Xem trước và hoàn thiện prompt
              ↓
Sao chép hoặc tải prompt xuống
              ↓
Mở Google AI Studio để tạo sản phẩm
              ↓
Kiểm thử, chỉnh sửa và chia sẻ
```

---

## 🛠️ Công nghệ sử dụng

- **Next.js App Router** – xây dựng ứng dụng web hiện đại.
- **TypeScript** – tăng độ an toàn và khả năng bảo trì mã nguồn.
- **Tailwind CSS 4** – thiết kế giao diện responsive.
- **MDX** – quản lý nội dung bài học linh hoạt.
- **Lucide Icons** – hệ thống biểu tượng giao diện.
- **Web Storage API** – lưu bản nháp trên thiết bị người dùng.
- **Vercel Serverless Functions** – xử lý endpoint kiểm tra API key.

---

## 🔐 Bảo mật API key

API key được gửi đến endpoint `/api/openai/validate` để xác nhận với OpenAI. Khóa không được ghi vào GitHub hoặc cơ sở dữ liệu của dự án.

- Khi người dùng **không chọn ghi nhớ**, API key chỉ nằm trong `sessionStorage` và sẽ mất khi phiên trình duyệt kết thúc.
- Khi người dùng **chủ động chọn ghi nhớ**, API key được lưu trong `localStorage` trên chính thiết bị đó.
- Không nên đưa API key vào mã nguồn, file `.env` công khai, commit GitHub hoặc ảnh chụp màn hình.

---

## 📊 Bộ đếm người dùng

Bộ đếm hiện tại chỉ ghi nhận số API key khác nhau đã được xác nhận trên trình duyệt đang sử dụng. Đây không phải là số người dùng toàn cầu.

Để xây dựng bộ đếm toàn hệ thống, nên sử dụng một dịch vụ lưu trữ phía server như:

- Vercel KV hoặc Redis.
- Supabase.
- Firebase.
- Một cơ sở dữ liệu serverless tương đương.

Không nên để website tự cập nhật số liệu trực tiếp vào GitHub vì cách này cần token có quyền ghi repository, khó kiểm soát bảo mật và dễ tạo số liệu sai lệch.

---

## 👨‍🏫 Tác giả

**QuanLHK**  
Tổ Khoa học Tự nhiên  
Trường Tiểu học, THCS và THPT FPT Hậu Giang

---

<div align="center">

### ⭐ Hãy đánh dấu Star nếu dự án hữu ích

**Vibe Coding · Google AI Studio · Học liệu số dành cho giáo viên**

**Designed with ❤️ by QuanLHK (FSC HAG)**

</div>

