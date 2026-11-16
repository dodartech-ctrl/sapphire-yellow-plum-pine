export const RATIOS = ["16:9", "4:3", "3:2", "1:1", "9:16"] as const;
export const RESOLUTIONS = ["1k", "2k"] as const;

export type Ratio = (typeof RATIOS)[number];
export type Resolution = (typeof RESOLUTIONS)[number];

export type Frame = { ratio: Ratio; resolution: Resolution };

export const DEFAULT_FRAME: Frame = { ratio: "16:9", resolution: "1k" };

export function sanitizeFrame(input: Partial<Frame> | undefined): Frame {
  const ratio = RATIOS.includes(input?.ratio as Ratio) ? (input?.ratio as Ratio) : DEFAULT_FRAME.ratio;
  const resolution = RESOLUTIONS.includes(input?.resolution as Resolution) ? (input?.resolution as Resolution) : DEFAULT_FRAME.resolution;
  return { ratio, resolution };
}

export function frameAspect(ratio: Ratio): string {
  return ratio.replace(":", " / ");
}

export function frameAspectNumber(ratio: Ratio): number {
  const [w, h] = ratio.split(":").map(Number);
  return w > 0 && h > 0 ? w / h : 16 / 9;
}

export function frameEdge(resolution: Resolution): number {
  return resolution === "2k" ? 2048 : 1280;
}
