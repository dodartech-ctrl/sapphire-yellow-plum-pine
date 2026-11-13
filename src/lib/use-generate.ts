import type { Workflow } from "@/lib/archviz-workflows";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { TEMPLATES } from "@/lib/catalog";
import { PLATE_COST, getStudioCredits } from "@/lib/credits";
import { generatePlate } from "@/lib/generate";
import { useOriel } from "@/lib/store";

export function useGenerate() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const setPlate = useOriel((state) => state.setPlate);
  const upload = useOriel((state) => state.upload);
  const touchRecent = useOriel((state) => state.touchRecent);
  const activeKey = useOriel((state) => state.activeKey);
  const design = useOriel((state) => state.design);
  const idea = useOriel((state) => state.idea);
  const frame = useOriel((state) => state.frame);
  const credits = useOriel((state) => state.credits);
  const setCredits = useOriel((state) => state.setCredits);
  const busy = useOriel((state) => state.busy);
  const setBusy = useOriel((state) => state.setBusy);
  const pushChat = useOriel((state) => state.pushChat);

  async function generate(mode: "plate" | "variation" = "plate", workflow: Workflow = "concept") {
    if (busy) return;
    if (credits < PLATE_COST) {
      toast.error("Not enough credits.");
      return;
    }
    const studyId = activeKey.startsWith("study:") ? activeKey.slice(6) : undefined;
    const templateId = activeKey.startsWith("template:")
      ? activeKey.slice(9)
      : studyId
        ? undefined
        : (TEMPLATES.find((item) => item.scope === design.vertical) ?? TEMPLATES[0])?.id;
    const sourceId = studyId ?? templateId ?? design.vertical;
    const note =
      mode === "variation"
        ? `${idea} Offer one distinct alternative. Keep the same brief.`.trim()
        : idea;
    setBusy(true);
    setCredits(credits - PLATE_COST);
    pushChat("you", note || `${design.vertical} plate`);
    try {
      const result = await generatePlate({
        data: { templateId, studyId, workflow, idea: note, image: upload ?? undefined, design, frame },
      });
      setCredits(result.credits);
      setPlate({ url: result.url, upload: upload ?? undefined, templateId: sourceId, idea: idea.trim() });
      touchRecent(sourceId);
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
      pushChat("studio", mode === "variation" ? `Variation is on the strip. ${result.credits.toLocaleString()} credits left.` : `Plate is ready. ${result.credits.toLocaleString()} credits left.`);
      if (pathname !== "/") void navigate({ to: "/" });
    } catch (error) {
      const wallet = await getStudioCredits().catch(() => null);
      setCredits(wallet?.credits ?? credits);
      toast.error(error instanceof Error ? error.message : "Generation failed.");
      pushChat("studio", "That plate did not come back. The credits were returned.");
    } finally {
      setBusy(false);
    }
  }

  return { busy, generate };
}
