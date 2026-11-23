import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  Compass,
  Cpu,
  Crown,
  Folder,
  Images,
  Layers,
  LayoutGrid,
  Library,
  Lightbulb,
  Lock,
  Menu,
  MessageSquare,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Share2,
  Sliders,
  Sun,
  Wand2,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BudgetCapModal } from "@/components/budget-cap-modal";
import { Composer } from "@/components/composer";
import { HeaderSpendChart } from "@/components/header-spend-chart";
import { MarketCopilotDrawer } from "@/components/market-copilot-drawer";
import {
  AgentZukeDrawer,
  GovernanceSettingsModal,
  LookAnchorModal,
  TrackedReviewModal,
} from "@/components/review-mission-modals";
import { NanoBananaOrchestratorDrawer } from "@/components/nano-banana-orchestrator-drawer";
import { getStudioBudget, updateStudioBudget } from "@/lib/budget-fns";
import {
  BUDGET_WARNING_THRESHOLD_PCT,
  estimateRemainingImages,
  formatInrExact,
  formatPaiseShort,
  getBudgetWarningStatus,
  resolveBudgetRenderPlan,
} from "@/lib/budget-guard";
import { resolveRuntimeModelOverride } from "@/lib/nano-banana-client";
import { DISCIPLINES, SCOPE_LABEL, TEMPLATES } from "@/lib/catalog";
import { CREDIT_MAX, getStudioCredits } from "@/lib/credits";
import { StudioHeadSlotContext } from "@/lib/head-slot";
import { NAMED_STUDIOS, type NamedStudioId } from "@/lib/prd-studio-data";
import { VERTICALS } from "@/lib/properties";
import { INTENT_LOOKS_40 } from "@/lib/presets-catalog";
import { STUDIES } from "@/lib/studies";
import { ZUKE_VIZ_PROMPTS_119, inferZukeVertical } from "@/lib/zuke-viz-library";
import { useHydrated, useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "sonner";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Studio Workspace",
  "/explore": "Explore & Scenes",
  "/builder": "Brief Builder",
  "/nodes": "Node Studio",
  "/gallery": "Project Gallery",
  "/studies": "Case Studies",
  "/method": "ArchViz Method",
  "/library": "Templates Library",
  "/projects": "Saved Projects",
  "/assets": "Assets & GLB Library",
  "/plans": "Plans & Credits",
};

function Mark() {
  return (
    <span
      className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#c5a880]/20 text-[#725b38] shadow-[inset_0_0_0_1px_rgba(197,168,128,0.45)] dark:bg-[#cfe3f0]/15 dark:text-[#cfe3f0] dark:shadow-[inset_0_0_0_1px_rgba(207,227,240,0.35)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5">
        <path d="M12 3.2 21 20.2H3L12 3.2Z" fill="currentColor" />
        <path d="M12 8.2 16.2 17.2H7.8L12 8.2Z" fill="var(--ah-bg, #fbf9f5)" />
      </svg>
    </span>
  );
}

