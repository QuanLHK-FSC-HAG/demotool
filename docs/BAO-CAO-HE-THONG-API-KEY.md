# Báo cáo hệ thống API key đa nhà cung cấp

## Phạm vi hoàn thành

- Website không mở modal khi tải trang và hoạt động đầy đủ khi không có API key.
- Hỗ trợ Google Gemini và OpenAI qua provider registry chung.
- API key cũ của OpenAI được chuyển sang cấu trúc mới với provider `openai`, chế độ model `auto` và giữ nguyên lựa chọn local/session storage.
- Model được lấy động theo quyền thực tế của API key.
- Có chọn model Tự động, chọn thủ công và fallback có phân loại lỗi.
- Prompt Builder có tác vụ thật **AI gợi ý mục tiêu**; nếu chưa kết nối, modal mở và tác vụ tự tiếp tục sau khi kết nối.
- Bộ đếm truy cập và Upstash Redis không nhận hoặc lưu API key.
- Thư viện hiện có 19 sản phẩm nội dung: 3 Tiểu học, 11 THCS–THPT và 5 STEM; mỗi môn/lĩnh vực được liệt kê đều có một trang chi tiết, prompt hoàn chỉnh và hướng dẫn tùy biến.

## File đã tạo

- `lib/ai/types.ts`: kiểu dữ liệu chung cho provider, connection, model và task.
- `lib/ai/errors.ts`: mã lỗi chuẩn hóa và danh sách lỗi được phép fallback.
- `lib/ai/catalog.ts`: catalog tập trung dùng khi provider không trả đủ metadata.
- `lib/ai/model-selector.ts`: lọc, chấm điểm và xếp hạng model.
- `lib/ai/tasks.ts`: prompt hệ thống theo từng tác vụ được cho phép.
- `lib/ai/storage.ts`: local/session storage và migration key OpenAI cũ.
- `lib/ai/api.ts`: giới hạn payload và kiểm tra API key server-side.
- `lib/ai/provider-registry.ts`: registry adapter.
- `lib/ai/providers/shared.ts`: timeout và chuẩn hóa lỗi HTTP.
- `lib/ai/providers/google/*`: client, chuẩn hóa model và adapter Gemini.
- `lib/ai/providers/openai/*`: client, chuẩn hóa model và adapter OpenAI.
- `app/api/ai/validate/route.ts`: xác thực key và trả danh sách model.
- `app/api/ai/models/route.ts`: làm mới danh sách model.
- `app/api/ai/run/route.ts`: chọn model, chạy tác vụ và fallback.
- `components/ai-connection-provider.tsx`: trạng thái kết nối và pending task.
- `components/ai-connection-modal.tsx`: modal đa nhà cung cấp.
- `app/guide/page.tsx`: hướng dẫn kết nối trên website.
- `docs/HUONG-DAN-SU-DUNG.md`: hướng dẫn đầy đủ.
- `lib/ai/model-selector.test.ts`, `lib/ai/errors.test.ts`: test model selection và fallback.
- `lib/ai/api.test.ts`: test JSON hợp lệ, payload vượt giới hạn và định dạng key.
- `lib/ai/storage.test.ts`: test session/local storage, ngắt kết nối và migration key cũ.
- `lib/ai/providers/adapters.test.ts`: test phản hồi key hợp lệ/không hợp lệ và lọc model của Google/OpenAI bằng provider response mô phỏng.

## File đã sửa

- `components/platform-shell.tsx`: thay OpenAI API bằng Kết nối AI tùy chọn.
- `components/site-header.tsx`: hiển thị provider đang kết nối.
- `components/prompt-builder.tsx`: thêm tác vụ AI gợi ý mục tiêu.
- `components/site-footer.tsx`: thêm link hướng dẫn và Thư viện trải nghiệm.
- `app/faq/page.tsx`: bổ sung FAQ API key, provider, model và quota.
- `app/gallery/page.tsx`: thiết kế lại Thư viện trải nghiệm theo cấp học/STEM.
- `app/globals.css`: giao diện kết nối AI, hướng dẫn và thư viện.
- `app/sitemap.ts`: thêm `/guide`.
- `package.json`: thêm lệnh test.
- `tsconfig.json`: cho phép test TypeScript import tường minh.
- `README.md`: cập nhật hệ thống Google Gemini/OpenAI, model động, fallback và nguyên tắc bảo mật.
- `lib/ai/api.ts`: kiểm tra kích thước payload thực tế ngay cả khi request không có `Content-Length`.
- `lib/ai/errors.ts`, `lib/ai/providers/shared.ts`: phân biệt lỗi key sai với key không có quyền truy cập một model cụ thể.
- `app/gallery/page.tsx`, `app/globals.css`: hiển thị 19 sản phẩm theo ba nhóm và bổ sung giao diện thẻ sản phẩm.
- `app/gallery/[slug]/page.tsx`: route chi tiết tĩnh cho từng trải nghiệm.
- `content/gallery/*.mdx`: 19 hồ sơ trải nghiệm có mục tiêu, cách chơi, prompt và hướng dẫn tùy biến.
- `lib/content.test.ts`: khóa số lượng 3/11/5 và kiểm tra metadata bắt buộc của thư viện.

