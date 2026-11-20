import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/images/sessions/$id/continue")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const { handleContinueSessionEndpoint } = await import("@/orchestration/api-gateway.server");
        return handleContinueSessionEndpoint(request, params.id);
      },
    },
  },
});
