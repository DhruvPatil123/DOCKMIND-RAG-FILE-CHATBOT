import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ChatInput({ onSend, disabled, suggestions = [] }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [text]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    ref.current?.focus();
  };

  const handlePrompt = (prompt) => {
    if (disabled) return;
    onSend(prompt);
    setText("");
    ref.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const charCount = text.length;
  const lineCount = text.split("\n").length;

  return (
    <div className="border-t border-white/10 bg-slate-900/70 px-4 py-4 backdrop-blur-xl">
      {suggestions.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handlePrompt(prompt)}
              disabled={disabled}
              className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[1.4rem] border border-indigo-400/20 bg-slate-900/80 p-2 shadow-[0_0_40px_rgba(99,102,241,0.12)]">
        <div className="relative flex items-end gap-2">
          <div className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-slate-400 ${text ? "opacity-0" : "opacity-100"}`}>
            <span>Ask about your document</span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-300"
            />
          </div>
          <textarea
            ref={ref}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder=""
            className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-3 py-3 pl-4 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={submit}
            disabled={disabled || !text.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="mt-2 flex items-center justify-between px-2 pb-1 text-[11px] text-slate-400">
          <span>Shift + Enter for a new line</span>
          <span>{charCount} chars • {lineCount} lines</span>
        </div>
      </div>
    </div>
  );
}
