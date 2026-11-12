import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
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
  const navigate = useNavigate();

  useEffect(() => {
    if (search.study) setActiveKey(`study:${search.study}`);
    else if (search.template) setActiveKey(`template:${search.template}`);
    void navigate({ to: "/", replace: true });
  }, [navigate, search.study, search.template, setActiveKey]);

  return (
    <main className="flex h-full items-center justify-center px-6">
      <p className="text-sm text-muted">Opening the studio…</p>
    </main>
  );
}
