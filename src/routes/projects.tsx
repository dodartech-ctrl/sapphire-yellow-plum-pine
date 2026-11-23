import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent } from "react";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { triggerBlobDownload } from "@/lib/studio-exports";
import { useOriel } from "@/lib/store";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = useOriel((state) => state.projects);
  const briefs = useOriel((state) => state.briefs);
  const saveProject = useOriel((state) => state.saveProject);
  const importProjectsBundle = useOriel((state) => state.importProjectsBundle);
  const openProject = useOriel((state) => state.openProject);
  const removeProject = useOriel((state) => state.removeProject);
  const removeBrief = useOriel((state) => state.removeBrief);
  const setIdea = useOriel((state) => state.setIdea);
  const [name, setName] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleExportBundle() {
    const payload = {
      schema: "oriel-projects-backup-v1",
      exportedAt: new Date().toISOString(),
      projects,
      briefs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    triggerBlobDownload(blob, `oriel-projects-backup-${new Date().toISOString().slice(0, 10)}.json`);
    toast.success(`Exported ${projects.length} project${projects.length === 1 ? "" : "s"} to JSON backup`);
  }

  async function handleImportBundle(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as { projects?: unknown };
      const list = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.projects)
          ? parsed.projects
          : [];
      const count = importProjectsBundle(list as typeof projects);
      if (count > 0) {
        toast.success(`Imported ${count} project${count === 1 ? "" : "s"} into local library`);
      } else {
        toast.error("No valid Oriel projects found in JSON file.");
      }
    } catch {
      toast.error("Could not parse project backup JSON.");
    }
  }

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-syne text-3xl font-bold">Projects &amp; Saved Briefs</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Saves the current properties, Brief Builder specs, and idea on this device — with JSON export/import backup.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => void handleImportBundle(e)}
          />
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-semibold text-fg hover:bg-raised"
          >
            <Upload className="size-3.5" /> Import JSON
          </button>
          <button
            type="button"
            onClick={handleExportBundle}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-semibold text-fg hover:bg-raised"
          >
            <Download className="size-3.5" /> Export Backup
          </button>
        </div>
      </div>

      <form
        className="mt-6 flex max-w-lg gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          saveProject(name);
          toast.success(`Saved project "${name.trim() || "Untitled"}"`);
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
              <span className="block text-xs text-faint">{project.design.vertical} · {project.design.look}</span>
            </span>
            <button
              type="button"
              className="text-sm font-medium text-[#b08a45] hover:underline"
              onClick={() => {
                openProject(project.id);
                toast.success(`Opened "${project.name}"`);
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
                  <span className="text-sm font-medium text-fg">{brief.title}</span>
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
