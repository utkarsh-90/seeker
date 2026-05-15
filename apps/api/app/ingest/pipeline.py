import logging
from datetime import UTC, datetime
from pathlib import Path
from time import perf_counter
from uuid import uuid4

from fastapi import HTTPException

from app.config import Settings
from app.ingest.chunker import chunk_text, token_len
from app.ingest.embedder import get_gemini_embedder
from app.ingest.parser import extract_title, parse_file
from app.models.schemas import Chunk, Document, IngestResponse
from app.retrieval.qdrant import get_qdrant

log = logging.getLogger(__name__)


async def ingest_file(filename: str, content: bytes, settings: Settings) -> IngestResponse:
    try:
        text = parse_file(filename, content)
        positions_and_texts = chunk_text(text, settings.chunk_size, settings.chunk_overlap)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    stem = Path(filename).stem or "document"
    suffix = Path(filename).suffix.lower().lstrip(".") or "txt"
    title = extract_title(text, stem)
    if not positions_and_texts:
        raise HTTPException(status_code=400, detail="file produced no indexable text")
    doc_id = str(uuid4())
    now = datetime.now(UTC)
    document = Document(
        id=doc_id,
        title=title,
        source=filename,
        content_type=suffix,
        char_count=len(text),
        chunk_count=len(positions_and_texts),
        created_at=now,
    )
    chunks = [
        Chunk(
            id=str(uuid4()),
            doc_id=doc_id,
            text=chunk_body,
            token_count=token_len(chunk_body),
            position=position,
        )
        for position, chunk_body in positions_and_texts
    ]
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY is not configured")
    embedder = get_gemini_embedder(
        settings.gemini_api_key,
        settings.embedding_model,
        settings.embedding_dim,
    )
    texts = [c.text for c in chunks]
    store = get_qdrant(settings)
    t0 = perf_counter()
    vectors = await embedder.embed_batch(texts)
    await store.upsert_chunks(doc_id, chunks, vectors, document=document)
    elapsed_ms = int((perf_counter() - t0) * 1000)
    log.info("ingested document %s with %s chunks in %sms", doc_id, len(chunks), elapsed_ms)
    return IngestResponse(doc_id=doc_id, chunks=len(chunks), elapsed_ms=elapsed_ms)
