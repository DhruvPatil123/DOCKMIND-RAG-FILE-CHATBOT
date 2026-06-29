import React from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function ProcessingTimeline() {
  const { processingState, processingSteps } = useStore();

  if (processingState === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl"
      >
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">Ingesting Document</h2>
            <p className="text-sm text-slate-400 mt-1">Preparing your document for AI analysis</p>
          </div>

          <div className="flex flex-col gap-4">
            {processingSteps.map((step, idx) => (
              <div key={step.id} className="relative flex items-center gap-4">
                {/* Line connector */}
                {idx < processingSteps.length - 1 && (
                  <div className="absolute left-4 top-7 w-px h-full bg-slate-800">
                    <motion.div
                      className="w-full bg-indigo-500"
                      initial={{ height: 0 }}
                      animate={{
                        height: step.status === "done" ? "100%" : "0%"
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                  step.status === "done" ? "bg-indigo-500 text-white" :
                  step.status === "active" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50" :
                  "bg-slate-800 text-slate-500 border border-slate-700"
                }`}>
                  {step.status === "done" ? (
                    <CheckCircle2 size={16} />
                  ) : step.status === "active" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <p className={`text-sm font-medium transition-colors ${
                    step.status === "active" ? "text-white" :
                    step.status === "done" ? "text-slate-300" : "text-slate-500"
                  }`}>
                    {step.label}
                  </p>

                  {step.status === "active" && (
                    <div className="flex gap-1 mt-2">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 w-8 rounded-full bg-indigo-500/30 overflow-hidden"
                        >
                          <motion.div
                            className="h-full w-full bg-indigo-400"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              delay: i * 0.2,
                              ease: "linear"
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {processingState === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              An error occurred during processing. Please try again.
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
