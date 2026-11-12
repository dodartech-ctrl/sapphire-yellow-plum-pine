import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useOriel } from "@/lib/store";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = useOriel((state) => state.projects);
  const saveProject = useOriel((state) => state.saveProject);
  const openProject = useOriel((state) => state.openProject);
  const removeProject = useOriel((state) => state.removeProject);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-8">
      <h1 className="font-syne text-3xl font-bold">Projects</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">Saves the current properties and idea on this device. Plates stay with the session.</p>
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
        <button type="submit" className="h-11 rounded-full bg-lime px-4 text-sm text-ink">
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
              className="text-sm text-lime"
              onClick={() => {
                openProject(project.id);
                void navigate({ to: "/" });
              }}
            >
              Open
            </button>
            <button type="button" className="text-sm text-muted" onClick={() => removeProject(project.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
