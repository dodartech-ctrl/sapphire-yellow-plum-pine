import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { DISCIPLINES, SCOPE_LABEL, TEMPLATES, WORKFLOW_LABEL } from "@/lib/catalog";
import { useOriel } from "@/lib/store";
import type { Discipline, Workflow } from "@/lib/types";
import { cn } from "@/lib/utils";

type LibrarySearch = { scope?: Discipline };

const SCOPES: Discipline[] = ["architecture", "interior", "exterior", "landscape"];
const FLOWS: Workflow[] = ["edit", "compare", "concept", "study", "framework"];

export const Route = createFileRoute("/library")({
  validateSearch: (search: Record<string, unknown>): LibrarySearch => ({
    scope: SCOPES.includes(search.scope as Discipline) ? (search.scope as Discipline) : undefined,
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { scope } = Route.useSearch();
  const [flow, setFlow] = useState<Workflow | "all">("all");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const favorites = useOriel((state) => state.favorites);
  const toggleFavorite = useOriel((state) => state.toggleFavorite);

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TEMPLATES.filter((template) => {
      if (scope && template.scope !== scope && template.scope !== "any") return false;
      if (flow !== "all" && template.workflow !== flow) return false;
      if (savedOnly && !favorites.includes(template.id)) return false;
      if (!needle) return true;
      return `${template.title} ${template.summary} ${template.prompt}`.toLowerCase().includes(needle);
    });
  }, [favorites, flow, query, savedOnly, scope]);

  return (
    <main className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <p className="text-xs font-medium uppercase tracking-wide text-lime">Library</p>
        <h1 className="mt-2 font-syne text-4xl font-bold tracking-tight md:text-5xl">Task templates</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
          Replace the bracketed decision, not a stack of style words. Each template is the original CORE brief for that task.
        </p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search materials, dusk, courtyard…"
            className="h-11 w-full rounded-xl border border-line bg-raised px-3 text-sm text-fg outline-none placeholder:text-faint md:max-w-sm"
          />
          <button
            type="button"
            onClick={() => setSavedOnly((value) => !value)}
            className={cn(
              "h-11 rounded-full border px-4 text-sm",
              savedOnly ? "border-lime bg-lime text-ink" : "border-line text-fg",
            )}
          >
            Saved only
          </button>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          <Link
            to="/library"
            search={{ scope: undefined }}
            className={cn("shrink-0 rounded-full border px-3 py-2 text-sm", !scope ? "border-fg text-fg" : "border-line text-muted")}
          >
            All
          </Link>
          {DISCIPLINES.map((item) => (
            <Link
              key={item.id}
              to="/library"
              search={{ scope: item.id }}
              className={cn(
                "shrink-0 rounded-full border px-3 py-2 text-sm",
                scope === item.id ? "border-fg text-fg" : "border-line text-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          <FilterChip active={flow === "all"} onClick={() => setFlow("all")} label="Any task" />
          {FLOWS.map((item) => (
            <FilterChip key={item} active={flow === item} onClick={() => setFlow(item)} label={WORKFLOW_LABEL[item]} />
          ))}
        </div>

        {items.length === 0 ? (
          <p className="mt-10 text-sm text-muted">No templates in this cut. Clear the filter or save a few from the studio.</p>
        ) : (
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {items.map((template) => {
              const saved = favorites.includes(template.id);
              return (
                <li key={template.id} className="rounded-2xl border border-line bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-lime">
                        {SCOPE_LABEL[template.scope]} · {WORKFLOW_LABEL[template.workflow]}
                      </p>
                      <h2 className="mt-1 font-syne text-xl font-semibold">{template.title}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(template.id)}
                      className="grid size-11 place-items-center rounded-full border border-line"
                      aria-label={saved ? "Remove from saved" : "Save template"}
                      aria-pressed={saved}
                    >
                      <Star className={cn("size-4", saved && "fill-lime text-lime")} />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-muted">{template.summary}</p>
                  <Link
                    to="/studio"
                    search={{ template: template.id }}
                    className="mt-4 inline-flex h-11 items-center rounded-full bg-lime px-4 text-sm font-semibold text-ink"
                  >
                    Compose
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("shrink-0 rounded-full border px-3 py-2 text-sm", active ? "border-fg text-fg" : "border-line text-muted")}
    >
      {label}
    </button>
  );
}
