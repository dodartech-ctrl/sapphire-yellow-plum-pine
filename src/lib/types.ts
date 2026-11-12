export type Discipline = "architecture" | "interior" | "exterior" | "landscape";
export type Scope = Discipline | "any";
export type Workflow = "concept" | "edit" | "compare" | "study" | "framework";
export type ModelId = "gpt" | "midjourney" | "firefly" | "flux" | "gemini";

export type Template = {
  id: string;
  title: string;
  scope: Scope;
  workflow: Workflow;
  summary: string;
  prompt: string;
};

export type Scores = {
  brief: number;
  fidelity: number | null;
  spatial: number;
  material: number;
  lighting: number;
  comparison: number;
  artifacts: number;
};

export type Study = {
  id: string;
  code: string;
  title: string;
  scope: Discipline;
  workflow: "text" | "edit";
  image: string;
  prompt: string;
  observation: string;
  scores: Scores;
  sourceImage?: string;
  revision?: { image: string; prompt: string; note: string };
  metrics?: string;
};

export type Part =
  | { kind: "text"; text: string }
  | { kind: "slot"; id: string; hint: string };
