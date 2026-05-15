from io import BytesIO
from pathlib import Path

from pypdf import PdfReader


def parse_file(filename: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix == ".pdf":
        reader = PdfReader(stream=BytesIO(content))
        parts: list[str] = []
        for page in reader.pages:
            t = page.extract_text() or ""
            parts.append(t)
        return "\n\n".join(parts).strip()
    if suffix in (".md", ".txt"):
        return content.decode("utf-8").strip()
    raise ValueError(f"unsupported file type: {suffix}")


def extract_title(text: str, fallback: str) -> str:
    max_len = 80
    for raw in text.splitlines():
        s = raw.strip()
        if not s:
            continue
        while True:
            s2 = s.lstrip()
            if not s2:
                s = s2
                break
            if s2.startswith("#"):
                s = s2[1:]
                continue
            s = s2
            break
        s = s.strip()
        if not s:
            continue
        if len(s) > max_len:
            cut = s[:max_len]
            last_space = cut.rfind(" ")
            s = (
                cut[:last_space].rstrip()
                if last_space >= max_len // 2
                else cut.rstrip()
            )
        return s
    return fallback
