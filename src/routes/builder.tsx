import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  Camera,
  Check,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  GripVertical,
  Grid,
  MoveRight,
  Palette,
  RefreshCw,
  Save,
  Share2,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import { BriefCollabDrawer } from "@/components/brief-collab-drawer";
import { BriefTemplateLibrary } from "@/components/brief-template-library";
import { ClientPdfExportModal } from "@/components/client-pdf-export-modal";
import { MidLayerBar } from "@/components/mid-layer-bar";
import { MoodboardOverlay } from "@/components/moodboard-overlay";
import {
  buildBriefShareUrl,
  buildSharedBriefSnapshot,
  normalizeAuthorName,
  sanitizeShareId,
  type CollabParameterKey,
  type CollabReviewerRole,
  type SharedBriefSession,
} from "@/lib/brief-collab";
import {
  addBriefCommentFn,
  createSharedBriefFn,
  deleteBriefCommentFn,
  getSharedBriefFn,
  toggleBriefCommentStatusFn,
  updateSharedBriefFn,
} from "@/lib/brief-collab-api";
import {
  formatReferenceNoteFromImage,
  parseBriefToMoodboardQueries,
  type MoodboardGenerationResult,
  type MoodboardImageItem,
} from "@/lib/brief-moodboard";
import { generateMoodboardFn } from "@/lib/brief-moodboard-api";
import {
  BRIEF_TEMPLATES,
  buildTemplateCompiledNotes,
  resolveBriefTemplateSlots,
  type BriefTemplate,
} from "@/lib/brief-templates";
import {
  ARCHVIZ_PRESETS,
  DICTIONARY_BLOCKS,
  applyMidLayerPromptToIdea,
  composeDictionarySelection,
  exportSavedPromptsJson,
  getDictionaryBlock,
  getMidLayerPresetById,
  importSavedPromptsJson,
  type ArchvizPresetGroup,
} from "@/lib/archviz-dictionary";
import {
  ARCHITECTURAL_STYLES,
  BUILDER_PRESETS,
  CAMERA_PRESETS,
  LIGHTING_CONDITIONS,
  MOOD_SETTINGS,
  synthesizeVisionDocument,
  type BlockCategory,
  type BuilderBlock,
} from "@/lib/builder-data";
import { buildDesignPackDocumentHtml, buildMaterialScheduleRows } from "@/lib/archviz-suite";
import {
  buildInitialBuilderNotes,
  syncBuilderSlotToNotes,
  syncDictionaryPresetToNotes,
  toggleDictionaryBlockInNotes,
  toggleKeywordPillInNotes,
} from "@/lib/prompt-sync";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/builder")({
  component: BriefBuilderPage,
});

const DICT_GROUPS: readonly ArchvizPresetGroup[] = [
  "Core Edit",
  "Context & Seasons",
  "Grade & HDRI",
  "Cinema Directors",
  "Photography",
  "Controlled Reference",
  "Marketing & Heritage",
  "3D Asset & Video",
];

const QUICK_KEYWORD_PILLS = [
  "Board-Formed Concrete",
  "Rift-Cut White Oak",
  "2700K Cove Wash",
  "Mirror Reflecting Pool",
  "28mm Tilt-Shift",
  "Honed Travertine",
  "Deep Brise-Soleil Shadows",
  "Volumetric Sun Shafts",
] as const;

