from dataclasses import dataclass
from typing import List

import fitz


@dataclass
class PageText:
    page_number: int
    text: str


def parse_pdf(file_bytes: bytes) -> List[PageText]:
    pages: List[PageText] = []
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for index, page in enumerate(doc):
            text = page.get_text("text").strip()
            pages.append(PageText(page_number=index + 1, text=text))
    return pages


def extract_title(file_bytes: bytes, fallback: str) -> str:
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            metadata = doc.metadata or {}
            title = (metadata.get("title") or "").strip()
            if title:
                return title
    except Exception:
        pass
    return fallback
