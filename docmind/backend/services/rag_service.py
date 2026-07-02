from __future__ import annotations

import json
import uuid
from dataclasses import asdict, dataclass, field
from typing import AsyncIterator, Dict, List, Optional, Tuple

import httpx
import numpy as np

from backend import config
from backend.services.embedding_service import EmbeddingService
from backend.services.pdf_service import PageText, parse_pdf

try:
    import faiss
except Exception:  # pragma: no cover
    faiss = None

from langchain_text_splitters import RecursiveCharacterTextSplitter

DOCMIND_SYSTEM_PROMPT = (
    "You are DocMind, a precise document analysis assistant. "
    "Answer the user's question using ONLY the provided context extracted from the uploaded document. "
    "If the answer is not contained in the context, reply exactly: "
    "\"I couldn't find that in the document.\" "
    "Do not use outside knowledge. "
    "When you reference information, cite the page number in the format [p. N]. "
    "Keep answers concise, well-structured, and grounded in the source text."
)

UNRELATED_FALLBACK = "I couldn't find that in the document."

CHUNK_SIZE = 800
CHUNK_OVERLAP = 120
TOP_K = 5


@dataclass
class ChunkMeta:
    doc_id: str
    chunk_id: int
    page_number: int
    text: str


@dataclass
class DocumentMeta:
    doc_id: str
    title: str
    page_count: int
    chunk_count: int
    chunks: List[Dict] = field(default_factory=list)


