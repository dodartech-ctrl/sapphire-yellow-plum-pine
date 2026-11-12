import { useNavigate } from "@tanstack/react-router";
import { Check, Copy, ImagePlus, RotateCcw, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SCOPE_LABEL, TEMPLATES, WORKFLOW_LABEL } from "@/lib/catalog";
import { ASPECTS, MODELS, adapt, applyNote, compose, initialValues, openSlotCount, parseTemplate } from "@/lib/compose";
import { STUDIES } from "@/lib/studies";
import { readImage } from "@/lib/read-image";
import { PILL_GROUPS } from "@/lib/pills";
import { useOriel } from "@/lib/store";
import type { Discipline, ModelId, Part } from "@/lib/types";
import { cn, formatWhen } from "@/lib/utils";

const SCOPES: { id: Discipline; label: string }[] = [
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "landscape", label: "Landscape" },
  { id: "architecture", label: "Architecture" },
];

function presetsFor(scope: Discipline) {
  return TEMPLATES.filter((template) => template.scope === scope || (scope === "architecture" && template.scope === "any"));
}

export type Boot = {
  key: string;
  title: string;
  eyebrow: string;
  summary: string;
  parts: Part[];
  values: Record<string, string>;
  seed: Record<string, string>;
  image?: string;
  imageAlt: string;
  favoriteId: string;
  model: ModelId;
  aspect: string;
  note?: string;
  seedNote?: string;
};

export function StudioForm({ boot }: { boot: Boot }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(boot.values);
  const [model, setModel] = useState<ModelId>(boot.model);
  const [aspect, setAspect] = useState(boot.aspect);
  const [boardId, setBoardId] = useState("working");
  const [boardName, setBoardName] = useState("");
  const [filter, setFilter] = useState("");
  const [notes] = useState<string[]>(() => (boot.seedNote ? [boot.seedNote] : []));
  const threadRef = useRef<HTMLDivElement>(null);
  const favorites = useOriel((state) => state.favorites);
  const toggleFavorite = useOriel((state) => state.toggleFavorite);
  const boards = useOriel((state) => state.boards);
  const briefs = useOriel((state) => state.briefs);
  const addBoard = useOriel((state) => state.addBoard);
  const saveBrief = useOriel((state) => state.saveBrief);
  const removeBrief = useOriel((state) => state.removeBrief);
  const pushLog = useOriel((state) => state.pushLog);
  const setDraft = useOriel((state) => state.setDraft);
  const setSlotValues = useOriel((state) => state.setSlotValues);
  const upload = useOriel((state) => state.upload);
  const setUpload = useOriel((state) => state.setUpload);
  const plate = useOriel((state) => state.plate);
  const setActiveKey = useOriel((state) => state.setActiveKey);
  const pills = useOriel((state) => state.pills);
  const setPill = useOriel((state) => state.setPill);
  const currentTemplate = TEMPLATES.find((item) => item.id === boot.favoriteId);
  const studyScope = STUDIES.find((item) => item.id === boot.favoriteId)?.scope;
  const scope: Discipline =
    currentTemplate?.scope === "interior" || currentTemplate?.scope === "exterior" || currentTemplate?.scope === "landscape"
      ? currentTemplate.scope
      : studyScope === "interior" || studyScope === "exterior" || studyScope === "landscape"
        ? studyScope
        : "architecture";
  const presets = presetsFor(scope);

  const canonical = useMemo(() => compose(boot.parts, values), [boot.parts, values]);
  const thread = useMemo(() => {
    const turns: { id: string; text: string; reply: string; brief: string }[] = [];
    let cursor = canonical;
    notes.forEach((item, index) => {
      const applied = applyNote(cursor, item);
      cursor = applied.brief;
      turns.push({ id: `t-${index}`, text: item, reply: applied.reply, brief: cursor });
    });
    return { turns, working: cursor };
  }, [canonical, notes]);
  const pass = useMemo(() => adapt(model, thread.working, aspect), [aspect, model, thread.working]);
  const slots = boot.parts.filter((part): part is Extract<Part, { kind: "slot" }> => part.kind === "slot");
  const open = openSlotCount(boot.parts, values);
  const modelMeta = MODELS.find((item) => item.id === model) ?? MODELS[0];
  const saved = favorites.includes(boot.favoriteId);

  useEffect(() => {
    setSlotValues(values);
  }, [setSlotValues, values]);

  useEffect(() => {
    setDraft({ key: boot.key, values, model, aspect });
  }, [aspect, boot.key, model, setDraft, values]);

  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [notes.length, boot.key]);

  const needle = filter.trim().toLowerCase();
  const studyHits = STUDIES.filter((study) => !needle || `${study.code} ${study.title}`.toLowerCase().includes(needle));
  const templateHits = TEMPLATES.filter(
    (template) => !needle || `${template.title} ${SCOPE_LABEL[template.scope]}`.toLowerCase().includes(needle),
  );

  function go(next: string) {
    if (next === boot.key) return;
    if (next.startsWith("study:")) {
      void navigate({ to: "/studio", search: { study: next.slice(6), template: undefined } });
    } else {
      void navigate({ to: "/studio", search: { template: next.slice(9), study: undefined } });
    }
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      pushLog({ title: boot.title, model, text });
      toast.success(label);
    } catch {
      toast.error("Clipboard was blocked. Select the brief and copy it manually.");
    }
  }

  function save() {
    let target = boardId;
    if (boardName.trim()) {
      target = addBoard(boardName.trim());
      setBoardId(target);
      setBoardName("");
    }
    saveBrief({
      title: boot.title,
      boardId: target,
      model,
      aspect,
      canonical,
      adapted: pass,
    });
    toast.success("Saved to your board");
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <aside className="order-2 border-t border-line lg:order-1 lg:h-full lg:w-96 lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-r">
        <div className="space-y-6 p-4 md:p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-faint">Scope</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SCOPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const first = presetsFor(item.id)[0];
                    if (first) setActiveKey(`template:${first.id}`);
                  }}
                  className={cn(
                    "h-10 rounded-full border px-3 text-sm",
                    scope === item.id ? "border-lime bg-lime text-ink" : "border-line text-muted",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-faint">Preset</p>
            <div className="mt-2 max-h-52 space-y-1 overflow-y-auto">
              {presets.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setActiveKey(`template:${template.id}`)}
                  className={cn(
                    "flex h-10 w-full items-center rounded-full border px-3 text-left text-sm",
                    boot.favoriteId === template.id ? "border-lime bg-lime text-ink" : "border-line text-muted",
                  )}
                >
                  <span className="truncate">{template.title}</span>
                </button>
              ))}
            </div>
          </div>

          {PILL_GROUPS.map((group) => (
            <div key={group.key}>
              <p className="text-xs font-medium uppercase tracking-wide text-faint">{group.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPill(group.key, option)}
                    className={cn(
                      "h-10 rounded-full border px-3 text-sm",
                      pills[group.key] === option ? "border-lime bg-lime text-ink" : "border-line text-muted",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="order-1 flex min-h-[32rem] min-w-0 flex-col lg:order-2 lg:h-full lg:min-h-0 lg:flex-1">
        <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex h-full max-w-3xl flex-col justify-center gap-4 px-4 py-5 md:px-6">
            {plate && plate.templateId === boot.favoriteId ? (
              <img src={plate.url} alt="Generated visualization" className="max-h-[70vh] w-full rounded-2xl border border-line object-contain bg-white" />
            ) : upload ? (
              <img src={upload} alt="Uploaded reference" className="max-h-[70vh] w-full rounded-2xl border border-line object-contain bg-white" />
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById("canvas-file")?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const file = event.dataTransfer.files[0];
                  if (!file) return;
                  void readImage(file).then(setUpload).catch((error: unknown) => {
                    toast.error(error instanceof Error ? error.message : "Could not read that image.");
                  });
                }}
                className="grid min-h-80 w-full place-items-center rounded-3xl border border-dashed border-line bg-surface px-6 py-16 text-center"
              >
                <span>
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-line bg-raised text-lime">
                    <ImagePlus className="size-6" />
                  </span>
                  <span className="mt-4 block font-syne text-xl font-semibold">Drop or browse a photo</span>
                  <span className="mt-2 block text-sm text-muted">JPG, PNG, or WebP.</span>
                </span>
              </button>
            )}
            <input
              id="canvas-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                void readImage(file).then(setUpload).catch((error: unknown) => {
                  toast.error(error instanceof Error ? error.message : "Could not read that image.");
                });
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SourceButton({
  active,
  label,
  meta,
  onClick,
}: {
  active: boolean;
  label: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left",
        active ? "bg-lime text-ink" : "text-fg hover:bg-raised",
      )}
    >
      <span className="truncate text-sm">{label}</span>
      <span className={cn("shrink-0 text-xs", active ? "text-ink/70" : "text-faint")}>{meta}</span>
    </button>
  );
}

