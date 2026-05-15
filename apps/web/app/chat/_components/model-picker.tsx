import { ChevronsUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MODELS } from "@/lib/models";
import type { Model } from "@/lib/types";
import { cn } from "@/lib/utils";

const PROVIDER_ORDER: Model["provider"][] = [
  "groq",
  "openrouter",
  "gemini",
];

function providerLabel(p: Model["provider"]): string {
  if (p === "openrouter") return "openrouter";
  return p;
}

export function ModelPicker({
  selectedModelId,
  onChange,
}: {
  selectedModelId: string;
  onChange: (id: string) => void;
}) {
  const selected = MODELS.find((m) => m.id === selectedModelId) ?? MODELS[0];

  const grouped = PROVIDER_ORDER.map((provider) => ({
    provider,
    models: MODELS.filter((m) => m.provider === provider),
  })).filter((g) => g.models.length > 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 min-w-[220px] justify-between gap-2 rounded-lg px-3 font-normal"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span className="truncate text-sm">{selected?.label}</span>
            {selected ? (
              <Badge
                variant="secondary"
                className="shrink-0 px-1.5 py-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {providerLabel(selected.provider)}
              </Badge>
            ) : null}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        {grouped.map((group, idx) => (
          <div key={group.provider}>
            {idx > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {providerLabel(group.provider)}
            </DropdownMenuLabel>
            {group.models.map((m) => (
              <DropdownMenuItem
                key={m.id}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-0.5 rounded-md py-2",
                  m.id === selectedModelId && "bg-accent"
                )}
                onSelect={() => onChange(m.id)}
              >
                <span className="text-sm font-medium">{m.label}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {m.description}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
