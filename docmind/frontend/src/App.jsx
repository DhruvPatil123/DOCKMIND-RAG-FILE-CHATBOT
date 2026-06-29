import React, { useEffect } from "react";
import { useStore } from "./store/useStore";
import AnimatedBackground from "./components/AnimatedBackground";
import ChatPanel from "./components/ChatPanel";
import UploadZone3D from "./components/UploadZone3D";
import DocumentList from "./components/DocumentList";
import ProcessingTimeline from "./components/ProcessingTimeline";

export default function App() {
  const loadDocuments = useStore((s) => s.loadDocuments);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-80 h-full border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">DocMind</h1>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <UploadZone3D />
          <DocumentList />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 h-full">
          <ChatPanel />
        </div>
      </main>

      {/* Overlay for processing */}
      <ProcessingTimeline />
    </div>
  );
}
