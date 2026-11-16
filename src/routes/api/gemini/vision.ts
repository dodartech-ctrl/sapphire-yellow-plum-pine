import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/gemini/vision")({
  server: {
    handlers: {
      GET: async () => {
        const { getGeminiStatus } = await import("@/lib/gemini.server");
        return Response.json(getGeminiStatus());
      },
      POST: async ({ request }) => {
        const { handleGeminiVisionRequest } = await import("@/lib/gemini.server");
        return handleGeminiVisionRequest(request);
      },
    },
  },
});
