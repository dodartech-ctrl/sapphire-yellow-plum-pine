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
  MessageSquarePlus,
  Paintbrush,
  Search,
  Share2,
  Sliders,
  Split,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Compare } from "@/components/compare";
import { PanoramaViewer } from "@/components/panorama-viewer";
import { decodeReviewPinsParam, encodeReviewPinsParam, type ReviewPin } from "@/lib/archviz-suite";
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

function GalleryPage() {
  const navigate = useNavigate();
  const setIdea = useOriel((state) => state.setIdea);
  const history = useOriel((state) => state.history);
  const upload = useOriel((state) => state.upload);
  const plate = useOriel((state) => state.plate);
  const publishedGallery = useOriel((state) => state.publishedGallery);
  const removePublishedProject = useOriel((state) => state.removePublishedProject);
  const setReviewPins = useOriel((state) => state.setReviewPins);
  const setUpload = useOriel((state) => state.setUpload);
  const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);

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

  // Combined curated + user-published projects
  const allProjects = useMemo(() => {
    const publishedMapped: (GalleryProject & { isUserPublished?: boolean })[] = publishedGallery.map((p) => ({
      id: p.id,
      title: p.title,
      location: p.location,
      year: p.year,
      discipline: p.discipline,
      comparisonType: p.comparisonType,
      beforeImage: p.beforeImage,
      afterImage: p.afterImage,
      beforeLabel: p.beforeLabel,
      afterLabel: p.afterLabel,
      beforeAlt: `${p.title} before`,
      afterAlt: `${p.title} after`,
      summary: p.summary,
      architecturalIntent: `${p.summary} (${p.engineMeta})`,
      keyChanges: [p.engineMeta, p.lightingTechnique],
      materialsUsed: p.materialsUsed.length ? p.materialsUsed : ["Architectural concrete", "Warm oak"],
      lightingTechnique: p.lightingTechnique,
      aspect: p.aspect,
      promptBlueprint: p.promptBlueprint,
      isUserPublished: true,
    }));
    return [...publishedMapped, ...GALLERY_PROJECTS];
  }, [publishedGallery]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const rev = sp.get("review");
    const pid = sp.get("project");
    if (rev) {
      const decoded = decodeReviewPinsParam(rev);
      if (decoded.length > 0) setReviewPins(decoded);
    }
    if (pid) {
      const match = allProjects.find((p) => p.id === pid);
      if (match) setActiveModalProject(match);
    }
  }, [allProjects, setReviewPins]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((proj) => {
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
  }, [allProjects, selectedDiscipline, selectedComparisonType, searchQuery]);

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
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-xs">
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
            <div className="flex flex-wrap items-center gap-1.5">
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
            <div className="flex flex-wrap items-center gap-1.5">
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
                        {(project as GalleryProject & { isUserPublished?: boolean }).isUserPublished ? (
                          <button
                            type="button"
                            onClick={() => {
                              removePublishedProject(project.id);
                              toast.message("Removed published render from Gallery");
                            }}
                            className="grid size-8 place-items-center rounded-full border border-line bg-raised text-muted hover:text-red-600"
                            title="Remove published render"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        ) : null}
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
          onSendPinToInpaint={(pin) => {
            const c = document.createElement("canvas");
            c.width = 1280;
            c.height = 720;
            const ctx = c.getContext("2d");
            if (ctx) {
              ctx.fillStyle = "rgba(212, 176, 106, 0.85)";
              ctx.beginPath();
              ctx.arc(pin.xNorm * 1280, pin.yNorm * 720, 86, 0, Math.PI * 2);
              ctx.fill();
              setMaskDataUrl(c.toDataURL("image/png"));
            }
            setUpload(activeModalProject.afterImage);
            setIdea(pin.note);
            setActiveModalProject(null);
            toast.success(`Review Pin #${pin.number} mask sent to Studio Inpaint`);
            void navigate({ to: "/", search: { pinInpaint: "1" } as never });
          }}
        />
      )}
    </main>
  );
}

