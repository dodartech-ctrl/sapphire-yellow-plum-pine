import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { DEFAULT_FRAME, sanitizeFrame, type Frame } from "@/lib/frame";
import { DEFAULT_PILLS, type PillKey, type Pills } from "@/lib/pills";
import { DEFAULT_DESIGN, GROUPS, LOOKS, sanitizeDesign, type DesignState, type PanelTab, type VerticalId } from "@/lib/properties";
import {
  DEFAULT_ENGINE,
  DEFAULT_SCENE3D,
  WORKFLOW_PRESETS,
  createQueueItem,
  normalizeQueueStatus,
  sanitizeEngineState,
  sanitizeScene3DState,
  updateQueueListStatus,
  type CameraPreset3D,
  type EngineState,
  type PublishedGalleryProject,
  type RenderQueueItem,
  type Scene3DState,
  type WorkflowPreset,
} from "@/lib/engines";
import {
  DEFAULT_HOUSE_STYLES,
  type CameraKeyframe,
  type FloorPlanBlueprint,
  type HouseStyleProfile,
  type PlacedEntourageItem,
  type ReviewPin,
} from "@/lib/archviz-suite";
import {
  applyMidLayerPromptToIdea,
  getMidLayerPresetById,
  type SavedDictionaryPrompt,
} from "@/lib/archviz-dictionary";
import {
  syncAdvancedToIdea,
  syncDesignFieldToIdea,
  syncEngineFieldToIdea,
  syncExtraToIdea,
  syncPickToIdea,
  syncTagToIdea,
  syncTargetToIdea,
  syncWorkflowPresetToIdea,
} from "@/lib/prompt-sync";
import type { ModelId } from "@/lib/types";

export type SavedBrief = {
  id: string;
  title: string;
  boardId: string;
  model: ModelId;
  aspect: string;
  canonical: string;
  adapted: string;
  at: number;
};

export type LogEntry = {
  id: string;
  title: string;
  model: ModelId;
  text: string;
  at: number;
};

export type SeatRequest = {
  id: string;
  studio: string;
  email: string;
  note: string;
  at: number;
};

export type Draft = {
  key: string;
  values: Record<string, string>;
  model: ModelId;
  aspect: string;
};

export type Plate = {
  url: string;
  upload?: string;
  templateId: string;
  idea: string;
  fallback?: boolean;
  seed?: number;
  summary?: string;
};

export type Project = {
  id: string;
  name: string;
  design: DesignState;
  idea: string;
  at: number;
};

export type ChatLine = {
  id: string;
  role: "you" | "studio";
  text: string;
};

export type ConditioningChannels = {
  depth?: string;
  normal?: string;
  clay?: string;
  annotator?: string;
};

