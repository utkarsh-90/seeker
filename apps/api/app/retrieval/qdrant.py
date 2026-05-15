from datetime import datetime
from functools import lru_cache

from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

from app.config import Settings
from app.models.schemas import Chunk, Document, DocumentSummary


class QdrantStore:
    def __init__(self, url: str, collection: str, dim: int) -> None:
        self._client = AsyncQdrantClient(url=url)
        self.collection = collection
        self.dim = dim

    async def ensure_collection(self) -> None:
        exists = await self._client.collection_exists(self.collection)
        if not exists:
            await self._client.create_collection(
                collection_name=self.collection,
                vectors_config=VectorParams(size=self.dim, distance=Distance.COSINE),
            )

    async def upsert_chunks(
        self,
        doc_id: str,
        chunks: list[Chunk],
        vectors: list[list[float]],
        *,
        document: Document,
    ) -> None:
        if document.id != doc_id:
            raise ValueError("document.id must match doc_id")
        if len(chunks) != len(vectors):
            raise ValueError("chunks and vectors length mismatch")
        points: list[PointStruct] = []
        for chunk, vector in zip(chunks, vectors, strict=True):
            payload = {
                **chunk.model_dump(mode="json"),
                "doc_title": document.title,
                "doc_source": document.source,
                "doc_content_type": document.content_type,
                "doc_created_at": document.created_at.isoformat(),
            }
            points.append(PointStruct(id=chunk.id, vector=vector, payload=payload))
        await self._client.upsert(collection_name=self.collection, points=points)

    async def list_documents(self) -> list[DocumentSummary]:
        records, _next = await self._client.scroll(
            collection_name=self.collection,
            limit=10000,
            with_payload=True,
            with_vectors=False,
        )
        chunk_counts: dict[str, int] = {}
        metas: dict[str, DocumentSummary] = {}
        for rec in records:
            pl = rec.payload or {}
            did = pl.get("doc_id")
            if not isinstance(did, str) or not did:
                continue
            chunk_counts[did] = chunk_counts.get(did, 0) + 1
            if did in metas:
                continue
            created_raw = pl.get("doc_created_at")
            if not isinstance(created_raw, str):
                continue
            metas[did] = DocumentSummary(
                id=did,
                title=str(pl.get("doc_title", "")),
                source=str(pl.get("doc_source", "")),
                content_type=str(pl.get("doc_content_type", "")),
                chunk_count=0,
                created_at=datetime.fromisoformat(created_raw),
            )
        summaries = [
            m.model_copy(update={"chunk_count": chunk_counts[mid]})
            for mid, m in metas.items()
        ]
        summaries.sort(key=lambda s: s.created_at)
        return summaries

    async def delete_document(self, doc_id: str) -> int:
        flt = Filter(
            must=[
                FieldCondition(
                    key="doc_id",
                    match=MatchValue(value=doc_id),
                )
            ]
        )
        cnt = await self._client.count(
            collection_name=self.collection,
            count_filter=flt,
            exact=True,
        )
        n = int(cnt.count)
        if n == 0:
            return 0
        await self._client.delete(collection_name=self.collection, points_selector=flt)
        return n


@lru_cache(maxsize=8)
def _qdrant_store(url: str, collection: str, dim: int) -> QdrantStore:
    return QdrantStore(url, collection, dim)


def get_qdrant(settings: Settings) -> QdrantStore:
    return _qdrant_store(settings.qdrant_url, settings.qdrant_collection, settings.embedding_dim)
