import { createServerFn } from "@tanstack/react-start";
import type { ReviewDecision, ReviewImage, ReviewPayload, ReviewPin } from "./review-types.ts";
import type { FinishRecord, VersionSet } from "./versions.ts";

export const createReviewFn = createServerFn({ method: "POST" })
  .validator((data: { projectName: string; changeRequest: string; finish: FinishRecord; set: VersionSet; images: ReviewImage[] }) => data)
  .handler(async ({ data }): Promise<{ shareId: string }> => {
    const { createReviewRecord } = await import("./review.server.ts");
    return createReviewRecord(data);
  });

export const getReviewFn = createServerFn({ method: "POST" })
  .validator((data: { shareId: string }) => data)
  .handler(async ({ data }): Promise<ReviewPayload | null> => {
    const { getReviewRecord } = await import("./review.server.ts");
    return getReviewRecord(data.shareId);
  });

export const addDecisionFn = createServerFn({ method: "POST" })
  .validator((data: { shareId: string; decision: string; reviewerName: string; note: string; pins: ReviewPin[] }) => data)
  .handler(async ({ data }): Promise<ReviewDecision> => {
    const { addDecisionRecord } = await import("./review.server.ts");
    return addDecisionRecord(data);
  });
