import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL("https://tap-huan-google-ai-studio.vercel.app"),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.shortName}` },
  description: siteConfig.description,
  openGraph: { title: siteConfig.name, description: siteConfig.description, locale: "vi_VN", type: "website" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#0072BC", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><a className="skip-link" href="#main">Đi tới nội dung</a><SiteHeader/><main id="main">{children}</main><SiteFooter/></body></html>;
}

