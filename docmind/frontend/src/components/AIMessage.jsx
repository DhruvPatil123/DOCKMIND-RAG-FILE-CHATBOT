import { motion } from "framer-motion";
import SourceCards from "./SourceCards";
import TypingIndicator from "./TypingIndicator";

export default function AIMessage({ content, sources, streaming }) {
  const showTyping = streaming && !content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[80%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
            D
          </span>
          <span className="text-xs font-medium text-slate-400">DocMind</span>
        </div>
        <div className="glass-card px-4 py-3">
          {showTyping ? (
            <TypingIndicator />
          ) : (
            <p className="whitespace-pre-wrap break-words text-slate-200">
              {content}
              {streaming && (
                <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-brand-400 align-middle" />
              )}
            </p>
          )}
        </div>
        {!streaming && <SourceCards sources={sources} />}
      </div>
    </motion.div>
  );
}
