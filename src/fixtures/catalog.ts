import type { Artifact } from "../domain/model";
export const sources = {
  patient: "https://hl7.org/fhir/R4/patient.html",
  observation: "https://hl7.org/fhir/R4/observation.html",
  profiling: "https://hl7.org/fhir/R4/profiling.html",
  types: "https://hl7.org/fhir/R4/datatypes.html",
};
export const artifacts: Artifact[] = [
  {
    id: "Patient",
    name: "Patient",
    kind: "Resource",
    summary: "Patient identity and administrative information.",
    description:
      "Patient represents identity and administrative context. Clinical findings are modeled using other resources, which can reference the patient.",
    source: sources.patient,
    canonical: "http://hl7.org/fhir/StructureDefinition/Patient",
    elements: [
      {
        id: "Patient.identifier",
        type: "Identifier",
        cardinality: "0..*",
        description:
          "Identifiers used to recognize a patient in a particular context.",
      },
      {
        id: "Patient.active",
        type: "boolean",
        cardinality: "0..1",
        description: "Whether the patient record is active.",
      },
      {
        id: "Patient.name",
        type: "HumanName",
        cardinality: "0..*",
        description: "Names associated with this patient.",
        children: [
          {
            id: "Patient.name.use",
            type: "code",
            cardinality: "0..1",
            description: "The purpose of a particular name.",
          },
          {
            id: "Patient.name.family",
            type: "string",
            cardinality: "0..1",
            description: "The family portion of a name.",
          },
          {
            id: "Patient.name.given",
            type: "string",
            cardinality: "0..*",
            description: "Given names, in their intended order.",
          },
        ],
      },
      {
        id: "Patient.telecom",
        type: "ContactPoint",
        cardinality: "0..*",
        description: "Contact details for reaching the patient.",
      },
      {
        id: "Patient.gender",
        type: "code",
        cardinality: "0..1",
        description: "Administrative gender.",
      },
      {
        id: "Patient.birthDate",
        type: "date",
        cardinality: "0..1",
        description: "Date of birth.",
      },
      {
        id: "Patient.address",
        type: "Address",
        cardinality: "0..*",
        description: "Addresses associated with the patient.",
      },
    ],
    example: {
      resourceType: "Patient",
      id: "atlas-example",
      name: [{ use: "official", family: "Example", given: ["Alex"] }],
    },
  },
  {
    id: "Observation",
    name: "Observation",
    kind: "Resource",
    summary: "Clinical measurements and assertions.",
    description:
      "An observation records a measurement or assertion about a subject. References can connect it to a patient and the encounter in which it was made.",
    source: sources.observation,
    canonical: "http://hl7.org/fhir/StructureDefinition/Observation",
    elements: [
      {
        id: "Observation.status",
        type: "code",
        cardinality: "1..1",
        description: "The workflow state of the observation.",
      },
      {
        id: "Observation.code",
        type: "CodeableConcept",
        cardinality: "1..1",
        description: "What was observed or measured.",
      },
      {
        id: "Observation.subject",
        type: "Reference",
        cardinality: "0..1",
        description:
          "The subject of the observation; Patient is one possible target.",
      },
      {
        id: "Observation.encounter",
        type: "Reference",
        cardinality: "0..1",
        description: "The encounter associated with this observation.",
      },
    ],
    example: {
      resourceType: "Observation",
      id: "atlas-observation",
      status: "final",
      code: { text: "Synthetic teaching observation" },
      subject: { reference: "Patient/atlas-example" },
    },
  },
  {
    id: "HumanName",
    name: "HumanName",
    kind: "Data type",
    summary: "Structured representation of a name.",
    description:
      "A reusable complex datatype for names. Explore how Patient.name uses this structure.",
    source: sources.types + "#HumanName",
    elements: [
      {
        id: "HumanName.use",
        type: "code",
        cardinality: "0..1",
        description: "The purpose of the name.",
      },
      {
        id: "HumanName.family",
        type: "string",
        cardinality: "0..1",
        description: "Family name.",
      },
      {
        id: "HumanName.given",
        type: "string",
        cardinality: "0..*",
        description: "Given names.",
      },
    ],
  },
  {
    id: "profile",
    name: "Resource profiles",
    kind: "Concept",
    summary: "Resource constraints for a particular use case.",
    description:
      "A profile expresses constraints on a resource through a StructureDefinition. Investigate both the base definition and the applicable profile when implementing an exchange.",
    source: sources.profiling,
  },
  {
    id: "ig",
    name: "Implementation guides",
    kind: "Concept",
    summary: "Implementation requirements and related artifacts.",
    description:
      "An implementation guide brings related implementation rules and artifacts together. Use it to discover the applicable profiles, dependencies, and guidance.",
    source: sources.profiling,
  },
  {
    id: "DKCore",
    name: "DK Core",
    kind: "Implementation guide",
    summary: "The Danish implementation-guide context.",
    description:
      "DK Core is the selected guide for the future reference slice. Package release, dependencies, and profile details will be verified in WP04. This prototype does not include DK Core constraints.",
    source: "https://hl7.dk/fhir/core/",
  },
  {
    id: "references",
    name: "Resource references",
    kind: "Concept",
    summary: "References between resources.",
    description:
      "A reference links one resource to another. A diagram of allowed targets describes possibilities, rather than proving which references exist in a particular instance.",
    source: "https://hl7.org/fhir/R4/references.html",
  },
];
export function searchArtifacts(query: string, kind = "All") {
  const q = query.trim().toLowerCase();
  return artifacts.filter(
    (a) =>
      (kind === "All" || a.kind === kind) &&
      `${a.name} ${a.summary} ${a.kind} ${a.canonical || ""}`
        .toLowerCase()
        .includes(q),
  );
}
export const modules = [
  [
    "FHIR fundamentals",
    "FHIR purpose, versions, and interoperability concepts.",
    "Compass",
  ],
  [
    "Resources & data types",
    "Resource anatomy and primitive and complex datatypes.",
    "Blocks",
  ],
  [
    "Profiles & conformance",
    "Resource constraints, profiles, and implementation guides.",
    "Layers",
  ],
  [
    "Implementation guides",
    "Guide artifacts, dependencies, and implementation requirements.",
    "BookOpen",
  ],
  ["Terminology", "Understand codes, meaning, and allowed values.", "Tags"],
  [
    "APIs & exchange",
    "REST interactions, search, and Bundle structures.",
    "ArrowLeftRight",
  ],
  [
    "Validation & interoperability",
    "Investigate conformance and explain failures.",
    "ShieldCheck",
  ],
  [
    "Real-world development",
    "Clinical requirements, data mapping, and integration design.",
    "Code2",
  ],
];
export const hints = [
  "Separate the common FHIR foundation from rules for a particular use case.",
  "Open Resource profiles in Explore and read the Overview.",
  "In the profile overview, save the evidence about a StructureDefinition expressing constraints. Compare that role with the base resource and the IG.",
];
