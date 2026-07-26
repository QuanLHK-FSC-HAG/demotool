"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, KeyRound } from "lucide-react";
import { useAIConnection } from "@/components/ai-connection-provider";

export function SiteHeader() {
  const { connected, connection, openModal } = useAIConnection();
  const providerName = connection?.provider === "google" ? "Gemini" : "OpenAI";
  return <header className="site-header"><div className="header-inner"><Link className="brand" href="/" aria-label="Tập huấn Google AI Studio - Trang chủ"><Image className="brand-logo" src="/fpt-education-mark.png" alt="FPT Education" width={151} height={50} priority/><span className="brand-title"><small>CHƯƠNG TRÌNH TẬP HUẤN</small><b>Google AI Studio</b></span></Link><div className="header-context"><span className="header-dot"/><p><b>Vibe Coding with QuanLHK</b></p></div><button className={`header-api-button ${connected ? "connected" : ""}`} onClick={openModal}>{connected ? <CheckCircle2/> : <KeyRound/>}<span><small>KẾT NỐI AI</small><b>{connected ? `${providerName} · Đã kết nối` : "Không bắt buộc"}</b></span></button></div></header>;
}