function BriefBuilderPage() {
  const navigate = useNavigate();
  const setIdea = useOriel((state) => state.setIdea);
  const setDesignField = useOriel((state) => state.setDesignField);
  const setEngineField = useOriel((state) => state.setEngineField);
  const setScene3DField = useOriel((state) => state.setScene3DField);
  const setFrame = useOriel((state) => state.setFrame);
  const applyBriefTemplateConfig = useOriel((state) => state.applyBriefTemplateConfig);
  const applySharedBriefState = useOriel((state) => state.applySharedBriefState);
  const saveProject = useOriel((state) => state.saveProject);
  const saveBrief = useOriel((state) => state.saveBrief);
  const plate = useOriel((state) => state.plate);
  const upload = useOriel((state) => state.upload);
  const frame = useOriel((state) => state.frame);
  const dictionaryBlocks = useOriel((state) => state.dictionaryBlocks);
  const dictionaryParams = useOriel((state) => state.dictionaryParams);
  const setDictionarySelection = useOriel((state) => state.setDictionarySelection);
  const setDictionaryParam = useOriel((state) => state.setDictionaryParam);
  const savedDictionaryPrompts = useOriel((state) => state.savedDictionaryPrompts);
  const setSavedDictionaryPrompts = useOriel((state) => state.setSavedDictionaryPrompts);

  // Selected Slots
  const [selectedStyle, setSelectedStyle] = useState<BuilderBlock | null>(ARCHITECTURAL_STYLES[0]);
  const [selectedLighting, setSelectedLighting] = useState<BuilderBlock | null>(LIGHTING_CONDITIONS[0]);
  const [selectedMood, setSelectedMood] = useState<BuilderBlock | null>(MOOD_SETTINGS[0]);
  const [selectedCamera, setSelectedCamera] = useState<BuilderBlock | null>(CAMERA_PRESETS[0]);
  const [customNotes, setCustomNotes] = useState(() =>
    buildInitialBuilderNotes(
      ARCHITECTURAL_STYLES[0],
      LIGHTING_CONDITIONS[0],
      MOOD_SETTINGS[0],
      CAMERA_PRESETS[0],
    ),
  );

  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const scene3d = useOriel((state) => state.scene3d);

  // Dictionary & UI States
  const [activeTab, setActiveTab] = useState<BlockCategory | "dictionary">("style");
  const [dictGroup, setDictGroup] = useState<ArchvizPresetGroup>("Core Edit");
  const [activeDictPresetId, setActiveDictPresetId] = useState<string>("facade");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [dictSearch, setDictSearch] = useState("");
  const [previewTab, setPreviewTab] = useState<"spec" | "prompt" | "materials" | "dictionary" | "bim">("spec");
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // Team Collaboration & Parameter Comments state
  const [collabOpen, setCollabOpen] = useState(false);
  const [collabSession, setCollabSession] = useState<SharedBriefSession | null>(null);
  const [isCreatingShare, setIsCreatingShare] = useState(false);
  const [isSyncingShare, setIsSyncingShare] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState("Lead Architect");
  const [reviewerRole, setReviewerRole] = useState<CollabReviewerRole>("Lead Architect");

  // Automated Moodboard Overlay state
  const [moodboardOpen, setMoodboardOpen] = useState(false);
  const [moodboardCustomQuery, setMoodboardCustomQuery] = useState("");
  const [moodboardLoading, setMoodboardLoading] = useState(false);
  const [moodboardError, setMoodboardError] = useState<string | null>(null);
  const [moodboardResult, setMoodboardResult] = useState<MoodboardGenerationResult | null>(null);
  const [pinnedMoodboardIds, setPinnedMoodboardIds] = useState<string[]>([]);

  // Effective dictionary blocks (falls back to selected scenario preset if empty)
  const effectiveDictBlocks = useMemo(
    () => (dictionaryBlocks.length > 0 ? dictionaryBlocks : ["goal", "source", "geometry", "windows", "photo", "exclude", "qc"]),
    [dictionaryBlocks],
  );

  // Composed ARCHVIZ Dictionary Brief with {{param}} interpolation & Conflict Warnings
  const composedDictionary = useMemo(
    () => composeDictionarySelection(effectiveDictBlocks, dictionaryParams, customNotes),
    [effectiveDictBlocks, dictionaryParams, customNotes],
  );

  // Synthesized Vision Document
  const visionDoc = useMemo(
    () => synthesizeVisionDocument(selectedStyle, selectedLighting, selectedMood, selectedCamera, customNotes),
    [selectedStyle, selectedLighting, selectedMood, selectedCamera, customNotes],
  );

  // #20 BIM Material & Lighting Schedule rows
  const bimSchedule = useMemo(
    () => buildMaterialScheduleRows(design, engine, scene3d),
    [design, engine, scene3d],
  );

  // Parsed moodboard queries from active brief
  const moodboardQueries = useMemo(
    () =>
      parseBriefToMoodboardQueries({
        visionDoc,
        selectedStyle,
        selectedLighting,
        selectedMood,
        design,
        engine,
        scene3d,
        customNotes,
        customQueryOverride: moodboardCustomQuery,
      }),
    [visionDoc, selectedStyle, selectedLighting, selectedMood, design, engine, scene3d, customNotes, moodboardCustomQuery],
  );

  // Current collaboration snapshot payload
  const currentCollabSnapshot = useMemo(
    () =>
      buildSharedBriefSnapshot({
        title: visionDoc.title,
        subtitle: visionDoc.subtitle,
        selectedStyle,
        selectedLighting,
        selectedMood,
        selectedCamera,
        customNotes,
        activeDictPresetId,
        dictionaryBlocks: effectiveDictBlocks,
        dictionaryParams,
        activeTemplateId,
        design,
        engine,
        scene3d,
        frame,
        synthesizedPrompt: visionDoc.synthesizedPrompt,
        bimSchedule,
      }),
    [
      visionDoc.title,
      visionDoc.subtitle,
      visionDoc.synthesizedPrompt,
      selectedStyle,
      selectedLighting,
      selectedMood,
      selectedCamera,
      customNotes,
      activeDictPresetId,
      effectiveDictBlocks,
      dictionaryParams,
      activeTemplateId,
      design,
      engine,
      scene3d,
      frame,
      bimSchedule,
    ],
  );

  const hydrateFromSharedSession = useCallback(
    (session: SharedBriefSession) => {
      const snap = session.snapshot;
      setSelectedStyle(
        snap.slotIds.styleId
          ? ARCHITECTURAL_STYLES.find((s) => s.id === snap.slotIds.styleId) ?? null
          : null,
      );
      setSelectedLighting(
        snap.slotIds.lightingId
          ? LIGHTING_CONDITIONS.find((l) => l.id === snap.slotIds.lightingId) ?? null
          : null,
      );
      setSelectedMood(
        snap.slotIds.moodId ? MOOD_SETTINGS.find((m) => m.id === snap.slotIds.moodId) ?? null : null,
      );
      setSelectedCamera(
        snap.slotIds.cameraId
          ? CAMERA_PRESETS.find((c) => c.id === snap.slotIds.cameraId) ?? null
          : null,
      );
      setCustomNotes(snap.customNotes ?? "");
      setActiveDictPresetId(snap.activeDictPresetId || "facade");
      setActiveTemplateId(snap.activeTemplateId ?? null);
      applySharedBriefState(snap);
    },
    [applySharedBriefState],
  );

  // Load ?share=<id> on initial navigation
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedName = window.localStorage.getItem("oriel-collab-name");
    if (savedName) setReviewerName(savedName);

    const shareParam = sanitizeShareId(new URLSearchParams(window.location.search).get("share") ?? "");
    if (!shareParam) return;

    let cancelled = false;
    setIsSyncingShare(true);
    void getSharedBriefFn({ data: { shareId: shareParam } })
      .then((loaded) => {
        if (cancelled) return;
        if (!loaded) {
          toast.error(`Shared brief "${shareParam}" was not found.`);
          return;
        }
        setCollabSession(loaded);
        hydrateFromSharedSession(loaded);
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        toast.success(`Loaded shared brief from ${loaded.authorName}`);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Could not load shared brief.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsSyncingShare(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hydrateFromSharedSession]);

  // Poll server for live collaborator comments while a shared session is active
  const activeShareId = collabSession?.shareId ?? null;
  useEffect(() => {
    if (!activeShareId) return;
    const syncNow = () => {
      void getSharedBriefFn({ data: { shareId: activeShareId } })
        .then((fresh) => {
          if (!fresh) return;
          setCollabSession(fresh);
          setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        })
        .catch(() => undefined);
    };
    const intervalMs = collabOpen ? 2000 : 5000;
    const timer = window.setInterval(syncNow, intervalMs);
    window.addEventListener("focus", syncNow);
    document.addEventListener("visibilitychange", syncNow);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", syncNow);
      document.removeEventListener("visibilitychange", syncNow);
    };
  }, [activeShareId, collabOpen]);

  function handleReviewerNameChange(name: string) {
    setReviewerName(name);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("oriel-collab-name", name);
    }
  }

  async function handleGenerateShareLink() {
    setIsCreatingShare(true);
    try {
      const created = await createSharedBriefFn({
        data: {
          authorName: normalizeAuthorName(reviewerName),
          snapshot: currentCollabSnapshot,
        },
      });
      setCollabSession(created);
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      if (typeof window !== "undefined") {
        const nextUrl = buildBriefShareUrl(window.location.origin, created.shareId);
        window.history.replaceState(null, "", nextUrl);
      }
      toast.success(`Share link created (${created.shareId})`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate share link.");
    } finally {
      setIsCreatingShare(false);
    }
  }

  async function handleSyncSharedSnapshot() {
    if (!collabSession) return;
    setIsSyncingShare(true);
    try {
      const updated = await updateSharedBriefFn({
        data: {
          shareId: collabSession.shareId,
          snapshot: currentCollabSnapshot,
        },
      });
      setCollabSession(updated);
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      toast.success("Synced updated brief parameters to shared link");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sync brief snapshot.");
    } finally {
      setIsSyncingShare(false);
    }
  }

  async function handleRefreshSharedSession() {
    if (!collabSession) return;
    setIsSyncingShare(true);
    try {
      const fresh = await getSharedBriefFn({ data: { shareId: collabSession.shareId } });
      if (fresh) {
        setCollabSession(fresh);
        hydrateFromSharedSession(fresh);
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        toast.success("Synced latest brief & comments");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not refresh shared brief.");
    } finally {
      setIsSyncingShare(false);
    }
  }

  async function handleAddCollabComment(payload: { parameterKey: CollabParameterKey; body: string }) {
    if (!collabSession) return;
    try {
      const created = await addBriefCommentFn({
        data: {
          shareId: collabSession.shareId,
          parameterKey: payload.parameterKey,
          authorName: normalizeAuthorName(reviewerName),
          authorRole: reviewerRole,
          body: payload.body,
        },
      });
      setCollabSession((prev) =>
        prev ? { ...prev, comments: [...prev.comments, created] } : prev,
      );
      toast.success(`Anchored comment to ${created.parameterLabel}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post comment.");
    }
  }

  async function handleToggleCommentStatus(commentId: string, nextStatus: "open" | "resolved") {
    if (!collabSession) return;
    try {
      const updated = await toggleBriefCommentStatusFn({
        data: { shareId: collabSession.shareId, commentId, status: nextStatus },
      });
      setCollabSession((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) => (c.id === updated.id ? updated : c)),
            }
          : prev,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update comment status.");
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!collabSession) return;
    try {
      await deleteBriefCommentFn({
        data: { shareId: collabSession.shareId, commentId },
      });
      setCollabSession((prev) =>
        prev
          ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) }
          : prev,
      );
      toast.message("Comment removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete comment.");
    }
  }

  async function handleRunMoodboard(overrideQuery?: string) {
    const effectiveOverride = overrideQuery !== undefined ? overrideQuery : moodboardCustomQuery;
    if (overrideQuery !== undefined && overrideQuery !== moodboardCustomQuery) {
      setMoodboardCustomQuery(overrideQuery);
    }
    const queriesToRun = parseBriefToMoodboardQueries({
      visionDoc,
      selectedStyle,
      selectedLighting,
      selectedMood,
      design,
      engine,
      scene3d,
      customNotes,
      customQueryOverride: effectiveOverride,
    });
    setMoodboardLoading(true);
    setMoodboardError(null);
    try {
      const res = await generateMoodboardFn({ data: { queries: queriesToRun } });
      setMoodboardResult(res);
    } catch (err) {
      setMoodboardError(err instanceof Error ? err.message : "Public moodboard API lookup failed.");
    } finally {
      setMoodboardLoading(false);
    }
  }

  function handleOpenMoodboard() {
    setMoodboardOpen(true);
    void handleRunMoodboard();
  }

  function handlePinMoodboardItem(item: MoodboardImageItem) {
    if (pinnedMoodboardIds.includes(item.id)) return;
    const note = formatReferenceNoteFromImage(item);
    setCustomNotes((prev) => (prev.trim() ? `${prev.trim()}\n${note}` : note));
    setPinnedMoodboardIds((prev) => [...prev, item.id]);
    toast.success(`Pinned "${item.title}" to Studio Directives`);
  }

  // Drag and Drop Handlers
  function handleDragStart(event: DragEvent<HTMLDivElement>, block: BuilderBlock) {
    event.dataTransfer.setData("application/json", JSON.stringify(block));
    event.dataTransfer.effectAllowed = "copyMove";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>, slotId: string) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    if (dragOverSlot !== slotId) setDragOverSlot(slotId);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOverSlot(null);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetSlot: BlockCategory) {
    event.preventDefault();
    setDragOverSlot(null);
    try {
      const dataStr = event.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const block = JSON.parse(dataStr) as BuilderBlock;

      if (targetSlot === "style" && block.category === "style") {
        setSelectedStyle(block);
        setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "style", block));
        toast.success(`Applied Style: ${block.name}`);
      } else if (targetSlot === "lighting" && block.category === "lighting") {
        setSelectedLighting(block);
        setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "lighting", block));
        toast.success(`Applied Lighting: ${block.name}`);
      } else if (targetSlot === "mood" && block.category === "mood") {
        setSelectedMood(block);
        setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "mood", block));
        toast.success(`Applied Mood: ${block.name}`);
      } else if (targetSlot === "camera" && block.category === "camera") {
        setSelectedCamera(block);
        setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "camera", block));
        toast.success(`Applied Camera: ${block.name}`);
      } else {
        toast.message(`This slot accepts ${targetSlot} blocks. You dragged a ${block.category} block.`);
      }
    } catch {
      toast.error("Could not process dragged item.");
    }
  }

  // Quick-click assignment
  function handleAssignBlock(block: BuilderBlock) {
    if (block.category === "style") {
      setSelectedStyle(block);
      setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "style", block));
      toast.success(`Injected Style: ${block.name}`);
    } else if (block.category === "lighting") {
      setSelectedLighting(block);
      setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "lighting", block));
      toast.success(`Injected Lighting: ${block.name}`);
    } else if (block.category === "mood") {
      setSelectedMood(block);
      setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "mood", block));
      toast.success(`Injected Mood: ${block.name}`);
    } else if (block.category === "camera") {
      setSelectedCamera(block);
      setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "camera", block));
      toast.success(`Injected Camera: ${block.name}`);
    }
  }

  function handleClearSlot(category: "style" | "lighting" | "mood" | "camera") {
    if (category === "style") setSelectedStyle(null);
    if (category === "lighting") setSelectedLighting(null);
    if (category === "mood") setSelectedMood(null);
    if (category === "camera") setSelectedCamera(null);
    setCustomNotes((prev) => syncBuilderSlotToNotes(prev, category, null));
  }

  // Load 4-slot Preset
  function handleLoadPreset(presetId: string) {
    const preset = BUILDER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const style = ARCHITECTURAL_STYLES.find((s) => s.id === preset.styleId) ?? null;
    const light = LIGHTING_CONDITIONS.find((l) => l.id === preset.lightingId) ?? null;
    const mood = MOOD_SETTINGS.find((m) => m.id === preset.moodId) ?? null;
    const camera = CAMERA_PRESETS.find((c) => c.id === preset.cameraId) ?? null;

    setSelectedStyle(style);
    setSelectedLighting(light);
    setSelectedMood(mood);
    setSelectedCamera(camera);
    const syncedSlots = buildInitialBuilderNotes(style, light, mood, camera);
    setCustomNotes(preset.notes ? `${syncedSlots}. ${preset.notes}` : syncedSlots);
    setActiveTemplateId(null);
    toast.success(`Loaded Preset: ${preset.name}`);
  }

  function handleLoadBriefTemplate(template: BriefTemplate) {
    const slots = resolveBriefTemplateSlots(template);
    const compiledNotes = buildTemplateCompiledNotes(template);
    const nextDoc = synthesizeVisionDocument(slots.style, slots.lighting, slots.mood, slots.camera, compiledNotes);

    setSelectedStyle(slots.style);
    setSelectedLighting(slots.lighting);
    setSelectedMood(slots.mood);
    setSelectedCamera(slots.camera);
    setCustomNotes(compiledNotes);
    setActiveDictPresetId(template.dictionaryPresetId);
    setActiveTemplateId(template.id);
    applyBriefTemplateConfig(template, nextDoc.synthesizedPrompt);
    toast.success(`Loaded "${template.name}" template & visual parameters`);
  }

  // Load ARCHVIZ Dictionary Preset (from 46 presets)
  function handleLoadDictionaryPreset(presetId: string) {
    const found = ARCHVIZ_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActiveDictPresetId(found.id);
    setDictionarySelection(found.blocks);
    const blockLabels = found.blocks
      .map((id) => getDictionaryBlock(id)?.en ?? id)
      .filter(Boolean);
    setCustomNotes((prev) => syncDictionaryPresetToNotes(prev, found.name, blockLabels));
    setPreviewTab("dictionary");
    toast.success(`Injected Dictionary Scenario: ${found.name}`);
  }

  function toggleDictBlock(blockId: string) {
    const exists = effectiveDictBlocks.includes(blockId);
    const next = exists ? effectiveDictBlocks.filter((id) => id !== blockId) : [...effectiveDictBlocks, blockId];
    setDictionarySelection(next);
    const block = getDictionaryBlock(blockId);
    if (block) {
      setCustomNotes((prev) => toggleDictionaryBlockInNotes(prev, block.en, !exists));
    }
  }

  function handleQuickKeywordPill(keyword: string) {
    setCustomNotes((prev) => {
      const { notes } = toggleKeywordPillInNotes(prev, keyword);
      return notes;
    });
  }

  // Clear Slots
  function handleResetAll() {
    setSelectedStyle(null);
    setSelectedLighting(null);
    setSelectedMood(null);
    setSelectedCamera(null);
    setDictionarySelection([]);
    setCustomNotes("");
    setActiveTemplateId(null);
    toast.message("Cleared all brief slots & prompt keywords.");
  }

  // Export & Copy
  async function handleCopyMarkdown() {
    try {
      const text = previewTab === "dictionary" ? composedDictionary.text : visionDoc.markdownDoc;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied brief specification.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard copy failed. Please select and copy manually.");
    }
  }

  function handleDownloadMarkdown() {
    const blob = new Blob([`${visionDoc.markdownDoc}\n\n---\n\n## ARCHVIZ Dictionary Structured Prompt\n\n\`\`\`\n${composedDictionary.text}\n\`\`\``], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `architectural-vision-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded vision & dictionary specification.");
  }

  function handleExportDictionaryJson() {
    const entry = {
      id: `brief-${Date.now()}`,
      name: (visionDoc.title || "Architectural Brief").slice(0, 96),
      scenario: activeDictPresetId,
      text: composedDictionary.text,
      blockIds: composedDictionary.keptIds,
      parameters: Object.fromEntries(composedDictionary.activeParamBlocks.map((b) => [b.blockId, b.parameters])),
      createdAt: new Date().toISOString(),
    };
    const nextSaved = [entry, ...savedDictionaryPrompts.filter((p) => p.id !== entry.id)];
    setSavedDictionaryPrompts(nextSaved);
    const json = exportSavedPromptsJson(nextSaved);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `archviz-saved-prompts-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported Saved Prompts JSON (schema_version: 1)");
  }

  function handleDownloadDesignPackHtml() {
    const html = buildDesignPackDocumentHtml({
      title: visionDoc.title || "Oriel Architectural Design Pack",
      prompt: visionDoc.synthesizedPrompt,
      schedule: bimSchedule,
      design,
      engine,
      scene3d,
    });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `oriel-design-pack-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded printable Client Design Pack (.html)");
  }

  function handleDownloadBimJson() {
    const payload = {
      schema: "oriel-bim-v1",
      title: visionDoc.title || "Architectural Vision",
      generatedAt: new Date().toISOString(),
      prompt: visionDoc.synthesizedPrompt,
      schedule: bimSchedule,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `oriel-bim-schedule-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded BIM Material Schedule (.json)");
  }

  async function handleImportDictionaryJson(file: File | undefined) {
    if (!file) return;
    try {
      const text = await file.text();
      const imported = importSavedPromptsJson(text, savedDictionaryPrompts);
      setSavedDictionaryPrompts(imported.prompts);
      const first = imported.prompts[0];
      if (first) {
        setDictionarySelection(first.blockIds, first.parameters);
        setActiveDictPresetId(first.scenario);
        setPreviewTab("dictionary");
      }
      toast.success(`Imported ${imported.added} prompt(s)${imported.skipped ? ` · ${imported.skipped} skipped` : ""}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid Saved Prompts JSON file.");
    }
  }

  // Send to Studio
  function handleSendToStudio() {
    setIdea(visionDoc.synthesizedPrompt);
    setDictionarySelection(composedDictionary.keptIds, dictionaryParams);
    if (selectedStyle) {
      setDesignField("look", selectedStyle.name);
      if (selectedStyle.id === "minimalist-concrete-glass") {
        setScene3DField("preset", "pavilion");
        setScene3DField("primaryMaterial", "concrete");
        setEngineField("facadeTypology", "Minimalist Glass");
      } else if (selectedStyle.id === "brutalist-sculptural") {
        setScene3DField("preset", "villa");
        setScene3DField("primaryMaterial", "concrete");
        setEngineField("facadeTypology", "Board-Marked Concrete");
      } else if (selectedStyle.id === "contemporary-tropical") {
        setScene3DField("preset", "villa");
        setScene3DField("primaryMaterial", "timber");
        setEngineField("facadeTypology", "Biophilic Timber Louver");
        setEngineField("climateRegion", "Subtropical Humid");
      } else if (selectedStyle.id === "nordic-timber-civic") {
        setScene3DField("preset", "civic");
        setScene3DField("primaryMaterial", "brick");
        setEngineField("facadeTypology", "Nordic Brick & Zinc");
      } else if (selectedStyle.id === "industrial-heritage-reuse") {
        setScene3DField("preset", "loft");
        setScene3DField("primaryMaterial", "brick");
      }
    }
    if (selectedLighting) {
      if (selectedLighting.id === "blue-hour-twilight") {
        setDesignField("light", "Evening");
        setScene3DField("sunElevation", 8);
        setScene3DField("sunAzimuth", 245);
      } else if (selectedLighting.id === "golden-hour-raking") {
        setDesignField("light", "Golden hour");
        setScene3DField("sunElevation", 16);
        setScene3DField("sunAzimuth", 118);
      } else if (selectedLighting.id === "soft-overcast-diffused") {
        setDesignField("light", "Soft overcast");
        setScene3DField("sunElevation", 48);
        setScene3DField("fogDensity", 28);
      }
    }
    if (selectedCamera) {
      if (selectedCamera.id === "elevated-site-drone") setScene3DField("cameraPreset", "aerial");
      else if (selectedCamera.id === "intimate-macro-junction") {
        setScene3DField("cameraPreset", "detail");
        setScene3DField("focalLength", 85);
      } else setScene3DField("cameraPreset", "eye");
    }
    toast.success("Synced vision spec, Mid-Layer Dictionary & 3D rig to Studio!");
    void navigate({ to: "/" });
  }

  // Save to Projects + Saved Briefs
  function handleSaveToProject() {
    const name = visionDoc.title || "Vision Brief Project";
    saveProject(name);
    saveBrief({
      title: name,
      boardId: "working",
      model: "flux",
      aspect: "16:9",
      canonical: composedDictionary.text,
      adapted: visionDoc.synthesizedPrompt,
    });
    setIdea(visionDoc.synthesizedPrompt);
    toast.success(`Saved "${name}" to Projects & Briefs archive.`);
  }

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-bg text-fg">
      {/* Top Banner & Header */}
      <div className="shrink-0 border-b border-line bg-surface px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] text-[#b08a45] uppercase">
              Interactive Prompt Architecture · 46 Scenarios · 127 Blocks
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-fg md:text-4xl">
              Brief Builder
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-muted md:text-sm">
              Click any card, dictionary pill, or preset to dynamically inject architectural keywords into the live prompt textarea and compile your vision brief.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-raised px-4 text-xs font-medium text-muted transition hover:border-[#d4b06a] hover:text-fg"
            >
              <RefreshCw className="size-3.5" />
              Reset Slots
            </button>
            <button
              type="button"
              data-testid="open-moodboard-btn"
              onClick={handleOpenMoodboard}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#d4b06a]/60 bg-raised px-4 text-xs font-semibold text-fg transition hover:border-[#b08a45] hover:bg-[#fffaf0]"
            >
              <Grid className="size-3.5 text-[#b08a45]" />
              Moodboard Grid
            </button>
            <button
              type="button"
              data-testid="open-collab-btn"
              onClick={() => setCollabOpen(true)}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#d4b06a]/60 bg-raised px-4 text-xs font-semibold text-fg transition hover:border-[#b08a45] hover:bg-[#fffaf0]"
            >
              <Share2 className="size-3.5 text-[#b08a45]" />
              {collabSession
                ? `Review (${collabSession.comments.filter((c) => c.status === "open").length})`
                : "Share & Review"}
            </button>
            <button
              type="button"
              data-testid="open-pdf-export-btn"
              onClick={() => setPdfModalOpen(true)}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#d4b06a]/60 bg-raised px-4 text-xs font-semibold text-fg transition hover:border-[#b08a45] hover:bg-[#fffaf0]"
            >
              <FileText className="size-3.5 text-[#b08a45]" />
              Export Client PDF
            </button>
            <button
              type="button"
              onClick={handleSendToStudio}
              className="gold-fill inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 text-xs font-semibold text-[#2a1c0c]"
            >
              <Sparkles className="size-3.5" />
              Send to Studio Canvas
              <MoveRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Active Shared Brief Collaboration Banner */}
        {collabSession ? (
          <div
            data-testid="collab-active-banner"
            className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#d4b06a]/50 bg-[#fffaf0] px-4 py-2 text-xs text-fg"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono font-semibold text-[#b08a45]">
                Shared Session · {collabSession.shareId}
              </span>
              <span className="text-muted">Owner: {collabSession.authorName}</span>
              <span className="font-mono text-[11px] tabular-nums text-fg/80">
                {collabSession.comments.length} parameter comment(s)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleSyncSharedSnapshot()}
                disabled={isSyncingShare}
                className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 text-[11px] font-medium text-fg hover:border-[#b08a45]"
              >
                Push Brief Edits
              </button>
              <button
                type="button"
                onClick={() => setCollabOpen(true)}
                className="gold-fill inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-[11px] font-semibold text-[#2a1c0c]"
              >
                Open Review Thread
              </button>
            </div>
          </div>
        ) : null}

        {/* Quick Presets Bar */}
        <div className="no-scrollbar mx-auto mt-4 flex max-w-7xl items-center gap-2 overflow-x-auto pt-1 pb-1">
          <span className="shrink-0 text-xs font-medium text-faint">Fast Presets</span>
          {BUILDER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset.id)}
              className="hover-chip shrink-0 whitespace-nowrap rounded-full border border-line bg-raised px-3 py-1.5 text-xs text-muted"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* 1-Click Mid-Layer Presets Bar */}
        <div className="mx-auto mt-2 max-w-7xl">
          <MidLayerBar
            onApplied={(nextId) => {
              const preset = nextId ? getMidLayerPresetById(nextId) ?? null : null;
              setCustomNotes((prev) => applyMidLayerPromptToIdea(prev, preset));
              setPreviewTab("dictionary");
            }}
          />
        </div>
      </div>

      {/* Pre-Defined Architectural Brief Template Library & Live Visual Config */}
      <BriefTemplateLibrary
        activeTemplateId={activeTemplateId}
        onLoadTemplate={handleLoadBriefTemplate}
        design={design}
        engine={engine}
        scene3d={scene3d}
        frame={frame}
        onUpdateFrame={setFrame}
        onUpdateEngineField={setEngineField}
        onUpdateScene3DField={setScene3DField}
      />

      {/* Main Builder Grid */}
      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-12">
        {/* Left Column: Module Palette */}
        <section className="flex flex-col rounded-3xl border border-line bg-surface p-4 shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-[#b08a45]" />
              <h2 className="font-serif text-lg font-semibold">Architectural Palette</h2>
            </div>
            <span className="text-[11px] text-faint">Drag cards into slots</span>
          </div>

          {/* Palette Category Selector */}
          <div className="mt-3 grid grid-cols-5 gap-1 rounded-2xl bg-raised p-1">
            {(
              [
                ["style", "Style", Wand2],
                ["lighting", "Light", Sun],
                ["mood", "Mood", Sparkles],
                ["camera", "Lens", Camera],
                ["dictionary", "Dict", BookOpen],
              ] as const
            ).map(([catId, label, Icon]) => (
              <button
                key={catId}
                type="button"
                onClick={() => setActiveTab(catId)}
                className={cn(
                  "flex h-9 items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition",
                  activeTab === catId ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>

          {/* Category Items List */}
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
            {activeTab === "style" &&
              ARCHITECTURAL_STYLES.map((block) => (
                <PaletteCard
                  key={block.id}
                  block={block}
                  isSelected={selectedStyle?.id === block.id}
                  onSelect={() => handleAssignBlock(block)}
                  onDragStart={(e) => handleDragStart(e, block)}
                />
              ))}

            {activeTab === "lighting" &&
              LIGHTING_CONDITIONS.map((block) => (
                <PaletteCard
                  key={block.id}
                  block={block}
                  isSelected={selectedLighting?.id === block.id}
                  onSelect={() => handleAssignBlock(block)}
                  onDragStart={(e) => handleDragStart(e, block)}
                />
              ))}

            {activeTab === "mood" &&
              MOOD_SETTINGS.map((block) => (
                <PaletteCard
                  key={block.id}
                  block={block}
                  isSelected={selectedMood?.id === block.id}
                  onSelect={() => handleAssignBlock(block)}
                  onDragStart={(e) => handleDragStart(e, block)}
                />
              ))}

            {activeTab === "camera" &&
              CAMERA_PRESETS.map((block) => (
                <PaletteCard
                  key={block.id}
                  block={block}
                  isSelected={selectedCamera?.id === block.id}
                  onSelect={() => handleAssignBlock(block)}
                  onDragStart={(e) => handleDragStart(e, block)}
                />
              ))}

            {activeTab === "dictionary" && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-faint">
                    Scenario Presets · 46 Workflows
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {DICT_GROUPS.map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setDictGroup(group)}
                        className={cn(
                          "shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                          dictGroup === group
                            ? "gold-fill border-transparent text-[#2a1c0c]"
                            : "border-line bg-raised text-muted hover:text-fg",
                        )}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ARCHVIZ_PRESETS.filter((p) => p.group === dictGroup).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleLoadDictionaryPreset(preset.id)}
                        className={cn(
                          "rounded-lg border px-2.5 py-1.5 text-left text-[11px] transition",
                          activeDictPresetId === preset.id
                            ? "border-[#b08a45] bg-[#d4b06a]/15 font-semibold text-fg"
                            : "border-line bg-raised/70 text-muted hover:border-[#d4b06a] hover:text-fg",
                        )}
                      >
                        {preset.name}
                        <span className="ml-1.5 font-mono text-[10px] tabular-nums text-faint">· {preset.blocks.length}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-line pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-faint">
                      Keyword Blocks · <span className="tabular-nums">{effectiveDictBlocks.length}</span> active / <span className="tabular-nums">{DICTIONARY_BLOCKS.length}</span>
                    </p>
                  </div>
                  <input
                    type="search"
                    value={dictSearch}
                    onChange={(e) => setDictSearch(e.target.value)}
                    placeholder="Filter 127 prompt blocks..."
                    aria-label="Filter dictionary prompt blocks"
                    className="mt-2 h-8 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
                  />
                  <div className="mt-2.5 flex max-h-80 flex-wrap gap-1.5 overflow-y-auto pr-1">
                    {DICTIONARY_BLOCKS.filter((b) => {
                      const q = dictSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        b.en.toLowerCase().includes(q) ||
                        b.id.toLowerCase().includes(q) ||
                        b.section.toLowerCase().includes(q) ||
                        b.text.toLowerCase().includes(q)
                      );
                    }).map((b) => {
                      const active = effectiveDictBlocks.includes(b.id);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => toggleDictBlock(b.id)}
                          title={b.text}
                          aria-pressed={active}
                          className={cn(
                            "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] transition",
                            active
                              ? "gold-fill border-transparent font-medium text-[#2a1c0c]"
                              : "border-line bg-raised text-muted hover:border-[#d4b06a] hover:text-fg",
                          )}
                        >
                          {b.en}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Center / Right Column: Dropzones & Vision Documentation */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Dropzones: Blueprint Assembly */}
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-[#b08a45]" />
                <h2 className="font-serif text-lg font-semibold">Vision Blueprint Slots</h2>
              </div>
              <span className="text-xs text-muted">Drop or click to fill</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Slot 1: Architectural Style */}
              <DropSlot
                category="style"
                title="1. Architectural Style"
                icon={<Wand2 className="size-4 text-[#b08a45]" />}
                block={selectedStyle}
                isDragOver={dragOverSlot === "style"}
                onDragOver={(e) => handleDragOver(e, "style")}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "style")}
                onClear={() => handleClearSlot("style")}
              />

              {/* Slot 2: Lighting Condition */}
              <DropSlot
                category="lighting"
                title="2. Lighting Condition"
                icon={<Sun className="size-4 text-[#b08a45]" />}
                block={selectedLighting}
                isDragOver={dragOverSlot === "lighting"}
                onDragOver={(e) => handleDragOver(e, "lighting")}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "lighting")}
                onClear={() => handleClearSlot("lighting")}
              />

              {/* Slot 3: Mood & Atmosphere */}
              <DropSlot
                category="mood"
                title="3. Mood & Atmosphere"
                icon={<Sparkles className="size-4 text-[#b08a45]" />}
                block={selectedMood}
                isDragOver={dragOverSlot === "mood"}
                onDragOver={(e) => handleDragOver(e, "mood")}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "mood")}
                onClear={() => handleClearSlot("mood")}
              />

              {/* Slot 4: Camera & Angle */}
              <DropSlot
                category="camera"
                title="4. Camera / Composition"
                icon={<Camera className="size-4 text-[#b08a45]" />}
                block={selectedCamera}
                isDragOver={dragOverSlot === "camera"}
                onDragOver={(e) => handleDragOver(e, "camera")}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "camera")}
                onClear={() => handleClearSlot("camera")}
              />
            </div>

            {/* Real-Time Keyword Pill Bar + Prompt Directives Textarea */}
            <div className="mt-4 border-t border-line pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="custom-notes" className="text-xs font-medium text-fg">
                  Live Prompt &amp; Studio Directives
                </label>
                <span className="text-[11px] text-faint">Click pills or cards to inject keywords in real time</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Expert architectural keyword pills">
                {QUICK_KEYWORD_PILLS.map((kw) => {
                  const active = new RegExp(`(?:^|(?<=[.\\s,;\\n]))${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[.\\s,;\\n])`, "i").test(
                    customNotes,
                  );
                  return (
                    <button
                      key={kw}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleQuickKeywordPill(kw)}
                      className={cn(
                        "h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition",
                        active
                          ? "gold-fill border-transparent text-[#2a1c0c]"
                          : "hover-chip border-line bg-raised text-muted hover:text-fg",
                      )}
                    >
                      {active ? `− ${kw}` : `+ ${kw}`}
                    </button>
                  );
                })}
              </div>
              <textarea
                id="custom-notes"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Click any architectural style, lighting, dictionary pill, or type bespoke directives here..."
                rows={4}
                className="mt-2.5 w-full resize-y rounded-2xl border border-line bg-raised px-3.5 py-2.5 font-mono text-xs leading-relaxed text-fg outline-none transition focus:border-[#d4b06a]"
              />
            </div>

            {/* Conflict Warnings & Parameter Slots */}
            {composedDictionary.warnings.length > 0 ? (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-600/40 bg-amber-100/90 px-3 py-2 text-xs text-amber-950"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700" />
                <div>
                  <p className="font-semibold text-amber-950">
                    Conflicting Dictionary Rules Detected ({composedDictionary.warnings.length})
                  </p>
                  <p className="mt-0.5 text-[11px] text-amber-900">
                    {composedDictionary.warnings.map((w) => `${w.labelA} ↔ ${w.labelB}`).join(" · ")}
                  </p>
                </div>
              </div>
            ) : null}

            {composedDictionary.activeParamBlocks.length > 0 ? (
              <div className="mt-3 rounded-2xl border border-line bg-raised/60 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-faint">
                  Parameterized Slots ({"{{key}}"} Interpolation)
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {composedDictionary.activeParamBlocks.map((pb) =>
                    Object.entries(pb.parameters).map(([paramKey, paramVal]) => (
                      <label key={`${pb.blockId}-${paramKey}`} className="block text-[11px]">
                        <span className="text-muted">
                          {pb.label} · <code className="text-[#d4b06a]">{paramKey}</code>
                        </span>
                        <input
                          type="text"
                          value={paramVal}
                          onChange={(e) => setDictionaryParam(pb.blockId, paramKey, e.target.value)}
                          className="mt-1 h-7 w-full rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
                        />
                      </label>
                    )),
                  )}
                </div>
              </div>
            ) : null}
          </section>

          {/* Live Compiled Vision Documentation */}
          <section className="flex flex-1 flex-col rounded-3xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-[#b08a45]" />
                <h2 className="font-serif text-lg font-semibold">Live Vision Documentation</h2>
              </div>

              {/* Preview Tabs */}
              <div className="flex flex-wrap items-center gap-1 rounded-full bg-raised p-1">
                {(
                  [
                    ["spec", "Specification"],
                    ["prompt", "AI Prompt"],
                    ["materials", "Materials"],
                    ["dictionary", "Dictionary"],
                    ["bim", "BIM Schedule"],
                  ] as const
                ).map(([tabId, label]) => (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => setPreviewTab(tabId)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition",
                      previewTab === tabId ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted"
                  title="Copy as Markdown"
                >
                  {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted"
                  title="Download .md file"
                >
                  <Download className="size-3" />
                  Export .md
                </button>
                <button
                  type="button"
                  onClick={handleExportDictionaryJson}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted"
                  title="Export ARCHVIZ Saved Prompts JSON (schema_version: 1)"
                >
                  <Download className="size-3" />
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => jsonInputRef.current?.click()}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted"
                  title="Import ARCHVIZ Saved Prompts JSON"
                >
                  <Upload className="size-3" />
                  Import JSON
                </button>
                <input
                  ref={jsonInputRef}
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={(e) => {
                    void handleImportDictionaryJson(e.target.files?.[0]);
                    e.currentTarget.value = "";
                  }}
                />
                <button
                  type="button"
                  data-testid="toolbar-export-pdf-btn"
                  onClick={() => setPdfModalOpen(true)}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-[#d4b06a]/50 bg-raised px-3 text-xs font-medium text-fg"
                  title="Export formatted Client Presentation PDF"
                >
                  <FileText className="size-3 text-[#b08a45]" />
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={handleSaveToProject}
                  className="gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#2a1c0c]"
                >
                  <Save className="size-3" />
                  Save Brief
                </button>
              </div>
            </div>

            {/* Document Content Views */}
            <div className="mt-4 min-h-64 flex-1 overflow-y-auto pr-1">
              {previewTab === "spec" && (
                <article className="space-y-4 rounded-2xl border border-line/60 bg-raised/50 p-4 text-xs leading-relaxed text-fg">
                  <div>
                    <h3 className="font-serif text-base font-bold text-fg">{visionDoc.title}</h3>
                    <p className="mt-0.5 text-xs text-[#b08a45]">{visionDoc.subtitle}</p>
                    <p className="mt-1 text-[11px] text-faint">Compiled on {visionDoc.date} · Production-Ready</p>
                  </div>

                  <div className="border-t border-line/60 pt-3">
                    <p className="font-semibold text-fg">1. Architectural Style & Massing</p>
                    <p className="mt-1 text-muted">
                      {selectedStyle ? selectedStyle.description : "No architectural style selected yet."}
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-3">
                    <p className="font-semibold text-fg">2. Lighting Condition & Luminance</p>
                    <p className="mt-1 text-muted">
                      {selectedLighting ? selectedLighting.description : "No lighting condition selected yet."}
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-3">
                    <p className="font-semibold text-fg">3. Mood & Spatial Psychology</p>
                    <p className="mt-1 text-muted">
                      {selectedMood ? selectedMood.description : "No mood setting selected yet."}
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-3">
                    <p className="font-semibold text-fg">4. Camera Strategy</p>
                    <p className="mt-1 text-muted">
                      {selectedCamera ? selectedCamera.description : "Default eye-level 28mm architectural lens."}
                    </p>
                  </div>

                  {customNotes ? (
                    <div className="border-t border-line/60 pt-3">
                      <p className="font-semibold text-fg">5. Studio Directives</p>
                      <p className="mt-1 text-muted">{customNotes}</p>
                    </div>
                  ) : null}
                </article>
              )}

              {previewTab === "prompt" && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-line bg-raised p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-fg">Synthesized Diffusion Prompt</span>
                      <span className="text-[10px] text-faint">Optimized for GPT, Midjourney, FLUX & Gemini</span>
                    </div>
                    <p className="mt-2 text-xs font-mono leading-relaxed text-fg/90 select-all">
                      {visionDoc.synthesizedPrompt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between px-1 text-xs text-muted">
                    <span>Ready to paste directly into AI render pipelines or generate in Studio.</span>
                    <button
                      type="button"
                      onClick={handleSendToStudio}
                      className="font-semibold text-[#b08a45] hover:underline"
                    >
                      Open in Studio →
                    </button>
                  </div>
                </div>
              )}

              {previewTab === "materials" && (
                <div className="space-y-4">
                  {selectedStyle?.materials ? (
                    <div className="rounded-2xl border border-line bg-raised p-4">
                      <p className="text-xs font-semibold text-fg">Primary Material Palette</p>
                      <ul className="mt-2 grid grid-cols-2 gap-2">
                        {selectedStyle.materials.map((mat) => (
                          <li key={mat} className="flex items-center gap-2 rounded-xl border border-line bg-surface p-2 text-xs">
                            <span className="size-2.5 rounded-full bg-[#d4b06a]" />
                            <span>{mat}</span>
                          </li>
                        ))}
                      </ul>
                      {selectedStyle.swatches ? (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[11px] text-faint">Tonal Swatches:</span>
                          <div className="flex gap-1.5">
                            {selectedStyle.swatches.map((color) => (
                              <span
                                key={color}
                                className="size-5 rounded-md border border-line/50 shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-xs text-muted">Select an Architectural Style to view its material palette.</p>
                  )}

                  {selectedLighting?.swatches ? (
                    <div className="rounded-2xl border border-line bg-raised p-4">
                      <p className="text-xs font-semibold text-fg">Lighting Temperature & Illuminance Spectrum</p>
                      <p className="mt-1 text-xs text-muted">{selectedLighting.tagline}</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          {selectedLighting.swatches.map((color) => (
                            <span
                              key={color}
                              className="size-5 rounded-md border border-line/50 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {previewTab === "dictionary" && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-line bg-raised p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-fg">
                        ARCHVIZ Prompt Dictionary Output ({composedDictionary.keptIds.length} blocks)
                      </span>
                      <span className="text-[10px] text-faint">
                        Scenario: {activeDictPresetId} · Auto-deduplicated
                      </span>
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-fg/90 select-all">
                      {composedDictionary.text}
                    </pre>
                  </div>
                </div>
              )}

              {previewTab === "bim" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-raised p-3">
                    <span className="text-xs font-semibold text-fg">Prompt-to-BIM Material &amp; Lighting Schedule</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleDownloadBimJson}
                        className="hover-chip inline-flex h-8 items-center gap-1 rounded-full border border-line bg-surface px-3 text-xs text-muted hover:text-fg"
                      >
                        <Download className="size-3" /> BIM JSON
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadDesignPackHtml}
                        className="gold-fill inline-flex h-8 items-center gap-1 rounded-full px-3.5 text-xs font-semibold text-[#2a1c0c]"
                      >
                        <Download className="size-3" /> Design Pack (.html)
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-line bg-raised/60">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-line bg-surface/60 text-[11px] uppercase tracking-wider text-faint">
                          <th className="px-3 py-2">Code</th>
                          <th className="px-3 py-2">Element</th>
                          <th className="px-3 py-2">Specification</th>
                          <th className="px-3 py-2">Swatch</th>
                          <th className="whitespace-nowrap px-3 py-2 text-right">Area %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bimSchedule.map((row) => (
                          <tr key={row.code} className="border-b border-line/50 last:border-0">
                            <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-[#b08a45]">{row.code}</td>
                            <td className="px-3 py-2 font-medium text-fg">{row.element}</td>
                            <td className="px-3 py-2 text-muted">{row.specification}</td>
                            <td className="whitespace-nowrap px-3 py-2">
                              <span className="inline-flex items-center gap-1.5 font-mono text-[10px]">
                                <span className="size-3 rounded border border-line" style={{ backgroundColor: row.finishHex }} />
                                {row.finishHex}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-mono tabular-nums">{row.areaSharePct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <ClientPdfExportModal
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        visionDoc={visionDoc}
        design={design}
        engine={engine}
        scene3d={scene3d}
        frame={frame}
        schedule={bimSchedule}
        dictionarySummary={{
          presetId: activeDictPresetId,
          blockCount: composedDictionary.keptIds.length,
          text: composedDictionary.text,
          warningsCount: composedDictionary.warnings.length,
        }}
        activeTemplateName={BRIEF_TEMPLATES.find((t) => t.id === activeTemplateId)?.name ?? null}
        previewImageUrl={
          plate?.url ??
          upload ??
          BRIEF_TEMPLATES.find((t) => t.id === activeTemplateId)?.previewImage ??
          selectedStyle?.image ??
          "/viz/p01-pavilion-day.jpg"
        }
      />

      <BriefCollabDrawer
        open={collabOpen}
        onClose={() => setCollabOpen(false)}
        session={collabSession}
        activeSnapshot={currentCollabSnapshot}
        isSyncing={isSyncingShare}
        isCreatingShare={isCreatingShare}
        lastSyncedAt={lastSyncedAt}
        reviewerName={reviewerName}
        onReviewerNameChange={handleReviewerNameChange}
        reviewerRole={reviewerRole}
        onReviewerRoleChange={setReviewerRole}
        onGenerateShareLink={handleGenerateShareLink}
        onSyncSnapshot={handleSyncSharedSnapshot}
        onRefreshSession={handleRefreshSharedSession}
        onAddComment={handleAddCollabComment}
        onToggleCommentStatus={handleToggleCommentStatus}
        onDeleteComment={handleDeleteComment}
      />

      <MoodboardOverlay
        open={moodboardOpen}
        onClose={() => setMoodboardOpen(false)}
        queries={moodboardQueries}
        result={moodboardResult}
        loading={moodboardLoading}
        error={moodboardError}
        customQuery={moodboardCustomQuery}
        onCustomQueryChange={setMoodboardCustomQuery}
        onGenerate={handleRunMoodboard}
        onPinToBrief={handlePinMoodboardItem}
        pinnedIds={pinnedMoodboardIds}
      />
    </main>
  );
}

// Subcomponent: Palette Draggable Card
function PaletteCard({
  block,
  isSelected,
  onSelect,
  onDragStart,
}: {
  block: BuilderBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cn(
        "group relative cursor-grab rounded-2xl border p-3 transition active:cursor-grabbing",
        isSelected
          ? "border-[#d4b06a] bg-[#fffaf0] shadow-sm"
          : "border-line bg-raised/40 hover:border-[#d4b06a]/60 hover:bg-raised",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="grid size-6 shrink-0 place-items-center text-faint transition group-hover:text-fg">
            <GripVertical className="size-3.5" />
          </div>
          <div>
            <h4 className="font-medium text-xs text-fg">{block.name}</h4>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{block.tagline}</p>
          </div>
        </div>

        {isSelected ? (
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#d4b06a] text-[10px] text-ink">
            <Check className="size-3" />
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="shrink-0 rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] text-muted hover:border-[#d4b06a] hover:text-fg"
          >
            Select
          </button>
        )}
      </div>

      {block.swatches ? (
        <div className="mt-2.5 flex items-center gap-1.5 pl-8">
          {block.swatches.map((color) => (
            <span
              key={color}
              className="size-3 rounded-full border border-line/40 shadow-xs"
              style={{ backgroundColor: color }}
            />
          ))}
          {block.materials ? (
            <span className="truncate text-[10px] text-faint">
              · {block.materials.slice(0, 2).join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Subcomponent: Dropzone Slot
function DropSlot({
  category,
  title,
  icon,
  block,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear,
}: {
  category: BlockCategory;
  title: string;
  icon: React.ReactNode;
  block: BuilderBlock | null;
  isDragOver: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onClear: () => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border p-3.5 transition",
        isDragOver
          ? "border-2 border-dashed border-[#d4b06a] bg-[#fff8eb] shadow-md"
          : block
            ? "border-line bg-surface shadow-xs"
            : "border-dashed border-line bg-raised/50",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-fg">{title}</span>
        </div>
        {block ? (
          <button
            type="button"
            onClick={onClear}
            className="grid size-6 place-items-center rounded-full text-faint transition hover:bg-raised hover:text-red-600"
            title="Remove block"
          >
            <Trash2 className="size-3" />
          </button>
        ) : null}
      </div>

      <div className="mt-3 min-h-16">
        {block ? (
          <div>
            <p className="font-semibold text-xs text-fg">{block.name}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">{block.description}</p>
            {block.swatches ? (
              <div className="mt-2 flex gap-1">
                {block.swatches.map((color) => (
                  <span
                    key={color}
                    className="size-3.5 rounded border border-line/40 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex h-16 flex-col items-center justify-center text-center">
            <p className="text-[11px] text-faint">Drag a {category} card here</p>
            <p className="text-[10px] text-faint/70">or click &quot;Select&quot; in the palette</p>
          </div>
        )}
      </div>
    </div>
  );
}
