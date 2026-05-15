import type { Model } from "@/lib/types";

export const MODELS: Model[] = [
  {
    id: "groq/llama-3.3-70b-versatile",
    label: "Llama 3.3 70B",
    provider: "groq",
    description: "fast, balanced",
  },
  {
    id: "groq/llama-3.1-8b-instant",
    label: "Llama 3.1 8B",
    provider: "groq",
    description: "cheap, very fast",
  },
  {
    id: "groq/deepseek-r1-distill-llama-70b",
    label: "DeepSeek R1 Distill 70B",
    provider: "groq",
    description: "reasoning",
  },
  {
    id: "openrouter/qwen/qwen-2.5-72b-instruct:free",
    label: "Qwen 2.5 72B",
    provider: "openrouter",
    description: "free via openrouter",
  },
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    provider: "gemini",
    description: "long context",
  },
];

export const DEFAULT_MODEL_ID = "groq/llama-3.3-70b-versatile";