Các tệp mẫu cũ đã được thay bằng danh mục nội dung mới; demo và mã nguồn chỉ hiển thị trạng thái chờ xuất bản, không dùng đường dẫn giả.

## Kiến trúc provider

Component không gọi trực tiếp Google hoặc OpenAI. Mọi request đi qua `/api/ai/*`, provider registry chọn adapter tương ứng, adapter lấy model từ API chính thức và chuẩn hóa thành `AIModelInfo`.

Google dùng header `x-goog-api-key`; OpenAI dùng header Bearer. Key không nằm trong URL và không được trả lại response.

## Luồng xác thực và lưu key

1. Người dùng chọn provider và nhập key.
2. `/api/ai/validate` gọi API danh sách model của provider.
3. Server lọc model có khả năng tạo nội dung và trả metadata đã chuẩn hóa, không trả key.
4. Browser lưu connection vào `sessionStorage` hoặc `localStorage`.
5. Nếu phát hiện key OpenAI cũ, browser migration sang connection mới mà không xóa đột ngột.

## Chọn model và fallback

Tác vụ khai báo capabilities thay vì tên model. Selector loại model deprecated, preview khi không được phép và model thiếu capability; sau đó ưu tiên stable, free/low-cost và context phù hợp.

Khi model lỗi quota, rate limit, unavailable, không có quyền truy cập, unsupported input hoặc provider tạm lỗi, route thử các model tiếp theo trong tối đa bốn ứng viên. Invalid key, policy rejection và invalid request không được fallback.

Nếu model thủ công biến mất, connection được đổi về `auto`, `preferredModel` thành `null` và người dùng nhận thông báo.

## Bảo mật

- Giới hạn kích thước body cho validate/models/run bằng cả header và số byte thực tế.
- Timeout request provider 15 giây.
- `Cache-Control: no-store` cho toàn bộ response có liên quan key.
- Không log body, key hoặc token.
- Không lưu key server-side, Redis, analytics hoặc database.
- Google key không gửi sang OpenAI và ngược lại.
- Input key luôn là password, có nút hiện/ẩn do người dùng chủ động.

## Kết quả kiểm thử

- `npm.cmd test`: đạt 16/16 test.
- Auto selection: đạt.
- Manual selection: đạt.
- Manual model bị loại bỏ: đạt, chuyển Auto kèm notice.
- Fallback quota/model unavailable: đạt.
- Không fallback invalid key/policy: đạt.
- Không có model phù hợp: đạt.
- `npm.cmd run typecheck`: đạt.
- `npm.cmd run lint`: đạt, 0 warning.
- `npm.cmd run build`: đạt; tạo 29 trang/routes, gồm `/api/ai/validate`, `/api/ai/models`, `/api/ai/run`, `/guide` và `/gallery`.
- Build còn cảnh báo thông tin rằng Next.js plugin chưa được ESLint tự nhận diện; lint vẫn đạt 0 warning theo cấu hình dự án.

## Giới hạn thực tế

- Không có Google/OpenAI API key thật trong môi trường Codex, nên các trường hợp key hợp lệ/không hợp lệ được kiểm thử bằng phản hồi HTTP mô phỏng; chưa xác nhận quota và quyền model trên tài khoản thật.
- Kết nối tài liệu OpenAI trực tuyến bị lớp quyền mạng chặn. Implementation dùng API Models và Responses ổn định; không dựa vào một tên model cụ thể.
- OpenAI Models API không công bố đầy đủ capability và chi phí. Hệ thống ưu tiên metadata API, sau đó dùng catalog family tập trung và heuristic cuối cùng; catalog cần được rà soát định kỳ.
- Lần kết nối đầu mặc định Auto. Người dùng mở lại Quản lý kết nối để chọn model thủ công từ danh sách đã tải.

## Thêm provider mới

1. Mở rộng `AIProviderId` trong `lib/ai/types.ts`.
2. Tạo client, model normalizer và adapter trong `lib/ai/providers/<provider>`.
3. Đăng ký adapter trong `lib/ai/provider-registry.ts`.
4. Thêm provider vào modal và catalog tập trung.
5. Thêm test lỗi, model selection và API route.

## Cập nhật catalog model

Chỉ chỉnh `lib/ai/catalog.ts`. Không đặt tên hoặc quy tắc model rải rác trong component, API route hoặc logic tác vụ.
