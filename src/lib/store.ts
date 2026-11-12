import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { DEFAULT_FRAME, sanitizeFrame, type Frame } from "@/lib/frame";
import { DEFAULT_PILLS, type PillKey, type Pills } from "@/lib/pills";
import { DEFAULT_DESIGN, GROUPS, LOOKS, sanitizeDesign, type DesignState, type PanelTab, type VerticalId } from "@/lib/properties";
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

type State = {
  favorites: string[];
  boards: { id: string; name: string }[];
  briefs: SavedBrief[];
  log: LogEntry[];
  requests: SeatRequest[];
  draft: Draft | null;
  plate: Plate | null;
  upload: string | null;
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
  pushLog: (entry: Omit<LogEntry, "id" | "at">) => void;
  clearLog: () => void;
  setDraft: (draft: Draft) => void;
  setPlate: (plate: Plate | null) => void;
  setUpload: (upload: string | null) => void;
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
      log: [],
      requests: [],
      draft: null,
      plate: null,
      upload: null,
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
        set((state) => remember(state, sanitizeDesign({ ...state.design, [field]: value }))),
      setPick: (id, value) =>
        set((state) => {
          const picks = { ...state.design.picks, [id]: value };
          let rooms = state.design.rooms;
          if (state.design.vertical === "interior") {
            const room = id === "room" ? value : (picks.room ?? "Living room");
            if (id === "room" && state.design.rooms[value]) Object.assign(picks, state.design.rooms[value], { room: value });
            rooms = { ...state.design.rooms, [room]: { ...picks } };
          }
          return remember(state, sanitizeDesign({ ...state.design, picks, rooms }));
        }),
      setTarget: (target) => set((state) => remember(state, sanitizeDesign({ ...state.design, target }))),
      setAdvanced: (key, value) =>
        set((state) =>
          remember(state, sanitizeDesign({ ...state.design, advanced: { ...state.design.advanced, [key]: value } })),
        ),
      toggleExtra: (id) =>
        set((state) => {
          const extras = state.design.advanced.extras.includes(id)
            ? state.design.advanced.extras.filter((item) => item !== id)
            : [...state.design.advanced.extras, id];
          return remember(state, sanitizeDesign({ ...state.design, advanced: { ...state.design.advanced, extras } }));
        }),
      toggleTag: (tag) =>
        set((state) => {
          const tags = state.design.tags.includes(tag)
            ? state.design.tags.filter((item) => item !== tag)
            : [...state.design.tags, tag];
          return remember(state, sanitizeDesign({ ...state.design, tags }));
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
        log: state.log,
        requests: state.requests,
        draft: state.draft,
        recent: state.recent,
        design: state.design,
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
          projects: Array.isArray(saved.projects) ? saved.projects.slice(0, 24) : [],
          idea: typeof saved.idea === "string" ? saved.idea : "",
          frame: sanitizeFrame(saved.frame),
          credits: typeof saved.credits === "number" ? Math.max(0, Math.min(5000, saved.credits)) : 4500,
          busy: false,
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
