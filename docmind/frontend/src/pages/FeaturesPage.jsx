import FeatureSteps from "../components/FeatureSteps";

export default function FeaturesPage() {
  return (
    <main className="px-6 pb-24 pt-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Capabilities</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            A retrieval stack designed for modern document workflows.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-8 text-slate-400">
            Each step is designed to make your documents searchable, grounded, and easy to query.
          </p>
        </div>
      </div>
      <FeatureSteps />
    </main>
  );
}
