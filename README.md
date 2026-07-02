# 🧠 DocMind

DocMind is a sophisticated **Retrieval-Augmented Generation (RAG)** chatbot that allows you to have intelligent, grounded conversations with your PDF documents. Instead of reading long documents manually, you can upload them to DocMind and ask questions. The AI will answer using **only** the provided context from your document and will cite the exact page numbers for every claim.

## ✨ Features

- 📄 **PDF Ingestion Pipeline**: Automatic parsing, text chunking, and embedding of uploaded PDFs.
- 🔍 **Semantic Search**: Powered by **FAISS** (Facebook AI Similarity Search) to find the most relevant sections of your document in milliseconds.
- 💬 **Streaming AI Responses**: Real-time token streaming for a fluid, ChatGPT-like chatting experience.
- 📍 **Grounded Citations**: Every answer is strictly grounded in the source text with page references (e.g., `[p. 2]`).
- 🖼️ **Scanned PDF Detection**: Intelligent detection of image-only PDFs with helpful error messaging.
- 📂 **Document Management**: Easily upload, list, and delete multiple documents.
- 🎨 **Modern UI**: A sleek, dark-themed interface built with React and Tailwind CSS, featuring animated processing states.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **PDF Processing**: PyMuPDF (fitz)
- **Vector Store**: FAISS
- **LLM Orchestration**: LangChain
- **Local AI Engine**: [Ollama](https://ollama.com/)
    - **Chat Model**: `qwen2.5` (or configured alternative)
    - **Embedding Model**: `nomic-embed-text`

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com/) installed and running locally.

### 1. Setup Ollama
Pull the required models before starting the backend:
```bash
ollama pull qwen2.5:0.5b
ollama pull nomic-embed-text
```

### 2. Backend Installation
```bash
cd docmind/backend
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate # Windows
source venv/bin/activate # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend Installation
```bash
cd docmind/frontend
npm install
npm run dev
```

The frontend will typically be available at `http://localhost:5173`.

## 📖 How it Works

1. **Ingestion**: When you upload a PDF, the system parses the pages, splits the text into chunks of ~800 characters, and generates embeddings for each chunk.
2. **Indexing**: These embeddings are stored in a local FAISS index, allowing for efficient similarity searches.
3. **Retrieval**: When you ask a question, the system embeds your query and finds the top-K most similar chunks from the document.
4. **Generation**: The retrieved chunks and your question are sent to the local LLM with a strict system prompt that forbids using outside knowledge, ensuring 100% grounded answers.

## 📁 Project Structure

```text
docmind/
├── backend/
│   ├── services/
│   │   ├── embedding_service.py  # Handles vector generation via Ollama
│   │   ├── pdf_service.py        # PDF parsing and text extraction
│   │   └── rag_service.py        # Main RAG logic (Ingest -> Retrieve -> Generate)
│   ├── main.py                   # FastAPI endpoints
│   └── config.py                 # App configuration and environment variables
└── frontend/
    ├── src/
    │   ├── components/            # UI components (Chat, Timeline, etc.)
    │   ├── store/                 # Zustand state management
    │   └── api.js                 # API communication layer
    └── index.html
```

## 📜 License
MIT License
