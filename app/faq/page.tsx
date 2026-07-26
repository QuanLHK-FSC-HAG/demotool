import type { Metadata } from "next";
import { CircleHelp, LifeBuoy } from "lucide-react";

export const metadata: Metadata = { title: "Trợ giúp & FAQ" };

const groups = [
  {
    title: "Kết nối AI và API key",
    items: [
      ["Website có bắt buộc API key không?", "Không. Bạn vẫn xem khóa học, dùng Prompt Builder cơ bản, sao chép prompt và xem thư viện mà không cần kết nối AI."],
      ["Khi nào website mới hỏi API key?", "Chỉ khi bạn chủ động bấm một tính năng hỗ trợ AI, ví dụ AI gợi ý mục tiêu học tập hoặc kiểm tra prompt."],
      ["Nên chọn Google Gemini hay OpenAI?", "Gemini phù hợp nếu bạn đang làm việc với Google AI Studio. OpenAI là lựa chọn bổ sung. Hệ thống chỉ gửi key đến đúng nhà cung cấp đã chọn."],
      ["Chế độ Tự động chọn model hoạt động thế nào?", "Website lấy danh sách model mà API key thực sự truy cập được, lọc theo tác vụ rồi ưu tiên model ổn định và chi phí thấp."],
      ["Model thủ công biến mất thì sao?", "Hệ thống chuyển về chế độ Tự động và thông báo rõ, thay vì để tính năng AI bị lỗi."],
      ["API key được lưu ở đâu?", "Nếu không chọn ghi nhớ, key nằm trong sessionStorage. Nếu chọn ghi nhớ, key nằm trong localStorage của thiết bị; key không được lưu vào Redis, database hay GitHub."],
    ],
  },
  {
    title: "Khi game không chạy",
    items: [
      ["Màn hình trắng sau khi AI tạo xong?", "Yêu cầu AI mở console, tìm lỗi khiến ứng dụng không render, sửa lỗi và kiểm tra lại toàn bộ luồng. Nếu vẫn lỗi, khôi phục phiên bản trước."],
      ["Bấm nút nhưng không có phản hồi?", "Mô tả chính xác tên nút và điều bạn mong đợi. Yêu cầu AI kiểm tra event handler, trạng thái và lỗi console."],
      ["Giao diện vỡ trên điện thoại?", "Gửi prompt nâng cấp Responsive, nêu kích thước màn hình đang lỗi và yêu cầu kiểm tra tràn ngang."],
    ],
  },
  {
    title: "Khi nội dung chưa tốt",
    items: [
      ["Câu hỏi quá dễ hoặc quá khó?", "Thêm chuẩn đầu ra, ví dụ câu hỏi mong muốn và tỉ lệ mức độ nhận biết, thông hiểu, vận dụng."],
      ["AI viết sai kiến thức?", "Cung cấp nội dung nguồn, yêu cầu chỉ sử dụng dữ liệu đó và kiểm tra từng đáp án. Giáo viên luôn duyệt trước khi dùng."],
      ["Prompt quá dài?", "Giữ bối cảnh, mục tiêu và tiêu chí hoàn thành. Cắt câu lặp và chia nâng cấp thành từng lượt."],
    ],
  },
  {
    title: "Triển khai & chia sẻ",
    items: [
      ["Không thấy nút Deploy?", "Mở ứng dụng trong Build mode, kiểm tra preview rồi tìm Share hoặc Deploy. Tên nút có thể thay đổi theo phiên bản."],
      ["Link chia sẻ yêu cầu quyền truy cập?", "Kiểm tra chế độ chia sẻ và tài khoản Google Workspace. Nếu chính sách trường chặn, xuất code và triển khai qua Vercel."],
      ["Làm sao bảo vệ dữ liệu học sinh?", "Không đưa tên đầy đủ, điểm cá nhân hay dữ liệu nhạy cảm vào prompt. Dùng biệt danh và dữ liệu giả lập khi thử nghiệm."],
    ],
  },
];

export default function FaqPage() {
  return <>
    <section className="page-hero compact faq-hero"><div className="container"><span className="eyebrow"><LifeBuoy/> Bình tĩnh, lỗi nào cũng có cách</span><h1>Gỡ rối bằng câu hỏi <span>đúng và đủ.</span></h1><p>Các tình huống phổ biến khi kết nối AI, tạo sản phẩm và triển khai ứng dụng.</p></div></section>
    <section className="section"><div className="container faq-layout"><aside><CircleHelp/><h2>Mẹo gỡ lỗi</h2><p>Nói rõ bạn đã làm gì, điều gì xảy ra và điều bạn mong muốn. Không gửi API key trong ảnh chụp lỗi.</p></aside><div>{groups.map((group) => <section className="faq-group" key={group.title}><h2>{group.title}</h2>{group.items.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</section>)}</div></div></section>
  </>;
}
