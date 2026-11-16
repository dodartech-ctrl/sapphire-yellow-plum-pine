import { createServerFn } from "@tanstack/react-start";
import type { BriefCommentRecord, SharedBriefSession, SharedBriefSnapshot } from "@/lib/brief-collab";

export const createSharedBriefFn = createServerFn({ method: "POST" })
  .validator((data: { authorName: string; snapshot: SharedBriefSnapshot }) => data)
  .handler(async ({ data }): Promise<SharedBriefSession> => {
    const { createSharedBriefRecord } = await import("@/lib/brief-collab.server");
    return createSharedBriefRecord(data);
  });

export const updateSharedBriefFn = createServerFn({ method: "POST" })
  .validator((data: { shareId: string; snapshot: SharedBriefSnapshot }) => data)
  .handler(async ({ data }): Promise<SharedBriefSession> => {
    const { updateSharedBriefRecord } = await import("@/lib/brief-collab.server");
    return updateSharedBriefRecord(data);
  });

export const getSharedBriefFn = createServerFn({ method: "POST" })
  .validator((data: { shareId: string }) => data)
  .handler(async ({ data }): Promise<SharedBriefSession | null> => {
    const { getSharedBriefRecord } = await import("@/lib/brief-collab.server");
    return getSharedBriefRecord(data.shareId);
  });

export const addBriefCommentFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      shareId: string;
      parameterKey: string;
      parameterValue?: string;
      authorName: string;
      authorRole: string;
      body: string;
    }) => data,
  )
  .handler(async ({ data }): Promise<BriefCommentRecord> => {
    const { addBriefCommentRecord } = await import("@/lib/brief-collab.server");
    return addBriefCommentRecord(data);
  });

export const toggleBriefCommentStatusFn = createServerFn({ method: "POST" })
  .validator(
    (data: { shareId: string; commentId: string; status: "open" | "resolved" }) => data,
  )
  .handler(async ({ data }): Promise<BriefCommentRecord> => {
    const { toggleBriefCommentStatusRecord } = await import("@/lib/brief-collab.server");
    return toggleBriefCommentStatusRecord(data);
  });

export const deleteBriefCommentFn = createServerFn({ method: "POST" })
  .validator((data: { shareId: string; commentId: string }) => data)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { deleteBriefCommentRecord } = await import("@/lib/brief-collab.server");
    return deleteBriefCommentRecord(data);
  });
