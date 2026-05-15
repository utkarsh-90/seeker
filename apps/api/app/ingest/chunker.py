from functools import lru_cache

import tiktoken


@lru_cache(maxsize=1)
def _encoder() -> tiktoken.Encoding:
    return tiktoken.get_encoding("cl100k_base")


def token_len(text: str) -> int:
    return len(_encoder().encode(text))


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[tuple[int, str]]:
    enc = _encoder()
    tokens = enc.encode(text)
    if not tokens:
        return []
    if overlap >= chunk_size:
        raise ValueError("overlap must be less than chunk_size")
    stride = chunk_size - overlap
    out: list[tuple[int, str]] = []
    pos = 0
    start = 0
    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk_tokens = tokens[start:end]
        decoded = enc.decode(chunk_tokens).strip()
        if decoded:
            out.append((pos, decoded))
            pos += 1
        if end >= len(tokens):
            break
        start += stride
    return out
