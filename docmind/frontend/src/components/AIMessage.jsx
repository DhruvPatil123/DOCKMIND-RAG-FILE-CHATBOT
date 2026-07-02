import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, CopyCheck } from "lucide-react";
import BrandLogo from "./BrandLogo";
import SourceCards from "./SourceCards";
import TypingIndicator from "./TypingIndicator";

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${part}-${index}`} className="rounded-md bg-slate-800/90 px-1.5 py-0.5 text-[0.82rem] text-cyan-300">{part.slice(1, -1)}</code>;
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderMarkdown(content) {
  const lines = content.split("\n");
  const blocks = [];
  let codeBuffer = [];
  let isCodeBlock = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("````") || trimmed.startsWith("```")) {
      if (isCodeBlock) {
        blocks.push(
          <pre key={`code-${index}`} className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80 p-3 text-[0.82rem] text-slate-300">
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = [];
        isCodeBlock = false;
      } else {
        isCodeBlock = true;
      }
      return;
    }

    if (isCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (!trimmed) {
      blocks.push(<div key={`sp-${index}`} className="h-1" />);
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push(
        <ul key={`ul-${index}`} className="ml-4 list-disc space-y-1 text-sm leading-7 text-slate-300">
          <li>{renderInline(trimmed.replace(/^[-*]\s/, ""))}</li>
        </ul>
      );
      return;
    }

    if (trimmed.startsWith("> ")) {
      blocks.push(
        <blockquote key={`bq-${index}`} className="rounded-r-xl border-l-2 border-indigo-400/50 bg-slate-900/70 px-3 py-2 text-sm italic text-slate-400">
          {renderInline(trimmed.replace(/^>\s/, ""))}
        </blockquote>
      );
      return;
    }

    blocks.push(
      <p key={`p-${index}`} className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
        {renderInline(trimmed)}
      </p>
    );
  });

  return blocks;
}

export default function AIMessage({ content, sources, streaming }) {
  const [copied, setCopied] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const showTyping = streaming && !content;

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[82%]">
        <div className="mb-2 flex items-center gap-2">
          <BrandLogo className="h-7 w-7 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.22)]" />
          <span className="text-xs font-medium text-slate-400">DocMind</span>
        </div>

        <div className="rounded-[1.2rem] border border-indigo-400/20 bg-slate-900/80 p-4 shadow-[0_0_35px_rgba(10,10,15,0.28)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-end">
            {!showTyping && content ? (
              <button
                onClick={handleCopy}
                className="rounded-full border border-white/10 bg-slate-800/80 p-2 text-slate-400 transition-colors hover:text-slate-100"
              >
                {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            ) : null}
          </div>

          {showTyping ? (
            <TypingIndicator />
          ) : (
            <div className="ai-markdown space-y-2">{renderMarkdown(content || "")}</div>
          )}
        </div>

        {!streaming && sources && sources.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {sources.map((src, index) => (
              <button
                key={`${src.page_number}-${index}`}
                type="button"
                onClick={() => setSelectedSource(selectedSource === index ? null : index)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${selectedSource === index ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/10 bg-slate-900/70 text-slate-300 hover:text-white"}`}
              >
                Source · p.{src.page_number ?? index + 1}
              </button>
            ))}
          </div>
        ) : null}

        {selectedSource != null && sources?.[selectedSource] ? (
          <div className="mt-3 rounded-[1rem] border border-cyan-400/20 bg-slate-900/80 p-3 text-sm text-slate-300">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Expanded citation</p>
            <p className="mt-2 leading-6">{sources[selectedSource].text}</p>
            <p className="mt-2 text-[11px] text-slate-500">Page {sources[selectedSource].page_number ?? selectedSource + 1}</p>
          </div>
        ) : null}

        {!streaming && <SourceCards sources={sources} />}
      </div>
    </motion.div>
  );
}
