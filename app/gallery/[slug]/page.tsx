import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, WandSparkles } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { getContentItem, getContentList } from "@/lib/content";

export function generateStaticParams() {
  return getContentList("gallery").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentItem("gallery", slug);
  return item ? { title: item.meta.title, description: item.meta.description } : {};
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getContentItem("gallery", slug);
  if (!item) notFound();

  return <>
    <section className={`article-hero experience-detail tone-${item.meta.color || "blue"}`}><div className="narrow">
      <Link className="back-link" href="/gallery"><ArrowLeft/> Thư viện trải nghiệm</Link>
      <span className="eyebrow">{item.meta.level} · {item.meta.subject}</span>
      <h1>{item.meta.title}</h1><p>{item.meta.description}</p>
      <div className="experience-detail-meta"><span>{item.meta.experienceType}</span><span>{item.meta.difficulty}</span><span>{item.meta.duration}</span></div>
      <div className="experience-detail-actions"><Link className="button" href="/builder"><WandSparkles/> Tùy biến trong Prompt Builder</Link><a className="button secondary" href="https://aistudio.google.com/" target="_blank" rel="noreferrer">Mở Google AI Studio <ExternalLink/></a></div>
    </div></section>
    <article className="article-shell narrow"><MdxContent source={item.content}/></article>
  </>;
}
