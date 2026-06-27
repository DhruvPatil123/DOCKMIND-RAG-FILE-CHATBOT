import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "")
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "https://api.olama.cloud/v1")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "")

MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "20"))
ALLOWED_EXTENSIONS = tuple(
    ext.strip().lower().lstrip(".")
    for ext in os.getenv("ALLOWED_EXTENSIONS", "pdf").split(",")
)

INDEX_DIR = BASE_DIR / "indexes"
META_DIR = BASE_DIR / "metadata"
INDEX_DIR.mkdir(parents=True, exist_ok=True)
META_DIR.mkdir(parents=True, exist_ok=True)

CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL", "llama3.1")
EMBEDDING_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

USE_PINECONE = bool(PINECONE_API_KEY and PINECONE_INDEX)

CORS_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if o.strip()
]
