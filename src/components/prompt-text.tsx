import type { Part } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PromptText({
  parts,
  values,
  className,
}: {
  parts: Part[];
  values: Record<string, string>;
  className?: string;
}) {
  return (
    <p className={cn("whitespace-pre-wrap break-words text-sm leading-relaxed text-fg md:text-base", className)}>
      {parts.map((part, index) => {
        if (part.kind === "text") return <span key={index}>{part.text}</span>;
        const value = values[part.id]?.trim();
        return (
          <mark
            key={part.id}
            className={
              value
                ? "rounded bg-lime/15 px-1 text-lime"
                : "rounded bg-raised px-1 text-faint"
            }
          >
            {value || `[${part.hint}]`}
          </mark>
        );
      })}
    </p>
  );
}
