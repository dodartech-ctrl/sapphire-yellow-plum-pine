import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/images/generate")({
  server: {
    handlers: {
      GET: async () => {
        const { handleEngineStatus } = await import("@/orchestration/api-gateway.server");
        return handleEngineStatus();
      },
      POST: async ({ request }) => {
        const { handleGenerateEndpoint } = await import("@/orchestration/api-gateway.server");
        return handleGenerateEndpoint(request);
      },
    },
  },
});
