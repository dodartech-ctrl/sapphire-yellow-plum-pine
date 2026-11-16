import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Bell,
  BookOpen,
  Compass,
  Crown,
  Folder,
  Images,
  Layers,
  LayoutGrid,
  Library,
  Lightbulb,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Wand2,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Composer } from "@/components/composer";
import { MarketCopilotDrawer } from "@/components/market-copilot-drawer";
import { DISCIPLINES, SCOPE_LABEL, TEMPLATES } from "@/lib/catalog";
import { CREDIT_MAX, getStudioCredits } from "@/lib/credits";
import { VERTICALS } from "@/lib/properties";
import { STUDIES } from "@/lib/studies";
import { useHydrated, useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "sonner";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Studio Workspace",
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
      className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#c5a880]/20 text-[#725b38] shadow-[inset_0_0_0_1px_rgba(197,168,128,0.45)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5">
        <path d="M12 3.2 21 20.2H3L12 3.2Z" fill="currentColor" />
        <path d="M12 8.2 16.2 17.2H7.8L12 8.2Z" fill="#fbf9f5" />
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
  const appliedSuggestionIds = useOriel((state) => state.appliedSuggestionIds);
  const design = useOriel((state) => state.design);
  const credits = useOriel((state) => state.credits);
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
  const navigate = useNavigate();
  const hydrated = useHydrated();

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

  useEffect(() => {
    if (!hydrated) return;
    void getStudioCredits()
      .then((wallet) => setCredits(wallet.credits))
      .catch(() => undefined);
  }, [hydrated, setCredits]);

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
    window.addEventListener("keydown", onKey);
    window.addEventListener("oriel-open-copilot", onOpenCopilot);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("oriel-open-copilot", onOpenCopilot);
    };
  }, []);

  const hasNotices = log.length > 0 || queue.length > 0;
  const activeRouteLabel = ROUTE_TITLES[pathname] ?? "Studio";

  function renderNavItems(compact: boolean, onPicked?: () => void) {
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
            "mb-1.5 flex h-9 shrink-0 items-center rounded-xl border border-[#c5a880]/45 bg-white/80 text-xs font-medium text-[#1b1c1a] shadow-xs transition hover:border-[#725b38] hover:bg-white",
            compact ? "justify-center px-0" : "gap-2 px-3",
          )}
        >
          <Plus className="size-4 shrink-0 text-[#725b38]" />
          {!compact ? <span className="truncate">New Project</span> : null}
        </button>

        <Link
          to="/"
          title="Studio Canvas"
          aria-label="Studio Canvas"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <LayoutGrid className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Studio</span> : null}
        </Link>

        <div className={cn("my-2 h-px bg-[#d1c5b8]/45", compact ? "mx-2" : "mx-3")} />
        {!compact ? (
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f766a]">
            Workflows
          </p>
        ) : null}

        <Link
          to="/builder"
          title="Brief Builder"
          aria-label="Brief Builder"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/builder"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <Wand2 className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Brief Builder</span> : null}
        </Link>
        <Link
          to="/nodes"
          title="Node Studio"
          aria-label="Node Studio"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/nodes"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <Workflow className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Node Studio</span> : null}
        </Link>
        <Link
          to="/gallery"
          title="Gallery"
          aria-label="Gallery"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/gallery"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <Images className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Gallery</span> : null}
        </Link>
        <Link
          to="/studies"
          title="Studies"
          aria-label="Studies"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/studies"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <BookOpen className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Studies</span> : null}
        </Link>
        <Link
          to="/method"
          title="Method"
          aria-label="Method"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/method"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <Compass className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Method</span> : null}
        </Link>

        <div className={cn("my-2 h-px bg-[#d1c5b8]/45", compact ? "mx-2" : "mx-3")} />
        {!compact ? (
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f766a]">
            Library
          </p>
        ) : null}

        <Link
          to="/library"
          search={{ scope: "interior" }}
          title="Templates"
          aria-label="Templates"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/library"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <Library className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Templates</span> : null}
        </Link>
        <Link
          to="/projects"
          title="Projects"
          aria-label="Projects"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/projects"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <Folder className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Projects</span> : null}
        </Link>
        <Link
          to="/assets"
          title="Assets Library"
          aria-label="Assets Library"
          onClick={onPicked}
          className={cn(
            "flex h-9.5 items-center rounded-xl text-sm transition",
            compact ? "justify-center px-0" : "gap-2.5 px-3",
            pathname === "/assets"
              ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
              : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]",
          )}
        >
          <Layers className="size-4 shrink-0" />
          {!compact ? <span className="truncate">Assets Library</span> : null}
        </Link>
      </>
    );
  }

  return (
    <div className="relative flex h-dvh overflow-hidden bg-[#fbf9f5] text-[#1b1c1a]">
      {/* Subtle Atelier Warm Ambient Glows */}
      <div className="pointer-events-none fixed -top-32 left-1/4 z-0 h-[550px] w-[750px] rounded-full bg-[#fedeb2]/25 blur-[140px]" aria-hidden="true" />
      <div className="pointer-events-none fixed top-1/2 right-12 z-0 h-[500px] w-[600px] rounded-full bg-[#ffdbcd]/20 blur-[160px]" aria-hidden="true" />
      <div className="pointer-events-none fixed -bottom-40 left-10 z-0 h-[450px] w-[500px] rounded-full bg-[#dfe2ed]/30 blur-[130px]" aria-hidden="true" />

      {/* Desktop Collapsible Atelier Rail */}
      <aside
        className={cn(
          "relative z-20 hidden h-full shrink-0 flex-col overflow-hidden border-r border-[#d1c5b8]/45 bg-[#f5f3ef]/88 backdrop-blur-xl transition-[width] duration-200 lg:flex",
          railCollapsed ? "w-[64px]" : "w-[216px]",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-[#d1c5b8]/30", railCollapsed ? "justify-center px-2" : "justify-between px-4")}>
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <Mark />
            {!railCollapsed ? (
              <span className="min-w-0">
                <span className="block truncate font-serif text-sm font-semibold uppercase tracking-wider text-[#1b1c1a]">
                  Oriel · Atelier
                </span>
                <span className="block truncate font-serif text-[10px] uppercase tracking-[0.16em] text-[#725b38]">
                  Spatial Studio
                </span>
              </span>
            ) : null}
          </Link>
        </div>

        <nav className={cn("no-scrollbar flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pt-3", railCollapsed ? "px-2" : "px-2.5")} aria-label="Modules">
          {renderNavItems(railCollapsed)}
        </nav>

        {!railCollapsed ? (
          <Link
            to="/plans"
            className="mx-3 mt-auto mb-3 rounded-2xl border border-[#d1c5b8]/45 bg-white/80 px-3 py-2.5 text-[#1b1c1a] shadow-xs"
          >
            <span className="flex items-center justify-between text-xs font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Crown className="size-3.5 text-[#725b38]" /> Pro Plan
              </span>
              <span className="text-[#725b38]">Upgrade →</span>
            </span>
            <span className="mt-1.5 block font-mono text-[11px] tabular-nums text-[#4d463c]" suppressHydrationWarning>
              {credits.toLocaleString()} / {CREDIT_MAX.toLocaleString()} cr
            </span>
            <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-[#e4e2de]" suppressHydrationWarning>
              <span className="block h-full rounded-full bg-[#725b38]" style={{ width: `${Math.round((credits / CREDIT_MAX) * 100)}%` }} suppressHydrationWarning />
            </span>
          </Link>
        ) : (
          <Link
            to="/plans"
            title={`Pro Plan (${credits.toLocaleString()} credits)`}
            aria-label="Pro Plan"
            className="mx-auto mt-auto mb-3 grid size-10 place-items-center rounded-xl border border-[#d1c5b8]/50 bg-white/75 text-[#725b38] shadow-xs hover:bg-white"
          >
            <Crown className="size-4" />
          </Link>
        )}
      </aside>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileNavOpen ? (
        <div
          className="fixed inset-0 z-50 flex bg-black/45 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <aside
            className="flex h-full w-68 flex-col overflow-y-auto border-r border-[#d1c5b8]/50 bg-[#fbf9f5] px-3 py-4 text-[#1b1c1a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between px-2">
              <Link to="/" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2">
                <Mark />
                <span className="font-serif text-base font-semibold uppercase tracking-wider text-[#1b1c1a]">
                  Oriel · Atelier
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className="grid size-9 place-items-center rounded-xl border border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:text-[#1b1c1a]"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5" aria-label="Mobile Modules">
              {renderNavItems(false, () => setMobileNavOpen(false))}
            </nav>
            <Link
              to="/plans"
              onClick={() => setMobileNavOpen(false)}
              className="mt-4 rounded-xl border border-[#d1c5b8]/50 bg-white px-3 py-2.5 text-xs text-[#1b1c1a]"
            >
              <span className="flex items-center justify-between font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Crown className="size-3.5 text-[#725b38]" /> Pro Plan
                </span>
                <span className="font-mono tabular-nums text-[#725b38]">{credits.toLocaleString()} cr</span>
              </span>
            </Link>
          </aside>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Frosted Glass Atelier Header */}
        <header className="relative z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#d1c5b8]/35 bg-white/70 px-3 backdrop-blur-2xl shadow-[0_1px_8px_rgba(197,168,128,0.08)] md:px-6">
          {/* Zone 1: Collapse / Menu + Atelier Context */}
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              data-testid="mobile-menu-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#d1c5b8]/60 bg-white text-[#1b1c1a] lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <button
              type="button"
              data-testid="toggle-sidebar-rail-btn"
              onClick={() => setRailCollapsed((v) => !v)}
              aria-label={railCollapsed ? "Expand navigation rail" : "Collapse navigation rail"}
              title={railCollapsed ? "Show sidebar labels" : "Expand canvas width"}
              className="hidden size-9 shrink-0 place-items-center rounded-xl border border-[#d1c5b8]/50 bg-[#f5f3ef]/80 text-[#4d463c] transition hover:border-[#725b38] hover:text-[#1b1c1a] lg:grid"
            >
              {railCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <Mark />
              <span className="font-serif text-sm font-semibold uppercase tracking-wider text-[#1b1c1a]">
                Oriel
              </span>
            </Link>
            <div className="hidden items-center gap-2 text-xs text-[#4d463c] lg:flex">
              <span className="font-serif font-semibold tracking-wider text-[#1b1c1a] uppercase">
                Oriel · Atelier
              </span>
              <span aria-hidden="true" className="text-[#c5a880]">/</span>
              <span className="truncate font-medium text-[#4d463c]">
                {pathname === "/" ? `${design.look} · ${activeRouteLabel}` : activeRouteLabel}
              </span>
            </div>
          </div>

          {/* Zone 2: Clean Frosted Discipline Quick-Switch */}
          <nav
            className="no-scrollbar hidden min-w-0 items-center gap-1 rounded-full bg-[#efeeea]/80 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] md:flex"
            aria-label="Space mode"
          >
            {VERTICALS.map((item) => {
              const active = pathname === "/" && design.vertical === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setVertical(item.id);
                    if (pathname !== "/") void navigate({ to: "/" });
                  }}
                  className={cn(
                    "h-7.5 shrink-0 whitespace-nowrap rounded-full px-3.5 text-xs tracking-wide transition",
                    active
                      ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs"
                      : "text-[#4d463c] hover:text-[#1b1c1a]",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Quick Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              data-testid="open-market-copilot-btn"
              onClick={() => setCopilotOpen(true)}
              aria-label="Market Copilot"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#c5a880] px-3 text-xs font-semibold text-[#281800] shadow-xs transition hover:bg-[#b8976b]"
            >
              <Lightbulb className="size-3.5" />
              <span className="hidden sm:inline">Copilot</span>
              <span className="font-mono text-[11px] tabular-nums opacity-85">
                ({appliedSuggestionIds.length}/160)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#efeeea]/80 px-3 text-xs text-[#4d463c] transition hover:bg-[#efeeea] hover:text-[#1b1c1a]"
              aria-label="Search the library"
            >
              <Search className="size-3.5 text-[#725b38]" />
              <span className="hidden xl:inline">Command</span>
              <kbd className="hidden rounded bg-[#eae8e4] px-1.5 py-0.5 font-mono text-[10px] text-[#4d463c] xl:inline">⌘K</kbd>
            </button>

            <Link
              to="/plans"
              aria-label="Credits and Plans"
              className="hidden h-9 items-center gap-1.5 rounded-full bg-[#c5a880]/20 px-3 font-mono text-xs font-medium tabular-nums text-[#513d1d] shadow-[inset_0_0_0_1px_rgba(197,168,128,0.4)] hover:bg-[#c5a880]/30 sm:inline-flex"
              suppressHydrationWarning
            >
              <Crown className="size-3.5 text-[#725b38]" />
              {credits.toLocaleString()} / 5k CR
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNoticesOpen((v) => !v)}
                className="relative grid size-9 shrink-0 place-items-center rounded-full text-[#4d463c] transition hover:bg-[#eae8e4] hover:text-[#1b1c1a]"
                aria-label="Notices"
                aria-expanded={noticesOpen}
              >
                <Bell className="size-4" />
                {hasNotices ? <span className="sr-only">Active notifications</span> : null}
              </button>
              {noticesOpen ? (
                <div
                  data-testid="notices-popover"
                  className="absolute top-11 right-0 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#d1c5b8]/60 bg-white/95 p-3 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-[#d1c5b8]/40 pb-2">
                    <span className="font-serif text-sm font-semibold text-[#1b1c1a]">Studio Render Activity</span>
                    <div className="flex items-center gap-2">
                      {log.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => clearLog()}
                          className="text-[11px] font-medium text-[#725b38] hover:underline"
                        >
                          Clear
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setNoticesOpen(false)}
                        className="grid size-6 place-items-center rounded-full text-[#7f766a] hover:bg-[#f5f3ef]"
                        aria-label="Close activity"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                    {log.length === 0 && queue.length === 0 ? (
                      <p className="py-4 text-center text-xs text-[#4d463c]">No render activity yet. Generate a plate or run a batch pass.</p>
                    ) : (
                      <>
                        {queue.slice(0, 3).map((q) => (
                          <div key={q.id} className="rounded-xl border border-[#d1c5b8]/40 bg-[#f5f3ef]/70 px-2.5 py-2 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate font-medium text-[#1b1c1a]">{q.label}</span>
                              <span className="font-mono text-[10px] uppercase text-[#725b38]">{q.status}</span>
                            </div>
                          </div>
                        ))}
                        {log.slice(0, 8).map((entry) => (
                          <div key={entry.id} className="rounded-xl border border-[#d1c5b8]/35 bg-[#fbf9f5] px-2.5 py-2 text-xs">
                            <p className="font-medium text-[#1b1c1a]">{entry.title}</p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-[#4d463c]">{entry.text}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
          <Outlet />
        </div>
        {pathname === "/" || pathname === "/builder" || pathname === "/gallery" || pathname === "/nodes" ? null : <Composer />}
      </div>
      <SearchDialog open={open} onOpenChange={setOpen} />
      <MarketCopilotDrawer open={copilotOpen} onOpenChange={setCopilotOpen} />
      {hydrated ? <Toaster theme="light" position="bottom-center" /> : null}
    </div>
  );
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const setActiveKey = useOriel((state) => state.setActiveKey);
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
    return [...studies, ...templates].filter((item) => !needle || item.hay.includes(needle)).slice(0, 8);
  }, [query]);

  function go(kind: "study" | "template", id: string) {
    onOpenChange(false);
    setQuery("");
    if (kind === "study") setActiveKey(`study:${id}`);
    else setActiveKey(`template:${id}`);
    void navigate({ to: "/" });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-rail/45" />
        <Dialog.Content className="fixed top-[12vh] left-1/2 z-50 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 rounded-3xl border border-line bg-surface p-3 shadow-2xl">
          <Dialog.Title className="sr-only">Search the library</Dialog.Title>
          <div className="flex items-center gap-2 px-2">
            <Search className="size-4 text-faint" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search studies and templates"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none"
              suppressHydrationWarning
            />
            <Dialog.Close className="grid size-10 place-items-center text-faint" aria-label="Close search">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <ul className="mt-2 max-h-80 overflow-y-auto">
            {results.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <button type="button" onClick={() => go(item.kind, item.id)} className="flex w-full flex-col rounded-2xl px-3 py-2 text-left hover:bg-raised">
                  <span className="text-sm text-fg">{item.title}</span>
                  <span className="text-xs text-faint">{item.meta}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="px-3 pt-2 text-[10px] uppercase tracking-wide text-faint">{DISCIPLINES.map((item) => item.label).join(" · ")}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
