import { sanitizeFrame, type Frame } from "@/lib/frame";
import { generatePlate } from "@/lib/generate";
import { useOriel } from "@/lib/store";

type ToolResult = { content: { type: "text"; text: string }[] };

type StudioTool = {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<ToolResult>;
};

type ModelContext = {
  registerTool: (tool: StudioTool, options?: { signal?: AbortSignal }) => Promise<unknown>;
};

function text(value: string): ToolResult {
  return { content: [{ type: "text", text: value }] };
}

function modelContext(): ModelContext | undefined {
  const host = globalThis as {
    document?: { modelContext?: ModelContext };
    navigator?: { modelContext?: ModelContext };
  };
  return host.document?.modelContext ?? host.navigator?.modelContext;
}

const VERTICALS = ["interior", "exterior", "amenities", "landscape"] as const;

function buildStudioTools(): StudioTool[] {
  return [
    {
      name: "read_studio",
      description: "Read the current Oriel prompt, frame, and whether a source and result exist.",
      annotations: { readOnlyHint: true },
      inputSchema: { type: "object", properties: {} },
      async execute() {
        const state = useOriel.getState();
        return text(
          JSON.stringify({
            idea: state.idea,
            frame: state.frame,
            vertical: state.design.vertical,
            hasSource: Boolean(state.upload),
            hasResult: Boolean(state.plate?.url),
            credits: state.credits,
          }),
        );
      },
    },
    {
      name: "set_prompt",
      description: "Replace the studio prompt the next plate will use.",
      inputSchema: {
        type: "object",
        properties: { idea: { type: "string", description: "The design change to make." } },
        required: ["idea"],
      },
      async execute(input) {
        const idea = typeof input.idea === "string" ? input.idea.trim().slice(0, 800) : "";
        if (!idea) return text("Prompt was empty.");
        useOriel.getState().setIdea(idea);
        return text(`Prompt set: ${idea}`);
      },
    },
    {
      name: "set_vertical",
      description: "Switch the studio vertical: interior, exterior, amenities or landscape.",
      inputSchema: {
        type: "object",
        properties: { vertical: { type: "string", enum: [...VERTICALS] } },
        required: ["vertical"],
      },
      async execute(input) {
        const vertical = VERTICALS.find((item) => item === input.vertical);
        if (!vertical) return text("Unknown vertical. Use interior, exterior, amenities or landscape.");
        useOriel.getState().setVertical(vertical);
        return text(`Vertical set to ${vertical}.`);
      },
    },
    {
      name: "set_resolution",
      description: "Set the plate aspect ratio and resolution. Preview and generation both use this frame.",
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
        return text(`Frame set to ${frame.ratio} at ${frame.resolution}.`);
      },
    },
    {
      name: "set_view",
      description: "Show source, result, or compare. Compare closes when the view is set back to source or result.",
      inputSchema: {
        type: "object",
        properties: { view: { type: "string", enum: ["source", "result", "compare"] } },
        required: ["view"],
      },
      async execute(input) {
        const view = input.view === "result" || input.view === "compare" ? input.view : "source";
        const state = useOriel.getState();
        if (view === "compare" && (!state.upload || !state.plate?.url)) return text("Compare needs a source and a result.");
        window.dispatchEvent(new CustomEvent("oriel-view", { detail: view }));
        return text(`View set to ${view}.`);
      },
    },
    {
      name: "generate_plate",
      description: "Generate a plate at the current resolution and prompt. Spends 50 credits.",
      inputSchema: { type: "object", properties: {} },
      async execute() {
        const state = useOriel.getState();
        if (state.busy) return text("A plate is already generating.");
        if (state.credits < 50) return text("Not enough credits.");
        state.setBusy(true);
        try {
          const result = await generatePlate({
            data: { idea: state.idea, image: state.upload ?? undefined, design: state.design, frame: state.frame },
          });
          state.setCredits(result.credits);
          state.setPlate({ url: result.url, upload: state.upload ?? undefined, templateId: state.design.vertical, idea: state.idea });
          window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
          return text(`Plate ready at ${result.frame.ratio} ${result.frame.resolution}. ${result.credits} credits left.`);
        } catch (error) {
          return text(error instanceof Error ? error.message : "Generation failed.");
        } finally {
          useOriel.getState().setBusy(false);
        }
      },
    },
  ];
}

export const STUDIO_TOOL_NAMES = buildStudioTools().map((tool) => tool.name);

/** True when the browser exposes a WebMCP model context the tools can be registered with. */
export function webmcpAvailable(): boolean {
  const mc = modelContext();
  return Boolean(mc && typeof mc.registerTool === "function");
}

/**
 * Run a studio tool directly in the page. The in-app agent uses this so it works
 * whether or not the browser has a WebMCP host attached.
 */
export async function callStudioTool(
  name: string,
  input: Record<string, unknown> = {},
): Promise<{ ok: boolean; summary: string }> {
  const tool = buildStudioTools().find((item) => item.name === name);
  if (!tool) return { ok: false, summary: `Unknown tool ${name}.` };
  try {
    const result = await tool.execute(input);
    return { ok: true, summary: result.content.map((part) => part.text).join(" ") };
  } catch (error) {
    return { ok: false, summary: error instanceof Error ? error.message : "Tool failed." };
  }
}

export function registerStudioTools(signal: AbortSignal) {
  const mc = modelContext();
  if (!mc || typeof mc.registerTool !== "function") return;
  const tools = buildStudioTools();
  for (const tool of tools) void Promise.resolve(mc.registerTool(tool, { signal })).catch(() => undefined);
}
