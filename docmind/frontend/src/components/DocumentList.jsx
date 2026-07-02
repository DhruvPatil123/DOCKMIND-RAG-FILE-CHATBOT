import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Trash2, Sparkles, ArrowLeftRight } from "lucide-react";
import { useStore } from "../store/useStore";
import { formatDocumentTitle } from "./documentTitleHelpers";

function getDocMeta(doc) {
  const metaParts = [];
  if (doc.page_count != null) metaParts.push(`${doc.page_count} pages`);
  if (doc.chunk_count != null) metaParts.push(`${doc.chunk_count} chunks`);
  if (doc.size_mb != null) metaParts.push(`${doc.size_mb.toFixed(1)} MB`);
  else if (doc.created_at) metaParts.push(new Date(doc.created_at).toLocaleDateString());
  return metaParts.join(" • ");
}

export default function DocumentList() {
  const {
    documents,
    activeDocId,
    selectDocument,
    removeDocument,
    documentSearchQuery,
    setDocumentSearchQuery,
    compareDocA,
    compareDocB,
    setCompareDocuments,
  } = useStore();

  const filteredDocuments = documents.filter((doc) => {
    const query = documentSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return [doc.title, doc.doc_id, doc.file_name].filter(Boolean).join(" ").toLowerCase().includes(query);
  });

  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-4 custom-scrollbar">
      <div className="mb-2 flex items-center justify-between px-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Your Documents
        </h3>
        <span className="text-xs text-slate-400">{documents.length}</span>
      </div>

      <div className="rounded-[1rem] border border-white/10 bg-slate-900/70 px-3 py-2">
        <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <Search className="h-3.5 w-3.5 text-cyan-300" />
          Search library
        </label>
        <input
          value={documentSearchQuery}
          onChange={(event) => setDocumentSearchQuery(event.target.value)}
          placeholder="Filter by title or ID"
          className="mt-2 w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="rounded-[1rem] border border-cyan-400/20 bg-cyan-400/10 p-3 text-xs text-slate-200">
        <div className="flex items-center gap-2 font-medium text-cyan-300">
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Compare documents
        </div>
        <div className="mt-3 space-y-2">
          <select
            value={compareDocA || ""}
            onChange={(event) => setCompareDocuments(event.target.value || null, compareDocB)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm outline-none"
          >
            <option value="">Select document A</option>
            {documents.map((doc) => (
              <option key={doc.doc_id} value={doc.doc_id}>{formatDocumentTitle(doc.title, doc.doc_id)}</option>
            ))}
          </select>
          <select
            value={compareDocB || ""}
            onChange={(event) => setCompareDocuments(compareDocA, event.target.value || null)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm outline-none"
          >
            <option value="">Select document B</option>
            {documents.map((doc) => (
              <option key={doc.doc_id} value={doc.doc_id}>{formatDocumentTitle(doc.title, doc.doc_id)}</option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredDocuments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.2rem] border border-dashed border-slate-700/80 bg-slate-900/60 px-4 py-8 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-200">No documents indexed yet</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Upload a PDF to create a searchable knowledge base with grounded citations.
            </p>
          </motion.div>
        ) : (
          filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.doc_id}
              layout
              initial={{ opacity: 0, scale: 0.95, rotateY: -12 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotateY: 12, transition: { duration: 0.2 } }}
              whileHover={{ y: -2, scale: 1.01, boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 12px 24px rgba(15,23,42,0.22)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectDocument(doc.doc_id)}
              className={`group relative cursor-pointer rounded-[1rem] border p-3 transition-all duration-200 ${
                activeDocId === doc.doc_id
                  ? "border-indigo-400/40 bg-indigo-600/15 shadow-[0_0_20px_rgba(79,70,229,0.16)]"
                  : "border-white/10 bg-white/[0.03] hover:border-slate-500/60 hover:bg-slate-800/80"
              }`}
            >
              {activeDocId === doc.doc_id ? (
                <div className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-400" />
              ) : null}
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2 ${activeDocId === doc.doc_id ? "bg-indigo-500 text-white" : "bg-slate-700/80 text-slate-400"}`}>
                  <FileText size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-100">{formatDocumentTitle(doc.title, doc.doc_id, index)}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{getDocMeta(doc)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(doc.doc_id);
                  }}
                  className="rounded-md p-1.5 text-slate-400 opacity-0 transition-colors hover:bg-red-400/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
