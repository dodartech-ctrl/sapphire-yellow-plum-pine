/**
 * The Oriel user journey: six plain-language steps from "I have a space" to
 * "I can show a client". Status is derived from real studio state, so the
 * guide always points at the next useful action. Pure module (no imports) so it
 * can be unit-tested and reused by any surface.
 */

export type JourneyStepId = "start" | "define" | "describe" | "render" | "review" | "keep";
export type JourneyAction = "upload" | "properties" | "prompt" | "render" | "review" | "keep";
export type JourneyStatus = "done" | "current" | "upcoming";

export type JourneyInput = {
  hasSource: boolean;
  /** Properties, presets or dictionary blocks the user has actively chosen. */
  hasChosenLook: boolean;
  hasPrompt: boolean;
  hasPlate: boolean;
  hasVariationsOrCompared: boolean;
  hasSavedOrPublished: boolean;
};

export type JourneyStep = {
  id: JourneyStepId;
  number: number;
  title: string;
  /** One sentence: what this step is for. */
  purpose: string;
  /** One sentence: where to do it on screen. */
  where: string;
  action: JourneyAction;
  actionLabel: string;
  /** Skippable steps never block progress to the next one. */
  optional: boolean;
  status: JourneyStatus;
};

type StepDef = Omit<JourneyStep, "status" | "number">;

export const JOURNEY_STEPS: readonly StepDef[] = [
  {
    id: "start",
    title: "Bring your space",
    purpose: "Give Oriel something to work from: a photo, a sketch, or a simple 3D massing. No file yet? Start from the sample.",
    where: "Centre stage. Drop a file, paste with Ctrl+V, or use Sketch Pad / 3D Massing.",
    action: "upload",
    actionLabel: "Add a photo or sketch",
    optional: true,
  },
  {
    id: "define",
    title: "Choose what changes",
    purpose: "Pick the vertical (interior, exterior, amenities, landscape) and the materials, light and mood you want.",
    where: "Right panel. Presets for one-tap looks, Scene & Optics for fine control.",
    action: "properties",
    actionLabel: "Pick materials & mood",
    optional: false,
  },
  {
    id: "describe",
    title: "Say it in a sentence",
    purpose: "Add what the pickers cannot say, in plain words. Your picks are added to the prompt for you.",
    where: "Prompt bar at the bottom of the stage.",
    action: "prompt",
    actionLabel: "Write your direction",
    optional: false,
  },
  {
    id: "render",
    title: "Render",
    purpose: "Oriel keeps your structure and camera and applies your changes. Each render costs credits; failed ones are refunded.",
    where: "Render Plate button, bottom right of the prompt bar.",
    action: "render",
    actionLabel: "Render plate",
    optional: false,
  },
  {
    id: "review",
    title: "Compare and refine",
    purpose: "Check the result against your source, try 4 variations, then tweak one thing at a time.",
    where: "Compare and 4-Up in the prompt bar; Inpaint on the image for local edits.",
    action: "review",
    actionLabel: "Compare with source",
    optional: true,
  },
  {
    id: "keep",
    title: "Save and share",
    purpose: "Save the setup as a project, export a client PDF, or publish the before/after to the gallery.",
    where: "Projects page, Brief Builder (Export PDF, Share & Review), or the share button, top right.",
    action: "keep",
    actionLabel: "Save as a project",
    optional: true,
  },
];

function isDone(id: JourneyStepId, input: JourneyInput): boolean {
  switch (id) {
    case "start":
      return input.hasSource;
    case "define":
      return input.hasChosenLook;
    case "describe":
      return input.hasPrompt;
    case "render":
      return input.hasPlate;
    case "review":
      return input.hasVariationsOrCompared;
    case "keep":
      return input.hasSavedOrPublished;
  }
}

/**
 * Status per step. A user who has done nothing yet is pointed at step 1. After
 * that "current" is the first required step not yet done; once every required
 * step is done it moves on to the optional review / keep steps. The optional
 * "Bring your space" step never blocks anyone who skips it.
 */
export function journeyProgress(input: JourneyInput): JourneyStep[] {
  const raw = JOURNEY_STEPS.map((step) => isDone(step.id, input));
  // A required step is implicitly done once a later required step is done (a user
  // can render straight from the defaults); optional steps only count when really done.
  const lastRequiredDone = JOURNEY_STEPS.reduce((last, step, index) => (!step.optional && raw[index] ? index : last), -1);
  const done = raw.map((value, index) => value || (!JOURNEY_STEPS[index].optional && index < lastRequiredDone));
  const untouched = !input.hasSource && !input.hasChosenLook && !input.hasPrompt && !input.hasPlate;
  let current = -1;
  if (untouched) {
    current = 0;
  } else {
    current = JOURNEY_STEPS.findIndex((step, index) => !step.optional && !done[index]);
    if (current === -1) current = JOURNEY_STEPS.findIndex((step, index) => index > 0 && !done[index]);
  }
  return JOURNEY_STEPS.map((step, index) => ({
    ...step,
    number: index + 1,
    status: done[index] ? "done" : index === current ? "current" : "upcoming",
  }));
}

export function currentJourneyStep(steps: readonly JourneyStep[]): JourneyStep | null {
  return steps.find((step) => step.status === "current") ?? null;
}

/** Plain-English names for the five named studios shown in the top bar. */
export const STUDIO_PLAIN: Record<string, { name: string; plain: string }> = {
  "mas-2d": { name: "MAS 2D", plain: "Edit or compose a photo: repaint, replace, extend and mask regions." },
  "sam-3d": { name: "SAM 3D", plain: "Block out a space in simple 3D and watch the AI version update beside it." },
  "king-360": { name: "KING 360", plain: "Grade 360° panoramas and build a virtual tour." },
  "kum-video": { name: "KUM Video", plain: "Turn plates into a storyboard and an MP4 walkthrough." },
  "node-studio": { name: "Node", plain: "Wire your own repeatable pipeline from steps. For power users." },
};
