import {
  ACTIVITIES,
  CAMERAS,
  COLORS,
  DETAILS,
  GROUPS,
  LIGHTS,
  LOOKS,
  MOODS,
  PEOPLE,
  RANGES,
  STRENGTHS,
  TAGS,
  TIMES,
  WEATHER,
  type PanelTab,
} from "@/lib/properties";
import { COLOR_SWATCH, imageFor } from "@/lib/pill-visuals";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ADVANCED_GROUPS, EXTRA_PILLS } from "@/lib/dictionary";
import { Camera, ChevronDown, Cloud, Crown, Eye, Focus, Gem, Hash, Heart, Hexagon, Leaf, Maximize2, Minus, Moon, Pencil, Redo2, Scan, SlidersHorizontal, Sun, TreePine, Undo2, User, Users, Waves } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const TABS: { id: PanelTab; label: string; icon: typeof Pencil }[] = [
  { id: "design", label: "Design", icon: Pencil },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "light", label: "Light", icon: Sun },
  { id: "human", label: "Human", icon: User },
  { id: "mood", label: "Mood", icon: Heart },
];

const TILES: Record<string, { id: string; label: string; image: string }[]> = {
  interior: [
    { id: "floor", label: "Flooring", image: "/pills/marble.jpg" },
    { id: "wall", label: "Walls", image: "/pills/limewash.jpg" },
    { id: "ceiling", label: "Ceiling", image: "/pills/ceiling.jpg" },
    { id: "furniture", label: "Furniture", image: "/pills/furniture.jpg" },
    { id: "fixture", label: "Lighting", image: "/pills/chandelier.jpg" },
    { id: "openings", label: "Doors", image: "/pills/door.jpg" },
    { id: "kitchen", label: "Windows", image: "/pills/window.jpg" },
    { id: "decor", label: "Decor", image: "/pills/decor.jpg" },
  ],
  exterior: [
    { id: "facade", label: "Facade", image: "/pills/facade.jpg" },
    { id: "roof", label: "Roof", image: "/pills/brick.jpg" },
    { id: "windows", label: "Windows", image: "/pills/window.jpg" },
    { id: "entry", label: "Entrance", image: "/pills/door.jpg" },
    { id: "balcony", label: "Balcony", image: "/pills/facade.jpg" },
    { id: "terrace", label: "Terrace", image: "/pills/garden.jpg" },
    { id: "drive", label: "Driveway", image: "/pills/travertine.jpg" },
    { id: "water", label: "Water", image: "/pills/pool.jpg" },
  ],
  amenities: [
    { id: "water", label: "Water", image: "/pills/pool.jpg" },
    { id: "wellness", label: "Wellness", image: "/pills/bath.jpg" },
    { id: "social", label: "Social", image: "/pills/dining.jpg" },
    { id: "sport", label: "Sport", image: "/pills/garden.jpg" },
    { id: "outdoor", label: "Outdoor", image: "/pills/garden.jpg" },
    { id: "family", label: "Family", image: "/pills/living.jpg" },
    { id: "work", label: "Work", image: "/pills/office.jpg" },
    { id: "security", label: "Arrival", image: "/pills/door.jpg" },
  ],
  landscape: [
    { id: "trees", label: "Trees", image: "/pills/garden.jpg" },
    { id: "planting", label: "Planting", image: "/pills/garden.jpg" },
    { id: "lawn", label: "Lawn", image: "/pills/garden.jpg" },
    { id: "garden", label: "Garden", image: "/pills/garden.jpg" },
    { id: "path", label: "Paths", image: "/pills/travertine.jpg" },
    { id: "water", label: "Water", image: "/pills/pool.jpg" },
    { id: "structure", label: "Structure", image: "/pills/timber.jpg" },
    { id: "edge", label: "Boundary", image: "/pills/brick.jpg" },
  ],
};

