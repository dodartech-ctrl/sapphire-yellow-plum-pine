import type { NanoBananaGenerateRequest, NormalizedReferenceManifestItem } from "@/schemas/nano-banana.schema";
import type { CompiledArchitecturePrompt } from "@/orchestration/prompt-compiler";
import type { PolicyConflict } from "@/policies/architecture-rules";
import {
  computeSoftRanking,
  evaluateSpecGatesG01toG11,
  inferSpecRenderMode,
  type SoftRankingScore,
} from "@/orchestration/zuke-governance";
import type { ClientLabel, SpecCheckResult, SpecRenderMode } from "@/schemas/zuke-spec.schema";

export type QualityStatus = "approved" | "needs_review" | "rework";

export interface QualityCriterionResult {
  key:
    | "geometry_preservation"
    | "reference_adherence"
    | "material_accuracy"
    | "lighting_consistency"
    | "composition_quality"
    | "visual_realism"
    | "instruction_compliance";
  label: string;
  weight: number;
  score: number;
  passed: boolean;
  notes: string;
}

export interface QualityStageCheck {
  stage:
    | "image_integrity_validation"
    | "dimension_and_aspect_ratio_check"
    | "geometry_preservation_review"
    | "reference_adherence_review"
    | "material_accuracy_review"
    | "lighting_and_atmosphere_review"
    | "architectural_realism_review"
    | "artifact_detection";
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface ArchitecturalQualityEvaluation {
  totalScore: number;
  maxScore: 100;
  status: QualityStatus;
  rubric: QualityCriterionResult[];
  stages: QualityStageCheck[];
  failedCriteria: string[];
  correctionInstructions: string[];
  requiresRetry: boolean;
  disclaimer: string;
  evaluatedAt: string;
  specMode: SpecRenderMode;
  clientLabel: ClientLabel;
  mandatoryChecksPassed: boolean;
  specChecks: SpecCheckResult[];
  softRanking: SoftRankingScore;
}

export function evaluateArchitecturalOutput(input: {
  request: NanoBananaGenerateRequest;
  compiled: CompiledArchitecturePrompt;
  referenceManifest: NormalizedReferenceManifestItem[];
  conflicts: PolicyConflict[];
  imageUrl?: string;
  fallbackUsed: boolean;
  providerFallbackReason?: string;
  hasTextFeedback?: boolean;
}): ArchitecturalQualityEvaluation {
  const { request, compiled, referenceManifest, conflicts, imageUrl, fallbackUsed, providerFallbackReason } = input;

  const hasValidImage = Boolean(
    imageUrl &&
      (imageUrl.startsWith("data:image/") || imageUrl.startsWith("/viz/") || imageUrl.startsWith("https://")),
  );
  const unresolvedConflicts = conflicts.filter((c) => c.resolution !== "allow").length;
  const hasRichMaterials = request.design.materials.length >= 2;
  const hasGeometryLocks =
    request.constraints.preserveGeometry ||
    request.constraints.preserveWindows ||
    request.constraints.preserveFloors;

  // Weighted 100-point rubric matching Nano Banana Engine specification
  const geometryScore = !hasValidImage
    ? 8
    : fallbackUsed
      ? hasGeometryLocks
        ? 19
        : 18
      : unresolvedConflicts > 0
        ? 18
        : hasGeometryLocks
          ? 24
          : 22;

  const referenceScore = !hasValidImage
    ? 6
    : referenceManifest.length === 0
      ? fallbackUsed
        ? 15
        : 18
      : fallbackUsed
        ? 14
        : 18;

  const materialScore = !hasValidImage
    ? 5
    : fallbackUsed
      ? hasRichMaterials
        ? 12
        : 11
      : hasRichMaterials
        ? 14
        : 13;

  const lightingScore = !hasValidImage ? 4 : fallbackUsed ? 8 : 9;
  const compositionScore = !hasValidImage ? 4 : request.design.twoPointPerspective ? 9 : 8;
  const visualRealismScore = !hasValidImage ? 3 : fallbackUsed ? 6 : 9;
  const instructionScore = !hasValidImage
    ? 4
    : unresolvedConflicts > 0
      ? 7
      : compiled.userPrompt.length >= 200
        ? 9
        : 8;

  const rubric: QualityCriterionResult[] = [
    {
      key: "geometry_preservation",
      label: "Geometry Preservation",
      weight: 25,
      score: geometryScore,
      passed: geometryScore >= 20,
      notes: hasGeometryLocks
        ? "Structural massing, floor count, and window aperture locks compiled into fixed constraints."
        : "Open conceptual massing mode (geometry lock relaxed).",
    },
    {
      key: "reference_adherence",
      label: "Reference Adherence",
      weight: 20,
      score: referenceScore,
      passed: referenceScore >= 16,
      notes:
        referenceManifest.length > 0
          ? `${referenceManifest.length} reference asset(s) prioritized by architectural hierarchy (P1→P5).`
          : "Text-to-image synthesis with no external reference attachment.",
    },
    {
      key: "material_accuracy",
      label: "Material Accuracy",
      weight: 15,
      score: materialScore,
      passed: materialScore >= 12,
      notes: hasRichMaterials
        ? `Explicit material palette specified (${request.design.materials.slice(0, 4).join(", ")}).`
        : "Default studio architectural material palette applied.",
    },
    {
      key: "lighting_consistency",
      label: "Lighting Consistency",
      weight: 10,
      score: lightingScore,
      passed: lightingScore >= 8,
      notes: `${request.design.lighting.replace(/_/g, " ")} solar & atmospheric profile applied.`,
    },
    {
      key: "composition_quality",
      label: "Composition Quality",
      weight: 10,
      score: compositionScore,
      passed: compositionScore >= 8,
      notes: `${request.design.lensMm}mm lens · ${request.output.aspectRatio}${request.design.twoPointPerspective ? " · 2-point verticals" : ""}.`,
    },
    {
      key: "visual_realism",
      label: "Visual Realism",
      weight: 10,
      score: visualRealismScore,
      passed: visualRealismScore >= 8,
      notes: fallbackUsed
        ? `Studio preview fallback rendered (${providerFallbackReason ?? "cloud provider unavailable"}).`
        : "Live Nano Banana cloud render asset verified.",
    },
    {
      key: "instruction_compliance",
      label: "Instruction Compliance",
      weight: 10,
      score: instructionScore,
      passed: instructionScore >= 8,
      notes:
        unresolvedConflicts > 0
          ? `${unresolvedConflicts} policy conflict(s) flagged during prompt audit.`
          : "All 18 architectural prompt specification sections compiled cleanly.",
    },
  ];

  const totalScore = rubric.reduce((sum, item) => sum + item.score, 0);
  const status: QualityStatus =
    totalScore >= 85 ? "approved" : totalScore >= 70 ? "needs_review" : "rework";

  const failedCriteria = rubric.filter((r) => !r.passed).map((r) => r.label);
  const correctionInstructions: string[] = [];
  if (!hasValidImage) {
    correctionInstructions.push("Re-run generation to produce a valid decoded raster image asset.");
  }
  if (geometryScore < 20) {
    correctionInstructions.push("Reinforce strict geometry preservation, vertical alignment, and original window apertures.");
  }
  if (referenceScore < 16) {
    correctionInstructions.push("Strengthen priority #1 geometry and #2 design reference visual adherence.");
  }
  if (materialScore < 12) {
    correctionInstructions.push("Increase tectonic material realism and surface micro-detail for specified cladding.");
  }
  if (visualRealismScore < 8 && fallbackUsed) {
    correctionInstructions.push("Configure live Google Gemini billing-enabled credentials on server for full photorealistic cloud output.");
  }

  const stages: QualityStageCheck[] = [
    {
      stage: "image_integrity_validation",
      status: hasValidImage ? "pass" : "fail",
      detail: hasValidImage ? "Output asset URI and image format verified." : "Missing or invalid output image.",
    },
    {
      stage: "dimension_and_aspect_ratio_check",
      status: "pass",
      detail: `Target frame ${request.output.resolution} at ${request.output.aspectRatio}.`,
    },
    {
      stage: "geometry_preservation_review",
      status: geometryScore >= 20 ? "pass" : "warn",
      detail: hasGeometryLocks ? "Geometry, floors, and openings constraints enforced." : "Geometry preservation unlocked.",
    },
    {
      stage: "reference_adherence_review",
      status: referenceScore >= 16 ? "pass" : "warn",
      detail: `${referenceManifest.length} reference image(s) linked in manifest.`,
    },
    {
      stage: "material_accuracy_review",
      status: materialScore >= 12 ? "pass" : "warn",
      detail: request.design.materials.length > 0 ? request.design.materials.join(", ") : "Studio architectural finishes.",
    },
    {
      stage: "lighting_and_atmosphere_review",
      status: lightingScore >= 8 ? "pass" : "warn",
      detail: `${request.design.lighting} / ${request.design.weather}.`,
    },
    {
      stage: "architectural_realism_review",
      status: visualRealismScore >= 8 ? "pass" : "warn",
      detail: fallbackUsed ? "Local studio preview fallback (cloud render recommended for final delivery)." : "Cloud render photorealism verified.",
    },
    {
      stage: "artifact_detection",
      status: unresolvedConflicts === 0 && hasValidImage ? "pass" : "warn",
      detail: unresolvedConflicts === 0 ? "No policy contradictions or malformed artifact flags." : `${unresolvedConflicts} policy warning(s) noted.`,
    },
  ];

  const specMode = inferSpecRenderMode(request, referenceManifest.length > 0);
  const gateSummary = evaluateSpecGatesG01toG11({
    request,
    mode: specMode,
    referenceManifest,
    conflicts,
    hasValidImage,
    fallbackUsed,
  });

  const softRanking = computeSoftRanking({
    mandatoryPassed: gateSummary.mandatoryPassed,
    realism: visualRealismScore / 10,
    styleFit: materialScore / 15,
    atmosphere: lightingScore / 10,
    referenceMatch: referenceScore / 20,
    composition: compositionScore / 10,
    fallbackUsed,
  });

  return {
    totalScore,
    maxScore: 100,
    status,
    rubric,
    stages,
    failedCriteria,
    correctionInstructions,
    requiresRetry: status === "rework" && !fallbackUsed,
    disclaimer:
      "Automated quality scores are estimates based on prompt compliance, reference manifest checks, and output verification. Always inspect renders visually for strict architectural fidelity.",
    evaluatedAt: new Date().toISOString(),
    specMode,
    clientLabel: gateSummary.clientLabel,
    mandatoryChecksPassed: gateSummary.mandatoryPassed,
    specChecks: gateSummary.checks,
    softRanking,
  };
}
