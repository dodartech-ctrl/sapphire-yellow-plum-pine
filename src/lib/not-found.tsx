import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

const DESTINATIONS = [
  { to: "/", label: "Studio", hint: "Render a plate" },
  { to: "/builder", label: "Brief Builder", hint: "Compose a brief" },
  { to: "/projects", label: "Projects", hint: "Saved work" },
  { to: "/gallery", label: "Gallery", hint: "Published plates" },
] as const;

export function AppNotFound() {
  return (
    <main className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-4 px-6 py-16 text-center text-fg">
      <span className="text-lime" aria-hidden="true">
        <Compass className="size-10" strokeWidth={1.75} />
      </span>
      <h1 className="font-syne text-2xl font-bold">This page does not exist</h1>
      <p className="max-w-md text-sm text-muted">The link may be old or mistyped. Pick up where you left off:</p>
      <ul className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {DESTINATIONS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="flex h-14 flex-col items-start justify-center rounded-2xl border border-line bg-surface px-4 text-left hover:border-lime"
            >
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="text-xs text-muted">{item.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
