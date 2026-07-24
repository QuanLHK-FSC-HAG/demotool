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

## 💻 Chạy dự án trên máy tính

### 1. Sao chép repository

```bash
git clone https://github.com/QuanLHK-FSC-HAG/demotool.git
cd demotool
```

### 2. Cài đặt thư viện

```bash
npm install
```

### 3. Khởi chạy môi trường phát triển

```bash
npm run dev
```

Sau đó mở địa chỉ:

```text
http://localhost:3000
```

> Đây là ứng dụng Next.js nên không thể chạy bằng cách mở trực tiếp file `index.html`. Route trang chủ nằm tại `app/page.tsx`.

---

## ✅ Kiểm tra trước khi triển khai

```bash
npm run lint
npm run typecheck
npm run build
```

Hoặc chạy liên tiếp:

```bash
npm run lint && npm run typecheck && npm run build
```

---

## 🌐 Triển khai lên Vercel

1. Đăng nhập Vercel bằng tài khoản GitHub.
2. Chọn **Add New Project**.
3. Import repository `QuanLHK-FSC-HAG/demotool`.
4. Giữ nguyên cấu hình mặc định do Vercel tự nhận diện Next.js.
5. Chọn **Deploy**.

Vercel sẽ tự động build lại website mỗi khi có commit mới được đẩy lên nhánh triển khai.

Xem thêm hướng dẫn trong [`DEPLOYMENT.md`](./DEPLOYMENT.md).

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

## 📂 Tài liệu dự án

- [`DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md) – hướng dẫn phát triển và bổ sung nội dung.
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) – hướng dẫn triển khai website.

---

## 🖼️ Ảnh đại diện

README sử dụng file ảnh sau tại thư mục gốc của repository:

```text
FSC HAG.jpg
```

Đường dẫn Markdown/HTML tương ứng:

```html
<img src="./FSC%20HAG.jpg" alt="FPT School Hậu Giang" />
```

---

## 🎯 Định hướng phát triển

- Mở rộng thư viện game và học liệu theo từng môn học.
- Bổ sung prompt mẫu theo cấp học và mục tiêu bài dạy.
- Cho phép giáo viên lưu và quản lý sản phẩm cá nhân.
- Tích hợp thêm các mô hình AI phù hợp với giáo dục.
- Xây dựng kho sản phẩm để giáo viên tham khảo và chia sẻ.

---

## 👨‍🏫 Tác giả

**QuanLHK**  
Tổ Khoa học Tự nhiên  
Trường Tiểu học, THCS và THPT FPT Hậu Giang

---

<div align="center">

### ⭐ Hãy đánh dấu Star nếu dự án hữu ích

**Vibe Coding · Google AI Studio · Học liệu số dành cho giáo viên**

Made with ❤️ at FPT School Hậu Giang

</div>
