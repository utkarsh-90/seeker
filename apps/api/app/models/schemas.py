from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Document(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    source: str
    content_type: str
    char_count: int
    chunk_count: int
    created_at: datetime


class Chunk(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    doc_id: str
    text: str
    token_count: int
    position: int


class IngestResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    doc_id: str
    chunks: int
    elapsed_ms: int


class DocumentSummary(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    source: str
    content_type: str
    chunk_count: int
    created_at: datetime
