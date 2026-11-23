# Applying the ZUKE VIZ research to Oriel: execution plan

> **Status (first build):** Phases 1 to 4 (Release 1, Revision Studio) are built
> and verified locally; see section 9 for exactly what is done and what is not.

Source: the uploaded ZUKE VIZ pack (50-site competitor study, 50-site API
architecture study, feature directory, product specification, module blueprint).
Status of each Oriel item below comes from a code inventory (file and table
names, not a line-by-line audit). Items marked **verify** need a closer look
before work starts. The pack's own thresholds, the ₹999 offer and the feature
list are **hypotheses**, not measured facts.

## 1. What the research says, in five lines

1. **First sellable product is "Revision Studio", not a general renderer.** A
   studio brings two approved views and one client change; the designer edits
   only the named surface, in both views, and the client approves a specific
   version.
2. **Moat = control and proof, not prettier pixels.** Protected masks, a
   pixel-level check that nothing outside the edit changed, linked views, version
   approval and cost history. Competitors mostly stop at "generate".
3. **Own the project layer; rent the model.** Build project memory, masks,
   compositing, approval history and billing in the product. Call one image API
   behind a replaceable adapter and pick a second by measured acceptance rate.
4. **Keep outputs distinct:** a presentation image, a tour and an editable
   model are different deliverables and must be labelled as such.
5. **Defer** editable GLB, CAD runtimes, video and feasibility planning until
   the image workflow has repeat buyers.

## 2. Positioning decision (needs your call)

