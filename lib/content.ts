import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
export type ContentMeta = { slug: string; title: string; description: string; order?: number; duration?: string; level?: string; subject?: string; color?: string; icon?: string; featured?: boolean; tags?: string[] };
const root = path.join(process.cwd(), "content");
export function getContentList(collection: "lessons" | "games" | "gallery") { const dir = path.join(root, collection); if (!fs.existsSync(dir)) return []; return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx")).map((file) => { const slug = file.replace(/\.mdx$/, ""); const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8")); return { slug, ...data } as ContentMeta; }).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)); }
export function getContentItem(collection: "lessons" | "games" | "gallery", slug: string) { const file = path.join(root, collection, `${slug}.mdx`); if (!fs.existsSync(file)) return null; const { data, content } = matter(fs.readFileSync(file, "utf8")); return { meta: { slug, ...data } as ContentMeta, content }; }
