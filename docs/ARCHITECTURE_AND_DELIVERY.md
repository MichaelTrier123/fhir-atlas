# Technical architecture and delivery

## Fixed constraints
Static site, GitHub Pages; English; start with **FHIR R4 4.0.1 + DK Core**; no AI and no always-on backend. Project names and full data pipelines are implementation choices, not pre-approved facts.

## Recommended implementation approach
- **Vite + React + TypeScript** with custom-tailored styles/components rather than a generic admin template.
- **React Flow** (or a documented equivalent) for interactive graph; ensure readable graph alternatives.
- Frontend domain modules: shell/navigation, lessons/tasks, search, artifact explorer, graph, progress, content provenance.
- Use typed **mock fixtures** for WP02 only; mark as sample. Keep frontend interfaces stable for subsequent data swap.
- Use browser `localStorage` or IndexedDB for learner progress; no sync across devices.
- Build-time Node.js/TypeScript import transforms pinned FHIR Core/IG package artifacts to normalized static JSON and indices.
- Load collections lazily to keep startup reasonable and index scalable; avoid bundling all ValueSet enumerations by default.

## Official data and normalization
1. Verify exact DK Core official package release and declared dependencies/FHIR version; do not assume the latest is compatible with FHIR R4 4.0.1.
2. Pin package versions and include canonical URLs/source references.
3. Read supported artifacts e.g. StructureDefinition, ValueSet, CodeSystem, ConceptMap, SearchParameter, ImplementationGuide and example resources where available.
4. Model baseDefinition and transitive dependencies. For comparing profiles, understand differentials vs effective snapshots; use a real snapshot or a correctly implemented derivation. Do not misleadingly render a differential as the complete resulting profile.
5. Output version-keyed, deterministic static artifacts and search indices; record import tool and source metadata.
6. Include a small test fixture set from the real packages and cross-check fields against authoritative source.
7. Respect terms of distribution and attribution; ensure terminology sets with restrictions are not indiscriminately redistributed.

## GitHub Pages considerations
- Pages is static hosting; CI building is not an always-on backend.
- Repo path may include `/<repository>/`; set Vite `base` accordingly.
- For browser routing, use hash routing or handle SPA fallback explicitly; test loading links after refresh.
- GitHub Actions can install dependencies, build `dist/`, test and deploy the artifact with minimum permissions.
- Never put secrets or patient-identifying health data into repository or frontend bundles.
- Avoid third-party network calls for core search, lessons, graphs and reference views.
- Free use is subject to GitHub Pages and Actions policies and quotas. No guarantee of limitless zero-cost commercial-scale hosting.

## Risks and mitigations
- **FHIR accuracy:** source metadata and verification tests; prototype fixtures labeled.
- **IG profiles complexity:** prioritize validated sample subset, report unsupported complex patterns instead of guessing.
- **Performance:** route/data lazy loading, pre-generated index, partial graph rendering and load tests.
- **UX drift:** design review after each slice against the six mockups and learner/developer journeys.
- **No server limitations:** no account sync, runtime terminology server or authenticated cross-origin APIs in v1.
- **Scope creep:** prototype first; integrate real content gradually; explicit approval gates.

## Work order
WP01 UX plan → WP02 clickable prototype → WP03 Pages deployment → WP04 real package integration → WP05 first fully grounded learning vertical slice → WP06 coverage expansion. No broad implementation during WP01.
