# Zukeviz — Master PRD (v1 base, updated by v2 to v7)

Nov 18, 2026 · @samz

**Version log.** This is the single master PRD. **v1** is the base (sections 1 to 19). **v2** and **v3** update v1 in place: v2 and v3 add sections 20 to 33, and v4 (build kit: preset seed, Supabase schema with RLS, prototype plan, evaluation protocol) adds sections 34 to 37; v5 (gap audit against the reference PRDs: 99 added requirements with IDs, acceptance criteria and priorities, plus arch-viz pro tools and a developer sales suite) adds sections 38 to 42; v6 (collaboration with WebRTC and a tracked review system, Virtual Tour Studio, full customer journey, ultra-premium UI/UX direction, and a Stitch prompt pack for the whole app) adds sections 43 to 47; v7 (the four named studios MAS 2D, SAM 3D, KING 360 and KUM Video, the shared Look Anchor mood lock, open-source and licence rules, and a Claude Design canvas with one screen per studio) adds sections 48 to 56. Each marks which v1 sections they supersede. Where versions disagree, the latest version wins; nothing is kept in a separate document except the optional appendix below.

| Version | What it adds | Where | v1 sections it updates |
| --- | --- | --- | --- |
| v1 | Base product: workspace, workflow, modules, presets, Editor, fidelity engine, architecture, enterprise, roadmap | 1 to 19 | n/a |
| v2 | Locked decisions, human-first presets and UX, accuracy ladder, own-model path, build stack, worldwide launch, SketchUp plugin, lean roadmap | 20 to 24 | 6 (presets), 14 (models), 15 (plans), 16 (enterprise), 18 (roadmap), 19 (open questions) |
| v3 | Market pain study, Agent Zuke, CAD to views pipeline, project memory, approval gates and 8K to 15K finals, video director and editor, agent architecture, Stitch prompt pack | 25 to 33 | 4 (workflow), 8 (feedback), 10 (video), 15 (data), 18 (roadmap), 19 (open questions) |

