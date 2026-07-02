from typing import List, Optional

import httpx

from backend import config


class EmbeddingService:
    def __init__(self) -> None:
        self.api_url = config.OLLAMA_API_URL.rstrip("/")
        self.api_key = config.OLLAMA_API_KEY
        self.model = config.EMBEDDING_MODEL

    def _headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        embeddings: List[List[float]] = []
        with httpx.Client(timeout=60.0) as client:
            for text in texts:
                # Determine endpoint and payload based on API URL
                if "/v1" in self.api_url:
                    payload = {"model": self.model, "input": text}
                    endpoint = "/embeddings"
                else:
                    payload = {"model": self.model, "prompt": text}
                    endpoint = "/api/embeddings"
                resp = client.post(
                    f"{self.api_url}{endpoint}",
                    json=payload,
                    headers=self._headers(),
                )
                resp.raise_for_status()
                data = resp.json()
                if "embedding" in data:
                    embeddings.append(data["embedding"])
                elif "data" in data and len(data["data"]) > 0:
                    embeddings.append(data["data"][0]["embedding"])
                elif "embeddings" in data and len(data["embeddings"]) > 0:
                    embeddings.append(data["embeddings"][0])
                else:
                    raise KeyError(f"Unexpected API response format: {data}")
        return embeddings

    def embed_query(self, text: str) -> List[float]:
        result = self.embed_texts([text])
        return result[0] if result else []


def get_pinecone_index():
    if not config.USE_PINECONE:
        return None
    try:
        from pinecone import Pinecone, ServerlessSpec

        pc = Pinecone(api_key=config.PINECONE_API_KEY)
        index = pc.Index(config.PINECONE_INDEX)
        return index
    except Exception:
        return None
