import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/projects/$projectId/memory")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { handleGetProjectMemory } = await import("@/orchestration/zuke-spec-api.server");
        return handleGetProjectMemory(params.projectId, request);
      },
      POST: async ({ params, request }) => {
        const { handlePostProjectMemory } = await import("@/orchestration/zuke-spec-api.server");
        return handlePostProjectMemory(params.projectId, request);
      },
    },
  },
});
