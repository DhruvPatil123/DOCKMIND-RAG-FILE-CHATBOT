const BASE = import.meta.env.VITE_API_URL || "";

export async function uploadPdf(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await fetch(`${BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Upload failed");
  }
  return resp.json();
}

export async function fetchDocuments() {
  const resp = await fetch(`${BASE}/documents`);
  if (!resp.ok) throw new Error("Failed to fetch documents");
  return resp.json();
}

export async function deleteDocument(docId) {
  const resp = await fetch(`${BASE}/documents/${docId}`, {
    method: "DELETE",
  });
  if (!resp.ok) throw new Error("Failed to delete document");
  return resp.json();
}

export async function streamChat({ docId, message, history, onToken, onSources }) {
  const resp = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_id: docId, message, history }),
  });

  if (!resp.ok || !resp.body) {
    throw new Error("Chat request failed");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let currentEvent = null;
    for (const line of lines) {
      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        const data = line.slice(5).trim();
        if (data === "[DONE]") continue;
        if (currentEvent === "sources") {
          try {
            onSources?.(JSON.parse(data));
          } catch {
            /* ignore */
          }
          currentEvent = null;
        } else if (data.startsWith("[ERROR]")) {
          onToken?.(data);
        } else {
          onToken?.(data);
        }
      }
    }
  }
}
