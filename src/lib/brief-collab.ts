import type { BimScheduleRow as MaterialScheduleRow } from "@/lib/archviz-suite";
import type { BuilderBlock } from "@/lib/builder-data";
import type { EngineState, Scene3DState } from "@/lib/engines";
import type { Frame } from "@/lib/frame";
import type { DesignState } from "@/lib/properties";

export type CollabParameterKey =
  | "style"
  | "lighting"
  | "mood"
  | "camera"
  | "workflowPreset"
  | "facadeTypology"
  | "primaryMaterial"
  | "focalLength"
  | "frameRatio"
  | "directives";

export interface CollabParameterTarget {
  key: CollabParameterKey;
  label: string;
  category: "Blueprint Slot" | "Visual Config" | "Directives";
}

export const COLLAB_PARAMETER_TARGETS: readonly CollabParameterTarget[] = [
  { key: "style", label: "Architectural Style", category: "Blueprint Slot" },
  { key: "lighting", label: "Lighting Condition", category: "Blueprint Slot" },
  { key: "mood", label: "Mood & Atmosphere", category: "Blueprint Slot" },
  { key: "camera", label: "Camera / Composition", category: "Blueprint Slot" },
  { key: "workflowPreset", label: "Workflow Preset", category: "Visual Config" },
  { key: "facadeTypology", label: "Facade Typology", category: "Visual Config" },
  { key: "primaryMaterial", label: "3D Primary Material", category: "Visual Config" },
  { key: "focalLength", label: "Optics / Focal Length", category: "Visual Config" },
  { key: "frameRatio", label: "Frame & Resolution", category: "Visual Config" },
  { key: "directives", label: "Studio Directives", category: "Directives" },
] as const;

export const COLLAB_REVIEWER_ROLES = [
  "Lead Architect",
  "Lighting Director",
  "BIM Coordinator",
  "Visual Designer",
  "Client Reviewer",
] as const;

export type CollabReviewerRole = (typeof COLLAB_REVIEWER_ROLES)[number];

export interface SharedBriefSnapshot {
  title: string;
  subtitle: string;
  slotIds: {
    styleId: string | null;
    lightingId: string | null;
    moodId: string | null;
    cameraId: string | null;
  };
  slotNames: {
    styleName: string;
    lightingName: string;
    moodName: string;
    cameraName: string;
  };
  customNotes: string;
  activeDictPresetId: string;
  dictionaryBlocks: string[];
  dictionaryParams: Record<string, Record<string, string>>;
  activeTemplateId: string | null;
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
  frame: Frame;
  synthesizedPrompt: string;
  bimSchedule: MaterialScheduleRow[];
}

