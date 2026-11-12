import { createServerFn } from "@tanstack/react-start";
import { AGENT_TOOLS, allowedCall, planLocally, type AgentCall } from "@/lib/agent-tools";

type HistoryItem = {
  role: "assistant" | "tool";
  content: string;
  toolCallId?: string;
  toolCalls?: { id: string; name: string; arguments: string }[];
};

type Step = { reply: string; calls: { id: string; name: string; arguments: string }[]; usedModel: boolean };

function wire(calls: AgentCall[]): Step["calls"] {
  return calls.map((call) => ({ id: call.id, name: call.name, arguments: JSON.stringify(call.arguments) }));
}

function parseHistory(input: unknown): HistoryItem[] {
  if (!Array.isArray(input)) return [];
  const items: HistoryItem[] = [];
  for (const item of input.slice(0, 12)) {
    const row = item as Partial<HistoryItem>;
    const content = typeof row.content === "string" ? row.content.slice(0, 800) : "";
    if (row.role === "tool") {
      items.push({ role: "tool", content, toolCallId: typeof row.toolCallId === "string" ? row.toolCallId.slice(0, 40) : "call_0" });
      continue;
    }
    if (row.role !== "assistant" || !Array.isArray(row.toolCalls)) continue;
    const toolCalls: HistoryItem["toolCalls"] = [];
    for (const [index, call] of row.toolCalls.entries()) {
      const raw = call as { id?: unknown; name?: unknown; arguments?: unknown };
      let args: unknown = {};
      if (typeof raw.arguments === "string") {
        try {
          args = JSON.parse(raw.arguments);
        } catch {
          args = {};
        }
      }
      const next = allowedCall(String(raw.name ?? ""), args, index);
      if (next) toolCalls.push({ id: typeof raw.id === "string" ? raw.id.slice(0, 40) : next.id, name: next.name, arguments: JSON.stringify(next.arguments) });
    }
    items.push({ role: "assistant", content, toolCalls });
  }
  return items;
}

export const runAgentStep = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { message?: unknown; state?: unknown; history?: unknown };
    return {
      message: typeof data.message === "string" ? data.message.trim().slice(0, 800) : "",
      state: typeof data.state === "string" ? data.state.slice(0, 1200) : "",
      history: parseHistory(data.history),
    };
  })
  .handler(async ({ data }): Promise<Step> => {
    const fallback = (): Step => ({
      reply: data.history.length ? "Applied on the studio." : "Applied from the instruction.",
      calls: data.history.length ? [] : wire(planLocally(data.message)),
      usedModel: false,
    });
    const key = process.env.XAI_API_KEY;
    if (!key || !data.message) return fallback();
    const messages: Record<string, unknown>[] = [
      {
        role: "system",
        content:
          "You operate Oriel, an architectural visualization studio. Call the studio tools to do what the user asked. Do not invent a plate. Call generate_plate only when the user asked to generate or render. After tools return, answer in one short sentence.",
      },
      { role: "user", content: `Studio now: ${data.state || "unread"}\n\nInstruction: ${data.message}` },
    ];
    for (const item of data.history) {
      if (item.role === "assistant") {
        messages.push({
          role: "assistant",
          content: item.content || null,
          tool_calls: (item.toolCalls ?? []).map((call) => ({
            id: call.id,
            type: "function",
            function: { name: call.name, arguments: call.arguments },
          })),
        });
      } else {
        messages.push({ role: "tool", tool_call_id: item.toolCallId, content: item.content });
      }
    }
    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(15000),
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "grok-3-mini",
          temperature: 0,
          messages,
          tools: AGENT_TOOLS.map((tool) => ({ type: "function", function: { name: tool.name, description: tool.description, parameters: tool.parameters } })),
          tool_choice: "auto",
        }),
      });
      if (!response.ok) return fallback();
      const json = (await response.json()) as {
        choices?: { message?: { content?: string | null; tool_calls?: { id?: string; function?: { name?: string; arguments?: string } }[] } }[];
      };
      const message = json.choices?.[0]?.message;
      const calls = (message?.tool_calls ?? []).flatMap((call, index) => {
        let args: unknown = {};
        try {
          args = call.function?.arguments ? JSON.parse(call.function.arguments) : {};
        } catch {
          args = {};
        }
        const next = allowedCall(call.function?.name ?? "", args, index);
        return next ? [{ id: call.id?.slice(0, 40) || next.id, name: next.name, arguments: JSON.stringify(next.arguments) }] : [];
      });
      const reply = typeof message?.content === "string" ? message.content.replace(/\s+/g, " ").trim().slice(0, 400) : "";
      if (!calls.length && !reply) return fallback();
      return { reply, calls, usedModel: true };
    } catch {
      return fallback();
    }
  });
