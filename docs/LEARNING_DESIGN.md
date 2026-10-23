# Learning design and curriculum

## Intended learner outcome
A developer can **reason about FHIR**, discover authoritative documentation, select relevant resources/profiles, understand an IG's constraints, model relationships, understand terminology, plan REST interactions, validate and test integration outcomes. Memorizing field/cardinality trivia is not a learning objective.

## Pedagogical loop
**Understand → Inspect → Apply → Explain**. A brief illustration introduces a concept; learner follows the actual spec or DK Core artifact; a realistic scenario requires synthesis; feedback cites what matters and why. Provide an escalating hint ladder, then sourced rationale.

## Curriculum outline (8 domains)
1. **FHIR Fundamentals**: interoperability; HL7 and FHIR role; JSON representations; versions; what FHIR does not guarantee.
2. **Resources & Data Types**: base definitions, primitives and complex types, Reference vs identifier, code, CodeableConcept, extensions and clinical modeling.
3. **Profiles & Conformance**: StructureDefinition; inheritance, baseDefinition, mustSupport, cardinality meaning, slicing, invariants, snapshots/differentials, when not to extend.
4. **Implementation Guides**: what an IG is; profiles/extensions/terminology/examples; canonical IDs, dependencies, package versions; locate and apply obligations in DK Core.
5. **Terminology**: CodeSystem vs ValueSet vs ConceptMap; code meaning, binding strengths; real deployment implications and terminology licensing concerns.
6. **FHIR API & Exchange**: capability statements; REST interactions, search, Bundle types, pagination, transactions, identity and references.
7. **Validation & Interoperability**: profile conformance, FHIRPath principles, diagnostic error reports, source of truth, reproducible contract tests.
8. **Real-world Integration**: integration scenario from clinical requirements through data mapping, resource/profile selection, terminologies, exchange, validation and tests; optional later SUP-to-FHIR use case.

## Exercise types
- **Concept choice + rationale**: given a cross-institutional use case, why use an IG and where do profiles fit?
- **Find evidence**: locate the correct DK Core artifact, explain where its rule comes from, provide relevant documentation path.
- **Comparison**: inspect FHIR base vs profiled structure and say what changed and its implementation impact.
- **Terminology reasoning**: given CodeSystem/ValueSet candidates, choose how to constrain a field and explain why.
- **Graph investigation**: trace how Patient, Encounter and Observation relate and explain which reference is appropriate.
- **Troubleshooting**: given a **curated** invalid example, distinguish representation, profile and terminology errors and choose a fix (do not falsely market as full validation).
- **Capstone**: identify data and workflow requirements and produce a defensible integration design with references.

## Sample first learning slice
**Topic:** Resource vs profile vs Implementation Guide (R4 + DK Core).
**Lesson goal:** explain the role of each and find where a concrete implementation obligation is specified.
**Scenario:** A team is integrating patient data in Denmark and asks which concrete specification constrains a Patient instance. Identify base resource, profile and IG in Explore; explain where the selected constraints originate. The actual question/answer must be grounded in verified DK Core package contents before release.
**Hints:** (1) Think about base vs local constraints, (2) inspect the DK Core IG and its Patient profile, (3) follow baseDefinition/canonical in the inspector.
**Assessment:** credit reasoning and successful research, not instant recall of an arbitrary cardinality.

## Content rules
- All public content in English in v1.
- Cite or link to authoritative FHIR R4/IG source whenever stating a normative rule.
- Version-label technical claims; flag simplified conceptual diagrams as such.
- Separate independently written teaching content from extracted canonical definition data.
- Learning content is authored/reviewed over time, not fabricated wholesale by a generator.
- Browser-only completion history can reset on storage deletion/device change; communicate this unobtrusively.
