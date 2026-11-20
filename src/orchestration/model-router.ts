import type {
  NanoBananaGenerateRequest,
  NanoBananaModelKey,
  OutputAspectRatio,
  OutputResolution,
} from "@/schemas/nano-banana.schema";
import { NANO_BANANA_MODELS, NanoBananaProviderAdapter } from "@/providers/nano-banana.adapter";
import type { TaskClassification } from "@/orchestration/classifier";

export const MODEL_FALLBACK_ORDER: readonly NanoBananaModelKey[] = [
  "nano_banana_2_1",
  "nano_banana_2",
  "nano_banana_2_lite",
] as const;

export interface ModelRoutingDecision {
  primaryModelKey: NanoBananaModelKey;
  providerModelId: string;
  displayName: string;
  routingRule: string;
  reason: string;
  fallbackChain: NanoBananaModelKey[];
  normalizedResolution: OutputResolution;
  normalizedAspectRatio: OutputAspectRatio;
  capabilityWarnings: string[];
}

export function selectNanoBananaModel(
  request: NanoBananaGenerateRequest,
  classification: TaskClassification,
  adapter: NanoBananaProviderAdapter = new NanoBananaProviderAdapter(),
): ModelRoutingDecision {
  let chosen: NanoBananaModelKey;
  let routingRule: string;
  let reason: string;

  if (request.requestedModel !== "auto") {
    chosen = request.requestedModel;
    routingRule = "explicit_user_selection";
    reason = `User explicitly selected ${NANO_BANANA_MODELS[chosen].displayName}.`;
  } else if (
    request.output.quality === "premium" ||
    request.output.quality === "ultra" ||
    request.output.resolution === "4K" ||
    request.output.renderText
  ) {
    chosen = "nano_banana_pro";
    routingRule = "final_premium_render_or_high_resolution_or_text_rendering";
    reason = "Routed to Nano Banana Pro for premium/4K/typography architectural presentation fidelity.";
  } else if (
    classification.generationMode === "multi_reference" ||
    classification.generationMode === "iterative_editing" ||
    classification.referenceCount >= 2 ||
    classification.hasMask
  ) {
    chosen = "nano_banana_2_1";
    routingRule = "multi_reference_or_iterative_editing";
    reason = "Routed to Nano Banana 2.1 for multi-reference synthesis and consistent iterative editing.";
  } else if (
    classification.complexity === "low" ||
    request.output.quality === "draft" ||
    request.output.resolution === "512"
  ) {
    chosen = "nano_banana_2_lite";
    routingRule = "fast_draft_concept";
    reason = "Routed to Nano Banana 2 Lite for rapid low-latency architectural concept exploration.";
  } else if (
    classification.generationMode === "text_to_image" ||
    classification.generationMode === "style_transfer"
  ) {
    chosen = "nano_banana_2";
    routingRule = "standard_production_generation";
    reason = "Routed to Nano Banana 2 for balanced production speed and high visual fidelity.";
  } else {
    chosen = "nano_banana_2_1";
    routingRule = "default_primary_architecture_engine";
    reason = "Routed to primary Nano Banana 2.1 architectural visualization engine.";
  }

  // Validate capabilities; if user picked a Lite model for multi-reference or 4K, upgrade safely or record warning
  let capCheck = adapter.validateModelCapabilities({
    modelKey: chosen,
    mode: classification.generationMode,
    resolution: request.output.resolution,
    aspectRatio: request.output.aspectRatio,
    referenceCount: classification.referenceCount,
  });

  const capabilityWarnings: string[] = [...capCheck.reasons];

  if (!capCheck.valid && request.requestedModel === "auto") {
    chosen = "nano_banana_2_1";
    routingRule = "capability_upgrade_to_primary";
    reason = `Upgraded to Nano Banana 2.1 to satisfy capability requirements (${capCheck.reasons.join("; ")}).`;
    capCheck = adapter.validateModelCapabilities({
      modelKey: chosen,
      mode: classification.generationMode,
      resolution: request.output.resolution,
      aspectRatio: request.output.aspectRatio,
      referenceCount: classification.referenceCount,
    });
  }

  // Build fallback chain obeying spec order while NEVER silently downgrading to a model that cannot support the task
  const rawFallbacks: NanoBananaModelKey[] =
    chosen === "nano_banana_pro"
      ? ["nano_banana_2_1", "nano_banana_2"]
      : MODEL_FALLBACK_ORDER.filter((key) => key !== chosen);

  const validFallbacks = rawFallbacks.filter((candidate) => {
    // Policy: never silently downgrade premium/4K/multi-reference to Lite
    if (
      candidate === "nano_banana_2_lite" &&
      (request.output.quality === "premium" ||
        request.output.resolution === "4K" ||
        classification.referenceCount > 3 ||
        classification.generationMode === "multi_reference" ||
        classification.generationMode === "iterative_editing")
    ) {
      return false;
    }
    const candidateCap = adapter.validateModelCapabilities({
      modelKey: candidate,
      mode: classification.generationMode,
      resolution: capCheck.normalizedResolution,
      aspectRatio: capCheck.normalizedAspectRatio,
      referenceCount: classification.referenceCount,
    });
    return candidateCap.valid;
  });

  const spec = NANO_BANANA_MODELS[chosen];

  return {
    primaryModelKey: chosen,
    providerModelId: spec.runtimeModelId,
    displayName: spec.displayName,
    routingRule,
    reason,
    fallbackChain: validFallbacks,
    normalizedResolution: capCheck.normalizedResolution,
    normalizedAspectRatio: capCheck.normalizedAspectRatio,
    capabilityWarnings,
  };
}
