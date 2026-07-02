import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from "./store/useStore";
import AnimatedBackground from "./components/AnimatedBackground";
import BrandLogo from "./components/BrandLogo";
import ProcessingTimeline from "./components/ProcessingTimeline";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import LiveDemoPage from "./pages/LiveDemoPage";
import ChatAppPage from "./pages/ChatAppPage";

function AppShell() {
  const loadDocuments = useStore((s) => s.loadDocuments);
  const themeMode = useStore((s) => s.themeMode);
  const setThemeMode = useStore((s) => s.setThemeMode);
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    document.body.classList.toggle("theme-light", themeMode === "light");
    document.body.classList.toggle("theme-dark", themeMode === "dark");
  }, [themeMode]);

  return (
    <div className={`relative min-h-screen overflow-hidden ${themeMode === "light" ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-200"} selection:bg-indigo-500/30`}>
      <AnimatedBackground />
      <div className="relative z-10">
        <header className={`sticky top-0 z-20 border-b ${themeMode === "light" ? "border-slate-200 bg-white/90" : "border-white/10 bg-slate-950/90"} backdrop-blur-xl`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-12">
            <Link to="/" className={`flex items-center gap-3 ${themeMode === "light" ? "text-slate-900" : "text-white"}`}>
              <BrandLogo className="h-11 w-11" />
              <div>
                <p className={`text-sm font-semibold tracking-[0.18em] uppercase ${themeMode === "light" ? "text-slate-900" : "text-white/90"}`}>DocMind</p>
              </div>
            </Link>

            <nav className={`hidden items-center gap-10 text-sm md:flex ${themeMode === "light" ? "text-slate-600" : "text-slate-300"}`}>
              <Link to="/" className={`transition ${themeMode === "light" ? "hover:text-slate-950" : "hover:text-white"}`}>Home</Link>
              <Link to="/features" className={`transition ${themeMode === "light" ? "hover:text-slate-950" : "hover:text-white"}`}>Features</Link>
              <Link to="/demo" className={`transition ${themeMode === "light" ? "hover:text-slate-950" : "hover:text-white"}`}>Live Demo</Link>
              <Link to="/app" className={`transition ${themeMode === "light" ? "hover:text-slate-950" : "hover:text-white"}`}>App</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${themeMode === "light" ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100" : "border-white/10 bg-slate-900/70 text-slate-200 hover:bg-slate-800"}`}
              >
                {themeMode === "light" ? "Dark" : "Light"}
              </button>
              <button
                onClick={() => navigate("/app")}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:bg-slate-200"
              >
                Launch app
              </button>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage onLaunch={() => navigate("/app")} />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/demo" element={<LiveDemoPage />} />
          <Route path="/app" element={<ChatAppPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ProcessingTimeline />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
