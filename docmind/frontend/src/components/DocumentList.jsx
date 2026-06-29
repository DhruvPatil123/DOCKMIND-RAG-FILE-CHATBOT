import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { FileText, Trash2 } from "lucide-react";

export default function DocumentList() {
  const { documents, activeDocId, selectDocument, removeDocument } = useStore();

  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-4 custom-scrollbar">
      <div className="flex items-center justify-between px-2 mb-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Your Documents
        </h3>
        <span className="text-xs text-slate-500">{documents.length}</span>
      </div>

      <AnimatePresence mode="popLayout">
        {documents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 px-4 border-2 border-dashed border-slate-700 rounded-xl"
          >
            <p className="text-sm text-slate-500">No documents indexed yet.</p>
          </motion.div>
        ) : (
          documents.map((doc) => (
            <motion.div
              key={doc.doc_id}
              layout
              initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 20, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectDocument(doc.doc_id)}
              className={`group relative cursor-pointer rounded-xl p-3 transition-all duration-200 ${
                activeDocId === doc.doc_id
                  ? "bg-indigo-600/20 border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                  : "bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeDocId === doc.doc_id ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {doc.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {doc.page_count} pages • {doc.chunk_count} chunks
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(doc.doc_id);
                  }}
                  className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
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
