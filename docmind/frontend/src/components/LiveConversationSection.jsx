import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import ChatPanel from "./ChatPanel";
import { useStore } from "../store/useStore";
import { uniqueDisplayTitles } from "./documentTitleHelpers";

export default function LiveConversationSection() {
  const documents = useStore((s) => s.documents);
  const [showChat, setShowChat] = useState(false);

  const docLabels = useMemo(
    () => uniqueDisplayTitles(documents).slice(0, 3),
    [documents]
  );

  return (
    <section id="demo" className="px-6 pb-20 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_40px_90px_rgba(9,15,33,0.5)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Live conversation</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Answers that <span className="text-gradient-brand">cite the source.</span>
              </h2>
            </div>
            <button
              onClick={() => setShowChat(true)}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(99,102,241,0.24)] transition hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-110"
            >
              Launch DocMind
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            {docLabels.length > 0 ? (
              docLabels.map((label) => (
                <span key={label} className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-slate-200">
                  {label}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-slate-400">
                No documents indexed yet
              </span>
            )}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <p className="text-sm font-semibold text-white">Static preview</p>
            <div className="mt-4 space-y-3">
              <div className="ml-auto max-w-[80%] rounded-[1rem] border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-slate-100">
                Which clause mentions the review deadline?
              </div>
              <div className="mr-auto max-w-[84%] rounded-[1rem] border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-200">
                The document cites the review deadline on page 6 and the approval window on page 8.
                <span className="mt-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-300">
                  p.6
                </span>
              </div>
            </div>
          </div>
        </div>

        <motion.div layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-4 shadow-[0_40px_90px_rgba(7,12,22,0.5)]">
          <div className="rounded-[1.6rem] border border-slate-700 bg-slate-950/80 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">DocMind Session</p>
                <p className="mt-2 text-xs text-slate-400">{documents.length} documents indexed</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                Realtime answers
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="h-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              {showChat ? (
                <ChatPanel />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-6 p-10 text-center text-slate-400">
                  <p className="max-w-xl text-base leading-7">
                    Start a conversation with your uploaded documents and see page-aware responses in the chat panel.
                  </p>
                  <button
                    onClick={() => setShowChat(true)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-transparent px-6 py-3 text-sm font-semibold text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-slate-500 hover:text-white"
                  >
                    Open live chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
