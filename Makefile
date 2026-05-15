.PHONY: api web up down logs install test-api fmt

api:
	cd apps/api && uv run uvicorn app.main:app --reload --port 8000

web:
	cd apps/web && pnpm dev

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

install:
	cd apps/api && uv sync && cd ../web && pnpm install

test-api:
	cd apps/api && uv run pytest

fmt:
	cd apps/api && uv run ruff format . && uv run ruff check --fix .
