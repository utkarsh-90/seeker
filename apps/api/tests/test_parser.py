from app.ingest.parser import extract_title, parse_file


def test_parse_markdown_inline() -> None:
    raw = b"# Title\n\nbody here"
    text = parse_file("notes.md", raw)
    assert "Title" in text
    assert "body here" in text


def test_extract_title_strips_hash_prefix() -> None:
    assert extract_title("# My Heading\nrest", "fallback") == "My Heading"


def test_extract_title_plain_first_line() -> None:
    assert extract_title("Plain line one\nline two", "fallback") == "Plain line one"


def test_extract_title_empty_uses_fallback() -> None:
    assert extract_title("", "myfile") == "myfile"
    assert extract_title("   \n  \n", "other") == "other"


def test_extract_title_truncates_to_80_chars() -> None:
    long_line = "x" * 100
    t = extract_title(long_line, "fb")
    assert len(t) == 80


def test_extract_title_markdown_heading_then_blank_then_body() -> None:
    text = "# hybrid search\n\nbody text"
    assert extract_title(text, "fb") == "hybrid search"


def test_extract_title_double_hash_subheading() -> None:
    text = "## subheading\n\nbody"
    assert extract_title(text, "fb") == "subheading"


def test_extract_title_plain_no_heading_short_line() -> None:
    assert extract_title("no heading just body text\nmore", "fb") == "no heading just body text"


def test_extract_title_plain_long_first_line_truncates() -> None:
    long_first = "no heading " + ("word " * 40)
    out = extract_title(long_first + "\nrest", "fb")
    assert len(out) <= 80


def test_extract_title_hash_only_line_skips_to_next() -> None:
    text = "# \nactual title\nbody"
    assert extract_title(text, "fb") == "actual title"