Oriel today is a broad **concept and design studio** (the pack's Release 2).
The pack's Release 1 is a narrower **revision workflow**. They are compatible if
Revision Studio becomes a *mode* inside the existing journey, with nothing
removed.

**Recommendation:** add **"Revise an approved render"** as the lead workflow on
the home screen, keep every existing studio and tool, and let concept rendering
be the second entry ("Start a new concept"). Decide the target customer first
(pack proposes Indian residential and modular-kitchen studios) because it sets
the language, currency and sample data.

## 3. Where Oriel already stands against the 14 modules

| Module | Release | Oriel today | Gap |
| --- | --- | --- | --- |
| M01 Projects and briefs | 1 | Browser-only projects; Brief Builder; `zuke_brief_versions` and thread tables in the ledger | Client project with **named camera views**, originals preserved and hashed, duplicate detection, feedback pasted and turned into a checklist, server persistence |
| M02 Materials and moodboards | 1 | Moodboard overlay, swatches, mid-layer presets | **Reference roles** (material / lighting / furniture), supplier name, SKU, grain direction, a swatch ID that surfaces bind to |
| M03 Local editing | 1 | Mask canvas, IOPaint, Grounded-SAM 2, mask coverage stats | **Protected-over-editable masks**, effective-mask preview, composite only permitted pixels, **lossless diff gate** (zero changed pixels outside the mask) |
| M04 Multi-view | 1 | Single active plate in the store | Views list, linked named surfaces across views, one shared finish, mark a surface invisible, **per-view retry** that leaves the accepted sibling untouched |
| M05 Review and delivery | 1 | Review pins, Share and Review links with comments, client PDF, `zuke_approvals` | Sign-off bound to **immutable version IDs**, branch and restore, export manifest and one-page finish and change record |
| M06 Jobs and costs | 1 | Credits ledger with refunds, render queue, `x-idempotency-key` on the API, attempt cap | **Quote before paid work** with a ceiling, per-view progress, actual cost per accepted set including failures and designer time |
| M07 Concept rendering | 2 | Largely built (presets, 4-Up, looks) | Keep variant parent and preset lineage so comparisons are like-for-like |
| M08 Staging and renovation | 2 | Partial (furniture and room properties) | Empty-room staging, clearance check around doors, furniture replacement with newly exposed areas |
| M09 Exterior and landscape | 2 | Verticals and option libraries | Preserve-openings test, seasonal and lighting variants on a fixed camera |
| M10 Workflow canvas | 2 | Node Studio and node executor | **Verify** that changing a swatch invalidates only dependent previews |
| M11 CAD and 3D scene | 3 | SAM 3D massing viewport | Blender handoff (camera, object IDs, materials), stable object masks |
| M12 Plans and models | 3 | Floor-plan blueprint state exists | Confirmed scale, reconstructed openings, GLB export, labelled "presentation" vs "geometry" |
| M13 Video and tours | 3 | KING 360 and KUM Video studios | Continuity checks, hotspot graph, shot list |
| M14 Feasibility | Later | None | Defer |

The governance layer (G01–G11 gates, client labels such as `draft` and
`client_approved`, audit events, immutable artifact manifest) already matches the
pack's thinking. Most Release 1 work **connects the UI and a project model to
that layer**; it does not start from zero.

## 4. The user journey for Revision Studio

Same six-step spine as `PRODUCT.md`, specialised:

| # | Step | The designer does | Screen |
| --- | --- | --- | --- |
| 1 | Add the views | Upload two views, name the angles | Project intake |
| 2 | Confirm the change | Paste client feedback, tick the extracted checklist | Revision brief |
| 3 | Mark editable and protected | Click or brush the surface in each view; protect handles, trim, openings | Revision canvas |
| 4 | Quote and revise | Attach the approved swatch, see the ceiling price, approve, run | Quote, then progress per view |
| 5 | Inspect and retry | Toggle original / result / overlay; retry only the failing view | Difference inspector |
| 6 | Approve and deliver | Send a private review link, collect sign-off, export the approved pair and record | Review, then Delivery |

The in-app **Your path** guide gets a second path definition for this mode, and
the "Try a sample" button gets a sample kitchen with two views.

## 5. Phased plan

Each phase ends with something demonstrable and its own tests. Phases are
ordered so every one is shippable.

### Phase 0: Decisions and groundwork (about 2 days)
- Confirm positioning and first customer (section 2).
- **Auth and database turn ON** for this work: client projects, per-user data
  and sharing between people trigger the project rule for accounts. Plan the
  sign-in and a Postgres schema through the `auth` and `neon` skills before any
  code; today's projects live only in one browser.
- Choose the first image provider and write a `ProviderAdapter` interface:
  persist the provider job ID **before** polling, store results in project-owned
  storage (signed URLs expire), reconcile on timeout before retrying, and treat
  webhooks as arriving after the browser closes.
- Decide object storage that works on the deploy target (no runtime filesystem
  writes on Vercel).
- Update `PRODUCT.md` (personas: studio owner, designer, client; Revision Studio
  as lead workflow) and both product skills.

### Phase 1: Project, views and references (M01, M02), about 1 week
- Tables: `client_projects`, `project_views` (original hash, dimensions,
  orientation, camera name), `finish_references` (role, supplier, SKU, grain),
  `surfaces` (name, linked across views, visible flag).
- Intake screen with duplicate-upload detection; originals stored separately
  from generated versions.
- Revision brief: paste feedback, show a checklist of target, finish, protected
  elements, affected views. **Unknown stays blank** (never invented).
- Acceptance: reopen a project and recover the exact brief and originals of an
  earlier revision.

### Phase 2: One-view masked edit with proof (M03, M06), about 1.5 weeks
- Editable and protected masks (protection wins on overlap), effective-mask
  preview at full resolution.
- Composite only permitted pixels; include any edge blend in the permitted mask.
- **Difference gate:** compare against the parent on the lossless working image;
  block "ready for review" if any pixel outside the mask changed or the
  dimensions changed. Overlay and synchronised zoom in the inspector.
- Quote and job service: scope, preview count, retry allowance, ceiling;
  approval fixes scope; idempotency key so a double submit cannot double-charge.
- Acceptance: on the lossless master, zero changed pixels outside the mask;
  repeat submission creates one billable job.

### Phase 3: Two linked views (M04), about 1 week
- Link a named surface across both views with one shared finish and independent
  masks per view; allow "not visible in this view".
- Per-view retry that preserves the accepted sibling byte-for-byte.
- Acceptance: reject the side view, retry it, and the front view is identical.

### Phase 4: Review, approval, delivery (M05), about 1.5 weeks
- Version model with immutable IDs, parent links, branches, restore.
- Private review link; comments and sign-off bound to version IDs; a revised
  view creates a new set that needs a new approval.
- Delivery: export the approved pair plus a one-page finish and change record
  (view names, revision ID, supplied finish code, approval date).
- Cost history per accepted set: attempts, elapsed time, provider charges,
  designer correction time.
- Acceptance: approve set A, branch B, export A: hashes and approval record match
  A. **This completes Release 1, the first sellable product.**

### Phase 5: Pilot and the release gates (about 2 to 4 weeks, partly offline)
Run the pack's six gates and record results: protected geometry, cross-view
material, retry and recovery, version integrity, paid demand (interview 12
studios, pilot five real two-view jobs, offer a second job at ₹999 with one
correction; target three paid repeats and 50% lower median designer time), unit
economics. Benchmark the chosen provider and one alternative on the **same**
two-view brief and compare acceptance rate. These need real studios; code alone
cannot pass them.

### Phase 6: Release 2 alignment (M07 to M10)
Mostly polishing what exists: variant lineage, empty-room staging and clearance
check, furniture replacement, lighting and weather presets on a fixed camera,
moodboards with roles, node-canvas dependency invalidation (verify first),
team workspace and reviewer assignment.

### Phase 7: Release 3 and later (M11 to M14)
Only after repeat buyers: Blender handoff, editable GLB (with flagged missing
dimensions), presentation animation, navigable tour, batch jobs and public API.
Feasibility planning is tested separately with planning teams.

## 6. Cross-cutting rules (apply to every phase)

- **Honest labels:** reuse the existing client labels (`concept_preview`,
  `draft`, `verified_for_listed_checks`, `client_approved`, `superseded`). A
  fallback or unchecked image is never shown as verified.
- **Say what AI cannot certify:** colour under rendered light is an
  approximation; no dimensions, structure, code or cost claims from an image.
- **Nothing removed.** New flow is added beside existing studios.
- **Definition of done** from `PRODUCT.md` 8a, plus: idempotent, audited, and a
  unit test for any gate or money logic.
- **Deploy target:** no runtime file writes, no secrets in the client, provider
  keys server-side only. The pack's local-GPU idea (RTX 3060 on a Windows pilot
  machine) does not apply to this web deployment; masking and compositing run in
  the browser or on the server.

