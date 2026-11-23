import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ParsedBrief } from "./brief.ts";
import type { CostEntry, Job, Quote } from "./quote.ts";
import type { Approval, VersionSet } from "./versions.ts";

export type RevView = {
  id: string;
  name: string;
  width: number;
  height: number;
  /** Fast hash of the working pixels: duplicate detection + gate bookkeeping. */
  pixelHash: string;
  /** SHA-256 of the working pixels (recorded on version sets). */
  originalHash: string;
  originalKey: string;
  workingKey: string;
};

export type RevSurface = {
  id: string;
  name: string;
  /** false = the surface is hidden/occluded in that view and is skipped there. */
  visible: Record<string, boolean>;
};

export type FinishDraft = {
  id: string;
  label: string;
  supplier: string;
  sku: string;
  grain: string;
  role: "material" | "lighting" | "furniture";
  /** Colour used by the offline preview and recorded with the swatch. */
  color: string;
  swatchKey: string | null;
  swatchHash: string;
};

export type Candidate = {
  id: string;
  viewId: string;
  attempt: number;
  jobKey: string;
  resultKey: string;
  resultHash: string;
  provider: "local-preview" | "ai";
  gate: { pass: boolean; changedOutside: number; changedInside: number; reason: string };
  status: "ready" | "accepted" | "rejected";
  credits: number;
  elapsedMs: number;
  note: string;
  createdAt: number;
};

export type ReviewLink = { shareId: string; setId: string; createdAt: number };

export type RevProject = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  step: number;
  views: RevView[];
  feedback: string;
  brief: ParsedBrief | null;
  briefConfirmed: boolean;
  surfaces: RevSurface[];
  activeSurfaceId: string | null;
  finish: FinishDraft | null;
  quote: Quote | null;
  quoteApproved: boolean;
  jobs: Record<string, Job>;
  candidates: Candidate[];
  sets: VersionSet[];
  activeSetId: string | null;
  approvals: Approval[];
  costs: CostEntry[];
  designerMinutes: number;
  review: ReviewLink | null;
  /** Name for the next frozen set when branching from an approved one. */
  draftBranch: string | null;
  /** Bumped whenever a mask changes so dependent previews are known to be stale. */
  maskRev: Record<string, number>;
};

type State = {
  projects: RevProject[];
  activeId: string | null;
  create: (name: string) => string;
  open: (id: string) => void;
  remove: (id: string) => void;
  patch: (id: string, change: Partial<RevProject> | ((p: RevProject) => Partial<RevProject>)) => void;
  /** Mark any job that was "running" when the page closed as failed, so it can be reconciled and retried. */
  reconcile: () => void;
};

export function newId(prefix: string): string {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

export function blankProject(name: string): RevProject {
  const now = Date.now();
  return {
    id: newId("rp"),
    name: name.trim().slice(0, 60) || "Untitled revision",
    createdAt: now,
    updatedAt: now,
    step: 0,
    views: [],
    feedback: "",
    brief: null,
    briefConfirmed: false,
    surfaces: [],
    activeSurfaceId: null,
    finish: null,
    quote: null,
    quoteApproved: false,
    jobs: {},
    candidates: [],
    sets: [],
    activeSetId: null,
    approvals: [],
    costs: [],
    designerMinutes: 0,
    review: null,
    draftBranch: null,
    maskRev: {},
  };
}

export const useRevision = create<State>()(
  persist(
    (set) => ({
      projects: [],
      activeId: null,
      create: (name) => {
        const project = blankProject(name);
        set((s) => ({ projects: [project, ...s.projects].slice(0, 30), activeId: project.id }));
        return project.id;
      },
      open: (id) => set((s) => (s.projects.some((p) => p.id === id) ? { activeId: id } : s)),
      remove: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id), activeId: s.activeId === id ? null : s.activeId })),
      patch: (id, change) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== id) return p;
            const next = typeof change === "function" ? change(p) : change;
            return { ...p, ...next, updatedAt: Date.now() };
          }),
        })),
      reconcile: () =>
        set((s) => ({
          projects: s.projects.map((p) => {
            const stale = Object.values(p.jobs).filter((j) => j.status === "running");
            if (!stale.length) return p;
            const jobs = { ...p.jobs };
            for (const j of stale) jobs[j.key] = { ...j, status: "failed", finishedAt: Date.now() };
            return { ...p, jobs };
          }),
        })),
    }),
    {
      name: "oriel-revision-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ projects: state.projects, activeId: state.activeId }),
    },
  ),
);

export function activeProject(state: Pick<State, "projects" | "activeId">): RevProject | null {
  return state.projects.find((p) => p.id === state.activeId) ?? null;
}

export function blobKey(projectId: string, ...parts: string[]): string {
  return `rev:${projectId}:${parts.join(":")}`;
}
