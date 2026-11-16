import type { VerticalId } from "@/lib/properties";

export type WorkflowIntentId = "render" | "3d" | "edit" | "enhance" | "spatial";

export type EnhanceScope = "image" | "region" | "people";
export type EnhanceEnvironment = "exterior" | "interior";

export interface WorkflowIntentMeta {
  id: WorkflowIntentId;
  label: string;
  step: number;
  hint: string;
}

export const WORKFLOW_INTENTS: readonly WorkflowIntentMeta[] = [
  { id: "render", label: "Render", step: 1, hint: "Photo, sketch, or prompt to plate" },
  { id: "3d", label: "3D / GLB", step: 2, hint: "Massing, GLB model, solar rig & camera" },
  { id: "edit", label: "Edit & Region", step: 3, hint: "Click-to-mask SAM-2 & inpaint" },
  { id: "enhance", label: "Enhance 4K/8K", step: 4, hint: "Detail upscale, relight & compare" },
  { id: "spatial", label: "360° & Nodes", step: 5, hint: "Panorama walkthrough & 45-node DAG" },
] as const;

export const ENHANCE_SCOPES: ReadonlyArray<{ id: EnhanceScope; label: string }> = [
  { id: "image", label: "Whole Image" },
  { id: "region", label: "Region" },
  { id: "people", label: "People" },
];

export const ENHANCE_ENVIRONMENTS: ReadonlyArray<{ id: EnhanceEnvironment; label: string }> = [
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
];

export interface EntourageTag {
  id: string;
  label: string;
  snippet: string;
}

export const STAGE_ENTOURAGE_TAGS: readonly EntourageTag[] = [
  { id: "trees", label: "Trees", snippet: "mature architectural trees framing the edges" },
  { id: "people", label: "People", snippet: "natural human scale figures in motion" },
  { id: "car", label: "Car", snippet: "sleek parked vehicle on driveway" },
  { id: "lamp", label: "Warm Lamp", snippet: "warm architectural pendant and wall-wash glow" },
  { id: "greenery", label: "Greenery", snippet: "lush layered planters and courtyard foliage" },
  { id: "water", label: "Water", snippet: "calm reflective water court" },
];

export function resolveIntentFromStage(
  stage: string,
  enhanceBarOpen: boolean,
): WorkflowIntentId {
  if (stage === "3d") return "3d";
  if (stage === "sam2" || stage === "mask" || stage === "sketch" || stage === "cv") return "edit";
  if (stage === "360" || stage === "nodes") return "spatial";
  if (enhanceBarOpen && (stage === "source" || stage === "result" || stage === "compare")) return "enhance";
  return "render";
}

export function defaultEnhanceEnvironmentForVertical(vertical: VerticalId): EnhanceEnvironment {
  return vertical === "interior" || vertical === "amenities" ? "interior" : "exterior";
}

export function buildEnhanceDirective(
  scope: EnhanceScope,
  env: EnhanceEnvironment,
  factor: 2 | 4,
): string {
  const scopeDesc =
    scope === "region"
      ? "targeted architectural region clarity"
      : scope === "people"
        ? "realistic scale figures, faces, and foliage micro-detail"
        : "full-frame material texture and edge fidelity";
  const envDesc =
    env === "interior"
      ? "strict interior geometry and lighting preservation"
      : "crisp exterior facade cladding, glass reflections, and landscaping depth";
  return `${factor}x ArchViz enhance (${scopeDesc}; ${envDesc})`;
}

export function appendEntourageTagToIdea(idea: string, snippet: string): string {
  const cleanSnippet = snippet.trim();
  if (!cleanSnippet) return idea;
  const trimmed = idea.trim();
  if (!trimmed) return cleanSnippet;
  if (trimmed.toLowerCase().includes(cleanSnippet.toLowerCase())) return idea;
  return `${trimmed.replace(/[,.;\s]+$/, "")}, ${cleanSnippet}`;
}

let pending3DFile: File | null = null;

export function setPending3DFile(file: File | null) {
  pending3DFile = file;
}

export function consumePending3DFile(): File | null {
  const f = pending3DFile;
  pending3DFile = null;
  return f;
}
