import type {
  GenerationMode,
  NanoBananaGenerateRequest,
  TaskIntent,
} from "@/schemas/nano-banana.schema";

export interface TaskClassification {
  intent: TaskIntent;
  generationMode: GenerationMode;
  requiresImage: boolean;
  complexity: "low" | "medium" | "high";
  referenceCount: number;
  hasMask: boolean;
  isMultiTurn: boolean;
  reasoning: string;
}

export function inferTaskIntentFromMode(mode: GenerationMode, explicitTask?: TaskIntent): TaskIntent {
  if (explicitTask) return explicitTask;
  switch (mode) {
    case "text_to_image":
      return "generate";
    case "render_enhancement":
      return "enhance";
    case "image_to_image":
    case "image_edit":
    case "multi_reference":
    case "iterative_editing":
    case "style_transfer":
      return "transform";
  }
}

export function classifyArchitecturalTask(request: NanoBananaGenerateRequest): TaskClassification {
  const referenceCount =
    request.references.length +
    (request.imageUrl && !request.references.some((r) => r.imageUrl === request.imageUrl) ? 1 : 0);
  const hasImage = referenceCount > 0;
  const hasMask = Boolean(request.maskImageUrl);
  const isMultiTurn = request.generationMode === "iterative_editing" || Boolean(request.sessionId);

  const intent = inferTaskIntentFromMode(request.generationMode, request.task);

  const requiresImage =
    intent === "transform" ||
    intent === "enhance" ||
    intent === "analyze" ||
    request.generationMode === "image_to_image" ||
    request.generationMode === "image_edit" ||
    request.generationMode === "multi_reference" ||
    request.generationMode === "style_transfer" ||
    request.generationMode === "render_enhancement";

  if (requiresImage && !hasImage && !isMultiTurn) {
    throw new Error(
      `Task "${intent}" (${request.generationMode}) requires a source or reference architectural image.`,
    );
  }

  let complexity: "low" | "medium" | "high" = "medium";
  if (
    request.generationMode === "multi_reference" ||
    referenceCount >= 2 ||
    hasMask ||
    isMultiTurn ||
    request.output.resolution === "4K" ||
    request.output.quality === "premium" ||
    request.output.quality === "ultra"
  ) {
    complexity = "high";
  } else if (
    request.generationMode === "text_to_image" &&
    (request.output.quality === "draft" || request.output.resolution === "512")
  ) {
    complexity = "low";
  }

  const reasoning = [
    `Classified as ${intent} (${request.generationMode})`,
    `complexity=${complexity}`,
    `references=${referenceCount}`,
    hasMask ? "masked-edit" : null,
    isMultiTurn ? "multi-turn-session" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    intent,
    generationMode: request.generationMode,
    requiresImage,
    complexity,
    referenceCount,
    hasMask,
    isMultiTurn,
    reasoning,
  };
}