type State = {
  favorites: string[];
  boards: { id: string; name: string }[];
  briefs: SavedBrief[];
  savedDictionaryPrompts: SavedDictionaryPrompt[];
  log: LogEntry[];
  requests: SeatRequest[];
  draft: Draft | null;
  plate: Plate | null;
  upload: string | null;
  sketchDataUrl: string | null;
  maskDataUrl: string | null;
  conditioningChannels: ConditioningChannels;
  floorPlanBlueprint: FloorPlanBlueprint | null;
  houseStyles: HouseStyleProfile[];
  cameraKeyframes: CameraKeyframe[];
  entourageItems: PlacedEntourageItem[];
  reviewPins: ReviewPin[];
  variations: string[];
  queue: RenderQueueItem[];
  batchRunning: boolean;
  publishedGallery: PublishedGalleryProject[];
  engine: EngineState;
  scene3d: Scene3DState;
  midLayerPreset: string | null;
  dictionaryBlocks: string[];
  dictionaryParams: Record<string, Record<string, string>>;
  slotValues: Record<string, string>;
  recent: string[];
  activeKey: string;
  pills: Pills;
  design: DesignState;
  idea: string;
  frame: Frame;
  credits: number;
  history: string[];
  projects: Project[];
  chat: ChatLine[];
  busy: boolean;
  selecting: boolean;
  past: DesignState[];
  future: DesignState[];
  toggleFavorite: (id: string) => void;
  addBoard: (name: string) => string;
  saveBrief: (brief: Omit<SavedBrief, "id" | "at">) => void;
  removeBrief: (id: string) => void;
  setSavedDictionaryPrompts: (prompts: SavedDictionaryPrompt[]) => void;
  pushLog: (entry: Omit<LogEntry, "id" | "at">) => void;
  clearLog: () => void;
  setDraft: (draft: Draft) => void;
  setPlate: (plate: Plate | null) => void;
  setUpload: (upload: string | null) => void;
  setSketchDataUrl: (url: string | null) => void;
  setMaskDataUrl: (url: string | null) => void;
  setConditioningChannel: (channel: keyof ConditioningChannels, url?: string) => void;
  clearConditioningChannels: () => void;
  setFloorPlanBlueprint: (blueprint: FloorPlanBlueprint | null) => void;
  addHouseStyle: (profile: HouseStyleProfile) => void;
  removeHouseStyle: (id: string) => void;
  addCameraKeyframe: (kf: CameraKeyframe) => void;
  removeCameraKeyframe: (id: string) => void;
  clearCameraKeyframes: () => void;
  setEntourageItems: (items: PlacedEntourageItem[]) => void;
  addReviewPin: (pin: Omit<ReviewPin, "id" | "number" | "createdAt">) => ReviewPin;
  toggleReviewPinStatus: (id: string) => void;
  removeReviewPin: (id: string) => void;
  setReviewPins: (pins: ReviewPin[]) => void;
  setVariations: (urls: string[]) => void;
  enqueueRender: (
    label: string,
    preset: WorkflowPreset,
    light: string,
    options?: {
      cameraPreset?: CameraPreset3D;
      sunHour?: number;
      promptNote?: string;
      status?: RenderQueueItem["status"];
    },
  ) => RenderQueueItem;
  enqueueBatchMatrix: (
    specs: Array<{
      label: string;
      preset: WorkflowPreset;
      light: string;
      cameraPreset?: CameraPreset3D;
      sunHour?: number;
      promptNote?: string;
    }>,
  ) => RenderQueueItem[];
  updateQueueItem: (id: string, status: RenderQueueItem["status"], url?: string, extra?: { errorMessage?: string }) => void;
  removeQueueItem: (id: string) => void;
  clearCompletedQueue: () => void;
  retryFailedQueue: () => void;
  clearQueue: () => void;
  setBatchRunning: (running: boolean) => void;
  publishToGallery: (entry: Omit<PublishedGalleryProject, "id" | "createdAt">) => PublishedGalleryProject;
  removePublishedProject: (id: string) => void;
  setEngineField: <K extends keyof EngineState>(key: K, value: EngineState[K]) => void;
  applyWorkflowPreset: (preset: WorkflowPreset) => void;
  applyMidLayerPreset: (presetId: string | null) => void;
  setDictionarySelection: (blockIds: string[], params?: Record<string, Record<string, string>>) => void;
  setDictionaryParam: (blockId: string, key: string, value: string) => void;
  resetEngine: () => void;
  setScene3DField: <K extends keyof Scene3DState>(key: K, value: Scene3DState[K]) => void;
  setSlotValues: (slotValues: Record<string, string>) => void;
  touchRecent: (id: string) => void;
  setActiveKey: (activeKey: string) => void;
  setPill: (key: PillKey, value: string) => void;
  setVertical: (vertical: VerticalId) => void;
  setPanel: (panel: PanelTab) => void;
  setDesignField: (
    field: "range" | "look" | "camera" | "light" | "mood" | "people" | "activity" | "color" | "weather" | "time" | "detail" | "strength",
    value: string,
  ) => void;
  setPick: (id: string, value: string) => void;
  setTarget: (target: string) => void;
  setAdvanced: (key: "light" | "air" | "season" | "change" | "grade", value: string) => void;
  toggleExtra: (id: string) => void;
  toggleTag: (tag: string) => void;
  setIdea: (idea: string) => void;
  setFrame: (frame: Frame) => void;
  setCredits: (credits: number) => void;
  setBusy: (busy: boolean) => void;
  setSelecting: (selecting: boolean) => void;
  pushChat: (role: ChatLine["role"], text: string) => void;
  saveProject: (name: string) => void;
  openProject: (id: string) => void;
  removeProject: (id: string) => void;
  undo: () => void;
  redo: () => void;
  addRequest: (request: Omit<SeatRequest, "id" | "at">) => void;
};

function remember(state: { design: DesignState; past: DesignState[] }, design: DesignState) {
  return { design, past: [...state.past, state.design].slice(-20), future: [] as DesignState[] };
}

