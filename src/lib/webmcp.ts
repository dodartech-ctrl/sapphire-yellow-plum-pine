import { PLATE_COST } from "@/lib/credits";
import { sanitizeFrame, type Frame } from "@/lib/frame";
import { generatePlate } from "@/lib/generate";
import { VERTICALS, type VerticalId } from "@/lib/properties";
import { useOriel } from "@/lib/store";

export type ToolResult = { ok: boolean; summary: string };

type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; consequentialHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<ToolResult>;
};

type ModelContext = {
  registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => Promise<unknown>;
};

const VERTICAL_IDS = VERTICALS.map((item) => item.id);

function studio(): ToolResult {
  const state = useOriel.getState();
  return {
    ok: true,
    summary: JSON.stringify({
      idea: state.idea,
      frame: state.frame,
      vertical: state.design.vertical,
      look: state.design.look,
      hasSource: Boolean(state.upload),
      hasResult: Boolean(state.plate?.url),
      credits: state.credits,
      busy: state.busy,
    }),
  };
}

const TOOLS: Tool[] = [
  {
    name: "read_studio",
    title: "Read studio",
    description: "Read the current Oriel prompt, frame, vertical, and whether a source and result exist.",
    annotations: { readOnlyHint: true },
    inputSchema: { type: "object", properties: {} },
    async execute() {
      return studio();
    },
  },
  {
    name: "set_prompt",
    title: "Set prompt",
    description: "Replace the studio prompt the next plate will use.",
    inputSchema: {
      type: "object",
      properties: { idea: { type: "string", description: "The design change to make." } },
      required: ["idea"],
    },
    async execute(input) {
      const idea = typeof input.idea === "string" ? input.idea.trim().slice(0, 800) : "";
      if (!idea) return { ok: false, summary: "Prompt was empty." };
      useOriel.getState().setIdea(idea);
      return { ok: true, summary: `Prompt set: ${idea}` };
    },
  },
  {
    name: "set_vertical",
    title: "Set vertical",
    description: "Switch the studio between interior, exterior, amenities, and landscape.",
    inputSchema: {
      type: "object",
      properties: { vertical: { type: "string", enum: VERTICAL_IDS } },
      required: ["vertical"],
    },
    async execute(input) {
      const vertical = typeof input.vertical === "string" ? input.vertical : "";
      if (!VERTICAL_IDS.includes(vertical as VerticalId)) return { ok: false, summary: "Unknown vertical." };
      useOriel.getState().setVertical(vertical as VerticalId);
      return { ok: true, summary: `Vertical set to ${vertical}.` };
    },
  },
  {
    name: "set_resolution",
    title: "Set resolution",
    description: "Set the plate aspect ratio and resolution. The preview and the generation both use this frame.",
    inputSchema: {
      type: "object",
      properties: {
        ratio: { type: "string", enum: ["16:9", "4:3", "3:2", "1:1", "9:16"] },
        resolution: { type: "string", enum: ["1k", "2k"] },
      },
      required: ["ratio", "resolution"],
    },
    async execute(input) {
      const frame = sanitizeFrame({ ratio: input.ratio as Frame["ratio"], resolution: input.resolution as Frame["resolution"] });
      useOriel.getState().setFrame(frame);
      return { ok: true, summary: `Frame set to ${frame.ratio} at ${frame.resolution}.` };
    },
  },
  {
    name: "set_view",
    title: "Set view",
    description: "Show source, result, or compare. Setting source or result closes the compare wipe.",
    inputSchema: {
      type: "object",
      properties: { view: { type: "string", enum: ["source", "result", "compare"] } },
      required: ["view"],
    },
    async execute(input) {
      const view = input.view === "result" || input.view === "compare" ? input.view : "source";
      const state = useOriel.getState();
      if (view === "compare" && (!state.upload || !state.plate?.url)) return { ok: false, summary: "Compare needs a source and a result." };
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: view }));
      return { ok: true, summary: `View set to ${view}.` };
    },
  },
  {
    name: "generate_plate",
    title: "Generate plate",
    description: `Generate a plate at the current resolution and prompt. Spends ${PLATE_COST} credits.`,
    annotations: { consequentialHint: true },
    inputSchema: { type: "object", properties: {} },
    async execute() {
      const state = useOriel.getState();
      if (state.busy) return { ok: false, summary: "A plate is already generating." };
      if (state.credits < PLATE_COST) return { ok: false, summary: "Not enough credits." };
      state.setBusy(true);
      state.setCredits(state.credits - PLATE_COST);
      try {
        const result = await generatePlate({
          data: { idea: state.idea, image: state.upload ?? undefined, design: state.design, frame: state.frame },
        });
        useOriel.getState().setCredits(result.credits);
        useOriel.getState().setPlate({ url: result.url, upload: state.upload ?? undefined, templateId: state.design.vertical, idea: state.idea });
        window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
        return { ok: true, summary: `Plate ready at ${result.frame.ratio} ${result.frame.resolution}. ${result.credits} credits left.` };
      } catch (error) {
        const latest = useOriel.getState();
        latest.setCredits(latest.credits + PLATE_COST);
        return { ok: false, summary: error instanceof Error ? error.message : "Generation failed." };
      } finally {
        useOriel.getState().setBusy(false);
      }
    },
  },
];

export const STUDIO_TOOL_NAMES = TOOLS.map((tool) => tool.name);

function hosts(): ModelContext[] {
  const root = globalThis as {
    document?: { modelContext?: ModelContext };
    navigator?: { modelContext?: ModelContext };
  };
  const found = [root.document?.modelContext, root.navigator?.modelContext].filter((item): item is ModelContext => Boolean(item?.registerTool));
  return [...new Set(found)];
}

export function webmcpAvailable(): boolean {
  return hosts().length > 0;
}

export async function callStudioTool(name: string, input: Record<string, unknown> = {}): Promise<ToolResult> {
  const tool = TOOLS.find((item) => item.name === name);
  if (!tool) return { ok: false, summary: `Unknown tool: ${name}` };
  return tool.execute(input);
}

export function registerStudioTools(signal: AbortSignal) {
  const contexts = hosts();
  if (!contexts.length || signal.aborted) return;
  for (const mc of contexts) {
    for (const tool of TOOLS) {
      void Promise.resolve(mc.registerTool(tool, { signal })).catch(() => undefined);
    }
  }
}
