import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SourceCards({ sources }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
        Sources
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <AnimatePresence initial={false}>
          {sources.map((src, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <motion.button
                key={`${src.page_number}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className={`min-w-[230px] max-w-[240px] rounded-[1.05rem] border p-3 text-left ${
                  isExpanded
                    ? "border-indigo-400/40 bg-indigo-500/10"
                    : "border-white/10 bg-slate-900/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] font-semibold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    {src.page_number}
                  </span>
                  {src.score != null && (
                    <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400">
                      {src.score.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className={`mt-3 text-sm leading-6 text-slate-300 ${isExpanded ? "" : "line-clamp-2"}`}>
                  {src.text}
                </p>
                <p className="mt-3 text-[11px] text-slate-500">
                  {isExpanded ? "Tap to collapse" : "Tap to expand"}
                </p>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