## 7. Risks and open questions

| Risk or question | Why it matters | Next step |
| --- | --- | --- |
| Willingness to pay is unproven | The pack says a paid pilot is required | Phase 5 interviews; do not over-build before them |
| Provider cannot honour masks | Some routes lack masking or reference support | Validate per-route schemas; keep the pixel gate as the safety net |
| Local edit looks seamed at mask edges | Seams inside the mask cannot be caught by the pixel gate | Designer inspection step is part of the flow |
| Accounts and storage are new infrastructure | Big shift from browser-only | Phase 0 design first, via `auth` and `neon` skills |
| Credits (50 per plate) vs per-job quotes | Two pricing models | Decide: keep credits, show them as the quote |
| Which customer first | Drives language, currency, samples | Section 2 decision |

## 8. Suggested first sprint (what I would build next)

1. Phase 0 decisions and a short schema design for projects, views, surfaces and
   finish references.
2. Update `PRODUCT.md` and the two skills for Revision Studio.
3. Phase 1 intake screen with two named views and the revision-brief checklist,
   behind the existing journey guide with a sample kitchen.

## 9. Build status and honest limits

**Built and verified (dev and production build, desktop and phone width):**
project intake with duplicate detection and preserved originals; revision brief
checklist (unknown stays blank, "keep" items never become targets); finish board
(role, supplier, SKU, grain, swatch); linked named surfaces with per-view masks,
click-select, brush, polygon, undo, protected-over-editable, "not visible in this
view"; quote with ceiling and scope coverage; idempotent job registry; offline
finish preview plus a server AI edit route composited into the permitted mask
only; lossless pixel-diff gate with original / result / changed-pixel inspector;
per-view accept, reject and retry that leaves sibling views untouched; immutable
content-hashed version sets, branch and restore; private client review link with
before/after, pinned comments and append-only sign-off bound to the set id;
export of approved images, JSON record and a one-page PDF; cost history with
failed attempts and designer minutes. 21 unit tests cover the guarantees
(`npm run test:app`).

**Phase 0:** done by defaults (Revision Studio leads as an added workflow;
accounts stay off, projects are browser-local, only review links use the
database). The provider "adapter" is the existing `inpaintPlate` route plus the
composite step, not a separate interface.

**Not done, or limited (do not treat as complete):**
- The **real AI route is untested** here (no provider key). If the model result
  cannot be read or the model is unavailable, the offline preview is used and the
  card says so.
- **Not 100% of the plan.** Phase 5 (pilot with paying studios, the paid-demand
  and unit-economics gates) needs real customers. Phases 6 and 7 (Release 2
  polish, Blender handoff, GLB, video, tours, feasibility) are not started.
- **Projects are in this browser only.** Clearing site data loses them. No
  accounts, no team seats, no server-side project history.
- **Review links** have no expiry, revoke or rate limit; anyone with the link can
  view and respond. The set is verified on the server, but images are not re-hashed.
- **The pixel gate runs on a working copy** (longest edge 1280px, lossless PNG).
  Originals are stored untouched, but delivered images are working resolution.
- **Linking across views is manual** (you mark each view); there is no automatic
  cross-view object matching.
- **Idempotency is a client-side registry.** The existing server wallet charge
  has no idempotency key, so the same job started from two tabs could charge twice.
- A reload marks any in-flight job failed so it can be retried; check the credit
  balance afterwards, because the server may already have charged.
- The offline preview recolours with the swatch colour and keeps the original
  light and texture. It is a colour approximation, not a material render.
