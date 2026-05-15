"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import { getMockMessages } from "@/lib/mock-messages";
import type { Message } from "@/lib/types";

import { Composer } from "./composer";
import { MessageList } from "./message-list";
import { ModelPicker } from "./model-picker";
import { Sidebar } from "./sidebar";

function mockAssistantReply(): Message {
  return {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content:
      "Placeholder reply while the backend is not connected. Citations below are sample rows for layout only.",
    createdAt: new Date(),
    citations: [
      {
        id: `c-${Date.now()}-a`,
        docTitle: "Retrieval-Augmented Generation Survey",
        chunkId: "rag-survey-018",
        score: 0.74,
      },
      {
        id: `c-${Date.now()}-b`,
        docTitle: "Vector Index Tuning Notes",
        chunkId: "vec-tune-004",
        score: 0.68,
      },
    ],
  };
}

export function ChatShell() {
  const [messages, setMessages] = useState<Message[]>(() => getMockMessages());
  const [selectedModelId, setSelectedModelId] =
    useState<string>(DEFAULT_MODEL_ID);
  const [input, setInput] = useState("");

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    window.setTimeout(() => {
      setMessages((prev) => [...prev, mockAssistantReply()]);
    }, 450);
  }

  function handleNewChat() {
    setMessages([]);
  }

  function handleModelChange(id: string) {
    setSelectedModelId(id);
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
        <Sidebar onNewChat={handleNewChat} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
            <ModelPicker
              selectedModelId={selectedModelId}
              onChange={handleModelChange}
            />
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 gap-2 rounded-lg"
              onClick={handleNewChat}
            >
              <Plus className="size-4" />
              New chat
            </Button>
          </header>
          <div className="min-h-0 flex-1">
            <MessageList messages={messages} />
          </div>
          <Composer value={input} onChange={setInput} onSend={handleSend} />
        </div>
      </div>
    </TooltipProvider>
  );
}