export function bootFromStudy(id: string, model: ModelId = "gpt", aspect = "3:2"): Boot | null {
  const study = STUDIES.find((item) => item.id === id);
  if (!study) return null;
  const parts = parseTemplate(study.prompt);
  return {
    key: `study:${study.id}`,
    title: study.title,
    eyebrow: `${study.code} · Tested brief · ${SCOPE_LABEL[study.scope]}`,
    summary: study.observation,
    parts,
    values: {},
    seed: {},
    image: study.image,
    imageAlt: study.title,
    favoriteId: study.id,
    model,
    aspect,
    note: study.metrics,
  };
}

export function bootFromTemplate(id: string, values: Record<string, string> | null, model: ModelId = "gpt", aspect = "3:2"): Boot | null {
  const template = TEMPLATES.find((item) => item.id === id);
  if (!template) return null;
  const parts = parseTemplate(template.prompt);
  const seed = initialValues(parts);
  const image =
    template.scope === "interior"
      ? "/viz/t03-compact-living-room.jpg"
      : template.scope === "exterior"
        ? "/viz/t05-subtropical-home.jpg"
        : template.scope === "landscape"
          ? "/viz/t06-urban-courtyard.jpg"
          : template.scope === "architecture"
            ? "/viz/t01-public-library.jpg"
            : "/viz/t08-material-junction.jpg";
  return {
    key: `template:${template.id}`,
    title: template.title,
    eyebrow: `${WORKFLOW_LABEL[template.workflow]} · ${SCOPE_LABEL[template.scope]}`,
    summary: template.summary,
    parts,
    values: values ?? seed,
    seed,
    image,
    imageAlt: template.title,
    favoriteId: template.id,
    model,
    aspect,
  };
}