Appendix A (optional detail): the full per-tile preset fragment tables for v2 are in the working document [Zukeviz v2 working plan](https://claude.ai/artifact/LBeJNUrvhbBowznCL7dcRs); section 21 here carries the library structure and the Looks.

## 1. Vision and product thesis

Zukeviz is one workspace where an architect picks a module, sets look-and-feel with preset buttons, generates a trustworthy render, then edits it like a Figma canvas and turns it into an upscaled image, a video, a 360 panorama or a 3D-model shot, without ever re-uploading.

The four reference products (mnml.ai, LookX, ArchiVinci, Rendair) each solve one slice. None of them joins **preset-driven generation, object-level canvas editing, a visible fidelity gate and a video/360/3D finish in a single loop.** That loop is Zukeviz's wedge.

**Product principles**

1. **Fidelity over creativity.** Geometry, layout and camera are preserved by default; the user opts out, never in.
2. **Presets before prompts.** Most of the prompt is pill buttons that are already switched on; typing is optional.
3. **One canvas, every module.** An image keeps its history, masks, locks and references as it moves from Render to Edit to Video.
4. **Pay only for passed outputs.** Credits are held at queue time and captured only when the result clears the quality gate.
5. **Show your work.** Every result carries a fidelity badge, a change map, the compiled prompt, seed and model version.
6. **Enterprise by default.** Teams, roles, audit, SSO, data residency and provenance are in the first release, not bolted on.

**Who it is for**

| Persona | Input they bring | What Zukeviz must prove |
| --- | --- | --- |
| Architect | SketchUp/Revit/Rhino view, sketch, plan | Walls, openings and rooflines did not move |
| Interior designer | Room photo, plan, mood board | Furniture layout and materials match the brief |
| Real-estate / staging | Empty-room photos, batches | Staging is labelled and does not hide defects |
| Studio lead / enterprise | Team of 5 to 500 | Spend, audit trail, shared presets, SSO |
| Student / freelancer | Models, sketches | Low cost, free tier, fast first result |

## 2. What the four PRDs teach us

The PRDs agree on one engine shape (gateway, prompt compiler, model router, generation worker, verification gate, credit ledger) and differ on which slice they push furthest. Zukeviz takes the best slice from each and adds the missing editor and 3D/video loop.

| PRD (reference product) | Strongest idea to keep | Gap Zukeviz closes |
| --- | --- | --- |
| mnml.ai study | Image-to-image with about 60 enum presets, Auto defaults, preserve list, protect list, reference roles, prepare-admit-render-check-retry engine, idempotent submit, SSE progress, Studio + Flow canvas | Editing is box/mask only; no vector pen, no object-level layer panel; video and 3D are separate tools |
| LookX-class PRD | 11-module set, versioned preset schema with conflicts and ranges, prompt linter L01-L08, 3-level enhancer with diff, four-gate verification, C2PA + watermark, LoRA training, plugin passes, Plaza | No unified canvas between modules; no object-level editor; no 360 or GLB-driven generation |
| ArchiVinci-class PRD | Layered prompt compiler where the preservation clause cannot be removed, fidelity score S with hard fails, Change map, Fidelity slider, Fix this area, 24 gaps list, per-module recipes, staging integrity check | No chat edit loop, no 3D model input, no pen/annotation tool, no video storyboard |
| Rendair-class PRD | Eight-stage job pipeline, Scene Spec as ground truth, auto-repair ladder, 48-preset library, Edit Canvas tools, Boards, 11 post-checks, model routing table with fallbacks | Canvas tools are masks only; no node-based pen; no shared preset-to-chat-box flow |

**Decisions taken from the synthesis**

- **Scene Spec + Protect list** from Rendair and mnml are merged into one object, the *Design Contract*, shown to the user as "What I understood" before the first run.
- **Presets** use LookX's versioned schema and ArchiVinci's conflict rules, but surface as pill buttons in the chat box (section 6).
- **Fidelity gate** uses ArchiVinci's weighted score and hard-fail list, Rendair's repair ladder and LookX's refund-on-fail credit rule.
- **Canvas** is new: Zukeviz's Figma-style editor is the main differentiator and has no equivalent in the four PRDs.
- **Models** are never trained in v1; we route to hosted and open-weight models behind an engine registry (all four PRDs agree).

## 3. Workspace layout

&#91;embedded content: workspace layout · 4 zones, 1 chat box\]

Clicking a module lands on this page: a collapsible menu rail on the left, the preset panel beside it, and about 80% of the screen split into a top bar and the image canvas, with the chat box docked at the bottom. The same shell hosts Render, Edit, Video, 360 and 3D; only the preset set and the canvas tools change.

**Layout rules**

- **Menu rail** collapses to icons (shortcut `[`); module, project, asset, board and team entries live here.
- **Preset panel** shows tiles generated from the uploaded image (type, room, style, light), grouped and searchable, with a pin-favourites row.
- **Canvas** supports zoom, pan, split compare, change-map overlay and a version strip; double-click or **Edit** opens the Editor (section 7).
- **Chat box** holds the compiled prompt as pills; each pill can be toggled, edited, reordered or deleted, and free text sits beside them.
- **Responsive:** below 1024 px the preset panel becomes a bottom sheet; below 640 px the rail becomes a tab bar.

## 4. The core workflow

&#91;embedded content: core workflow · 8 steps, 2 loops\]

The same loop runs for images, video, 360 and 3D. Every step writes a child version, so nothing the user approved is ever overwritten.

| Step | What the user does | What the system does |
| --- | --- | --- |
| 1 Pick module | Clicks a module card, drops an image, sketch, plan, GLB or text | Validates and strips EXIF, classifies input, builds the Design Contract |
| 2 Presets load | Reviews pills that are already ON; toggles or edits any | Loads the module's default preset set into the chat box; runs the prompt linter live |
| 3 Generate | Presses **Generate**; sees the credit price first | Holds credits, compiles prompt, routes model, streams progress |
| 4 Result | Compares, reads badge, picks best of N | Scores candidates, shows fidelity badge and change map; refunds failed gates |
| 5 Editor | Selects objects, draws with the pen, adds text, attaches references | Auto-segments objects, builds masks, stores each mark as an edit instruction |
| 6 Edit-generate | Presses **Generate edit** | Compiles one instruction per region; pixels outside masks are copied back |
| 7 Enhance | Upscales, grades, retouches | Tiled super-resolution, colour tools, layer export |
| 8 Finish | Turns the image into video, 360 panorama or a 3D-model shot | Same preset-pill pattern, module-specific controls (sections 7 to 10) |

## 5. Module catalogue

Zukeviz ships 20 modules in four families. Every module is a configuration of one engine: it declares inputs, a default preset set, a fidelity default and which gate checks are hard. Priority: **P0** = launch, **P1** = within 3 months, **P2** = later.

| Family | Module | Input | Output | Default fidelity | Pri |
| --- | --- | --- | --- | --- | --- |
| Create | Exterior Render | SketchUp/Revit/Rhino view, sketch, photo | Photoreal exterior, same camera | Strict | P0 |
| Create | Interior Render | Room view, photo, line drawing | Photoreal interior, same layout | Strict | P0 |
| Create | Sketch to Render | Scan or photo of sketch (auto-clean) | Render | Strict | P0 |
| Create | Floor Plan to Render | 2D plan | Coloured or furnished 3D-style render | Strict + topology check | P0 |
| Create | Masterplan / Landscape | Site plan, massing, aerial | Coloured plan, landscape render | Balanced | P1 |
| Create | Text to Image (Imagine) | Prompt, optional style reference | New concept image | Creative | P0 |
| Create | Virtual Staging | Empty-room photos, up to 40 per batch | Staged photos with disclosure label | Strict, floor mask only | P1 |
| Create | Product / Detail | Product shot, material sample | Studio or in-context image | Balanced | P2 |
| Edit | Canvas Editor | Any result or upload | Edited image, layered | Locked outside masks | P0 |
| Edit | Chat Edit | Image + instruction | Edited image with before/after card | Strict | P1 |
| Edit | Material / Object Swap | Click an object | 3 suggested swaps from presets | Locked outside mask | P0 |
| Edit | Remove / Outpaint / Reframe | Mask or border | Filled or extended image | Perspective-aware | P0 |
| Edit | Relight (day, night, season, weather) | Image | Same geometry, new light | Strict | P0 |
| Finish | Enhance and Upscale | Image | 2x/4x, up to 8K | Preserve structure and text | P0 |
| Finish | Photoshop-style Adjust | Image | Graded, retouched, layered export | Non-destructive | P1 |
| Motion | Image to Video | Image, optional end frame, storyboard | 5 to 30 s clip, up to 1080p | Object-count check | P1 |
| Motion | 360 Panorama / HDRI | Image or text | Equirectangular image, HDRI | Seam check | P1 |
| 3D | GLB/OBJ Scene Shot | 3D model, saved camera | Render from the viewport, live screenshot to render | Strict, depth + normals | P1 |
| 3D | Image to 3D / Floor Plan to 3D | Image or plan | GLB export | Topology check | P2 |
| Team | Boards, Assets, Workflows, Plaza | Any | Shared canvases, saved recipes, community | n/a | P1 |

## 6. Preset engine: image-aware tiles that become editable pills

This is the interaction you described: the user clicks a preset, its backend prompt fragment loads into the chat box as pills that are already ON, and the user can edit any pill before pressing **Generate**.

**How it works, step by step**

1. **Analyse the image.** On upload a vision model returns input class (sketch, plan, 3D view, photo), space type, time of day, detected materials and objects. This fills the Design Contract.
2. **Show image-based tiles.** The left panel offers only presets that fit the image (an interior photo shows room styles and lighting; a masterplan shows aerial cameras and site context). Each tile has a thumbnail rendered from the user's own image where possible.
3. **Click loads pills.** Clicking a tile adds a pill group to the chat box. Each pill = one preset fragment (`style: Japandi`, `light: Golden hour`, `camera: Eye level`, `geometry: Precise`).
4. **Defaults are already ON.** The module's default set is pre-loaded, so a first render needs zero decisions. Anything not chosen stays **Auto**.
5. **Edit in place.** Clicking a pill opens its controls: swap value, change strength, view the exact fragment sent to the model, or switch it OFF. Free text sits beside pills; a conflict between pills (night + midday) disables **Generate** and names the conflict.
6. **Prompt preview.** A drawer shows the compiled prompt, negative prompt, seed, model and credit price before the run.
7. **Save as Workflow.** The whole pill set plus sliders saves as a team or private recipe, and can be re-applied to any image.

**Preset record (versioned, replayable)**

```json
{
  "id": "light.golden_hour", "version": "2.1.0", "kind": "lighting",
  "label": {"en": "Golden hour", "ar": "...", "es": "Hora dorada"},
  "modules": ["exterior", "interior", "video", "scene360"],
  "fragments": {"natural_language": "Low golden sun, warm glow, long soft shadows",
                "tags": "golden hour, warm light, long shadows"},
  "negative": "overexposed, harsh flash",
  "defaults": {"similarity": 0.55, "guidance": 6.5},
  "ranges": {"similarity": [0.35, 0.8]},
  "conflicts": ["light.twilight", "light.studio"],
  "requires": ["image"], "visibility": "system", "eval_score": 0.93
}
```

**Prompt assembly (fixed order, so results are predictable)**

| Priority | Block | Who can change it |
| --- | --- | --- |
| 1 | Task and fidelity rule: "keep walls, openings, roofline, layout exactly" | Nobody; cannot be removed by a preset or user text |
| 2 | Locked constraints from the Design Contract (counts, protected objects) | User can add locks; cannot delete structural locks while Strict |
| 3 | Subject and space (user text + contract) | User |
| 4 | Materials and objects | Preset, tags (max 3 object tags per run), user |
| 5 | Camera | Preset |
| 6 | Lighting, time, weather | Preset (one lighting preset per run) |
| 7 | Style and mood | Preset |
| 8 | Quality tokens for the model dialect | System |
| 9 | Negative prompt: global + module + preset + user, appended never replaced | System, user adds |

**Launch library: 120 presets**, 60 from the LookX-class set (12 exterior scenes, 12 interior scenes, 8 landscape and urban, 8 representation styles, 10 cameras, 10 material packs) plus 60 new: 20 video camera moves, 12 panorama/HDRI sets, 12 3D viewport cameras and 16 finishing/grading looks. A preset needs an eval pass rate of at least 0.85 on its test set before it is visible.

**Prompt help.** *Improve* has three levels (Faithful, Balanced, Creative), always shown as a diff the user accepts or rejects. The linter (rules L01 to L08: length, object counts, long text, conflicts, "no X" moved to negatives, lock contradictions, policy, unsupported ratio) runs under 300 ms and before any credit is held. Dictionary, Random Prompt and Image Analysis from LookX are kept.

## 7. Canvas editor (Figma-style)

After a result, **Edit** opens a full-screen editor on the same image. It is the part of Zukeviz no reference product has: every object is selectable, every mark is an instruction, and only marked regions may change.

**Editor layout.** Left: tool bar. Centre: infinite canvas with zoom, pan and rulers. Right: **Layers and Objects** panel plus a properties inspector. Bottom: the same chat box, now showing the edit instruction list. Top: undo/redo (50 steps minimum), compare, version strip, **Generate edit**.

**Tools**

| Tool | Behaviour | Notes |
| --- | --- | --- |
| Select / Move | Click any object (sofa, table, window, wall, floor, sky) to select it | Auto-segmentation on open; hover outlines objects; shift-click multi-select |
| Smart select | Click, then grow or shrink the mask; wall, floor, ceiling one-click | Built on a segment-anything-class model; masks cached per version |
| **Pen tool with nodes** | Bezier paths with anchor and handle control; add, delete, convert nodes; close path to make a mask | Stroke width slider 0.5 to 64 px, opacity, dash, colour; edit nodes after drawing |
| Pencil / Brush | Freehand marks or soft mask painting | Pressure support; size and hardness sliders |
| Shape tools | Rectangle, ellipse, polygon lasso, arrow, line | Used as masks or as annotations |
| Text box | Place and style text on the canvas | Two modes: **Instruction** ("make this leather") or **Burn-in** (real text on the image) |
| Eraser / Mask subtract | Remove from a mask or an annotation |  |
| Frame / Crop / Extend | Crop, outpaint, change aspect ratio | Perspective-aware extension |
| Eyedropper | Sample colour or material from the image or a reference | Becomes a colour/material pill |
| Lock region | Mark areas that must never change | Stored in the Design Contract; honoured by every later run |
| Compare / Change map | Split slider and heat overlay of differences | Toggle per version |

**Object panel.** Every detected object appears as a row with a thumbnail: name, material guess, lock toggle, visibility toggle and a **Change** button that opens a small preset menu (3 suggested material or colour swaps from the library plus free text). This is how "if there is a sofa, I can select the sofa" works without drawing.

**From marks to a generation.** Each mark creates one instruction card in the edit list:

1. Region (mask or path) + object name
2. Instruction text (typed, picked from presets, or dictated)
3. Optional per-region reference image, colour or material
4. Strength and lock state

When the user presses **Generate edit**, the compiler sends one instruction per region, never a single vague prompt. The engine composites original pixels back outside every mask (4 px feather), so leakage into untouched areas is impossible by construction. If an edit returns an unchanged region, the credit is refunded and the user is told.

**Non-destructive model.** The editor stores a layer stack (base image, masks, annotations, text, adjustment layers). Exports: flattened PNG/JPEG/TIFF, layered PSD or SVG overlay, and a PDF mark-up sheet for client review.

## 8. Feedback and reference attachments

Feedback is structured, not just typed. Marks on the canvas, a chat message and attached references are merged into one **edit brief** that the compiler turns into per-region instructions.

| Attachment | Accepted | How the engine uses it |
| --- | --- | --- |
| Image reference | JPG, PNG, WebP, HEIC up to 20 MB; up to 15 per run | Each gets a **role**: style, material, colour, atmosphere, geometry, object. A role may only influence the attributes it owns, so a style reference cannot move walls |
| Video reference | MP4/MOV up to 60 s | Keyframes extracted; used for camera path, lighting mood or motion style in the Video module |
| 3D / GLB | GLB, glTF, OBJ, FBX, STL, PLY | Server-side depth and normal passes for structure control, or a saved camera shot |
| Sketch / drawing | Image, PDF page | Edges and line maps become structure guidance |
| Document | PDF, DOCX brief, material schedule | Parsed into materials and constraints, shown as pills for approval |
| Voice note | Short audio | Transcribed into an instruction card |

**Rules**

- Each reference shows a **sameBuilding** switch; off by default, so a reference of another building cannot replace the main one.
- A reference with a different space type or perspective than the input triggers a warning chip before credits are held.
- References can be attached globally, to a region ("use this tile on the floor") or to a single instruction card.
- Result feedback buttons: **Useful** and **Not what I asked**, with an issue type (geometry, lighting, materials, reference, edit scope, other) and a region the user can draw. Every report feeds the evaluation set.
- **Clarification over guessing.** If intent or input type is unclear, the system asks one question ("day or night?") instead of rendering.

## 9. Enhance, upscale and Photoshop-style finishing

Finishing tools are non-destructive and ordered the way the best reference guides teach: **fix content first, then enhance, then upscale last**. Each step shows its credit price and a 100% crop preview before charging.

| Tool | What it does | Guardrail |
| --- | --- | --- |
| Enhance | Low-creativity pass for texture and light | Creativity capped; structure score must stay at or above 0.95 |
| Upscale 2x / 4x / 8K | Tiled super-resolution; also works on uploaded files (1 credit), fixing a reference-product gap | Preserve-text mode; VLM check for invented objects |
| Detail slider and face/hand repair | Local sharpening, people repair | Scale check against door height |
| Colour grade | Curves, levels, white balance, LUT presets, split toning | Adjustment layers, never baked until export |
| Retouch | Spot heal, clone, dodge and burn, remove object | Mask-only; pixels outside the mask stay identical |
| Background / sky replace | Swap sky or remove background | Light direction match check |
| Relight and weather | Day, dusk, night, rain, snow, season | Geometry locked; hard fail on structure drift |
| Outpaint / reframe | Extend any border or change ratio | Perspective-aware, seam check |
| Layer export | PSD with masks, depth map, object-ID map | For Photoshop, Blender and Figma round-trips |
| Provenance | C2PA Content Credentials + invisible watermark on every download | Verify page for clients |

Output formats: JPEG, PNG, WebP, TIFF 16-bit, PSD; EXR depth for team plans. Final delivery presets cover 16:9 presentation, 4:5 social, 3:2 print and a moodboard sheet.

## 10. Video, 360 panorama and 3D (GLB) workflow

All three modes reuse the workspace shell, preset pills, Design Contract, locks and credit rules. Only the preset set, the canvas and the gate checks change.

**Image to Video**

- Inputs: start frame (current image), optional end frame, optional reference video, optional storyboard of up to 6 keyframes.
- Preset pills: camera move (walkthrough, orbit, push-in, pull-back, drone, tilt, pan, rise, static), motion strength (subtle, balanced, dynamic), duration (5, 10, 15, 30 s), resolution (720p, 1080p), ambient sound where the model supports it.
- A camera-path editor on the canvas draws the move as a spline with keyframes; a low-res preview renders first, full render only after approval.
- Gate: flicker, object-count and structure consistency across frames; fails refund credits. Optional video upscale to 1080p or 4K.

**360 panorama and HDRI**

- Inputs: a result image, a text brief or a GLB camera position. Output: equirectangular image (up to 8K), HDRI for Blender/Unreal, cube-map faces.
- Viewer: in-browser 360 viewer with hotspots, a seam check, and "fix this area" that reuses the Editor on a flattened projection.
- Shareable tour link with client comments pinned to a direction.

**3D model (GLB, glTF, OBJ, FBX) to render**

- Load a model in a WebGL viewport (orbit, pan, walk), set a camera, then press **Capture**. The capture saves the colour pass plus server-rendered depth, normal and object-ID passes, which give the strongest structure control of any input type.
- **Live generation mode** renders a small distilled model on every pause (about 300 ms idle) at 512 px so the user sees the look update as the camera moves; **Keep this frame** promotes it to a full render with a quoted price.
- Saved camera shots, a section-box tool and a material-ID view let users apply presets per material zone (floor = oak, wall = plaster).
- The same pill workflow applies: presets load as pills, Generate, Editor, Enhance, Video.
- Image to 3D and Floor Plan to 3D export GLB with a polygon budget shown before the run (P2).

**Limits.** Models up to 200 MB and 5M triangles on team plans; larger files are decimated with a notice. Renders are visualisations, not construction documents, and every export footer says so.

## 11. Fidelity engine (anti-hallucination)

Here hallucination means the image gained something nobody asked for or lost something that existed. Zukeviz checks before, during and after generation, and shows the result to the user. Thresholds below are starting values to be tuned on a labelled set.

**Failure taxonomy the checks target:** F1 structural drift, F2 added content, F3 removed content, F4 object corruption, F5 garbled text, F6 prompt miss, F7 mask leak, F8 misleading staging, F9 policy content, F10 counting and scale errors.

| Layer | Control | Rule |
| --- | --- | --- |
| Before | Design Contract | Vision model writes observed facts, inferred facts, defaults, preserve list and acceptance criteria; user can correct ("What I understood") |
| Before | Input gate | Format, size, minimum 512 px short side, blur score, input classifier; warn or reject with reason |
| Before | Prompt linter | L01 to L08 plus conflict check with locks |
| Before | Reference authority | Each reference bound to a role; conflicting roles rejected |
| During | Structure conditioning | Depth, line and segmentation maps (or true passes from 3D); strength capped per module |
| During | Preservation clause + global negatives | Always compiled in; not removable |
| During | Pixel lock | Original pixels composited back outside any mask |
| During | Seed and package storage | Same package + seed + model version reproduces the image |
| After | Fidelity gate | Checks C1 to C10 below, weighted score |
| After | Repair ladder | Targeted inpaint, then tighter control, then model switch; at most 2 repairs |
| After | Disclosure | Badge, change map, changed-elements list |

**Post-generation checks**

| ID | Check | Method | Pass rule (initial) |
| --- | --- | --- | --- |
| C1 | Line structure | Edge-map overlap, input vs output | at least 0.80 (0.90 for plans) |
| C2 | Depth consistency | Monocular depth correlation | at least 0.90 |
| C3 | Opening count | Window and door detector on both images | difference 0 for plans, at most 1 for photos |
| C4 | Object diff | VLM lists objects in both images; flags unrequested additions | zero additions |
| C5 | Mask integrity | Pixel difference outside mask | at most 2 levels |
| C6 | Prompt adherence | VLM yes/no per requested material, object, light | all yes |
| C7 | Artifacts and text | Duplicate, anatomy, OCR detectors | none above 0.6 confidence |
| C8 | Perspective and exposure | Vertical-line deviation, histogram clipping | within 3 degrees, under 2% clipped |
| C9 | Policy and provenance | Safety classifier, logo and face detector, C2PA kept | any hit is a hard fail |
| C10 | Staging integrity | Fixtures, windows, structure unchanged; label added | hard fail on change |

```latex
S = \sum_{i} w_i s_i, \qquad \text{PASSED if } S \ge 0.85 \text{ and no hard fail}
```

**Decision states and money.** Score 0.85 or above and no hard fail: **Verified** (green). 0.70 to 0.84 or soft fails only: **Review** (amber, failed checks listed). Below 0.70 or any hard fail: auto-repair; if still failing, **Flagged**, best candidate returned with one-click Fix or Regenerate, and **the credit is refunded**. Hard fails: C3 on plans, C5, C9, C10.

**What the user sees:** a fidelity badge on every result and export, a Change map toggle, a Layout lock switch (default on; off is labelled creative mode), a **Fidelity slider** (Loose, Balanced, Strict), a changed-elements list ("Added: pendant light. Removed: none."), and **Fix this area**, which opens the Editor with the failing region preselected.

**Evaluation harness.** A gold set of 500 inputs (100 each of exterior views, interior views, sketches, photos, floor plans) labelled by two architects. Release is blocked if the structural pass rate drops more than 2 points on any prompt, preset or routing change; the gate must catch at least 90% of human-marked F1 to F3 failures with under 5% false flags. Detector and judge models also err, so deterministic geometry checks run first and the VLM judge is a second signal.

## 12. Missing features added beyond the four PRDs

The PRDs cover generation and verification well. These are the features your workflow needs that none of them specify, or that they list only as "later".

| # | Feature | Why it matters | Pri |
| --- | --- | --- | --- |
| 1 | Unified canvas across modules (no re-upload, one version tree) | Your core loop: render to edit to video without friction | P0 |
| 2 | Image-aware preset tiles that load as editable pills | Fast, transparent prompt control | P0 |
| 3 | Object panel with auto-segmentation and per-object swap menu | "Select the sofa or table" without drawing | P0 |
| 4 | Bezier pen tool with node editing | Precise region marking and annotation | P0 |
| 5 | Annotation to instruction compiler | Turns marks and text into per-region edits | P0 |
| 6 | Version tree with branches, compare any two, restore | Safe exploration; client options | P0 |
| 7 | Camera-path editor for video and storyboards | Directed motion instead of random movement | P1 |
| 8 | 360 viewer with hotspots and shareable tours | Client walkthroughs without a 3D engine | P1 |
| 9 | GLB viewport capture with depth, normal and ID passes | Best structure fidelity | P1 |
| 10 | Live generation on the 3D or sketch viewport | Draw or orbit and watch the render update | P1 |
| 11 | Design option boards with client voting and comments | Studio review loop | P1 |
| 12 | Client share links (view-only, watermark, expiry, password) | Replaces PDF email chains | P0 |
| 13 | Materials schedule export (CSV/PDF) from the Design Contract | Render-to-spec handoff | P1 |
| 14 | Furniture and material catalogue links (real SKUs) | Shoppable, buildable renders | P2 |
| 15 | Style kit and brand kit (palettes, materials, LUT, logo-safe zones) | Consistent studio look | P1 |
| 16 | Custom style training (LoRA) with validation gallery and licence field | Studio signature styles | P2 |
| 17 | Batch and folder processing with one setup | Whole plan sets, up to 40 photos, then more | P1 |
| 18 | Plugins: SketchUp, Rhino, Revit, Blender, then Archicad | Render inside the tool; true passes | P1 |
| 19 | Public REST API, webhooks, MCP server, Zapier | Automation and integrations | P1 |
| 20 | Assistant chat that picks the module, writes the brief and launches jobs | Guides new users | P1 |
| 21 | Workflows marketplace (verified, team, private) | Reuse and distribution | P1 |
| 22 | Accessibility (WCAG 2.1 AA), keyboard-first editor, RTL languages | Procurement and inclusion | P0 |
| 23 | Offline-tolerant uploads and resumable jobs | Large GLB and video reliability | P1 |
| 24 | Cost and carbon estimate per job; per-member spend caps | Enterprise budgeting | P1 |
| 25 | Prompt and preset A/B lab with eval score | Safe preset changes | P2 |
| 26 | Real-time co-editing on canvas (cursors, selection, comments) | Team design reviews | P2 |
| 27 | Mobile site-capture app (photo to render, AR preview) | Site-visit concepts | P2 |
| 28 | BIM/IFC import and per-material zones | Accurate material assignment from models | P2 |

## 13. System architecture

&#91;embedded content: system architecture · 4 layers, 1 gate\]

Clients talk only to the gateway; the orchestrator owns every job; models are interchangeable workers behind the router; nothing ships without passing the fidelity gate.

| Component | Responsibility | Technology (proposed) |
| --- | --- | --- |
| Web studio | Workspace shell, canvas editor, 3D viewport, 360 viewer | Next.js, TypeScript, Zod shared schemas, WebGL (Three.js), a canvas engine such as Konva or Fabric, WASM image ops |
| Gateway | Auth, rate limits, idempotency (same key within 24 h returns the same job), credit hold | Node or Go service, JWT + API keys, SSO via SAML/OIDC |
| Orchestrator | Job state machine: queued, analyzing, generating, checking, postprocessing, succeeded, failed, blocked | Temporal or a durable queue; stateless workers |
| Input analyzer | Classify input, depth, line and segmentation maps, Design Contract via VLM | Python workers, depth and segmentation models |
| Prompt compiler + linter | Preset resolution, locks, dialect per model, L01 to L08 | Deterministic service, under 50 ms |
| Model router | Pick model and parameters from versioned config; circuit breaker and fallback | Config-driven; weekly provider health check |
| Workers | Hosted-API adapters and self-hosted GPU pool (ControlNet, LoRA, real-time distilled model, 3D render passes) | Autoscaled by queue depth; four lanes (realtime, interactive, batch, video) |
| Fidelity gate | Run C1 to C10, score, repair | CV models + VLM judge on 1024 px proxies, under 3 s |
| Storage | Immutable originals, child versions per edit, signed URLs (1 h) | Object storage + CDN; Postgres; regional buckets |
| Realtime | Progress events every 500 ms, presence on boards | SSE for jobs, WebSocket for collaboration |

## 14. Model router, providers and cost control

Zukeviz is a router with workflow on top, not a single-model app. Model catalogues change fast (the PRDs cite retirements and replacements within months), so the routing table is **versioned config**, every adapter pins a model version, and a weekly health and regression run exercises each route. Model names below are route *classes*; the exact models are chosen at build time from what is current.

| Task | Fast preview | Default | High fidelity |
| --- | --- | --- | --- |
| Sketch / plan / 3D view to render | Hosted edit-native image model | Self-hosted diffusion + depth/line ControlNet, or hosted edit model with structure map | Best structure-faithful edit model + true 3D passes |
| Text to image | Fast hosted model | Mid-tier hosted model | Top hosted model |
| Text inside the image | n/a | Text-strong hosted model | Text-strong model + OCR verify |
| Targeted edit, remove, extend | Small edit model | Instruction-edit model | Top edit model |
| Multi-reference compose | Fast multi-reference model | Reference-strong model | Top model |
| Real-time / live viewport | Distilled model at 512 px on a dedicated GPU lane, under 2 s p95 | n/a | n/a |
| Upscale | Fast 2x | Diffusion 4x | Diffusion + detail pass, up to 8K |
| Image to video | Fast video model | Cinematic video model | 1080p cinematic model |
| 360 / HDRI | Fast panorama model | Panorama model + seam fix | Panorama + upscale tiles |
| Custom style | Self-hosted base + user LoRA | same | same |

**Engine registry record:** id, provider, model, version, capabilities (mask, references, structure control, text, video), credit price, provider cost in micro-dollars, quality tier, fallback list, deprecation date. Margin per engine is tracked on the admin dashboard.

**Routing inputs:** task, input class, requested resolution, plan tier, cost cap, provider latency and error rate, data-residency rule of the workspace (an EU workspace routes only to EU-hosted or zero-retention endpoints).

**Cost control**

- Retries and repairs capped at 2 per job; cost of checks and retries is ours, shown on the cost-per-passed-image dashboard.
- Gate runs on 1024 px proxies in parallel; deterministic geometry checks run before the VLM judge.
- Cheapest engine that meets the module's quality floor is the default; free tier runs at lower priority.
- Target credit gross margin of at least 60% per engine, and at least 2.5x on cost per passed image.

## 15. Data model, credits ledger and plans

**Core tables**

| Table | Key fields |
| --- | --- |
| users, orgs, teams, memberships | id, role (owner, admin, member, viewer), SSO subject, region, spend cap |
| projects, versions | project id, version tree (parent id), input hash, kind (render, edit, enhance, video, pano, 3d) |
| design\_contracts | observed, inferred, defaults, preserve list, protect list (up to 40 entries), locks, acceptance criteria, revision |
| jobs | id, state, idempotency key, module, engine id and version, seed, prompt package (JSON), params, timings, cost micro-dollars |
| job\_checks | job id, check id (C1 to C10), score, pass, evidence image |
| assets | id, owner, storage key, hash, derivatives, C2PA manifest id, retention date |
| layers, masks, annotations | version id, type, geometry (path nodes, polygon), instruction text, reference ids |
| presets, preset\_versions | id, semver, kind, fragments by dialect, ranges, conflicts, visibility, eval score |
| workflows | saved pill sets and sliders, team or private, clone source |
| ledger\_entries | account, type (grant, hold, capture, release, refund, purchase, expire), integer amount, job id |
| audit\_events | actor, action, object, IP, time (append-only) |
| engines | registry record (section 14) |

**Credit rules**

1. Credits are **held** at queue time, **captured** only when the gate passes, and **released** on failure, block or cancel before verifying. A Flagged result is refunded.
2. Every price is shown on the button before the run; there is one currency (credits) with a clear price per action, avoiding the two-currency confusion seen in a reference product.
3. Automatic retries and repairs cost the user nothing.
4. Team jobs draw on the team pool first, then the member balance; per-member caps block with a clear message.
5. All amounts are integers; the ledger must equal the balance and is reconciled nightly with an alert on any drift.
6. Plan credits roll over for one billing month; purchased packs last 12 months.
7. Free grants: one per verified email and device; fair-use caps are published as numbers, never just "unlimited".

**Illustrative credit prices (to validate against provider costs)**

| Action | Credits |
| --- | --- |
| Fast render (1K) | 5 |
| Standard render (2K) | 10 |
| Best-fidelity render | 25 |
| Edit generation (per run) | 10 |
| Remove object / outpaint | 6 to 10 |
| Upscale 2x / 4x / 8K | 2 / 4 / 8 |
| Relight or weather change | 10 |
| 360 panorama | 30 |
| Video, 10 s 1080p | 100 and up |
| Live viewport frame | free in preview, priced on Keep |

**Plans (proposed tiers, prices to be set by market research)**

| Plan | For | Includes |
| --- | --- | --- |
| Free | Trial, students | Starter credits, 2K, watermark, 2 parallel jobs, 90-day history |
| Pro | Freelancers | Monthly credits, 4K, no watermark, 5 parallel jobs, Editor layers export, 1-year history |
| Studio | Teams of 4 to 30 | Pooled credits, shared presets and boards, roles, spend reports, plugins, client share links |
| Enterprise | 30+ seats | SSO/SCIM, audit export, data residency, no-training contract, private endpoints, SLA 99.9%, custom retention, dedicated support |

## 16. Enterprise requirements

Architects upload unreleased projects, so confidentiality and governance decide enterprise deals. These are launch requirements for the Studio and Enterprise tiers.

| Area | Requirement | Acceptance criterion |
| --- | --- | --- |
| Identity | SSO (SAML 2.0, OIDC), SCIM provisioning, MFA, domain capture, session policies | Add or remove a user in the IdP reflects in Zukeviz within 5 minutes |
| Roles and permissions | Owner, admin, member, viewer, client-reviewer; project-level and folder-level access | Permission matrix enforced by API on every read and write |
| Audit | Append-only log of logins, uploads, generations, exports, shares, setting changes; export to SIEM | Any asset access is traceable to a user and time |
| Data privacy | No training on customer data by default and by contract; EXIF/GPS stripped on ingest; encrypted at rest and in transit | A GPS-tagged test file has no GPS in storage |
| Residency | Choose US, EU or APAC region per workspace; routing respects it | EU workspace jobs never reach a non-EU endpoint |
| Retention | Per-workspace retention (30, 90, 365 days, custom), legal hold, delete-my-data within 30 days | Export within 24 h; deletion confirmed by email |
| Provenance | C2PA Content Credentials and invisible watermark on every output; public verify page | Provenance survives download and re-upload tests |
| Governance | Approved preset and model lists, mandatory disclosure label on staging, spend caps, approval flows for video | Policy change takes effect on the next job |
| Security | Signed expiring URLs, per-tenant storage prefix, secrets in a vault, dependency and container scanning, annual third-party pen test, SOC 2 Type II and ISO 27001 programme | SOC 2 Type I within 12 months of launch, Type II after |
| Collaboration | Boards, comments pinned to image regions, client share links with password and expiry | Link revoke takes effect immediately |
| Integrations | REST API with API keys and scopes, webhooks, MCP server, Slack/Teams notifications, SketchUp, Rhino, Revit, Blender plugins using short-lived device tokens | Public API docs and sandbox |
| Trust and safety | Prompt and image classifiers, no real-person likeness, report flow, staging disclosure | Blocked content never reaches the asset store |
| Legal | Terms state output ownership and commercial use; each output records the model that made it; footer: renders are illustrations, not construction documents | Reviewed by counsel before launch |
| Accessibility and language | WCAG 2.1 AA, keyboard-operable editor, 6 languages at launch including Arabic (RTL), light and dark theme | Axe audit and manual screen-reader pass on every release |
| Analytics | Consent banner before any analytics; no session recording on canvases showing uploaded drawings | Verified in privacy review |

## 17. Non-functional targets and SLOs

Targets combine the numbers the four PRDs propose; they are starting points to confirm in alpha.

| Area | Target |
| --- | --- |
| Upload to first preview | p50 under 8 s |
| Interactive render, click to first image | p50 under 15 s, p95 under 40 s at 1.5 MP, including checks |
| Final 2K render | under 30 s p50; best engine under 90 s p95 |
| Live viewport frame (512 px) | under 2 s p95 after 300 ms idle |
| Edit generation | under 25 s p95 for up to 5 regions |
| Upscale 4x | under 60 s p95 |
| Video 10 s, 720p to 1080p | under 3 min p95 |
| Editor interaction | 60 fps pan and zoom on a 4K image; segmentation hover under 100 ms after load |
| Gateway latency | p95 under 150 ms |
| Availability | 99.9% monthly for Enterprise (99.5% for lower tiers); job state survives worker restarts |
| Job success rate | 98% or better excluding user errors |
| Billing integrity | zero double charges; nightly ledger reconciliation |
| Fidelity | at least 95% of default Strict renders pass the structural check at first attempt (85% at launch, rising as the eval set grows) |
| Reproducibility | same prompt package, seed and model version reproduces the image on self-hosted models |
| Browser support | last 2 versions of Chrome, Edge, Safari, Firefox; iPad Safari for review mode |
| Observability | per-job trace across stages; alerts when gate pass rate drops below 90% or refund rate exceeds 1% |
| Disaster recovery | RPO 15 minutes, RTO 4 hours for Enterprise |

## 18. Roadmap

&#91;embedded content: roadmap · 5 phases, 5 gates\]

Weeks assume a team of about 10 to 12 engineers and designers, which is an assumption (no team size was given). Phase 2 contains every P0 item, so launch lands at the end of week 24. Phases are ordered by dependency; dates move with team size.

| Phase | Scope | Exit gate |
| --- | --- | --- |
| 0 Foundations | Build the 500-image labelled set; engine registry and two provider adapters; design system; canvas and segmentation spike; credit ledger skeleton | Eval harness runs end to end; thresholds calibrated on the set |
| 1 Core loop | Auth, uploads, Design Contract; Exterior, Interior, Sketch, Plan renders; workspace shell, preset tiles and pills, linter; fidelity gate v1; Editor v1 (select, mask, pen, text, erase); enhance and upscale; credits with hold, capture, refund | Alpha: 85% structural pass on the eval set; 60% of new users reach a first render in 5 minutes |
| 2 Launch | Object panel, per-object swap, Chat Edit, version tree, change map, Fix this area; Text to Image, Remove/Outpaint, Relight; Video v1 (image to video); boards, share links, teams, roles, basic SSO; C2PA and watermark; 120 presets | All P0 acceptance tests pass; penetration test clean; load test at 3x expected peak |
| 3 Motion and 3D | 360 panorama and HDRI; GLB viewport capture with true passes; live viewport; camera-path editor; storyboards; batch staging; SketchUp and Rhino plugins; public API, webhooks, MCP | Seam and flicker checks meet targets; plugin passes verified on 100 models |
| 4 Enterprise and scale | SOC 2 Type II, ISO 27001, data residency, SCIM, custom retention; style training; catalogue links; Revit and Blender plugins; real-time co-editing; mobile capture; BIM/IFC import | Type II report issued; two enterprise pilots signed off |

## 19. Team, metrics, risks and open questions

**Team (about 12 people, assumption).** Product owner (1), design lead + 2 product designers (3), front-end/canvas engineers (3), platform and orchestrator engineers (2), ML/CV engineers for gate, segmentation and routing (2), QA + eval lead (1). Add trust and safety, security and a solutions engineer from phase 2.

**Success metrics**

| Metric | Target | Source |
| --- | --- | --- |
| Activation: first render within 5 minutes of signup | 60% | events |
| Structural pass at first attempt | 85% at launch, 95% at 12 months | job\_checks |
| First-try usable (kept or downloaded) | 45% at launch, 55% at 12 months | events |
| Renders per final image | 3 or fewer | events |
| Geometry drift flagged by users | under 5% | feedback |
| Free-to-paid conversion in 30 days | 4% or more | billing |
| Credit gross margin per engine | 60% or more | engine registry |
| Refund or credit-back requests per 1,000 renders | under 8 | support |
| Editor adoption: results edited at least once | 50% | events |
| Misleading staging shipped without label | 0 | moderation log |

**Risks**

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Model providers retire or reprice models on short notice | Outage or margin loss | Versioned router config, pinned adapters, fallback chain, weekly regression |
| Gate flags good renders or misses bad ones | Lost trust, wasted credits | Deterministic geometry checks first; Review badge instead of block when unsure; calibrate on labelled set; weekly audits |
| Editor scope is large (segmentation, pen, layers, 3D viewport) | Schedule slip | Phase it: select, mask, pen in phase 1; layers export and 3D viewport later; prototype in phase 0 |
| Retries and checks raise cost | Margin below target | Cap 2 repairs, proxies, cost-per-passed-image dashboard |
| Video and 3D cost per job | Margin | Price from provider cost, preview first at low res, per-plan caps |
| Confidential client drawings leak | Enterprise deals lost | No-training contracts, regional routing, encryption, audit, SOC 2 |
| Staging misleads buyers | Legal and reputation | Staging integrity check, disclosure label, terms |
| Copying a reference product too closely | Legal | Build own prompts, UI, presets and branding; copy patterns, not text or assets |
| Users expect CAD accuracy | Complaints | Label outputs as visualisations; footer note |

**Open questions for you**

1. **Answered in v2** (build target, markets, team and tools, first plugin, strict default, certifications): see section 20.
2. **Still open** (budget, company entity, pilot customers, gold set, own-model ambition, pricing stance): carried to section 33.
3. **New in v3** (approval channels, final-render tier, video music licensing, CAD formats): section 33.

**Caveat.** The four PRDs were written from saved front-end copies and public pages; none shows a back end. Engine details, thresholds and prices here are design proposals to be validated in alpha, not descriptions of how any reference product works internally.

## 20. \[v2\] Locked decisions and what they change in v1

| Question | Decision | Effect on v1 |
| --- | --- | --- |
| Build target | Partner models first (Gemini, ChatGPT image, others) **and** your own model | Section 14 router stays; own models arrive in stages (section 22) |
| Markets | Worldwide | 14 languages, multi-currency billing, regional data residency (section 23); updates sections 15 and 16 |
| Team and tools | AI-assisted build with Grok, GLM, Claude, Gemini, ChatGPT on GitHub, Supabase, Vercel | Lean team and added GPU and job-runner layers (sections 23, 24); updates section 13 |
| First plugin | SketchUp | Section 24; true passes lift accuracy |
| Default fidelity | Strict for plans, masterplans and any input with geometry | Confirms section 11 defaults |
| Certifications | Yes, sequenced | Section 23 replaces the generic line in section 16 |

**Six refinements added by v2:** human-first presets (Looks plus eight questions), a Direction round of four cheap drafts, the chat box as a readable sentence, an accuracy ladder by input type, confidence-led asking, and a staged own-model path. Sections 21 to 24 carry them.

## 21. \[v2\] Human-first presets and UX (supersedes the preset defaults in section 6)

A visualizer never starts with 60 sliders. Presets now follow their thinking: **intent**, then a **Look** (a whole bundle), then **eight plain questions**, ending in one readable sentence. Locks (preservation clause, Design Contract, global negatives) always sit beneath and cannot be overridden.

**Eight questions and their tiles** (all default to Auto; full fragment text is in Appendix A)

| Question | Tiles |
| --- | --- |
| Camera: where am I standing? | Keep my view, Eye level, Wide interior, One-point, Two-point, Street level, Elevation, High oblique, Drone top-down, Detail close-up |
| Time: when is it? | Match my shadows, Morning, Midday, Late afternoon, Golden hour, Sunset, Blue hour, Night |
| Weather: what is the sky like? | Keep as is, Clear, Soft overcast, Broken cloud, Light rain, Fog, Snow, Spring or Autumn |
| Mood: how should it feel? | Neutral, Warm and cosy, Calm and minimal, Bold and graphic, Luxurious, Moody, Fresh and bright, Editorial |
| Materials: what is it made of? | As drawn, Warm timber, Raw concrete, Brick, Glass and steel, Stone, White plaster, Terrazzo, Green wall, Textile |
| People: who is around? | None, Silhouettes, A few distant, Lived-in, Busy, Vehicles |
| Site: what surrounds it? | Keep my context, Urban street, Suburban, Nature, Waterfront, Courtyard, Rooftop |
| Finish: how finished is it? | Photoreal, Soft CGI, White clay, Marker sketch, Watercolour, Line drawing, Blueprint, Night model |

**Sixteen Looks (intent-first bundles)**

| Look | Best for | Fidelity |
| --- | --- | --- |
| Client sales hero | Sales, marketing | Strict |
| Honest listing | Real-estate, staging | Strict + disclosure label |
| Competition board | Competitions | Strict |
| Planning submission | Planning authority | Strict, no embellishment |
| Quick concept | Early ideas | Balanced |
| Magazine editorial | Publications | Balanced |
| Night glow | Evening mood | Strict |
| Rainy mood | Atmosphere | Balanced |
| Winter light | Seasonal | Strict |
| Family home | Residential | Strict |
| Hospitality lobby | Hotels, restaurants | Strict |
| Workplace | Offices | Strict |
| Retail window | Retail | Strict, signage left blank |
| Landscape master view | Masterplans | Strict |
| Material study | Detail, specification | Balanced |
| Moodboard sketch | Concept boards | Creative |

**Refined flow (replaces steps 2 to 4 of section 4 when Agent Zuke is off)**

1. A **"Here is what I see" card** (2 s) shows input type, objects and what will be kept, with three one-click corrections.
2. Pick an **intent**, then a **Look** shown on the user's own image.
3. **Direction round:** four fast, cheap drafts; the user picks one or says "more like this".
4. **Promote** the chosen draft to a full render with the same seed and a quoted price; the gate runs here.
5. **Review:** badge, compare, change map; **Looks good**, **Fix something**, or **Try another direction**.

**Three modes:** Simple (intent chips, Looks, Generate), Pro (eight panels, pills, locks, references, Editor), Expert (seed, strengths, model, compiled prompt, API view).

**The chat box is a sentence.** *"Photoreal eye-level view at golden hour, light oak cladding, a few people in the distance. Keep every wall, window and the roofline as drawn."* Pills are highlighted words; click to swap, type to add; the Keep clause is pinned with a lock.

**Rules:** auto first, ask second, expert last; one question per run at most; price before every spend; every action is a child version; one change per edit; keyboard-first Editor (V select, P pen, T text, B brush, E erase, M mask, G generate, `[` collapse menu); plain error copy that says whether credits were charged.

## 22. \[v2\] Accuracy ladder and own-model strategy (updates sections 11 and 14)

The v1 gate stays. v2 raises the ceiling before generation: accuracy depends on the quality of the structure signal, so the product gets the best signal it can and tells the user which rung they are on.

| Rung | Input | Structure signal | Badge | Structural pass target, launch / 12 months |
| --- | --- | --- | --- | --- |
| 1 | SketchUp plugin or GLB | True depth, normals, material and object IDs, exact camera | Model-accurate | 92% / 97% |
| 2 | 3D screenshot | Estimated depth, line and segmentation maps | Geometry-locked | 88% / 95% |
| 3 | Floor plan, elevation, **CAD 2D** | Line maps, OCR, and (v3) extruded model from the plan | Plan-locked | 85% / 93% |
| 4 | Sketch | Cleaned edge map | Line-locked | 80% / 90% |
| 5 | Photo | Estimated depth and segmentation | Photo-based | 75% / 88% |
| 6 | Text only | None | Creative | Prompt faithfulness only |

Targets are not measurements; they are set against the 500-image evaluation set and revised after alpha. Other v2 accuracy rules: per-region fidelity and locks, seed-stable repairs, dropping drafts that disagree with the input structure, a two-signal rule (geometry check and vision judge must agree for a hard fail), thresholds tuned per input type, door-height scale checks, and burned-in exact text instead of model-drawn text.

**Own-model path (staged, replaces the open build question in section 14)**

| Stage | What you own | Needs |
| --- | --- | --- |
| A. Router (phase 1) | Orchestration, prompts, presets, evaluation set; partner models behind the registry | Provider keys |
| B. Own judges (phase 2 to 3) | Opening and object detectors, fidelity scorer, segmentation, preference ranker | Labelled gold set, user reports with consent |
| C. Own adapters (phase 3) | Structure and material-zone adapters, studio-style LoRAs on an open-weight model | Paired SketchUp passes and approved renders |
| D. Own live model (phase 3 to 4) | Small distilled model for the live viewport | GPU lane |
| E. Own generator (phase 4+) | A Zukeviz render and edit model | Large licensed dataset, GPU budget, ML team |

An own model replaces a partner on a route only if it matches or beats the partner on the evaluation set for that rung at lower cost per passed image. Training data is opt-in, carries rights metadata, and evaluation sets are never trained on. A from-scratch generator may not beat frontier partner models for years; the moat is the structure signal, the gate, presets, editor, agent and data.

## 23. \[v2\] Build stack, worldwide launch and certifications (updates sections 13, 15, 16)

**Stack.** GitHub (repos, CI, evaluation gate), Vercel (Next.js studio, API routes, short jobs), Supabase (Auth with SAML SSO, Postgres with row-level security, Storage, Realtime, queues). Two layers are added because these platforms do not run GPU models or very long jobs: a **durable job runner** and **rented GPU workers**. Vercel Functions default to 300 seconds with an 800-second configured maximum and a 1,800-second beta ([Vercel limits](https://vercel.com/docs/functions/limitations), [Vercel changelog](https://vercel.com/changelog/bun-runtime-now-supports-large-functions-and-extended-max-duration)); Supabase SAML SSO needs Pro or above, is set up per customer with the CLI and has no native SCIM ([Supabase docs](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml)). v3 agent runs and video exceed those limits, so they always run in the job runner.

**AI tools by role (to be confirmed on your own evaluation set):** Claude for architecture, review and orchestrator code; Gemini for image and vision routes; ChatGPT for image edit and text-in-image routes; Grok for second-opinion review and research; GLM for low-cost bulk work such as preset wording and translations. Rules: every change is a pull request with a preview deploy; RLS tests prove tenant isolation; the evaluation gate blocks merges on a drop of more than 2 points; humans approve billing, auth, ledger and RLS changes.

**Worldwide launch**

| Topic | Plan |
| --- | --- |
| Languages (14) | English, Spanish, Portuguese (Brazil), French, German, Italian, Dutch, Arabic (right-to-left), Hindi, Chinese (Simplified), Japanese, Korean, Turkish, Indonesian; the compiled prompt is always English |
| Currencies | USD, EUR, GBP, INR, AED, SAR, AUD, CAD, JPY, BRL, MXN with local price points; one global credit unit |
| Tax and payments | A merchant of record (for example Paddle or Lemon Squeezy) for VAT and GST, or Stripe with Stripe Tax; UPI through an Indian gateway; local methods where volume justifies |
| Privacy | GDPR and UK GDPR, India DPDP, Brazil LGPD, CCPA; DPA template, sub-processor list, delete and export within 30 days |
| AI-content labelling | C2PA plus invisible watermark on every output; visible label option; counsel to confirm obligations by market |
| Mainland China | Not in launch scope (separate localisation and licensing) |
| Residency | Regional projects for the US, EU and India/APAC |

**Certification order:** security policies, DPA, penetration test and trust page (phases 0 to 2); SOC 2 Type I and a WCAG 2.1 AA audit with VPAT (phase 2); SOC 2 Type II window (phase 3); Type II report and ISO 27001 (phase 4); later ISO 27701 and ISO 42001. The first signed pilot decides what moves earlier. Confirm every legal point with counsel per market.

## 24. \[v2\] SketchUp plugin and lean roadmap (updates section 18)

**SketchUp plugin** (Ruby extension with an HTML dialog, SketchUp 2020 and later, distributed through the Extension Warehouse; signing and review need lead time, so start in phase 1).

| Sends | Used for |
| --- | --- |
| View image and saved scenes | Colour reference, input |
| Camera: eye, target, up, field of view, projection | Exact camera lock |
| Lightweight scene export (for example glTF, OBJ or DAE) with tags and materials | Server renders true depth, normal and object-ID passes |
| Material and tag names | Material-zone presets |
| Component and classification data (windows, doors, stairs, columns; IFC type when present) | Design Contract facts, exact checks C3 and C4 |
| Sun date, time and location | Auto time of day |

In SketchUp the user gets a dockable panel with the same Looks, questions and pills, a **Live link** that sends only the new camera when the view stops moving, a results gallery with **Open in Zukeviz**, and **Render all scenes** with one Look. Sign-in uses a device code with short-lived tokens; geometry upload can be switched off. Acceptance: a model with 12 windows and 3 doors yields a contract with those counts and passes C3 with zero difference; camera and field of view match within 1 degree; first preview in under 15 seconds. Rhino follows in phase 3; Revit and Blender in phase 4.

**Lean team (assumption).** Product owner (you), 1 to 2 full-stack and canvas engineers, 1 ML and platform engineer, 1 SketchUp/Ruby engineer (contract at first), 1 product designer; part-time evaluation lead, legal, security and tax advisers. AI tools do bulk coding; humans own the gate, editor, ledger and tenant isolation. The v3 dates in section 33 replace the phase table in section 18 and the earlier v2 estimate.

**Cut order if tight:** co-editing, catalogue links, Blender and Revit, style training, 360 tours, batch staging. Never cut the gate, the ledger, the Design Contract or tenant isolation.

## 25. \[v3\] Market pain study: property developers in marketing and sales

I read "developer in arch for marketing and sales" as the **property developer** who commissions architecture and sells off-plan, plus the architect and visualizer who serve them. If you meant software developers, tell me and I will redo this section. Most sources below are visualization studios and vendors with a commercial interest, so treat their numbers as claims, not measurements; the patterns repeat across independent legal and industry sources.

**What the evidence says developers struggle with**

| # | Pain | What the sources say | Zukeviz response |
| --- | --- | --- | --- |
| 1 | **Visualization arrives too late.** It is treated as a last "make it pretty" step, so questions that were cheap to answer early surface after brochures and campaigns are live | A visualization practitioner says developers treat it as the final step before sales ([LinkedIn post](https://cy.linkedin.com/in/vlad-prys/en)); a studio calls adding renders after decisions are locked one of the most expensive mistakes ([Digital Bunch](https://www.thedigitalbunch.com/blog/why-do-cheap-architectural-renderings-cost-more-than-premium-visualization)) | Agent Zuke runs from the first CAD plan, so options are tested at concept stage (section 26) |
| 2 | **Handoff gap between design and marketing**, causing cost and delay | Drawings and models are not structured to serve marketing and sales ([Rethinking Development Workflows](https://jerichodomingo.squarespace.com/blog/development-workflows-experience-driven-market)) | One project memory shared by design, marketing and sales (section 28) |
| 3 | **Fragmented vendors**: render studio, web agency, media buyer, video house, display software, each briefed separately | Off-the-plan teams coordinate several agencies for renders, walkthroughs, films and display software ([The Urban Developer](https://www.theurbandeveloper.com/articles/from-showroom-to-smartphone-volume-vision-s-all-access-sales-suite)); studios are not briefed on the lifestyle positioning ([Digital Bunch](https://www.thedigitalbunch.com/blog/why-real-estate-property-launches-fail-without-integrated-communication)) | One pipeline from plan to stills, video and web/social sizes, with a brand and positioning brief stored in the Scene Bible |
| 4 | **Cost and turnaround per unit type**: weeks and a high price for each apartment, finish option or revision | Vendor claims of 2 to 6 weeks and 500 to 2,000+ euros per apartment ([MeltFlex](https://www.meltflexai.com/blog/meltflex-ai-partners-yit-herrys-vi-group-slovakia)); a two-week turnaround is offered as a selling point ([Box Brownie](https://boxbrownie.com/b/how-to-pre-sell-property-in-72-hours-even-if-youve-never-done-it)) | Batch unit-type runs with one setup; cheap Direction round; credits priced per passed image |
| 5 | **Finish and option variants**: buyers choose packages and expect to see them | Developers offering several finish packages can render each option ([Fotober](https://fotober.com/pre-construction-rendering)) | Material-zone presets and a **Variant matrix** (unit type x finish x time of day) in Agent Zuke |
| 6 | **Revision loops destroy margin** for studios and delay launches | Unlimited revisions are called the top financial risk, and each revision can cascade through the pipeline ([Coohom](https://www.coohom.com/article/client-risks-and-quality-control-in-3d-interior-visualization-projects)); strict two-round policies are advised ([Financial Models Lab](https://financialmodelslab.com/products/3d-architectural-visualization-service-profitability)) | Fix-this-area edits, version tree, approval gates with a counted redo budget (section 29) |
| 7 | **Misleading imagery creates legal and trust risk.** Renders that overstate views, finishes or room size lead to disputes | An Australian court found a disclaimer inadequate to correct a misleading render ([Clayton Utz](https://www.claytonutz.com/insights/2022/may/tell-em-theyre-dreaming-building-development-illustrations-and-the-australian-consumer-law)); interior renders that make rooms look larger breed mistrust ([Property Update](https://propertyupdate.com.au/?p=194312)); orientation, views and finishes are the details buyers can check against the contract ([Maverick Frame](https://maverickframe.com/lead-magnets/3d-rendering-for-real-estate.pdf)); UK advertising guidance accepts upgrade imagery for off-plan homes only when the price is clearly stated ([ASA](https://www.asa.org.uk/advice-online/property-new-build-and-off-plan-homes.html)) | Honest Listing and Planning Look defaults, the staging integrity check, orientation and view checks against the plan, disclosure labels, an **Honesty report** per image |
| 8 | **AI disclosure is arriving.** Regulators and platforms are asking for labels on altered images | New York's Department of State warned that AI-staged images may be misleading ([AI Weekly](https://aiweekly.co/alerts/new-york-warns-buyers-of-deceptive-ai-staged-real-estate-photos)); Wisconsin requires disclosure of technology-altered advertising from 1 January 2027 ([SAN](https://san.com/cc/real-estate-listings-get-an-ai-makeover-when-does-it-become-false-advertising/)) | C2PA and watermark on every output, label templates by market, approval log |
| 9 | **Carrying cost of unsold stock** makes time to market critical | Each unsold month costs interest, taxes and insurance ([Boston Apartments](https://bostonapartments.com/architectural-design/how-3d-rendering-sells-real-estate-before-construction.htm)) | Same-day first deliverables: plan to approval pack in hours, not weeks |
| 10 | **Static floor plans do not sell**; buyers want a feeling and a walk-through | A 3D floor plan sits between the drawing and a full render in cost and information ([Buildington](https://www.buildington.co.uk/blog/off-plan-on-point-how-3d-renders-are-shortening-sales-cycles-for-uk-developers/amp)); interior renders do the emotional work ([Fotober](https://fotober.com/pre-construction-rendering)) | Top-down styled plan, isometric view and room views from the same CAD file (section 27) |
| 11 | **Small teams, tight deadlines, shrinking budgets** for in-house and studio visualizers | Studios and freelancers are expected to deliver major projects with smaller teams and faster deadlines ([Garage Farm](https://garagefarm.net/blog/the-perks-and-pitfalls-of-being-a-3d-architectural-visualizer)) | Agent Zuke does the repetitive production; humans keep taste and approval |

**Requirements derived from the study**

| ID | Requirement | Pri |
| --- | --- | --- |
| PD-01 | Start from CAD 2D and produce an approval pack (plan, isometric, room views) without a 3D model | P0 |
| PD-02 | Unit-type and finish **Variant matrix** run from one setup | P1 |
| PD-03 | **Honesty report** per image: orientation, view, room-scale and finish checks against the plan, with a disclosure label option | P0 |
| PD-04 | Output packs by channel: brochure, website, portal, social 1:1, 4:5, 9:16, 16:9, sales-gallery screen | P1 |
| PD-05 | Brand and positioning brief stored in project memory and applied to every output | P0 |
| PD-06 | Counted revision budget with visible cost per round, two free rounds by default | P1 |
| PD-07 | Client approval page with per-image comments, no login for reviewers | P0 |
| PD-08 | Disclosure and artist's-impression labels by market, editable by counsel | P1 |

## 26. \[v3\] Agent Zuke: from CAD plan to one finished video

Agent Zuke is a mission mode on top of the Studio. The user uploads a CAD plan, picks a style and a budget, and Zuke carries out the work as a chain of steps, each using the same engines as the manual product (presets, fidelity gate, Editor, upscaler, video). A person is asked once, at the approval gate; nothing expensive runs before that.

&#91;embedded content: Agent Zuke pipeline · 9 steps, 1 approval gate, 1 redo loop\]

The pipeline in words: CAD plan in; styled top-down plan; isometric view and one view per room with professional camera angles; people added at checked scale; a notification with an approval page; if approved, 8K to 15K finals, then a video director and a video editor, ending in one downloadable MP4; if not approved, the user edits the model, Zuke redoes the views, and the loop returns to the gate. Every step reads from and writes to the project memory in section 28.

| Step | What Zuke does | Tool it calls | Output |
| --- | --- | --- | --- |
| 1 Intake | Reads the CAD file, checks scale and units, lists rooms, openings and levels | CAD parser (section 27) | Semantic plan and a short checklist for the user |
| 2 Top-down plan | Renders the plan in the chosen Look, with materials and furniture hints | Render engine, Strict fidelity | Styled plan image |
| 3 Views | Plans an isometric view and one camera per room, then renders each | Camera planner, render engine | Contact sheet of views |
| 4 People | Places scaled people and objects that fit each room's use | Entourage tool | Views with people |
| 5 Gate | Runs the fidelity gate and the Honesty report, then notifies the user | Gate, notifier (section 29) | Approval pack |
| 6 Finals | After approval, upscales selected views to 8K to 15K | Tiled upscaler | Final stills |
| 7 Video | Builds a shot list from the approved stills and renders clips | Video director (section 30) | Clips |
| 8 Edit and export | Assembles the timeline, adds titles, music and grade, exports | Video editor | One MP4 |

**Autonomy rules:** Zuke may spend credits only up to a budget the user sets for the mission; it stops at the gate and never skips it; it shows a price before every costly stage; it pauses and asks if the plan has no scale, missing levels or unreadable layers; every action is logged and reversible by version. Zuke can be switched off at any time and the user lands in the Studio with all versions intact.

## 27. \[v3\] CAD 2D to top-down, isometric and room views

**Goal:** turn a flat drawing into a styled top-down plan, an isometric view and one strong view per room, with geometry that stays true to the drawing (rung 3 of the accuracy ladder, lifted by an extruded model).

**Step A. Read the CAD file.** Accept DWG, DXF and PDF plans (PDF through vector extraction first, raster as fallback). Detect units and scale, layers, walls, doors, windows, stairs, room names and dimensions. Output a semantic plan: levels, rooms with polygons and use, openings with width and swing, ceiling height (default or from notes). Anything uncertain goes to a one-screen checklist for the user to confirm; unreadable files are reported, never guessed.

**Step B. Build a simple model.** Extrude walls to the ceiling height, cut openings, add floor and ceiling slabs, and export a lightweight GLB. This is not a design model; it exists so the server can render true depth, normal and object-ID passes. Passes feed the same Strict pipeline as a SketchUp model, so counts of rooms, windows and doors are exact.

**Step C. Top-down plan.** Render a plan view from the model in the chosen Look: material zones by room use, furniture hints from room labels, soft shadow, labels optional. Walls and openings are locked by the Design Contract.

**Step D. Isometric view.** A fixed 30 degree isometric camera with a cutaway of the roof or upper levels, same Look and light as the plan.

**Step E. One view per room, with a camera planner.**

| Rule | Setting |
| --- | --- |
| Eye height | About 1.6 m standing; 1.1 m for seated or hospitality moods; 1.2 m for kitchens and counters when a countertop view is wanted |
| Lens | 18 to 24 mm equivalent for small rooms, 24 to 35 mm for large rooms, never extreme wide |
| Verticals | Kept upright (two-point correction) unless the Look asks otherwise |
| Position | Stand in a corner or doorway for the longest sightline; keep the camera inside the room and out of walls and furniture |
| Framing | Rule of thirds, a leading line (floor, counter or ceiling), hero object in view, window light behind or to the side, no cropped doorways |
| Candidates | Generate 3 to 5 candidate cameras per room from a geometric search, score them (visible floor area, openings in view, depth, clutter, no clipping), render the top one, keep two as alternates |
| Special rooms | Living: wide corner view. Kitchen: island or counter line. Bedroom: bed and window. Bathroom: doorway view with mirror avoided. Entry: door-to-room axis. Balcony: outside-in view |

**Step F. People and entourage.** Add people only where the room use supports them (for example one person at a kitchen counter), at a scale checked against door height (about 2.0 to 2.1 m) and ceiling height; diverse, non-identifiable figures; never in front of key features, never with a face that could be a real person. People presets: none, silhouettes, a few, lived-in. Cars, plants and props follow the same scale check. The same person identities are reused across rooms and later in video through the Scene Bible.

**Acceptance:** top-down plan wall layout matches the CAD within 1% of lengths; room and opening counts match exactly; each room camera is inside the room, 1.5 to 1.7 m high by default, with no wall clipping; people height within 5% of the scale for their distance; 90% of room views are accepted without a camera change in the gold set.

## 28. \[v3\] Project memory: carrying context from image to image to video

Today each generation starts cold. In Zukeviz every generation reads a shared memory and writes a short record back, so the tenth image looks like it belongs with the first, and the video looks like the stills. The memory thinks like an arch-viz studio: one light, one lens language, one palette, one cast of people, per project.

**Four layers (narrowest wins on conflict)**

| Layer | Holds | Scope |
| --- | --- | --- |
| Org | Brand colours, logo, tone, legal labels, banned words and looks | Whole organisation |
| Project: the Scene Bible | Style and Look, material palette per room, light and time of day, weather, lens and camera conventions, people identities, props, site context, locked objects, approved references, positioning brief | One project |
| Shot | The room or view, its camera, its seed, what was approved, what was rejected and why | One view |
| User | Taste signals: favoured Looks, repeated rejections, units, language | One person, private |

**Generation card.** After every generation the system saves a card: input and rung, compiled prompt, Look and tile choices, camera, seed, model and version, gate result, user verdict (approved, rejected, edited) and a comment if given. Cards are the training signal for the memory and, with consent, for evaluation.

**How a new generation uses memory**

1. The prompt compiler adds a **Continuity block** from the Scene Bible: the same light direction and colour temperature, the same materials by room, the same people, the same palette. Conflicts with the user's current choice are shown, not silently overridden.
2. The nearest approved image in the same project is attached as a **style reference** (not a structure reference), so tone and grading match.
3. After rendering, a **continuity score** compares the new image with the references for palette, exposure, time of day and people identity. Below the threshold it is retried once, then flagged in the approval pack.
4. The user's accept and reject choices update the memory: rejected materials are downweighted; approved images become references.

**Image to video continuity.** The video director takes from memory: the approved stills as keyframes, the camera and lens of each still as the starting pose of its clip, the same light and time of day, and the same people identities. Clips are checked for identity drift and for flicker against the keyframe; failures re-render with a lower motion setting. The memory also remembers the video grammar the user prefers.

**Controls the user sees:** a Memory panel with the style card, the palette chips, the cast and the locked objects, each editable; a switch per generation (use memory or ignore it); and a Reset. Memory is private to the project and tenant, can be exported and deleted, and is never used to train shared models without opt-in.

**Storage:** Postgres tables scene\_bible, memory\_items and generation\_cards with pgvector embeddings for retrieval; image references live in Storage with row-level security. Acceptance: continuity score of 0.8 or higher on 85% of images in a gold project; user-rated consistency of 4 out of 5 or better in pilots.

## 29. \[v3\] Approval gates, notifications, redo loop and 8K to 15K finals

**Why a gate.** Finals are the costly step, so Zuke renders cheap approval-size views first and asks a person before it spends on the big ones. This also protects against misleading imagery: a human sees the Honesty report before anything is published.

**Notification.** When the approval pack is ready, the user is notified by their chosen channels: in-app, email, push, and optionally WhatsApp, Slack or Microsoft Teams. The message states the project, what is ready, the price of the next stage, and one button, **Review**. Reminders after 24 hours and 72 hours; the mission pauses and holds no credits while waiting. Quiet hours and one channel per person are respected.

**Approval page** (works without an account, through a signed, expiring link; also in the app)

- Contact sheet of the top-down plan, isometric view and every room view, with a before and after toggle against the CAD plan.
- Per image: **Approve**, **Reject**, or **Comment on a spot** (click on the image to pin a note).
- Honesty report and gate badge per image; disclosure label option.
- Total price of the finals and a budget bar; Approve all, Approve selected, or Request changes.
- Reviewer roles: owner decides spend; guests (client, sales lead) may comment and approve but never spend.
- A full audit log: who approved what, when, on which version.

**If not approved: the redo loop**

| User action | What Zuke does |
| --- | --- |
| Rejects an image with a comment | Maps the comment to a fix: camera, material, light, people, layout. Re-renders only that view, as a child version, with the Design Contract unchanged |
| Pins a spot with a note | Opens the Editor on that region with the note as an inline instruction |
| Says the layout is wrong | Opens the **edit model** step: the semantic plan (walls, openings, room use) is shown as an editable 2D drawing; changes regenerate the GLB and every dependent view |
| Asks for a different Look | Re-runs views with the new Look, memory kept |
| Exceeds the redo budget | Shows the cost of a further round before running it; two rounds are free by default |

Every loop returns to the gate with the changes highlighted; only changed views are re-approved.

**Final renders, 8K to 15K.** After approval, each chosen view is re-rendered or upscaled in tiles: a master at the model's native size, then tiled detail passes with a structure lock per tile, seam blending, texture refinement and optional film grain. Sizes: 8K (7680 px wide), 12K, 15K (15360 px wide) with a price per size shown first. Tiled passes run in the GPU job runner, never in Vercel functions. The fidelity gate runs again on the final, with a tile seam check and a pixel-diff against the approved version so nothing changes in what the client approved. Outputs: PNG, 16-bit TIFF, JPG, plus a print pack and web-size set; C2PA and watermark on every file. A 15K image is very large, so downloads use resumable links and previews are tiled.

**Acceptance:** notification delivered within 60 seconds of gate pass; approval page loads in under 3 seconds on mobile; finals keep at least 98% structural agreement with the approved view; no credit is spent before approval except the budget the user set for the approval pack.

## 30. \[v3\] Video director and video editor (updates section 10)

**Video director (agent).** Turns the approved stills into a short film and never invents a space the stills do not show.

1. **Shot list** from the approved stills: establishing (isometric or exterior), move through (room to room), detail (material, light), hero (best view), closing. Default 30 to 45 seconds, 5 to 8 seconds per shot, 24 fps, 16:9, with 9:16 and 1:1 cut-downs as options.
2. **Arch-viz motion grammar:** slow dolly, push-in, gentle pan or orbit; no whip pans, no shaky handheld, no fast zooms; constant eye height inside rooms; lens kept from the still; light kept the same.
3. **Clip generation** from each still as keyframe through the video route in the router, with the still's camera as the starting pose, and the same Scene Bible people and light. Presets use the same Look, tile and pill workflow as images (Motion tiles: dolly in, dolly out, truck, orbit, rise, pan, hold).
4. **Checks:** keyframe fidelity, identity drift, flicker, warped geometry and straight-line bend; failed clips re-render with lower motion, a different seed or a shorter length. The user sees a storyboard card first and approves it before clips are paid for.
5. **Cost control:** a price for the whole video before clips run; clip-by-clip regeneration.

**Video editor (in the app).** A simple timeline built for a viewer who is not an editor, with Pro controls behind a toggle.

| Tool group | Required tools |
| --- | --- |
| Timeline | Multi-track video, audio and title lanes; drag to reorder; ripple delete; snap; zoom; undo and redo |
| Cutting | Trim, split, delete, duplicate, replace clip, freeze frame |
| Motion | Speed ramp, reverse, stabilise, frame interpolation to 30 or 60 fps, upscale to 4K |
| Transitions | Cut, cross-dissolve, dip to black, slide, match-cut; one default for the whole film |
| Look | LUT presets (neutral, warm, cool, filmic), exposure, contrast, saturation, vignette, film grain; apply to all clips |
| Text and brand | Titles, lower thirds, project name, price and contact end card, logo watermark, safe areas, font set from the brand kit |
| Audio | Licensed music library and uploaded track, auto-duck, fade, voice-over by text-to-speech in 14 languages, captions and subtitle export |
| Aspect | 16:9, 9:16, 1:1, 4:5 with auto reframe and per-clip crop |
| AI assist | Regenerate a clip, extend a clip, fix a flagged clip, suggest a cut to the music beat |
| Export | MP4 H.264 and H.265, ProRes for studios, 1080p and 4K, bitrate presets, 9:16 social set, captions as SRT; C2PA and watermark; resumable download |

**Rendering the cut:** the timeline is saved as a JSON edit list; a server FFmpeg job in the GPU and job runner assembles it; a low-resolution proxy renders live in the browser. Music must come from a licensed library or the user's own file; the product states the licence on export. One video is produced per mission by default, downloadable from the mission page and from the Video tab.

**Acceptance:** a 40-second video from approved stills in under 30 minutes of compute; at least 90% of clips pass the drift and flicker checks on the first or second try; edit-list changes preview within 2 seconds.

## 31. \[v3\] Agent architecture, safety limits, data model and evaluation (updates sections 13 and 15)

**Architecture.** One **planner** turns a mission (inputs, style, budget, channels) into a step plan and hands each step to a **typed tool**: cad\_parse, model\_build, camera\_plan, render, gate, entourage, notify, finals, video\_plan, clip\_render, timeline\_build, export. Sub-agents are narrow (camera, entourage, video director, QA) and can only call their own tools. The workflow runs as a **durable state machine** in the job runner: every step is persisted, resumable after a crash, and retried with a cap. Language models write plans and prompts; they never write money, permissions or data directly; those go through typed tools that check budget, role and tenant.

**Safety limits**

| Risk | Limit |
| --- | --- |
| Runaway spend | Budget cap per mission; price shown per stage; hard stop at the cap; refund-on-fail rules from section 15 apply |
| Loops | Maximum attempts per step (default 2) and redo rounds per mission (default 3), then ask the user |
| Prompt injection from files | Text inside CAD, PDF or reference files is data, never instructions; tools accept structured arguments only |
| Misleading output | Honesty report and disclosure labels are mandatory before the gate can pass |
| Wrong-tenant data | Row-level security on every table; the agent runs with the user's token, not a service key |
| Unwanted actions | Notifications go only to the mission owner and invited reviewers; sharing links expire |
| Silent changes | Audit log of every plan, tool call, input hash, output id and cost |

**New data model (adds to section 15).**

| Table | Purpose | Key fields |
| --- | --- | --- |
| agent\_runs | One mission | id, project\_id, owner\_id, status, budget\_cap, spent, plan\_json, started\_at |
| agent\_steps | One step of a run | run\_id, kind, tool, input\_hash, output\_ref, status, attempts, cost, error |
| approvals | Gate decisions | run\_id, reviewer\_id or token\_hash, target\_id, decision, comment, pin\_xy, decided\_at |
| notifications | Messages sent | run\_id, channel, recipient, template, sent\_at, opened\_at |
| scene\_bible | Project memory card | project\_id, style, palette, light, lens\_rules, cast\_json, brand\_json, locked\_objects, version |
| memory\_items | Retrievable memory | project\_id, scope, kind, text, embedding, source\_card\_id |
| generation\_cards | One per generation | id, version\_id, compiled\_prompt, camera, seed, model, gate\_json, verdict, comment |
| cad\_sources | Parsed drawings | project\_id, file\_ref, units, scale, semantic\_plan\_json, confirmed\_by |
| shots | Views and clips | project\_id, room\_id, camera\_json, still\_version\_id, status, alternates |
| storyboards | Video plans | project\_id, shot\_ids, duration, approved |
| video\_projects | Edit lists | project\_id, timeline\_json, aspect, export\_refs |

**Evaluation of the agent** adds to the 500-image gold set: 40 CAD plans of mixed quality (clean, scanned, messy layers) with ground-truth rooms and openings; camera-planner scoring by architect raters (blind, 1 to 5); continuity pairs; video drift and flicker clips. Release gates: CAD room and opening detection of 95% or better on clean files; camera acceptance of 85% or better; mission success without human rescue of 70% or better at launch and 85% at 12 months; zero cross-tenant reads in RLS tests; and any drop of more than 2 points blocks release as before.

## 32. \[v3\] Stitch prompt pack for UI/UX planning (superseded by section 47)

**How to use it.** Paste the **master prompt** first so Stitch sets the shared look, then one **screen prompt** at a time. Change one thing per follow-up (for example "make the left rail narrower"), keep the design tokens fixed, and export each screen to your design file for review. Check every screen against the rules in sections 3, 7, 21 and 29. Stitch output is a starting point; the Editor canvas and video timeline need a developer-built canvas, not only a mockup.

**Design tokens (use in every prompt)**

| Token | Value |
| --- | --- |
| Mood | Calm, precise, studio-grade; the image is the hero, the interface steps back |
| Surface | Near-white and warm grey for light mode; deep neutral for dark mode (default dark for the Editor) |
| Accent | One confident colour (deep teal) used only for primary actions and the active pill |
| Status | Green passed, amber review, red flagged |
| Type | One clean sans family; sizes 12, 14, 16, 20, 28; tabular numbers for prices |
| Shape | 8 px corners, 1 px borders, no heavy shadows |
| Spacing | 4 px grid; left rail 320 px, collapsed 64 px; chat bar 72 px |
| Motion | 150 to 200 ms, no bouncing |

**Master prompt**

```
Design a desktop web app called Zukeviz, an AI visualization studio for architects, interior designers and property developers. Style: calm, precise, studio-grade, near-white light mode and a dark mode, one deep teal accent, one clean sans-serif family, 8px corners, 1px borders, no heavy shadows. The image canvas is the hero; controls stay quiet. Core layout: a collapsible left icon menu (64px collapsed), a left preset panel (320px) with image tiles in a grid, a top bar with project name, version history, mode switch (Simple, Pro, Expert), credits and share, a large central canvas that shows the image with zoom controls, and a bottom chat bar that shows the compiled prompt as one readable sentence with editable pills. Use plain human labels, not technical terms. Include empty, loading, error and success states. Keep every screen consistent with this system.
```

**Screen prompts**

| # | Screen | Prompt (add after the master) |
| --- | --- | --- |
| 1 | Studio workspace | The main render screen. Left preset panel with eight question groups (Camera, Time, Weather, Mood, Materials, People, Site, Finish) as collapsible sections of image tiles, each with an Auto tile selected. Centre canvas shows an interior render with a small card "Here is what I see" listing detected objects and a lock list. Bottom bar: sentence "Photoreal eye-level view at golden hour, light oak cladding, a few people. Keep every wall and window as drawn." with highlighted pills and a lock icon on the keep clause; a primary Generate button with price. Show a four-draft strip for the Direction round |
| 2 | Looks gallery | A full-width gallery of 16 Looks, each a large image tile with a name, a one-line use (Client sales hero, Honest listing, Planning submission, Night glow and so on) and a fidelity badge. Filter chips for Residential, Hospitality, Retail, Workplace, Masterplan. Hover shows a before and after of the user's own image |
| 3 | Editor | Dark, Figma-like editor. Left toolbar: select, pen with node handles, brush, mask, text, eraser. Right panel: layers and detected objects (sofa, table, window), stroke width slider, colour, notes list, reference attachments for image, video and 3D. Canvas with a selected sofa showing a bounding outline and a pinned note. Bottom bar: a short instruction field and Generate with price. Show version tree on the right edge |
| 4 | Agent mission control | A mission page for Agent Zuke. Top: mission name, budget bar, status. Main: a vertical pipeline of eight steps (CAD intake, top-down plan, views, people, approval, finals, video, export) with status chips, thumbnails and cost per step; the current step expanded with a log. Right: project memory card (style, palette chips, cast, locked objects). Buttons: Pause, Edit plan, Open in Studio |
| 5 | CAD intake check | A review screen after upload: the 2D plan on the left with rooms outlined and labelled, a right list of detected rooms, doors, windows and levels with confidence chips, a scale confirmation field, and a Confirm and continue button. Warnings shown inline for unreadable layers |
| 6 | Approval page (client view) | A clean page that opens from a link without sign-in. Header with project name and a Review button. A contact sheet of the top-down plan, isometric view and eight room views. Each image has Approve, Reject and a click-to-pin comment, plus a small Honesty report. A sticky footer with Approve selected, Request changes and the price of 8K to 15K finals for the owner only |
| 7 | Video studio | A video editor. Top: preview player with aspect switch (16:9, 9:16, 1:1). Bottom: timeline with video, title, music and voice tracks, clip thumbnails, a ruler and a playhead. Left: shot list with storyboard cards and a Regenerate clip button. Right: inspector with transitions, speed, colour look, text, music and captions. Export button with MP4 and size options |
| 8 | Project dashboard | A project home showing cards for each view with version badges, a progress ring for the mission, recent comments, credits used against budget, and quick actions (New render, Start Agent mission, Share for review). A small honesty and disclosure summary |
| 9 | Mobile review | A phone layout for approving images: one image per screen with swipe, large Approve and Reject buttons, a tap-to-pin comment, a progress dots row, and a bottom sheet for the price and Approve all |
| 10 | Settings and enterprise | Tabs for Members and roles, SSO, Brand kit, Disclosure labels by market, Notification channels, Data and privacy (delete and export), Audit log, Billing and invoices. A plain, dense but airy admin layout |

**Review checklist for each Stitch screen:** is the image the hero; are auto choices the default; is the price visible before each spend; is every error calm and clear about credits; is it usable with keyboard only; is contrast at least 4.5 to 1; does it work in 14 languages including right-to-left.

## 33. \[v3\] Updated roadmap, metrics, risks and open questions (replaces the phase table in section 18)

Durations are planning assumptions for the lean team in section 24, counted from kickoff; they are not commitments until the team and budget are fixed.

| Phase | Months | Scope | Exit gate |
| --- | --- | --- | --- |
| 0. Foundations | 0 to 2 | Repo, CI, Supabase schema and RLS, ledger, preset engine and 16 Looks, evaluation set started, 3 design partners signed | RLS tests pass; 100 gold images labelled |
| 1. Studio MVP | 2 to 5 | Workspace, eight questions, Direction round, gate, Strict mode, Editor basics, SketchUp plugin beta, credits and billing | 70% structural pass on gold set; first paid pilot |
| 2. Agent Zuke alpha | 5 to 8 | CAD intake, top-down and isometric, per-room cameras, entourage, project memory, approval page and notifications | CAD detection 95% on clean files; camera acceptance 85% |
| 3. Finals and video | 8 to 11 | 8K to 15K tiled finals, video director, video editor, one-video export, 360 and GLB presets | 90% clips pass checks; 15K final passes gate |
| 4. Enterprise and scale | 11 to 15 | SSO, audit, residency, SOC 2 Type I, own judges (stage B), adapters (stage C), variant matrix, channel packs | First enterprise contract; SOC 2 Type I issued |

**Metrics.** Time from CAD upload to approval pack (target under 30 minutes), mission success without human rescue, approval rate on the first pack, cost per passed image, redo rounds per mission, continuity score, share of images with a clean Honesty report, weekly active projects, gross margin per credit.

**New risks**

| Risk | Mitigation |
| --- | --- |
| CAD files vary wildly in quality | Confirm checklist, clear failure messages, human review path, 40-plan test set |
| Agent spends credits unexpectedly | Budget caps, price before each stage, gate before finals |
| Video clips drift or warp | Keyframe fidelity checks, low-motion default, regenerate per clip |
| Music and people rights | Licensed library only; synthetic, non-identifiable people; licence shown on export |
| Misleading marketing imagery | Honesty report, disclosure labels, Strict defaults, counsel review per market |
| Heavy final renders overrun cost | Tiled jobs on GPU runner, price per size, queue limits per plan |
| Partner model changes break presets | Versioned presets, evaluation gate, fallback routes |

**Open questions (carried from v2, plus new)**

1. Budget and runway, so phases can be dated and costed.
2. Company entity and primary market for tax and contracts.
3. Which two or three pilot customers: property developers, architecture studios or interior firms?
4. Who labels the gold set (in-house architects or a vendor)?
5. How far to push your own model after stage B, given GPU cost?
6. Pricing stance: credits only, or per-project packages for developers?
7. Approval channels to launch with: email and in-app first, then WhatsApp, Slack, Teams?
8. Final-render tiers: is 15K worth the cost for launch, or 8K and 12K first?
9. Music: licensed library or user-supplied only at launch?
10. CAD formats: is DWG enough, or are Revit and IFC needed in phase 2?
11. Confirm that "developer" meant property developer in section 25.

**Next build steps.** Done in v4 as written specifications: the preset seed (section 34), the Supabase schema with RLS (section 35), the prototype test plan (section 36) and the evaluation protocol and labelling guide (section 37). Still to do: build the visual prototype in Stitch from section 32, load the full 70-tile seed from the section 21 tables, run the RLS test suite against a real project, and label the first 100 gold images. Tell me which to start.

**Caveat.** Targets, dates and prices are assumptions to be replaced by measurement. Market sources in section 25 are mostly vendors and studios; legal and advertising points should be confirmed with counsel in each market. The SQL in sections 34 and 35 has not been run against a live database; test it in a staging project and have the policies reviewed before real customer data.

## 34. \[v4\] Preset seed file (JSON and SQL)

The seed is the single source for the preset engine in sections 6 and 21. Tiles are versioned rows; Looks are bundles of tile choices. Fragments are written once in English; labels are translated per language. Locks are not rows a user can edit: they live in the compiler.

**Tile JSON shape** (one file per question group, for example presets/time.json)

```json
{
  "group": "time",
  "version": "1.0.0",
  "tiles": [
    {
      "slug": "time.golden-hour",
      "label": { "en": "Golden hour", "es": "Hora dorada" },
      "is_auto": false,
      "applies_to": ["exterior", "interior", "masterplan"],
      "fragment": "warm low-angle sunlight shortly before sunset, long soft shadows, gentle amber highlights",
      "negative": "harsh midday light, flat grey sky",
      "conflicts": ["time.night", "time.blue-hour"],
      "requires": [],
      "fidelity_max": "balanced",
      "order": 50,
      "eval_score": null
    }
  ]
}
```

Rules enforced by the linter (L01 to L08): fragment under 40 words; no structure-changing verbs in any fragment (add, remove, move, resize walls, windows or roofline); every non-Auto tile has at least one example image; conflicts are symmetric; Auto tiles have an empty fragment; every group has exactly one default Auto tile; Looks reference only existing slugs; semver bump on any fragment edit.

**SQL (Supabase)**

```sql
create table preset_groups (
  slug text primary key,
  label jsonb not null,
  sort int not null default 0
);

create table preset_tiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  group_slug text not null references preset_groups(slug),
  version text not null,
  label jsonb not null,
  fragment text not null default '',
  negative text not null default '',
  is_auto boolean not null default false,
  applies_to text[] not null default '{}',
  conflicts text[] not null default '{}',
  requires text[] not null default '{}',
  fidelity_max text not null default 'balanced' check (fidelity_max in ('strict','balanced','creative')),
  example_image text,
  eval_score numeric,
  status text not null default 'draft' check (status in ('draft','live','retired')),
  sort int not null default 0,
  unique (slug, version)
);

create table looks (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  version text not null,
  label jsonb not null,
  best_for text not null,
  fidelity text not null check (fidelity in ('strict','balanced','creative')),
  disclosure_label boolean not null default false,
  tile_slugs text[] not null,
  status text not null default 'draft' check (status in ('draft','live','retired')),
  unique (slug, version)
);

insert into preset_groups (slug, label, sort) values
 ('camera','{"en":"Where am I standing?"}',1),
 ('time','{"en":"When is it?"}',2),
 ('weather','{"en":"What is the sky like?"}',3),
 ('mood','{"en":"How should it feel?"}',4),
 ('materials','{"en":"What is it made of?"}',5),
 ('people','{"en":"Who is around?"}',6),
 ('site','{"en":"What surrounds it?"}',7),
 ('finish','{"en":"How finished is it?"}',8);

-- Auto tile for every group (empty fragment, selected by default)
insert into preset_tiles (slug, group_slug, version, label, is_auto, status)
select group_slug || '.auto', group_slug, '1.0.0', '{"en":"Auto"}', true, 'live'
from (values ('camera'),('time'),('weather'),('mood'),('materials'),('people'),('site'),('finish')) g(group_slug);

insert into looks (slug, version, label, best_for, fidelity, disclosure_label, tile_slugs, status) values
 ('client-sales-hero','1.0.0','{"en":"Client sales hero"}','Sales and marketing','strict',false,'{time.golden-hour,mood.luxurious,people.a-few-distant}','draft'),
 ('honest-listing','1.0.0','{"en":"Honest listing"}','Real estate and staging','strict',true,'{time.midday,weather.clear,people.none}','draft'),
 ('planning-submission','1.0.0','{"en":"Planning submission"}','Planning authority','strict',true,'{time.midday,weather.soft-overcast,people.silhouettes,finish.photoreal}','draft');
-- the other 13 Looks follow the same pattern from the table in section 21
```

**Seed delivery:** JSON files live in the repo under /presets; a CI job validates them with the linter, generates the insert SQL, runs the preset evaluation, and writes rows as draft; promotion to live is a reviewed pull request. Acceptance: all 16 Looks and about 70 tiles load, pass the linter, and compile into a sentence in under 50 ms.

## 35. \[v4\] Supabase schema with RLS policies

This is the starting schema for the core tables of sections 15 and 31. Every tenant table carries org\_id and has row-level security on from the first migration. Policies use one helper, so the rule is written once. The agent and Edge Functions run with the user's token; the service key is used only by the ledger and job runner, which write through audited functions.

```sql
create extension if not exists pgcrypto;
create extension if not exists vector;

create table orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null default 'us' check (region in ('us','eu','apac')),
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

create table members (
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor','reviewer','viewer')),
  primary key (org_id, user_id)
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table versions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  parent_id uuid references versions(id),
  kind text not null check (kind in ('input','render','edit','upscale','video','final')),
  storage_path text,
  compiled_prompt text,
  seed bigint,
  model text,
  gate_status text check (gate_status in ('verified','review','flagged')),
  gate_json jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table credit_ledger (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  version_id uuid references versions(id),
  kind text not null check (kind in ('grant','hold','capture','release','refund')),
  amount int not null,
  note text,
  created_at timestamptz not null default now()
);

create table agent_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id),
  status text not null default 'planned',
  budget_cap int not null,
  spent int not null default 0,
  plan_json jsonb,
  created_at timestamptz not null default now()
);

create table approvals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  run_id uuid not null references agent_runs(id) on delete cascade,
  target_version_id uuid not null references versions(id),
  reviewer_id uuid references auth.users(id),
  token_hash text,
  decision text check (decision in ('approved','rejected','commented')),
  comment text,
  pin_x numeric,
  pin_y numeric,
  decided_at timestamptz
);

create table scene_bible (
  project_id uuid primary key references projects(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  style jsonb not null default '{}',
  palette jsonb not null default '{}',
  light jsonb not null default '{}',
  cast_json jsonb not null default '[]',
  locked_objects jsonb not null default '[]',
  version int not null default 1
);

create table memory_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  scope text not null check (scope in ('org','project','shot','user')),
  text text not null,
  embedding vector(1536)
);

-- one helper for every policy
create function is_member(o uuid, roles text[] default null)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from members m
    where m.org_id = o and m.user_id = auth.uid()
      and (roles is null or m.role = any(roles))
  );
$$;

alter table orgs enable row level security;
alter table members enable row level security;
alter table projects enable row level security;
alter table versions enable row level security;
alter table credit_ledger enable row level security;
alter table agent_runs enable row level security;
alter table approvals enable row level security;
alter table scene_bible enable row level security;
alter table memory_items enable row level security;

create policy orgs_read on orgs for select using (is_member(id));
create policy members_read on members for select using (is_member(org_id));
create policy members_admin on members for all
  using (is_member(org_id, array['owner','admin']))
  with check (is_member(org_id, array['owner','admin']));

create policy projects_read on projects for select using (is_member(org_id));
create policy projects_write on projects for all
  using (is_member(org_id, array['owner','admin','editor']))
  with check (is_member(org_id, array['owner','admin','editor']));

create policy versions_read on versions for select using (is_member(org_id));
create policy versions_write on versions for insert
  with check (is_member(org_id, array['owner','admin','editor']));

-- ledger: members read; nobody writes directly (service role through audited functions)
create policy ledger_read on credit_ledger for select
  using (is_member(org_id, array['owner','admin']));

create policy runs_read on agent_runs for select using (is_member(org_id));
create policy runs_write on agent_runs for insert
  with check (is_member(org_id, array['owner','admin','editor']) and owner_id = auth.uid());

create policy approvals_read on approvals for select using (is_member(org_id));
create policy approvals_review on approvals for insert
  with check (is_member(org_id, array['owner','admin','editor','reviewer']));

create policy bible_rw on scene_bible for all
  using (is_member(org_id, array['owner','admin','editor']))
  with check (is_member(org_id, array['owner','admin','editor']));
create policy memory_read on memory_items for select using (is_member(org_id));
create policy memory_write on memory_items for insert
  with check (is_member(org_id, array['owner','admin','editor']));

-- preset tables: everyone signed in reads live rows; only admins write
alter table preset_tiles enable row level security;
alter table looks enable row level security;
create policy tiles_read on preset_tiles for select using (status = 'live' and auth.uid() is not null);
create policy looks_read on looks for select using (status = 'live' and auth.uid() is not null);
```

**Guest approval (no sign-in).** The approval page never gets a database policy. A signed, expiring link is checked in an Edge Function, which verifies token\_hash and writes one approvals row with the service key for exactly that run and those images, and nothing else.

**RLS test suite (blocks merges):** for every table, a user from org A cannot select, insert, update or delete org B rows; a viewer cannot write; a reviewer can add an approval but not spend; the ledger cannot be written by any user token; storage paths are prefixed with org\_id and the bucket policies match; an agent token cannot read another project. Add indexes on (org\_id) and (project\_id) for every table above. Treat this as a starting migration and have the schema and policies reviewed before real customer data.

## 36. \[v4\] Clickable prototype plan (from the Stitch pack)

The prototype itself is built in Stitch or a design tool from section 32; this section fixes what must be clickable so testing is meaningful. Build screens 1 to 10 of the pack, then link them as below. Use real sample images (one interior, one exterior, one CAD plan) so people react to real output.

| Path | Click sequence | What it proves | Pass criterion in testing |
| --- | --- | --- | --- |
| A. First render | Upload image, see "Here is what I see", pick a Look, run Direction round, promote one draft, review badge | A new user reaches a render without reading help | 8 of 10 testers finish in under 3 minutes |
| B. Fix something | Select the sofa in the Editor, pen a note, type an instruction, Generate, compare | Editor feels like a design tool | 8 of 10 find select, pen and text without hints |
| C. Agent mission | Upload CAD, confirm the intake check, start a mission, watch mission control | The agent is understandable and trusted | Testers can say what it will spend and when it will stop |
| D. Approval (client) | Open the link on a phone, approve two views, reject one with a pinned comment | Clients can decide without an account | 9 of 10 complete without help |
| E. Redo loop | Rejected view returns, edit the plan, see changed views highlighted | The loop is clear and bounded | Testers know how many free rounds remain |
| F. Video | Open the storyboard, approve, open the timeline, trim a clip, add music, export | A non-editor can make one video | 7 of 10 export in under 10 minutes |

**Test protocol.** Five architects or visualizers per round (five finds most problems), two rounds, then property developers and sales leads for paths D and E. Think-aloud, task success, time on task, and a plain question at the end: "What did it just do with your drawing?" Record confusion points against the rules in section 21 (auto first, price first, plain words). Fix, then retest only the failed paths.

**Fidelity of the prototype:** screens must show the price before every spend, the Keep clause lock, the badge states, and the Honesty report. A prototype without them tests the wrong product.

## 37. \[v4\] Evaluation protocol and labelling guide

**Purpose.** One shared way to decide whether a preset, a model route or a release is good enough. It feeds the fidelity gate, the release block (a drop of more than 2 points stops release), the agent gates in section 31, and the own-model decisions in section 22.

**Gold set.** 500 images at launch, then 40 CAD plans, continuity pairs and video clips (section 31). Balanced by input rung (SketchUp or GLB, screenshot, plan, sketch, photo, text), building type (residential, hospitality, retail, workplace, exterior, masterplan), and difficulty (clean, typical, hard). Each item stores the input, the ground-truth structure facts, and the allowed variations. Rights are cleared and recorded; items are never used for training.

**What is labelled for each input**

| Label | How | Used by |
| --- | --- | --- |
| Structure facts | Counts and positions of walls, windows, doors, stairs, columns, roofline type, floors | Checks C1 to C4, C10 |
| Locked objects | Objects that must not change (named list) | Protect list, C5 |
| Allowed changes | What presets may change (materials, light, sky, people) | C6 to C9 |
| Scale anchors | Door height, ceiling height, known dimensions | Entourage and scale checks |
| Room use and best camera | For CAD plans: room use, and the preferred and acceptable camera positions | Camera planner score |

**Rating each output (blind, two raters, a third for disagreements)**

| Question | Scale | Hard fail when |
| --- | --- | --- |
| Structure kept: are walls, openings and roofline as in the input? | Pass, minor, major | Any major change to a locked item |
| Added or removed objects | None, minor, major | Invented opening or removed window |
| Preset followed: does it match the chosen tiles? | 1 to 5 | Below 3 on a main choice |
| Realism and quality | 1 to 5 | Below 3 |
| Honesty: would a buyer be misled about size, view, orientation or finish? | Clear, borderline, misleading | Misleading |
| Continuity with the project references | 1 to 5 | Below 3 |
| Camera (for room views): eye height, framing, no clipping | 1 to 5 | Camera inside a wall or furniture |
| Video: drift, flicker, warped lines | None, minor, major | Major |

**Labelling guide (short form for raters)**

1. Compare the output to the input first, not to taste. A beautiful image that moved a window is a fail.
2. Count openings, then check their positions against the labelled facts. Count again if unsure.
3. A change is "minor" if a layperson would not notice and no locked item moved; "major" otherwise.
4. Materials, light, sky and people are allowed to change only as the chosen tiles say.
5. For honesty, imagine the image in a brochure: could the buyer feel tricked once they visit the site?
6. When unsure, mark "borderline" and write one line why; do not guess.
7. Never rate an item you drew or tuned. Never share ratings between raters before submitting.

**Quality of the labels.** Two raters per item; agreement measured by Cohen's kappa, target at least 0.7 on structure and honesty; below 0.6 triggers a guide revision and relabelling. Ten percent of items are repeated blind to measure each rater's consistency. Raters are paid, trained on 20 calibration items, and re-calibrated every quarter.

**Automated checks versus humans.** The gate's detectors and judge are tested against human labels: precision and recall for each of C1 to C10, reported by rung. A hard fail needs two agreeing signals (geometry check and vision judge), so a single noisy detector cannot block a render. Human ratings override automatic scores; disagreements become new gold items.

**Run cadence and gates**

| When | What runs | Block rule |
| --- | --- | --- |
| Every pull request that touches prompts, presets, router or gate | Fast subset (100 items) | Pass rate drops more than 2 points |
| Nightly | Full 500 plus agent sets | Alert on any drop of more than 1 point |
| Release | Full set by rung and building type, plus a human spot check of 50 outputs | Any rung below its target in section 22, or any hard-fail increase |
| New model or partner route | Full set, cost per passed image | Only promote if equal or better quality at equal or lower cost |

**Reporting.** A dashboard shows pass rate by rung, preset, model and building type; the ten worst items; label agreement; cost per passed image; and trend over time. The pass-rate targets in section 22 are revised after alpha, once real numbers exist.

**Privacy and ethics.** User data enters the gold set only with opt-in consent and with identifying details removed; people in images are synthetic or consented; raters see no customer names. Evaluation items are never used in training.

## 38. \[v5\] Gap audit against the reference PRDs

**Method.** I re-read the three product PRDs (LookX-class, ArchiVinci-class, Rendair-class) and the mnml.ai study, took every micro-level requirement, module and gap row, and checked each against this master by searching for it. The master already covers the large items: the engine and router, presets and compiler, the fidelity gate, canvas editor, upscale, video, 360 and 3D, credits ledger, teams and SSO, C2PA, batch, boards, SketchUp and Rhino plugins, and compliance. Sections 39 to 42 add what was missing or only mentioned in passing, as testable requirements with priorities (P0 launch, P1 within 3 months of launch, P2 later). Where I added something beyond the reference PRDs it is marked **New**.

| Area | What was missing in the master | Section |
| --- | --- | --- |
| Accounts, uploads, prompts | Paste from clipboard, HEIC handling, pre-flight sharpness check, input classifier, prompt limits and linter detail, design dictionary, random prompt, saved presets, compiled-prompt drawer, sample inputs and first-render guidance | 39 |
| Generation controls | Seed, Vary and Repeat, object-tag cap, image count by plan, aspect ratios, text lock with OCR check, change map | 39 |
| Editor and finishing | Smart select (magic select), texture library, place-object-from-reference, annotate, Fix People, remove object fill rules, outpaint, relight (time, weather, season), upscale on uploads | 40 |
| Models and community | Style training with data checks, trigger words, memorisation check, Explore gallery and remix, report and takedown, publish checks | 40 |
| Credits, growth, ops | Insufficient-credit sheet, anti-farming, first-render reward, referral, usage report by member, retention choices and Download all, admin console with kill-switches, abuse monitoring, status page, feature flags, NPS, consent and no session recording on drawings, disputes and refunds | 41 |
| Trust and safety | Content policy matrix, DMCA and takedown process, minors and NSFW rules, provenance verify page | 41 |
| Arch-viz pro tools (New) | Sun study, day-night, seasons, facade and landscape tools, elevation and section modes, area and material schedules, BIM and IFC ingest, VR and virtual tour, construction-stage images, option comparison boards | 42 |
| Developer sales suite (New) | Interactive plan with unit availability, price and finish configurator, lead capture and CRM sync, sales-gallery and kiosk mode, listing copy and brochure builder, social pack | 42 |

## 39. \[v5\] Added features: accounts, uploads, prompts and generation controls

| ID | Requirement | Acceptance criterion | Pri |
| --- | --- | --- | --- |
| UP-01 | Accept JPG, PNG, WebP, HEIC, HEIF and GIF (first frame, with a notice) up to 20 MB; PDF and DWG go through the CAD path | Other types rejected with a message listing allowed types | P0 |
| UP-02 | Strip EXIF and GPS on upload | A GPS-tagged test file has no location data in storage | P0 |
| UP-03 | Pre-flight check: short side under 768 px, blur, heavy compression, extreme crop | Warning with a one-click Upscale; the user can still proceed | P0 |
| UP-04 | Paste from clipboard (Ctrl+V) and drag from desktop or another tab | Attached within 1 second on every Create screen | P0 |
| UP-05 | Input classifier suggests the module (sketch, plan, 3D screenshot, photo, elevation, section) and shows what will be kept | 90% agreement with human labels on 200 test images; user can correct in one click | P0 |
| UP-06 | Sample inputs (one sketch, plan, model, photo) so a new user sees a result before uploading | First result shown in under 10 seconds without upload | P0 |
| PR-01 | Prompt limits: soft 200 characters, hard 500; the compiler never drops the preservation layers | 201 shows a warning; 501 is blocked; compiled prompt still holds the Keep clause | P0 |
| PR-02 | Prompt enhancer with three levels (Faithful, Balanced, Creative) | Faithful adds no new object nouns in 95% of a 200-prompt test | P0 |
| PR-03 | Image analysis to prompt (text, materials, ratio, time of day) | Returns in 6 seconds or less | P1 |
| PR-04 | Design dictionary of 500 terms with a one-line meaning and a preview image | Insert a term into the sentence from the dictionary | P1 |
| PR-05 | Random prompt from curated seeds per module | At least 200 seeds per category, none taken from user content | P2 |
| PR-06 | Saved presets (My presets) per user and team, tested on three images before sharing | Restores prompt, Look, tiles, tags, model and fidelity; visibility enforced by the API | P1 |
| PR-07 | Compiled-prompt drawer on every result, with Re-run | Drawer text equals the stored compiled prompt | P0 |
| GN-01 | Seed stored; Vary re-runs with a new seed, Repeat with the same | Same seed, model and preset versions give a near-identical result on self-hosted models | P0 |
| GN-02 | Up to 3 object tags with placement hints (for example "a tree, left foreground"); a fourth is disabled with a tooltip | Tags add objects only inside the allowed areas | P1 |
| GN-03 | Count 1 to 4 by plan, aspect ratios 1:1, 4:3, 3:4, 16:9, 9:16, 21:9, 3:2 | Size matches ratio within 1 px; price updates live | P0 |
| GN-04 | Separate controls: creativity, structure lock, style strength and reference strength (Expert mode) | Each slider changes only its own effect on the test set | P1 |
| GN-05 | Text lock: Keep, Replace with this text, or Blank; OCR check on signage and labels; exact text burned in rather than drawn by the model | Character similarity of at least 0.90 when Keep or Replace is chosen | P1 |
| GN-06 | Change map overlay between input and result, plus a list of changed elements | Toggles in under 300 ms | P1 |
| GN-07 | Live preview: 512 px frames after 300 ms idle, then Keep this frame starts a full render with the same locks | p95 under 2 seconds per frame; cost shown first | P1 |
| GN-08 | Output formats JPG, PNG, WebP and 16-bit TIFF; high tier above 2.5 MP priced clearly | Format and size shown before the run | P0 |
| GN-09 | Cancel is free until the final stage starts; credits released | Zero net charge in 100% of cancel tests | P0 |
| GN-10 | Prompt Assistant reads the Design Contract, asks for space type, materials and time of day before the first run, and flags conflicts | Fewer than 1 question per run unless confidence is low | P1 |

## 40. \[v5\] Added features: editor, finishing, model training and community

| ID | Requirement | Acceptance criterion | Pri |
| --- | --- | --- | --- |
| ED-01 | Mask tools: brush, rectangle, polygon lasso, magic select; 4 px feather; 50 undo steps | Mask saved as polygons and PNG; undo restores the previous mask | P0 |
| ED-02 | Smart select: click a wall, floor, window or object to select it | Region IoU of at least 0.85 against hand masks | P1 |
| ED-03 | Pixels outside the mask stay unchanged | Maximum difference of 2 levels outside the mask on 100 test edits | P0 |
| ED-04 | Remove object; fill follows floor and wall planes and lines | Judges accept 85% of 100 test fills | P0 |
| ED-05 | Outpaint and Reframe with perspective-aware extension and aspect presets | No visible seam in 90% of test cases | P1 |
| ED-06 | Texture and material library (15 categories, 100+ materials) and custom sample upload; applied only inside the mask, scaled to perspective | Only masked pixels change; texture scale follows surface | P0 |
| ED-07 | Place object from a reference image into a mask, scaled to the room's perspective | Object sits on the correct plane and size within 10% | P1 |
| ED-08 | Annotate: text and shapes on the image; an annotation set can be turned into an edit brief | Each annotation becomes one instruction in the brief | P1 |
| ED-09 | Fix People: repair or replace figures; scale checked against door height | People height within 5% of expected scale | P1 |
| ED-10 | Relight: change time of day, weather or season in one click with geometry locked | Structure agreement unchanged; hard fail if structure moves | P0 |
| ED-11 | Region lock: lock approved areas so later edits cannot change them | Locked pixels identical after any later edit | P0 |
| ED-12 | Conversational edit with a before and after card per message; the assistant remembers the last 10 images and locks | "Make the second one darker" resolves correctly in 90% of a scripted test | P1 |
| ED-13 | Per-region prompts and layered history in the Editor | Each region keeps its own instruction and version | P1 |
| FN-01 | Upscale 2x and 4x with a detail slider, preserve-text mode and a 100% crop preview before charge | Edge overlap with source of 0.95 or more; no new objects found by the vision check | P0 |
| FN-02 | Upscale an uploaded file (not only results) for 1 credit | Works without a prior edit | P1 |
| FN-03 | Render to Moodboard: 1 to 12 renders to palette, materials and a labelled board; export as image or PDF | Palette hex values and material names exported | P1 |
| FN-04 | Render Variation with a subtle, moderate or bold slider and four outputs | Variation strength matches the setting on the test set | P1 |
| FN-05 | Image to 3D with export formats and polygon budget shown before the run | Price and format shown first | P2 |
| TR-01 | Style training: upload 5 to 50 images; quality check flags blur, duplicates and mixed styles | Flags shown before any training spend | P1 |
| TR-02 | Auto mode (name, direction Style or Object, base model) and Advanced mode | Auto needs only three inputs | P1 |
| TR-03 | Unique trigger word, rejected if it collides with a common word or another model | Collision test passes | P1 |
| TR-04 | Validation gallery of six test prompts; any output with similarity above 0.95 to a training image is flagged as memorised | Flagged items shown with the training image | P1 |
| TR-05 | Training data deleted 30 days after training unless the user opts in; licence and base model recorded; public publishing blocked without a licence | Deletion job log; publish blocked in test | P1 |
| CM-01 | Explore gallery: Top today, Most liked, All; likes; filters by Look, building type and tool | Shows only items that passed the policy check | P2 |
| CM-02 | Remix this: copies prompt, Look and tiles, not the source input unless the author allows | Source input never copied by default | P2 |
| CM-03 | Publish requires a policy pass and an AI-label; the author chooses visibility | Blocked images cannot be posted | P2 |
| CM-04 | Boards: arrange renders, comment, share; limit by plan | Board link roles View, Comment, Edit; revoke takes effect within 10 seconds | P1 |
| CM-05 | Sessions: a conversation-style history with pinned sessions; deleting a session keeps assets | Assets remain after deletion | P2 |

## 41. \[v5\] Added features: credits, growth, operations, trust and safety

| ID | Requirement | Acceptance criterion | Pri |
| --- | --- | --- | --- |
| CR-01 | Price on the Generate button equals the ledger hold | Label equals hold amount in 100% of tests | P0 |
| CR-02 | Insufficient credits opens a sheet (plan, credit pack, cheaper model), never an error | Sheet offers three options and keeps the user's work | P0 |
| CR-03 | Anti-farming: one free grant per verified email and device; rate-limited sign-ups | Duplicate-device test blocks a second grant | P0 |
| CR-04 | First-render reward and a next-step nudge with three suggested actions | Reward credited once, after the first Verified result | P1 |
| CR-05 | Referral credits for both sides, with abuse limits | Reward only after the invitee's first paid or verified action | P2 |
| CR-06 | Fair-use limits stated in numbers on the plan card (for example images per rolling 24 hours) | Limit shown before the user reaches it | P0 |
| CR-07 | Usage report by member, project and module, exportable as CSV; spend caps per member | Team admin sees spend within 1 minute | P0 |
| CR-08 | Retention choice per plan (7, 30, 90 days, or custom for enterprise) and Download all as a zip before expiry | Expiry warning 3 days before; zip holds every non-expired result | P0 |
| CR-09 | Refunds: automatic for Flagged or engine failure; credit-back requests auto-approved when the fidelity score is below 0.60 | Ledger shows hold then release | P0 |
| CR-10 | Billing: invoices with tax, disputes and chargeback handling, failed-payment retries, plan change proration | Merchant-of-record flow tested per market | P0 |
| OP-01 | Admin console to edit routes, presets, thresholds and kill-switches, with audit trail and one-click rollback | Rollback takes effect in under 1 minute | P0 |
| OP-02 | Provider failover: after two errors in 60 seconds, new jobs route to the fallback within 5 seconds | Outage drill completes jobs without user action | P0 |
| OP-03 | Abuse monitoring: rate flags, review queue, repeat-offender suspension | Flagged accounts reach the queue in under 5 minutes | P0 |
| OP-04 | Public status page and incident process (severity levels, user notice, post-mortem within 5 working days) | Status page updated within 15 minutes of a major incident | P1 |
| OP-05 | Feature flags and staged rollouts by org, region and plan | A flag can be turned off without a deploy | P1 |
| OP-06 | Feedback: thumbs on every result, NPS after the third render, bug report with the job id attached | Feedback links to the generation card | P1 |
| OP-07 | Webhooks for job done, flagged, approved and exported; idempotent POST /renders; API keys with scopes and rate limits | Same idempotency key creates one job and one hold; webhooks retried 5 times with backoff | P1 |
| OP-08 | Support: help centre, in-app chat, enterprise SLA and named contact | First response targets by plan published | P1 |
| TS-01 | Content policy matrix: allowed, restricted and blocked categories for prompts, inputs and outputs, with minors and sexual content blocked absolutely | Blocked content never reaches the asset store | P0 |
| TS-02 | Report, takedown and DMCA process; reported item hidden within 1 hour pending review; counter-notice flow | Hidden within 1 hour in test | P0 |
| TS-03 | Provenance: C2PA on every download, invisible watermark that survives JPEG 80 and a 50% resize in 95% of tests, and a public verify page | Verify page confirms an image came from Zukeviz without exposing the prompt | P1 |
| TS-04 | Consent banner; no session recording or ad pixels on screens that show uploaded drawings | Scan finds no recorder scripts on canvas screens | P0 |
| TS-05 | Accessibility: WCAG 2.1 AA, keyboard-only use of every control, alt text for outputs, reduced motion, colour-blind-safe badges | Automated scan plus manual keyboard pass with zero AA failures | P0 |
| TS-06 | Light and dark mode, responsive web, and a mobile review app or PWA for approvals and comments | Approval flow completes on a 375 px screen | P1 |
| TS-07 | Data controls: export my data in 24 hours, delete in 30 days, regional residency, no-training default on paid plans | Delete job confirmed by email | P0 |

## 42. \[v5\] Added features: arch-viz pro tools and the developer sales suite (New)

These go beyond the reference PRDs. They follow from the arch-viz workflow and from the developer pains in section 25.

**Arch-viz pro tools**

| ID | Requirement | Acceptance criterion | Pri |
| --- | --- | --- | --- |
| AV-01 | Sun study: pick date, time and site location; render morning, noon and evening shadows from one view; optional shadow-path overlay | Sun angle within 2 degrees of the computed value for the site | P1 |
| AV-02 | Day-to-night and season sets: one view as day, golden hour, blue hour, night; or spring, summer, autumn, winter, geometry locked | Four outputs from one run with a shared seed and the same structure | P0 |
| AV-03 | Elevation and section modes: keep the orthographic projection, reject perspective drift, optional entourage and shadow | Orthographic check passes on 20 test drawings | P1 |
| AV-04 | Facade and landscape tools: swap cladding by zone, planting palettes by climate, paving and water features, all inside masks | Only masked zones change | P1 |
| AV-05 | Floor Plan to 3D model (default wall height 2.7 m, editable) with GLB export | Room and opening counts equal the plan | P1 |
| AV-06 | BIM and IFC ingest (IFC, Revit via plugin, Archicad later): classes, levels and materials become the Design Contract | IFC window count equals contract count | P2 |
| AV-07 | Schedules: area, material and opening schedules from the Design Contract, exported as CSV and PDF | Totals match the plan within 2% | P2 |
| AV-08 | Option comparison board: 2 to 6 options side by side with a differences list and a vote or comment | Differences list lists only changed elements | P1 |
| AV-09 | Construction-stage images: foundation, frame, envelope, interior, complete, from one view | Same camera across stages; stage label burned in on request | P2 |
| AV-10 | Virtual tour: linked 360 panoramas from room cameras with hotspots, shareable link and QR code; VR viewer (WebXR) and Cardboard mode | Tour loads in under 5 seconds on mobile | P2 |
| AV-11 | Material and product catalogue links (named materials, real SKUs where a vendor feed exists) with a swap list per room | Swap changes the material tile and the spec line | P2 |
| AV-12 | Drawing annotations: north arrow, scale bar, room labels and dimension overlays on top-down plans | Overlays are vector, editable and exportable | P1 |
| AV-13 | Camera-path walkthrough from room cameras, with speed and pause settings (links to section 30) | Same camera as the approved stills | P1 |

**Developer sales suite**

| ID | Requirement | Acceptance criterion | Pri |
| --- | --- | --- | --- |
| DS-01 | Interactive plan: click a unit on the styled plan to see its room views, area and finish pack | Unit data comes from a CSV or the CRM | P1 |
| DS-02 | Unit availability and price overlay (available, reserved, sold) updated from a sheet or CRM, with the Honest Listing label on price-bearing images | Status change appears within 5 minutes | P1 |
| DS-03 | Finish configurator: buyer picks a package; the unit's views re-render from the Variant matrix, cached for instant switching | Cached variants switch in under 1 second | P1 |
| DS-04 | Lead capture on shared pages (name, email, interest), consent text, and CRM sync (HubSpot, Salesforce, Zoho, webhook) | Lead reaches the CRM within 60 seconds | P1 |
| DS-05 | Sales-gallery and kiosk mode: full-screen loop, touch navigation, offline cache | Runs for 8 hours offline on a tablet | P2 |
| DS-06 | Brochure and one-pager builder from approved images, plan and spec text; export PDF at print size | Output uses the brand kit; disclosure label included | P1 |
| DS-07 | Listing copy and caption writer by channel and language, from the Scene Bible and plan facts only | No claim that is not in the plan or brief | P1 |
| DS-08 | Social pack: 1:1, 4:5, 9:16, 16:9 images and 15 to 30 second cuts, with safe areas and captions | One click produces the full pack from approved views | P1 |
| DS-09 | Portal and website embed: a view-only gallery and tour that can be embedded with a script tag | Loads in under 3 seconds; reviewer cannot download originals unless allowed | P2 |
| DS-10 | Analytics for sales: views per image, time on image, unit clicks, finish choices, leads by source | Dashboard shows the last 30 days per project | P2 |

**Where these land in the roadmap.** All P0 rows in sections 39 to 42 belong to phases 0 and 1 of section 33. P1 rows move through phases 1 to 3; the developer sales suite and virtual tour start in phase 3 and phase 4, after the first paid developer pilot confirms demand. P2 rows wait for evidence from pilots.

## 43. \[v6\] Collaboration, WebRTC and the review system (updates sections 8 and 29)

**Idea.** A render is rarely finished by one person. Teams and clients need to look at the same image at the same time, talk, point, change it, and see who did what. Collaboration has three layers: **presence** (who is here), **live review** (talk, point and decide together), and **tracked review** (comments and changes with a status, an owner and a time).

**Collaboration modes**

| Mode | What happens | Who |
| --- | --- | --- |
| Presence | Avatars on the project and on each image, live cursors, selection outlines, "is typing" and "is generating" markers | Every member and guest |
| Co-editing | Several people on one Editor canvas or board; each person's edits are separate layers; changes merge without overwriting | Editors |
| Live review (WebRTC) | A room with voice, video and screen share beside the canvas; host leads, others follow the host's view; pointer, laser and draw-on-image | Anyone invited |
| Async review | Comments, voice notes and change requests left any time; owners get a digest | Reviewers and guests |
| Present mode | Full-screen story of approved images with the host's voice; guests cannot change anything | Host |

**WebRTC design.** Media never runs through Vercel or Supabase. Signalling (who joined, offers, answers, mute state) goes through Supabase Realtime channels; audio, video and screen share go through a **selective forwarding unit (SFU)**, either an open-source one such as LiveKit that we host on a small GPU-free server pool, or a managed WebRTC service, with TURN servers for networks behind strict firewalls. Peer-to-peer is used only for up to 3 people; beyond that the SFU carries the room. Data channels carry pointer position, view follow, laser strokes and reactions at low delay. Canvas state uses a conflict-free shared document (for example Yjs) stored in Postgres snapshots. Recording is off by default, needs the host's consent and a visible banner, and is stored in the project's region. Choice of SFU and managed service is a cost and compliance decision to make in phase 2.

**Live review room: what people can do**

- Follow the host (view, zoom, layer, compare slider position) or break away and return with one click.
- Point with a laser, draw a temporary arrow, drop a pinned comment, or record a 30-second voice note on a spot.
- Compare two versions or two Looks side by side, with the slider shared.
- **Generate and edit in the room:** an editor can type an instruction or use the Editor; the result appears for everyone as a child version marked "proposed". The host or owner presses **Apply** or **Discard**. Credits are charged to the organisation's pool within the member's cap; guests can suggest but never spend.
- End the room with a **summary** that Zuke writes from the comments and decisions: items agreed, items open, who owns each.

**Review items: statuses, owners and time.** Every comment, change request or question is an item with a status and a full history.

| Field | Values and meaning |
| --- | --- |
| Type | Comment, Change request, Question, Approval, Issue from gate |
| Status | **Open**, **In progress**, **Needs check** (fix made, awaiting reviewer), **Resolved**, **Closed**, **Reopened** |
| Pin | Image, version, x and y, optional region mask |
| Assignee and watchers | One owner, many watchers |
| Priority and due date | Low, normal, high, blocker; optional date |
| Linked fix | The render or edit version that answers the item |
| Created by, at | Person and exact time |
| Updated by, at | Last person to change anything, and when |
| Resolved by, at | Who marked it resolved and when |
| Closed by, at | Who closed it (reviewer or owner only) and when |
| History | Append-only list of status changes, edits, replies and assignments with who and when |

**Status rules.** Anyone may open an item. The assignee moves it to In progress and to Needs check. Only the reviewer who raised it, or an owner, may set Resolved or Closed. Closing needs a note or a linked version. A rejected fix returns the item to Reopened with the reviewer's reason. An image cannot become **Approved** while it has open blocker items.

**Render status (separate from item status):** Draft, In review, Changes requested, Approved, Final, Archived. The status chip shows on every image, board card and approval page, with who set it and when.

**Views.** A review board with columns by status; a list with filters (status, assignee, person, image, date); a per-image thread; "my items"; and an activity feed. Every card shows "updated by Priya, 14:32". Digests by email or chat once a day, or instantly for blockers.

**SQL sketch (extends section 35)**

```sql
create table review_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  version_id uuid not null references versions(id),
  kind text not null check (kind in ('comment','change','question','approval','gate_issue')),
  status text not null default 'open' check (status in ('open','in_progress','needs_check','resolved','closed','reopened')),
  priority text not null default 'normal' check (priority in ('low','normal','high','blocker')),
  pin_x numeric, pin_y numeric, region_ref text,
  body text not null,
  assignee_id uuid references auth.users(id),
  fix_version_id uuid references versions(id),
  due_at timestamptz,
  created_by uuid references auth.users(id), created_at timestamptz not null default now(),
  updated_by uuid references auth.users(id), updated_at timestamptz not null default now(),
  resolved_by uuid references auth.users(id), resolved_at timestamptz,
  closed_by uuid references auth.users(id), closed_at timestamptz
);

create table review_events (
  id bigint generated always as identity primary key,
  item_id uuid not null references review_items(id) on delete cascade,
  org_id uuid not null,
  actor_id uuid references auth.users(id),
  action text not null,
  from_status text, to_status text,
  note text,
  at timestamptz not null default now()
);

alter table review_items enable row level security;
alter table review_events enable row level security;
create policy items_read on review_items for select using (is_member(org_id));
create policy items_write on review_items for insert
  with check (is_member(org_id, array['owner','admin','editor','reviewer']));
create policy items_update on review_items for update
  using (is_member(org_id, array['owner','admin','editor','reviewer']));
create policy events_read on review_events for select using (is_member(org_id));
-- review_events are written only by a trigger on review_items, so history cannot be edited
```

**Acceptance:** presence appears within 1 second; WebRTC room joins in under 4 seconds on a normal connection and holds 12 people on one SFU room with audio and 4 video tiles; shared pointer delay under 150 ms; a proposed version appears for all in under the render time plus 2 seconds; every status change shows who and when; closing without a note is blocked; a guest cannot spend credits; recordings need consent.

## 44. \[v6\] Virtual Tour Studio (extends section 10 and AV-10)

**Idea.** Once a 360 image exists, or a 3D model exists, the user turns it into a **shareable, branded tour** that a buyer opens from one URL: walk from room to room, jump to a plan, check which units are free, see the neighbourhood on a map, and leave a lead. The Studio is a builder with two editors: a visual one and a **sentence editor** where the tour is written as a sentence of pills.

**Inputs**

| Input | Use |
| --- | --- |
| Generated 360 panoramas (section 10, Agent Zuke room cameras) | Scenes, ready to load in one click |
| Uploaded 360 images (equirectangular JPG or PNG, or a cube map) | Scenes |
| 3D model (GLB, or the model Zuke builds from a CAD plan) | Walk-through mode: capture points are placed in the model and a 360 is rendered at each |
| CAD plan, floor plan or unit plan images | Plan layer with camera pins |
| Inventory file (CSV, sheet or CRM feed) | Unit data and status |
| Map and site location | Map layer |
| Images and videos | Content inside hotspots |

**Studio layout.** Left: scene list and the tour graph (a mini diagram of scenes and links). Centre: the 360 editor, where the user looks around and clicks to place things. Right: inspector for the selected scene or hotspot (content, style, animation, rules). Top: Preview, Mobile preview, Publish. Bottom: the **sentence editor**.

**Sentence editor and pill builder.** The tour is one readable sentence made of pills, for example: *Start with the \[Intro: Aurora Residences\], then \[Lobby\], then \[Living room\] with \[Balcony view video\], then \[Unit plan 3B\] and \[Map: Nearby\], end with \[Book a visit\].* Each pill is a scene, a hotspot, a plan, a map step, a clip or a call to action. Drag to reorder, click to edit, press + to add from a list or type a request ("add the kitchen and show the finish options") and Zuke builds the pills. The graph and the sentence stay in sync. Branches are written as "then either ... or ...". A guided tour is the sentence played in order with narration; free exploration uses the same scenes with the links.

**Hotspots (all can hold images and video inside)**

| Type | What it does |
| --- | --- |
| Navigation | Moves to another scene with a chosen transition (fade, fly-through with depth parallax, zoom) |
| Info card | Title, text, price, icon; opens as a glass panel |
| Media | Image, gallery or video (uploaded or generated) opens inside the hotspot; autoplay options |
| 3D object | A GLB object (furniture, model of the building) viewable in the hotspot |
| Plan jump | Opens the floor plan or unit plan with the camera pin highlighted |
| Unit | Opens the unit card: area, rooms, orientation, finish pack, price, status, and a button to its own tour |
| Map and landmark | Opens the map at that place; landmarks show distance and travel time |
| Document | Brochure, price list, floor plan PDF |
| Product or finish | A material or product with a swap list (links to AV-11) |
| Audio | Voice-over or ambient sound at that point |
| Lead | Short form with consent text; sends to CRM (DS-04) |

Styles: ring, dot, pill label, glass chip, icon, or a custom image; show on hover, always, or by distance; auto-face the viewer; entrance animation; a label that can be translated into the 14 languages.

**Navigation system**

- **Mini map** with a live view cone that turns as the viewer turns; click a dot to jump; collapses to an icon.
- **Floor plan panel** with level switcher, camera pins, and room labels; **unit plan** panel for the unit being viewed.
- **Compass and north arrow**, **scene list** drawer, **next and back**, **autoplay** (guided mode with narration and captions), **gyroscope** on phones, keyboard and controller support, **VR mode** (WebXR).
- **Inventory model:** a tower or site view (stacking plan or elevation) with units coloured by status (available, reserved, sold) and filters by type, floor, area, price and orientation; selecting a unit opens its card and tour; for a masterplan, plots on a site plan. Data refreshes from the sheet or CRM (DS-02).

**Map, location and route animation.** A map layer places the project and its surroundings. **Landmark hotspots** for schools, transit, hospitals, shops, parks and the user's own points of interest, each with distance and travel time by walking, driving or transit. **Route animation:** a line draws itself along the real route from the project to a landmark, the camera flies along it, and a time chip appears at the end; the user can pick colour, speed, easing and a label. Map tiles and routing come from a provider chosen on licence and cost (for example Google Maps Platform, Mapbox, or an open-source stack such as MapLibre with OpenStreetMap data and a routing engine); the map layer is built so the provider can be swapped. Attribution is shown as the provider requires.

**Walk-through from a 3D model (Matterport-style experience).** If the user has a 3D model or a Zuke-built model, the Studio offers: (1) **dollhouse view** and floor-by-floor cutaway; (2) **auto capture points** placed on a walkable grid, one per room by default, which the user can move, add or delete; (3) a 360 rendered at each point from the model's true passes, through the fidelity gate and the Scene Bible for style and light; (4) each 360 placed as a **node** in the tour at its model position, with links to nearby nodes so the viewer can walk; (5) **tags** that sit on model objects and open image or video cards; (6) a **measure tool** for distances from the model, labelled as indicative; (7) a smooth **orbit between dollhouse and walk view**. Positions come from the model, so the minimap, plan and walk path line up exactly.

**Intro, loading screen and UI/UX builder**

- **Loading screen:** ultra-luxury by default: dark ink background, a slow gold line that draws the project mark, the project name in fine serif type, a soft progress arc, and a short sound cue (off by default and muted until the viewer taps). Content is preloaded behind it. Shown for the real load time only, never padded.
- **Intro:** a 4 to 8 second cinematic: aerial or hero image slow push-in, name and tagline fade-in, then a gentle drop into the first scene; skippable; can be replaced by a video.
- **UI/UX builder:** themes (Ultra luxury, Minimal, Developer sales, Hospitality), colours and fonts from the brand kit, glass or solid panels, dock position (floating bottom dock, side rail, or top bar), which tools show (minimap, plan, units, map, share, lead, language), button shapes, cursor, scene transitions, and a mobile layout of its own (bottom sheet, thumb-reach dock). Live preview on desktop, tablet and phone. Every choice has a safe default so a non-designer gets a good result in minutes.

**Publish and share as a URL**

| Option | Detail |
| --- | --- |
| Link | zukeviz.app/t/slug or a custom domain, short link and QR code |
| Access | Public, password, expiring link, or invited emails only |
| Embed | One script tag or iframe for portals and websites, with a view-only mode |
| Versions | Publish creates a version; roll back in one click; preview link for reviewers before going live |
| Languages | Pick languages; labels and narration are translated and checked |
| Disclosure | Artist's-impression label and AI label by market (PD-08), with the Honesty report attached |
| Analytics | Views, time per scene, hotspot clicks, unit clicks, map use, drop-off, leads by source |
| Offline | A packaged tour for kiosk and sales-gallery use (DS-05) |
| Review | The tour can be reviewed in collaborate mode (section 43): comments pinned to a scene and angle |

**Performance.** Panoramas are stored as multi-resolution tiles (cube faces) and loaded progressively; the next scenes are prefetched; video starts on demand. Targets: first scene interactive in under 2.5 seconds on a good 4G phone; 60 frames per second on a mid-range phone; a tour of 30 scenes under 60 MB for the first screen of content; works without WebGL 2 through a lighter fallback.

**Data model**

| Table | Key fields |
| --- | --- |
| tours | id, project\_id, slug, theme\_json, intro\_json, loading\_json, access, published\_version |
| tour\_scenes | id, tour\_id, kind (pano, model\_node), image\_ref, tiles\_ref, position\_xyz, yaw\_pitch, level, label |
| tour\_links | from\_scene, to\_scene, transition, yaw, pitch |
| tour\_hotspots | id, scene\_id, type, yaw, pitch, style\_json, content\_json (image, video, text, ref ids), rules\_json |
| tour\_plans | id, tour\_id, level, image\_ref, scale, pins\_json |
| tour\_units | id, tour\_id, unit\_code, floor, type, area, price, status, orientation, plan\_ref, tour\_scene\_id |
| tour\_maps | tour\_id, center, zoom, landmarks\_json, routes\_json, style\_json |
| tour\_sentence | tour\_id, pills\_json, order, branches\_json |
| tour\_publishes | id, tour\_id, version, snapshot\_ref, published\_by, at |
| tour\_events | tour\_id, session\_id, event, scene\_id, hotspot\_id, unit\_id, at |

All tables carry org\_id and the RLS rule from section 35. Public viewers read only through a published snapshot, never the working tables.

**Requirements**

| ID | Requirement | Acceptance criterion | Pri |
| --- | --- | --- | --- |
| VT-01 | Load a generated or uploaded 360 into a new tour in one click | Scene appears in under 5 seconds; seams and pole checks pass | P0 |
| VT-02 | Navigation, info, media, plan, unit, map and lead hotspots; image and video inside any hotspot | A hotspot can hold a video that autoplays on open | P0 |
| VT-03 | Mini map with view cone, floor plan with pins, unit plan panel | Pins and cone match the camera within 2 degrees | P0 |
| VT-04 | Inventory model with status colours, filters and unit cards from CSV or CRM | Status change shows within 5 minutes | P1 |
| VT-05 | Map with landmark hotspots and animated route lines | Route draws in under 2 seconds and shows travel time | P1 |
| VT-06 | Sentence editor with pills, synced to the tour graph | Edit in either view updates the other | P0 |
| VT-07 | UI/UX builder with four themes, brand kit, desktop and mobile preview | A tour looks on-brand with no code | P0 |
| VT-08 | Ultra-luxury loading screen and cinematic intro, both skippable and replaceable | Loading screen shows only while real content loads | P0 |
| VT-09 | Publish as a URL with access options, QR, embed and version rollback | Rollback live in under 1 minute | P0 |
| VT-10 | Walk-through from a 3D model: dollhouse, capture points, nodes, tags, measure | Node positions equal model positions within 5 cm | P1 |
| VT-11 | Analytics and lead capture with consent | Lead reaches the CRM within 60 seconds | P1 |
| VT-12 | VR mode (WebXR) and gyroscope on phones | Comfortable turn rate; no motion jumps | P2 |
| VT-13 | Review in collaborate mode with pinned comments | Comment keeps its scene and angle after republish | P1 |

## 45. \[v6\] The full customer journey

Four people use Zukeviz: the **architect or visualizer** (makes the images), the **studio lead or developer's marketing manager** (decides and pays), the **client or sales lead** (reviews), and the **buyer** (sees the tour). The journey follows the work from first visit to a sold unit.

| Stage | What the person wants | Screens and moments | Success signal | Main risk and answer |
| --- | --- | --- | --- | --- |
| 1. Discover | See that it is real and safe for client drawings | Landing with a live before and after, trust page, sample project to try | Starts a trial | Looks like a toy; answer: studio-grade samples, honest labels |
| 2. Sign up and set up | Be productive in minutes | Email or SSO, brand kit, team invite, sample inputs, "Here is what I see" | First render in under 3 minutes | Blank-page fear; answer: sample and Looks |
| 3. Create | Get a faithful image fast | Studio workspace, eight questions, Direction round, price on button | Verified badge | Wrong building; answer: Strict default, gate |
| 4. Refine | Fix one thing without losing the rest | Editor, select, pen, references, region lock, version tree | Change made in one try | Drift; answer: child versions, change map |
| 5. Agent mission (optional) | Hand over a whole plan | CAD intake, mission control, budget, approval pack | Approval pack in 30 minutes | Fear of overspend; answer: cap, gate |
| 6. Review together | Decide with the team and client | Live review room, pinned items, status board, summary | All blockers closed | Messy feedback; answer: item statuses with owner and time |
| 7. Approve and finalise | Lock the look and get final files | Approval page, 8K to 15K finals, upscale, disclosure labels | Approved with log | Misleading images; answer: Honesty report |
| 8. Motion | Turn stills into a film | Storyboard, video editor, export | One MP4 downloaded | Drift in clips; answer: checks and regenerate |
| 9. Tour | Let buyers walk the project | Virtual Tour Studio: scenes, hotspots, plan, units, map, intro | Tour previewed on a phone | Heavy, slow tours; answer: tiled loading, budgets |
| 10. Publish and share | Send one link everywhere | URL, QR, embed, passwords, languages | Link opened by a buyer | Wrong version live; answer: preview and rollback |
| 11. Sell and learn | Turn views into leads | Lead capture, CRM sync, analytics, unit status | Leads per tour | Disconnected tools; answer: CRM and sheet sync |
| 12. Renew and grow | Reuse the project for the next one | Project memory, brand kit, templates, usage report | Second project started | Cost surprise; answer: usage report and caps |

**The buyer's own journey (inside a tour)**

1. **Opens the link** on a phone or in a message and sees the loading screen and intro within a second of tapping.
2. **Lands in the first scene** with a one-line hint ("drag to look, tap the rings to move").
3. **Explores** rooms, opens videos and images in hotspots, and checks the plan and mini map.
4. **Finds the right unit** in the inventory view, filters by floor, area and price, and opens the unit card.
5. **Checks the neighbourhood** on the map with landmark times and the animated route.
6. **Acts:** books a visit, asks a question, downloads the brochure, or shares the link.
7. **Returns** later from the same link; the tour remembers where they stopped and shows if the unit status changed.

**Moments that must feel excellent:** the first render arriving, the Verified badge, the approval page opening on a phone, the tour intro, and the first lead notification. Each has a defined time budget and a sound-off design.

## 46. \[v6\] Ultra-premium UI/UX direction

Two surfaces share one design language. The **Studio** (for makers) is calm, precise and dark by default so the image glows. The **Tour and review pages** (for clients and buyers) are the showpiece: cinematic, warm and unhurried. Both feel like a private gallery, not a dashboard.

**Principles**

1. **The image is the hero.** Chrome fades when a person is looking at a render, and returns on a light touch.
2. **Quiet luxury.** Few elements, generous space, fine type, no clutter, no loud gradients.
3. **Every wait is designed.** Loading, rendering and uploading each have a considered state with real progress.
4. **Motion with meaning.** Movement explains change (a panel slides from where it lives); nothing bounces; every effect respects the reduced-motion setting.
5. **Sound is optional.** Subtle cues, off until the viewer opts in.
6. **Premium is fast.** The budget below is part of the design.

**Design tokens (supersedes the token table in section 32)**

| Token | Value |
| --- | --- |
| Ink (dark base) | Near-black with a warm tint, with a lifted charcoal for panels |
| Ivory (light base) | Warm off-white; true white only inside image frames |
| Champagne accent | A soft metallic gold used for the primary action, active pill, progress line and focus ring; never for large fills |
| Status | Muted emerald (verified), amber (review), garnet (flagged) |
| Display type | A refined high-contrast serif for titles, project names and the loading screen |
| UI type | A clean geometric sans for controls and data; tabular numbers for prices and areas |
| Surfaces | Frosted glass panels (blur, 1 px hairline border, no heavy shadow); solid panels as a fallback for performance and contrast |
| Corners | 12 px panels, 8 px controls, full pills for tags and status |
| Spacing | 4 px grid; generous outer margins |
| Motion | 200 to 320 ms, ease-out; a slow 1.2 s settle for hero transitions; no bounce |
| Icons | Thin 1.5 px line set, consistent stroke |

**Signature moments**

| Moment | Design |
| --- | --- |
| Loading screen | Ink background; a slow gold hairline draws the project mark; project name in serif; a thin progress arc fills with real progress; hint line in small caps; a soft fade into the intro |
| Intro | Aerial or hero image with a slow push-in; name and tagline fade up; a gentle descent into the first scene; skip button after 1 second |
| Studio first run | The canvas dims, the single "Upload" invitation glows, and the first render arrives with a light sweep |
| Verified badge | A small emerald seal draws itself once; the Honesty report slides in as a quiet side card |
| Approval page | A full-bleed contact sheet; images enlarge on hover; Approve and Reject as large, calm buttons; thank-you state with a small seal |
| Tour navigation | Rings that breathe slowly; glass dock; transitions that fly through the space; a map line drawing itself in gold |
| Empty states | A single beautiful sample image and one line of invitation, never a blank grid |

**Performance and accessibility budget:** loading screen visible only for real load time; first meaningful paint under 1.2 s on desktop and under 2.5 s on a good 4G phone; interaction response under 100 ms; 60 fps motion; WCAG 2.1 AA contrast on every text and control, including text over glass (a solid fallback is applied when contrast would fail); full keyboard use; reduced-motion and reduced-transparency modes; 14 languages and right-to-left layouts; a light and dark version of every screen.

**What not to do:** no stock-photo heroes, no gradients-with-glow, no animated confetti, no autoplay audio, no full-screen interstitials before the tour, no decorative motion that delays a task.

## 47. \[v6\] Stitch prompt pack for the entire app (supersedes section 32)

**How to use.** Paste the **master prompt** once so Stitch fixes the look, then send one screen prompt at a time. Stitch makes screens, not working software: the Editor canvas, WebRTC room, 360 viewer and video timeline need developers, so these prompts design their frames and states. Change one thing per follow-up, keep the tokens from section 46 fixed, and review every screen against the checklist at the end. There are 30 screens in 6 groups.

**Master prompt**

```
Design a premium, ultra-luxury web app called Zukeviz: an AI visualization, collaboration and virtual tour platform for architects, interior designers and property developers. Two surfaces share one language. (1) Studio, for makers: dark by default, calm and precise, the image is the hero and controls fade when not needed. (2) Review and Tour pages, for clients and buyers: cinematic, warm, unhurried, full-bleed imagery. Visual language: quiet luxury; near-black warm ink and warm ivory bases; a soft champagne-gold accent used only for primary actions, active pills, progress lines and focus rings; a refined high-contrast serif for titles and project names, a clean geometric sans for controls, tabular numbers for prices and areas; frosted glass panels with 1px hairline borders and no heavy shadows; 12px panel corners, 8px controls, full-pill tags; thin 1.5px line icons; generous spacing on a 4px grid; motion 200 to 320ms ease-out, no bounce. Status colours: muted emerald (verified), amber (review), garnet (flagged). Core Studio layout: collapsible left icon menu (64px collapsed), a left presets and controls panel (320px) with image tiles and editable pills, a top bar (project, version history, mode Simple/Pro/Expert, credits, share), a large central canvas, and a bottom chat bar showing the prompt as one readable sentence with editable pills and a lock on the keep clause. Use plain human labels, show price before every spend, include empty, loading, error and success states, keep text contrast at WCAG AA, and design light and dark versions. Never use stock photography clichés, glow gradients, or confetti.
```

**A. Studio (makers)**

| # | Screen | Prompt (after the master) |
| --- | --- | --- |
| 1 | Landing and sign-up | A calm landing page with a hero that slides a live before and after of a sketch turning into a render; three short value lines; a trust strip (SSO, C2PA, no-training default); a sample-project button; sign-up with email, Google, Apple and SSO |
| 2 | Onboarding | Three quiet steps: set brand kit (logo, colours, fonts), invite team, choose a sample or upload; progress hairline; skip allowed |
| 3 | Project dashboard | Project cards with a hero image, version badge and status chip; a mission progress ring; recent comments; credits against budget; quick actions: New render, Start Agent mission, Open tour studio, Share for review |
| 4 | Studio workspace | Left presets panel with eight question groups of image tiles (Camera, Time, Weather, Mood, Materials, People, Site, Finish), each with a selected Auto tile; centre canvas with an interior render and a "Here is what I see" card; bottom bar sentence with highlighted pills and a lock icon; Generate button showing the price; a four-draft strip for the Direction round |
| 5 | Looks gallery | Sixteen large Look tiles with a name, a one-line use, and a fidelity badge; filter chips; hover reveals a before and after on the user's own image |
| 6 | Result review | Image with a Verified seal, compare slider, change-map toggle, changed-elements list, Honesty report card, and actions: Accept, Fix a region, Variations, Upscale, Video, Tour, Share |
| 7 | Editor | Dark Figma-like editor: left toolbar (select, pen with node handles, brush, mask, text, eraser), right panel with layers and detected objects, stroke width, colour, notes, reference attachments (image, video, 3D), a selected sofa with outline and pinned note, version tree on the right edge, bottom instruction field and Generate with price |
| 8 | Finish and upscale | Side-by-side 100% crop preview, scale choice 2x, 4x, 8K, 12K, 15K with prices, detail slider, preserve-text toggle, and a download panel with formats |

**B. Agent Zuke**

| # | Screen | Prompt |
| --- | --- | --- |
| 9 | CAD intake check | The 2D plan on the left with rooms outlined; right list of rooms, doors, windows, levels with confidence chips; scale confirmation field; Confirm and continue |
| 10 | Mission control | Vertical pipeline of eight steps with status chips, thumbnails and cost per step; expanded log for the current step; right memory card (style, palette chips, cast, locked objects); Pause, Edit plan, Open in Studio; budget bar |
| 11 | Camera planner | A plan with room cameras as small cones; a side list of candidate cameras per room with scores; a preview of the chosen view; Accept, Move camera, Try alternate |
| 12 | Project memory | Style card, palette chips, material list per room, cast of people with thumbnails, locked objects, approved references, and a Reset button |

**C. Collaboration and review**

| # | Screen | Prompt |
| --- | --- | --- |
| 13 | Live review room | The canvas with a row of participant avatars and live cursors; a floating WebRTC panel with video tiles, mute, camera, share screen; host toolbar (follow me, laser, draw, voice note); a side drawer listing review items; a "proposed version" ribbon with Apply and Discard |
| 14 | Review board | Kanban columns Open, In progress, Needs check, Resolved, Closed; cards with a thumbnail, the pin, one line, assignee avatar, priority chip and "updated by Priya, 14:32"; filters by person, image and date |
| 15 | Item thread | An item opened beside the image: pinned spot, the full history with who and when for every status change, reply box, voice note, linked fix version, and buttons Mark resolved, Close with note, Reopen |
| 16 | Approval page (client) | A page that opens from a link without sign-in: full-bleed contact sheet of plan, isometric and room views; each image with Approve, Reject, click-to-pin comment and a small Honesty report; sticky footer with Approve selected and Request changes |
| 17 | Review summary | A calm summary after a live room: decisions made, open items with owners and due dates, next steps, and a Send to team button |

**D. Virtual Tour Studio**

| # | Screen | Prompt |
| --- | --- | --- |
| 18 | Tour studio | Left scene list and a small tour graph; centre 360 editor with hotspots as breathing rings; right inspector for the selected hotspot (type, style, content, animation, rules); top bar Preview, Mobile, Publish; bottom sentence editor with pills for scenes, hotspots, plans, maps, clips and calls to action |
| 19 | Hotspot builder | A hotspot selected in the 360 view with a panel to choose its type (navigation, info, media, 3D object, plan jump, unit, map, document, lead), style (ring, dot, glass chip, label), and content; a media hotspot holding a video |
| 20 | Plans and mini map | A floor plan with camera pins and view cones, level switcher, unit plan panel; a mini map overlay in the viewer |
| 21 | Inventory model | A tower stacking view with units coloured by status (available, reserved, sold), filters for type, floor, area, price and orientation, and a unit card with area, rooms, price and a tour button |
| 22 | Map and route | A map with project pin and landmark hotspots (schools, transit, shops, parks) with distances and times; a gold route line drawing itself from the project to a landmark with a time chip |
| 23 | 3D walk-through builder | A dollhouse view of a model with capture points on the floors; a panel to add, move and delete points; a list of nodes with thumbnails; Tag an object, Measure, and a Render 360s button with price |
| 24 | UI/UX builder | Theme picker (Ultra luxury, Minimal, Developer sales, Hospitality), brand colours and fonts, dock position, tool toggles, transition style, intro and loading editor, with live previews on desktop, tablet and phone |
| 25 | Loading and intro | Ultra-luxury loading screen: ink background, a slow gold hairline drawing the project mark, project name in fine serif, a thin progress arc and a small hint line; then the intro frame with name and tagline over a slow push-in on an aerial image |
| 26 | Publish and share | A panel with URL and custom domain, QR code, access (public, password, expiring, invited), embed code, languages, disclosure labels, version history with rollback, and an analytics preview |

**E. Buyer experience**

| # | Screen | Prompt |
| --- | --- | --- |
| 27 | Tour viewer (desktop and mobile) | Full-bleed 360 scene; floating glass dock with scene list, plan, units, map, share and language; breathing navigation rings; mini map with view cone; hotspot card open with a video; mobile version with a bottom sheet and thumb-reach dock |
| 28 | Buyer unit flow | A unit card opening from the inventory view with plan, area, finishes, price, status, a Walk this unit button, and a short Book a visit form with consent text |

**F. Admin and enterprise**

| # | Screen | Prompt |
| --- | --- | --- |
| 29 | Team and billing | Members and roles, spend by member with caps, usage report, plan card with fair-use limits stated in numbers, invoices, and credit packs |
| 30 | Settings and security | Tabs: SSO, brand kit, disclosure labels by market, notification channels, data and privacy (export, delete, residency), audit log, API keys and webhooks, admin console with kill-switches |

**Review checklist for every screen:** is the image the hero; are Auto choices the default; is the price visible before each spend; does each status show who and when; are errors calm and clear about credits; does it work by keyboard; is text contrast at least 4.5 to 1, including over glass; does it work in 14 languages including right-to-left; is there a mobile layout for screens 16, 17, 27 and 28; does it feel quiet and expensive rather than busy.

## 48. \[v7\] The four studios (renames and extends sections 7, 30 and 44)

Zukeviz now has four named studios that share one project, one asset library, one Scene Bible and one credit ledger. Anything made in one studio opens in another with one click and keeps its version history.

| Studio | Replaces | For | Core idea |
| --- | --- | --- | --- |
| **MAS 2D Studio** | The Editor (section 7) | Images, boards and layouts | A Photoshop-class and Canva-class editor with AI, plus material and light palettes |
| **SAM 3D Studio** | New | Models, cameras and live renders | A Blender-class 3D editor that reads CAD plans, furnishes rooms and renders any camera with the AI engine, live |
| **KING 360 Studio** | Tour Studio (section 44) | Panoramas and tours | Color, grading, region edits, animation and lights on 360 images, and the full virtual tour toolset |
| **KUM Video Studio** | Video editor (section 30) | Motion | Image to video, a complete video editor, AI place and edit, and MP4 export |

**How work moves between them**

1. A render from the Studio workspace opens in **MAS** for retouching and board layout.
2. A CAD plan or model opens in **SAM**; each camera there renders through the same engine and lands as images in the project.
3. A 360 render from a SAM camera opens in **KING**; approved stills open in **KUM**.
4. KING and KUM read the same Scene Bible, so light, palette, materials, people and the **Look Anchor** (section 50) stay consistent.

**AI place and edit (one feature in all four studios).** The user describes or points: "put a person reading on the sofa", "add two cars at the entrance", "replace the sky with golden hour", "remove the scaffolding". The system finds the target region with segmentation, drafts the change inside that region only, checks scale and the Design Contract, and shows it as a proposed layer the user accepts or rejects. In 2D it works on pixels, in 3D on objects (it places a library asset), in 360 on equirectangular regions with seam handling, and in video on tracked regions across frames.

**Naming note.** SAM is also the name of Meta's Segment Anything family of models (including 3D models). Using "SAM 3D Studio" as a product name may confuse people or draw a trademark objection. Have counsel check all four names (MAS, SAM, KING, KUM) in each target market before launch; the doc uses them as you chose them.

## 49. \[v7\] MAS 2D Studio: Photoshop-class and Canva-class tools, with material and light palettes

MAS is one canvas with two modes: **Edit** (pixel and layer work) and **Compose** (boards, brochures, social posts, presentations). Both share layers, brand kit and AI tools. Browser engine: a canvas or WebGL renderer with layer compositing, with heavy filters on the server. PSD and PDF round-trip so work can leave and return.

**Photoshop-class tools**

| Group | Tools and features |
| --- | --- |
| Layers | Raster, text, vector and smart-object layers; groups; layer and vector masks; clipping masks; adjustment layers; blend modes; opacity and fill; layer styles (shadow, glow, stroke, overlay); lock, link, search; 16-bit and CMYK-ready color |
| Selection | Rectangle, ellipse, lasso, polygon lasso, magnetic lasso, magic wand, quick selection, **object select** (segmentation), select subject, select sky, select by color range, refine edge, feather, grow and shrink, save and load selections |
| Transform | Move, free transform, scale, rotate, skew, distort, perspective, warp, puppet warp, liquify, flip, align and distribute, snapping, smart guides |
| Paint and retouch | Brush with pressure, pencil, eraser, clone stamp, healing brush, spot healing, patch, content-aware fill and move, dodge, burn, sponge, blur, sharpen, smudge, gradient and paint bucket, symmetry painting |
| Adjustments | Levels, curves, exposure, brightness and contrast, hue and saturation, color balance, selective color, black and white, photo filter, vibrance, channel mixer, gradient map, LUT, shadows and highlights, match color |
| Filters | Gaussian, lens and motion blur, depth blur from depth map, sharpen, unsharp mask, high pass, noise add and reduce, film grain, bloom, lens correction, **perspective and vertical correction**, vanishing point, camera-raw style panel, filter gallery, smart filters |
| Vector and type | Pen tool with node handles and adjustable stroke, shapes, boolean operations, paths, text on path, character and paragraph styles, font library with brand fonts, OpenType features |
| Crop and canvas | Crop with ratio presets, straighten, perspective crop, canvas and image size, trim, artboards, outpaint extend |
| Guides and measure | Rulers, guides, grids, scale bar from a known dimension, measure tool, pixel preview |
| History and automation | History panel and snapshots, 50+ undo steps, actions (record and replay), batch apply to many images, scripts through the API |
| Files | Open and save PSD, TIFF (16-bit), PNG, JPG, WebP, SVG, PDF; linked and embedded images; ICC profiles; export by slice, layer or artboard |
| **Arch-viz retouch kit** | Sky replacement, glass and reflection helper, entourage cutouts with scale check, light wrap, shadow generator from a direction, color match between images, vertical-line straightening, lens distortion fix, material swap by mask |
| **AI tools** | Generative fill and expand, remove object, AI place and edit, relight, upscale and enhance, background removal, colorize, depth blur, sky and season change, image to Look, text to layer, region lock, change map |

**Canva-class tools (Compose mode)**

| Group | Tools and features |
| --- | --- |
| Templates | Presentation board, competition sheet, A-series sheet, brochure, one-pager, listing flyer, price list, unit sheet, social post, story, banner, business card, email header; a developer pack of sales templates |
| Layout | Drag and drop, frames and grids, auto-align, spacing guides, columns, multi-page documents, bleed and crop marks, margins, rulers, layers panel, lock and group |
| Brand kit | Logos, colors, fonts, image styles, templates locked to the brand; apply brand in one click; magic resize to any size |
| Elements | Icons, shapes, lines, arrows, dimension lines, north arrow and scale bar, charts, tables, QR codes, maps, stickers, frames, mockup devices |
| Text | Heading and body styles, font pairs, effects, curved text, lists, tables of finishes, multi-language swap |
| Media | Project assets, licensed stock (only sources with clear commercial licences), video and audio blocks, background remover, image crop and fit, palette from image |
| Motion | Page transitions, element animations, animated posts; export as MP4 or GIF through KUM |
| Data | **Bulk create**: connect a CSV or the inventory sheet to make a unit sheet or price card for every unit |
| AI design | Describe a layout and Zuke builds it from approved images and the Scene Bible; rewrite copy; translate; fit to brand |
| Share and print | Share link with comments, present mode, download PDF (print, web), PNG, JPG, MP4, editable link; CMYK PDF with bleed |
| Collaboration | Real-time editing, comments with status and owner (section 43), version history, approvals |

**Material palette.** A reusable palette of real materials that follows the project.

- **Structure:** by space (exterior, interior, landscape, amenities) and by role (facade cladding, roof, glazing and frames, paving, fences; floors, walls, ceilings, counters, joinery, fabrics; decking, planting beds, turf, water). Each material has a swatch, a PBR map set, real-world scale, finish, tone, vendor and SKU if known, price tier, and its licence.
- **Build a palette:** from an image (extract and match materials), from a Look, from the Scene Bible, from a brief, or by hand; show harmonies (tone, warmth, contrast) and warnings for clashes.
- **Apply:** drag a swatch onto a mask in 2D, onto a surface in 3D, or onto a zone in 360; "apply to every wall" and "swap everywhere" use object masks, so only the intended surfaces change. A swatch can lock so later edits cannot change it.
- **Sources:** CC0 libraries such as Poly Haven and ambientCG, the user's uploads, and vendor feeds; AI-generated seamless textures are labelled as such.
- **Output:** a material schedule (CSV and PDF) and a board image with names, ready for AV-07 and DS-06.

**Light palette.** A palette of lighting moods for each kind of place. Each light preset stores type, color temperature, intensity, direction, softness, shadow, an optional IES profile for 3D, and the sentence fragment the AI engine uses.

| Space | Presets |
| --- | --- |
| Exterior | Sunrise, soft morning, clear midday, overcast, late afternoon, golden hour, sunset, blue hour with interior lights on, night with facade lighting; wall washers, uplights, entrance glow, street and bollard lights |
| Interior | Bright daylight, soft window light, cosy evening, showroom, hotel warmth, cove and ceiling glow, pendant over table, recessed grid, task and reading lights, accent and gallery lights, candle and fireplace, TV glow; color temperature 2700 K to 6500 K |
| Landscape | Path and step lights, tree uplights, garden string lights, water reflections, moonlight, dusk garden, fire pit glow, lantern rows |
| Amenities | Pool with underwater glow and caustics, clubhouse, gym, spa, rooftop terrace at sunset, lobby, kids area, sports court under floodlights, parking and drop-off, co-working lounge |

Light palettes combine with the material palette (for example warm timber with 2700 K cove lighting) and are applied in 2D by relight, in 3D as real lights, and in 360 and video through KING and KUM.

## 50. \[v7\] SAM 3D Studio

**What it is.** A 3D editor in the browser, backed by Blender running headless on our servers. Plan a scene, import a floor plan or unit plan and have it become a 3D model, place furniture from a library, plan cameras, and press **AI Render** on any camera. A live view shows the 3D scene and the AI result side by side.

**How the Blender features are delivered.** A full desktop program does not run well inside a browser tab, so the work is split. The **web editor** (built on an open-source WebGL engine) handles everyday tools instantly. A pool of **Blender workers** (bpy, headless, on GPU servers) handles heavy jobs: path-traced renders, boolean and modifier stacks, UV unwrapping, baking, geometry-node style scatter, format conversion and simulation. **Open in Blender** and **Send back from Blender** (GLB and .blend) let power users use the full program with no limit. Blender code is never shipped to users' machines (see section 53 on the licence).

**Blender-class features**

| Group | Features |
| --- | --- |
| Modes | Object, Edit, Sculpt (light), Paint, Camera, Light; undo and redo; transform gizmos; snapping to grid, vertex, edge, face and surface; pivot and orientation controls |
| Modeling | Vertex, edge and face editing; extrude, inset, bevel, loop cut, knife, bridge, merge, dissolve, mirror, array, solidify, boolean, subdivision, smooth and flat shading, proportional editing, wall and slab tools, stairs and railing generators, window and door cutters, roof tools, curves and text objects |
| Modifiers and nodes | Non-destructive modifier stack; scatter tool (plants, fences, paving, tiles, books) by rules and masks; parametric generators for facades, louvers and stairs |
| Materials | Principled material with texture maps, scale and rotation in real units, UV unwrap and projection, triplanar mapping, decals, glass, metal, water, foliage, emissive; the material palette (section 49) |
| Lighting | Sun and sky (date, time, latitude), HDRI world, point, spot, area and IES lights, emissive surfaces, light linking, exposure and white balance, the light palette (section 49) |
| Cameras | Camera objects with lens, sensor, shift, depth of field, clip, aspect and safe frames; see camera planning below |
| Rendering | Path-traced final renders (Cycles-style) on the server; real-time preview in the browser; render passes: beauty, depth, normals, object ID, material ID, line art, ambient occlusion, light groups, alpha; denoise; tiled large renders |
| Animation | Keyframes, timeline, graph editor, camera path, turntable, sun path, door and light animation, scene-to-video through KUM |
| Scene management | Outliner, collections, layers, instances and linked duplicates, groups, visibility and lock, search, scene units (metres, millimetres, feet and inches), levels |
| Assets | Asset browser with the furniture, material, light and entourage libraries; user uploads; version history for every object |
| Import and export | GLB, glTF, OBJ, FBX, STL, PLY, DXF, DWG (converted), IFC, SketchUp through the plugin, .blend through the worker; export GLB, OBJ, FBX, USD, STL, DXF, .blend, and 2D plan, elevation and section views |
| Measure and check | Distance, area, volume, clearance, door and window sizes, slope; warnings for thin walls, overlapping faces and flipped normals |
| Scripting | Server-side Python tasks for studios and enterprises, run in a sandbox with limits |

**Camera planning.** The user plans every render in one place.

- **Camera board:** list of cameras with thumbnail, name, room, lens, height, time of day, Look and status; drag to reorder; duplicate; batch render all.
- **Settings:** focal length 14 to 85 mm (24 to 35 mm default for rooms), sensor size, field of view readout, **vertical shift** so verticals stay straight, aspect ratio presets and safe frames, eye height and tilt with roll locked by default, depth of field with focus picker and f-stop, near and far clip.
- **Composition aids:** thirds and golden-ratio overlays, leading-line hints, horizon guide, headroom guide.
- **Plan view:** each camera shows as a cone on the floor plan with its field of view; drag to move or turn; warnings for a camera inside a wall or furniture, a window blown out by the sun, or a hero object cropped.
- **Auto camera planner** (from section 27): suggests 3 to 5 candidates per room and scores them; the user accepts, moves or discards.
- **Per-camera settings:** time of day, light preset, Look, people and fidelity, so one scene renders as morning living room and evening balcony in one batch.
- **360 and video cameras:** a panorama camera for KING and a camera path for KUM.

**Import a unit plan or floor plan and read it as a model**

1. **Upload** DWG, DXF, PDF or an image of a plan (a unit plan, a floor plan, or a whole floor with many units).
2. **Layer mapping:** a screen lists the drawing layers and the system's guess (walls, doors, windows, stairs, columns, furniture blocks, text, dimensions); the user fixes any guess in one click.
3. **Read the drawing:** scale from dimensions or a known width, wall thickness, openings with width and swing, rooms with names and areas, stairs, columns, balconies, levels. Furniture block names and text ("BED", "WC") are matched to library items.
4. **Convert 2D to 3D:** extrude walls to the level height (default 2.7 m, editable), cut openings at default sill and head heights (0.9 m and 2.1 m, editable by type), add slabs and ceilings, place doors and windows from the library. A **review view** overlays the model on the drawing; every uncertain item is flagged for a quick confirm.
5. **Multiply:** one unit plan can be repeated across floors and towers (stacking), with variants.
6. **Edit** with the 3D tools, or return to the plan and re-run; changes in either update the other.
7. **Furnish** (next section) and **plan cameras**.

Acceptance: room and opening counts match the drawing exactly on clean files; wall lengths within 1%; the review overlay lines up within 2 cm at scale.

**Furniture and object library.** Items come from open CC0 sources (such as Poly Haven models), licensed packs we buy, partner catalogue feeds and the user's uploads; each item records its licence. Categories: seating, tables, beds, storage, kitchen, bath, lighting, decor, rugs, curtains, appliances, office, hospitality, outdoor, play, plants and trees, vehicles, people. Each item has real dimensions, a clearance zone, style tags, material zones that take palette swaps, optional SKU and price, and an optimised GLB (compressed meshes and textures). Search by words or by image. **Place** by drag and drop with snap to floor, wall, ceiling and table; rotate and align; ergonomic warnings (for example less than 0.6 m for a walkway). **Style sets** (Scandinavian, contemporary, classic, hotel, minimal) place a coordinated set in a room. **Auto-furnish** fills a room from its use, size and style with rule checks, and every item can be swapped, locked or removed. Libraries are optimised for the browser and loaded on demand.

**Camera to AI Render: every 2D render feature, on.** From any camera, **AI Render** sends true depth, normals, object-ID, material-ID and line passes to the engine (rung 1 of the accuracy ladder), with the camera, the Look, the eight questions, the pills, the compiled sentence, the Scene Bible and the Look Anchor. All features of the 2D product apply: Looks and tiles, Direction round, fidelity gate and badge, Honesty report, change map, region edit by object (exact masks from IDs, so "change the sofa fabric" touches only the sofa), relight, upscale to 8K to 15K, variations, seed control, compare, collaboration, and send to MAS, KING or KUM. Results return as versions attached to the camera.

**Live rendering with a side-by-side view**

- **Layout:** left, the interactive 3D viewport; right, the live AI preview; a divider that can be dragged, a slider overlay, or a stacked view; both views share the same camera. Full-screen either side.
- **Behaviour:** while the user orbits or moves an object, the preview shows a low-resolution result quickly (about 512 px); about 300 ms after the user stops, it refreshes at higher quality; **Keep this frame** starts a full render with the same locks and shows the price first.
- **Budget:** live minutes and previews are metered and capped per plan; the button shows the running cost; the live model is a small, fast model or a low-latency partner route, with a fallback to a draft mode if latency passes the limit.
- **Targets (assumptions to measure):** first preview in under 2 seconds at p95 after idle; at least 4 frames per second while navigating at draft quality; geometry in the preview matches the 3D view (structure check on every preview).

**Freeze the mood: the Look Anchor.** The user wants the first image they like to set the mood for everything after it, and to change it only on purpose.

1. The first generated image the user marks **Keep this look** becomes the **Look Anchor**. The system stores the image and the attributes it reads from it: palette, color grading, light direction and temperature, time of day, contrast, material tones, atmosphere, people style.
2. From then on, live previews, new cameras and final renders in this project use the anchor as a **style reference** (not a structure reference) and as hard text constraints in the compiled sentence. A small padlock shows "Mood locked" with the anchor thumbnail.
3. Changing the 3D (moving furniture, a different camera, new materials in a zone) changes only what is in the scene; the mood stays.
4. **Update the mood on purpose:** open the mood panel, change the tiles (for example Time to blue hour) or drop a new image, and press **Re-anchor**. Zuke shows a before and after of the attributes, creates **Look Anchor v2**, and asks whether to apply it to this camera, all cameras, or only new renders. Earlier versions stay in history and can be restored.
5. A **lock strength** control (Strict, Soft) sets how tightly the anchor binds; a **drift check** compares each new preview with the anchor and warns when color or light drifts; per-camera overrides are allowed (for example a night camera under a day anchor, marked clearly).
6. The anchor feeds the Scene Bible (section 28), so KING and KUM inherit it.

Acceptance: with the anchor on, the continuity score of 0.8 or higher on 90% of new camera renders in a test project; changing the mood requires one explicit action; every render stores the anchor version it used.

## 51. \[v7\] KING 360 Studio (renames the Tour Studio of section 44 and adds image tools)

Everything in section 44 (scenes, hotspots, mini map, plans, units, map and route, sentence editor, UI builder, loading and intro, publishing and analytics) is part of KING. v7 adds the panorama editing tools, so a 360 can be corrected and finished in the same studio before it becomes a tour.

**Color correction (panorama-safe).** Adjustments work on the whole sphere with no seam: exposure, white balance and tint, contrast, highlights and shadows, whites and blacks, vibrance and saturation, HSL by color, curves and levels, clarity, dehaze, sharpening, noise reduction, vignette, chromatic aberration fix, and **horizon and vertical leveling**. **Match scenes:** pick a hero scene and match the exposure and color of all others in one click so a tour does not flicker from room to room. Before and after toggle, and per-scene or whole-tour apply.

**Grading.** LUT library, color wheels for shadows, midtones and highlights, split toning, film grain, bloom and glow, tone mapping, time-of-day relight and season change on the whole panorama, and saved **grades** that apply to every scene and to KUM clips.

**Region edit (seam-aware).** Select a region in the flat view or on the sphere with brush, lasso, magic select or object select; edits wrap around the seam and are checked at the poles. Tools: remove object (tripod, photographer, clutter), replace sky, replace material, add furniture or people with scale check, change finish, blur faces and plates for privacy, nadir and zenith patch (tripod removal with logo option), fix stitching seams, AI place and edit (section 48). Region lock keeps approved areas unchanged. Every AI edit passes the fidelity gate.

**Lights.** Relight a panorama as day, golden hour, dusk, night; turn practical lights on or off (lamps, cove, pendants) by region; add a light and see its glow and falloff; paint light with a brush for accents. A **day and night toggle** can be offered to the viewer, using two or more lit versions of the same scene; a **finish toggle** swaps materials in a region (for example floor option A or B) using the Variant matrix.

**Animation.** Scene transitions (fade, fly-through with depth parallax, zoom, whip-free dissolves); auto-rotate and a guided camera path with easing; hotspot entrance and idle animations; intro fly-in; a day-to-night timelapse inside a scene; gentle moving elements (clouds, water, trees, curtains, flames, pool shimmer) as short seamless loops made in KUM and placed in the sphere; animated route lines on the map layer; animated unit status; narration and captions synced to the path.

**The complete virtual tour toolset in KING.** Scene groups and levels; navigation, info, media, 3D object, plan, unit, map, document, product, audio and lead hotspots; image and video inside hotspots; mini map; floor plan and unit plan; inventory model; map, landmarks and route animation; compass; scene list; autoplay with narration; gyroscope; VR and WebXR; sentence editor; UI/UX builder with four themes; loading screen and intro; languages; password, expiring and invited-only access; custom domain, short link and QR; embed script; analytics and lead capture with CRM sync; before and after comparison hotspot; measure tool; version history, preview and rollback; review in collaborate mode; offline package for kiosks; **tour templates** (luxury residential, hospitality, commercial, masterplan); and a **tour hub** that groups many tours (towers, phases, show homes) behind one branded page.

| ID | Requirement | Acceptance criterion | Pri |
| --- | --- | --- | --- |
| KG-01 | Seamless color correction and scene matching across a tour | No visible seam on the sphere; matched scenes within a set color difference of the hero scene | P0 |
| KG-02 | LUT grading and saved grades | A grade applies to all scenes in one click and to KUM clips | P1 |
| KG-03 | Seam-aware region edit with remove, replace, add and privacy blur | No visible seam at the wrap line in 95% of test edits | P0 |
| KG-04 | Nadir and zenith patch with logo option | Tripod removed in one click on 90% of test panoramas | P1 |
| KG-05 | Day and night, finish and furniture toggles for viewers | Switch in under 1 second from cached variants | P1 |
| KG-06 | Scene animation: transitions, guided path, hotspot animation, seamless loops | Loops have no visible jump | P1 |
| KG-07 | Tour hub and templates | A branded hub with 3 tours built from a template in 10 minutes | P2 |

## 52. \[v7\] KUM Video Studio (replaces the video editor of section 30)

**Image to video.** A single image, a first and last frame, or several keyframes become a clip. Camera moves: dolly in and out, truck, pan, tilt, orbit, rise, crane, push-through, hold. **Motion by region:** paint where things move (water, trees, curtains, clouds, flames, people) and leave the architecture still. **Ambient loops:** seamless loops of moving sky, water or lights. **Day-to-night timelapse** from a still. Text to video and video to video restyle are available but marked creative and held to the Design Contract only when the user turns Strict on. Length is generated in short clips (5 to 10 seconds) and joined on the timeline; the router picks an open model such as Wan 2.2 (Apache 2.0) on our GPU workers or a partner video model by quality, cost and speed. Every clip passes the drift, flicker and straight-line checks of section 30 before it is shown.

**AI place and edit in video.** Place people, cars, trees or objects, replace the sky, relight, remove a distraction, or change a material; the target is tracked across frames with video segmentation, the change is drafted inside that region, and scale and continuity are checked. The user sees a proposed layer and accepts or rejects it.

**Complete video editor tools**

| Group | Tools |
| --- | --- |
| Timeline | Multi-track video, audio, title, effect and adjustment tracks; magnetic and free modes; snap; ripple, roll, slip and slide edits; markers; zoom; nested sequences; proxies for smooth playback; unlimited undo |
| Cutting | Trim, split, delete, duplicate, replace, freeze frame, reverse, speed change and ramp, time remap, in and out points, three-point edit |
| Motion and effects | Keyframes for position, scale, rotation, opacity and crop; masks with feather; tracking; stabilise; crop and reframe with auto-follow; transitions pack; blur, glow, grain, vignette, lens flare (light), chroma key |
| Color | Exposure and contrast, white balance, curves, color wheels, LUTs, match shots, color-grade presets shared with KING, scopes (waveform, histogram, vectorscope) |
| Text and graphics | Titles, lower thirds, animated captions, end card with price and contact, logo and watermark, shapes, map and route animations from KING, project data overlays, brand kit fonts and colors, safe areas |
| Audio | Music (licensed library or upload), sound effects, voice-over recording and text-to-speech in 14 languages, auto-duck, fades, equaliser, noise reduction, loudness normalisation to a streaming target, waveform editing |
| Captions | Auto captions and translation, style editor, burn-in or sidecar SRT and VTT |
| Assets | Approved stills, clips, KING grades, MAS boards and logos, SAM turntables and camera paths, all in one bin |
| Aspect | 16:9, 9:16, 1:1, 4:5, 21:9; auto reframe; per-aspect versions from one edit |
| Templates | Property launch film, amenity reel, unit walk-through, construction update, social teaser; AI builds a first cut from approved stills and the sentence |
| AI assist | Beat-sync cuts, suggest shots, extend or regenerate a clip, fix a flagged clip, write and voice a script from the plan facts only, translate the whole film |
| Collaboration | Comments pinned to a frame with status and owner (section 43), review links, version history, approval |

**Final export as MP4.** H.264 by default and H.265 as an option, AAC audio, up to 4K at 24, 25, 30 or 60 fps, bitrate presets (web, social, broadcast), fast-start for streaming, one-pass or two-pass, burned-in captions or a separate SRT, a poster frame, C2PA and watermark, and a resumable download. Also available: ProRes for studios, WebM and GIF for short loops, and a social set (9:16, 1:1, 4:5) from the same edit. Exports run in a queue on server FFmpeg with a progress screen and a notification. The edit list is stored as JSON so it can be re-exported, shared and rolled back.

**Architecture.** The browser plays low-resolution proxies and composites previews (using the browser's video codecs and, where needed, an in-browser FFmpeg build); the final render runs on the server from the edit list, so output does not depend on the user's device. The edit-list format follows an open interchange model where practical. Music and fonts must have clear licences; the export shows them.

| ID | Requirement | Acceptance criterion | Pri |
| --- | --- | --- | --- |
| KM-01 | Image to video with camera moves and region motion | Architecture stays still where unmasked; drift check passes in 90% of clips | P0 |
| KM-02 | First and last frame and multi-keyframe clips | The clip starts and ends on the given frames | P1 |
| KM-03 | AI place and edit in video with tracking | Object stays attached over a 5 second clip in 90% of tests | P1 |
| KM-04 | Full timeline, color, text, audio and caption tools | Editing a 40 second film with 12 clips needs no outside tool | P0 |
| KM-05 | MP4 export (H.264, optional H.265) up to 4K with queue and notification | Exported file plays in common browsers and phones; audio and picture in sync within 1 frame | P0 |
| KM-06 | Aspect versions and social set from one edit | Three aspect ratios exported from one timeline | P1 |
| KM-07 | Licensed music and TTS voice-over | Licence shown on export; voice-over in 14 languages | P1 |
| KM-08 | Handoff from SAM, KING and MAS | Open any approved asset in KUM in one click | P0 |

## 53. \[v7\] Open-source tools and free assets with commercial reuse

**Goal.** Build the four studios mostly from free, open-source parts and free assets that can be used in a paid product. Licences are the risk: two things that look free can still block a commercial product. **Verified** means I read the licence source this session (linked); **to confirm** means it is from general knowledge and must be checked against the exact version before use. This is not legal advice; have counsel confirm before launch.

**Three licence rules to design around**

1. **Copyleft (GPL, AGPL):** using the program on our servers to make output is usually fine, but shipping it, or code derived from it, to users can force us to publish our source. Keep GPL tools on the server as separate processes; keep AGPL code out of the product unless we accept publishing the combined source.
2. **Non-commercial or restricted weights:** some AI models are free to download but bar commercial use or add field-of-use limits. Use only models whose licence allows commercial use.
3. **Size-based or custom licences:** some free tools charge companies above a size. Check before building on them.

**Engines and editors**

| Area | Tool | Licence | Commercial use | Notes |
| --- | --- | --- | --- | --- |
| 3D engine in browser | Three.js, Babylon.js | MIT, Apache 2.0 (to confirm) | Yes | Web 3D editor, viewport, tour and walk-through |
| 3D engine on server | **Blender** (headless) | GPL (program); Cycles renderer Apache 2.0 | Yes, for output and server-side use; do not ship Blender or add-ons that call its Python API to users without GPL compliance | **Verified:** the output (.blend and renders) belongs to the user, and scripts that use the Blender Python API must be shared under the GPL if published ([Blender FAQ](https://www.blender.org/?p=942), [Blender licence page](https://www.blender.org/?p=658)) |
| 2D canvas | Fabric.js, Konva | MIT (to confirm) | Yes | Layers, selections, text, shapes in MAS |
| Image processing | OpenCV, libvips, Sharp | Apache 2.0, LGPL, Apache 2.0 (to confirm) | Yes | Filters, perspective correction, tiling |
| Vector tools | Paper.js, Two.js | MIT (to confirm) | Yes | Pen tool, paths, node editing |
| Whiteboard and canvas ideas | Excalidraw | MIT (to confirm) | Yes | Reference only; tldraw has its own licence, check before use |
| CAD read | ezdxf, OpenCascade, Assimp, IfcOpenShell | MIT, LGPL, BSD, LGPL (to confirm) | Yes with care for LGPL | DXF, STEP, many mesh formats, IFC. DWG needs a converter: check the licence of any DWG library (many are commercial or GPL) |
| Mesh and geometry | Open3D, trimesh, meshoptimizer, Draco | MIT, MIT, MIT, Apache 2.0 (to confirm) | Yes | Cleanup, simplify, compress GLB |
| 360 viewing | Photo Sphere Viewer, Pannellum, Marzipano, A-Frame | MIT, MIT, Apache 2.0, MIT (to confirm) | Yes | Panorama viewer for KING |
| Maps | MapLibre GL JS with OpenStreetMap data and an open routing engine | BSD, ODbL data (to confirm) | Yes; OpenStreetMap needs attribution and share-alike on derived databases | Map and route layer. Or use a paid map provider |
| Real-time collaboration | Yjs, LiveKit (WebRTC), coturn | MIT, Apache 2.0, BSD (to confirm) | Yes | Co-editing, voice, video, screen share, TURN relay |
| Video processing | FFmpeg | LGPL or GPL depending on the build | Yes if the build is LGPL and not shipped modified to users; avoid GPL-only encoders in anything shipped | Server export, proxies, filters. H.264 and H.265 encoders may carry patent licensing: counsel to confirm for each market |
| Video editing libraries | OpenTimelineIO, MLT | Apache 2.0, LGPL (to confirm) | Yes | Edit-list interchange; render engine ideas |
| Programmatic video | **Remotion** | Custom: free for individuals and for-profit companies of up to 3 people; larger companies need a paid company licence | Yes, under its terms | **Verified** ([Remotion licence](https://remotion.dev/license), [FAQ](https://www.remotion.dev/docs/license/faq)). Fine for a 3-person start; budget a licence once the team passes 3, or use FFmpeg plus our own edit list instead |
| Photo and paint apps | GIMP, Krita, Inkscape | GPL | Study and use; do not embed or ship their code | Use as references and for round-trip; MAS is built on the web libraries above |
| Node and pipeline UI | ComfyUI | GPL (to confirm) | Server-side use is possible; do not ship modified copies to users without GPL compliance | Useful to prototype model graphs; production services should call models through our own router |

**AI models (check the exact checkpoint)**

| Task | Model | Licence | Commercial use | Notes |
| --- | --- | --- | --- | --- |
| Segmentation and tracking | **Segment Anything 2 (SAM 2)** | Apache 2.0 for code and weights | Yes | **Verified** ([Meta announcement](https://ai.meta.com/blog/segment-anything-2/), [repository](https://github.com/facebookresearch/sam2)). Used for object select, region masks and video tracking |
| Image to video | **Wan 2.2** (text, image and combined) | Apache 2.0 | Yes; rights in the content made (likeness, trademarks) stay the user's responsibility | **Verified** ([Wan 2.2 licence listing](https://www.mindstudio.ai/blog/what-is-wan-2-2-video-open-source), [Hugging Face card](https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B)) |
| Image generation | FLUX.1 schnell, selected Stable Diffusion releases | Apache 2.0, community or OpenRAIL licences (to confirm per checkpoint) | Varies; FLUX.1 dev is non-commercial; some licences cap company revenue | Pick by evaluation set and licence; keep a licence field in the engine registry (section 14) |
| Depth and normals | Depth Anything variants, Marigold, others | Mixed: some sizes Apache 2.0, some non-commercial (to confirm) | Varies | Use only commercial-licensed checkpoints |
| Structure control | ControlNet and T2I-adapter families | Mostly Apache 2.0 or OpenRAIL (to confirm) | Usually yes | Pair with the chosen base model's licence |
| Upscaling | Real-ESRGAN and similar | BSD 3-clause (to confirm) | Yes | Check the individual weights |
| Speech | Open text-to-speech and speech-to-text models | Varies (to confirm) | Varies | Check voice and language licences; voice cloning needs consent |

**Free assets with commercial reuse**

| Asset | Source | Licence | Notes |
| --- | --- | --- | --- |
| HDRIs, PBR textures, 3D models | **Poly Haven** | CC0 | **Verified:** all assets are CC0 and may be used for any purpose, including commercial work ([Poly Haven FAQ](https://docs.polyhaven.com/en/faq)); there is an API |
| Materials, textures, some HDRIs and models | ambientCG | CC0 (to confirm on each asset page) | Large PBR material set |
| Low-poly and props | Kenney, Quaternius | CC0 (to confirm) | Useful for entourage and placeholders |
| Fonts | Google Fonts (OFL and Apache) | Open font licences | Keep the licence file with the font |
| Icons | Lucide, Phosphor, Tabler | ISC, MIT (to confirm) | Thin line sets match the premium look |
| Maps data | OpenStreetMap | ODbL | Attribution required |
| Other 3D sources | Sketchfab, BlenderKit, CGTrader | Mixed per item | Allow only items whose licence permits commercial reuse; record it per asset |

**Rules we enforce in the product**

- Every asset and model in the registry has a licence field, source link, date checked and who approved it; items without commercial permission cannot be published or used in client work.
- CC-BY items show attribution automatically in the credits panel of a tour or export.
- An import checker warns when a user uploads an asset marked non-commercial.
- A licence review runs before each launch, and the third-party notices file ships with the product.
- Open-source choices are reviewed every quarter, because licences and model versions change.

## 54. \[v7\] UI/UX of the four studios, Stitch additions and roadmap

The four studios use the premium language of section 46: ink and ivory, champagne accent, serif titles, glass panels, quiet motion. A **studio switcher** (four small marks: MAS, SAM, KING, KUM) sits in the left rail; the project, version history, credits, collaboration avatars and the Look Anchor chip stay in the top bar in every studio, so moving between them feels like changing rooms in one house. A mockup of the main screen of each studio is in the Claude Design canvas [linked here](https://claude.ai/artifact/XyBNLePzpJyu2YRYQm6Hoj).

| Studio | Layout |
| --- | --- |
| MAS 2D Studio | Top: mode switch Edit and Compose, document name, zoom, undo. Left: slim tool rail (move, select, lasso, wand, brush, heal, clone, text, pen, shape, crop, eyedropper). Centre: canvas with rulers and guides. Right: tabs for Layers, Adjustments, Materials, Lights, History. Compose mode swaps the right panel for Templates, Elements, Brand, Pages. Bottom: the AI bar ("Put a person reading on the sofa") with price |
| SAM 3D Studio | Left: outliner and asset library drawer (furniture, materials, lights). Centre: 3D viewport and, to its right, the live AI preview with a draggable divider. Right: properties (object, material, light, camera). Bottom: camera board (thumbnails with lens, height, time) and the AI Render button with price. Top-centre: mode switch, plan import, Mood Locked chip with the anchor thumbnail and Re-anchor |
| KING 360 Studio | As in section 44, plus a Correct tab (color, grade, region edit, lights, animation) beside the inspector, and a before and after toggle |
| KUM Video Studio | Top: preview player with aspect switch. Left: bin (stills, clips, KING grades, MAS boards), shot list and storyboard. Centre-bottom: multi-track timeline with playhead, markers and keyframes. Right: inspector (transform, color, text, audio, speed). Export button with MP4 options and queue |

**Design rules for studios:** the image or model is the hero; tool panels dock, collapse and remember their place; every AI action is a proposed layer or version with Apply and Discard; price shown before spend; keyboard shortcuts for every tool and a searchable command palette; dark by default, light available; all of it works with a touch pen and on a tablet in landscape, with a simplified phone view for review only.

**Stitch prompt additions (screens 31 to 42 of the pack in section 47).** Use the master prompt of section 47 first.

| # | Screen | Prompt |
| --- | --- | --- |
| 31 | Studio switcher and project home | A project home with four large studio tiles (MAS 2D, SAM 3D, KING 360, KUM Video), each with a hero thumbnail, last edited time, and a progress line; the Look Anchor card; recent versions; collaborators online |
| 32 | MAS Edit | A dark Photoshop-like canvas: tool rail on the left, a rendered interior on the canvas with a selection marching outline on a sofa, right tabs for Layers, Adjustments, Materials, Lights and History; bottom AI bar with "Place a person reading here" and a price |
| 33 | MAS Compose | A Canva-like board editor: a competition sheet with a hero render, plan, section, material board and title block; left template and elements panels; right brand kit; page strip at the bottom; share and present buttons |
| 34 | Material palette | A palette view with category tabs (exterior, interior, landscape, amenities), a grid of material swatches with names and tones, a harmony meter, and a "Build from image" drop zone; a spec list on the right with export |
| 35 | Light palette | Four tabs (exterior, interior, landscape, amenities) with preset tiles showing the same scene lit differently, a color temperature slider (2700 to 6500 K), intensity, direction dial, and an Apply to scene button |
| 36 | SAM 3D with live preview | A 3D viewport of a furnished apartment on the left and the live AI preview on the right with a draggable divider; outliner on the far left; properties on the right; camera board at the bottom with six cameras; top chip "Mood locked" with the anchor thumbnail and Re-anchor |
| 37 | Plan import and 3D review | The 2D plan with detected walls overlaid in colour beside the generated 3D model; layer mapping list; an uncertain-items list with Confirm buttons; Convert and Furnish buttons |
| 38 | Camera planner | A top-down plan with cameras as view cones, a side panel with lens, height, shift, depth of field and composition overlays, and a preview of the selected camera; Auto-plan button |
| 39 | Mood panel | The anchor image large, with extracted attributes (palette chips, light direction, color temperature, time of day, contrast), lock strength toggle (Strict, Soft), and Re-anchor with a before and after of attributes |
| 40 | KING correct | A 360 editor with the Correct tab: sliders for exposure, white balance, contrast, HSL, LUT grid, match-scenes button, region edit tools, nadir patch, before and after toggle |
| 41 | KUM timeline | A premium video editor: preview, bin, storyboard, multi-track timeline with colored clips and a keyframe lane, inspector tabs, and an Export MP4 dialog with options |
| 42 | Image to video setup | A panel to choose first and last frame, camera move tiles (dolly, orbit, rise, push-through), a region-motion brush on the image, clip length, and a price; a preview strip of three drafts |

**Roadmap placement.** MAS basics (layers, selection, adjustments, text, material and light palettes) go in phase 1 with the Studio; Compose mode, bulk create and PSD round-trip in phase 2. SAM starts in phase 2 with plan import, furniture, cameras and AI Render, adds live preview and the Look Anchor in phase 3, and the Blender worker pool and Open in Blender in phase 3 to 4. KING correction tools and KUM's full timeline and MP4 export land with phase 3 (finals and video). The AI place and edit feature starts in 2D (phase 1) and extends to 3D, 360 and video as each studio ships. Open-source licence review (section 53) is a phase 0 task.

**New risks**

| Risk | Mitigation |
| --- | --- |
| Scope: four studios are a large build for a lean team | Ship MAS and the SAM plan-to-render path first; use open libraries; cut Compose templates and Sculpt before the gate or ledger |
| Browser cannot match full Blender | Web editor for everyday work; Blender workers and Open in Blender for the rest |
| Live preview too slow or expensive | Draft quality while moving, caps per plan, fall back to manual render |
| Mood lock stops users exploring | Clear Re-anchor path, per-camera overrides, lock strength |
| Open-source licence trap (GPL, AGPL, non-commercial weights) | Section 53 rules, registry licence field, counsel review |
| Name clash with Meta's SAM models | Trademark check; keep a fallback name ready |

## 55. Arctic Harbor glass theme and Stitch prompt (v7 update)

**Look.** Replaces the warm ink and champagne look of section 46 in the Claude Design canvas. Mood: cool blues, crisp horizons, serene clarity, like a frosted window over a misty harbor at golden hour. The [Zukeviz studios canvas](https://claude.ai/artifact/XyBNLePzpJyu2YRYQm6Hoj) shows all four studios plus a Glass Kit board with the controllers.

**Tokens.** Palette: #08131F, #16314A, #2E4F6B, #5F7F98, #A9BDC9, #E8EFF3. Accent is ice (#CFE3F0) with one warm sun glint (#E8C98A) used only for credits, warnings and the golden-hour light. Titles in Jost Light with wide tracking, body in Manrope. Glass: panel fill rgba(22,49,74,.40), blur 24 to 28 px, saturate 150%, 1 px hairline rgba(169,189,201,.28), inner top highlight, soft deep shadow, 28 px radius for cards and pill shapes for controls.

**Controllers.** Pill toggles, vertical and horizontal tracks with a round white thumb, a time-of-day dial with start and end handles, segmented pills (Strict, Soft, Free), day chips, a fill-level credit capsule, a large rounded primary button with an ice gradient, and an AI command bar built from a sentence with pill slots plus voice, attach and send. Every control has a visible focus ring, a 44 px touch target and text contrast of at least 4.5 to 1.

**Stitch prompt (copy as is).**

Design a premium desktop web app called Zukeviz, an AI visualization studio for architects and developers, in a frosted-glass style. Background: a blurred misty arctic harbor photograph with soft golden sun glints, darkened to deep navy. Palette: #08131F, #16314A, #2E4F6B, #5F7F98, #A9BDC9, #E8EFF3, accent ice #CFE3F0, one warm glint #E8C98A. Type: Jost Light for large titles with wide letter spacing, Manrope for everything else. All panels are translucent glass: fill rgba(22,49,74,0.4), backdrop blur 28px, 1px light hairline, inner top highlight, deep soft shadow, 28px radius. Layout: a slim floating vertical icon rail on the left in a dark rounded pill, a glass sidebar with project tree, search and status counts, a large central canvas inside a glass frame, a glass inspector on the right, and a floating glass AI command bar at the bottom made of a sentence with pill slots. Top bar: project name, version chip, a studio switcher with four pills (MAS 2D, SAM 3D, KING 360, KUM Video), a Mood locked chip with a small anchor thumbnail, collaboration avatars, credits, and a Share button. Use tactile controllers: pill toggles, round-thumb sliders on dark inset tracks, a circular time-of-day dial, segmented pills, day chips, a capsule gauge for credits, and a large rounded primary button with an ice gradient. Keep generous spacing, quiet motion, no emoji, high contrast text. Screens to create, same style for all: 1) Home with module tiles, 2) MAS 2D editor with layers, material palette and light palette, 3) SAM 3D with the 3D viewport beside a live AI preview and a camera board, 4) KING 360 tour editor with hotspots, mini map, tour graph and color correction, 5) KUM Video with storyboard, multi-track timeline and Export MP4, 6) Review mode with comment pins and status chips (Open, In progress, Needs check, Resolved), 7) Customer-facing tour with a luxury loading screen and intro, 8) Credits and billing, 9) Settings and licences. Make it feel calm, expensive and precise.

**Build note.** In code, tokens live in one theme file and glass is one reusable class, so blur and border are tuned in one place. Backdrop blur is costly on low-end devices, so provide a reduced-transparency fallback (solid #16314A at 92%).

## 56. Preset library of 200, bottom dock and Node Studio (v7 update)

**Changes from the last review.** (1) The left panel of the editors carries a library of 200 prompt presets, each shown as a before and after picture. (2) The icon rail that sat on the left moves to a floating glass dock at the bottom of every screen. (3) A fifth studio, Node Studio, shows a whole project as a graph of nodes on an infinite canvas, like Figma for layout and ComfyUI for the render pipeline. The [canvas](https://claude.ai/artifact/XyBNLePzpJyu2YRYQm6Hoj) now shows all of this.

**The 200 presets.** Ten groups of twenty: Exterior light, Interior light, Materials, Atmosphere and weather, Landscape, Amenities, Camera and lens, Style and era, Mood grade, and Fixes and guards. Each preset has an ID (P001 to P200), a name, a group, a short text fragment, a strength from 0.5 to 1.5, and a flag for guard presets that go into the negative side. Presets are text only: they never contain code. A seed file with all 200 is delivered with this version (presets200.json) and loads into the preset table of section 35.

**Before and after pictures.** Every preset has a pair: the same reference scene without and with the preset, made once with the standard test scene and stored as two small images. In the panel the pair is a split card with a draggable divider; hover shows the preset text, Apply adds it as a pill to the prompt, and a second click removes it. Presets can be stacked; the panel shows the stack and how strong each one is. Search covers name, group and fragment. Teams can add their own presets, which show in a separate group. Rules: pairs are regenerated when the model changes, and a preset whose pair looks wrong in review is hidden until fixed.

**Bottom dock.** One floating glass bar, centred at the bottom: Home, MAS 2D, SAM 3D, KING 360, KUM Video, Node Studio, Comments, Settings. The active studio is filled in ice blue. The top bar keeps the studio switcher, project name, Look Anchor chip, credits and Share. In MAS 2D the tool buttons take the place of the dock. Content leaves room at the bottom so nothing hides behind the dock; on phones the dock shows five items and the rest go in a more menu.

**Node Studio.** Purpose: see and edit the whole route from plan to final render, and re-run only what changed.

- Canvas: infinite, dot grid, pan and zoom, frames to group a pipeline (one frame per room or per delivery), comment pins, minimap, snap and align like a design tool.
- Node types: Image in, CAD or plan import, 3D scene, Camera, Look Anchor, Preset, Prompt, AI Render, Upscale, Region edit, Compare, KING 360 pano, KUM video, Export. A node has inputs on the left, outputs on the right, a status (Idle, Running, Done, Cached, Failed, Locked), its credit cost, and a small preview.
- Rules: only matching types connect; a cycle is refused; a changed node marks everything after it as out of date; unchanged nodes use their cached result and the panel shows the credits saved; any node can be pinned, branched into a variant, or compared with another.
- Run: Run all or run from a node; a queue shows progress and cost before and after; spending above the limit asks first.
- Project link: nodes are views of the same project data as the other studios (Scene Bible, Look Anchor, assets), so a change made in SAM 3D shows up in the graph and the other way round. The graph is saved as versions with who and when, and works with the review statuses of section 43.
- Templates: start from Interior hero, Exterior twilight, Unit tour set, Social pack. Each is a graph the user can edit.
- Technical choice: the graph runs on a queue of the same render workers as the studios. A ComfyUI-style worker is an option on the server side only, and every model or custom node it uses goes through the licence check of section 52 before it is allowed.

**Updated Stitch prompt for the whole app (copy as is).**

Design a premium desktop web app called Zukeviz, an AI visualization studio for architects and developers, in an Arctic Harbor frosted-glass style. Background: a blurred misty arctic harbor photograph with soft golden sun glints, darkened to deep navy. Palette: #08131F, #16314A, #2E4F6B, #5F7F98, #A9BDC9, #E8EFF3, accent ice #CFE3F0, one warm glint #E8C98A. Type: Jost Light for large titles with wide letter spacing, Manrope for everything else. All panels are translucent glass: fill rgba(22,49,74,0.4), backdrop blur 28px, 1px light hairline, inner top highlight, deep soft shadow, 28px radius. Navigation: no left icon rail. Instead a floating glass dock centred at the bottom with eight round-square buttons (Home, MAS 2D, SAM 3D, KING 360, KUM Video, Node Studio, Comments, Settings), the active one filled ice blue. Top bar: project name, version chip, studio switcher pills (MAS 2D, SAM 3D, KING 360, KUM Video, NODE), a Mood locked chip with a small anchor thumbnail, collaboration avatars, credits capsule and a Share button. Left panel in every editor: a Presets tab with a search field, category chips (All 200, Exterior light, Interior light, Materials, Atmosphere, Landscape, Amenities, Camera, Style, Grade, Fixes) and a scrolling list of preset cards. Each card shows a split before and after picture with a draggable divider and small Before and After labels, the preset name, its group and ID, and an Apply pill. Centre: a large canvas in a glass frame. Right: a glass inspector with round-thumb sliders on dark inset tracks, segmented pills (Strict, Soft, Free), a circular dial, and a big rounded primary button with an ice gradient. Bottom of the editor: a glass AI command bar made of a sentence with pill slots, plus voice, attach and send. Screens to create, same style for all: 1) Home with module tiles and recent projects, 2) MAS 2D editor with layers, material palette and light palette, 3) SAM 3D with 3D viewport beside a live AI preview, camera board and the preset panel, 4) KING 360 tour editor with hotspots, mini map, tour graph and color correction, 5) KUM Video with storyboard, multi-track timeline and Export MP4, 6) Node Studio: an infinite dotted canvas with glass node cards joined by smooth curved wires, a dashed frame labelled Unit 3B Living room pipeline, nodes for Plan import, 3D scene, Camera, Look Anchor, Preset stack, AI Render with a preview picture, Compare with a before and after split, KING 360 pano and KUM video; each node has a header with a coloured dot and a status (Done, Cached, Running), input dots on the left and output dots on the right; left panel with Pages, Layers and an Add node search with chips; right panel with the selected node settings and a run queue with progress bars and a Run all button showing the credit cost; a minimap and a comment pin, 7) Review mode with comment pins and status chips (Open, In progress, Needs check, Resolved), 8) Customer-facing tour with a luxury loading screen and intro, 9) Credits and billing, 10) Settings and licences. Calm, expensive, precise, no emoji, high contrast text.
