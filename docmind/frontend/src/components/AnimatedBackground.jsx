export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_40%),linear-gradient(135deg,_rgba(2,6,23,0.98),_rgba(10,10,15,1))]">
      <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-20" />
      <div className="absolute left-[-8%] top-[-10%] h-[520px] w-[520px] rounded-full bg-indigo-500/25 blur-[140px] animate-figure-8" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[470px] w-[470px] rounded-full bg-cyan-400/20 blur-[140px] animate-figure-8 [animation-delay:-6s]" />
      <div className="absolute left-[30%] top-[40%] h-[380px] w-[380px] rounded-full bg-purple-500/20 blur-[120px] animate-float-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(3,7,18,0.75)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 160 160\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"1\"/%3E%3C/svg%3E')",
        }}
      />
    </div>
  );
}
