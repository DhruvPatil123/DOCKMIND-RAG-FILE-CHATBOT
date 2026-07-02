import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, FileText, MessageSquareQuote, UploadCloud } from "lucide-react";
import { useStore } from "../store/useStore";
import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";

const featureCards = [
  {
    title: "Upload",
    description: "Drop a PDF and let DocMind index it for grounded answers.",
    icon: UploadCloud,
  },
  {
    title: "Ask",
    description: "Pose questions naturally and get context-aware responses.",
    icon: MessageSquareQuote,
  },
  {
    title: "Citations",
    description: "Follow every answer back to the source pages instantly.",
    icon: FileText,
  },
];

export default function MessageList({ messages }) {
  const processingState = useStore((s) => s.processingState);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-2xl"
        >
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-indigo-400/30 bg-gradient-to-br from-indigo-500/30 via-sky-400/20 to-cyan-400/20 shadow-[0_0_70px_rgba(99,102,241,0.25)]">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle,_rgba(255,255,255,0.2),_transparent_70%)]" />
            <div className="relative rounded-[1.4rem] border border-white/10 bg-slate-950/70 p-4">
              <Bot className="h-9 w-9 text-indigo-300" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Welcome to <span className="text-gradient-brand">DocMind</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Upload a PDF and start a grounded conversation. DocMind will answer from your documents with citations and contextual summaries.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {featureCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group rounded-[1.2rem] border border-slate-700 bg-slate-900/70 p-4 shadow-[0_20px_45px_rgba(2,6,23,0.25)] backdrop-blur-xl"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-100">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        {processingState !== "idle" ? (
          <div className="mt-8 w-full max-w-2xl space-y-3 rounded-[1.4rem] border border-slate-700 bg-slate-950/80 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
            <div className="h-3 rounded-full bg-slate-800/90 animate-pulse" />
            <div className="h-3 rounded-full bg-slate-800/90 w-5/6 animate-pulse" />
            <div className="h-3 rounded-full bg-slate-800/90 w-4/6 animate-pulse" />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6">
      <AnimatePresence initial={false}>
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg.id} content={msg.content} />
          ) : (
            <AIMessage
              key={msg.id}
              content={msg.content}
              sources={msg.sources}
              streaming={msg.streaming}
            />
          )
        )}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}
