"use client";

import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/types";

import { EmptyState } from "./empty-state";
import { MessageItem } from "./message-item";

export function MessageList({ messages }: { messages: Message[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full min-h-0">
      {messages.length === 0 ? (
        <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center p-6">
          <EmptyState />
        </div>
      ) : (
        <div className="space-y-4 p-4 pb-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={endRef} className="h-px w-full shrink-0" aria-hidden />
        </div>
      )}
    </ScrollArea>
  );
}
