"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser ? (
        <Avatar className="mt-0.5 size-8 rounded-full border border-border">
          <AvatarFallback className="bg-muted font-mono text-xs font-medium text-foreground">
            S
          </AvatarFallback>
        </Avatar>
      ) : null}
      <div
        className={cn(
          "flex max-w-full flex-col gap-1.5",
          isUser ? "max-w-[min(85%,28rem)] items-end" : "max-w-[min(100%,40rem)] items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm leading-relaxed",
            isUser
              ? "bg-muted text-muted-foreground"
              : "border border-border bg-card text-foreground shadow-sm"
          )}
        >
          <p
            className={cn(
              "whitespace-pre-wrap",
              isUser ? "text-sm" : "text-base leading-relaxed"
            )}
          >
            {message.content}
          </p>
          {!isUser && message.citations && message.citations.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {message.citations.map((c) => (
                <Badge
                  key={c.id}
                  variant="secondary"
                  className="max-w-48 min-w-0 cursor-default justify-start gap-0 font-normal"
                  title={c.docTitle}
                >
                  <span className="min-w-0 truncate">{c.docTitle}</span>
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        <span className="px-0.5 text-[10px] text-muted-foreground">
          {formatRelativeTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
