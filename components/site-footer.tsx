import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return <footer><div className="container footer-grid"><div><Link className="footer-brand" href="/"><Image src="/fpt-education-mark.png" alt="FPT Education" width={196} height={65}/><span className="school-name">TRƯỜNG PHỔ THÔNG FPT</span><strong>Tập huấn Google AI Studio</strong></Link><p>Biến bài học thành trải nghiệm chỉ trong vài phút.</p></div><div><b>Khám phá</b><Link href="/learn">Khóa học</Link><Link href="/games">Thư viện game</Link><Link href="/gallery">Sản phẩm mẫu</Link></div><div><b>Thực hành</b><Link href="/builder">Prompt Builder</Link><Link href="/upgrades">Prompt nâng cấp</Link><Link href="/faq">Trợ giúp</Link></div></div><div className="container footer-bottom"><p className="designer-credit">Designed by QuanLHK with love</p><p className="muted">Phiên bản 1.0 · 2026</p></div></footer>;
}
