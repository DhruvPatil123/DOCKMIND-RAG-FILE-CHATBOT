import { motion } from "framer-motion";

export default function TypingIndicator() {
  const dots = [0, 1, 2];
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      {dots.map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-brand-400"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
