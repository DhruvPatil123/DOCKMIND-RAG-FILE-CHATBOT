import { motion } from "framer-motion";

export default function UserMessage({ content }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[75%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-3 text-slate-50">
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </motion.div>
  );
}
