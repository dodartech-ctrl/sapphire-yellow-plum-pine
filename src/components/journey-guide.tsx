import { Check, ChevronDown, ChevronUp, CircleHelp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { currentJourneyStep, journeyProgress, STUDIO_PLAIN, type JourneyAction } from "@/lib/journey";
import { NAMED_STUDIOS } from "@/lib/prd-studio-data";
import { DEFAULT_DESIGN } from "@/lib/properties";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "oriel-journey-collapsed";

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    window.localStorage.setItem(COLLAPSE_KEY, value ? "1" : "0");
  } catch {
    /* storage unavailable: the guide still works for this visit */
  }
}

/**
 * "Your path": a six-step guide that always shows where the user is, what the
 * next step is for, where on screen to do it, and a one-click action. It only
 * reads studio state; nothing in the studio is removed or hidden by it.
 */
export function JourneyGuide({
  compared,
  onAction,
  onSample,
}: {
  compared: boolean;
  onAction: (action: JourneyAction) => void;
  onSample: () => void;
}) {
  const upload = useOriel((s) => s.upload);
  const sketch = useOriel((s) => s.sketchDataUrl);
  const design = useOriel((s) => s.design);
  const blocks = useOriel((s) => s.dictionaryBlocks);
  const idea = useOriel((s) => s.idea);
  const plate = useOriel((s) => s.plate);
  const variations = useOriel((s) => s.variations);
  const projects = useOriel((s) => s.projects);
  const published = useOriel((s) => s.publishedGallery);

  // Start expanded on the server render and first paint; apply the saved choice after mount.
  const [collapsed, setCollapsed] = useState(false);
  const [showHow, setShowHow] = useState(false);
  useEffect(() => setCollapsed(readCollapsed()), []);

  const steps = useMemo(
    () =>
      journeyProgress({
        hasSource: Boolean(upload || sketch),
        hasChosenLook:
          blocks.length > 0 ||
          design.vertical !== DEFAULT_DESIGN.vertical ||
          JSON.stringify(design.picks) !== JSON.stringify(DEFAULT_DESIGN.picks) ||
          design.tags.length !== DEFAULT_DESIGN.tags.length,
        hasPrompt: idea.trim().length > 0,
        hasPlate: Boolean(plate?.url),
        hasVariationsOrCompared: variations.length > 0 || compared,
        hasSavedOrPublished: projects.length > 0 || published.length > 0,
      }),
    [upload, sketch, design, blocks, idea, plate?.url, variations.length, compared, projects.length, published.length],
  );
  const current = currentJourneyStep(steps);
  const doneCount = steps.filter((step) => step.status === "done").length;

  function toggle() {
    setCollapsed((value) => {
      writeCollapsed(!value);
      return !value;
    });
  }

  return (
    <section
      aria-label="Your path through Oriel"
      data-testid="journey-guide"
      className="shrink-0 rounded-2xl border border-[#d1c5b8]/45 bg-[#efeeea]/85 px-3 py-2 text-[#1b1c1a] dark:border-[#a9bdc9]/20 dark:bg-[#121c29]/90 dark:text-[#e8eff3]"
    >
      <div className="flex items-center gap-2">
        <ol className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((step) => (
            <li key={step.id} className="flex shrink-0 items-center gap-1">
              <span
                aria-current={step.status === "current" ? "step" : undefined}
                title={step.purpose}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold",
                  step.status === "current" && "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]",
                  step.status === "done" && "text-[#4d463c] dark:text-[#a9bdc9]",
                  step.status === "upcoming" && "text-[#7f766a] dark:text-[#8197a6]",
                )}
              >
                {step.status === "done" ? (
                  <Check className="size-3.5 text-[#5f8a62]" aria-label="done" />
                ) : (
                  <span className="grid size-4 place-items-center rounded-full border border-current text-[9px]">{step.number}</span>
                )}
                <span className={cn(step.status !== "current" && "hidden md:inline")}>{step.title}</span>
              </span>
            </li>
          ))}
        </ol>
        <span className="hidden shrink-0 text-[11px] text-[#7f766a] sm:inline dark:text-[#8197a6]">{doneCount}/{steps.length}</span>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Show guide" : "Hide guide"}
          className="grid size-7 shrink-0 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        >
          {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </button>
      </div>

      {!collapsed ? (
        <div className="mt-2 border-t border-[#d1c5b8]/40 pt-2 dark:border-[#a9bdc9]/15">
          {current ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="min-w-0 flex-1 basis-64">
                <p className="text-xs font-semibold">
                  Step {current.number}: {current.title}
                  {current.optional ? <span className="ml-1.5 font-normal text-[#7f766a] dark:text-[#8197a6]">(optional)</span> : null}
                </p>
                <p className="mt-0.5 text-xs text-[#4d463c] dark:text-[#a9bdc9]">{current.purpose}</p>
                <p className="mt-0.5 text-[11px] text-[#7f766a] dark:text-[#8197a6]">Where: {current.where}</p>
              </div>
              <button
                type="button"
                data-testid="journey-primary-action"
                onClick={() => onAction(current.action)}
                className="inline-flex h-9 shrink-0 items-center rounded-full bg-[#c5a880] px-4 text-xs font-semibold text-[#281800] hover:bg-[#b8976b] dark:bg-[#cfe3f0] dark:text-[#08131f]"
              >
                {current.actionLabel}
              </button>
              {current.id === "start" ? (
                <button
                  type="button"
                  data-testid="journey-sample-action"
                  onClick={onSample}
                  className="inline-flex h-9 shrink-0 items-center rounded-full border border-[#725b38]/50 px-4 text-xs font-semibold text-[#725b38] hover:bg-black/5 dark:border-[#cfe3f0]/40 dark:text-[#cfe3f0] dark:hover:bg-white/10"
                >
                  Try a sample project
                </button>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-[#4d463c] dark:text-[#a9bdc9]">
              You have been through the whole path. Change one thing at a time and render again, or start a new project from Projects.
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowHow((value) => !value)}
            aria-expanded={showHow}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#725b38] hover:underline dark:text-[#e8c98a]"
          >
            <CircleHelp className="size-3.5" /> {showHow ? "Hide" : "How Oriel works and what the top-bar studios are"}
          </button>
          {showHow ? (
            <div className="mt-2 grid gap-3 text-xs md:grid-cols-2">
              <ol className="space-y-1.5">
                {steps.map((step) => (
                  <li key={step.id}>
                    <span className="font-semibold">
                      {step.number}. {step.title}
                    </span>
                    <span className="text-[#4d463c] dark:text-[#a9bdc9]"> {step.purpose}</span>
                  </li>
                ))}
              </ol>
              <div>
                <p className="font-semibold">The studios in the top bar</p>
                <p className="mt-0.5 text-[#4d463c] dark:text-[#a9bdc9]">
                  Same project, different tools. Start with SAM 3D or MAS 2D; the rest are for later.
                </p>
                <ul className="mt-1.5 space-y-1">
                  {NAMED_STUDIOS.map((studio) => (
                    <li key={studio.id}>
                      <span className="font-semibold">{STUDIO_PLAIN[studio.id]?.name ?? studio.shortLabel}</span>
                      <span className="text-[#4d463c] dark:text-[#a9bdc9]"> {STUDIO_PLAIN[studio.id]?.plain ?? studio.subtitle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