// Modal Component for Deep Project Inspection (#17 360° Tour + #19 Review Pins)
function ProjectInspectorModal({
  project,
  onClose,
  onSendToBuilder,
  onSendToStudio,
  onSendPinToInpaint,
}: {
  project: GalleryProject;
  onClose: () => void;
  onSendToBuilder: () => void;
  onSendToStudio: () => void;
  onSendPinToInpaint: (pin: ReviewPin) => void;
}) {
  const reviewPins = useOriel((state) => state.reviewPins);
  const addReviewPin = useOriel((state) => state.addReviewPin);
  const toggleReviewPinStatus = useOriel((state) => state.toggleReviewPinStatus);
  const removeReviewPin = useOriel((state) => state.removeReviewPin);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [viewerMode, setViewerMode] = useState<"compare" | "360" | "review">("compare");
  const [pendingPt, setPendingPt] = useState<{ xNorm: number; yNorm: number } | null>(null);
  const [pinAuthor, setPinAuthor] = useState("Principal Architect");
  const [pinNote, setPinNote] = useState("");
  const reviewSurfaceRef = useRef<HTMLDivElement>(null);

  const projectPins = useMemo(
    () => reviewPins.filter((p) => p.projectId === project.id),
    [reviewPins, project.id],
  );

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

  async function handleCopyReviewLink() {
    try {
      const encoded = encodeReviewPinsParam(projectPins);
      const url = `${window.location.origin}/gallery?project=${encodeURIComponent(project.id)}${encoded ? `&review=${encoded}` : ""}`;
      await navigator.clipboard.writeText(url);
      toast.success("Shareable Client Review link copied!");
    } catch {
      toast.error("Could not copy review link.");
    }
  }

  function handleReviewSurfaceClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!reviewSurfaceRef.current) return;
    const rect = reviewSurfaceRef.current.getBoundingClientRect();
    const xNorm = Math.max(0.03, Math.min(0.97, (e.clientX - rect.left) / Math.max(1, rect.width)));
    const yNorm = Math.max(0.03, Math.min(0.97, (e.clientY - rect.top) / Math.max(1, rect.height)));
    setPendingPt({ xNorm, yNorm });
  }

  function submitReviewPin(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingPt || !pinNote.trim()) return;
    addReviewPin({
      projectId: project.id,
      xNorm: pendingPt.xNorm,
      yNorm: pendingPt.yNorm,
      author: pinAuthor.trim() || "Client Reviewer",
      note: pinNote.trim(),
      status: "open",
    });
    setPendingPt(null);
    setPinNote("");
    toast.success("Added review annotation pin");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
        {/* Modal Top Bar */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-4">
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

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-raised p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewerMode("compare")}
                className={cn("h-7 rounded-full px-3 font-medium", viewerMode === "compare" ? "gold-fill text-[#2a1c0c]" : "text-muted")}
              >
                Split Compare
              </button>
              <button
                type="button"
                onClick={() => setViewerMode("review")}
                className={cn("inline-flex h-7 items-center gap-1 rounded-full px-3 font-medium", viewerMode === "review" ? "gold-fill text-[#2a1c0c]" : "text-muted")}
              >
                <MessageSquarePlus className="size-3" /> Review Pins ({projectPins.length})
              </button>
              <button
                type="button"
                onClick={() => setViewerMode("360")}
                className={cn("inline-flex h-7 items-center gap-1 rounded-full px-3 font-medium", viewerMode === "360" ? "gold-fill text-[#2a1c0c]" : "text-muted")}
              >
                <Compass className="size-3" /> 360° Tour
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-raised hover:text-fg"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Main Interactive Viewer */}
          <div className="overflow-hidden rounded-2xl border border-line bg-[#1c1915] shadow-inner">
            {viewerMode === "360" ? (
              <PanoramaViewer imageUrl={project.afterImage} aspect={project.aspect} />
            ) : viewerMode === "review" ? (
              <div
                ref={reviewSurfaceRef}
                onClick={handleReviewSurfaceClick}
                className="relative cursor-crosshair select-none"
                style={{ aspectRatio: project.aspect }}
              >
                <img src={project.afterImage} alt={project.afterAlt} className="h-full w-full object-contain" />
                {projectPins.map((pin) => (
                  <span
                    key={pin.id}
                    style={{ left: `${pin.xNorm * 100}%`, top: `${pin.yNorm * 100}%` }}
                    title={`${pin.author}: ${pin.note}`}
                    className={cn(
                      "absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-xs font-bold shadow-lg",
                      pin.status === "resolved"
                        ? "border-emerald-200 bg-emerald-600 text-white"
                        : "border-[#2a1c0c] bg-[#e7c27a] text-[#2a1c0c]",
                    )}
                  >
                    {pin.number}
                  </span>
                ))}
                {pendingPt ? (
                  <span
                    style={{ left: `${pendingPt.xNorm * 100}%`, top: `${pendingPt.yNorm * 100}%` }}
                    className="absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-amber-500 text-xs font-bold text-black shadow-lg"
                  >
                    +
                  </span>
                ) : null}
                <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-[#14110f]/90 px-3 py-1 text-[11px] text-[#e7c27a]">
                  Click anywhere on the plate to drop a numbered client review pin
                </div>
              </div>
            ) : (
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
          </div>

          {/* Client Review Pin Creation & List (#19) */}
          {viewerMode === "review" ? (
            <div className="space-y-3 rounded-2xl border border-line bg-raised p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-serif text-base font-semibold text-fg">Client Review Annotations</h3>
                <button
                  type="button"
                  onClick={handleCopyReviewLink}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-medium text-fg"
                >
                  <Share2 className="size-3.5 text-[#b08a45]" /> Copy Shareable Review Link
                </button>
              </div>

              {pendingPt ? (
                <form onSubmit={submitReviewPin} className="flex flex-wrap items-center gap-2 rounded-xl border border-[#d4b06a] bg-surface p-2.5 text-xs">
                  <input
                    type="text"
                    value={pinAuthor}
                    onChange={(e) => setPinAuthor(e.target.value)}
                    placeholder="Reviewer"
                    className="h-8 w-36 rounded-lg border border-line bg-raised px-2.5 text-fg outline-none focus:border-[#d4b06a]"
                  />
                  <input
                    type="text"
                    value={pinNote}
                    onChange={(e) => setPinNote(e.target.value)}
                    placeholder="Markup note (e.g. Change cladding to charred cedar)"
                    className="h-8 min-w-[200px] flex-1 rounded-lg border border-line bg-raised px-2.5 text-fg outline-none focus:border-[#d4b06a]"
                    autoFocus
                  />
                  <button type="submit" className="gold-fill h-8 rounded-full px-3.5 font-semibold text-[#2a1c0c]">
                    Save Pin
                  </button>
                  <button type="button" onClick={() => setPendingPt(null)} className="h-8 rounded-full border border-line px-3 text-muted">
                    Cancel
                  </button>
                </form>
              ) : null}

              {projectPins.length === 0 ? (
                <p className="text-xs text-muted">No pins yet. Click anywhere on the render above to place pin #1.</p>
              ) : (
                <div className="space-y-2">
                  {projectPins.map((pin) => (
                    <div key={pin.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e7c27a] font-bold text-[#2a1c0c]">
                          {pin.number}
                        </span>
                        <div>
                          <p className="font-medium text-fg">{pin.note}</p>
                          <p className="text-[10px] text-faint">
                            {pin.author} · {pin.status === "resolved" ? "Resolved" : "Open"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSendPinToInpaint(pin)}
                          className="gold-fill inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold text-[#2a1c0c]"
                        >
                          <Paintbrush className="size-3" /> Send Pin → Inpaint
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleReviewPinStatus(pin.id)}
                          className="h-7 rounded-full border border-line px-2.5 text-[11px] text-muted hover:text-fg"
                        >
                          {pin.status === "open" ? "Mark Resolved" : "Reopen"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeReviewPin(pin.id)}
                          className="grid size-7 place-items-center rounded-full text-faint hover:text-rose-600"
                          aria-label="Delete pin"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Architectural Intent */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-fg">Architectural Intent &amp; Directives</h3>
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
              <h4 className="text-xs font-semibold text-fg uppercase tracking-wider">Lighting &amp; Material Science</h4>
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
