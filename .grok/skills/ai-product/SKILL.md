---
name: ai-product
description: >
  Design and review an AI-powered product so people understand what it does, how
  it works and what to do next. Use for any question about product definition,
  user journey, onboarding, information architecture, AI trust and honesty
  (fallbacks, credits, uncertainty), empty/loading/error states, or "users can't
  understand the flow". Triggers on "product", "user journey", "flow", "onboarding",
  "how it works", "confusing", "UX gaps", "define the product", "AI feature".
metadata:
  short-description: "AI product craft: clear journey, honest AI, plain language, no dead ends"
user-invocable: false
---

# AI Product Skill (Oriel)

Make an AI product feel obvious. Source of truth: `/PRODUCT.md`. Read it first.

## Workflow

1. **Name the job.** Who is the user, what are they trying to get done, what does
   "good" look like to them (PRODUCT.md §2)? Design for the non-expert.
2. **Place it in the journey.** Every screen and feature maps to one of the six
   steps in PRODUCT.md §4. If it fits none, question the feature, do not add a
   seventh step. Never remove a feature to simplify; reorganise, label, or
   defer it behind progressive disclosure.
3. **One next step.** At every moment the interface must answer "what do I do
   now?" with a single primary action. Derive it from real state (see
   `src/lib/journey.ts`), not from a static tutorial.
4. **Explain AI honestly.** State what the AI will change and what it will keep.
   Label fallbacks as previews. State credit cost before, and refunds after.
   Never imply an image certifies dimensions, structure, code or cost.
5. **Plain words.** Replace or gloss jargon in place (one short sentence).
   Internal names (MAS, SAM, KING, KUM) need a plain description wherever they
   appear to a new user.
6. **Cover every state.** Empty (explain + next action), loading (say what is
   happening), success (say what to do next), error (what happened, what is
   safe, how to retry), AI-offline (preview, no charge).
7. **Verify as a first-time user.** Open the app with empty storage on a phone
   width and a laptop width. Can you reach a first result without reading docs?

## Checklist before shipping UX

- [ ] Names its journey step and is in the PRODUCT.md feature map
- [ ] Exactly one primary action per view
- [ ] Jargon explained in place; labels are verbs ("Render plate"), not nouns
- [ ] Empty / loading / error / AI-offline states exist and read well
- [ ] Credits and refunds stated; fallbacks never called "live"
- [ ] 390px wide: no horizontal scroll; dark and light both readable
- [ ] Nothing removed; advanced tools reachable but not first

## Anti-patterns

- Dumping every control on first view; hiding the one thing the user must do.
- Tutorials that are static text instead of state-aware guidance.
- Success messages that hide that a fallback was used.
- Two competing primary buttons; "Submit/OK" labels; dead-end empty states.
