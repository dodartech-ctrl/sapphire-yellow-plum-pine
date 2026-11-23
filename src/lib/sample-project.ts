import type { VerticalId } from "@/lib/properties";

export type SampleProject = {
  title: string;
  /** A real plate shipped in /public, used as the "photo" the user would upload. */
  src: string;
  /** Property picks, applied through the same store action the pickers use. */
  picks: Record<string, string>;
  idea: string;
};

/**
 * One ready-to-render sample per vertical. Loading it fills steps 1 to 3 of the
 * journey (source, properties, prompt) so a new user is one click from Render.
 */
export const SAMPLE_PROJECTS: Record<VerticalId, SampleProject> = {
  interior: {
    title: "Warm mineral living room",
    src: "/viz/t09-living-room-clay-edit.jpg",
    picks: { room: "Living room", floor: "Travertine", wall: "Limewash", ceiling: "Cove light", rug: "Wool" },
    idea: "Warm limewash walls and a honed travertine floor, soft evening light through the window. Keep the layout and camera.",
  },
  exterior: {
    title: "Timber and bronze dusk villa",
    src: "/viz/t10-home-dusk-edit.jpg",
    picks: { facade: "Timber", roof: "Flat", windows: "Bronze frames", entry: "Pivot door" },
    idea: "Timber-clad facade with bronze window frames and a pivot entrance door at dusk. Keep the building shape and camera.",
  },
  amenities: {
    title: "Courtyard pool and lounge",
    src: "/viz/t06-urban-courtyard.jpg",
    picks: { water: "Infinity pool", social: "Lounge", outdoor: "Fire pit" },
    idea: "An infinity pool with a lounge terrace and a fire pit, a few people relaxing in the evening. Keep the courtyard layout.",
  },
  landscape: {
    title: "Tropical garden at dusk",
    src: "/viz/p01-pavilion-dusk.jpg",
    picks: { trees: "Palms", garden: "Tropical", path: "Stone", light: "Uplights" },
    idea: "Layered tropical planting with palms, stone paths and warm uplights around the pavilion. Keep the pavilion and camera.",
  },
};
