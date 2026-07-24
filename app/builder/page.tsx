import type { Metadata } from "next";
import { Suspense } from "react";
import { PromptBuilder } from "@/components/prompt-builder";

export const metadata: Metadata = { title: "Prompt Builder", description: "Tạo prompt hoàn chỉnh để biến bài học thành game trong Google AI Studio." };

export default function BuilderPage() {
  return <><section className="page-hero builder-hero compact"><div className="container"><span className="eyebrow">Phòng thiết kế bài học</span><h1>Từ giáo án đến prompt <span>chỉ trong vài phút.</span></h1><p>Điền điều bạn biết. Hệ thống sẽ sắp xếp thành một yêu cầu rõ ràng để Google AI Studio tạo sản phẩm tốt hơn ngay từ lần đầu.</p></div></section><Suspense fallback={<div className="builder-loading container">Đang mở Prompt Builder...</div>}><PromptBuilder /></Suspense></>;
}

