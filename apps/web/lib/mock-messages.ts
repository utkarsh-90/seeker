import type { Message } from "@/lib/types";

export function getMockMessages(): Message[] {
  const now = Date.now();
  return [
    {
      id: "m1",
      role: "user",
      content:
        "How should I tune chunk size and overlap for a dense retrieval stack over technical PDFs?",
      createdAt: new Date(now - 1000 * 60 * 8),
    },
    {
      id: "m2",
      role: "assistant",
      content:
        "Start with chunks between 400 and 800 tokens with 10 to 20 percent overlap so split sentences still land in adjacent chunks. Smaller chunks help precise fact lookup; larger chunks help questions that need surrounding context. Evaluate on your own queries with recall at a fixed k and adjust until hit rates stop improving.",
      createdAt: new Date(now - 1000 * 60 * 7),
      citations: [
        {
          id: "c1",
          docTitle: "Dense Passage Retrieval for Open-Domain QA",
          chunkId: "doc42-ch3-014",
          score: 0.82,
        },
        {
          id: "c2",
          docTitle: "Latency-Aware Chunking for Vector Indexes",
          chunkId: "idx-guide-009",
          score: 0.76,
        },
      ],
    },
    {
      id: "m3",
      role: "user",
      content: "What about hybrid BM25 plus vector search? When is it worth the extra plumbing?",
      createdAt: new Date(now - 1000 * 60 * 5),
    },
    {
      id: "m4",
      role: "assistant",
      content:
        "Hybrid helps when keyword overlap is strong but embeddings drift, for example SKUs, legal clauses, and low-resource languages. Keep BM25 and the vector index in the same retrieval set, fuse scores with a simple weighted sum or RRF, and cache sparse results when traffic is high. If dense-only already meets your metrics on held-out questions, you can stay dense-only.",
      createdAt: new Date(now - 1000 * 60 * 4),
      citations: [
        {
          id: "c3",
          docTitle: "Reciprocal Rank Fusion for Hybrid Retrieval",
          chunkId: "rrf-note-002",
          score: 0.79,
        },
        {
          id: "c4",
          docTitle: "Lexical plus Dense Retrieval Benchmarks",
          chunkId: "bench-hybrid-11",
          score: 0.71,
        },
      ],
    },
  ];
}
