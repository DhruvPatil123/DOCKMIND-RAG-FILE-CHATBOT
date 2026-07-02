import React from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { CheckCircle2, Loader2, Sparkles, X } from "lucide-react";

export default function ProcessingTimeline() {
  const { processingState, processingSteps, error } = useStore();

  if (processingState === "idle") return null;

  const progress = Math.round((processingSteps.filter((step) => step.status === "done").length / processingSteps.length) * 100);
  const isComplete = processingState === "done";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-[1.6rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_0_70px_rgba(2,6,23,0.45)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Ingesting document</h2>
            <p className="mt-1 text-sm text-slate-400">Preparing your PDF for grounded answers</p>
          </div>
          <button className="rounded-full border border-white/10 bg-slate-800/80 p-2 text-slate-400 transition-colors hover:text-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/60 p-4">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-700/70">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {processingSteps.map((step, idx) => (
            <div key={step.id} className="relative flex items-center gap-4">
              {idx < processingSteps.length - 1 && (
                <div className="absolute left-4 top-7 h-full w-px bg-slate-800">
                  <motion.div
                    className="w-full bg-indigo-500"
                    initial={{ height: 0 }}
                    animate={{ height: step.status === "done" ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}

              <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                step.status === "done"
                  ? "border-indigo-400/40 bg-indigo-500 text-white"
                  : step.status === "active"
                    ? "border-indigo-400/40 bg-indigo-500/20 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.22)]"
                    : "border-slate-700 bg-slate-800 text-slate-500"
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
                <p className={`text-sm font-medium transition-colors ${step.status === "active" ? "text-white" : step.status === "done" ? "text-slate-300" : "text-slate-500"}`}>
                  {step.label}
                </p>
                {step.status === "active" && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <motion.div key={i} className="h-1 w-8 overflow-hidden rounded-full bg-indigo-500/30">
                        <motion.div
                          className="h-full w-full bg-indigo-400"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2, ease: "linear" }}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-slate-400">
          <span>{isComplete ? "Finishing up" : "Estimated time remaining"}</span>
          <span className="font-medium text-slate-200">{isComplete ? "Almost ready" : "~15s"}</span>
        </div>

        {processingState === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400"
          >
            {error || "An error occurred during processing. Please try again."}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
