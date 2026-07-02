from typing import List, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from backend import config
from backend.services.rag_service import rag_service

app = FastAPI(title="DocMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    doc_id: str
    message: str
    history: List[ChatMessage] = []


class DocumentInfo(BaseModel):
    doc_id: str
    title: str
    page_count: int
    chunk_count: int


@app.get("/health")
async def health():
    return {"status": "ok", "pinecone_enabled": config.USE_PINECONE}


@app.post("/upload", response_model=DocumentInfo)
async def upload_document(file: UploadFile = File(...)):
    ext = (file.filename or "").rsplit(".", 1)[-1].lower()
    if ext not in config.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type .{ext} not allowed.")

    file_bytes = await file.read()
    if len(file_bytes) > config.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds {config.MAX_FILE_SIZE_MB}MB limit.",
        )

    try:
        meta = rag_service.ingest(file_bytes, file.filename or "document.pdf")
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {exc}")

    return DocumentInfo(
        doc_id=meta.doc_id,
        title=meta.title,
        page_count=meta.page_count,
        chunk_count=meta.chunk_count,
    )


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        sources = rag_service.retrieve(request.doc_id, request.message)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Retrieval failed: {exc}")

    system_prompt, user_content = rag_service.build_prompt(
        request.message, sources, [m.model_dump() for m in request.history]
    )

    sources_payload = [
        {
            "page_number": s["page_number"],
            "text": s["text"][:240],
            "score": s["score"],
        }
        for s in sources
    ]

    async def event_stream():
        full_text = ""
        try:
            async for token in rag_service.stream_answer(
                system_prompt, user_content, [m.model_dump() for m in request.history]
            ):
                full_text += token
                yield f"data: {json_dumps(token)}\n\n"
        except Exception as exc:
            yield f"data: [ERROR] {json_dumps(str(exc))}\n\n"
            return

        sources_json = json_dumps(sources_payload)
        yield f"event: sources\ndata: {sources_json}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.get("/documents", response_model=List[DocumentInfo])
async def list_documents():
    docs = rag_service.list_documents()
    return [DocumentInfo(**d) for d in docs]


@app.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    deleted = rag_service.delete_document(doc_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found.")
    return {"deleted": True, "doc_id": doc_id}


def json_dumps(obj) -> str:
    import json

    return json.dumps(obj, ensure_ascii=False)
