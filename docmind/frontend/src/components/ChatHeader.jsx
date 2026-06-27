export default function ChatHeader({ document: doc }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
        D
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-200">
          {doc ? doc.title : "DocMind"}
        </p>
        <p className="text-xs text-slate-500">
          {doc
            ? `${doc.page_count} pages · ${doc.chunk_count} chunks`
            : "No document selected"}
        </p>
      </div>
    </div>
  );
}
