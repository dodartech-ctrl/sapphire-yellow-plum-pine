import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { TEMPLATES } from "@/lib/catalog";
import { STUDIES } from "@/lib/studies";
import { useOriel } from "@/lib/store";

type StudioSearch = {
  study?: string;
  template?: string;
  brief?: string;
};

export const Route = createFileRoute("/studio")({
  validateSearch: (search: Record<string, unknown>): StudioSearch => ({
    study: typeof search.study === "string" ? search.study : undefined,
    template: typeof search.template === "string" ? search.template : undefined,
    brief: typeof search.brief === "string" ? search.brief.slice(0, 800) : undefined,
  }),
  component: StudioPage,
});

function StudioPage() {
  const search = Route.useSearch();
  const setActiveKey = useOriel((state) => state.setActiveKey);
  const setIdea = useOriel((state) => state.setIdea);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.study) {
      setActiveKey(`study:${search.study}`);
      const found = STUDIES.find((s) => s.id === search.study);
      if (found?.prompt) setIdea(found.prompt);
    } else if (search.template) {
      setActiveKey(`template:${search.template}`);
      const found = TEMPLATES.find((t) => t.id === search.template);
      if (found?.prompt) setIdea(found.prompt);
    }
    if (search.brief) {
      setIdea(search.brief);
    }
    void navigate({ to: "/", replace: true });
  }, [navigate, search.brief, search.study, search.template, setActiveKey, setIdea]);

  return (
    <main className="flex h-full items-center justify-center px-6">
      <p className="text-sm text-muted">Opening the studio…</p>
    </main>
  );
}
