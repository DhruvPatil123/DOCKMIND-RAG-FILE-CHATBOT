import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";

export default function MessageList({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-bold text-white">
          D
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Ask DocMind</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload a PDF and start chatting to get grounded answers with citations.
          </p>
        </div>
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
