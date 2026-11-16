import { Check, ChevronDown, ChevronUp, Layers, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import {
  BRIEF_TEMPLATE_CATEGORIES,
  BRIEF_TEMPLATES,
  filterBriefTemplates,
  type BriefTemplate,
  type BriefTemplateCategory,
} from "@/lib/brief-templates";
import { WORKFLOW_PRESETS, type EngineState, type FacadeTypology, type Scene3DMaterial, type Scene3DState, type WorkflowPreset } from "@/lib/engines";
import { RATIOS, RESOLUTIONS, type Frame } from "@/lib/frame";
import type { DesignState } from "@/lib/properties";
import { cn } from "@/lib/utils";

type BriefTemplateLibraryProps = {
  activeTemplateId: string | null;
  onLoadTemplate: (template: BriefTemplate) => void;
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
  frame: Frame;
  onUpdateFrame: (next: Frame) => void;
  onUpdateEngineField: <K extends keyof EngineState>(key: K, value: EngineState[K]) => void;
  onUpdateScene3DField: <K extends keyof Scene3DState>(key: K, value: Scene3DState[K]) => void;
};

const FACADE_OPTIONS: readonly FacadeTypology[] = [
  "Minimalist Glass",
  "Board-Marked Concrete",
  "Biophilic Timber Louver",
  "Nordic Brick & Zinc",
  "Parametric Kinetic Facade",
  "Classical Limestone",
];

const MATERIAL_OPTIONS: readonly { id: Scene3DMaterial; label: string }[] = [
  { id: "concrete", label: "Concrete" },
  { id: "timber", label: "Timber" },
  { id: "travertine", label: "Travertine" },
  { id: "brick", label: "Brick" },
];

const FOCAL_OPTIONS: readonly (24 | 35 | 50 | 85)[] = [24, 35, 50, 85];

export function BriefTemplateLibrary({
  activeTemplateId,
  onLoadTemplate,
  design,
  engine,
  scene3d,
  frame,
  onUpdateFrame,
  onUpdateEngineField,
  onUpdateScene3DField,
}: BriefTemplateLibraryProps) {
  const [expanded, setExpanded] = useState(true);
  const [category, setCategory] = useState<"All" | BriefTemplateCategory>("All");
  const [search, setSearch] = useState("");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredTemplates = useMemo(
    () => filterBriefTemplates(category, search),
    [category, search],
  );

  const activeTemplate = useMemo(
    () => BRIEF_TEMPLATES.find((t) => t.id === activeTemplateId) ?? null,
    [activeTemplateId],
  );

  return (
    <section
      data-testid="brief-template-library"
      aria-label="Architectural Brief Template Library"
      className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-6"
    >
      <div className="rounded-3xl border border-line bg-surface p-4 md:p-5">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-[#b08a45]" />
              <h2 className="font-serif text-lg font-semibold text-fg">
                Brief Template Library
              </h2>
            </div>
            <span className="text-xs text-muted">
              {BRIEF_TEMPLATES.length} curated architectural blueprints
              {activeTemplate ? ` · Active: ${activeTemplate.name}` : ""}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-raised px-3 text-xs font-medium text-fg transition hover:border-[#d4b06a]"
          >
            {expanded ? (
              <>
                Hide Library <ChevronUp className="size-3.5" />
              </>
            ) : (
              <>
                Browse Templates <ChevronDown className="size-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Live Visual Configuration Quick Bar */}
        <div
          data-testid="visual-config-bar"
          className="mt-3 grid grid-cols-2 gap-2.5 border-t border-line/70 pt-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          <label className="block text-[11px]">
            <span className="flex items-center gap-1 text-faint">
              <SlidersHorizontal className="size-3 text-[#b08a45]" /> Workflow
            </span>
            <select
              aria-label="Visual config workflow"
              value={engine.workflowPreset}
              onChange={(e) => onUpdateEngineField("workflowPreset", e.target.value as WorkflowPreset)}
              className="mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
            >
              {WORKFLOW_PRESETS.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[11px]">
            <span className="text-faint">Facade Typology</span>
            <select
              aria-label="Visual config facade"
              value={engine.facadeTypology}
              onChange={(e) => onUpdateEngineField("facadeTypology", e.target.value as FacadeTypology)}
              className="mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
            >
              {FACADE_OPTIONS.map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[11px]">
            <span className="text-faint">3D Material</span>
            <select
              aria-label="Visual config material"
              value={scene3d.primaryMaterial}
              onChange={(e) => onUpdateScene3DField("primaryMaterial", e.target.value as Scene3DMaterial)}
              className="mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
            >
              {MATERIAL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[11px]">
            <span className="text-faint">Optics Lens</span>
            <select
              aria-label="Visual config focal length"
              value={scene3d.focalLength}
              onChange={(e) => onUpdateScene3DField("focalLength", Number(e.target.value) as 24 | 35 | 50 | 85)}
              className="mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 font-mono text-xs tabular-nums text-fg outline-none focus:border-[#d4b06a]"
            >
              {FOCAL_OPTIONS.map((mm) => (
                <option key={mm} value={mm}>
                  {mm}mm Shift
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[11px]">
            <span className="text-faint">Aspect Ratio</span>
            <select
              aria-label="Visual config aspect ratio"
              value={frame.ratio}
              onChange={(e) => onUpdateFrame({ ...frame, ratio: e.target.value as Frame["ratio"] })}
              className="mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 font-mono text-xs tabular-nums text-fg outline-none focus:border-[#d4b06a]"
            >
              {RATIOS.map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[11px]">
            <span className="text-faint">Output Quality</span>
            <select
              aria-label="Visual config resolution"
              value={frame.resolution}
              onChange={(e) => onUpdateFrame({ ...frame, resolution: e.target.value as Frame["resolution"] })}
              className="mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 font-mono text-xs uppercase text-fg outline-none focus:border-[#d4b06a]"
            >
              {RESOLUTIONS.map((res) => (
                <option key={res} value={res}>
                  {res.toUpperCase()} ({design.range})
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Expandable Filterable Template Cards Grid */}
        {expanded ? (
          <div className="mt-4 space-y-3 border-t border-line/70 pt-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div
                role="tablist"
                aria-label="Brief template categories"
                className="flex flex-wrap items-center gap-1 rounded-xl bg-raised p-1"
              >
                {BRIEF_TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={category === cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "h-7 shrink-0 whitespace-nowrap rounded-lg px-2.5 text-xs font-medium transition",
                      category === cat
                        ? "gold-fill text-[#2a1c0c]"
                        : "text-muted hover:text-fg",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[210px] flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates (e.g. Modern, Urban)..."
                  aria-label="Search brief templates"
                  className="h-8 w-full rounded-lg border border-line bg-raised pr-3 pl-8 text-xs text-fg outline-none focus:border-[#d4b06a]"
                />
              </div>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-raised/50 p-6 text-center">
                <p className="text-xs text-muted">
                  No architectural templates match &ldquo;{search}&rdquo; in {category}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategory("All");
                    setSearch("");
                  }}
                  className="mt-2 inline-flex h-8 items-center rounded-lg border border-line bg-surface px-3 text-xs font-medium text-fg hover:border-[#d4b06a]"
                >
                  Show All Templates
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {filteredTemplates.map((tpl) => {
                  const isActive = activeTemplateId === tpl.id;
                  const imgFailed = failedImages[tpl.id];
                  return (
                    <article
                      key={tpl.id}
                      data-testid={`template-card-${tpl.id}`}
                      className={cn(
                        "flex flex-col overflow-hidden rounded-2xl border transition",
                        isActive
                          ? "border-[#b08a45] bg-[#fffaf0]"
                          : "border-line bg-raised/40 hover:border-[#d4b06a]/80",
                      )}
                    >
                      <div className="relative h-28 w-full overflow-hidden bg-[#1b1814]">
                        {!imgFailed ? (
                          <img
                            src={tpl.previewImage}
                            alt={`${tpl.name} architectural preview`}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [tpl.id]: true }))
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2a241d] to-[#14110e] p-3 text-center">
                            <span className="font-serif text-xs text-[#e7c27a]">{tpl.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-2.5">
                        <div>
                          <p className="text-[10px] font-medium text-[#927032]">
                            {tpl.category} · {tpl.designPatch.vertical ?? "architecture"}
                          </p>
                          <h3 className="mt-0.5 truncate font-serif text-sm font-semibold text-fg">
                            {tpl.name}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
                            {tpl.tagline}
                          </p>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line/60 pt-2">
                          <span className="truncate font-mono text-[10px] tabular-nums text-faint">
                            {tpl.scene3dPatch.focalLength ?? 28}mm · {tpl.frameRatio} ·{" "}
                            {tpl.frameResolution.toUpperCase()}
                          </span>
                          <button
                            type="button"
                            data-testid={`load-template-${tpl.id}`}
                            aria-label={`Load ${tpl.name} template`}
                            onClick={() => onLoadTemplate(tpl)}
                            className={cn(
                              "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 text-[11px] font-semibold transition",
                              isActive
                                ? "border border-[#b08a45] bg-[#d4b06a]/20 text-[#6e4c14]"
                                : "gold-fill text-[#2a1c0c]",
                            )}
                          >
                            {isActive ? (
                              <>
                                <Check className="size-3" /> Loaded
                              </>
                            ) : (
                              "Load Template"
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
