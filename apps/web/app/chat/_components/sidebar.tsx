import { Plus, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RECENT_PLACEHOLDERS = [
  "chunking for PDF retrieval",
  "hybrid vs dense-only",
  "evaluating recall at k",
  "rerankers after first stage",
] as const;

export function Sidebar({ onNewChat }: { onNewChat: () => void }) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-border bg-card text-card-foreground">
      <div className="flex flex-col gap-4 p-4">
        <div className="font-mono text-xs font-medium tracking-tight text-foreground">
          seeker
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-center gap-2 rounded-lg"
          onClick={onNewChat}
        >
          <Plus className="size-4" />
          New chat
        </Button>
      </div>
      <Separator />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Recent
        </p>
        <ul className="flex flex-col gap-1">
          {RECENT_PLACEHOLDERS.map((title) => (
            <li key={title}>
              <button
                type="button"
                className="w-full rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="line-clamp-2">{title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border px-4 py-3">
        <span className="text-[10px] text-muted-foreground">dev build</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-md text-muted-foreground"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Settings</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
