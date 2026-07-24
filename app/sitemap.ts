import type { MetadataRoute } from "next"; import { getContentList } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap { const base="https://tap-huan-google-ai-studio.vercel.app"; const pages=["","/learn","/builder","/games","/upgrades","/gallery","/faq"]; return [...pages.map(url=>({url:base+url,lastModified:new Date()})),...getContentList("lessons").map(x=>({url:`${base}/learn/${x.slug}`,lastModified:new Date()})),...getContentList("games").map(x=>({url:`${base}/games/${x.slug}`,lastModified:new Date()}))]; }

