import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    ref.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-white/5 p-4">
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="Ask about your document…"
          className="input-base flex-1 resize-none max-h-32"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={submit}
          disabled={disabled || !text.trim()}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </motion.button>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-600">
        DocMind answers only from your uploaded document.
      </p>
    </div>
  );
}
