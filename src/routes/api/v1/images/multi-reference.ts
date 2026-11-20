import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/images/multi-reference")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleMultiReferenceEndpoint } = await import("@/orchestration/api-gateway.server");
        return handleMultiReferenceEndpoint(request);
      },
    },
  },
});
