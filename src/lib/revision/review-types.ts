import type { FinishRecord, VersionSet } from "./versions.ts";

export type ReviewImage = { viewId: string; name: string; before: string; after: string };

export type ReviewPin = { viewId: string; x: number; y: number; body: string };

export type ReviewDecision = {
  id: string;
  setId: string;
  decision: "approved" | "changes_requested";
  reviewerName: string;
  note: string;
  pins: ReviewPin[];
  createdAt: string;
};

export type ReviewPayload = {
  shareId: string;
  projectName: string;
  changeRequest: string;
  finish: FinishRecord;
  set: VersionSet;
  images: ReviewImage[];
  createdAt: string;
  decisions: ReviewDecision[];
};

export const MAX_REVIEW_VIEWS = 6;
export const MAX_IMAGE_CHARS = 1_800_000;
