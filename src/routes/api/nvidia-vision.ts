import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/nvidia-vision")({
  server: {
    handlers: {
      GET: async () => {
        const { getNvidiaVisionStatus } = await import("@/lib/nvidia-vision.server");
        return Response.json(getNvidiaVisionStatus());
      },
      POST: async ({ request }) => {
        const { handleNvidiaVisionRequest } = await import("@/lib/nvidia-vision.server");
        return handleNvidiaVisionRequest(request);
      },
    },
  },
});
