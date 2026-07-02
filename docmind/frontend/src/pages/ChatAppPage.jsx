import { useMemo } from "react";
import { Download, Save, Sparkles, Users2, MoonStar, SunMedium, Trash2 } from "lucide-react";
import UploadZone3D from "../components/UploadZone3D";
import DocumentList from "../components/DocumentList";
import ChatPanel from "../components/ChatPanel";
import { useStore } from "../store/useStore";
import { formatDocumentTitle } from "../components/documentTitleHelpers";

export default function ChatAppPage() {
  const {
    documents,
    compareDocA,
    compareDocB,
    setCompareDocuments,
    workspaceMode,
    setWorkspaceMode,
    workspaceMembers,
    themeMode,
    setThemeMode,
    savedConversations,
    saveConversation,
    restoreConversation,
    deleteConversation,
    renameConversation,
    activeDocId,
  } = useStore();

  const comparisonSummary = useMemo(() => {
    const first = documents.find((doc) => doc.doc_id === compareDocA);
    const second = documents.find((doc) => doc.doc_id === compareDocB);
    if (!first || !second) return [];
    return [
      { label: "Pages", value: `${first.page_count ?? "—"} vs ${second.page_count ?? "—"}` },
      { label: "Chunks", value: `${first.chunk_count ?? "—"} vs ${second.chunk_count ?? "—"}` },
      { label: "Size", value: `${first.size_mb ? `${first.size_mb.toFixed(1)} MB` : "—"} vs ${second.size_mb ? `${second.size_mb.toFixed(1)} MB` : "—"}` },
    ];
  }, [compareDocA, compareDocB, documents]);

  const handleSaveConversation = () => {
    const title = window.prompt("Name this conversation", `Conversation ${savedConversations.length + 1}`);
    if (title) saveConversation(title);
  };

  const handleRenameConversation = (conversation) => {
    const nextTitle = window.prompt("Rename conversation", conversation.title);
    if (nextTitle) renameConversation(conversation.id, nextTitle);
  };

  return (
    <main className="min-h-screen px-6 pb-24 pt-10 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8 lg:grid lg:grid-cols-[22rem_1fr] lg:gap-8 lg:space-y-0">
        <aside className="rounded-[1.75rem] border border-slate-700 bg-slate-950/90 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
          <div className="mb-6 space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <h2 className="text-2xl font-semibold text-white">Your document intelligence hub</h2>
            <p className="text-sm leading-6 text-slate-400">
              Upload documents, manage your library, and ask questions with confidence from a polished workspace.
            </p>
          </div>

          <div className="mb-4 rounded-[1.2rem] border border-white/10 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Sharing</p>
                <p className="mt-1 text-sm font-semibold text-white">{workspaceMode === "personal" ? "Personal workspace" : "Shared workspace"}</p>
              </div>
              <button
                onClick={() => setWorkspaceMode(workspaceMode === "personal" ? "shared" : "personal")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${workspaceMode === "personal" ? "bg-slate-800 text-slate-200" : "bg-emerald-500/15 text-emerald-300"}`}
              >
                {workspaceMode === "personal" ? "Invite" : "Shared"}
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <Users2 className="h-4 w-4 text-cyan-300" />
              {workspaceMembers} collaborators online
            </div>
          </div>

          <div className="mb-4 rounded-[1.2rem] border border-white/10 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Theme</p>
              <button
                onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
                className="rounded-full border border-white/10 bg-slate-800/70 p-2 text-slate-300"
              >
                {themeMode === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-400">Switch between the dark studio view and a lighter workspace layout.</p>
          </div>

          <UploadZone3D />
          <DocumentList />

          <div className="mt-4 rounded-[1.2rem] border border-cyan-400/20 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Compare documents
              </div>
              <button
                onClick={() => setCompareDocuments(null, null)}
                className="text-[11px] uppercase tracking-[0.2em] text-slate-500"
              >
                Clear
              </button>
            </div>
            {comparisonSummary.length > 0 ? (
              <div className="mt-3 space-y-2">
                {comparisonSummary.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                    <p className="mt-1 text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">Select two documents from the library to compare page and chunk counts instantly.</p>
            )}
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Saved threads</p>
              <button
                onClick={handleSaveConversation}
                className="rounded-full border border-white/10 bg-slate-800/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-slate-300"
              >
                <span className="inline-flex items-center gap-1"><Save className="h-3.5 w-3.5" /> Save</span>
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {savedConversations.length === 0 ? (
                <p className="text-sm text-slate-400">Save a conversation to revisit it later.</p>
              ) : (
                savedConversations.map((conversation) => (
                  <div key={conversation.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <button onClick={() => restoreConversation(conversation.id)} className="text-left text-sm font-medium text-slate-100">
                        {conversation.title}
                      </button>
                      <div className="flex gap-1">
                        <button onClick={() => handleRenameConversation(conversation)} className="rounded-full border border-white/10 p-1.5 text-slate-400 transition hover:text-white">
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => deleteConversation(conversation.id)} className="rounded-full border border-white/10 p-1.5 text-slate-400 transition hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">{conversation.documentLabel}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <section className="rounded-[1.75rem] border border-slate-700 bg-slate-950/90 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
          <ChatPanel />
        </section>
      </div>
    </main>
  );
}
