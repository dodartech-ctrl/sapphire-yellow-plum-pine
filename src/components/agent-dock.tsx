import { useEffect, useState } from "react";
import { runAgentStep } from "@/lib/agent";
import { STUDIO_TOOL_NAMES, callStudioTool, webmcpAvailable } from "@/lib/webmcp";
import { cn } from "@/lib/utils";

type Step = { name: string; summary: string; ok: boolean };
type HistoryItem = { role: "assistant" | "tool"; content: string; toolCallId?: string; toolCalls?: { id: string; name: string; arguments: string }[] };

export function AgentDock() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    setReady(webmcpAvailable());
  }, []);

  async function run() {
    const message = instruction.trim();
    if (!message || busy) return;
    setBusy(true);
    setSteps([]);
    setReply("");
    const history: HistoryItem[] = [];
    const seen: Step[] = [];
    try {
      const state = (await callStudioTool("read_studio")).summary;
      for (let round = 0; round < 3; round += 1) {
        const step = await runAgentStep({ data: { message, state, history } });
        if (!step.calls.length) {
          setReply(step.reply || "Done.");
          break;
        }
        history.push({ role: "assistant", content: step.reply, toolCalls: step.calls });
        for (const call of step.calls) {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(call.arguments) as Record<string, unknown>;
          } catch {
            args = {};
          }
          const result = await callStudioTool(call.name, args);
          seen.push({ name: call.name, summary: result.summary, ok: result.ok });
          setSteps([...seen]);
          history.push({ role: "tool", content: result.summary, toolCallId: call.id });
        }
        if (!step.usedModel) {
          setReply(step.reply);
          break;
        }
      }
      setReply((current) => current || "Done.");
    } catch (error) {
      setReply(error instanceof Error ? error.message : "The agent could not run.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 rounded-2xl border border-line bg-surface">
      <button type="button" onClick={() => setOpen((value) => !value)} className="hover-fold flex h-11 w-full items-center gap-2 px-3 text-left text-sm" aria-expanded={open}>
        <span className={cn("size-2 rounded-full", ready ? "bg-[#5f8a62]" : "bg-[#d4b06a]")} />
        <span className="font-medium">Agent</span>
        <span className="text-xs text-muted">{ready ? "WebMCP connected" : "WebMCP waiting on this browser"}</span>
      </button>
      {open ? (
        <div className="space-y-3 px-3 pb-3">
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void run();
            }}
          >
            <input
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              placeholder="Warm the light, 16:9, 2K"
              className="h-10 min-w-0 flex-1 rounded-full border border-line bg-white px-3 text-sm outline-none"
              aria-label="Instruction for the agent"
            />
            <button type="submit" disabled={busy || !instruction.trim()} className="gold-fill h-10 rounded-full px-4 text-sm disabled:opacity-50">
              {busy ? "Running" : "Run"}
            </button>
          </form>
          <ul className="flex flex-wrap gap-1.5">
            {STUDIO_TOOL_NAMES.map((name) => (
              <li key={name} className="rounded-full border border-line px-2 py-1 text-[11px] text-muted">
                {name}
              </li>
            ))}
          </ul>
          {steps.length > 0 ? (
            <ol className="space-y-1 text-xs">
              {steps.map((step, index) => (
                <li key={`${step.name}-${index}`} className={step.ok ? "text-fg" : "text-[#9a3b2f]"}>
                  {step.name}: {step.summary}
                </li>
              ))}
            </ol>
          ) : null}
          {reply ? <p className="text-sm text-fg">{reply}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
