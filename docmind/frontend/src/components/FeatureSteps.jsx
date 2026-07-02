import { motion } from "framer-motion";
import { Cpu, Layers, Search, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Ingest",
    description: "Chunk, clean, and normalize your PDFs for faster retrieval.",
  },
  {
    icon: Cpu,
    title: "Embed",
    description: "Encode document content into high-quality semantic vectors.",
  },
  {
    icon: Search,
    title: "Retrieve",
    description: "Rank the most relevant passages for every query.",
  },
  {
    icon: Layers,
    title: "Generate",
    description: "Deliver answers with transparent page-level citations.",
  },
];

export default function FeatureSteps() {
  return (
    <section id="stack" className="px-6 pb-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Capabilities</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            A retrieval stack designed for modern document workflows.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-100 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
