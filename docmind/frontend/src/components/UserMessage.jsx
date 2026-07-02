import { motion } from "framer-motion";

export default function UserMessage({ content }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end"
    >
      <div className="flex max-w-[78%] items-end gap-2">
        <div className="rounded-[1.2rem] border border-indigo-400/20 bg-gradient-to-br from-indigo-600 to-sky-500 px-4 py-3 text-slate-50 shadow-[0_0_24px_rgba(99,102,241,0.16)]">
          <p className="whitespace-pre-wrap break-words text-sm leading-7">{content}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-sm font-semibold text-slate-200">
          Y
        </div>
      </div>
    </motion.div>
  );
}
