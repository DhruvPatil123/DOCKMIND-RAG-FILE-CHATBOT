import { create } from "zustand";
import {
  uploadPdf,
  fetchDocuments,
  deleteDocument,
  streamChat,
} from "../api";

const readStoredState = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStoredState = (key, value) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const useStore = create((set, get) => ({
  documents: [],
  activeDocId: null,
  messages: {},
  isStreaming: false,
  processingState: "idle",
  processingSteps: [],
  error: null,
  themeMode: readStoredState("docmind-theme", "dark"),
  workspaceMode: readStoredState("docmind-workspace", "personal"),
  workspaceMembers: 3,
  documentSearchQuery: "",
  compareDocA: null,
  compareDocB: null,
  savedConversations: readStoredState("docmind-conversations", []),
  activeConversationId: null,

  getActiveMessages: () => {
    const { activeDocId, messages } = get();
    return activeDocId ? messages[activeDocId] || [] : [];
  },

  setThemeMode: (mode) => {
    writeStoredState("docmind-theme", mode);
    set({ themeMode: mode });
  },

  setWorkspaceMode: (mode) => {
    writeStoredState("docmind-workspace", mode);
    set({ workspaceMode: mode });
  },

  setDocumentSearchQuery: (query) => set({ documentSearchQuery: query }),

  setCompareDocuments: (docA, docB) => set({ compareDocA: docA, compareDocB: docB }),

  saveConversation: (title) => {
    const { activeDocId, messages, documents, savedConversations } = get();
    if (!activeDocId) return null;

    const nextConversation = {
      id: crypto.randomUUID(),
      title: title || `Conversation ${savedConversations.length + 1}`,
      activeDocId,
      messages: { ...messages },
      updatedAt: new Date().toISOString(),
      documentLabel: documents.find((doc) => doc.doc_id === activeDocId)?.title || "Current workspace",
    };

    const nextConversations = [nextConversation, ...savedConversations].slice(0, 8);
    writeStoredState("docmind-conversations", nextConversations);
    set({ savedConversations: nextConversations, activeConversationId: nextConversation.id });
    return nextConversation;
  },

  restoreConversation: (id) => {
    const conversation = get().savedConversations.find((item) => item.id === id);
    if (!conversation) return null;
    set({
      activeConversationId: id,
      activeDocId: conversation.activeDocId,
      messages: conversation.messages,
    });
    return conversation;
  },

  renameConversation: (id, title) => {
    set((state) => {
      const nextConversations = state.savedConversations.map((item) => (item.id === id ? { ...item, title } : item));
      writeStoredState("docmind-conversations", nextConversations);
      return { savedConversations: nextConversations };
    });
  },

  deleteConversation: (id) => {
    set((state) => {
      const nextConversations = state.savedConversations.filter((item) => item.id !== id);
      writeStoredState("docmind-conversations", nextConversations);
      return {
        savedConversations: nextConversations,
        activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
      };
    });
  },

  clearCurrentThread: () => {
    const { activeDocId } = get();
    if (!activeDocId) return;
    set((state) => ({
      messages: {
        ...state.messages,
        [activeDocId]: [],
      },
      activeConversationId: null,
    }));
  },

  loadDocuments: async () => {
    try {
      const docs = await fetchDocuments();
      set({ documents: docs });
    } catch (e) {
      set({ error: e.message });
    }
  },

  selectDocument: (docId) => {
    set({ activeDocId: docId, activeConversationId: null });
  },

  uploadDocument: async (file) => {
    set({
      processingState: "uploading",
      processingSteps: [
        { id: "upload", label: "Uploading PDF", status: "active" },
        { id: "parse", label: "Parsing pages", status: "pending" },
        { id: "chunk", label: "Chunking text", status: "pending" },
        { id: "embed", label: "Creating embeddings", status: "pending" },
        { id: "index", label: "Building FAISS index", status: "pending" },
      ],
      error: null,
    });

    const advanceStep = (stepId) => {
      set((state) => ({
        processingSteps: state.processingSteps.map((s) => {
          if (s.id === stepId) return { ...s, status: "done" };
          const idx = state.processingSteps.findIndex((x) => x.id === stepId);
          if (s.id === state.processingSteps[idx + 1]?.id) return { ...s, status: "active" };
          return s;
        }),
      }));
    };

    try {
      setTimeout(() => advanceStep("upload"), 300);
      setTimeout(() => advanceStep("parse"), 700);
      setTimeout(() => advanceStep("chunk"), 1200);
      setTimeout(() => advanceStep("embed"), 1800);
      const doc = await uploadPdf(file);
      setTimeout(() => advanceStep("embed"), 100);
      advanceStep("index");
      set((state) => ({
        documents: [...state.documents, doc],
        activeDocId: doc.doc_id,
        messages: { ...state.messages, [doc.doc_id]: [] },
        processingState: "done",
        processingSteps: state.processingSteps.map((s) => ({ ...s, status: "done" })),
      }));
      setTimeout(() => set({ processingState: "idle" }), 1500);
      return doc;
    } catch (e) {
      set({ processingState: "error", error: e.message });
      setTimeout(() => set({ processingState: "idle" }), 2500);
      throw e;
    }
  },

  removeDocument: async (docId) => {
    await deleteDocument(docId);
    set((state) => {
      const documents = state.documents.filter((d) => d.doc_id !== docId);
      const messages = { ...state.messages };
      delete messages[docId];
      const activeDocId = state.activeDocId === docId ? null : state.activeDocId;
      return { documents, messages, activeDocId };
    });
  },

  sendMessage: async (message) => {
    const { activeDocId, messages, isStreaming } = get();
    if (!activeDocId || isStreaming) return;

    const userMsg = { role: "user", content: message, id: crypto.randomUUID() };
    const aiMsg = { role: "assistant", content: "", sources: [], id: crypto.randomUUID(), streaming: true };

    const history = (messages[activeDocId] || []).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    set((state) => ({
      messages: {
        ...state.messages,
        [activeDocId]: [...(state.messages[activeDocId] || []), userMsg, aiMsg],
      },
      isStreaming: true,
    }));

    const updateAi = (updater) => {
      set((state) => ({
        messages: {
          ...state.messages,
          [activeDocId]: state.messages[activeDocId].map((m) =>
            m.id === aiMsg.id ? { ...m, ...updater(m) } : m
          ),
        },
      }));
    };

    try {
      await streamChat({
        docId: activeDocId,
        message,
        history,
        onToken: (token) => {
          if (token.startsWith("[ERROR]")) {
            updateAi((m) => ({ content: m.content + token, streaming: false }));
            return;
          }
          updateAi((m) => ({ content: m.content + token }));
        },
        onSources: (sources) => {
          updateAi(() => ({ sources }));
        },
      });
      updateAi(() => ({ streaming: false }));
    } catch (e) {
      updateAi(() => ({ content: `Error: ${e.message}`, streaming: false }));
    } finally {
      set({ isStreaming: false });
    }
  },
}));
