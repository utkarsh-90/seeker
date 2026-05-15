from functools import lru_cache

from google import genai


class GeminiEmbedder:
    def __init__(self, api_key: str, model: str = "gemini-embedding-001", dim: int = 3072) -> None:
        self._model = model
        self._dim = dim
        self._client = genai.Client(api_key=api_key)

    async def embed_batch(
        self, texts: list[str], task_type: str = "RETRIEVAL_DOCUMENT"
    ) -> list[list[float]]:
        out: list[list[float]] = []
        batch_size = 100
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            result = await self._client.aio.models.embed_content(
                model=self._model,
                contents=batch,
                config={"task_type": task_type, "output_dimensionality": self._dim},
            )
            if result.embeddings is None:
                raise ValueError("embedding response missing embeddings list")
            if len(result.embeddings) != len(batch):
                raise ValueError("embedding count does not match input batch size")
            for emb in result.embeddings:
                if emb.values is None:
                    raise ValueError("embedding entry missing values")
                if len(emb.values) != self._dim:
                    raise ValueError(
                        f"expected vector length {self._dim}, got {len(emb.values)}"
                    )
                out.append(list(emb.values))
        return out


@lru_cache(maxsize=16)
def get_gemini_embedder(api_key: str, model: str, dim: int) -> GeminiEmbedder:
    return GeminiEmbedder(api_key, model, dim)
