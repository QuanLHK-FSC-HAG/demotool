"use client";

import { useEffect } from "react";

const VISITOR_ID_KEY = "analytics_visitor_id";
const HEARTBEAT_INTERVAL_MS = 3000;

export function AnalyticsHeartbeat() {
  useEffect(() => {
    let visitorId = window.localStorage.getItem(VISITOR_ID_KEY);

    if (!visitorId) {
      visitorId = window.crypto.randomUUID();
      window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }

    const currentVisitorId = visitorId;

    async function sendHeartbeat() {
      try {
        await fetch("/api/stats/heartbeat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId: currentVisitorId,
          }),
          cache: "no-store",
          keepalive: true,
        });
      } catch {
        // Không làm ảnh hưởng trải nghiệm nếu thống kê tạm thời bị lỗi.
      }
    }

    function sendOffline() {
      const body = JSON.stringify({
        visitorId: currentVisitorId,
      });

      const blob = new Blob([body], {
        type: "application/json",
      });

      navigator.sendBeacon("/api/stats/offline", blob);
    }

    void sendHeartbeat();

    const intervalId = window.setInterval(() => {
      void sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    window.addEventListener("pagehide", sendOffline);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("pagehide", sendOffline);
    };
  }, []);

  return null;
}
