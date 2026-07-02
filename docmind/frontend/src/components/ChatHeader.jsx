import { useMemo, useState } from "react";
import { Download, Info, Sparkles } from "lucide-react";
import { useStore } from "../store/useStore";
import BrandLogo from "./BrandLogo";
import { formatDocumentTitle } from "./documentTitleHelpers";

export default function ChatHeader({ document: doc }) {
  const { processingState, isStreaming } = useStore();
  const activeDocId = useStore((s) => s.activeDocId);
  const messages = useStore((s) => (s.activeDocId ? s.messages[s.activeDocId] || [] : []));
  const [showInsights, setShowInsights] = useState(false);

  const status = processingState !== "idle" ? "processing" : isStreaming ? "responding" : "online";
  const statusLabel =
    status === "processing"
      ? "Processing"
      : status === "responding"
        ? "Responding"
        : "Online";

  const insightItems = useMemo(() => {
    if (!doc) return [];
    return [
      { label: "Pages", value: doc.page_count ?? "—" },
      { label: "Chunks", value: doc.chunk_count ?? "—" },
      { label: "Size", value: doc.size_mb ? `${doc.size_mb.toFixed(1)} MB` : "—" },
      { label: "Updated", value: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "—" },
    ];
  }, [doc]);

  const exportMessages = () => {
    if (!activeDocId) return;
    const content = messages
      .map((message) => `${message.role === "user" ? "You" : "DocMind"}: ${message.content}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc?.title || "conversation"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-b border-white/10 bg-slate-900/70 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo className="h-11 w-11 rounded-2xl" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">
              {doc ? formatDocumentTitle(doc.title, doc.doc_id) : "DocMind"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {doc
                ? `${doc.page_count} pages · ${doc.chunk_count} chunks`
                : "No document selected"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportMessages}
            className="rounded-full border border-white/10 bg-slate-800/70 p-2 text-slate-300 transition hover:text-white"
            title="Export conversation"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowInsights((value) => !value)}
            className="rounded-full border border-white/10 bg-slate-800/70 p-2 text-slate-300 transition hover:text-white"
            title="Show insights"
          >
            <Info className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/70 px-3 py-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${status === "online" ? "bg-emerald-400" : status === "responding" ? "bg-amber-400" : "bg-indigo-400"}`} />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {showInsights && doc ? (
        <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-slate-950/80 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Document insights
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {insightItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
