import { motion, AnimatePresence } from "framer-motion";

export default function SourceCards({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Sources
      </p>
      <div className="grid gap-2">
        <AnimatePresence>
          {sources.map((src, i) => (
            <motion.div
              key={`${src.page_number}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card flex items-start gap-3 p-3 text-sm"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600/20 text-xs font-bold text-brand-400">
                {src.page_number}
              </span>
              <p className="line-clamp-3 text-slate-400">{src.text}</p>
              {src.score != null && (
                <span className="ml-auto shrink-0 rounded-md bg-ink-600 px-1.5 py-0.5 text-[10px] text-slate-500">
                  {src.score.toFixed(2)}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
