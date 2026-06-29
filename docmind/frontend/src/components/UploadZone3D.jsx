import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useStore } from "../store/useStore";
import { Upload, FileCheck, FileWarning } from "lucide-react";

export default function UploadZone3D() {
  const { uploadDocument, processingState } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const fileInputRef = useRef(null);

  // Tilt values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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
    console.log("Processing file:", uploadedFile);
    if (!uploadedFile || !uploadedFile.name.toLowerCase().endsWith(".pdf")) {
      console.error("Invalid file type. Please upload a PDF.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("uploading");

    try {
      console.log("Uploading to backend...");
      await uploadDocument(uploadedFile);
      setStatus("success");
    } catch (e) {
      console.error("Upload failed:", e);
      setStatus("error");
    } finally {
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  return (
    <div className="px-4 py-6">
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
        style={{
          rotateX,
          rotateY,
          perspective: 1000,
        }}
        className="relative h-48 w-full cursor-pointer"
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
            scale: isDragging ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="h-full w-full cursor-pointer rounded-2xl border-2 border-slate-700 bg-slate-800/40 backdrop-blur-xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side */}
          <div
            className={`absolute inset-0 p-6 flex flex-col items-center justify-center gap-3 ${status !== "idle" ? "invisible" : "visible"}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
              <Upload size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-200">Drop PDF here or click</p>
              <p className="text-xs text-slate-500">Max 10MB</p>
            </div>
          </div>

          {/* Back Side */}
          <div
            className={`absolute inset-0 p-6 flex flex-col items-center justify-center gap-3 ${status === "idle" ? "invisible" : "visible"}`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            {status === "success" ? (
              <>
                <div className="p-3 rounded-full bg-green-500/10 text-green-400">
                  <FileCheck size={24} />
                </div>
                <p className="text-sm font-medium text-slate-200">Upload Complete!</p>
              </>
            ) : status === "error" ? (
              <>
                <div className="p-3 rounded-full bg-red-500/10 text-red-400">
                  <FileWarning size={24} />
                </div>
                <p className="text-sm font-medium text-slate-200">Invalid File</p>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 animate-pulse">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-slate-200">Processing...</p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
