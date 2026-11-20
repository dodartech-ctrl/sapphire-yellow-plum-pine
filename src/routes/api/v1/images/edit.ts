import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/images/edit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleEditEndpoint } = await import("@/orchestration/api-gateway.server");
        return handleEditEndpoint(request);
      },
    },
  },
});
