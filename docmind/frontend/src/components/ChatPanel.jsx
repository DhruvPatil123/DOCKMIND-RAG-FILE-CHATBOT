import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useStore } from "../store/useStore";

const quickPrompts = [
  "Summarize the key deadlines in this document",
  "Find risks or exceptions in this file",
  "What are the most important action items?",
];

export default function ChatPanel() {
  const activeDocId = useStore((s) => s.activeDocId);
  const documents = useStore((s) => s.documents);
  const isStreaming = useStore((s) => s.isStreaming);
  const sendMessage = useStore((s) => s.sendMessage);
  const getActiveMessages = useStore((s) => s.getActiveMessages);

  const doc = documents.find((d) => d.doc_id === activeDocId);
  const messages = getActiveMessages();

  return (
    <div className="flex h-full flex-col">
      <ChatHeader document={doc} />
      <MessageList messages={messages} />
      <ChatInput suggestions={quickPrompts} onSend={sendMessage} disabled={!activeDocId || isStreaming} />
    </div>
  );
}
