# FHIR Atlas — Codex implementation plan (UX first)

## Delivery status — 23 October 2026

- WP01: approved.
- WP02: interactive prototype delivered; promotional copy replaced with descriptive English.
- WP03: complete. [Public application](https://michaeltrier123.github.io/fhir-atlas/) and [repository](https://github.com/MichaelTrier123/fhir-atlas). CI checks and the public deployment have been verified.
- WP04–WP06: not started. The application still uses labeled prototype fixtures.

## Confirmed constraints

- **FHIR baseline:** FHIR R4 / 4.0.1.
- **Initial IG:** DK Core (determine and pin a release compatible with the baseline before processing the official package).
- **Product language:** English, including curriculum and exercises.
- **Sequence:** interactive UX prototype **before** building a full package ingestion pipeline.
- **Deployment:** public static GitHub Pages site. No runtime backend, AI, authentication or hosted database.
- **Product focus:** Learn + Explore, linked through a persistent task Workspace. Conceptual understanding and documentation-navigation skills, not memorization quizzes.
- **Visual reference:** `assets/fhir-atlas-six-screens.png` (inspiration, not a pixel-perfect or factually authoritative reference).

## WP01 — UX and architecture plan (approval gate)

1. Review `PROJECT_BRIEF.md` and the mockup image.
2. Produce an information architecture, desktop/mobile navigation proposal, and two concrete user journeys: (a) independent developer reference lookup; (b) learner investigating resource vs profile vs IG while keeping an exercise open.
3. Detail reusable visual primitives (typography, color system, navigation, cards/panels, empty states, accessibility and micro-interactions) without falling back to generic dashboard templates.
4. Recommend code structure, fixture strategy, routing approach and GitHub Pages deployment strategy.
5. Summarize milestones, trade-offs and test strategy. **Request approval before substantial implementation.**

**Acceptance:** Reviewer can picture how all six screen types connect, the learner never loses context while exploring, and no backend is introduced.

## WP02 — Polished clickable UX prototype (first implementation milestone)

- Build Vite + React + TypeScript with custom design styling and reusable UI primitives.
- Implement six navigable screens: Home, Learn path, Lesson, Resource Explorer, Relationships, and Task Workspace.
- Make all key controls work (navigation, tabs, search against small fixtures, inspect graph node, open explorer element, hints, answer feedback, return to task, locally stored progress). No decorative dead buttons.
- Desktop: elegant task/explorer split pane. Mobile: coherent tab/drawer adaptation.
- Use **explicitly marked prototype fixtures**. Prefer small accurate R4 concepts and never suggest fabricated DK Core constraints are official.
- Deliver screenshots and a running preview; seek user feedback on visual polish, clarity and interaction behavior.

**Acceptance:** Looks like a premium, distinctive product; learner can go from a concept explanation to an artifact lookup and back to a reasoned answer without losing context. Accessible keyboard interaction, mobile usability and reduced-motion support.

## WP03 — GitHub Pages delivery

- Add GitHub Actions workflow and instructions to deploy static `dist/`.
- Configure Vite `base` for project Pages (`/<repo>/`) with configurable repo name.
- Choose hash routing or a verified SPA fallback; verify direct links on refresh, nested paths and assets.
- Document that no always-on compute and no cloud database are required. Work within GitHub policy/usage constraints.

**Acceptance:** Public site renders and links work at the real project Pages URL.

## WP04 — Authoritative FHIR package ingestion (after UX approval)

- Verify actual DK Core package release and FHIR R4 4.0.1 compatibility; pin dependencies/versions. Inspect copyright/attribution and terminology licenses.
- Create a reproducible build-time ingestion pipeline for `StructureDefinition`, profiles, extensions, terminology metadata and relationships. Handle `baseDefinition`, snapshots/differentials and relevant transitive dependencies correctly; if unsupported, report limitations rather than guessing.
- Produce versioned normalized static artifacts and a small searchable index with per-artifact code-splitting/lazy loading.
- Start with a deliberately limited real subset: Patient, Observation and an applicable DK Core profile. Swap fixtures out in selected views; show source, package version and canonical URL.

**Acceptance:** Reference content comes from pinned packages, comparison between base and derived profile is accurate, parser has unit/integration tests against real fixtures.

## WP05 — First authentic learning vertical slice

- Create one concise English lesson: *What are resources, profiles and Implementation Guides, and why do they exist?*
- Create one realistic problem requiring the learner to inspect the chosen IG/profile through Explore, not recite field cardinalities.
- Present progressive hints, credible source links, answer reasoning and completion state saved only in the browser.
- Hook a genuine relationship/concept graph into the same flow.

**Acceptance:** Full Learn → Explore → Workspace loop is coherent, technically sourced, and does not require a runtime backend.

## WP06 — Grow catalog and curriculum

- Expand Explore (types, relationships, constraints, terminology, search parameters, IG browsing) incrementally.
- Add modules in `PROJECT_BRIEF.md` across fundamentals, resources/datatypes, profiling, IGs, terminology, APIs, validation and real integration work.
- Introduce additional FHIR version / IG selections **only after** package compatibility and UI/data isolation are established; do not imply unsupported selections work.

## Quality gates for each work package

- `typecheck`, lint, automated tests and smoke checks as appropriate.
- Inspect UI at desktop and mobile sizes and compare against visual goals, not just build success.
- Validate substantive FHIR claims against the selected official package when replacing prototypes.
- No hidden network dependency, API key or runtime server for core features.
- Keep architectural choices and FHIR concepts understandable to the developer owner.

## Suggested initial Codex instruction

> Read `PROJECT_BRIEF.md`, `CODEX_PLAN.md`, and the six-screen image in `assets/`. Do **WP01 only** first: propose detailed information architecture, UX behavior, visual design principles, repository organization, and an incremental work plan. The product is English-first; start with FHIR R4 (4.0.1) + DK Core; UX prototype is the first implementation milestone; hosting is GitHub Pages; no backend or AI. Do not begin coding until I approve the plan. Keep exercises conceptual and research-oriented rather than testing memorization of specification details.
