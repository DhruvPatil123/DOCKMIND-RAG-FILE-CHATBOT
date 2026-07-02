from dataclasses import dataclass
from typing import List, Tuple

import fitz


@dataclass
class PageText:
    page_number: int
    text: str


def parse_pdf(file_bytes: bytes) -> Tuple[List[PageText], bool]:
    pages: List[PageText] = []
    has_images = False
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for index, page in enumerate(doc):
            text = page.get_text("text").strip()
            if not text and len(page.get_images()) > 0:
                has_images = True
            pages.append(PageText(page_number=index + 1, text=text))
    return pages, has_images


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