export function PropertiesPanel() {
  const design = useOriel((state) => state.design);
  const setPanel = useOriel((state) => state.setPanel);
  const setDesignField = useOriel((state) => state.setDesignField);
  const setPick = useOriel((state) => state.setPick);
  const setTarget = useOriel((state) => state.setTarget);
  const toggleTag = useOriel((state) => state.toggleTag);
  const setAdvanced = useOriel((state) => state.setAdvanced);
  const toggleExtra = useOriel((state) => state.toggleExtra);
  const undo = useOriel((state) => state.undo);
  const redo = useOriel((state) => state.redo);
  const groups = GROUPS[design.vertical];
  const looks = LOOKS[design.vertical];

  return (
    <aside className="px-3 pb-4 lg:w-[360px] lg:shrink-0 lg:overflow-y-auto">
      <div className="rounded-[28px] border border-white bg-surface p-3 shadow-[0_18px_40px_rgba(70,48,16,0.06)]">
      <div className="flex items-center gap-2 px-1 py-1">
        <Hexagon className="size-4 text-[#b08a45]" />
        <h2 className="font-serif text-lg">Design Properties</h2>
        <button type="button" onClick={() => undo()} className="ml-auto grid size-8 place-items-center rounded-full text-muted" aria-label="Undo">
          <Undo2 className="size-4" />
        </button>
        <button type="button" onClick={() => redo()} className="grid size-8 place-items-center rounded-full text-muted" aria-label="Redo">
          <Redo2 className="size-4" />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1 rounded-2xl bg-raised p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = design.panel === tab.id || (tab.id === "design" && design.panel === "advanced");
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPanel(tab.id)}
              className={cn("flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px]", active ? "gold-fill" : "text-muted")}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 space-y-4">
        {design.panel === "design" || design.panel === "advanced" ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Elements</p>
              <button type="button" onClick={() => setTarget("whole")} className="text-xs text-[#b08a45]">
                All Elements →
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(TILES[design.vertical] ?? []).map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setTarget(tile.id)}
                  className={cn("hover-tile overflow-hidden rounded-2xl border bg-white text-center", design.target === tile.id ? "border-[#d4b06a]" : "border-line")}
                >
                  <img src={tile.image} alt="" className="h-14 w-full object-cover" />
                  <span className="block px-1 py-1.5 text-[11px] text-fg">{tile.label}</span>
                </button>
              ))}
            </div>
            <Fold title="Materials & Finishes" icon={<Hexagon className="size-4 text-[#b08a45]" />}>
              {groups.map((group) => (
                <ChipRow
                  key={group.id}
                  label={group.label}
                  value={design.picks[group.id] ?? group.options[0]}
                  options={group.options}
                  onPick={(value) => setPick(group.id, value)}
                />
              ))}
            </Fold>
            <Fold title="Color Palette" icon={<span className="size-4 rounded-full bg-[#d4b06a]" />}>
              <ChipRow label="Color" value={design.color} options={COLORS} onPick={(value) => setDesignField("color", value)} />
            </Fold>
            <Fold title="Look & Feel" icon={<SlidersHorizontal className="size-4 text-[#b08a45]" />} watch={design.look}>
              <div className="grid grid-cols-2 gap-2">
                {looks.map((look) => (
                  <button
                    key={look.name}
                    type="button"
                    onClick={() => setDesignField("look", look.name)}
                    className={cn("hover-tile overflow-hidden rounded-xl border text-left", design.look === look.name ? "border-[#d4b06a]" : "border-line")}
                  >
                    <img src={look.image} alt="" className="h-16 w-full object-cover" />
                    <span className="block px-2 py-1.5 text-xs">{look.name}</span>
                  </button>
                ))}
              </div>
              <ChipRow label="Range" value={design.range} options={RANGES} onPick={(value) => setDesignField("range", value)} />
              <ChipRow label="Strength" value={design.strength} options={STRENGTHS} onPick={(value) => setDesignField("strength", value)} />
              <ChipRow label="Detail" value={design.detail} options={DETAILS} onPick={(value) => setDesignField("detail", value)} />
            </Fold>
            <Fold title="Tags" icon={<Hash className="size-4 text-[#b08a45]" />}>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn("hover-chip inline-flex h-11 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm", design.tags.includes(tag) ? "gold-fill border-transparent" : "border-line text-muted")}
                    aria-pressed={design.tags.includes(tag)}
                  >
                    <PillMark label={tag} />
                    {tag}
                  </button>
                ))}
              </div>
            </Fold>
            <Fold title="Advanced" icon={<SlidersHorizontal className="size-4 text-[#b08a45]" />}>
              {ADVANCED_GROUPS.map((group) => (
                <ChipRow
                  key={group.key}
                  label={group.label}
                  value={design.advanced[group.key]}
                  options={group.options.map((option) => option.id)}
                  labels={Object.fromEntries(group.options.map((option) => [option.id, option.label]))}
                  onPick={(value) => setAdvanced(group.key, value)}
                />
              ))}
              <div className="flex flex-wrap gap-2">
                {EXTRA_PILLS.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => toggleExtra(pill.id)}
                    className={cn("hover-chip inline-flex h-11 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm", design.advanced.extras.includes(pill.id) ? "gold-fill border-transparent" : "border-line text-muted")}
                    aria-pressed={design.advanced.extras.includes(pill.id)}
                  >
                    <PillMark label={pill.label} />
                    {pill.label}
                  </button>
                ))}
              </div>
            </Fold>
          </>
        ) : null}
        {design.panel === "camera" ? (
          <ChipRow label="Camera" value={design.camera} options={CAMERAS} onPick={(value) => setDesignField("camera", value)} />
        ) : null}
        {design.panel === "light" ? (
          <>
            <ChipRow label="Light" value={design.light} options={LIGHTS} onPick={(value) => setDesignField("light", value)} />
            <ChipRow label="Time" value={design.time} options={TIMES} onPick={(value) => setDesignField("time", value)} />
            <ChipRow label="Weather" value={design.weather} options={WEATHER} onPick={(value) => setDesignField("weather", value)} />
          </>
        ) : null}
        {design.panel === "human" ? (
          <>
            <ChipRow label="People" value={design.people} options={PEOPLE} onPick={(value) => setDesignField("people", value)} />
            <ChipRow label="Activity" value={design.activity} options={ACTIVITIES} onPick={(value) => setDesignField("activity", value)} />
          </>
        ) : null}
        {design.panel === "mood" ? (
          <>
            <ChipRow label="Mood" value={design.mood} options={MOODS} onPick={(value) => setDesignField("mood", value)} />
            <ChipRow label="Color" value={design.color} options={COLORS} onPick={(value) => setDesignField("color", value)} />
          </>
        ) : null}
      </div>
      </div>
    </aside>
  );
}

