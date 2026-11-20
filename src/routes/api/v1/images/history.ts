import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/images/history")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { handleHistoryEndpoint } = await import("@/orchestration/api-gateway.server");
        return handleHistoryEndpoint(request);
      },
    },
  },
});
