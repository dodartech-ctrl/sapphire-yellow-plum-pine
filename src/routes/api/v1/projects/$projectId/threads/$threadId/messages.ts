import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/projects/$projectId/threads/$threadId/messages")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { handleGetThreadMessages } = await import("@/orchestration/zuke-spec-api.server");
        return handleGetThreadMessages(params.projectId, params.threadId);
      },
      POST: async ({ params, request }) => {
        const { handlePostThreadMessage } = await import("@/orchestration/zuke-spec-api.server");
        return handlePostThreadMessage(params.projectId, params.threadId, request);
      },
      DELETE: async ({ params, request }) => {
        const { handleDeleteThread } = await import("@/orchestration/zuke-spec-api.server");
        return handleDeleteThread(params.projectId, params.threadId, request);
      },
    },
  },
});
