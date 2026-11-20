import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/images/$id/versions")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { handleGetVersionsEndpoint } = await import("@/orchestration/api-gateway.server");
        return handleGetVersionsEndpoint(params.id);
      },
    },
  },
});
