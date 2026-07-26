import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  GalleryHorizontalEnd,
  Sparkles,
  Target,
} from "lucide-react";
import { getContentList } from "@/lib/content";

export const metadata: Metadata = {
  title: "Thư viện trải nghiệm",
  description: "Khám phá các trải nghiệm học tập được xây dựng bằng Google AI Studio dành cho giáo viên.",
};

const collections = [
  {
    title: "Tiểu học",
    key: "tieu-hoc",
    tone: "primary",
    subjects: ["Toán", "Tiếng Việt", "Tiếng Anh"],
  },
  {
    title: "THCS – THPT",
    key: "thcs-thpt",
    tone: "secondary",
    subjects: ["Toán", "Vật lí", "Hóa học", "Sinh học", "Ngữ văn", "Lịch sử", "Địa lí", "Tin học", "Công nghệ", "Khoa học tự nhiên", "Tiếng Anh"],
  },
  {
    title: "STEM",
    key: "stem",
    tone: "accent",
    subjects: ["Khoa học tự nhiên liên môn", "Toán – Tin", "Vật lí – Công nghệ", "Hóa – Sinh", "STEM theo chủ đề"],
  },
] as const;

const experienceDetails = [
  "Chủ đề bài học",
  "Môn học và cấp học",
  "Mục tiêu học tập",
  "Loại trải nghiệm",
  "Prompt hoàn chỉnh",
  "Link demo và mã nguồn",
  "Hướng dẫn tùy biến",
  "Mức độ thử thách",
];

export default function GalleryPage() {
  const items = getContentList("gallery");

  return <>
    <section className="experience-hero">
      <div className="container experience-hero-grid">
        <div>
          <span className="eyebrow"><GalleryHorizontalEnd/> Thư viện trải nghiệm</span>
          <h1>Một bài học.<br/><span>Một trải nghiệm đáng nhớ.</span></h1>
          <p>Khám phá các trải nghiệm học tập được xây dựng bằng Google AI Studio, giúp giáo viên biến nội dung bài học thành hoạt động hấp dẫn, tương tác và phù hợp với từng môn học.</p>
        </div>
        <div className="experience-manifesto">
          <Sparkles/>
          <small>KHÔNG PHẢI KHO BÀI GIẢNG</small>
          <strong>Đây là nơi ý tưởng sư phạm trở thành trải nghiệm có thể chơi, khám phá và tùy biến.</strong>
          <p>Thư viện sẽ chỉ công bố trải nghiệm khi đã có đủ prompt, demo và hướng dẫn tùy biến để giáo viên sử dụng thực tế.</p>
        </div>
      </div>
    </section>

    <section className="experience-section experience-products-section">
      <div className="container">
        <div className="experience-heading"><span>01</span><div><small>19 SẢN PHẨM SẴN SÀNG</small><h2>Thư viện trải nghiệm</h2><p>Mỗi môn hoặc lĩnh vực đều có một sản phẩm tương ứng, kèm prompt hoàn chỉnh và hướng dẫn tùy biến.</p></div></div>
        {collections.map((collection) => {
          const collectionItems = items.filter((item) => item.category === collection.key);
          return <section className={`product-collection group-${collection.tone}`} key={collection.key}>
            <div className="product-collection-heading"><div><small>{String(collectionItems.length).padStart(2, "0")} SẢN PHẨM</small><h3>{collection.title}</h3></div><span>{collection.subjects.join(" · ")}</span></div>
            <div className="experience-product-grid">
              {collectionItems.map((item) => <Link className="experience-product-card" href={`/gallery/${item.slug}`} key={item.slug}>
                <div className="experience-product-top"><span className="experience-product-icon">{item.icon || "✦"}</span><span className="experience-product-number">{String(item.order || 0).padStart(2, "0")}</span></div>
                <div className="experience-product-tags"><span>{item.subject}</span><span>{item.difficulty}</span></div>
                <h4>{item.title}</h4><p>{item.description}</p>
                <div className="experience-product-footer"><span><Clock3/> {item.duration}</span><b>{item.experienceType} <ArrowRight/></b></div>
              </Link>)}
            </div>
          </section>;
        })}
      </div>
    </section>

    <section className="experience-section experience-blueprint-section">
      <div className="container experience-blueprint">
        <div className="blueprint-copy"><span className="eyebrow"><Target/> Hồ sơ trải nghiệm</span><h2>Mỗi mẫu đủ rõ để dùng ngay, đủ mở để làm mới.</h2><p>Giáo viên không chỉ xem thành phẩm mà còn nhận được cấu trúc để hiểu, chỉnh sửa và phát triển trải nghiệm bằng AI.</p></div>
        <div className="blueprint-list">{experienceDetails.map((detail, index) => <div key={detail}><CheckCircle2/><span><small>{String(index + 1).padStart(2, "0")}</small><b>{detail}</b></span></div>)}</div>
      </div>
    </section>

    <section className="experience-closing">
      <div className="container"><small>TRIẾT LÝ CỦA THƯ VIỆN</small><blockquote>Một bài học <i>→</i> Một trải nghiệm học tập <i>→</i> <span>Một lớp học sôi động.</span></blockquote></div>
    </section>
  </>;
}
