"use client";

import { CalendarDays, CircleDot, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

type Stats = {
  total: number;
  today: number;
  online: number;
  updatedAt: string;
};

const VISITOR_KEY = "site_visitor_id";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let visitRegistered = false;

function getVisitorId() {
  const saved = localStorage.getItem(VISITOR_KEY);
  if (saved && UUID_PATTERN.test(saved)) return saved;
  const visitorId = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, visitorId);
  return visitorId;
}

export function VisitStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;

    async function refreshStats() {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        if (!response.ok) throw new Error("Stats unavailable");
        const nextStats = await response.json() as Stats;
        if (active) {
          setStats(nextStats);
          setUnavailable(false);
        }
      } catch {
        if (active) setUnavailable(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    async function registerVisit() {
      try {
        await fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: getVisitorId() }),
          cache: "no-store",
        });
      } finally {
        await refreshStats();
      }
    }

    if (!visitRegistered) {
      visitRegistered = true;
      void registerVisit();
    } else {
      void refreshStats();
    }
    const interval = window.setInterval(refreshStats, 60_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const format = (value?: number) => value?.toLocaleString("vi-VN") ?? "—";
  return <section className="rail-card visit-stats-card" aria-live="polite">
    <div className="visit-stats-heading"><UsersRound/><div><span className="rail-label">HOẠT ĐỘNG CỘNG ĐỒNG</span><h2>Lượt truy cập</h2></div></div>
    <div className={`visit-stat ${loading ? "loading" : ""}`}><UsersRound/><span><small>Tổng truy cập</small><strong>{format(stats?.total)}</strong></span></div>
    <div className={`visit-stat ${loading ? "loading" : ""}`}><CalendarDays/><span><small>Hôm nay</small><strong>{format(stats?.today)}</strong></span></div>
    <div className={`visit-stat online ${loading ? "loading" : ""}`}><CircleDot/><span><small>Đang online</small><strong>{format(stats?.online)}</strong></span></div>
    <p className={`visit-stats-note ${unavailable ? "unavailable" : ""}`}>{unavailable ? "Đang chờ kết nối dịch vụ thống kê." : "Thống kê ẩn danh, không lưu IP hay thông tin cá nhân."}</p>
  </section>;
}
