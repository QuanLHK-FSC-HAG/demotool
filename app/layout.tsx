import type { Metadata, Viewport } from "next";
import "./globals.css";

import { AnalyticsHeartbeat } from "@/components/analytics-heartbeat";
import { PlatformShell } from "@/components/platform-shell";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://tap-huan-google-ai-studio.vercel.app",
  ),

  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },

  description: siteConfig.description,

  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    locale: "vi_VN",
    type: "website",
  },

  icons: {
    icon: "/fpt.png",
    shortcut: "/fpt.png",
    apple: "/fpt.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0072BC",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <AnalyticsHeartbeat />

        <a className="skip-link" href="#main">
          Đi tới nội dung
        </a>

        <PlatformShell>{children}</PlatformShell>
      </body>
    </html>
  );
}
