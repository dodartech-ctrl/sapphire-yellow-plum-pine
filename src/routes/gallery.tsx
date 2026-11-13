import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Check,
  Columns,
  Compass,
  Copy,
  Eye,
  Filter,
  ImagePlus,
  MapPin,
  Maximize2,
  Search,
  Sliders,
  Split,
  Wand2,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Compare } from "@/components/compare";
import {
  GALLERY_PROJECTS,
  type ComparisonType,
  type GalleryProject,
  type ProjectDiscipline,
} from "@/lib/gallery-data";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

export function GalleryPage() {
  const navigate = useNavigate();
  const setIdea = useOriel((state) => state.setIdea);
  const history = useOriel((state) => state.history);
  const upload = useOriel((state) => state.upload);
  const plate = useOriel((state) => state.plate);

  // Filters
  const [selectedDiscipline, setSelectedDiscipline] = useState<ProjectDiscipline | "All">("All");
  const [selectedComparisonType, setSelectedComparisonType] = useState<ComparisonType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Card View Mode state for each project: "slider" | "before" | "after" | "side"
  const [projectDisplayModes, setProjectDisplayModes] = useState<Record<string, "slider" | "before" | "after" | "side">>({});

  // Active modal project
  const [activeModalProject, setActiveModalProject] = useState<GalleryProject | null>(null);

  // Custom Comparison Playground
  const [customBefore, setCustomBefore] = useState<string | null>(upload || "/viz/p01-pavilion-day.jpg");
  const [customAfter, setCustomAfter] = useState<string | null>(plate?.url || "/viz/p01-pavilion-dusk.jpg");
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return GALLERY_PROJECTS.filter((proj) => {
      const matchDiscipline = selectedDiscipline === "All" || proj.discipline === selectedDiscipline;
      const matchType = selectedComparisonType === "All" || proj.comparisonType === selectedComparisonType;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.location.toLowerCase().includes(q) ||
        proj.summary.toLowerCase().includes(q) ||
        proj.materialsUsed.some((m) => m.toLowerCase().includes(q));
      return matchDiscipline && matchType && matchQuery;
    });
  }, [selectedDiscipline, selectedComparisonType, searchQuery]);

  function setProjectMode(projectId: string, mode: "slider" | "before" | "after" | "side") {
    setProjectDisplayModes((prev) => ({ ...prev, [projectId]: mode }));
  }

  function handleSendToBuilder(project: GalleryProject) {
    toast.success(`Loaded "${project.title}" into Brief Builder`);
    void navigate({ to: "/builder" });
  }

  function handleSendToStudio(project: GalleryProject) {
    setIdea(project.promptBlueprint);
    toast.success(`Loaded prompt blueprint for "${project.title}"`);
    void navigate({ to: "/" });
  }

  async function handleCustomFile(file: File | undefined, target: "before" | "after") {
    if (!file) return;
    try {
      const dataUrl = await readImage(file, 1920);
      if (target === "before") setCustomBefore(dataUrl);
      else setCustomAfter(dataUrl);
      toast.success(`Updated custom ${target} image`);
    } catch {
      toast.error("Could not process uploaded image.");
    }
  }

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-bg text-fg">
      {/* Header Banner */}
      <section className="shrink-0 border-b border-line bg-surface/80 px-4 py-6 backdrop-blur-md md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium tracking-[0.2em] text-[#b08a45] uppercase">
                  Archviz Archive
                </span>
                <span className="text-faint" aria-hidden="true">·</span>
                <span className="text-xs text-muted">Comparative Case Studies</span>
              </div>
              <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-fg md:text-5xl">
                Project Gallery
              </h1>
              <p className="mt-2 max-w-2xl text-xs text-muted md:text-sm">
                Explore architectural visualization commissions, material restyles, and lighting studies with interactive split-slider before/after comparisons.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("sandbox-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-raised px-4 text-xs font-medium text-muted transition hover:border-[#d4b06a] hover:text-fg"
              >
                <Sliders className="size-3.5" />
                Custom Split Sandbox
              </button>
              <button
                type="button"
                onClick={() => void navigate({ to: "/builder" })}
                className="gold-fill inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-semibold"
              >
                <Wand2 className="size-3.5" />
                Brief Builder
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, materials, cities…"
                className="h-10 w-full rounded-full border border-line bg-raised pr-4 pl-9 text-xs text-fg outline-none transition focus:border-[#d4b06a]"
              />
            </div>

            {/* Discipline Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs text-faint">Discipline:</span>
              {(["All", "Exterior", "Interior", "Renovation", "Cultural"] as const).map((disc) => (
                <button
                  key={disc}
                  type="button"
                  onClick={() => setSelectedDiscipline(disc)}
                  className={cn(
                    "hover-chip shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    selectedDiscipline === disc
                      ? "gold-fill border-transparent text-[#2a1c0c]"
                      : "border-line bg-raised text-muted",
                  )}
                >
                  {disc}
                </button>
              ))}
            </div>

            {/* Comparison Type Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs text-faint">Study Type:</span>
              {(
                [
                  "All",
                  "Lighting / Relighting",
                  "Material Restyle",
                  "Adaptive Reuse",
                ] as const
              ).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedComparisonType(type)}
                  className={cn(
                    "hover-chip shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    selectedComparisonType === type
                      ? "gold-fill border-transparent text-[#2a1c0c]"
                      : "border-line bg-raised text-muted",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line p-12 text-center">
            <Filter className="size-8 text-faint" />
            <h3 className="mt-3 font-serif text-lg font-semibold text-fg">No matching projects found</h3>
            <p className="mt-1 text-xs text-muted">Try adjusting your search terms or clearing active filters.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline("All");
                setSelectedComparisonType("All");
                setSearchQuery("");
              }}
              className="mt-4 rounded-full border border-line bg-raised px-4 py-2 text-xs font-medium text-fg hover:border-[#d4b06a]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {filteredProjects.map((project) => {
              const displayMode = projectDisplayModes[project.id] ?? "slider";
              return (
                <article
                  key={project.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition hover:shadow-md"
                >
                  {/* Media Container with Comparative Viewer */}
                  <div className="relative overflow-hidden bg-[#1c1915]">
                    {displayMode === "slider" && (
                      <Compare
                        before={project.beforeImage}
                        after={project.afterImage}
                        beforeLabel={project.beforeLabel}
                        afterLabel={project.afterLabel}
                        beforeAlt={project.beforeAlt}
                        afterAlt={project.afterAlt}
                        embedded
                        aspect={project.aspect}
                      />
                    )}

                    {displayMode === "before" && (
                      <div className="relative aspect-[16/9] w-full">
                        <img
                          src={project.beforeImage}
                          alt={project.beforeAlt}
                          className="h-full w-full object-contain"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs text-white">
                          {project.beforeLabel}
                        </span>
                      </div>
                    )}

                    {displayMode === "after" && (
                      <div className="relative aspect-[16/9] w-full">
                        <img
                          src={project.afterImage}
                          alt={project.afterAlt}
                          className="h-full w-full object-contain"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-[#b08a45] px-3 py-1 text-xs font-medium text-[#2a1c0c]">
                          {project.afterLabel}
                        </span>
                      </div>
                    )}

                    {displayMode === "side" && (
                      <div className="grid aspect-[16/9] grid-cols-2 gap-1 bg-black p-1">
                        <div className="relative overflow-hidden">
                          <img
                            src={project.beforeImage}
                            alt={project.beforeAlt}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] text-white">
                            {project.beforeLabel}
                          </span>
                        </div>
                        <div className="relative overflow-hidden">
                          <img
                            src={project.afterImage}
                            alt={project.afterAlt}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded-full bg-[#b08a45] px-2 py-0.5 text-[10px] font-medium text-[#2a1c0c]">
                            {project.afterLabel}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* View Mode Toggle Controls */}
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-1 rounded-full bg-[#14110f]/85 p-1 text-xs text-white shadow-md">
                      <button
                        type="button"
                        onClick={() => setProjectMode(project.id, "slider")}
                        className={cn(
                          "flex h-7 items-center gap-1 rounded-full px-2.5 transition",
                          displayMode === "slider" ? "gold-fill text-[#2a1c0c]" : "hover:bg-white/10 text-white/80",
                        )}
                        title="Interactive Slider"
                      >
                        <Split className="size-3" />
                        <span className="hidden sm:inline">Slider</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjectMode(project.id, "side")}
                        className={cn(
                          "flex h-7 items-center gap-1 rounded-full px-2.5 transition",
                          displayMode === "side" ? "gold-fill text-[#2a1c0c]" : "hover:bg-white/10 text-white/80",
                        )}
                        title="Side by Side"
                      >
                        <Columns className="size-3" />
                        <span className="hidden sm:inline">Side</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjectMode(project.id, "before")}
                        className={cn(
                          "flex h-7 items-center rounded-full px-2 transition",
                          displayMode === "before" ? "gold-fill text-[#2a1c0c]" : "hover:bg-white/10 text-white/80",
                        )}
                        title="View Before"
                      >
                        Before
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjectMode(project.id, "after")}
                        className={cn(
                          "flex h-7 items-center rounded-full px-2 transition",
                          displayMode === "after" ? "gold-fill text-[#2a1c0c]" : "hover:bg-white/10 text-white/80",
                        )}
                        title="View After"
                      >
                        After
                      </button>
                    </div>

                    {/* Fullscreen Inspector Button */}
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(project)}
                      className="absolute bottom-3 right-3 z-30 grid size-8 place-items-center rounded-full bg-[#14110f]/80 text-white/90 shadow-md backdrop-blur-xs transition hover:bg-[#b08a45] hover:text-[#2a1c0c]"
                      title="Inspect full case study"
                    >
                      <Maximize2 className="size-4" />
                    </button>
                  </div>

                  {/* Content & Metadata */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Unboxed Metadata Tagline */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="font-medium text-[#b08a45]">{project.discipline}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" /> {project.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-faint">{project.comparisonType}</span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-fg">
                      {project.title}
                    </h2>

                    {/* Summary */}
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {project.summary}
                    </p>

                    {/* Key Changes Checklist */}
                    <div className="mt-4 rounded-2xl border border-line/60 bg-raised/50 p-3.5">
                      <p className="text-[11px] font-semibold text-fg uppercase tracking-wider">
                        Comparative Directives:
                      </p>
                      <ul className="mt-2 space-y-1.5 text-xs text-muted">
                        {project.keyChanges.slice(0, 3).map((change) => (
                          <li key={change} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#d4b06a]" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Material Palette Tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      {project.materialsUsed.map((mat) => (
                        <span
                          key={mat}
                          className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] text-faint"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(project)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-fg hover:text-[#b08a45]"
                      >
                        <Eye className="size-3.5" />
                        Full Specification & Study
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSendToStudio(project)}
                          className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted"
                          title="Open prompt blueprint in Studio"
                        >
                          <Compass className="size-3" />
                          To Studio
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendToBuilder(project)}
                          className="gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold"
                          title="Load style & lighting into Brief Builder"
                        >
                          <Wand2 className="size-3" />
                          Build Vision
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Custom Split Sandbox Section */}
      <section
        id="sandbox-section"
        className="border-t border-line bg-surface px-4 py-12 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-medium tracking-[0.2em] text-[#b08a45] uppercase">
                Interactive Comparison Lab
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-fg">
                Custom Before / After Split Sandbox
              </h2>
              <p className="mt-1 max-w-2xl text-xs text-muted md:text-sm">
                Upload your own source and rendered plates or select past iterations to test comparative tolerance, color drift, and edge retention.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => beforeInputRef.current?.click()}
                className="hover-chip inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-raised px-3.5 text-xs text-muted"
              >
                <ImagePlus className="size-3.5" />
                Upload Before Image
              </button>
              <button
                type="button"
                onClick={() => afterInputRef.current?.click()}
                className="hover-chip inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-raised px-3.5 text-xs text-muted"
              >
                <ImagePlus className="size-3.5" />
                Upload After Image
              </button>
              <input
                ref={beforeInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleCustomFile(e.target.files?.[0], "before")}
              />
              <input
                ref={afterInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleCustomFile(e.target.files?.[0], "after")}
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-[#1c1915] shadow-lg">
            {customBefore && customAfter ? (
              <Compare
                before={customBefore}
                after={customAfter}
                beforeLabel="Source / Baseline"
                afterLabel="Render / Iteration"
                beforeAlt="Custom comparison source"
                afterAlt="Custom comparison target"
                embedded
                aspect="16 / 9"
              />
            ) : (
              <div className="grid h-80 place-items-center text-sm text-[#f6efe4]">
                Upload or select two plates to launch the split slider comparison.
              </div>
            )}
          </div>

          {/* Quick preset selector for Sandbox */}
          {history.length > 0 && (
            <div className="mt-4">
              <span className="text-xs text-faint">Recent Studio Plates:</span>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {history.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setCustomAfter(url)}
                    className="hover-tile shrink-0 overflow-hidden rounded-xl border border-line bg-raised"
                  >
                    <img src={url} alt={`History plate ${i}`} className="h-14 w-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal / Lightbox Inspector */}
      {activeModalProject && (
        <ProjectInspectorModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onSendToBuilder={() => handleSendToBuilder(activeModalProject)}
          onSendToStudio={() => handleSendToStudio(activeModalProject)}
        />
      )}
    </main>
  );
}

// Modal Component for Deep Project Inspection
function ProjectInspectorModal({
  project,
  onClose,
  onSendToBuilder,
  onSendToStudio,
}: {
  project: GalleryProject;
  onClose: () => void;
  onSendToBuilder: () => void;
  onSendToStudio: () => void;
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(project.promptBlueprint);
      setCopiedPrompt(true);
      toast.success("Prompt blueprint copied to clipboard");
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      toast.error("Could not copy prompt.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
        {/* Modal Top Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-semibold text-[#b08a45]">{project.discipline}</span>
              <span aria-hidden="true">·</span>
              <span>{project.location}</span>
              <span aria-hidden="true">·</span>
              <span>{project.year}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-fg">{project.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-raised hover:text-fg"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Main Interactive Compare Slider */}
          <div className="overflow-hidden rounded-2xl border border-line bg-[#1c1915] shadow-inner">
            <Compare
              before={project.beforeImage}
              after={project.afterImage}
              beforeLabel={project.beforeLabel}
              afterLabel={project.afterLabel}
              beforeAlt={project.beforeAlt}
              afterAlt={project.afterAlt}
              embedded
              aspect={project.aspect}
            />
          </div>

          {/* Architectural Intent */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-fg">Architectural Intent & Directives</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.architecturalIntent}</p>
          </div>

          {/* Key Changes & Lighting Technique */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-raised p-4">
              <h4 className="text-xs font-semibold text-fg uppercase tracking-wider">Comparative Directives</h4>
              <ul className="mt-2 space-y-2 text-xs text-muted">
                {project.keyChanges.map((change) => (
                  <li key={change} className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#d4b06a]" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-raised p-4">
              <h4 className="text-xs font-semibold text-fg uppercase tracking-wider">Lighting & Material Science</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                <strong className="text-fg">Illumination:</strong> {project.lightingTechnique}
              </p>
              <div className="mt-3">
                <strong className="text-xs text-fg">Material Palette:</strong>
                <ul className="mt-1.5 space-y-1 text-xs text-muted">
                  {project.materialsUsed.map((m) => (
                    <li key={m}>— {m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Prompt Blueprint */}
          <div className="rounded-2xl border border-line bg-raised p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-fg uppercase tracking-wider">Prompt Blueprint</h4>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="hover-chip inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted"
              >
                {copiedPrompt ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                {copiedPrompt ? "Copied" : "Copy Blueprint"}
              </button>
            </div>
            <p className="mt-2 font-mono text-xs text-fg/90 select-all">
              {project.promptBlueprint}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-4 py-2 text-xs text-muted hover:text-fg"
          >
            Close Inspector
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSendToStudio();
              }}
              className="hover-chip inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-raised px-4 text-xs font-medium text-muted hover:text-fg"
            >
              <Compass className="size-3.5" />
              Open in Studio
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSendToBuilder();
              }}
              className="gold-fill inline-flex h-9 items-center gap-1.5 rounded-full px-5 text-xs font-semibold"
            >
              <Wand2 className="size-3.5" />
              Load into Brief Builder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