function Fold({ title, icon, children, watch }: { title: string; icon: ReactNode; children: ReactNode; watch?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!watch) return;
    if (seen.current === undefined || seen.current === watch) {
      seen.current = watch;
      return;
    }
    seen.current = watch;
    setOpen(true);
    ref.current?.scrollIntoView({ block: "nearest" });
  }, [watch]);
  return (
    <div ref={ref} className="rounded-2xl border border-line bg-white">
      <button type="button" onClick={() => setOpen((value) => !value)} className="hover-fold flex h-12 w-full items-center gap-2 px-3 text-sm font-medium">
        {icon}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown className={cn("size-4 text-faint transition", open && "rotate-180")} />
      </button>
      {open ? <div className="space-y-4 px-3 pb-3">{children}</div> : null}
    </div>
  );
}

function iconFor(label: string) {
  const key = label.toLowerCase();
  if (key.includes("none") || key.includes("unchanged") || key.includes("keep") || key.includes("unspecified")) return Minus;
  if (key.includes("ultra") || key.includes("luxury") || key.includes("premium")) return Crown;
  if (key.includes("basic") || key.includes("standard")) return Gem;
  if (key.includes("eye")) return Eye;
  if (key.includes("wide")) return Maximize2;
  if (key.includes("close") || key.includes("detail") || key.includes("micro")) return Scan;
  if (key.includes("crowd") || key.includes("people") || key.includes("medium")) return Users;
  if (key.includes("few")) return User;
  if (key.includes("cloud") || key.includes("mist") || key.includes("haze") || key.includes("rain")) return Cloud;
  if (key.includes("night") || key.includes("evening")) return Moon;
  if (key.includes("day") || key.includes("morning") || key.includes("sun") || key.includes("light")) return Sun;
  if (key.includes("tree") || key.includes("plant") || key.includes("garden") || key.includes("green")) return TreePine;
  if (key.includes("leaf") || key.includes("season")) return Leaf;
  if (key.includes("pool") || key.includes("water") || key.includes("swim")) return Waves;
  return Hexagon;
}

function PillMark({ label }: { label: string }) {
  const swatch = COLOR_SWATCH[label];
  const image = swatch ? undefined : imageFor(label);
  if (swatch) return <span className="size-8 shrink-0 rounded-full border border-black/10" style={{ background: swatch }} />;
  if (image) return <img src={image} alt="" className="size-8 shrink-0 rounded-full object-cover" />;
  const Icon = iconFor(label);
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-raised text-[#b08a45]">
      <Icon className="size-4" />
    </span>
  );
}

function ChipRow({
  label,
  value,
  options,
  labels,
  onPick,
}: {
  label: string;
  value: string;
  options: readonly string[];
  labels?: Record<string, string>;
  onPick: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-faint">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            className={cn(
              "hover-chip inline-flex h-11 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm",
              value === option ? "border-lime bg-lime text-ink" : "border-line text-muted",
            )}
            aria-pressed={value === option}
          >
            <PillMark label={labels?.[option] ?? option} />
            {labels?.[option] ?? option}
          </button>
        ))}
      </div>
    </div>
  );
}
