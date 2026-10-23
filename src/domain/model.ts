export type ArtifactKind =
  "Resource" | "Data type" | "Concept" | "Implementation guide";
export type ElementDefinition = {
  id: string;
  type: string;
  cardinality: string;
  description: string;
  children?: ElementDefinition[];
};
export type Artifact = {
  id: string;
  name: string;
  kind: ArtifactKind;
  summary: string;
  description: string;
  source: string;
  canonical?: string;
  elements?: ElementDefinition[];
  example?: object;
};
export type Draft = {
  choice: string;
  reason: string;
  evidence: string[];
  reflection: string;
  hints: number;
  submitted: boolean;
};
export type ResearchState = {
  artifact: string;
  mode: string;
  query: string;
  kind: string;
  tab: string;
  element: string;
};
export type SavedState = {
  research: ResearchState;
  schema: 1;
  lessonComplete: boolean;
  exerciseComplete: boolean;
  activeTask: boolean;
  draft: Draft;
};
export const freshState: SavedState = {
  research: {
    artifact: "",
    mode: "explore",
    query: "",
    kind: "All",
    tab: "Overview",
    element: "",
  },
  schema: 1,
  lessonComplete: false,
  exerciseComplete: false,
  activeTask: false,
  draft: {
    choice: "",
    reason: "",
    evidence: [],
    reflection: "",
    hints: 0,
    submitted: false,
  },
};
export function assess(draft: Draft) {
  return (
    draft.choice === "profile" &&
    draft.reason === "constraints" &&
    draft.evidence.includes("profile-definition")
  );
}
export const STORAGE_KEY = "fhir-atlas:prototype:v1";
export function readState(storage: Pick<Storage, "getItem">): SavedState {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
    if (
      value?.schema !== 1 ||
      typeof value.lessonComplete !== "boolean" ||
      typeof value.exerciseComplete !== "boolean" ||
      typeof value.activeTask !== "boolean"
    )
      return structuredClone(freshState);
    const d = value.draft;
    if (
      !d ||
      typeof d.choice !== "string" ||
      typeof d.reason !== "string" ||
      typeof d.reflection !== "string" ||
      !Array.isArray(d.evidence) ||
      !d.evidence.every((x: unknown) => typeof x === "string") ||
      !Number.isInteger(d.hints) ||
      d.hints < 0 ||
      d.hints > 3 ||
      typeof d.submitted !== "boolean"
    )
      return structuredClone(freshState);
    if (
      !value.research ||
      !["artifact", "mode", "query", "kind", "tab", "element"].every(
        (k) => typeof value.research[k] === "string",
      )
    )
      value.research = structuredClone(freshState.research);
    return value;
  } catch {
    return structuredClone(freshState);
  }
}
