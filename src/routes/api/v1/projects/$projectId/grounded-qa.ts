import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/projects/$projectId/grounded-qa")({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        const { handleGroundedQa } = await import("@/orchestration/zuke-spec-api.server");
        return handleGroundedQa(params.projectId, request);
      },
    },
  },
});
