"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const isAgentPrompt = code.startsWith("# AGENT PROMPT");

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <div className="code-block-shell">
    <div className="code-block-toolbar"><span>{isAgentPrompt ? "AGENT PROMPT · GOOGLE AI STUDIO" : language === "text" ? "PROMPT HOÀN CHỈNH" : language || "CODE"}</span><button type="button" onClick={copyCode}>{copied ? <Check/> : <Copy/>}{copied ? "Đã sao chép" : "Sao chép prompt"}</button></div>
    <pre><code data-language={language}>{code}</code></pre>
  </div>;
}
