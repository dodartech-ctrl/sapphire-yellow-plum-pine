# Oriel: Product Definition

The single source of truth for what Oriel is, who it is for, and how a person
moves through it. Read this before adding or changing any feature. The
`ai-product` and `ai-product-owner` skills (in `.grok/skills/`) apply it.

## 1. One-line definition

**Oriel turns a photo, sketch or simple 3D massing into a photorealistic
architectural visual, changing only what you ask to change.**

**Lead workflow: Revision Studio** (`/revise`). A client asks to change a
finish on a render you already delivered. Bring the approved views, mark exactly
what may change and what must not, and get coordinated revisions plus a record of
what the client approved. The concept studio below remains the way to start a
new design; nothing was removed.

## 2. Who it is for

| Person | Job they hire Oriel for | What "good" looks like |
| --- | --- | --- |
| **Architect / interior designer** | Test materials, light and mood on a real design before committing. | Structure and camera stay put; the change is exactly the one requested. |
| **Developer / marketing lead** | Produce sales and lifestyle visuals (amenities, people, landscape) fast. | A client-ready image in minutes, with variations to choose from. |
| **Visualizer / studio lead** | Run a repeatable pipeline and keep a consistent house style. | Saved setups, batch renders, a reviewable history. |

| **Studio owner / client** | Approve a specific version and keep a record of it. | A private link, one clear Approve button, and an export that matches what was signed. |

Primary persona for design decisions: the architect or designer who is **not**
an AI expert. If they have to learn model vocabulary, the product failed.

## 3. The promise and the constraint

- **Promise:** your design, restyled. You pick the change; the rest is preserved.
- **Constraint:** AI output is a visual, not a drawing. It never certifies
  dimensions, structure, code, cost or product specification. Say so where a
  client could mistake it.
- **Trust rule:** when the AI model is unavailable the app shows a clearly
  labelled preview and does not charge credits. Never present a fallback as a
  live AI result.

## 4. The user journey (the spine of the product)

Every feature belongs to exactly one of these steps. The in-app **Your path**
guide (`src/lib/journey.ts`, `src/components/journey-guide.tsx`) shows it.

| # | Step | The user's question | Where it lives |
| --- | --- | --- | --- |
| 1 | **Bring your space** (optional) | "What am I working from?" | Studio stage: upload, paste, Sketch Pad, 3D Massing, **Try a sample** (one click fills steps 1 to 3) |
| 2 | **Choose what changes** | "What do I want different?" | Right panel: Presets, Scene & Optics; Assets; Library |
| 3 | **Say it in a sentence** | "Anything the pickers can't say?" | Prompt bar; Brief Builder for a structured brief |
| 4 | **Render** | "Show me." | Render Plate; 4-Up for variations |
| 5 | **Compare and refine** (optional) | "Is it right? What next?" | Compare, Inpaint, Enhance, Relight, Studies |
| 6 | **Save and share** (optional) | "How do I keep and show this?" | Projects, Brief Builder (PDF, Share & Review), Gallery |

Rules:
1. A new user sees step 1 and one button. Never more than one primary action.
2. Required steps are 2, 3 and 4. A user may render from defaults; the guide
   must not nag about earlier steps once a later one is done.
3. Advanced tools (named studios, Node, 360, video) are reachable but never the
   first thing a beginner meets. They are explained in plain words.

### Revision Studio journey (five screens)

| Screen | The designer does | Guarantee |
| --- | --- | --- |
| 1. Add views | Upload approved renders, name each camera angle | Originals kept as uploaded; duplicate images refused |
| 2. Confirm the change | Paste feedback, tick a checklist, add the finish board | Unknown fields stay blank; a "keep X" item is never an edit target |
| 3. Mark what changes | Click or brush the surface per view, protect details | Protection always wins; occluded views can be skipped |
| 4. Quote, revise, inspect | See the price ceiling, run per view, compare pixels | Zero changed pixels outside the editable area, or the preview cannot be accepted; double submit makes one job |
| 5. Approve and deliver | Freeze a set, get client or designer sign-off, export | An approval belongs to one immutable set; export needs a valid approval |

