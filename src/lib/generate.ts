import { sanitizeWorkflow, workflowInstruction } from "@/lib/archviz-workflows";
import { createServerFn } from "@tanstack/react-start";
import { PLATE_COST } from "@/lib/credits";
import { TEMPLATES } from "@/lib/catalog";
import { STUDIES } from "@/lib/studies";
import { assembleBrief, sanitizeDesign, type DesignState } from "@/lib/properties";
import { sanitizeFrame, type Frame } from "@/lib/frame";

type Input = {
  idea: string;
  workflow: ReturnType<typeof sanitizeWorkflow>;
  image?: string;
  templateId?: string;
  studyId?: string;
  design: DesignState;
  frame: Frame;
};

function parseInput(input: unknown): Input {
  const data = input as {
    idea?: unknown;
    workflow?: unknown;
    image?: unknown;
    templateId?: unknown;
    studyId?: unknown;
    design?: Partial<DesignState>;
    frame?: Partial<Frame>;
  };
  const idea = typeof data.idea === "string" ? data.idea.trim().slice(0, 800) : "";
  const image = typeof data.image === "string" && data.image.startsWith("data:image/") ? data.image : undefined;
  if (image && image.length > 2_500_000) throw new Error("That image is too large. Try a smaller photo.");
  const templateId = typeof data.templateId === "string" ? data.templateId.slice(0, 80) : undefined;
  const studyId = typeof data.studyId === "string" ? data.studyId.slice(0, 80) : undefined;
  return { idea, workflow: sanitizeWorkflow(data.workflow), image, templateId, studyId, design: sanitizeDesign(data.design), frame: sanitizeFrame(data.frame) };
}

function libraryPrompt(data: Input): string | undefined {
  if (data.studyId) return STUDIES.find((item) => item.id === data.studyId)?.prompt;
  if (data.templateId) return TEMPLATES.find((item) => item.id === data.templateId)?.prompt;
  return undefined;
}

export const generatePlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const key = process.env.XAI_API_KEY;
    if (!key) throw new Error("Image generation is not configured.");
    const { charge, refund } = await import("@/lib/credits.server");
    const wallet = await charge(PLATE_COST, data.image ? "edit" : "plate");
    try {
      const { dictionaryBrief } = await import("@/lib/blocks.server");
      const prompt = [assembleBrief(data.design, data.idea, libraryPrompt(data)), workflowInstruction(data.workflow, Boolean(data.image)), dictionaryBrief(data.design.vertical, data.design.advanced)]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, 8000);
      const endpoint = data.image ? "https://api.x.ai/v1/images/edits" : "https://api.x.ai/v1/images/generations";
      const body = data.image
        ? { model: "grok-imagine-image", prompt, image: { url: data.image, type: "image_url" }, aspect_ratio: data.frame.ratio, resolution: data.frame.resolution }
        : { model: "grok-imagine-image", prompt, aspect_ratio: data.frame.ratio, resolution: data.frame.resolution };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail.replace(/sk-[a-zA-Z0-9_-]+/g, "").slice(0, 180) || "Generation failed.");
      }
      const json = (await response.json()) as { data?: { url?: string }[] };
      const url = json.data?.[0]?.url;
      if (!url) throw new Error("No image came back.");
      return { url, cost: PLATE_COST, credits: wallet.credits, frame: data.frame };
    } catch (error) {
      await refund(PLATE_COST, "plate-refund").catch(() => undefined);
      throw error instanceof Error ? error : new Error("Generation failed.");
    }
  });

function designFacts(design: DesignState, idea: string): string {
  const picks = Object.entries(design.picks)
    .filter(([, value]) => value && value !== "Unchanged" && value !== "None" && value !== "Keep")
    .slice(0, 6)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
  return [
    `Space: ${design.vertical}`,
    `Look: ${design.look}`,
    `Range: ${design.range}`,
    `Light: ${design.light}`,
    `Time: ${design.time}`,
    `Camera: ${design.camera}`,
    `Mood: ${design.mood}`,
    `Color: ${design.color}`,
    picks ? `Materials: ${picks}` : "",
    idea ? `Request: ${idea}` : "Request: redesign the space while keeping the camera and layout.",
  ]
    .filter(Boolean)
    .join("\n");
}

function fallbackIdea(design: DesignState, idea: string): string {
  const picks = Object.entries(design.picks)
    .filter(([, value]) => value && value !== "Unchanged" && value !== "None" && value !== "Keep")
    .slice(0, 3)
    .map(([, value]) => value)
    .join(", ");
  const lead = idea.trim().replace(/[. ]+$/, "");
  const tail = `${design.look} ${design.vertical}, ${design.light.toLowerCase()} light${picks ? `, ${picks}` : ""}`;
  return (lead ? `${lead}. Hold the layout. Finish it as ${tail}.` : `Redesign this ${design.vertical} as ${tail}. Hold the camera.`).slice(0, 400);
}

export const enhanceIdea = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { idea?: unknown; design?: Partial<DesignState> };
    const idea = typeof data.idea === "string" ? data.idea.trim().slice(0, 800) : "";
    return { idea, design: sanitizeDesign(data.design) };
  })
  .handler(async ({ data }) => {
    const fallback = fallbackIdea(data.design, data.idea);
    const key = process.env.XAI_API_KEY;
    if (!key) return { idea: fallback };
    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "grok-3-mini",
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content:
                "Rewrite this architectural visualization request as one sentence a designer would type. Name the space, the materials, and the light. Keep the camera and layout. No labels, no bullet list, under 40 words.",
            },
            { role: "user", content: designFacts(data.design, data.idea) },
          ],
        }),
      });
      if (!response.ok) return { idea: fallback };
      const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      const text = json.choices?.[0]?.message?.content?.replace(/\s+/g, " ").trim();
      if (!text) return { idea: fallback };
      return { idea: text.slice(0, 400) };
    } catch {
      return { idea: fallback };
    }
  });
