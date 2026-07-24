import type { ReactNode } from "react";
export function SectionHeading({ eyebrow, title, children, centered = false }: { eyebrow: string; title: string; children?: ReactNode; centered?: boolean }) { return <div className={`section-heading ${centered ? "centered" : ""}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div> }
