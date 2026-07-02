import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useStore } from "../store/useStore";
import { Upload, FileCheck, FileWarning } from "lucide-react";

export default function UploadZone3D() {
  const { uploadDocument } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const fileInputRef = useRef(null);

  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;

    mouseX.set((e.clientX - centerX) / (width / 2));
    mouseY.set((e.clientY - centerY) / (height / 2));
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const handleFile = async (uploadedFile) => {
    if (!uploadedFile || !uploadedFile.name.toLowerCase().endsWith(".pdf")) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("uploading");

    try {
      await uploadDocument(uploadedFile);
      setStatus("success");
    } catch (e) {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="px-4 pb-4 pt-3">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="relative h-32 w-full cursor-pointer"
      >
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            handleFile(droppedFile);
          }}
          onClick={() => fileInputRef.current?.click()}
          animate={{
            rotateY: status === "success" || status === "error" ? 180 : 0,
            scale: isDragging ? 1.03 : 1,
            boxShadow: isDragging
              ? "0 0 30px rgba(99,102,241,0.32)"
              : status === "idle"
                ? "0 0 25px rgba(99,102,241,0.12)"
                : "0 0 20px rgba(2,6,23,0.16)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={`relative h-full w-full overflow-hidden rounded-[1.35rem] border border-slate-700/80 bg-slate-800/45 p-5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/50 ${status === "idle" ? "animate-pulse-border" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_65%)]" />

          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 ${status !== "idle" ? "invisible" : "visible"}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="rounded-full bg-indigo-500/10 p-3 text-indigo-300">
              <Upload size={22} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-100">Drop PDF here or click</p>
              <p className="mt-1 text-xs text-slate-500">PDFs up to 10MB</p>
            </div>
          </div>

          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 ${status === "idle" ? "invisible" : "visible"}`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {status === "success" ? (
              <>
                <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-400">
                  <FileCheck size={22} />
                </div>
                <p className="text-sm font-medium text-slate-100">Upload complete</p>
              </>
            ) : status === "error" ? (
              <>
                <div className="rounded-full bg-red-500/10 p-3 text-red-400">
                  <FileWarning size={22} />
                </div>
                <p className="text-sm font-medium text-slate-100">Invalid file</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-indigo-500/10 p-3 text-indigo-300 animate-pulse">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-medium text-slate-100">Processing…</p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
