/* Shared class constants live beside the components that use them; the fast-refresh rule is not useful here. */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, type ReactNode } from "react";
import { getBlob } from "@/lib/revision/blobs";
import { cn } from "@/lib/utils";

export const input =
  "h-10 w-full rounded-xl border border-line bg-raised px-3 text-sm text-fg outline-none placeholder:text-faint focus:border-lime";
export const textarea =
  "w-full rounded-xl border border-line bg-raised px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-lime";
export const btnPrimary =
  "gold-fill inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50";
export const btnGhost =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-line px-4 text-xs font-semibold text-fg hover:border-lime disabled:cursor-not-allowed disabled:opacity-50";

export function Card({ title, hint, children, className }: { title?: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface p-4", className)}>
      {title ? <h3 className="font-syne text-base font-semibold">{title}</h3> : null}
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      <div className={title || hint ? "mt-3" : ""}>{children}</div>
    </section>
  );
}

export function Pill({ tone, children }: { tone: "ok" | "warn" | "bad" | "idle"; children: ReactNode }) {
  const tones = {
    ok: "border-[#5f8a62]/50 text-[#5f8a62]",
    warn: "border-[#c5a880]/60 text-bronze",
    bad: "border-[#b4513f]/60 text-[#c4604d]",
    idle: "border-line text-muted",
  } as const;
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", tones[tone])}>{children}</span>;
}

/** Load a stored image by key (re-runs when `rev` changes). */
export function useBlobUrl(key: string | null | undefined, rev?: unknown): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    if (!key) {
      setUrl(null);
      return;
    }
    void getBlob<string>(key).then((value) => {
      if (live) setUrl(value);
    });
    return () => {
      live = false;
    };
  }, [key, rev]);
  return url;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block text-[11px] text-faint">{hint}</span> : null}
    </label>
  );
}
