import { describe, expect, it } from "vitest";
import { assess, freshState, readState } from "../src/domain/model";
import { searchArtifacts } from "../src/fixtures/catalog";
describe("prototype research and storage boundaries", () => {
  it("requires choice, reasoning, and supporting evidence", () => {
    const correct = {
      ...freshState.draft,
      choice: "profile",
      reason: "constraints",
      evidence: ["profile-definition"],
    };
    expect(assess(correct)).toBe(true);
    expect(assess({ ...correct, evidence: [] })).toBe(false);
    expect(assess({ ...correct, choice: "Patient" })).toBe(false);
    expect(assess({ ...correct, reason: "replacement" })).toBe(false);
  });
  it("recovers from unavailable or malformed storage", () => {
    expect(
      readState({
        getItem: () => {
          throw new Error("blocked");
        },
      }),
    ).toEqual(freshState);
    expect(readState({ getItem: () => "{broken" })).toEqual(freshState);
    expect(
      readState({
        getItem: () =>
          JSON.stringify({
            ...freshState,
            draft: { ...freshState.draft, evidence: 4 },
          }),
      }),
    ).toEqual(freshState);
  });
  it("round-trips a task draft and rejects incompatible schemas", () => {
    const saved = {
      ...freshState,
      activeTask: true,
      draft: {
        ...freshState.draft,
        hints: 2,
        reflection: "Inspect the profile.",
      },
    };
    expect(readState({ getItem: () => JSON.stringify(saved) })).toEqual(saved);
    expect(
      readState({ getItem: () => JSON.stringify({ ...saved, schema: 2 }) }),
    ).toEqual(freshState);
  });
  it("searches names, concepts, and canonical identifiers with type filters", () => {
    expect(searchArtifacts("  patient ")[0].id).toBe("Patient");
    expect(searchArtifacts("StructureDefinition/Patient")[0].id).toBe(
      "Patient",
    );
    expect(
      searchArtifacts("profile", "Concept").some((a) => a.id === "profile"),
    ).toBe(true);
    expect(searchArtifacts("patient", "Concept")).toEqual([]);
    expect(searchArtifacts("nothing-like-this")).toEqual([]);
  });
});
