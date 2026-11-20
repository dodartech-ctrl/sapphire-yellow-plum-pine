import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/projects/$projectId/brief")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { handleGetProjectBrief } = await import("@/orchestration/zuke-spec-api.server");
        return handleGetProjectBrief(params.projectId);
      },
      PATCH: async ({ params, request }) => {
        const { handlePatchProjectBrief } = await import("@/orchestration/zuke-spec-api.server");
        return handlePatchProjectBrief(params.projectId, request);
      },
    },
  },
});
