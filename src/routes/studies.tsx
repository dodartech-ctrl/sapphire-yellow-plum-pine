import { createFileRoute, Link } from "@tanstack/react-router";
import { Compare } from "@/components/compare";
import { SCOPE_LABEL } from "@/lib/catalog";
import { RUN_NOTE, STUDIES } from "@/lib/studies";
import type { Scores } from "@/lib/types";

const SCORE_KEYS: { key: keyof Scores; label: string }[] = [
  { key: "brief", label: "Brief" },
  { key: "fidelity", label: "Fidelity" },
  { key: "spatial", label: "Spatial" },
  { key: "material", label: "Material" },
  { key: "lighting", label: "Light" },
  { key: "comparison", label: "Compare" },
  { key: "artifacts", label: "Artifacts" },
];

export const Route = createFileRoute("/studies")({
  component: StudiesPage,
});

function StudiesPage() {
  const wall = STUDIES.find((study) => study.id === "t09");
  const dusk = STUDIES.find((study) => study.id === "t10");

  return (
    <main className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <p className="text-xs font-medium uppercase tracking-wide text-lime">Disclosed benchmark</p>
        <h1 className="mt-2 max-w-3xl font-syne text-4xl font-bold tracking-tight md:text-5xl">
          Ten cases. Every first output kept.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted md:text-base">{RUN_NOTE}</p>

        {wall?.sourceImage && wall.revision ? (
          <section className="mt-10 grid items-start gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs text-lime">T09 · Interior edit</p>
              <h2 className="mt-2 font-syne text-2xl font-bold">Wall finish only</h2>
              <p className="mt-3 text-sm text-muted">{wall.observation}</p>
              <p className="mt-3 text-sm text-muted">{wall.metrics}</p>
              <p className="mt-3 text-sm text-fg">{wall.revision.note}</p>
              <Link to="/studio" search={{ study: "t09" }} className="mt-4 inline-flex h-11 items-center rounded-full bg-lime px-4 text-sm font-semibold text-ink">
                Open the revision brief
              </Link>
            </div>
            <Compare
              before={wall.sourceImage}
              after={wall.revision.image}
              beforeLabel="Source"
              afterLabel="R1"
              beforeAlt="Source compact living room"
              afterAlt="Revised clay plaster living room"
            />
          </section>
        ) : null}

        {dusk?.sourceImage ? (
          <section className="mt-12 grid items-start gap-6 lg:grid-cols-2">
            <Compare
              before={dusk.sourceImage}
              after={dusk.image}
              beforeLabel="Day"
              afterLabel="Dusk"
              beforeAlt="Subtropical home in wet daylight"
              afterAlt="Same home at early blue-hour dusk"
            />
            <div>
              <p className="text-xs text-lime">T10 · Exterior edit</p>
              <h2 className="mt-2 font-syne text-2xl font-bold">Day to dusk</h2>
              <p className="mt-3 text-sm text-muted">{dusk.observation}</p>
              <p className="mt-3 text-sm text-muted">{dusk.metrics}</p>
              <p className="mt-3 text-sm text-fg">
                A large luminance change is the point of a lighting edit. Judge the edges you named, not a similarity score alone.
              </p>
              <Link to="/studio" search={{ study: "t10" }} className="mt-4 inline-flex h-11 items-center rounded-full border border-line px-4 text-sm font-medium text-fg">
                Open the dusk brief
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className="font-syne text-2xl font-bold">Scores</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Human visual review, 1 to 5. A 5 on artifacts means nothing obvious at normal review size. It is not technical accuracy. Fidelity is n/a on text-to-image.
          </p>
          <div className="mt-4 hidden overflow-hidden rounded-2xl border border-line md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-faint">
                <tr>
                  <th className="px-3 py-3 font-medium">Case</th>
                  {SCORE_KEYS.map((column) => (
                    <th key={column.key} className="px-3 py-3 font-medium">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STUDIES.map((study) => (
                  <tr key={study.id} className="border-t border-line">
                    <td className="px-3 py-3">
                      <span className="text-lime">{study.code}</span> {study.title}
                    </td>
                    {SCORE_KEYS.map((column) => (
                      <td key={column.key} className="px-3 py-3 text-muted">
                        {study.scores[column.key] ?? "n/a"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 space-y-3 md:hidden">
            {STUDIES.map((study) => (
              <li key={study.id} className="rounded-2xl border border-line p-4">
                <p className="font-syne font-semibold">
                  <span className="text-lime">{study.code}</span> {study.title}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  {SCORE_KEYS.map((column) => (
                    <div key={column.key} className="flex justify-between gap-2">
                      <dt className="text-faint">{column.label}</dt>
                      <dd>{study.scores[column.key] ?? "n/a"}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-syne text-2xl font-bold">The plates</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STUDIES.map((study) => (
              <li key={study.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <img src={study.image} alt={study.title} className="aspect-[4/3] w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs text-lime">
                    {study.code} · {SCOPE_LABEL[study.scope]}
                  </p>
                  <h3 className="mt-1 font-syne text-lg font-semibold">{study.title}</h3>
                  <p className="mt-2 text-sm text-muted">{study.observation}</p>
                  <Link to="/studio" search={{ study: study.id }} className="mt-3 inline-flex text-sm font-medium text-lime">
                    Use this brief
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
