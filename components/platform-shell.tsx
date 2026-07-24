"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, CircleHelp, GalleryHorizontalEnd, Gamepad2, KeyRound, LayoutDashboard, LogOut, Puzzle, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { ApiKeyModal } from "@/components/api-key-modal";
import { ApiKeyProvider, useApiKey } from "@/components/api-key-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisitStats } from "@/components/visit-stats";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/learn", label: "Khóa học", icon: BookOpenCheck },
  { href: "/builder", label: "Tạo Prompt", icon: WandSparkles },
  { href: "/games", label: "Thư viện game", icon: Gamepad2 },
  { href: "/upgrades", label: "Nâng cấp", icon: Puzzle },
  { href: "/gallery", label: "Sản phẩm mẫu", icon: GalleryHorizontalEnd },
  { href: "/faq", label: "Trợ giúp", icon: CircleHelp },
];

function RightRail() {
  const { connected, openModal, disconnect } = useApiKey();
  return <aside className="right-rail" aria-label="Trạng thái tài khoản"><section className={`rail-card api-status-card ${connected ? "connected" : ""}`}><div className="rail-card-icon"><KeyRound/></div><span className="rail-label">OPENAI API</span><h2>{connected ? "Đã kết nối" : "Chưa kết nối"}</h2><p>{connected ? "API key đang sẵn sàng trong phiên làm việc này." : "Kết nối khóa cá nhân để sử dụng công cụ."}</p><button className="button full" onClick={openModal}>{connected ? "Đổi API key" : "Kết nối ngay"}</button>{connected && <button className="rail-text-button" onClick={disconnect}><LogOut/> Ngắt kết nối</button>}</section><VisitStats/><section className="rail-card safety-card"><ShieldCheck/><div><b>Quyền riêng tư</b><p>Không lưu API key vào GitHub hoặc cơ sở dữ liệu của website.</p></div></section></aside>;
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <><SiteHeader/><div className="platform-grid"><aside className="left-rail" aria-label="Menu chức năng"><div className="left-rail-heading"><Sparkles/><span><small>KHÔNG GIAN</small><b>Thực hành AI</b></span></div><nav>{navigation.map(({ href, label, icon: Icon }) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link className={cn(active && "active")} href={href} key={href}><Icon/><span>{label}</span></Link>; })}</nav><div className="left-rail-tip"><b>Mẹo nhỏ</b><p>Bắt đầu bằng một bài bạn sắp dạy để mọi bước thực hành đều có ý nghĩa.</p></div></aside><div className="platform-center"><main id="main">{children}</main><SiteFooter/></div><RightRail/></div><ApiKeyModal/></>;
}

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return <ApiKeyProvider><ShellContent>{children}</ShellContent></ApiKeyProvider>;
}
