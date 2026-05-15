import pytest
from app.ingest.chunker import chunk_text


def test_short_text_single_chunk() -> None:
    text = "hello world"
    out = chunk_text(text, chunk_size=64, overlap=8)
    assert len(out) == 1
    assert out[0][0] == 0
    assert out[0][1] == text


def test_long_text_multiple_chunks() -> None:
    text = "word " * 2000
    out = chunk_text(text, chunk_size=32, overlap=4)
    assert len(out) > 1
    positions = [p for p, _ in out]
    assert positions == list(range(len(out)))


def test_overlap_stride_between_chunks() -> None:
    from app.ingest.chunker import _encoder

    enc = _encoder()
    chunk_size = 32
    overlap = 8
    stride = chunk_size - overlap
    text = "p" * 2000
    out = chunk_text(text, chunk_size=chunk_size, overlap=overlap)
    assert len(out) >= 2
    full_toks = enc.encode(text)
    for idx, (_pos, body) in enumerate(out):
        body_toks = enc.encode(body)
        start = idx * stride
        if start + chunk_size <= len(full_toks):
            assert body_toks == full_toks[start : start + chunk_size]
        if idx > 0:
            prev_start = (idx - 1) * stride
            if prev_start + chunk_size <= len(full_toks) and start + chunk_size <= len(full_toks):
                shared_span = prev_start + chunk_size - start
                assert shared_span == overlap


def test_empty_input_returns_empty() -> None:
    assert chunk_text("", chunk_size=32, overlap=4) == []
    assert chunk_text("   \n\t  ", chunk_size=32, overlap=4) == []


def test_overlap_requires_less_than_chunk_size() -> None:
    with pytest.raises(ValueError, match="overlap"):
        chunk_text("a b c", chunk_size=8, overlap=8)
