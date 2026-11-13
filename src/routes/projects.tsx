import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useOriel } from "@/lib/store";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = useOriel((state) => state.projects);
  const briefs = useOriel((state) => state.briefs);
  const saveProject = useOriel((state) => state.saveProject);
  const openProject = useOriel((state) => state.openProject);
  const removeProject = useOriel((state) => state.removeProject);
  const removeBrief = useOriel((state) => state.removeBrief);
  const setIdea = useOriel((state) => state.setIdea);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-8">
      <h1 className="font-syne text-3xl font-bold">Projects &amp; Saved Briefs</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">Saves the current properties, Brief Builder specs, and idea on this device.</p>
      <form
        className="mt-6 flex max-w-lg gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          saveProject(name);
          setName("");
        }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm outline-none"
        />
        <button type="submit" className="gold-fill h-11 rounded-full px-5 text-sm font-semibold text-[#2a1c0c]">
          Save
        </button>
      </form>
      <ul className="mt-6 max-w-lg space-y-2">
        {projects.length === 0 ? <li className="text-sm text-muted">No saved projects yet.</li> : null}
        {projects.map((project) => (
          <li key={project.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{project.name}</span>
              <span className="block text-xs text-faint">{project.design.vertical}</span>
            </span>
            <button
              type="button"
              className="text-sm font-medium text-[#b08a45] hover:underline"
              onClick={() => {
                openProject(project.id);
                void navigate({ to: "/" });
              }}
            >
              Open
            </button>
            <button type="button" className="text-sm text-muted hover:text-fg" onClick={() => removeProject(project.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {briefs.length > 0 ? (
        <section className="mt-8 max-w-2xl">
          <h2 className="font-syne text-lg font-semibold">Saved Briefs ({briefs.length})</h2>
          <ul className="mt-3 space-y-2">
            {briefs.map((brief) => (
              <li key={brief.id} className="rounded-2xl border border-line bg-surface px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm text-fg">{brief.title}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIdea(brief.adapted || brief.canonical);
                        void navigate({ to: "/" });
                      }}
                      className="font-medium text-[#b08a45] hover:underline"
                    >
                      Load in Studio
                    </button>
                    <button type="button" onClick={() => removeBrief(brief.id)} className="text-muted hover:text-fg">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{brief.adapted || brief.canonical}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
