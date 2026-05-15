import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "summarize the latest retrieval paper",
  "explain hybrid search",
  "what is reciprocal rank fusion",
] as const;

export function EmptyState() {
  return (
    <div className="flex max-w-md flex-col items-center gap-4 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted font-mono text-sm font-medium text-foreground">
        S
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="size-5 text-muted-foreground" aria-hidden />
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            ask seeker anything
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose a model and type a question.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {SUGGESTIONS.map((label) => (
          <Button
            key={label}
            type="button"
            variant="secondary"
            size="sm"
            className="rounded-lg text-xs font-normal text-muted-foreground"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