export function Shell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lookModalOpen, setLookModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [orchestratorOpen, setOrchestratorOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [dismissedWarningKey, setDismissedWarningKey] = useState<string | null>(null);
  const [contextOpen, setContextOpen] = useState(false);
  const [studioMenuOpen, setStudioMenuOpen] = useState(false);
  const [headSlotEl, setHeadSlotEl] = useState<HTMLDivElement | null>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const studioMenuRef = useRef<HTMLDivElement>(null);
  const lastToastWarningKeyRef = useRef<string | null>(null);

  const appliedSuggestionIds = useOriel((state) => state.appliedSuggestionIds);
  const design = useOriel((state) => state.design);
  const credits = useOriel((state) => state.credits);
  const budget = useOriel((state) => state.budget);
  const setBudgetState = useOriel((state) => state.setBudgetState);
  const updateBudgetConfig = useOriel((state) => state.updateBudgetConfig);
  const nanoBanana = useOriel((state) => state.nanoBanana);
  const log = useOriel((state) => state.log);
  const clearLog = useOriel((state) => state.clearLog);
  const queue = useOriel((state) => state.queue);
  const setCredits = useOriel((state) => state.setCredits);
  const setVertical = useOriel((state) => state.setVertical);
  const saveProject = useOriel((state) => state.saveProject);
  const setUpload = useOriel((state) => state.setUpload);
  const setPlate = useOriel((state) => state.setPlate);
  const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);
  const setSketchDataUrl = useOriel((state) => state.setSketchDataUrl);
  const setIdea = useOriel((state) => state.setIdea);
  const plate = useOriel((state) => state.plate);
  const upload = useOriel((state) => state.upload);
  const idea = useOriel((state) => state.idea);
  const activeStudio = useOriel((state) => state.activeStudio);
  const setActiveStudio = useOriel((state) => state.setActiveStudio);
  const themeMode = useOriel((state) => state.themeMode);
  const setThemeMode = useOriel((state) => state.setThemeMode);
  const lookAnchor = useOriel((state) => state.lookAnchor);
  const trackedReviews = useOriel((state) => state.trackedReviews);
  const navigate = useNavigate();
  const hydrated = useHydrated();

  // Keep DOM <html> class & theme-color synchronized with themeMode
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", themeMode === "dark");
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode]);

  useEffect(() => {
    function openBudget() {
      setBudgetModalOpen(true);
    }
    window.addEventListener("oriel-open-budget", openBudget);
    return () => window.removeEventListener("oriel-open-budget", openBudget);
  }, []);

  function startNewProject() {
    if (plate?.url || upload || idea.trim()) {
      saveProject(`${design.look} · ${design.vertical}`);
    }
    setUpload(null);
    setPlate(null);
    setMaskDataUrl(null);
    setSketchDataUrl(null);
    setIdea("");
    window.dispatchEvent(new CustomEvent("oriel-view", { detail: "source" }));
    if (pathname !== "/") void navigate({ to: "/" });
    toast.success("Fresh Studio project ready (previous draft archived in Projects)");
  }

  function switchStudio(studioId: NamedStudioId) {
    setActiveStudio(studioId);
    if (studioId === "sam-3d") {
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "split" }));
    } else if (studioId === "mas-2d") {
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: useOriel.getState().plate?.url ? "result" : "mask" }));
    } else if (studioId === "king-360") {
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "360" }));
    } else if (studioId === "node-studio") {
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "nodes" }));
    }
    if (pathname !== "/") void navigate({ to: "/" });
  }

  useEffect(() => {
    if (!hydrated) return;
    void getStudioCredits()
      .then((wallet) => setCredits(wallet.credits))
      .catch(() => undefined);
    void getStudioBudget()
      .then((serverState) => {
        const cur = useOriel.getState().budget;
        const mergedSpent = Math.max(cur.spentPaise, serverState.spentPaise);
        const mergedDaily =
          serverState.dailySpend.length > 0 ? serverState.dailySpend : cur.dailySpend;
        setBudgetState({
          ...serverState,
          capPaise: cur.capPaise,
          costMode: cur.costMode,
          maxPerImagePaise: cur.maxPerImagePaise,
          spentPaise: mergedSpent,
          dailySpend: mergedDaily,
        });
      })
      .catch(() => undefined);
  }, [hydrated, setCredits, setBudgetState]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        setOpen(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    function onOpenCopilot() {
      setCopilotOpen(true);
    }
    function onOpenReview() {
      setReviewModalOpen(true);
    }
    function onOpenLook() {
      setLookModalOpen(true);
    }
    function onOpenOrchestrator() {
      setOrchestratorOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("oriel-open-copilot", onOpenCopilot);
    window.addEventListener("oriel-open-review", onOpenReview);
    window.addEventListener("oriel-open-look-anchor", onOpenLook);
    window.addEventListener("oriel-open-orchestrator", onOpenOrchestrator);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("oriel-open-copilot", onOpenCopilot);
      window.removeEventListener("oriel-open-review", onOpenReview);
      window.removeEventListener("oriel-open-look-anchor", onOpenLook);
      window.removeEventListener("oriel-open-orchestrator", onOpenOrchestrator);
    };
  }, []);

  useEffect(() => {
    if (!contextOpen && !studioMenuOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (contextOpen && contextRef.current && !contextRef.current.contains(event.target as Node)) {
        setContextOpen(false);
      }
      if (studioMenuOpen && studioMenuRef.current && !studioMenuRef.current.contains(event.target as Node)) {
        setStudioMenuOpen(false);
      }
    }
    function onEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setContextOpen(false);
        setStudioMenuOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [contextOpen, studioMenuOpen]);

  const activeVerticalLabel = VERTICALS.find((v) => v.id === design.vertical)?.label ?? "Studio";
  const activeStudioMeta = NAMED_STUDIOS.find((st) => st.id === activeStudio) ?? NAMED_STUDIOS[0];

  const hasNotices = log.length > 0 || queue.length > 0;
  const activeRouteLabel = ROUTE_TITLES[pathname] ?? "Studio";
  const openIssueCount = trackedReviews.filter((r) => r.status === "open" || r.status === "in_progress" || r.status === "reopened").length;

  const activeRuntimeModel = resolveRuntimeModelOverride(nanoBanana.requestedModel) ?? "gemini-nano-banana-2.1";
  const activeBudgetPlan = resolveBudgetRenderPlan({
    requestedModel: activeRuntimeModel,
    requestedResolution: nanoBanana.resolution,
    imageCount: 1,
    budget,
  });
  const remainingPaise = Math.max(0, budget.capPaise - budget.spentPaise);
  const budgetWarning = getBudgetWarningStatus(budget);
  const warningActive = budget.costMode !== "free-only" && budgetWarning.level !== "ok";
  const activeWarningKey = warningActive ? `${budget.capPaise}:${budgetWarning.level}` : null;
  const remainingCompact =
    remainingPaise % 100 === 0
      ? `₹${Math.round(remainingPaise / 100)}`
      : `₹${(remainingPaise / 100).toFixed(2)}`;
  const activePerImgCompact = activeBudgetPlan.useCloud
    ? `~${formatPaiseShort(activeBudgetPlan.perImagePaise)}`
    : "₹0";
  const remainingModelRenders = activeBudgetPlan.perImagePaise > 0
    ? estimateRemainingImages(remainingPaise, activeBudgetPlan.perImagePaise)
    : null;
  const activeModelShort =
    nanoBanana.requestedModel === "nano_banana_2_lite"
      ? "NB Lite"
      : nanoBanana.requestedModel === "nano_banana_pro"
        ? "NB Pro"
        : nanoBanana.requestedModel === "nano_banana_2"
          ? "NB 2"
          : "NB 2.1";

  // Trigger a visual toast notification when spending reaches >=80% or 100% of cap
  useEffect(() => {
    if (!hydrated) return;
    if (!activeWarningKey || !warningActive) {
      lastToastWarningKeyRef.current = null;
      return;
    }
    if (lastToastWarningKeyRef.current === activeWarningKey) return;
    lastToastWarningKeyRef.current = activeWarningKey;

    if (budgetWarning.level === "reached") {
      toast.error(`Budget Cap Reached (${formatInrExact(budget.spentPaise)} / ${formatInrExact(budget.capPaise)})`, {
        id: "budget-cap-threshold-toast",
        description: "Cloud spend hit 100% of your cap. Renders automatically switch to Free (₹0) Studio Preview.",
        duration: 8000,
        action: {
          label: "Manage Cap",
          onClick: () => setBudgetModalOpen(true),
        },
      });
    } else if (budgetWarning.level === "warning") {
      const estHint =
        remainingModelRenders !== null
          ? ` (~${remainingModelRenders} ${activeModelShort} renders left)`
          : "";
      toast.warning(
        `Budget Warning: ${budgetWarning.usedPct}% of ${formatInrExact(budget.capPaise)} cap used`,
        {
          id: "budget-cap-threshold-toast",
          description: `${formatInrExact(remainingPaise)} remaining${estHint}. Switch to NB 2 Lite (45p) or Free Preview anytime.`,
          duration: 8000,
          action: {
            label: "Manage Cap",
            onClick: () => setBudgetModalOpen(true),
          },
        },
      );
    }
  }, [
    hydrated,
    activeWarningKey,
    warningActive,
    budgetWarning.level,
    budgetWarning.usedPct,
    budget.spentPaise,
    budget.capPaise,
    remainingPaise,
    remainingModelRenders,
    activeModelShort,
  ]);

  async function switchToFreeFromWarning() {
    updateBudgetConfig({ costMode: "free-only" });
    try {
      const updated = await updateStudioBudget({
        data: {
          costMode: "free-only",
          capPaise: budget.capPaise,
          maxPerImagePaise: budget.maxPerImagePaise,
        },
      });
      setBudgetState(updated);
    } catch {
      // Local state already updated
    }
    toast.success("Switched to Free (₹0) Studio Preview — zero cloud spend");
  }

  function renderNavItems(compact: boolean, onPicked?: () => void) {
    const linkClass = (active: boolean) =>
      cn(
        "flex h-9.5 items-center rounded-xl text-sm transition",
        compact ? "justify-center px-0" : "gap-2.5 px-3",
        active
          ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]"
          : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#16314A]/65 dark:hover:text-[#e8eff3]",
      );

    return (
      <>
        <button
          type="button"
          data-testid="new-project-rail-btn"
          title="New Project (saves active draft to Projects)"
          aria-label="New Project"
          onClick={() => {
            startNewProject();
            onPicked?.();
          }}
          className={cn(
            "mb-1.5 flex h-9 shrink-0 items-center rounded-xl border border-[#c5a880]/45 bg-white/80 text-xs font-medium text-[#1b1c1a] shadow-xs transition hover:border-[#725b38] hover:bg-white dark:border-[#a9bdc9]/25 dark:bg-[#16314A]/55 dark:text-[#e8eff3] dark:hover:border-[#e8c98a]",
            compact ? "justify-center px-0" : "gap-2 px-3",
          )}
        >
          <Plus className="size-4 shrink-0 text-[#725b38] dark:text-[#e8c98a]" />
          {!compact ? <span className="truncate">New Project</span> : null}
        </button>

        <Link to="/" title="Studio Canvas" aria-label="Studio Canvas" onClick={onPicked} className={linkClass(pathname === "/")}>
          <LayoutGrid className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Studio</span> : null}
        </Link>
        <Link to="/explore" search={{ tab: "all" }} title="Explore Scenes & Iterations" aria-label="Explore" onClick={onPicked} className={linkClass(pathname === "/explore")}>
          <Images className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Explore</span> : null}
        </Link>

        <div className={cn("my-2 h-px bg-[#d1c5b8]/45 dark:bg-[#a9bdc9]/20", compact ? "mx-2" : "mx-3")} />
        {!compact ? (
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#5f7f98]">
            Workflows
          </p>
        ) : null}

        <Link to="/builder" title="Brief Builder" aria-label="Brief Builder" onClick={onPicked} className={linkClass(pathname === "/builder")}>
          <Wand2 className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Brief Builder</span> : null}
        </Link>
        <Link to="/nodes" title="Node Studio" aria-label="Node Studio" onClick={onPicked} className={linkClass(pathname === "/nodes")}>
          <Workflow className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Node Studio</span> : null}
        </Link>
        <Link to="/gallery" title="Gallery" aria-label="Gallery" onClick={onPicked} className={linkClass(pathname === "/gallery")}>
          <Images className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Gallery</span> : null}
        </Link>
        <Link to="/studies" title="Studies" aria-label="Studies" onClick={onPicked} className={linkClass(pathname === "/studies")}>
          <BookOpen className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Studies</span> : null}
        </Link>
        <Link to="/method" title="Method" aria-label="Method" onClick={onPicked} className={linkClass(pathname === "/method")}>
          <Compass className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Method</span> : null}
        </Link>

        <div className={cn("my-2 h-px bg-[#d1c5b8]/45 dark:bg-[#a9bdc9]/20", compact ? "mx-2" : "mx-3")} />
        {!compact ? (
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#5f7f98]">
            Library
          </p>
        ) : null}

        <Link to="/library" search={{ scope: "interior" }} title="Templates" aria-label="Templates" onClick={onPicked} className={linkClass(pathname === "/library")}>
          <Library className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Templates</span> : null}
        </Link>
        <Link to="/projects" title="Projects" aria-label="Projects" onClick={onPicked} className={linkClass(pathname === "/projects")}>
          <Folder className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Projects</span> : null}
        </Link>
        <Link to="/assets" title="Assets Library" aria-label="Assets Library" onClick={onPicked} className={linkClass(pathname === "/assets")}>
          <Layers className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Assets Library</span> : null}
        </Link>
      </>
    );
  }

  return (
    <div className="relative flex h-dvh overflow-hidden bg-[#fbf9f5] text-[#1b1c1a] dark:bg-[#08131f] dark:text-[#e8eff3]">
      {/* Arctic / Atelier Atmospheric Glows */}
      <div className="pointer-events-none fixed -top-32 left-1/4 z-0 h-[550px] w-[750px] rounded-full bg-[#fedeb2]/25 blur-[140px] dark:bg-[#16314A]/45" aria-hidden="true" />
      <div className="pointer-events-none fixed top-1/2 right-12 z-0 h-[500px] w-[600px] rounded-full bg-[#ffdbcd]/20 blur-[160px] dark:bg-[#584411]/20" aria-hidden="true" />
      <div className="pointer-events-none fixed -bottom-40 left-10 z-0 h-[450px] w-[500px] rounded-full bg-[#dfe2ed]/30 blur-[130px] dark:bg-[#121c29]/75" aria-hidden="true" />

      {/* Desktop Collapsible Atelier Rail */}
      <aside
        className={cn(
          "relative z-20 hidden h-full shrink-0 flex-col overflow-hidden border-r border-[#d1c5b8]/45 bg-[#f5f3ef]/88 backdrop-blur-xl transition-[width] duration-200 lg:flex dark:border-[#a9bdc9]/20 dark:bg-[#050f1b]/82",
          railCollapsed ? "w-[50px]" : "w-[200px]",
        )}
      >
        <div className={cn("flex h-11 items-center border-b border-[#d1c5b8]/30 dark:border-[#a9bdc9]/15", railCollapsed ? "justify-center px-1.5" : "justify-between px-3")}>
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <Mark />
            {!railCollapsed ? (
              <span className="min-w-0">
                <span className="block truncate font-display text-xs font-semibold uppercase tracking-wider text-[#1b1c1a] dark:text-[#e8eff3]">
                  Oriel · Zukeviz
                </span>
                <span className="block truncate font-display text-[9px] uppercase tracking-[0.14em] text-[#725b38] dark:text-[#e8c98a]">
                  Arctic Harbor
                </span>
              </span>
            ) : null}
          </Link>
        </div>

        <nav className={cn("no-scrollbar flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pt-1.5", railCollapsed ? "px-1.5" : "px-2")} aria-label="Modules">
          {renderNavItems(railCollapsed)}
        </nav>

        <div className="mt-auto space-y-2 p-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            title="Studio Settings & Governance"
            aria-label="Studio Settings"
            className={cn(
              "flex h-9 w-full items-center rounded-xl border border-[#d1c5b8]/45 bg-white/75 text-xs text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/20 dark:bg-[#121c29] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
              railCollapsed ? "justify-center" : "gap-2 px-3",
            )}
          >
            <Sliders className="size-4 shrink-0" />
            {!railCollapsed ? <span>Settings & Policy</span> : null}
          </button>

          {!railCollapsed ? (
            <Link
              to="/plans"
              className="block rounded-2xl border border-[#d1c5b8]/45 bg-white/80 px-3 py-2.5 text-[#1b1c1a] shadow-xs dark:border-[#a9bdc9]/25 dark:bg-[#121c29] dark:text-[#e8eff3]"
            >
              <span className="flex items-center justify-between text-xs font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Crown className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" /> Pro Plan
                </span>
                <span className="text-[#725b38] dark:text-[#cfe3f0]">Upgrade →</span>
              </span>
              <span className="mt-1.5 block font-mono text-[11px] tabular-nums text-[#4d463c] dark:text-[#a9bdc9]" suppressHydrationWarning>
                {credits.toLocaleString()} / {CREDIT_MAX.toLocaleString()} cr
              </span>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-[#e4e2de] dark:bg-[#202b38]" suppressHydrationWarning>
                <span className="block h-full rounded-full bg-[#725b38] dark:bg-[#e8c98a]" style={{ width: `${Math.round((credits / CREDIT_MAX) * 100)}%` }} suppressHydrationWarning />
              </span>
            </Link>
          ) : (
            <Link
              to="/plans"
              title={`Pro Plan (${credits.toLocaleString()} credits)`}
              aria-label="Pro Plan"
              className="mx-auto grid size-10 place-items-center rounded-xl border border-[#d1c5b8]/50 bg-white/75 text-[#725b38] shadow-xs hover:bg-white dark:border-[#a9bdc9]/25 dark:bg-[#121c29] dark:text-[#e8c98a]"
            >
              <Crown className="size-4" />
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileNavOpen ? (
        <div
          className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <aside
            className="flex h-full w-68 flex-col overflow-y-auto border-r border-[#d1c5b8]/50 bg-[#fbf9f5] px-3 py-4 text-[#1b1c1a] shadow-2xl dark:border-[#a9bdc9]/25 dark:bg-[#08131f] dark:text-[#e8eff3]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between px-2">
              <Link to="/" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2">
                <Mark />
                <span className="font-display text-base font-semibold uppercase tracking-wider">
                  Oriel · Zukeviz
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className="grid size-9 place-items-center rounded-xl border border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5" aria-label="Mobile Modules">
              {renderNavItems(false, () => setMobileNavOpen(false))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  setReviewModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#d1c5b8]/50 bg-white px-2.5 py-2 text-xs font-medium text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#121c29] dark:text-[#cfe3f0]"
              >
                <MessageSquare className="size-3.5" />
                Review{openIssueCount > 0 ? ` (${openIssueCount})` : ""}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  setSettingsOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#d1c5b8]/50 bg-white px-2.5 py-2 text-xs font-medium text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#121c29] dark:text-[#cfe3f0]"
              >
                <Sliders className="size-3.5" />
                Settings
              </button>
            </div>
            <Link
              to="/plans"
              onClick={() => setMobileNavOpen(false)}
              className="mt-2 rounded-xl border border-[#d1c5b8]/50 bg-white px-3 py-2.5 text-xs dark:border-[#a9bdc9]/25 dark:bg-[#121c29]"
            >
              <span className="flex items-center justify-between font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Crown className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" /> Pro Plan
                </span>
                <span className="font-mono tabular-nums text-[#725b38] dark:text-[#e8c98a]">{credits.toLocaleString()} cr</span>
              </span>
            </Link>
          </aside>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Unified Single Command Head Bar */}
        <header
          data-testid="studio-header"
          className="relative z-30 flex h-11 shrink-0 items-center justify-between gap-1 border-b border-[#d1c5b8]/35 bg-white/80 px-2 backdrop-blur-2xl shadow-[0_1px_8px_rgba(197,168,128,0.08)] md:px-2.5 dark:border-[#a9bdc9]/20 dark:bg-[#050f1b]/88 dark:shadow-[0_1px_12px_rgba(0,0,0,0.35)]"
        >
          {/* Left Zone: Nav Toggle + Discipline Context + Active Studio Switcher */}
          <div className="flex min-w-0 shrink-0 items-center gap-1.5">
            <button
              type="button"
              data-testid="mobile-menu-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="grid size-7.5 shrink-0 place-items-center rounded-xl border border-[#d1c5b8]/60 bg-white text-[#1b1c1a] lg:hidden dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
            >
              <Menu className="size-4" />
            </button>
            <button
              type="button"
              data-testid="toggle-sidebar-rail-btn"
              onClick={() => setRailCollapsed((v) => !v)}
              aria-label={railCollapsed ? "Expand navigation rail" : "Collapse navigation rail"}
              className="hidden size-7.5 shrink-0 place-items-center rounded-xl border border-[#d1c5b8]/50 bg-[#f5f3ef]/80 text-[#4d463c] transition hover:border-[#725b38] lg:grid dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0]"
            >
              {railCollapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
            </button>

            <div ref={contextRef} className="relative">
              <button
                type="button"
                data-testid="header-context-btn"
                aria-expanded={contextOpen}
                onClick={() => setContextOpen((v) => !v)}
                title="Switch Discipline or Look Anchor Bible"
                className="inline-flex h-7.5 items-center gap-1 rounded-full border border-[#d1c5b8]/50 bg-[#efeeea]/85 px-2 text-[11px] font-medium text-[#1b1c1a] transition hover:border-[#725b38] sm:gap-1.5 sm:px-2.5 dark:border-[#a9bdc9]/25 dark:bg-[#121c29] dark:text-[#e8eff3] dark:hover:border-[#e8c98a]"
              >
                <span className="hidden font-display text-[10px] font-semibold tracking-[0.14em] text-[#725b38] uppercase sm:inline dark:text-[#e8c98a]">
                  Oriel
                </span>
                <span className="font-semibold">{activeVerticalLabel}</span>
                <ChevronDown className={cn("size-3 shrink-0 opacity-70 transition-transform", contextOpen ? "rotate-180" : "")} />
              </button>

              {contextOpen ? (
                <div
                  data-testid="header-context-popover"
                  className="arctic-glass-z2 absolute top-10 left-0 z-50 w-72 max-w-[calc(100vw-1.5rem)] space-y-2.5 rounded-2xl p-3 text-xs text-[#1b1c1a] shadow-2xl dark:text-[#e8eff3]"
                >
                  <div>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                      Architectural Discipline
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {VERTICALS.map((item) => {
                        const active = pathname === "/" && design.vertical === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setVertical(item.id);
                              setContextOpen(false);
                              if (pathname !== "/") void navigate({ to: "/" });
                            }}
                            className={cn(
                              "h-7.5 rounded-xl px-2.5 text-left text-[11px] font-medium transition",
                              active
                                ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                                : "bg-[#efeeea]/85 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#16202d] dark:text-[#a9bdc9]",
                            )}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="sm:hidden">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                      Active Studio
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {NAMED_STUDIOS.map((st) => {
                        const active = pathname === "/" && activeStudio === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              switchStudio(st.id);
                              setContextOpen(false);
                            }}
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
                              active
                                ? "ice-cta"
                                : "bg-[#efeeea]/85 text-[#4d463c] dark:bg-[#16202d] dark:text-[#a9bdc9]",
                            )}
                          >
                            {st.shortLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-[#d1c5b8]/35 pt-2 dark:border-[#a9bdc9]/20">
                    <button
                      type="button"
                      data-testid="look-anchor-pill"
                      onClick={() => {
                        setContextOpen(false);
                        setLookModalOpen(true);
                      }}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#d1c5b8]/50 bg-white/80 px-2.5 py-2 text-left text-[11px] font-medium transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3] dark:hover:border-[#e8c98a]"
                    >
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <Lock className="size-3.5 shrink-0 text-[#725b38] dark:text-[#e8c98a]" />
                        <span className="truncate">{lookAnchor.label}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[9px] uppercase text-[#725b38] dark:text-[#e8c98a]">Bible</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Lean Active Studio Dropdown (Replaces Congested 5-Tab Bar) */}
            <div ref={studioMenuRef} className="relative hidden sm:block" data-testid="studio-switcher-bar">
              <button
                type="button"
                data-testid="studio-switcher-btn"
                aria-expanded={studioMenuOpen}
                onClick={() => setStudioMenuOpen((v) => !v)}
                title={`Active Studio: ${activeStudioMeta.shortLabel} — ${activeStudioMeta.subtitle}`}
                className="ice-cta inline-flex h-7.5 items-center gap-1 rounded-full px-2.5 text-[10.5px] font-semibold transition"
              >
                <span>{activeStudioMeta.shortLabel}</span>
                <ChevronDown className={cn("size-3 opacity-80 transition-transform", studioMenuOpen ? "rotate-180" : "")} />
              </button>

              {studioMenuOpen ? (
                <div
                  data-testid="studio-switcher-popover"
                  className="arctic-glass-z2 absolute top-10 left-0 z-50 w-60 space-y-1 rounded-2xl p-2 text-xs text-[#1b1c1a] shadow-2xl dark:text-[#e8eff3]"
                >
                  <p className="px-2 pt-0.5 pb-1 text-[9.5px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                    Switch Named Studio
                  </p>
                  {NAMED_STUDIOS.map((st) => {
                    const active = pathname === "/" && activeStudio === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        data-testid={`studio-tab-${st.id}`}
                        onClick={() => {
                          switchStudio(st.id);
                          setStudioMenuOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left transition",
                          active
                            ? "bg-[#c5a880]/25 font-semibold text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#e8c98a]"
                            : "text-[#4d463c] hover:bg-[#efeeea]/80 hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#16202d] dark:hover:text-[#e8eff3]",
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold">{st.shortLabel}</p>
                          <p className="truncate text-[9.5px] opacity-75">{st.subtitle}</p>
                        </div>
                        {active ? (
                          <span className="size-1.5 shrink-0 rounded-full bg-[#725b38] dark:bg-[#e8c98a]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          {/* Center Zone: Unified Studio Controls Portal Slot (on /) or Active Route Pill */}
          <div
            id="studio-header-slot"
            ref={setHeadSlotEl}
            className="flex min-w-0 flex-1 items-center justify-center px-0.5"
          />
          {pathname !== "/" ? (
            <span className="hidden rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/75 px-3 py-1 text-[11px] font-medium text-[#4d463c] md:inline-flex dark:border-[#a9bdc9]/20 dark:bg-[#121c29] dark:text-[#cfe3f0]">
              {activeRouteLabel}
            </span>
          ) : null}

          {/* Right Zone: AI Tools Cluster + ₹100 Cap + Review + Share + Notices + Settings + Theme */}
          <div className="relative z-10 flex shrink-0 items-center gap-1">
            <div className="hidden items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-0.5 sm:inline-flex dark:border-[#a9bdc9]/20 dark:bg-[#121c29]">
              <button
                type="button"
                data-testid="open-orchestrator-btn"
                onClick={() => setOrchestratorOpen(true)}
                aria-label="Nano Banana Image Engine & AI Orchestrator"
                title="Nano Banana 2.1 Engine · 12-Stage Orchestrator & Quality Gate"
                className="inline-flex h-6.5 items-center gap-1 rounded-full px-1.5 text-[10px] font-semibold text-[#725b38] transition hover:bg-white/80 hover:text-[#1b1c1a] dark:text-[#cfe3f0] dark:hover:bg-[#202b38]"
              >
                <Cpu className="size-3.5" />
                <span className="hidden 2xl:inline">Engine</span>
              </button>

              <button
                type="button"
                data-testid="open-agent-zuke-btn"
                onClick={() => setAgentOpen(true)}
                aria-label="Agent Zuke Autonomous Mission Runner"
                title="Agent Zuke Autonomous Mission Runner"
                className="hidden h-6.5 items-center gap-1 rounded-full px-1.5 text-[10px] font-semibold text-[#1b1c1a] transition hover:bg-white/80 sm:inline-flex dark:text-[#e8c98a] dark:hover:bg-[#202b38]"
              >
                <Bot className="size-3.5" />
                <span className="hidden 2xl:inline">Agent</span>
              </button>

              <button
                type="button"
                data-testid="open-market-copilot-btn"
                onClick={() => setCopilotOpen(true)}
                aria-label={`Market Copilot (${appliedSuggestionIds.length}/160 applied)`}
                title={`Market Copilot (${appliedSuggestionIds.length}/160 suggestions)`}
                className="inline-flex h-6.5 items-center gap-1 rounded-full bg-[#c5a880] px-1.5 text-[10px] font-semibold text-[#281800] shadow-xs transition hover:bg-[#b8976b] dark:bg-[#202b38] dark:text-[#cfe3f0]"
              >
                <Lightbulb className="size-3 text-[#281800] dark:text-[#e8c98a]" />
                <span className="font-mono text-[9px] tabular-nums opacity-85">
                  {appliedSuggestionIds.length}
                </span>
              </button>

              <Link
                to="/explore"
                data-testid="header-explore-link"
                aria-label="Explore Visual Scenes & Presets"
                title="Explore Visual Scenes & Presets"
                className="hidden h-6.5 items-center gap-1 rounded-full px-1.5 text-[10px] text-[#4d463c] transition hover:bg-white/80 hover:text-[#1b1c1a] sm:inline-flex dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]"
              >
                <Images className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
              </Link>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-6.5 items-center gap-1 rounded-full px-1.5 text-[10px] text-[#4d463c] transition hover:bg-white/80 hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]"
                aria-label="Search the library"
                title="Search library (⌘K)"
              >
                <Search className="size-3.5 text-[#725b38] dark:text-[#cfe3f0]" />
              </button>
            </div>

            {/* Interactive Remaining INR Budget + Live Model Cost-Tracker + 80% Warning Indicator */}
            <button
              type="button"
              data-testid="header-budget-cap-btn"
              data-warning-level={budget.costMode === "free-only" ? "free" : budgetWarning.level}
              onClick={() => setBudgetModalOpen(true)}
              aria-label={`Remaining budget ${formatInrExact(remainingPaise)} of ${formatInrExact(budget.capPaise)} cap (${budgetWarning.usedPct}% used) · ${activeModelShort} ${activePerImgCompact} per image`}
              title={`Remaining Budget: ${formatInrExact(remainingPaise)} of ${formatInrExact(budget.capPaise)} cap (${budgetWarning.usedPct}% used) · ${activeModelShort} (${activeBudgetPlan.effectiveResolution}): ${activePerImgCompact}/img${remainingModelRenders !== null ? ` (~${remainingModelRenders} imgs left)` : " (Free local preview)"}`}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-full px-1.5 font-mono text-[9.5px] font-semibold tabular-nums transition sm:h-7.5 sm:px-2",
                budget.costMode === "free-only"
                  ? "border border-sky-500/40 bg-sky-500/12 text-sky-700 dark:text-sky-300"
                  : budgetWarning.level === "reached"
                    ? "border border-rose-500/55 bg-rose-500/15 text-rose-700 dark:text-rose-300"
                    : budgetWarning.level === "warning"
                      ? "border border-amber-500/60 bg-amber-500/15 text-amber-800 hover:border-amber-500 dark:text-amber-300"
                      : "border border-emerald-500/40 bg-emerald-500/12 text-emerald-700 hover:border-emerald-500/70 dark:text-emerald-300",
              )}
              suppressHydrationWarning
            >
              {warningActive ? (
                <AlertTriangle className="size-3 shrink-0" aria-hidden="true" />
              ) : (
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    budget.costMode === "free-only" ? "bg-sky-500" : "bg-emerald-500",
                  )}
                />
              )}
              <span data-testid="header-budget-remaining">
                {remainingCompact}
                <span className="hidden 2xl:inline"> left</span>
              </span>
              {warningActive ? (
                <span
                  data-testid="header-budget-warning-pct"
                  className="hidden text-[9px] font-bold sm:inline"
                >
                  ({budgetWarning.usedPct}%)
                </span>
              ) : null}
              <span className="opacity-45">·</span>
              <span
                data-testid="header-budget-est-cost"
                className="text-[#513d1d] dark:text-[#e8c98a]"
              >
                {activePerImgCompact}
              </span>
            </button>

            {/* Recharts Compact Daily Spending Bar Chart Widget */}
            <HeaderSpendChart
              budget={budget}
              onOpenBudgetModal={() => setBudgetModalOpen(true)}
            />

            <button
              type="button"
              data-testid="header-review-btn"
              onClick={() => setReviewModalOpen(true)}
              aria-label="Tracked Review & Client Approval"
              title="Tracked Review & Client Approval"
              className="hidden h-7 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2 text-[10px] font-semibold text-[#1b1c1a] transition hover:border-[#725b38] sm:inline-flex sm:h-7.5 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3] dark:hover:border-[#e8c98a]"
            >
              <MessageSquare className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
              <span className="hidden 2xl:inline">Review</span>
              {openIssueCount > 0 ? (
                <span className="hidden rounded-full bg-[#c5a880]/25 px-1 py-0.2 font-mono text-[9px] text-[#513d1d] sm:inline dark:bg-[#202b38] dark:text-[#e8c98a]">
                  {openIssueCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              data-testid="header-share-btn"
              onClick={() => setReviewModalOpen(true)}
              aria-label="Share Studio Review & Client Link"
              title="Share Client Review & Presentation Link"
              className="hidden size-7 shrink-0 place-items-center rounded-full border border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] transition hover:border-[#725b38] hover:text-[#1b1c1a] 2xl:grid sm:size-7.5 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]"
            >
              <Share2 className="size-3.5" />
            </button>

            <button
              type="button"
              data-testid="header-governance-btn"
              onClick={() => setSettingsOpen(true)}
              aria-label="Studio Settings & Governance"
              title="Studio Settings & Governance"
              className="hidden size-7 shrink-0 place-items-center rounded-full border border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] transition hover:border-[#725b38] hover:text-[#1b1c1a] sm:grid sm:size-7.5 lg:hidden 2xl:grid dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]"
            >
              <Sliders className="size-3.5" />
            </button>

            <div className="relative hidden lg:block">
              <button
                type="button"
                data-testid="header-notices-btn"
                onClick={() => setNoticesOpen((v) => !v)}
                className="relative grid size-7.5 shrink-0 place-items-center rounded-full border border-[#d1c5b8]/45 bg-white/75 text-[#4d463c] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"
                aria-label="Studio Render Activity & Notices"
                title="Studio Render Activity & Notices"
                aria-expanded={noticesOpen}
              >
                <Bell className="size-3.5" />
                {hasNotices ? <span className="sr-only">Active notifications</span> : null}
              </button>
              {noticesOpen ? (
                <div
                  data-testid="notices-popover"
                  className="arctic-glass-z2 absolute top-10 right-0 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl p-3 text-[#1b1c1a] dark:text-[#e8eff3]"
                >
                  <div className="flex items-center justify-between border-b border-[#d1c5b8]/40 pb-2 dark:border-[#a9bdc9]/20">
                    <span className="font-display text-sm font-semibold">Studio Render Activity</span>
                    <div className="flex items-center gap-2">
                      {log.length > 0 ? (
                        <button type="button" onClick={() => clearLog()} className="text-[11px] font-medium text-[#725b38] hover:underline dark:text-[#e8c98a]">
                          Clear
                        </button>
                      ) : null}
                      <button type="button" onClick={() => setNoticesOpen(false)} className="grid size-6 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label="Close activity">
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                    {log.length === 0 && queue.length === 0 ? (
                      <p className="py-4 text-center text-xs text-[#4d463c] dark:text-[#a9bdc9]">No render activity yet.</p>
                    ) : (
                      <>
                        {queue.slice(0, 3).map((q) => (
                          <div key={q.id} className="rounded-xl border border-[#d1c5b8]/40 bg-[#f5f3ef]/70 px-2.5 py-2 text-xs dark:border-[#43474b] dark:bg-[#16202d]">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate font-medium">{q.label}</span>
                              <span className="font-mono text-[10px] uppercase text-[#725b38] dark:text-[#e8c98a]">{q.status}</span>
                            </div>
                          </div>
                        ))}
                        {log.slice(0, 8).map((entry) => (
                          <div key={entry.id} className="rounded-xl border border-[#d1c5b8]/35 bg-[#fbf9f5] px-2.5 py-2 text-xs dark:border-[#43474b] dark:bg-[#121c29]">
                            <p className="font-medium">{entry.title}</p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-[#4d463c] dark:text-[#a9bdc9]">{entry.text}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              aria-label={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Arctic Dark Mode"}
              title={themeMode === "dark" ? "Switch to Atelier Light" : "Switch to Arctic Harbor Dark"}
              data-testid="theme-toggle-btn"
              className="grid size-7 shrink-0 place-items-center rounded-full border border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] hover:text-[#1b1c1a] sm:size-7.5 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8c98a]"
            >
              {themeMode === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
          </div>
        </header>

        {/* Visual Budget Cap Warning Banner (>=80% or 100% spend threshold) */}
        {hydrated && warningActive && activeWarningKey && dismissedWarningKey !== activeWarningKey ? (
          <div
            role="status"
            aria-live="polite"
            data-testid="budget-80-warning-banner"
            className={cn(
              "relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-1.5 text-[11px]",
              budgetWarning.level === "reached"
                ? "border-rose-500/35 bg-rose-500/12 text-rose-900 dark:bg-rose-950/55 dark:text-rose-200"
                : "border-amber-500/40 bg-amber-500/14 text-amber-950 dark:bg-amber-950/50 dark:text-amber-200",
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="font-semibold">
                {budgetWarning.level === "reached"
                  ? `Budget cap reached (${budgetWarning.usedPct}%)`
                  : `${BUDGET_WARNING_THRESHOLD_PCT}% Budget Warning (${budgetWarning.usedPct}% used)`}
              </span>
              <span className="hidden opacity-60 sm:inline">·</span>
              <span className="truncate font-mono text-[10.5px] tabular-nums">
                {formatInrExact(budget.spentPaise)} of {formatInrExact(budget.capPaise)} spent ({formatInrExact(remainingPaise)} left)
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                data-testid="budget-warning-switch-free-btn"
                onClick={() => void switchToFreeFromWarning()}
                className="rounded-lg border border-current/25 bg-white/70 px-2 py-0.5 text-[10px] font-semibold transition hover:bg-white dark:bg-[#08131f]/75 dark:hover:bg-[#08131f]"
              >
                Switch to Free (₹0)
              </button>
              <button
                type="button"
                data-testid="budget-warning-manage-btn"
                onClick={() => setBudgetModalOpen(true)}
                className="rounded-lg bg-[#1b1c1a] px-2 py-0.5 text-[10px] font-semibold text-white transition hover:opacity-90 dark:bg-[#e8c98a] dark:text-[#1b1407]"
              >
                Manage Cap
              </button>
              <button
                type="button"
                data-testid="budget-warning-dismiss-btn"
                onClick={() => setDismissedWarningKey(activeWarningKey)}
                aria-label="Dismiss budget warning banner"
                className="grid size-5 place-items-center rounded-md opacity-75 transition hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-1.5 lg:overflow-hidden lg:pb-1">
          <StudioHeadSlotContext.Provider value={headSlotEl}>
            <Outlet />
          </StudioHeadSlotContext.Provider>
        </div>
        {pathname === "/" || pathname === "/explore" || pathname === "/builder" || pathname === "/gallery" || pathname === "/nodes" ? null : <Composer />}
      </div>

      <SearchDialog open={open} onOpenChange={setOpen} />
      <MarketCopilotDrawer open={copilotOpen} onOpenChange={setCopilotOpen} />
      <LookAnchorModal open={lookModalOpen} onClose={() => setLookModalOpen(false)} />
      <TrackedReviewModal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />
      <AgentZukeDrawer open={agentOpen} onClose={() => setAgentOpen(false)} />
      <GovernanceSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <NanoBananaOrchestratorDrawer open={orchestratorOpen} onClose={() => setOrchestratorOpen(false)} />
      <BudgetCapModal open={budgetModalOpen} onClose={() => setBudgetModalOpen(false)} />
      {hydrated ? <Toaster theme={themeMode} position="top-center" /> : null}
    </div>
  );
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const setActiveKey = useOriel((state) => state.setActiveKey);
  const setIdea = useOriel((state) => state.setIdea);
  const setVertical = useOriel((state) => state.setVertical);
  const applyIntentLook = useOriel((state) => state.applyIntentLook);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const studies = STUDIES.map((study) => ({
      id: study.id,
      kind: "study" as const,
      title: study.title,
      meta: `${study.code} · Tested · ${SCOPE_LABEL[study.scope]}`,
      hay: `${study.title} ${study.prompt} ${study.code}`.toLowerCase(),
    }));
    const templates = TEMPLATES.map((template) => ({
      id: template.id,
      kind: "template" as const,
      title: template.title,
      meta: SCOPE_LABEL[template.scope],
      hay: `${template.title} ${template.summary} ${template.prompt}`.toLowerCase(),
    }));
    const zukePrompts = ZUKE_VIZ_PROMPTS_119.map((zv) => ({
      id: zv.id,
      kind: "zuke" as const,
      title: `${zv.id} · ${zv.title}`,
      meta: `ZUKE VIZ · ${zv.category}${zv.aspectRatio ? ` · ${zv.aspectRatio}` : ""}`,
      hay: `${zv.id} ${zv.title} ${zv.category} ${zv.prompt}`.toLowerCase(),
    }));
    const looks = INTENT_LOOKS_40.map((look) => ({
      id: look.id,
      kind: "look" as const,
      title: `${look.code} · ${look.name}`,
      meta: `Intent Look · ${look.fidelity} · ${look.bestFor}`,
      hay: `${look.code} ${look.name} ${look.bestFor} ${look.rules ?? ""}`.toLowerCase(),
    }));
    return [...studies, ...zukePrompts, ...looks, ...templates]
      .filter((item) => !needle || item.hay.includes(needle))
      .slice(0, 10);
  }, [query]);

  function go(kind: "study" | "template" | "zuke" | "look", id: string) {
    onOpenChange(false);
    setQuery("");
    if (kind === "study") {
      setActiveKey(`study:${id}`);
    } else if (kind === "template") {
      setActiveKey(`template:${id}`);
    } else if (kind === "zuke") {
      const zv = ZUKE_VIZ_PROMPTS_119.find((item) => item.id === id);
      if (zv) {
        setIdea(zv.prompt);
        setVertical(inferZukeVertical(zv));
        toast.success(`Loaded ${zv.id} · ${zv.title}`);
      }
    } else if (kind === "look") {
      applyIntentLook(id);
      const lk = INTENT_LOOKS_40.find((item) => item.id === id);
      if (lk) toast.success(`Applied Look ${lk.code} · ${lk.name}`);
    }
    void navigate({ to: "/" });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/55" />
        <Dialog.Content className="arctic-glass-z2 fixed top-[12vh] left-1/2 z-50 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 rounded-3xl p-3 text-[#1b1c1a] dark:text-[#e8eff3]">
          <Dialog.Title className="sr-only">Search the library</Dialog.Title>
          <div className="flex items-center gap-2 px-2">
            <Search className="size-4 text-[#7f766a] dark:text-[#a9bdc9]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ZV-001..119 prompts, 40 Looks, studies & templates"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none"
              suppressHydrationWarning
            />
            <Dialog.Close className="grid size-10 place-items-center text-[#7f766a] dark:text-[#a9bdc9]" aria-label="Close search">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <ul className="mt-2 max-h-80 overflow-y-auto">
            {results.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <button type="button" onClick={() => go(item.kind, item.id)} className="flex w-full flex-col rounded-2xl px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10">
                  <span className="text-sm">{item.title}</span>
                  <span className="text-xs text-[#7f766a] dark:text-[#a9bdc9]">{item.meta}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="px-3 pt-2 text-[10px] uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]">{DISCIPLINES.map((item) => item.label).join(" · ")}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
