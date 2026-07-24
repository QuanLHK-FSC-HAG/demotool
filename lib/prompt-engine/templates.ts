import { gameTypes } from "@/lib/constants";
import type { PromptInput } from "./types";

const labels: Record<string, string> = { responsive: "responsive hoàn hảo trên điện thoại, máy tính bảng và máy tính", dark: "có chế độ sáng/tối", animation: "có chuyển động nhẹ và phản hồi trực quan", sound: "có âm thanh đúng/sai và nút bật/tắt", score: "tính điểm, hiển thị tiến độ và tổng kết", leaderboard: "có bảng xếp hạng lưu trên thiết bị", pwa: "có thể cài đặt như PWA", offline: "hoạt động ngoại tuyến sau lần tải đầu", accessibility: "hỗ trợ bàn phím, screen reader và WCAG AA" };

export function buildPrompt(input: PromptInput) {
  const game = gameTypes.find((x) => x.value === input.gameType)?.label ?? input.gameType;
  const extras = input.upgrades.map((x) => labels[x]).filter(Boolean);
  return `Bạn là chuyên gia thiết kế trải nghiệm học tập và lập trình viên front-end cao cấp.

## Nhiệm vụ bắt buộc
Hãy xây dựng một MINI WEBAPP học tập hoàn chỉnh trong Google AI Studio Build mode. Mini webapp này dùng hoạt động ${game} làm trải nghiệm chính, nhưng phải là một sản phẩm web có giao diện, màn hình, trạng thái và tương tác chạy thật — không chỉ là một đoạn code minh họa hoặc một mockup tĩnh.

## Bối cảnh bài học
- Môn học: ${input.subject}
- Khối lớp: ${input.grade}
- Tên bài: ${input.lessonName || "Chưa đặt tên"}
- Mục tiêu: ${input.objectives || "Giúp học sinh hiểu và vận dụng kiến thức"}
- Nội dung cốt lõi: ${input.content || "Tạo nội dung phù hợp mục tiêu bài học"}
- Từ khóa: ${input.keywords || "Không có"}
- Số câu/thử thách: ${input.questionCount}
- Thời lượng: ${input.duration} phút

## Cấu trúc mini webapp
- Màn hình chào mừng có tên bài, mục tiêu ngắn và nút Bắt đầu.
- Màn hình hướng dẫn chơi với 2–4 bước rõ ràng.
- Màn hình hoạt động ${game} với dữ liệu câu hỏi mẫu bám sát nội dung bài học.
- Thanh tiến độ, trạng thái câu hiện tại, phản hồi đúng/sai và giải thích ngắn.
- Màn hình hoàn thành có điểm, số câu đúng, lời động viên và nút Chơi lại.
- Có trạng thái loading, empty, lỗi và hoàn thành; không có nút giả hoặc dead-end.

## Trải nghiệm & giao diện
- Phong cách: ${input.visualStyle}
- Giao diện tiếng Việt, rõ ràng, phù hợp ${input.grade}; typography hỗ trợ tiếng Việt tốt.
- ${extras.length ? extras.join("\n- ") : "Giao diện responsive và dễ đọc"}

## Yêu cầu kỹ thuật
- Tạo toàn bộ mini webapp chạy độc lập trong Google AI Studio Build mode.
- Dùng HTML, CSS và JavaScript/React phù hợp với môi trường Build mode; không backend, database hay API key.
- Dữ liệu câu hỏi đặt trong một mảng/đối tượng dễ tìm, có chú thích rõ vùng giáo viên cần sửa.
- Mọi nút, chuyển màn hình, tính điểm, chơi lại và phản hồi đều phải hoạt động thật.
- Responsive trên mobile, tablet và desktop; không tràn ngang; vùng bấm tối thiểu 44px.
- Không tải tài nguyên từ nguồn không tin cậy. Kiểm tra lỗi HTML, CSS và JavaScript trước khi bàn giao.

## Tiêu chí hoàn thành
Chỉ bàn giao khi tôi có thể mở preview, bấm Bắt đầu, chơi trọn một lượt, xem điểm, bấm Chơi lại và chỉnh nội dung câu hỏi mà không sửa cấu trúc ứng dụng.

## Bàn giao
1. Tạo mini webapp hoàn chỉnh và chạy ngay.
2. Chú thích vùng giáo viên sửa nội dung, màu sắc và thời lượng.
3. Mô tả 3 bước để giáo viên kiểm tra, chỉnh sửa và chia sẻ/deploy sản phẩm.`;
}
