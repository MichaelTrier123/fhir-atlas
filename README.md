# FHIR Atlas

A static FHIR R4 learning and reference prototype. [Open FHIR Atlas](https://michaeltrier123.github.io/fhir-atlas/). The planning documents below describe the product scope; the current application uses clearly labeled fixtures and is not a complete reference dataset or course.

## Confirmed
- FHIR R4 4.0.1, starting with DK Core (exact compatible package version to verify and pin).
- English-only UI and lessons for v1.
- Static web application hosted on GitHub Pages; no runtime backend, database, AI, or login.
- UX and working clickable prototype **first**; authoritative FHIR packages integrated afterwards.
- Equal pillars Learn and Explore; task Workspace connects them. Teach development, not trivia memorization.

## Read in this order
1. `PROJECT_BRIEF.md` — product vision, non-negotiables and domain coverage.
2. `docs/UX_AND_INFORMATION_ARCHITECTURE.md` — screens, layout, navigation, journeys and interaction requirements.
3. `docs/LEARNING_DESIGN.md` — learning philosophy, curriculum, exercises, assessment.
4. `docs/FUNCTIONAL_REQUIREMENTS.md` — what must actually work and what is out of scope.
5. `docs/ARCHITECTURE_AND_DELIVERY.md` — static-first architecture, risks and GitHub Pages details.
6. `CODEX_PLAN.md` — work packages and acceptance criteria.
7. `assets/fhir-atlas-six-screens.png` — complete original concept image; `assets/01-...06-...` are **crops of this same concept**, not separately designed screens.

## What is **not** yet determined
- Exact DK Core NPM package version and dependencies (must be validated against R4).
- Final brand design tokens, typography/fonts, colors and route names; decide in WP01.
- Actual full course scripts and all question/answer banks; to be authored and reviewed incrementally.
- Repository and hosting are configured: [MichaelTrier123/fhir-atlas](https://github.com/MichaelTrier123/fhir-atlas), [public application](https://michaeltrier123.github.io/fhir-atlas/).
- Whether graph exploration initially models only resource references or also the conceptual profile/IG graph; both belong in roadmap, first slice can be focused.

## Initial Codex task
Read the files above and inspect all mockups. **Do WP01 planning only**: a detailed information architecture, two user journeys, visual system proposal, responsive workspace UX, code architecture, risks, test strategy and acceptance gates. Propose decisions where still open. Do not begin implementing until approval.

## WP02 interactive prototype

The first UX prototype is available locally. Run `npm ci` followed by `npm run dev` and open the printed URL. See [WP02 review guide](docs/WP02_PROTOTYPE_REVIEW.md) for the two review journeys, implementation boundaries, screenshots, and check commands. The prototype uses labeled fixtures; official-package ingestion remains a later work package. Public deployment is complete under WP03.

## WP03 GitHub Pages

The application is published at [michaeltrier123.github.io/fhir-atlas](https://michaeltrier123.github.io/fhir-atlas/). Checks and deployment run automatically when the default branch changes. See [GitHub Pages setup and verification](docs/GITHUB_PAGES.md). To preview the built application locally:

```sh
PAGES_BASE_PATH=/fhir-atlas/ npm run build:pages
npm run check:pages
npm run preview:pages -- --port 4173
```
