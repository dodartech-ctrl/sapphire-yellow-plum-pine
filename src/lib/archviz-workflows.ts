export const WORKFLOWS = {
  concept: { label: "Concept", instruction: "Explore a compelling architectural concept. Maintain plausible structure, scale, and construction details." },
  photoreal: { label: "Photoreal", instruction: "Produce a photorealistic architectural photograph with believable material textures, natural light transport, realistic shadows, and accurate perspective." },
  materials: { label: "Materials", instruction: "Prioritize changes to surface finishes, color palette, and material textures. Preserve the original geometry, openings, furniture placement, and camera viewpoint." },
  lighting: { label: "Lighting", instruction: "Prioritize lighting design, fixture illumination, time of day, and atmosphere. Preserve architectural geometry, materials, composition, and camera viewpoint." },
  landscape: { label: "Landscape", instruction: "Prioritize landscape planting, paving, exterior furniture, and site atmosphere. Preserve building massing, facade, camera viewpoint, and perspective." },
} as const;

export type Workflow = keyof typeof WORKFLOWS;

export function sanitizeWorkflow(value: unknown): Workflow {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(WORKFLOWS, value)
    ? (value as Workflow)
    : "concept";
}

export function workflowInstruction(workflow: Workflow, hasReference: boolean): string {
  return [
    WORKFLOWS[workflow].instruction,
    hasReference
      ? "Use the provided reference image as the source of truth for spatial layout and perspective. Do not invent structural changes unless explicitly requested."
      : "Keep the scene physically plausible and architecturally coherent.",
  ].join(" ");
}