export interface BriefCommentRecord {
  id: string;
  shareId: string;
  parameterKey: CollabParameterKey;
  parameterLabel: string;
  parameterValue: string;
  authorName: string;
  authorRole: string;
  body: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface SharedBriefSession {
  shareId: string;
  title: string;
  authorName: string;
  snapshot: SharedBriefSnapshot;
  createdAt: string;
  updatedAt: string;
  comments: BriefCommentRecord[];
}

export function isValidCollabParameterKey(key: string): key is CollabParameterKey {
  return COLLAB_PARAMETER_TARGETS.some((t) => t.key === key);
}

export function getCollabParameterTarget(key: CollabParameterKey): CollabParameterTarget {
  return (
    COLLAB_PARAMETER_TARGETS.find((t) => t.key === key) ?? {
      key: "directives",
      label: "Studio Directives",
      category: "Directives",
    }
  );
}

export function extractParameterDisplayValues(
  snapshot: Pick<SharedBriefSnapshot, "slotNames" | "engine" | "scene3d" | "frame" | "customNotes">,
): Record<CollabParameterKey, string> {
  const directivesTrimmed = snapshot.customNotes.trim();
  return {
    style: snapshot.slotNames.styleName || "Unassigned",
    lighting: snapshot.slotNames.lightingName || "Unassigned",
    mood: snapshot.slotNames.moodName || "Unassigned",
    camera: snapshot.slotNames.cameraName || "Unassigned",
    workflowPreset: snapshot.engine.workflowPreset,
    facadeTypology: snapshot.engine.facadeTypology,
    primaryMaterial: snapshot.scene3d.primaryMaterial,
    focalLength: `${snapshot.scene3d.focalLength}mm`,
    frameRatio: `${snapshot.frame.ratio} · ${snapshot.frame.resolution}`,
    directives:
      directivesTrimmed.length > 96
        ? `${directivesTrimmed.slice(0, 93)}...`
        : directivesTrimmed || "No studio directives",
  };
}

export function buildSharedBriefSnapshot(args: {
  title: string;
  subtitle: string;
  selectedStyle: BuilderBlock | null;
  selectedLighting: BuilderBlock | null;
  selectedMood: BuilderBlock | null;
  selectedCamera: BuilderBlock | null;
  customNotes: string;
  activeDictPresetId: string;
  dictionaryBlocks: string[];
  dictionaryParams: Record<string, Record<string, string>>;
  activeTemplateId: string | null;
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
  frame: Frame;
  synthesizedPrompt: string;
  bimSchedule: MaterialScheduleRow[];
}): SharedBriefSnapshot {
  return {
    title: args.title.trim().slice(0, 140) || "Architectural Vision Brief",
    subtitle: args.subtitle.trim().slice(0, 200) || "Studio Specification",
    slotIds: {
      styleId: args.selectedStyle?.id ?? null,
      lightingId: args.selectedLighting?.id ?? null,
      moodId: args.selectedMood?.id ?? null,
      cameraId: args.selectedCamera?.id ?? null,
    },
    slotNames: {
      styleName: args.selectedStyle?.name ?? "Unassigned",
      lightingName: args.selectedLighting?.name ?? "Unassigned",
      moodName: args.selectedMood?.name ?? "Unassigned",
      cameraName: args.selectedCamera?.name ?? "Unassigned",
    },
    customNotes: args.customNotes.slice(0, 6000),
    activeDictPresetId: args.activeDictPresetId,
    dictionaryBlocks: [...args.dictionaryBlocks],
    dictionaryParams: args.dictionaryParams,
    activeTemplateId: args.activeTemplateId,
    design: args.design,
    engine: args.engine,
    scene3d: args.scene3d,
    frame: args.frame,
    synthesizedPrompt: args.synthesizedPrompt.slice(0, 6000),
    bimSchedule: args.bimSchedule,
  };
}

export function normalizeAuthorName(name: string): string {
  const cleaned = name.replace(/\s+/g, " ").trim().slice(0, 48);
  return cleaned || "Studio Collaborator";
}

export function normalizeCommentBody(body: string): string {
  return body.replace(/\r\n/g, "\n").trim().slice(0, 1200);
}

export function sanitizeShareId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
}

export function buildBriefShareUrl(origin: string, shareId: string): string {
  const cleanOrigin = origin.replace(/\/+$/, "");
  const cleanId = sanitizeShareId(shareId);
  return `${cleanOrigin}/builder?share=${encodeURIComponent(cleanId)}`;
}

export function summarizeCommentsByParameter(
  comments: readonly BriefCommentRecord[],
): Record<CollabParameterKey, { open: number; resolved: number; total: number }> {
  const summary = {} as Record<CollabParameterKey, { open: number; resolved: number; total: number }>;
  for (const target of COLLAB_PARAMETER_TARGETS) {
    summary[target.key] = { open: 0, resolved: 0, total: 0 };
  }
  for (const comment of comments) {
    const bucket = summary[comment.parameterKey];
    if (!bucket) continue;
    bucket.total += 1;
    if (comment.status === "resolved") bucket.resolved += 1;
    else bucket.open += 1;
  }
  return summary;
}
