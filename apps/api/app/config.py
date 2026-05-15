from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=_ENV_PATH, env_file_encoding="utf-8")

    app_name: str = "seeker-api"
    env: str = "dev"
    qdrant_url: str = "http://localhost:6333"
    qdrant_collection: str = "seeker"
    embedding_model: str = "gemini-embedding-001"
    embedding_dim: int = 3072
    chunk_size: int = 512
    chunk_overlap: int = 64
    postgres_url: str = "postgresql://seeker:seeker@localhost:5432/seeker"
    groq_api_key: str | None = None
    gemini_api_key: str | None = None
    openrouter_api_key: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
