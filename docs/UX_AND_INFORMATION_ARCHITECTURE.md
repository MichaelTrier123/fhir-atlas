# UX and information architecture

## Product principle
The site is neither a cloned specification website nor a generic training dashboard. Treat it as an interconnected **learning environment and technical reference** with a single consistent visual language. Showcase precise FHIR structures through purposeful motion and interactive visual explanation; remain usable for experienced developers who want a quick answer.

## Primary navigation (proposed, to confirm during WP01)
- Home — search, continue learning, shortcuts, recently viewed.
- Learn — curated paths, modules, interactive lessons, progress.
- Explore — unified search/browse spanning Concepts, Resources, Data Types, Profiles, Extensions, Terminology and Implementation Guides.
- Relationships — graph views of resource references and conceptual dependencies.
- Workspace — question/task visible while researching docs, with hints, answer form, feedback.
Keep 'Explore' and 'Learn' accessible from each other. Do not make Workspace a disconnected app.

## Six reference screens
### 1. Home (`assets/01-home.png`)
Hero/identity and universal search; three strong entry points: Learn, Explore, solve a problem; continue learning. Do not rely on a generic stock hero to convey health data engineering. Surface the configured FHIR R4 and DK Core context clearly but compactly.

### 2. Learn (`assets/02-learning-path.png`)
Curriculum overview with clear outcomes and progression; lessons can also be opened independently. Only show genuine progress saved in this browser; no pretend cloud accounts or locked modules unless pedagogically justified.

### 3. Lesson (`assets/03-lesson.png`)
Short explanations interleaved with accurate comparisons, interactive concept diagrams, source-backed examples and handoffs into Explore or Workspace. Preserve lesson location when opening a reference.

### 4. Resource/Artifact Explorer (`assets/04-resource-explorer.png`)
A high-density but approachable developer view: left facet/browse/search, main hierarchical definition table, inspector with details, source links and canonical URLs. Show type, description, cardinality, inheritance and source provenance when available. Distinguish **FHIR base** from **DK Core profile restrictions**. Support other artifact types, not only Patient etc.

### 5. Relationships (`assets/05-relationships.png`)
Pan/zoom network with graph filters, accessible node list fallback and details inspector. Distinguish resource references (`Observation.subject → Patient`) from conceptual/profile dependencies (`DK Core Patient → FHIR Patient`). Do not imply every resource node connects in every real instance.

### 6. Task Workspace (`assets/06-workspace.png`)
The learner reads a realistic integration problem while actively investigating docs. Desktop: persistent task panel + Explore/Graph context in split pane; mobile: task drawer + persistent resume affordance. The task is never lost when navigating. Progressive hints and meaningful rationale feedback; avoid multiple choice alone as the dominant mechanism.

## Two priority journeys
**Learner:** Home → Learn: Resources vs Profiles vs IGs → concise diagram → start scenario about choosing a DK Core profile → Workspace stays open → search Explore for relevant IG/profile → inspect constraints and source → return to task → choose and *justify* → receive explanation and reference → save local progression.

**Working developer:** Global search → open a specific profile → immediately identify version, IG, canonical, baseDefinition, overview, differences and related terminology → follow relationship to base resource → return to the previous place through back navigation, not lost context.

## Visual directions
- Confident editorial typography, strong hierarchy, restrained palette with purposeful colors for artifact types.
- Beautiful but honest visual explanations; high-density technical sections should remain scannable.
- Consistent components, layered inspector panels, polished hover/focus states, swift transitions, subtle motion; honor reduced motion.
- Contrast and keyboard navigation count as core quality, not polish deferred indefinitely.
- No dead controls or fake search results; mock data must be identified as prototype examples.
- Responsive: desktop first, mobile workable; diagram interactions with keyboard/list alternatives.

## Explicit anti-patterns
Do not build 6 isolated landing pages; do not paste the old HL7 hierarchy into a prettier sidebar; do not present speculative DK Core claims as fact; do not prioritize beautiful diagrams over discoverability; do not make the first experience a memorize-cardinality quiz.
