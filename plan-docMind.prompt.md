## Plan: DocMind full-stack RAG chatbot

Build a complete React + Vite frontend with Tailwind and Framer Motion, and a FastAPI backend that ingests PDFs, builds a FAISS-backed RAG index, and streams Ollama Cloud responses with citations.

**Steps**
1. Initialize workspace structure
   - Create `docmind/backend/`, `docmind/frontend/`, and root `docker-compose.yml`.
   - Add a top-level `README.md` and `.env.example`.

2. Implement backend scaffolding
   - `backend/main.py` with FastAPI app, CORS, and route registration.
   - `backend/services/pdf_service.py` for PDF upload parsing via PyMuPDF.
   - `backend/services/embedding_service.py` for Ollama Cloud embedding calls.
   - `backend/services/rag_service.py` for LangChain chunking, FAISS index persistence, retrieval, and prompt construction.
   - `backend/requirements.txt` listing FastAPI, uvicorn, langchain, faiss-cpu, python-multipart, pymupdf, httpx, python-dotenv.

3. Design backend endpoints
   - `POST /upload` to accept PDF, parse pages, chunk text, create embeddings, persist FAISS index and metadata, return `doc_id`, `page_count`, `chunk_count`, `title`.
   - `POST /chat` to accept `doc_id`, `message`, `history`, load index, retrieve top-k chunks, stream Ollama Cloud response as SSE or text stream, emit final `sources` metadata.
   - `GET /documents` to list indexed docs.
   - `DELETE /documents/{doc_id}` to delete index file and metadata.

4. Add backend prompt & RAG logic
   - Use the provided DocMind system prompt.
   - Include page-number metadata in each chunk for citations.
   - Build a retrieval chain with similarity search top_k=5.
   - Ensure incomplete answers fall back to "I couldn't find that in the document." when context is unrelated.

5. Implement frontend scaffolding
   - Initialize Vite React app under `frontend/`.
   - Add Tailwind config, `postcss.config.js`, and necessary dependencies.
   - Add Zustand store slices for documents, active doc, processingState, messages, isStreaming.

6. Build UI components
   - `App` with `AnimatedBackground`, `Sidebar`, and `ChatPanel`.
   - `AnimatedBackground` with blurred gradient orbs and figure-8 CSS animation.
   - `UploadZone3D` with hover tilt, flip on drop, and canvas particle effect.
   - `ProcessingTimeline` with animated step pills and data-stream rectangles.
   - `DocumentList` cards with hover/active animations and delete flip-out.
   - Chat panel with `ChatHeader`, `MessageList`, `UserMessage`, `AIMessage`, `SourceCards`, `TypingIndicator`, `ChatInput`.

7. Wire frontend state and API
   - Upload PDFs to backend and update document list.
   - Track processingState and display timeline animation during upload.
   - Manage active document selection and load its chat history.
   - Implement streaming chat via fetch with `ReadableStream` and incremental token appending.
   - Attach source citations after final stream event.

8. Add environment & config files
   - Root `.env.example` with `OLLAMA_API_KEY`, `OLLAMA_API_URL`, optional `PINECONE_API_KEY`, `PINECONE_INDEX`, `MAX_FILE_SIZE_MB`, `ALLOWED_EXTENSIONS`.
   - Backend loads `.env` values with python-dotenv and uses local FAISS by default.
   - Add Pinecone placeholder logic for future production mode if env vars present.

9. Add Docker compose
   - `docker-compose.yml` to run backend and frontend together.
   - Mount backend `/indexes` persistently.
   - Expose backend + frontend ports and wire env file.

10. Write README
   - Setup instructions for backend and frontend.
   - How to run in dev and Docker.
   - Demo GIF placeholder note.

**Verification**
1. Confirm backend starts with `uvicorn backend.main:app --reload` and OpenAPI docs available.
2. Confirm frontend starts with `npm install` and `npm run dev`, rendering initial page.
3. Upload a sample PDF and verify `POST /upload` persists `indexes/{doc_id}.faiss` and returns metadata.
4. Send a chat message, verify streaming response populates the UI and source cards appear.
5. Test `GET /documents` and `DELETE /documents/{doc_id}` for document lifecycle.
6. Confirm animations function: drop card flips, timeline pills animate, chat messages spring in.

**Decisions**
- Implement local FAISS as primary vector store and add Pinecone integration support as optional configuration.
- Use Vite + React + Tailwind + Framer Motion exactly as requested.
- Use Ollama Cloud as the primary AI provider for chat and embeddings.

**Further Considerations**
1. Confirm whether you want the backend to support plain SSE with `EventSource` or streaming via fetch `ReadableStream`; plan assumes the latter for broader browser compatibility.
2. Decide if document metadata should persist in a simple JSON index store or in-memory during dev; plan uses JSON metadata files alongside FAISS indexes.
3. Confirm if production Pinecone support should be implemented fully now or left as an optional path placeholder.