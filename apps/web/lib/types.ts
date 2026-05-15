export type Role = "user" | "assistant";

export type Citation = {
  id: string;
  docTitle: string;
  chunkId: string;
  score: number;
};

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
  citations?: Citation[];
};

export type Model = {
  id: string;
  label: string;
  provider: "groq" | "openrouter" | "gemini";
  description: string;
};