export const useOriel = create<State>()(
  persist(
    (set, get) => ({
      favorites: [],
      boards: [{ id: "working", name: "Working set" }],
      briefs: [],
      savedDictionaryPrompts: [],
      log: [],
      requests: [],
      draft: null,
      plate: null,
      upload: null,
      sketchDataUrl: null,
      maskDataUrl: null,
      conditioningChannels: {},
      floorPlanBlueprint: null,
      houseStyles: DEFAULT_HOUSE_STYLES,
      cameraKeyframes: [],
      entourageItems: [],
      reviewPins: [],
      variations: [],
      queue: [],
      batchRunning: false,
      publishedGallery: [],
      engine: DEFAULT_ENGINE,
      scene3d: DEFAULT_SCENE3D,
      midLayerPreset: null,
      dictionaryBlocks: [],
      dictionaryParams: {},
      slotValues: {},
      recent: [],
      activeKey: "",
      pills: DEFAULT_PILLS,
      design: DEFAULT_DESIGN,
      idea: "",
      frame: DEFAULT_FRAME,
      credits: 4500,
      history: [],
      projects: [],
      chat: [],
      busy: false,
      selecting: false,
      past: [],
      future: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((item) => item !== id)
            : [id, ...state.favorites],
        })),
      addBoard: (name) => {
        const base =
          name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || "board";
        const id = get().boards.some((board) => board.id === base) ? `${base}-${Date.now()}` : base;
        set((state) => ({ boards: [...state.boards, { id, name: name.trim() || "Untitled" }] }));
        return id;
      },
      saveBrief: (brief) =>
        set((state) => ({
          briefs: [{ ...brief, id: `b-${Date.now()}`, at: Date.now() }, ...state.briefs].slice(0, 48),
        })),
      removeBrief: (id) => set((state) => ({ briefs: state.briefs.filter((item) => item.id !== id) })),
      setSavedDictionaryPrompts: (savedDictionaryPrompts) =>
        set({ savedDictionaryPrompts: savedDictionaryPrompts.slice(0, 200) }),
      pushLog: (entry) =>
        set((state) => ({
          log: [{ ...entry, id: `l-${Date.now()}`, at: Date.now() }, ...state.log].slice(0, 30),
        })),
      clearLog: () => set({ log: [] }),
      setDraft: (draft) => set({ draft }),
      setPlate: (plate) =>
        set((state) => ({
          plate,
          history:
            state.plate?.url && plate && state.plate.url !== plate.url
              ? [state.plate.url, ...state.history.filter((url) => url !== state.plate?.url)].slice(0, 8)
              : state.history,
        })),
      setUpload: (upload) => set({ upload }),
      setSketchDataUrl: (sketchDataUrl) => set({ sketchDataUrl }),
      setMaskDataUrl: (maskDataUrl) => set({ maskDataUrl }),
      setConditioningChannel: (channel, url) =>
        set((state) => ({
          conditioningChannels: { ...state.conditioningChannels, [channel]: url },
        })),
      clearConditioningChannels: () => set({ conditioningChannels: {} }),
      setFloorPlanBlueprint: (floorPlanBlueprint) => set({ floorPlanBlueprint }),
      addHouseStyle: (profile) =>
        set((state) => ({
          houseStyles: [profile, ...state.houseStyles.filter((s) => s.id !== profile.id)].slice(0, 12),
          engine: sanitizeEngineState({ ...state.engine, houseStyleId: profile.id }),
        })),
      removeHouseStyle: (id) =>
        set((state) => ({
          houseStyles: state.houseStyles.filter((s) => s.id !== id),
          engine:
            state.engine.houseStyleId === id
              ? sanitizeEngineState({ ...state.engine, houseStyleId: null })
              : state.engine,
        })),
      addCameraKeyframe: (kf) =>
        set((state) => ({
          cameraKeyframes: [...state.cameraKeyframes, kf].slice(0, 6),
        })),
      removeCameraKeyframe: (id) =>
        set((state) => ({
          cameraKeyframes: state.cameraKeyframes.filter((kf) => kf.id !== id),
        })),
      clearCameraKeyframes: () => set({ cameraKeyframes: [] }),
      setEntourageItems: (entourageItems) => set({ entourageItems: entourageItems.slice(0, 24) }),
      addReviewPin: (pin) => {
        const current = get().reviewPins;
        const projPins = current.filter((p) => p.projectId === pin.projectId);
        const created: ReviewPin = {
          ...pin,
          id: `pin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          number: projPins.length + 1,
          createdAt: Date.now(),
        };
        set({ reviewPins: [...current, created].slice(-60) });
        return created;
      },
      toggleReviewPinStatus: (id) =>
        set((state) => ({
          reviewPins: state.reviewPins.map((p) =>
            p.id === id ? { ...p, status: p.status === "open" ? "resolved" : "open" } : p,
          ),
        })),
      removeReviewPin: (id) =>
        set((state) => ({
          reviewPins: state.reviewPins.filter((p) => p.id !== id),
        })),
      setReviewPins: (pins) =>
        set((state) => {
          const existingIds = new Set(state.reviewPins.map((p) => p.id));
          const merged = [...state.reviewPins, ...pins.filter((p) => !existingIds.has(p.id))];
          return { reviewPins: merged.slice(-60) };
        }),
      setVariations: (variations) => set({ variations: variations.slice(0, 4) }),
      enqueueRender: (label, preset, light, options) => {
        const item = createQueueItem(label, preset, light, options);
        set((state) => ({ queue: [...state.queue, item].slice(-24) }));
        return item;
      },
      enqueueBatchMatrix: (specs) => {
        const items = specs.map((spec) =>
          createQueueItem(spec.label, spec.preset, spec.light, {
            cameraPreset: spec.cameraPreset,
            sunHour: spec.sunHour,
            promptNote: spec.promptNote,
            status: "pending",
          }),
        );
        set((state) => ({ queue: [...state.queue, ...items].slice(-24) }));
        return items;
      },
      updateQueueItem: (id, status, url, extra) =>
        set((state) => ({ queue: updateQueueListStatus(state.queue, id, status, url, extra) })),
      removeQueueItem: (id) => set((state) => ({ queue: state.queue.filter((item) => item.id !== id) })),
      clearCompletedQueue: () =>
        set((state) => ({
          queue: state.queue.filter((item) => normalizeQueueStatus(item.status) !== "completed"),
        })),
      retryFailedQueue: () =>
        set((state) => ({
          queue: state.queue.map((item) =>
            normalizeQueueStatus(item.status) === "error"
              ? { ...item, status: "pending", errorMessage: undefined }
              : item,
          ),
        })),
      clearQueue: () => set({ queue: [], batchRunning: false }),
      setBatchRunning: (batchRunning) => set({ batchRunning }),
      publishToGallery: (entry) => {
        const item: PublishedGalleryProject = {
          ...entry,
          id: `pub-${Date.now()}`,
          createdAt: Date.now(),
        };
        set((state) => ({ publishedGallery: [item, ...state.publishedGallery].slice(0, 12) }));
        return item;
      },
      removePublishedProject: (id) =>
        set((state) => ({ publishedGallery: state.publishedGallery.filter((item) => item.id !== id) })),
      setEngineField: (key, value) =>
        set((state) => ({
          engine: sanitizeEngineState({ ...state.engine, [key]: value }),
          idea: syncEngineFieldToIdea(state.idea, key, value),
        })),
      applyWorkflowPreset: (preset) =>
        set((state) => {
          const found = WORKFLOW_PRESETS.find((item) => item.id === preset);
          return {
            engine: sanitizeEngineState({
              ...state.engine,
              workflowPreset: preset,
              ...(found?.defaults ?? {}),
            }),
            idea: syncWorkflowPresetToIdea(state.idea, preset),
          };
        }),
      applyMidLayerPreset: (presetId) =>
        set((state) => {
          if (!presetId || state.midLayerPreset === presetId) {
            return {
              midLayerPreset: null,
              idea: applyMidLayerPromptToIdea(state.idea, null),
            };
          }
          const preset = getMidLayerPresetById(presetId);
          if (!preset) return state;
          const nextDesign = sanitizeDesign({
            ...state.design,
            ...(preset.designPatch ?? {}),
            advanced: preset.advancedPatch ? { ...state.design.advanced, ...preset.advancedPatch } : state.design.advanced,
          });
          const nextEngine = sanitizeEngineState({
            ...state.engine,
            ...(preset.enginePatch ?? {}),
          });
          const nextScene3D = sanitizeScene3DState({
            ...state.scene3d,
            ...(preset.scene3dPatch ?? {}),
          });
          const nextParams = preset.parameters
            ? { ...state.dictionaryParams, ...preset.parameters }
            : state.dictionaryParams;
          return {
            midLayerPreset: preset.id,
            idea: applyMidLayerPromptToIdea(state.idea, preset),
            dictionaryBlocks: [...preset.blockIds],
            dictionaryParams: nextParams,
            design: nextDesign,
            engine: nextEngine,
            scene3d: nextScene3D,
          };
        }),
      setDictionarySelection: (dictionaryBlocks, params) =>
        set((state) => ({
          dictionaryBlocks: [...dictionaryBlocks].slice(0, 64),
          dictionaryParams: params ?? state.dictionaryParams,
        })),
      setDictionaryParam: (blockId, key, value) =>
        set((state) => ({
          dictionaryParams: {
            ...state.dictionaryParams,
            [blockId]: {
              ...(state.dictionaryParams[blockId] ?? {}),
              [key]: value,
            },
          },
        })),
      resetEngine: () => set({ engine: DEFAULT_ENGINE, midLayerPreset: null }),
      setScene3DField: (key, value) =>
        set((state) => ({
          scene3d: sanitizeScene3DState({ ...state.scene3d, [key]: value }),
        })),
      setSlotValues: (slotValues) => set({ slotValues }),
      touchRecent: (id) =>
        set((state) => ({ recent: [id, ...state.recent.filter((item) => item !== id)].slice(0, 6) })),
      setActiveKey: (activeKey) => set({ activeKey }),
      setPill: (key, value) => set((state) => ({ pills: { ...state.pills, [key]: value } })),
      setVertical: (vertical) =>
        set((state) => {
          const look = LOOKS[vertical].some((item) => item.name === state.design.look)
            ? state.design.look
            : LOOKS[vertical][0].name;
          const picks = Object.fromEntries(GROUPS[vertical].map((group) => [group.id, state.design.picks[group.id] ?? group.options[0]]));
          return remember(state, sanitizeDesign({ ...state.design, vertical, look, picks, panel: "design", target: "whole" }));
        }),
      setPanel: (panel) => set((state) => ({ design: { ...state.design, panel } })),
      setDesignField: (field, value) =>
        set((state) => ({
          ...remember(state, sanitizeDesign({ ...state.design, [field]: value })),
          idea: syncDesignFieldToIdea(state.idea, field, value),
        })),
      setPick: (id, value) =>
        set((state) => {
          const picks = { ...state.design.picks, [id]: value };
          let rooms = state.design.rooms;
          if (state.design.vertical === "interior") {
            const room = id === "room" ? value : (picks.room ?? "Living room");
            if (id === "room" && state.design.rooms[value]) Object.assign(picks, state.design.rooms[value], { room: value });
            rooms = { ...state.design.rooms, [room]: { ...picks } };
          }
          return {
            ...remember(state, sanitizeDesign({ ...state.design, picks, rooms })),
            idea: syncPickToIdea(state.idea, state.design.vertical, id, value),
          };
        }),
      setTarget: (target) =>
        set((state) => ({
          ...remember(state, sanitizeDesign({ ...state.design, target })),
          idea: syncTargetToIdea(state.idea, target),
        })),
      setAdvanced: (key, value) =>
        set((state) => ({
          ...remember(state, sanitizeDesign({ ...state.design, advanced: { ...state.design.advanced, [key]: value } })),
          idea: syncAdvancedToIdea(state.idea, key, value),
        })),
      toggleExtra: (id) =>
        set((state) => {
          const extras = state.design.advanced.extras.includes(id)
            ? state.design.advanced.extras.filter((item) => item !== id)
            : [...state.design.advanced.extras, id];
          return {
            ...remember(state, sanitizeDesign({ ...state.design, advanced: { ...state.design.advanced, extras } })),
            idea: syncExtraToIdea(state.idea, id, extras),
          };
        }),
      toggleTag: (tag) =>
        set((state) => {
          const tags = state.design.tags.includes(tag)
            ? state.design.tags.filter((item) => item !== tag)
            : [...state.design.tags, tag];
          return {
            ...remember(state, sanitizeDesign({ ...state.design, tags })),
            idea: syncTagToIdea(state.idea, tag, tags),
          };
        }),
      setIdea: (idea) => set({ idea }),
      setFrame: (frame) => set({ frame: sanitizeFrame(frame) }),
      setCredits: (credits) => set({ credits: Math.max(0, Math.min(5000, Math.round(credits))) }),
      setBusy: (busy) => set({ busy }),
      setSelecting: (selecting) => set({ selecting }),
      pushChat: (role, text) =>
        set((state) => ({
          chat: [...state.chat, { id: `c-${Date.now()}`, role, text: text.slice(0, 240) }].slice(-12),
        })),
      saveProject: (name) =>
        set((state) => ({
          projects: [
            {
              id: `p-${Date.now()}`,
              name: name.trim().slice(0, 48) || "Untitled",
              design: sanitizeDesign(state.design),
              idea: state.idea,
              at: Date.now(),
            },
            ...state.projects,
          ].slice(0, 24),
        })),
      openProject: (id) =>
        set((state) => {
          const project = state.projects.find((item) => item.id === id);
          if (!project) return state;
          return { design: sanitizeDesign(project.design), idea: project.idea, past: [], future: [] };
        }),
      removeProject: (id) => set((state) => ({ projects: state.projects.filter((item) => item.id !== id) })),
      undo: () =>
        set((state) => {
          const previous = state.past[state.past.length - 1];
          if (!previous) return state;
          return { design: previous, past: state.past.slice(0, -1), future: [state.design, ...state.future].slice(0, 20) };
        }),
      redo: () =>
        set((state) => {
          const next = state.future[0];
          if (!next) return state;
          return { design: next, future: state.future.slice(1), past: [...state.past, state.design].slice(-20) };
        }),
      addRequest: (request) =>
        set((state) => ({
          requests: [{ ...request, id: `r-${Date.now()}`, at: Date.now() }, ...state.requests].slice(0, 12),
        })),
    }),
    {
      name: "oriel-studio",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        boards: state.boards,
        briefs: state.briefs,
        savedDictionaryPrompts: state.savedDictionaryPrompts,
        log: state.log,
        requests: state.requests,
        draft: state.draft,
        recent: state.recent,
        design: state.design,
        engine: state.engine,
        scene3d: state.scene3d,
        houseStyles: state.houseStyles,
        reviewPins: state.reviewPins,
        midLayerPreset: state.midLayerPreset,
        dictionaryBlocks: state.dictionaryBlocks,
        dictionaryParams: state.dictionaryParams,
        publishedGallery: state.publishedGallery.slice(0, 8),
        projects: state.projects,
        idea: state.idea,
        frame: state.frame,
        credits: state.credits,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<State>;
        return {
          ...current,
          ...saved,
          design: sanitizeDesign(saved.design),
          engine: sanitizeEngineState(saved.engine),
          scene3d: sanitizeScene3DState(saved.scene3d),
          houseStyles: Array.isArray(saved.houseStyles) && saved.houseStyles.length ? saved.houseStyles.slice(0, 12) : DEFAULT_HOUSE_STYLES,
          reviewPins: Array.isArray(saved.reviewPins) ? saved.reviewPins.slice(-60) : [],
          midLayerPreset: typeof saved.midLayerPreset === "string" ? saved.midLayerPreset : null,
          dictionaryBlocks: Array.isArray(saved.dictionaryBlocks) ? saved.dictionaryBlocks.slice(0, 64) : [],
          dictionaryParams:
            saved.dictionaryParams && typeof saved.dictionaryParams === "object" ? saved.dictionaryParams : {},
          savedDictionaryPrompts: Array.isArray(saved.savedDictionaryPrompts)
            ? saved.savedDictionaryPrompts.slice(0, 200)
            : [],
          publishedGallery: Array.isArray(saved.publishedGallery) ? saved.publishedGallery.slice(0, 12) : [],
          projects: Array.isArray(saved.projects) ? saved.projects.slice(0, 24) : [],
          idea: typeof saved.idea === "string" ? saved.idea : "",
          frame: sanitizeFrame(saved.frame),
          credits: typeof saved.credits === "number" ? Math.max(0, Math.min(5000, saved.credits)) : 4500,
          busy: false,
          batchRunning: false,
          selecting: false,
          past: [],
          future: [],
        };
      },
    },
  ),
);

export function useHydrated(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    if (useOriel.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsub = useOriel.persist.onFinishHydration(() => {
      if (alive) setReady(true);
    });
    void useOriel.persist.rehydrate();
    return () => {
      alive = false;
      unsub();
    };
  }, []);
  return ready;
}
