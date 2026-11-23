import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Box, Download, Layers, Loader2, Palette, Search, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { GROUPS, LOOKS, VERTICALS, type VerticalId } from "@/lib/properties";
import { INSPECTOR_PBR_SWATCHES } from "@/lib/solar-and-materials";
import {
  PROCEDURAL_GLB_CATALOG,
  exportProceduralAssetToGlbFile,
  triggerBlobDownload,
} from "@/lib/studio-exports";
import { useOriel } from "@/lib/store";
import { setPending3DFile } from "@/lib/workflow-journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assets")({
  component: AssetsPage,
});

function AssetsPage() {
  const setVertical = useOriel((state) => state.setVertical);
  const setDesignField = useOriel((state) => state.setDesignField);
  const setPick = useOriel((state) => state.setPick);
  const setIdea = useOriel((state) => state.setIdea);
  const idea = useOriel((state) => state.idea);
  const setActiveStudio = useOriel((state) => state.setActiveStudio);
  const setScene3DField = useOriel((state) => state.setScene3DField);
  const navigate = useNavigate();

  const [tab, setTab] = useState<"glb" | "materials" | "looks">("glb");
  const [query, setQuery] = useState("");
  const [busyAssetId, setBusyAssetId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGlb = useMemo(
    () =>
      PROCEDURAL_GLB_CATALOG.filter(
        (item) =>
          !normalizedQuery ||
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.summary.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery),
      ),
    [normalizedQuery],
  );

  const filteredMaterials = useMemo(
    () =>
      INSPECTOR_PBR_SWATCHES.filter(
        (sw) =>
          !normalizedQuery ||
          sw.label.toLowerCase().includes(normalizedQuery) ||
          sw.category.toLowerCase().includes(normalizedQuery),
      ),
    [normalizedQuery],
  );

  function applyLook(vertical: VerticalId, name: string) {
    setVertical(vertical);
    setDesignField("look", name);
    setActiveStudio("mas-2d");
    toast.success(`Applied ${name} (${vertical}) to Studio`);
    void navigate({ to: "/" });
  }

  function importCustom3DFile(file: File | undefined) {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["glb", "gltf", "obj", "fbx", "stl"].includes(ext)) {
      toast.error("Unsupported 3D file. Please choose .glb, .gltf, .obj, .fbx, or .stl.");
      return;
    }
    setPending3DFile(file);
    setActiveStudio("sam-3d");
    toast.success(`Loading ${file.name} in SAM 3D Viewport…`);
    void navigate({ to: "/" });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    importCustom3DFile(e.target.files?.[0]);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    importCustom3DFile(e.dataTransfer.files?.[0]);
  }

  async function handleLoadProceduralIn3D(assetId: string) {
    const spec = PROCEDURAL_GLB_CATALOG.find((a) => a.id === assetId);
    if (!spec) return;
    if (spec.presetKey) {
      setScene3DField("preset", spec.presetKey);
      setActiveStudio("sam-3d");
      toast.success(`Loaded ${spec.name} into live 3D Viewport`);
      void navigate({ to: "/" });
      return;
    }
    setBusyAssetId(assetId);
    try {
      const { file, meshCount } = await exportProceduralAssetToGlbFile(assetId);
      setPending3DFile(file);
      setActiveStudio("sam-3d");
      toast.success(`Loaded ${spec.name} (${meshCount} meshes) into 3D Viewport`);
      void navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not build 3D GLB asset.");
    } finally {
      setBusyAssetId(null);
    }
  }

  async function handleDownloadGlb(assetId: string) {
    setBusyAssetId(assetId);
    try {
      const { blob, filename, meshCount } = await exportProceduralAssetToGlbFile(assetId);
      triggerBlobDownload(blob, filename);
      toast.success(`Exported ${filename} (${meshCount} meshes · binary GLB)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not export GLB file.");
    } finally {
      setBusyAssetId(null);
    }
  }

  function applyPbrSwatchToStudio(swatchLabel: string, category: string) {
    const snippet = `${swatchLabel} (${category} PBR finish)`;
    const nextIdea = idea.trim()
      ? idea.toLowerCase().includes(swatchLabel.toLowerCase())
        ? idea
        : `${idea.replace(/[,.;\s]+$/, "")}, featuring ${snippet}`
      : `Architectural visualization featuring ${snippet}`;
    setIdea(nextIdea);
    setActiveStudio("mas-2d");
    toast.success(`Injected "${swatchLabel}" PBR material into Studio prompt`);
    void navigate({ to: "/" });
  }

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#b08a45]">
              Assets, 3D GLB &amp; Material Library
            </p>
            <h1 className="mt-1 font-syne text-3xl font-bold">3D Models, PBR Materials &amp; Studio Looks</h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted">
              Import real .GLB, .GLTF, .OBJ, .FBX, or .STL CAD models directly into the live 3D Viewport, download
              procedural architectural .GLB kits, or inject PBR finishes and studio looks straight onto your canvas.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter 3D assets, materials, looks…"
              className="h-10 w-full rounded-full border border-line bg-surface pr-3 pl-9 text-xs text-fg outline-none focus:border-[#c5a880]"
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {(
            [
              { id: "glb", label: `3D Models & GLB (${PROCEDURAL_GLB_CATALOG.length})`, icon: Box },
              { id: "materials", label: `PBR Material Swatches (${INSPECTOR_PBR_SWATCHES.length})`, icon: Palette },
              { id: "looks", label: "Studio Looks & Finishes", icon: Layers },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition",
                  tab === item.id
                    ? "border-[#c5a880] bg-[#c5a880] text-[#281800] dark:border-[#cfe3f0] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                    : "border-line bg-surface text-muted hover:text-fg",
                )}
              >
                <Icon className="size-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === "glb" ? (
          <div className="mt-6 space-y-6">
            {/* Drag & Drop 3D CAD Importer */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-dashed p-5 text-center transition sm:flex-row sm:text-left",
                dragOver
                  ? "border-[#c5a880] bg-[#c5a880]/10"
                  : "border-line bg-surface/70",
              )}
            >
              <div className="flex items-center gap-3.5">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#c5a880]/20 text-[#b08a45]">
                  <Upload className="size-5" />
                </div>
                <div>
                  <h2 className="font-syne text-base font-bold">Import Custom 3D CAD / BIM File</h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Drop a <strong>.GLB</strong>, <strong>.GLTF</strong>, <strong>.OBJ</strong>, <strong>.FBX</strong>, or{" "}
                    <strong>.STL</strong> file here — automatically normalized, grounded, and opened in SAM 3D Viewport.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".glb,.gltf,.obj,.fbx,.stl"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="gold-fill inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-semibold text-[#2a1c0c]"
                >
                  <Upload className="size-3.5" /> Upload 3D Model
                </button>
              </div>
            </div>

            {/* Procedural Architectural 3D GLB Kit */}
            <div>
              <h2 className="font-syne text-lg font-semibold">Studio Architectural 3D GLB Kit</h2>
              <p className="mt-1 text-xs text-muted">
                Load directly into the WebGL 3D Viewport with solar &amp; camera lock, or export a real binary .GLB file for Blender, Rhino, SketchUp, or Unreal Engine.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGlb.map((asset) => {
                  const isBusy = busyAssetId === asset.id;
                  return (
                    <article
                      key={asset.id}
                      data-testid={`glb-asset-${asset.id}`}
                      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
                    >
                      <div className="relative h-36 overflow-hidden bg-black/20">
                        <img src={asset.previewImage} alt={asset.name} className="h-full w-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-black/70 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#e8c98a]">
                          {asset.category}
                        </span>
                        <span className="absolute right-2.5 bottom-2.5 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/90">
                          {asset.dimensionsM} · ~{asset.trianglesApprox} tris
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <h3 className="font-syne text-sm font-bold">{asset.name}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted">{asset.summary}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleLoadProceduralIn3D(asset.id)}
                            className="gold-fill inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#2a1c0c] disabled:opacity-60"
                          >
                            {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Box className="size-3.5" />}
                            Open in 3D
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleDownloadGlb(asset.id)}
                            className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 text-xs font-semibold text-fg hover:bg-raised disabled:opacity-60"
                          >
                            <Download className="size-3.5" /> .GLB
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        ) : tab === "materials" ? (
          <div className="mt-6">
            <h2 className="font-syne text-lg font-semibold">Physically-Based (PBR) Architectural Material Swatches</h2>
            <p className="mt-1 text-xs text-muted">
              Click any swatch to inject its calibrated roughness, metalness, and finish directive straight into the Studio prompt.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredMaterials.map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  onClick={() => applyPbrSwatchToStudio(sw.label, sw.category)}
                  className="flex flex-col items-start rounded-2xl border border-line bg-surface p-3.5 text-left transition hover:border-[#c5a880]"
                >
                  <div className="flex w-full items-center gap-3">
                    <span
                      className="size-10 shrink-0 rounded-xl border border-black/15 shadow-inner"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{sw.label}</p>
                      <p className="font-mono text-[10px] uppercase text-muted">{sw.category}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex w-full items-center justify-between font-mono text-[10px] text-muted">
                    <span>Rough {sw.roughness.toFixed(2)}</span>
                    <span>Metal {sw.metalness.toFixed(2)}</span>
                    <span className="inline-flex items-center gap-1 font-sans font-semibold text-[#b08a45]">
                      <Sparkles className="size-3" /> Apply
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {VERTICALS.map((vertical) => {
              const looks = LOOKS[vertical.id].filter(
                (l) => !normalizedQuery || l.name.toLowerCase().includes(normalizedQuery),
              );
              const groups = GROUPS[vertical.id];
              if (normalizedQuery && looks.length === 0) return null;
              return (
                <section key={vertical.id} className="mt-8 first:mt-0">
                  <h2 className="font-syne text-xl font-semibold">{vertical.label}</h2>
                  <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {looks.map((look) => (
                      <button
                        key={look.name}
                        type="button"
                        onClick={() => applyLook(vertical.id, look.name)}
                        className="overflow-hidden rounded-2xl border border-line bg-surface text-left transition hover:border-[#c5a880]"
                      >
                        <img src={look.image} alt={look.name} className="h-28 w-full object-cover" />
                        <span className="block px-3 py-2 text-sm font-medium">{look.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {groups.flatMap((group) =>
                      group.options
                        .filter(
                          (option) =>
                            !normalizedQuery ||
                            option.toLowerCase().includes(normalizedQuery) ||
                            group.label.toLowerCase().includes(normalizedQuery),
                        )
                        .map((option) => (
                          <button
                            key={`${group.id}-${option}`}
                            type="button"
                            className="h-9 rounded-full border border-line bg-surface px-3 text-xs text-muted hover:border-[#c5a880] hover:text-fg"
                            onClick={() => {
                              setVertical(vertical.id);
                              setPick(group.id, option);
                              toast.success(`Selected ${group.label}: ${option}`);
                              void navigate({ to: "/" });
                            }}
                          >
                            {group.label}: {option}
                          </button>
                        )),
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
