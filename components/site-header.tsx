"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, KeyRound } from "lucide-react";
import { useApiKey } from "@/components/api-key-provider";

export function SiteHeader() {
  const { connected, openModal } = useApiKey();
  return <header className="site-header"><div className="header-inner"><Link className="brand" href="/" aria-label="Tập huấn Google AI Studio - Trang chủ"><Image className="brand-logo" src="/fpt-education-mark.png" alt="FPT Education" width={151} height={50} priority/><span className="brand-title"><small>CHƯƠNG TRÌNH TẬP HUẤN</small><b>Google AI Studio</b></span></Link><div className="header-context"><span className="header-dot"/><p><b>Vibe Coding with QuanLHK</b></p></div><button className={`header-api-button ${connected ? "connected" : ""}`} onClick={openModal}>{connected ? <CheckCircle2/> : <KeyRound/>}<span><small>OpenAI API</small><b>{connected ? "Đã kết nối" : "Kết nối API key"}</b></span></button></div></header>;
}
