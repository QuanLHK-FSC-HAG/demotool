import type { ReactNode } from "react";
import { CircleCheck, Lightbulb, TriangleAlert } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { buildGoogleAIStudioAgentPrompt, type AgentPromptContext } from "@/lib/agent-prompt";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function Callout({ type, children }: { type: "tip" | "check" | "warning"; children: ReactNode }) {
  const Icon = type === "tip" ? Lightbulb : type === "check" ? CircleCheck : TriangleAlert;
  return <aside className={`callout ${type}`}><Icon/><div>{children}</div></aside>;
}

export function MdxContent({ source, agentContext }: { source: string; agentContext?: AgentPromptContext }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index += 1; continue; }

    if (line.startsWith("```")) {
      const language = line.slice(3);
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) { code.push(lines[index]); index += 1; }
      const value = code.join("\n");
      const displayedCode = language === "text" && agentContext ? buildGoogleAIStudioAgentPrompt(value, agentContext) : value;
      blocks.push(<CodeBlock code={displayedCode} language={language} key={blocks.length}/>);
      index += 1;
      continue;
    }

    const callout = line.match(/^<(Tip|Check|Warning)>(.*)<\/\1>$/);
    if (callout) {
      const type = callout[1].toLowerCase() as "tip" | "check" | "warning";
      blocks.push(<Callout type={type} key={blocks.length}>{inline(callout[2])}</Callout>);
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) { blocks.push(<h3 key={blocks.length}>{inline(line.slice(4))}</h3>); index += 1; continue; }
    if (line.startsWith("## ")) { blocks.push(<h2 key={blocks.length}>{inline(line.slice(3))}</h2>); index += 1; continue; }

    if (/^- /.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^- /.test(lines[index].trim())) { items.push(lines[index].trim().slice(2)); index += 1; }
      blocks.push(<ul key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item.replace(/^\[[ x]\]\s*/, ""))}</li>)}</ul>);
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\. /.test(lines[index].trim())) { items.push(lines[index].trim().replace(/^\d+\. /, "")); index += 1; }
      blocks.push(<ol key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ol>);
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{2,3} |```|<(?:Tip|Check|Warning)>|- |\d+\. )/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={blocks.length}>{inline(paragraph.join(" "))}</p>);
  }

  return <div className="prose">{blocks}</div>;
}
