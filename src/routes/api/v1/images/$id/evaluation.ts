import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/images/$id/evaluation")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { handleGetEvaluationEndpoint } = await import("@/orchestration/api-gateway.server");
        return handleGetEvaluationEndpoint(params.id);
      },
    },
  },
});
