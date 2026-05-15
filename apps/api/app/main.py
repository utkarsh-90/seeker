import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings

settings = get_settings()
log = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("starting %s in %s", settings.app_name, settings.env)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok", "env": settings.env}