"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [["/learn", "Khóa học"], ["/builder", "Tạo Prompt"], ["/games", "Thư viện game"], ["/upgrades", "Nâng cấp"], ["/gallery", "Sản phẩm mẫu"], ["/faq", "Trợ giúp"]];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return <header className="site-header"><div className="container nav-wrap"><Link className="brand" href="/" aria-label="Tập huấn Google AI Studio - Trang chủ"><Image className="brand-logo" src="/fpt-education-mark.png" alt="FPT Education" width={151} height={50} priority/><span className="brand-title">Tập huấn <b>Google AI Studio</b></span></Link><nav className={cn("nav-links", open && "open")} aria-label="Điều hướng chính">{links.map(([href, label]) => <Link key={href} className={path.startsWith(href) ? "active" : ""} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link className="button small mobile-cta" href="/builder">Bắt đầu tạo</Link></nav><Link className="button small desktop-cta" href="/builder">Bắt đầu tạo</Link><button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Đóng menu" : "Mở menu"}>{open ? <X/> : <Menu/>}</button></div></header>;
}
