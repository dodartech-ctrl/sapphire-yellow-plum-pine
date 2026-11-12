import { ARCH_TEMPLATES } from "@/lib/templates-arch";
import { EXTERIOR_TEMPLATES } from "@/lib/templates-exterior";
import { INTERIOR_TEMPLATES } from "@/lib/templates-interior";
import { LANDSCAPE_TEMPLATES } from "@/lib/templates-landscape";
import { STUDIES } from "@/lib/studies";
import type { Discipline, Scope, Study, Template, Workflow } from "@/lib/types";

export const TEMPLATES: Template[] = [
  ...ARCH_TEMPLATES,
  ...INTERIOR_TEMPLATES,
  ...EXTERIOR_TEMPLATES,
  ...LANDSCAPE_TEMPLATES,
];

export const DISCIPLINES: { id: Discipline; label: string; blurb: string; image: string }[] = [
  {
    id: "architecture",
    label: "Architecture",
    blurb: "Massing, sections, daylight, and street scale.",
    image: "/viz/t01-public-library.jpg",
  },
  {
    id: "interior",
    label: "Interior",
    blurb: "Rooms, materials, hospitality, and work.",
    image: "/viz/t04-neighborhood-cafe.jpg",
  },
  {
    id: "exterior",
    label: "Home exterior",
    blurb: "Facades, dusk, entries, and additions.",
    image: "/viz/t05-subtropical-home.jpg",
  },
  {
    id: "landscape",
    label: "Landscape",
    blurb: "Courtyards, planting, arrival, and sites.",
    image: "/viz/t07-cultural-campus.jpg",
  },
];

export const WORKFLOW_LABEL: Record<Workflow, string> = {
  concept: "Concept",
  edit: "Edit",
  compare: "Compare",
  study: "Study",
  framework: "Framework",
};

export const SCOPE_LABEL: Record<Scope, string> = {
  any: "All disciplines",
  architecture: "Architecture",
  interior: "Interior",
  exterior: "Home exterior",
  landscape: "Landscape",
};

export function getTemplate(id: string | undefined): Template | undefined {
  if (!id) return undefined;
  return TEMPLATES.find((item) => item.id === id);
}

export function getStudy(id: string | undefined): Study | undefined {
  if (!id) return undefined;
  return STUDIES.find((item) => item.id === id);
}

export function countFor(scope: Discipline): number {
  return TEMPLATES.filter((item) => item.scope === scope).length;
}

export const CHECKLIST: { title: string; items: string[] }[] = [
  {
    title: "Source fidelity",
    items: [
      "Camera, crop, and perspective still match the source.",
      "Envelope, massing, roof, openings, and grade were not quietly redrawn.",
      "Invented, removed, or moved elements are marked before anyone decides from the image.",
    ],
  },
  {
    title: "Spatial read",
    items: [
      "The focal point and the arrival or circulation path are legible.",
      "Furniture, people, and planting look plausibly scaled.",
      "Verticals and horizon behave like the view you asked for.",
    ],
  },
  {
    title: "Material and light",
    items: [
      "Finish, joint scale, reflectivity, and weathering belong to the named materials.",
      "Daylight has one direction. Shadows agree with it.",
      "If this is a comparison, only the intended variable changed.",
    ],
  },
  {
    title: "What the image cannot approve",
    items: [
      "Dimensions, clearances, products, and plant suitability.",
      "Structure, envelope, waterproofing, drainage, fire safety, and access.",
      "Cost, code, planning, or a decision to build.",
    ],
  },
];
