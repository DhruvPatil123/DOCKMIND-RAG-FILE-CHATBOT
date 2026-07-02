import LiveConversationSection from "../components/LiveConversationSection";

export default function LiveDemoPage() {
  return (
    <main className="px-6 pb-24 pt-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Live demo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Preview the chat experience.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-8 text-slate-400">
            Browse the interactive demo to see how DocMind answers questions with document citations.
          </p>
        </div>
      </div>
      <LiveConversationSection />
    </main>
  );
}
