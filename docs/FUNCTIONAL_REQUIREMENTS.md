# Functional requirements and v1 boundary

Priority interpretation: P0 = first UX prototype; P1 = first real FHIR-data slice; P2 = later.

| ID | Priority | Requirement | Acceptance |
|---|---|---|---|
| UX-01 | P0 | Navigate Home, Learn, Lesson, Explore, Relationships, Workspace | All routes reachable and browser back works |
| UX-02 | P0 | Shared context across Learn and Explore | Return to task/lesson without losing place or answer state |
| UX-03 | P0 | Premium distinctive UI; responsive layouts | Review desktop and mobile screenshots against design direction |
| SEA-01 | P0 | Search prototype corpus | Working input and actual filtered matches, no fake response |
| LEA-01 | P0 | Lesson with visual concept model | Learner can inspect concept and initiate context-linked exercise |
| WRK-01 | P0 | Keep task visible during research | Usable desktop split view and mobile task drawer |
| WRK-02 | P0 | Hints, answer, reasoned feedback | Input/feedback works and state survives route changes |
| GRP-01 | P0 | Interactive graph based on prototype fixtures | Node selection opens real detail panel; zoom/pan or alternate list |
| REF-01 | P1 | Ingest pinned FHIR R4 official metadata | Canonical/version provenance, tests on real sample definitions |
| REF-02 | P1 | Pin DK Core package compatible with R4 | Dependencies confirmed; any unsupported claims absent |
| REF-03 | P1 | Explain base vs profile | Show accurate restrictions/inheritance; don't guess snapshots |
| REF-04 | P1 | Unified artifact browsing and source references | Search for resources and profile/IG/terminology/concept entries |
| EDU-01 | P1 | First real lesson + research task | Question tests understanding and requires actual referenced lookup |
| DEP-01 | P0/P1 | GitHub Pages deployment | Works with repo subpath, refresh, routes and assets |
| PER-01 | P0 | Local session/progress | Browser storage only; no sign-in promise |
| ACC-01 | P0 | Accessibility baseline | Keyboard focus, graph fallback, responsive readable content, reduced motion |

## v1 explicitly excluded
AI, user accounts, hosted database, runtime server, live clinical data, real patient information, full generic IG importing, multiple active FHIR versions, advanced universal FHIR validator, authoring/publishing packages, arbitrary external API proxy, full terminology expansion service.

## Important distinction
The platform is primarily *education and reference*, not a compliant FHIR server or validator. Avoid implying that a simplified UI example satisfies a profile unless it actually does.
