"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, CircleHelp, GalleryHorizontalEnd, Gamepad2, KeyRound, LayoutDashboard, LogOut, Puzzle, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { AIConnectionModal } from "@/components/ai-connection-modal";
import { AIConnectionProvider, useAIConnection } from "@/components/ai-connection-provider";
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
  { href: "/gallery", label: "Thư viện trải nghiệm", icon: GalleryHorizontalEnd },
  { href: "/faq", label: "Trợ giúp", icon: CircleHelp },
];

function RightRail() {
  const { connected, connection, openModal, disconnect, notice } = useAIConnection();
  const providerName = connection?.provider === "google" ? "Google Gemini" : "OpenAI";
  return <aside className="right-rail" aria-label="Trạng thái tài khoản"><section className={`rail-card api-status-card ${connected ? "connected" : ""}`}><div className="rail-card-icon"><KeyRound/></div><span className="rail-label">KẾT NỐI AI</span><h2>{connected ? providerName : "Chưa kết nối"}</h2><p>{connected ? `Chế độ ${connection?.modelMode === "manual" ? "chọn model thủ công" : "tự động chọn model"}.` : "Không bắt buộc. Chỉ kết nối khi bạn muốn dùng tính năng hỗ trợ AI."}</p>{notice && <p className="connection-notice">{notice}</p>}<button className="button full" onClick={openModal}>{connected ? "Quản lý kết nối" : "Kết nối AI"}</button>{connected && <button className="rail-text-button" onClick={disconnect}><LogOut/> Ngắt kết nối</button>}</section><VisitStats/><section className="rail-card safety-card"><ShieldCheck/><div><b>Quyền riêng tư</b><p>Không lưu API key vào GitHub, Redis hoặc cơ sở dữ liệu của website.</p></div></section></aside>;
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <><SiteHeader/><div className="platform-grid"><aside className="left-rail" aria-label="Menu chức năng"><div className="left-rail-heading"><Sparkles/><span><small>KHÔNG GIAN</small><b>Thực hành AI</b></span></div><nav>{navigation.map(({ href, label, icon: Icon }) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link className={cn(active && "active")} href={href} key={href}><Icon/><span>{label}</span></Link>; })}</nav><div className="left-rail-tip"><b>Mẹo nhỏ</b><p>Bắt đầu bằng một bài bạn sắp dạy để mọi bước thực hành đều có ý nghĩa.</p></div></aside><div className="platform-center"><main id="main">{children}</main><SiteFooter/></div><RightRail/></div><AIConnectionModal/></>;
}

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return <AIConnectionProvider><ShellContent>{children}</ShellContent></AIConnectionProvider>;
}
