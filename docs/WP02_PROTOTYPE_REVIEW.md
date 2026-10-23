# WP02 — connected UX prototype

## Status and boundaries

Interactive prototype implemented for review. English UI; FHIR R4 4.0.1 baseline; DK Core context reserved for later verified package integration. All reference content is a labeled, hand-curated teaching subset, not a complete reference dataset. No DK Core constraints, full validator, account, AI, backend, or live clinical data are included. The original brief and design files are preserved.

## Run locally

From the project directory:

```sh
npm ci
npm run dev
```

Vite prints the local preview URL. Additional commands: `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. Generated `dist/` is static. Hash routing and a configurable `VITE_BASE_PATH` prepare for project Pages; GitHub Actions and public deployment remain WP03.

## Review the two journeys

### Developer

1. Home → search “Patient” → open Patient.
2. Open Structure, select name or a nested field, inspect the detail panel.
3. Open Example and Base & profile. The latter is explicitly conceptual, with no fabricated DK Core comparison.
4. Follow HumanName or profile links; browser Back restores URL-based detail selection.
5. Relationships → select a node → open it in Explorer. Compare resource-reference mode with the simplified concept map, then try list mode.

### Learner

1. Learn → Profiles & conformance → Resources, profiles, and implementation guides
2. Select each conceptual layer; inspect a reference, then use Return to your lesson.
3. Mark the lesson as read and open the task.
4. Keep the scenario visible while researching. On a narrow viewport, use Task / Research / Answer.
5. Open Resource profiles → Save as task evidence.
6. Choose the applicable resource profile and the reasoning that it constrains the shared resource; submit.
7. Inspect sourced feedback. Leave and return or refresh: draft, hints, evidence, progress, and research selection remain available on this browser.

## Interaction and accessibility

Global search supports Command/Ctrl+K, native modal focus containment, and Escape. Reference tabs support arrow keys. Definition rows expand independently of selection. Workspace split width has a keyboard-operable range control. Graph has pan/zoom, filtering, node inspection, and an equivalent relationship list. Reduced motion is respected. Mobile navigation and task views adapt to narrow layouts. Secondary text was darkened after visual review. Full WCAG conformance is not claimed; broader assistive-technology review remains appropriate before release.

## Verification

Build/typecheck and lint, plus targeted unit/integration tests for search, persistence recovery, structured assessment, element inspection, lesson completion, and task evidence/feedback. Browser review covers responsive rendering, graph/list view, and the connected flows. Test output is the authority for the current passing count.

## Source and content notes

The teaching fixtures link to the official FHIR R4 Patient, Observation, datatypes, reference, and profiling pages. Definitions are abbreviated and some elements omitted; examples are fictional. This is not the official package-ingestion pipeline. HL7 and FHIR attribution and redistribution terms must be finalized against the pinned packages in WP04. Fonts are self-hosted through Fontsource; inspect their included licenses in node_modules when preparing distribution notices.

## Approval gate

Review navigation, hierarchy, visual language, desktop research density, mobile task switching, and clarity of feedback. Refine WP02 from feedback before pursuing broad package ingestion. Public GitHub Pages deployment is a separate work package.

## Captured screens

Screenshots in `docs/review/`: [Home](review/home.png), [Learn](review/learn.png), [Lesson](review/lesson.png), [Explorer](review/explore.png), [Relationships](review/relationships.png), [Workspace](review/workspace.png), and [narrow Workspace](review/workspace-narrow.png).
