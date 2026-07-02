import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BrandLogo from "./BrandLogo";

const trustLogos = ["Vertex Analytics", "Atlas Labs", "Nova Legal"];

export default function LandingHero({ onLaunch }) {
  return (
    <section className="relative overflow-hidden px-6 py-16 lg:px-12 lg:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white">
            <BrandLogo className="h-12 w-12 shadow-[0_0_24px_rgba(15,23,42,0.35)]" />
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-200/75">DocMind</p>
            </div>
          </div>

          <button
            onClick={onLaunch}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(99,102,241,0.24)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            Launch app
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="mb-6 inline-flex rounded-full border border-slate-700 bg-slate-950/70 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-slate-400">
              Document-first intelligence
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              Answer questions with confidence using verified document intelligence.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              DocMind brings your PDFs into a single workspace, combining fast search, clear citations, and enterprise-ready controls so teams get reliable context every time.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                onClick={onLaunch}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(99,102,241,0.24)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Get started
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-transparent px-6 py-3 text-sm font-semibold text-slate-200 transition duration-200 hover:border-slate-500 hover:text-white hover:scale-[1.01]">
                Watch 60s demo
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="uppercase tracking-[0.22em] text-slate-400">Trusted by teams at</span>
              {trustLogos.map((logo) => (
                <span key={logo} className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                  {logo}
                </span>
              ))}
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3 text-sm">
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: 0.05 }} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5">
                <p className="text-sm font-semibold text-white">34%</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Faster answer delivery</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: 0.1 }} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5">
                <p className="text-sm font-semibold text-white">99.8%</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Citation accuracy</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: 0.15 }} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5">
                <p className="text-sm font-semibold text-white">15s</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Average query response</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-950/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Live summary</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Team insight panel</h3>
                </div>
                <span className="inline-flex rounded-full border border-slate-700 bg-slate-900/85 px-3 py-1 text-xs text-slate-300">
                  Docs only
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Document", value: "Q2 Strategic Plan" },
                  { label: "Question", value: "What are the compliance risks?" },
                  { label: "Answer", value: "The model cites page 18 for policy review and page 22 for action items." },
                ].map((item, index) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: 0.05 * index }} className="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-slate-100">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute -right-12 top-8 hidden h-44 w-44 rounded-full bg-slate-700/30 blur-3xl lg:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
