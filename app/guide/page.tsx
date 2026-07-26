import type { Metadata } from "next";
import { Bot, CheckCircle2, KeyRound, RefreshCcw, ShieldCheck, SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = { title: "Hướng dẫn kết nối AI" };

const steps = [
  [KeyRound, "Chỉ kết nối khi cần", "Bạn có thể học, tạo prompt, sao chép và tải prompt mà không cần API key."],
  [Bot, "Chọn nhà cung cấp", "Google Gemini phù hợp luồng Google AI Studio; OpenAI là lựa chọn bổ sung."],
  [SlidersHorizontal, "Để chế độ Tự động", "Hệ thống lấy model mà key thực sự truy cập được rồi ưu tiên model ổn định, phù hợp tác vụ."],
  [RefreshCcw, "Fallback an toàn", "Nếu model hết quota hoặc ngừng khả dụng, hệ thống thử model phù hợp khác nhưng không bỏ qua lỗi API key."],
] as const;

export default function GuidePage() {
  return <>
    <section className="page-hero compact"><div className="container"><span className="eyebrow"><Bot/> Kết nối tùy chọn</span><h1>Dùng AI khi cần, <span>không bị AI cản đường.</span></h1><p>Website luôn dùng được khi chưa có API key. Kết nối chỉ xuất hiện khi bạn chủ động chọn một tính năng hỗ trợ AI.</p></div></section>
    <section className="section"><div className="container guide-grid">{steps.map(([Icon, title, description], index) => <article className="guide-card" key={title}><span>{String(index + 1).padStart(2, "0")}</span><Icon/><h2>{title}</h2><p>{description}</p></article>)}</div></section>
    <section className="section soft-section"><div className="narrow guide-content"><h2>Cách kết nối</h2><ol><li>Bấm <b>Kết nối AI</b> ở đầu trang hoặc dùng một nút có biểu tượng AI.</li><li>Chọn Google Gemini hoặc OpenAI.</li><li>Dán API key vào ô mật khẩu; key luôn được che.</li><li>Giữ <b>Tự động chọn</b> hoặc chọn model thủ công sau khi danh sách model đã tải.</li><li>Chọn ghi nhớ nếu đây là thiết bị cá nhân, rồi bấm <b>Kết nối và tiếp tục</b>.</li></ol><div className="guide-security"><ShieldCheck/><div><h3>Bảo vệ API key</h3><p>Key chỉ nằm trong sessionStorage hoặc localStorage theo lựa chọn của bạn. Website không lưu key vào Redis, analytics, database hay GitHub.</p></div></div><h2>Khi có lỗi</h2><div className="guide-checks"><p><CheckCircle2/> <b>Hết quota:</b> thử model khác hoặc kiểm tra hạn mức tại nhà cung cấp.</p><p><CheckCircle2/> <b>Model bị ngừng:</b> hệ thống tự chuyển về chế độ Tự động.</p><p><CheckCircle2/> <b>API key sai:</b> tạo key mới, đổi key trong Kết nối AI và thu hồi key cũ.</p><p><CheckCircle2/> <b>Muốn ngắt:</b> bấm Ngắt kết nối ở thanh bên phải.</p></div></div></section>
  </>;
}
