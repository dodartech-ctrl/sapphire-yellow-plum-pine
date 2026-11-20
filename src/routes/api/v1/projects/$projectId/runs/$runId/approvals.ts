import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/projects/$projectId/runs/$runId/approvals")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { handleGetRunApprovals } = await import("@/orchestration/zuke-spec-api.server");
        return handleGetRunApprovals(params.projectId, params.runId);
      },
      POST: async ({ params, request }) => {
        const { handlePostRunApproval } = await import("@/orchestration/zuke-spec-api.server");
        return handlePostRunApproval(params.projectId, params.runId, request);
      },
    },
  },
});
