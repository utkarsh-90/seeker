from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.config import Settings, get_settings
from app.ingest.pipeline import ingest_file
from app.models.schemas import DocumentSummary, IngestResponse
from app.retrieval.qdrant import get_qdrant

router = APIRouter(tags=["ingest"])


@router.post("/ingest", response_model=IngestResponse)
async def ingest_endpoint(
    file: UploadFile = File(...),  # noqa: B008
    settings: Settings = Depends(get_settings),  # noqa: B008
) -> IngestResponse:
    content = await file.read()
    if not file.filename:
        raise HTTPException(status_code=400, detail="filename required")
    return await ingest_file(file.filename, content, settings)


@router.get("/documents", response_model=list[DocumentSummary])
async def list_documents(
    settings: Settings = Depends(get_settings),  # noqa: B008
) -> list[DocumentSummary]:
    store = get_qdrant(settings)
    return await store.list_documents()


@router.delete("/documents/{doc_id}")
async def delete_document(
    doc_id: str,
    settings: Settings = Depends(get_settings),  # noqa: B008
) -> dict[str, int]:
    store = get_qdrant(settings)
    count = await store.delete_document(doc_id)
    return {"deleted": count}
