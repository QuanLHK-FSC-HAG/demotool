# Hướng dẫn sử dụng kết nối AI

## Website không bắt buộc API key

Không cần API key để xem trang chủ, học khóa học, duyệt thư viện game và trải nghiệm, dùng Prompt Builder cơ bản, sao chép hoặc tải prompt và đọc FAQ.

Modal kết nối chỉ mở khi người dùng bấm một tính năng có hỗ trợ AI hoặc chủ động bấm **Kết nối AI**.

## Khi nào cần API key

API key được yêu cầu cho các tác vụ như gợi ý mục tiêu học tập, tóm tắt bài học và kiểm tra prompt. Key chỉ được gửi tới nhà cung cấp mà người dùng chọn.

## Kết nối Google Gemini

1. Tạo key tại `https://aistudio.google.com/app/apikey`.
2. Mở **Kết nối AI** và chọn **Google Gemini**.
3. Dán key, chọn cách lưu và để model ở chế độ Tự động.
4. Bấm **Kết nối và tiếp tục**.

## Kết nối OpenAI

1. Tạo key tại `https://platform.openai.com/api-keys`.
2. Mở **Kết nối AI** và chọn **OpenAI**.
3. Dán key, chọn cách lưu rồi kết nối.

Tài khoản ChatGPT và tài khoản thanh toán API là hai phạm vi riêng. Cần kiểm tra quota tại OpenAI Platform nếu tác vụ báo hết hạn mức.

## Chế độ model Tự động

Đây là chế độ mặc định. Server lấy danh sách model mà API key thực sự truy cập được, loại model không phù hợp, rồi ưu tiên model ổn định và chi phí thấp. Không có model cụ thể nào được gắn cứng trong logic tác vụ.

Nếu model đầu tiên hết quota, bị giới hạn tốc độ hoặc không còn khả dụng, hệ thống thử model tương thích tiếp theo. Hệ thống không fallback khi API key sai, nội dung bị chính sách từ chối hoặc request không hợp lệ.

## Chọn model thủ công

Sau lần kết nối đầu tiên, mở lại **Quản lý kết nối**, chọn **Chọn thủ công** và chọn một model trong danh sách API key được phép dùng.

Nếu model đã lưu biến mất, website chuyển về Tự động và hiển thị thông báo thay vì làm hỏng tác vụ.

## Đổi hoặc ngắt kết nối

- Đổi key hoặc provider: mở **Quản lý kết nối**, chọn provider và nhập key mới.
- Đổi model: để trống ô key nếu giữ nguyên provider, sau đó đổi chế độ model.
- Ngắt kết nối: bấm **Ngắt kết nối** tại thanh bên phải.

## Lưu và bảo vệ API key

- Không chọn ghi nhớ: lưu trong `sessionStorage`, hết phiên trình duyệt sẽ mất.
- Chọn ghi nhớ: lưu trong `localStorage` trên thiết bị hiện tại.
- Key không được lưu vào Redis, database, analytics hoặc GitHub.
- Key không được ghi vào log, URL hoặc response API.
- Không gửi ảnh chụp màn hình có API key và không dùng key trên máy công cộng.

## Xử lý lỗi

- **API key sai:** tạo hoặc dán lại key đúng nhà cung cấp.
- **Hết quota:** kiểm tra billing/quota hoặc chọn model khác.
- **Model ngừng hỗ trợ:** mở quản lý kết nối; hệ thống sẽ tự chuyển về Auto.
- **Không có model phù hợp:** kiểm tra quyền của key hoặc thử nhà cung cấp khác.
- **Giới hạn tốc độ:** chờ một lúc rồi thử lại.