## 5. Feature map (nothing is removed; everything has a home)

| Area | Features | Journey step |
| --- | --- | --- |
| Stage | Upload/paste, Sketch Pad, 3D Massing (SAM 3D), split preview, Compare, 360 view | 1, 5 |
| Properties | Verticals (Interior, Exterior, Amenities, Landscape), element libraries, materials, colour, light, camera, human, mood | 2 |
| Presets | 200 prompt pills, 100 ArchViz cards, 119 ZUKE, 40 looks, Mid-layer presets, House style vault | 2 |
| Brief | Brief Builder, templates, dictionary blocks, sentence linter, Moodboard, Task library | 2, 3 |
| Render | Render Plate, 4-Up, batch render queue, engine/seed/strictness, Nano Banana orchestrator | 4 |
| Refine | Inpaint/mask (IOPaint, Grounded-SAM 2), Enhance, Relight, Outpaint, Remove BG, Restore faces | 5 |
| Studios | MAS 2D (edit), SAM 3D (massing), KING 360 (panorama), KUM Video (storyboard to MP4), Node Studio (pipelines) | 1 to 6 for power users |
| Review | Review pins, Share & Review, Studies, Gallery before/after | 5, 6 |
| Keep | Projects, saved briefs, client PDF export, layered bundle export | 6 |
| Revision Studio | Intake, revision brief checklist, finish board, editable and protected masks, pixel-diff gate, quote and idempotent jobs, per-view retry, immutable version sets and branches, private client review link and sign-off, approved export with change record, cost history | all (own five-screen flow) |
| Account | Credits (50 per plate, refunded on failure), plans | all |

## 6. Principles

1. **One next step.** At any moment the user can answer "what do I do now?"
2. **Preserve by default.** Changes are scoped; everything unnamed is held.
3. **Say what happened.** Every outcome (render, fallback, refund, error) is
   stated in plain words with the next action.
4. **Plain language first, jargon second.** Named studios and model terms get a
   one-line explanation where they first appear.
5. **Depth on demand.** Power features are one click away, never in the way.
6. **No dead ends.** Empty states explain and offer the next action.
7. **Honest AI.** Fallbacks are labelled; credits are never lost silently.

## 7. Success measures

| Measure | Target | Why |
| --- | --- | --- |
| New user reaches first render | >= 70% in the first session | Proves the flow is understandable |
| Time to first render | under 3 minutes | Proves it is fast |
| Render accepted without re-roll | >= 50% | Proves prompts/properties translate |
| Users who save or export after a render | >= 30% | Proves the work leaves the app |
| Fallback shown as "live AI" | 0 | Trust |

## 8. Non-goals

- Not a CAD/BIM tool, not a source of dimensions, structural or code advice.
- Not a general image generator; every action starts from the user's design.
- Not a marketplace or a render farm.

## 9. Known gaps and next bets (ordered)

Built since the first version: sample project, Revision Studio core (see
`docs/ZUKE_VIZ_APPLY_PLAN.md` for exact status and limits).

1. **Real AI path in Revision Studio is unverified** (no provider key was
   available): it composites the model result inside the permitted mask only, but
   needs a live test, then a second provider benchmarked on the same brief.
2. **Server-side projects and accounts.** Projects live in the browser; clearing
   site data loses them. Review links need expiry, revoke and rate limits.
3. **Per-category controls from the PRD:** flooring pattern/tile/joint width,
   furniture position/rotation, lighting colour temperature/direction.
4. **Structured edit instruction (PRD 3.3)** consumed by the AI engine.
5. **Per-room configurations** shown and switchable within a project.
6. **Variation explorer** strip under the stage.
7. **Pilot and release gates** with real studios (cannot be passed by code alone).

## 8a. Definition of done for any feature

- Names its journey step and appears in the feature map above.
- Has an empty state, a loading state, an error state and an AI-offline state.
- Uses plain language; any new jargon is explained once, in place.
- Works at 390px wide with no horizontal scroll, in dark and light themes.
- `npm run typecheck`, `npm run build` and `npm test` pass; new logic has a test.
