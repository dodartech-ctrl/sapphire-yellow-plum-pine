import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CHECKLIST } from "@/lib/catalog";
import { MODELS } from "@/lib/compose";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/method")({
  component: MethodPage,
});

const LAYERS = [
  {
    mark: "C",
    title: "Context and constraints",
    body: "Name the source of truth before the look. Camera, envelope, openings, grade, and what may not move. A preserve line states intent. It does not prove the pixels obeyed.",
  },
  {
    mark: "O",
    title: "Objective and options",
    body: "Name the decision. Compare three palettes, or test one light, or turn a massing view into a client plate. “Make it luxurious” is not an objective. Change one family of variables at a time.",
  },
  {
    mark: "R",
    title: "Rendering direction",
    body: "Material plus finish plus scale. Light with a source, a direction, and a job. Camera with a reason: eye-level two-point, elevation-like, elevated oblique, or a junction close-up. Skip lens-brand theater and “8K”.",
  },
  {
    mark: "E",
    title: "Evaluation and exclusions",
    body: "Say what a successful frame must make easy to judge, and what it is not allowed to approve: dimensions, products, structure, drainage, code, cost, planting performance.",
  },
];

function MethodPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const total = CHECKLIST.reduce((sum, group) => sum + group.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <main className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <p className="text-xs font-medium uppercase tracking-wide text-lime">CORE</p>
        <h1 className="mt-2 max-w-3xl font-syne text-4xl font-bold tracking-tight md:text-5xl">
          A brief you can revise, not a spell you hope lands.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted md:text-base">
          CORE is original to the Architectural Visualization Prompt Library. It is not an official framework from any model provider. Write it once. Translate it for the model in front of you.
        </p>
        <Link
          to="/studio"
          search={{ template: "core-master" }}
          className="mt-6 inline-flex h-12 items-center rounded-full bg-lime px-5 text-sm font-semibold text-ink"
        >
          Compose the master brief
        </Link>

        <ol className="mt-10 grid gap-3 md:grid-cols-2">
          {LAYERS.map((layer) => (
            <li key={layer.mark} className="rounded-2xl border border-line bg-surface p-5">
              <span className="font-syne text-4xl font-extrabold text-lime">{layer.mark}</span>
              <h2 className="mt-3 font-syne text-xl font-semibold">{layer.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{layer.body}</p>
            </li>
          ))}
        </ol>

        <section className="mt-12">
          <h2 className="font-syne text-2xl font-bold">How a pass changes</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {MODELS.map((model) => (
              <li key={model.id} className="rounded-2xl border border-line p-4">
                <h3 className="font-syne text-lg font-semibold">{model.name}</h3>
                <p className="mt-1 text-sm text-lime">{model.fit}</p>
                <p className="mt-2 text-sm text-muted">{model.pass}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-syne text-2xl font-bold">Review before you send it</h2>
            <p className="text-sm text-faint">
              {done}/{total}
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {CHECKLIST.map((group) => (
              <fieldset key={group.title} className="rounded-2xl border border-line p-4">
                <legend className="px-1 font-syne text-lg font-semibold">{group.title}</legend>
                <ul className="mt-3 space-y-3">
                  {group.items.map((item) => {
                    const id = `${group.title}:${item}`;
                    const on = Boolean(checked[id]);
                    return (
                      <li key={item}>
                        <label className="flex items-start gap-3 text-sm text-muted">
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => setChecked((current) => ({ ...current, [id]: !current[id] }))}
                            className="mt-1 size-4 accent-lime"
                          />
                          <span className={cn(on && "text-fg")}>{item}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ))}
          </div>
        </section>

        <section className="mt-12 mb-4 max-w-3xl">
          <h2 className="font-syne text-2xl font-bold">Iteration</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>Generate from the shortest complete brief.</li>
            <li>Name the single highest-impact mismatch.</li>
            <li>Revise one layer: constraints, design, camera, light, or context.</li>
            <li>Keep the brief that worked, with the model and the date. The studio log does this when you copy.</li>
            <li>Compare options on the same reference, camera, and plate.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
