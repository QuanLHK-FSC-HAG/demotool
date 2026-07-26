import type { AITaskId } from "@/lib/ai/types";

export function buildTaskPrompt(task: AITaskId, input: Record<string, unknown>) {
  const data = JSON.stringify(input, null, 2);
  const instructions: Record<AITaskId, string> = {
    "improve-learning-objectives": "Viết lại mục tiêu học tập bằng tiếng Việt, rõ ràng, đo lường được, phù hợp môn và khối lớp. Trả về 3-5 gạch đầu dòng, không thêm lời dẫn.",
    "summarize-lesson": "Tóm tắt nội dung bài học bằng tiếng Việt thành các ý cốt lõi chính xác, dễ dùng để thiết kế hoạt động học tập.",
    "review-prompt": "Đánh giá prompt tạo mini webapp giáo dục, chỉ ra điểm thiếu và đề xuất phiên bản cải thiện ngắn gọn, khả thi.",
  };
  return `${instructions[task]}\n\nDữ liệu đầu vào:\n${data}`;
}