class RagService:
    def __init__(self) -> None:
        self.embedder = EmbeddingService()
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

    def get_chat_model(self) -> str:
        if hasattr(self, "_chat_model"):
            return self._chat_model

        configured = config.CHAT_MODEL
        try:
            url = f"{config.OLLAMA_API_URL.rstrip('/')}/api/tags"
            headers = {}
            if config.OLLAMA_API_KEY:
                headers["Authorization"] = f"Bearer {config.OLLAMA_API_KEY}"
            resp = httpx.get(url, headers=headers, timeout=5.0)
            if resp.status_code == 200:
                data = resp.json()
                models = [m["name"] for m in data.get("models", [])]
                
                if configured in models:
                    self._chat_model = configured
                    return configured
                if f"{configured}:latest" in models:
                    self._chat_model = f"{configured}:latest"
                    return self._chat_model
                
                for m in data.get("models", []):
                    capabilities = m.get("capabilities", [])
                    if "completion" in capabilities:
                        self._chat_model = m["name"]
                        return self._chat_model
                
                for m in data.get("models", []):
                    capabilities = m.get("capabilities", [])
                    if capabilities != ["embedding"]:
                        self._chat_model = m["name"]
                        return self._chat_model
        except Exception:
            pass

        self._chat_model = configured
        return configured

    # ------------------------------------------------------------------ #
    # Ingest
    # ------------------------------------------------------------------ #
    def ingest(self, file_bytes: bytes, filename: str) -> DocumentMeta:
        pages, has_images = parse_pdf(file_bytes)
        doc_id = uuid.uuid4().hex[:12]


        chunk_records: List[Dict] = []
        chunk_id = 0
        for page in pages:
            if not page.text:
                continue
            pieces = self.splitter.split_text(page.text)
            for piece in pieces:
                chunk_records.append(
                    {
                        "chunk_id": chunk_id,
                        "page_number": page.page_number,
                        "text": piece,
                    }
                )
                chunk_id += 1

        if not chunk_records:
            if has_images:
                raise ValueError("This PDF appears to be a scanned image and requires OCR to extract text.")
            raise ValueError("No extractable text found in the PDF.")

        texts = [rec["text"] for rec in chunk_records]
        vectors = self.embedder.embed_texts(texts)

        self._save_index(doc_id, vectors, chunk_records)

        meta = DocumentMeta(
            doc_id=doc_id,
            title=self._derive_title(file_bytes, filename),
            page_count=len(pages),
            chunk_count=len(chunk_records),
            chunks=chunk_records,
        )
        self._save_meta(meta)
        return meta

    # ------------------------------------------------------------------ #
    # Retrieval
    # ------------------------------------------------------------------ #
    def retrieve(self, doc_id: str, query: str, top_k: int = TOP_K) -> List[Dict]:
        meta = self._load_meta(doc_id)
        if meta is None:
            raise ValueError(f"Document {doc_id} not found.")

        query_vec = self.embedder.embed_query(query)
        vectors, records = self._load_index(doc_id, meta)
        if vectors is None or not records:
            return []

        scores, indices = self._search(vectors, query_vec, top_k)
        results: List[Dict] = []
        for score, idx in zip(scores, indices):
            if idx < 0 or idx >= len(records):
                continue
            rec = records[idx]
            results.append(
                {
                    "chunk_id": rec["chunk_id"],
                    "page_number": rec["page_number"],
                    "text": rec["text"],
                    "score": float(score),
                }
            )
        return results

    # ------------------------------------------------------------------ #
    # Prompt building
    # ------------------------------------------------------------------ #
    def build_prompt(self, query: str, sources: List[Dict], history: List[Dict]) -> Tuple[str, str]:
        if not sources:
            return DOCMIND_SYSTEM_PROMPT, UNRELATED_FALLBACK

        context_blocks = []
        for src in sources:
            context_blocks.append(
                f"[p. {src['page_number']}] {src['text']}"
            )
        context = "\n\n".join(context_blocks)

        user_content = (
            f"Context from the document:\n{context}\n\n"
            f"Question: {query}\n\n"
            "Answer using only the context above. Cite page numbers as [p. N]. "
            "If the context does not contain the answer, say: "
            "\"I couldn't find that in the document.\""
        )

        return DOCMIND_SYSTEM_PROMPT, user_content

    # ------------------------------------------------------------------ #
    # Streaming chat
    # ------------------------------------------------------------------ #
    async def stream_answer(
        self, system_prompt: str, user_content: str, history: List[Dict]
    ) -> AsyncIterator[str]:
        messages: List[Dict] = [{"role": "system", "content": system_prompt}]
        for msg in history[-6:]:
            role = "assistant" if msg.get("role") == "assistant" else "user"
            messages.append({"role": role, "content": msg.get("content", "")})
        messages.append({"role": "user", "content": user_content})

        payload = {
            "model": self.get_chat_model(),
            "messages": messages,
            "stream": True,
        }
        headers = {"Content-Type": "application/json"}
        if config.OLLAMA_API_KEY:
            headers["Authorization"] = f"Bearer {config.OLLAMA_API_KEY}"

        # Determine endpoint based on API URL
        endpoint = "/chat/completions" if "/v1" in config.OLLAMA_API_URL else "/api/chat"
        url = f"{config.OLLAMA_API_URL.rstrip('/')}{endpoint}"
        timeout = httpx.Timeout(120.0, connect=30.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            async with client.stream("POST", url, json=payload, headers=headers) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    token = self._parse_sse_line(line)
                    if token:
                        yield token

    # ------------------------------------------------------------------ #
    # Document lifecycle
    # ------------------------------------------------------------------ #
    def list_documents(self) -> List[Dict]:
        docs: List[Dict] = []
        for meta_file in config.META_DIR.glob("*.json"):
            try:
                data = json.loads(meta_file.read_text(encoding="utf-8"))
                docs.append(
                    {
                        "doc_id": data["doc_id"],
                        "title": data["title"],
                        "page_count": data["page_count"],
                        "chunk_count": data["chunk_count"],
                    }
                )
            except Exception:
                continue
        return docs

    def delete_document(self, doc_id: str) -> bool:
        meta_file = config.META_DIR / f"{doc_id}.json"
        index_file = config.INDEX_DIR / f"{doc_id}.faiss"
        npy_file = config.INDEX_DIR / f"{doc_id}.npy"
        deleted = False
        if meta_file.exists():
            meta_file.unlink()
            deleted = True
        if index_file.exists():
            index_file.unlink()
            deleted = True
        if npy_file.exists():
            npy_file.unlink()
            deleted = True
        return deleted

    # ------------------------------------------------------------------ #
    # Internal: index / metadata persistence
    # ------------------------------------------------------------------ #
    def _save_index(self, doc_id: str, vectors: List[List[float]], records: List[Dict]) -> None:
        vec_array = np.array(vectors, dtype="float32")
        if faiss is not None and vec_array.size:
            dim = vec_array.shape[1]
            index = faiss.IndexFlatIP(dim)
            index.add(vec_array)
            faiss.write_index(index, str(config.INDEX_DIR / f"{doc_id}.faiss"))
        np.save(str(config.INDEX_DIR / f"{doc_id}.npy"), vec_array)

    def _load_index(self, doc_id: str, meta: DocumentMeta) -> Tuple[Optional[np.ndarray], List[Dict]]:
        npy_path = config.INDEX_DIR / f"{doc_id}.npy"
        if not npy_path.exists():
            return None, meta.chunks
        vec_array = np.load(str(npy_path)).astype("float32")
        return vec_array, meta.chunks

    def _search(self, vectors: np.ndarray, query_vec: List[float], top_k: int) -> Tuple[np.ndarray, np.ndarray]:
        if faiss is not None:
            dim = vectors.shape[1]
            index = faiss.IndexFlatIP(dim)
            index.add(vectors)
            q = np.array([query_vec], dtype="float32")
            scores, indices = index.search(q, top_k)
            return scores[0], indices[0]
        q = np.array(query_vec, dtype="float32")
        norms = np.linalg.norm(vectors, axis=1) * np.linalg.norm(q)
        norms[norms == 0] = 1e-9
        sims = (vectors @ q) / norms
        top = np.argsort(-sims)[:top_k]
        return sims[top], top

    def _save_meta(self, meta: DocumentMeta) -> None:
        path = config.META_DIR / f"{meta.doc_id}.json"
        path.write_text(json.dumps(asdict(meta), ensure_ascii=False), encoding="utf-8")

    def _load_meta(self, doc_id: str) -> Optional[DocumentMeta]:
        path = config.META_DIR / f"{doc_id}.json"
        if not path.exists():
            return None
        data = json.loads(path.read_text(encoding="utf-8"))
        return DocumentMeta(**data)

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #
    def _derive_title(self, file_bytes: bytes, filename: str) -> str:
        from backend.services.pdf_service import extract_title

        return extract_title(file_bytes, filename)

    def _parse_sse_line(self, line: str) -> Optional[str]:
        line = line.strip()
        if not line:
            return None

        data_str = line
        if line.startswith("data:"):
            data_str = line[5:].strip()
            if data_str == "[DONE]":
                return None

        try:
            obj = json.loads(data_str)
        except json.JSONDecodeError:
            return None

        # OpenAI / Compatible format
        if "choices" in obj:
            choices = obj.get("choices") or []
            if not choices:
                return None
            delta = choices[0].get("delta") or {}
            return delta.get("content")

        # Native Ollama chat format
        if "message" in obj:
            return obj.get("message", {}).get("content")

        # Native Ollama generate format
        if "response" in obj:
            return obj.get("response")

        return None


rag_service = RagService()
