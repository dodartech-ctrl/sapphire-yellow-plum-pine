import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Bell, BookOpen, Building2, Compass, Crown, Folder, Images, Layers, Library, Search, Sofa, Trees, User, Wand2, Waves, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Composer } from "@/components/composer";
import { DISCIPLINES, SCOPE_LABEL, TEMPLATES } from "@/lib/catalog";
import { CREDIT_MAX, getStudioCredits } from "@/lib/credits";
import { VERTICALS, type VerticalId } from "@/lib/properties";
import { STUDIES } from "@/lib/studies";
import { useHydrated, useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const RAIL = [
  { icon: Sofa, label: "Interior", vertical: "interior" as VerticalId },
  { icon: Building2, label: "Exterior", vertical: "exterior" as VerticalId },
  { icon: Waves, label: "Amenities", vertical: "amenities" as VerticalId },
  { icon: Trees, label: "Landscape", vertical: "landscape" as VerticalId },
];

function Mark() {
  return (
    <span className="grid size-9 place-items-center text-[#e7c27a]" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="size-7">
        <path d="M12 3.2 21 20.2H3L12 3.2Z" fill="currentColor" />
        <path d="M12 8.2 16.2 17.2H7.8L12 8.2Z" fill="#14110f" />
      </svg>
    </span>
  );
}

export function Shell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const design = useOriel((state) => state.design);
  const credits = useOriel((state) => state.credits);
  const setCredits = useOriel((state) => state.setCredits);
  const setVertical = useOriel((state) => state.setVertical);
  const navigate = useNavigate();
  const hydrated = useHydrated();

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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-dvh bg-bg text-fg">
      <aside className="hidden h-full w-[232px] shrink-0 flex-col overflow-hidden bg-rail text-sand lg:flex">
        <Link to="/" className="flex items-center gap-2 px-4 py-5">
          <Mark />
          <span>
            <span className="block font-serif text-[22px] leading-none text-[#f6efe4]">Oriel</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-[#e7c27a]">Archviz studio</span>
          </span>
        </Link>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3" aria-label="Modules">
          {RAIL.map((item) => {
            const Icon = item.icon;
            const active = pathname === "/" && design.vertical === item.vertical;
            return (
              <button
                key={item.vertical}
                type="button"
                onClick={() => {
                  setVertical(item.vertical);
                  if (pathname !== "/") void navigate({ to: "/" });
                }}
                className={cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", active ? "gold-glow" : "hover-rail text-[#cbbba6]")}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
          <Link to="/builder" className={cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/builder" ? "gold-glow" : "hover-rail text-[#cbbba6]")}>
            <Wand2 className="size-4" /> Brief Builder
          </Link>
          <Link to="/gallery" className={cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/gallery" ? "gold-glow" : "hover-rail text-[#cbbba6]")}>
            <Images className="size-4" /> Gallery
          </Link>
          <Link to="/studies" className={cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/studies" ? "gold-glow" : "hover-rail text-[#cbbba6]")}>
            <BookOpen className="size-4" /> Studies
          </Link>
          <Link to="/method" className={cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/method" ? "gold-glow" : "hover-rail text-[#cbbba6]")}>
            <Compass className="size-4" /> Method
          </Link>
          <div className="mx-3 my-3 h-px bg-white/10" />
          <Link to="/library" search={{ scope: "interior" }} className={cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/library" ? "gold-glow" : "hover-rail text-[#cbbba6]")}>
            <Library className="size-4" /> Templates
          </Link>
          <Link to="/projects" className={cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/projects" ? "gold-glow" : "hover-rail text-[#cbbba6]")}>
            <Folder className="size-4" /> Projects
          </Link>
          <Link to="/assets" className={cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/assets" ? "gold-glow" : "hover-rail text-[#cbbba6]")}>
            <Layers className="size-4" /> Assets Library
          </Link>
        </nav>
        <Link to="/plans" className="mx-3 mt-auto mb-4 rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-[#f6efe4]">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Crown className="size-4 text-[#e7c27a]" /> Pro Plan
          </span>
          <span className="mt-2 block text-xs text-[#cbbba6]" suppressHydrationWarning>{credits.toLocaleString()} / {CREDIT_MAX.toLocaleString()} credits</span>
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10" suppressHydrationWarning>
            <span className="block h-full rounded-full bg-[#e7c27a]" style={{ width: `${Math.round((credits / CREDIT_MAX) * 100)}%` }} suppressHydrationWarning />
          </span>
          <span className="mt-3 block text-sm text-[#e7c27a]">Upgrade Plan →</span>
        </Link>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 flex shrink-0 items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <Mark />
            <span className="font-serif text-lg text-fg">Oriel</span>
          </Link>
          <nav className="no-scrollbar hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex" aria-label="Verticals">
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
                  className={cn("h-10 shrink-0 rounded-full px-4 text-sm", active ? "gold-fill" : "text-fg/80")}
                >
                  {item.label}
                </button>
              );
            })}
            <Link to="/builder" className={cn("inline-flex h-10 items-center rounded-full px-4 text-sm font-medium", pathname === "/builder" ? "gold-fill" : "text-fg/80")}>
              Builder
            </Link>
            <Link to="/gallery" className={cn("inline-flex h-10 items-center rounded-full px-4 text-sm font-medium", pathname === "/gallery" ? "gold-fill" : "text-fg/80")}>
              Gallery
            </Link>
            <Link to="/studies" className={cn("inline-flex h-10 items-center rounded-full px-4 text-sm", pathname === "/studies" ? "gold-fill" : "text-fg/80")}>
              Studies
            </Link>
            <Link to="/method" className={cn("inline-flex h-10 items-center rounded-full px-4 text-sm", pathname === "/method" ? "gold-fill" : "text-fg/80")}>
              Method
            </Link>
          </nav>
          <button type="button" className="ml-auto grid size-11 shrink-0 place-items-center rounded-full bg-surface shadow-sm" aria-label="Search the library" onClick={() => setOpen(true)}>
            <Search className="size-4" />
          </button>
          <button type="button" className="relative grid size-11 shrink-0 place-items-center rounded-full bg-surface shadow-sm" aria-label="Notices">
            <Bell className="size-4" />
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[#e07a2f]" />
          </button>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#efe4d4] text-fg" aria-hidden="true">
            <User className="size-4" />
          </span>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
        {pathname === "/" ? null : <Composer />}
      </div>
      <SearchDialog open={open} onOpenChange={setOpen} />
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
