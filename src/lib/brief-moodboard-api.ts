import { createServerFn } from "@tanstack/react-start";
import type { MoodboardGenerationResult, MoodboardQuerySpec } from "@/lib/brief-moodboard";

export const generateMoodboardFn = createServerFn({ method: "POST" })
  .validator((data: { queries: MoodboardQuerySpec[] }) => data)
  .handler(async ({ data }): Promise<MoodboardGenerationResult> => {
    const { fetchAutomatedMoodboardFromPublicApi } = await import("@/lib/brief-moodboard.server");
    return fetchAutomatedMoodboardFromPublicApi(data.queries);
  });
