export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ink-900">
      <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-brand-600/20 blur-[120px] animate-figure-8" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[450px] w-[450px] rounded-full bg-accent-500/20 blur-[120px] animate-figure-8 [animation-delay:-6s]" />
      <div className="absolute top-[40%] left-[30%] h-[380px] w-[380px] rounded-full bg-purple-500/15 blur-[110px] animate-float-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(10,10,15,0.6)_100%)]" />
    </div>
  );
}
