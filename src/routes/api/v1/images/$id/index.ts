import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/images/$id/")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { handleGetImageEndpoint } = await import("@/orchestration/api-gateway.server");
        return handleGetImageEndpoint(params.id);
      },
    },
  },
});
