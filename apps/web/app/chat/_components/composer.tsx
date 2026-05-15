"use client";

import { useLayoutEffect, useRef } from "react";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function Composer({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (next: string) => void;
  onSend: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.rows = 1;
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight, 10);
    const lh = Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : 22;
    const nextRows = Math.min(8, Math.max(1, Math.ceil(el.scrollHeight / lh)));
    el.rows = nextRows;
  }, [value]);

  const trimmed = value.trim();
  const sendDisabled = trimmed.length === 0;

  return (
    <div className="sticky bottom-0 z-10 shrink-0 border-t border-border bg-background px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <Textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ask something..."
          className={cn(
            "min-h-0 resize-none rounded-lg py-2.5 text-sm leading-snug shadow-none",
            "md:text-sm"
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              if (!sendDisabled) onSend();
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          className="size-9 shrink-0 rounded-lg"
          disabled={sendDisabled}
          onClick={onSend}
          aria-label="Send"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
