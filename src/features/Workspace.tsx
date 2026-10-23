import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  ExternalLink,
  Lightbulb,
  Network,
  RotateCcw,
  Target,
  X,
} from "lucide-react";
import { useAtlas } from "../app/state";
import { assess, freshState, type Draft } from "../domain/model";
import { artifacts, hints, sources } from "../fixtures/catalog";
import { ArtifactBrowser, ArtifactDetail } from "./Explore";
import { Badge, Eyebrow, SourceLink } from "../components/ui";
const GraphExplorer = lazy(() =>
  import("./Relationships").then((m) => ({ default: m.GraphExplorer })),
);
export function Workspace() {
  const { saved, setSaved } = useAtlas();
  const draft = saved.draft;
  const [params, setParams] = useSearchParams();
  const artifact = params.get("artifact") ?? saved.research.artifact;
  const researchMode = saved.research.mode;
  const query = saved.research.query;
  const kind = saved.research.kind;
  const [mobileTab, setMobileTab] = useState("task");
  const [split, setSplit] = useState(36);
  const [taskOpen, setTaskOpen] = useState(true);
  useEffect(() => {
    setSaved((s) => (s.activeTask ? s : { ...s, activeTask: true }));
  }, [setSaved]);
  function update(partial: Partial<Draft>) {
    setSaved((s) => ({
      ...s,
      draft: { ...s.draft, ...partial, submitted: false },
    }));
  }
  function setResearch(partial: Partial<typeof saved.research>) {
    setSaved((s) => ({ ...s, research: { ...s.research, ...partial } }));
  }
  function setResearchMode(mode: string) {
    setResearch({ mode });
  }
  function openArtifact(id: string) {
    setResearch({
      artifact: id,
      mode: "explore",
      tab: "Overview",
      element: "",
    });
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.set("artifact", id);
      return next;
    });
    setMobileTab("research");
  }
  const complete = assess(draft);
  return (
    <div className="page workspace-page">
      <div className="workspace-heading">
        <div>
          <Link to="/lesson/resource-profile-ig" className="back-link">
            <ArrowLeft size={13} />
            Back to lesson
          </Link>
          <h1>Practice task</h1>
          <p>
            Identify the relevant artifact and support your answer with
            reference material.
          </p>
        </div>
        <Badge tone={saved.exerciseComplete ? "teal" : "amber"}>
          {saved.exerciseComplete ? (
            <CheckCircle2 size={13} />
          ) : (
            <Target size={13} />
          )}{" "}
          {saved.exerciseComplete ? "Task completed" : "Guided practice · 01"}
        </Badge>
      </div>
      <div className="workspace-mobile-tabs" aria-label="Workspace view">
        {["task", "research", "answer"].map((t) => (
          <button
            key={t}
            aria-pressed={mobileTab === t}
            className={mobileTab === t ? "active" : ""}
            onClick={() => setMobileTab(t)}
          >
            {t === "task"
              ? "The task"
              : t === "research"
                ? "Research"
                : "Your answer"}
            {t === "answer" && draft.evidence.length > 0 && (
              <span>{draft.evidence.length}</span>
            )}
          </button>
        ))}
      </div>
      <div className="workspace-split-control">
        <span>
          <span className="status-dot" />
          TASK CONTEXT STAYS WITH YOU
        </span>
        <label>
          Adjust split{" "}
          <input
            aria-label="Task panel width"
            type="range"
            min="30"
            max="46"
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
          />
        </label>
        <span>PROTOTYPE · LOCAL PROGRESS</span>
      </div>
      <div
        className={`workspace-grid mobile-${mobileTab}`}
        style={{ "--task-width": `${split}%` } as CSSProperties}
      >
        <aside className="task-panel">
          <section className="task-scenario">
            <Eyebrow>THE SCENARIO</Eyebrow>
            <h2>
              Which artifact holds
              <br />
              the specific rules?
            </h2>
            <p>
              Your team is preparing a patient-data integration. You have the
              base Patient resource and an implementation guide for the
              exchange.
            </p>
            <p>
              You need to find where{" "}
              <strong>resource-specific constraints for that use case</strong>{" "}
              are expressed.
            </p>
            <button
              className="task-details-toggle"
              onClick={() => setTaskOpen((v) => !v)}
              aria-expanded={taskOpen}
            >
              Your investigation <ChevronDown size={14} />
            </button>
            {taskOpen && (
              <ol className="investigation-steps">
                <li>
                  <span>1</span>
                  <div>
                    <strong>Inspect the base resource</strong>
                    <button
                      className="text-link"
                      onClick={() => openArtifact("Patient")}
                    >
                      Open Patient <ArrowRight size={12} />
                    </button>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>Inspect resource-specific constraints</strong>
                    <small>
                      Compare the role of a resource, profile, and IG.
                    </small>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>Save supporting evidence</strong>
                    <small>Save a relevant explanation from Explore.</small>
                  </div>
                </li>
              </ol>
            )}
            <div className="hint-box">
              <button
                className="hint-button"
                disabled={draft.hints === 3}
                onClick={() => update({ hints: Math.min(3, draft.hints + 1) })}
              >
                <Lightbulb size={16} />
                {draft.hints === 3 ? "All hints revealed" : "Show next hint"}
                <span>{draft.hints}/3</span>
              </button>
              {hints.slice(0, draft.hints).map((hint, i) => (
                <p key={hint}>
                  <strong>Hint {i + 1}.</strong> {hint}
                </p>
              ))}
            </div>
            <p className="prototype-task-note">
              Concept exercise with R4 teaching fixtures. No DK Core-specific
              requirements are assessed.
            </p>
          </section>
          <section className="answer-panel">
            <Eyebrow>YOUR ANSWER</Eyebrow>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSaved((s) => ({
                  ...s,
                  exerciseComplete: s.exerciseComplete || assess(s.draft),
                  draft: { ...s.draft, submitted: true },
                }));
              }}
            >
              <fieldset>
                <legend>1. Which artifact would you inspect?</legend>
                {[
                  { id: "Patient", label: "The base Patient resource" },
                  { id: "profile", label: "The applicable resource profile" },
                  { id: "ig", label: "Only the IG’s introductory page" },
                ].map((o) => (
                  <label
                    key={o.id}
                    className={`answer-option ${draft.choice === o.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="artifact-choice"
                      value={o.id}
                      checked={draft.choice === o.id}
                      onChange={() => update({ choice: o.id })}
                    />
                    {o.label}
                  </label>
                ))}
              </fieldset>
              <label className="reason-label" htmlFor="reason">
                2. Why is it the right place?
              </label>
              <select
                id="reason"
                required
                value={draft.reason}
                onChange={(e) => update({ reason: e.target.value })}
              >
                <option value="">Choose your reasoning…</option>
                <option value="constraints">
                  It expresses constraints on the shared resource.
                </option>
                <option value="replacement">
                  It replaces the resource with a new resource type.
                </option>
                <option value="all">
                  The base always includes every local requirement.
                </option>
              </select>
              <div className="evidence-tray">
                <strong>3. Your supporting evidence</strong>
                {draft.evidence.length ? (
                  <div className="evidence-chip">
                    <Check size={14} />
                    <span>Profile → StructureDefinition</span>
                    <button
                      type="button"
                      aria-label="Remove saved evidence"
                      onClick={() => update({ evidence: [] })}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <p>Save evidence from the relevant concept in Explore.</p>
                )}
              </div>
              <label className="reason-label" htmlFor="reflection">
                Your reflection <span>(optional, not graded)</span>
              </label>
              <textarea
                id="reflection"
                value={draft.reflection}
                onChange={(e) => update({ reflection: e.target.value })}
                placeholder="How would you use this in your own integration?"
                rows={3}
              />
              <button
                className="button submit-answer"
                disabled={
                  !draft.choice || !draft.reason || !draft.evidence.length
                }
              >
                Check my reasoning <ArrowRight size={15} />
              </button>
            </form>
            {draft.submitted && (
              <div
                className={`answer-feedback ${complete ? "success" : "retry"}`}
                role="status"
              >
                {complete ? (
                  <CheckCircle2 size={23} />
                ) : (
                  <Lightbulb size={23} />
                )}
                <div>
                  <h3>{complete ? "Correct answer" : "Review your answer"}</h3>
                  <p>
                    {complete
                      ? "The profile expresses use-case constraints through a StructureDefinition. The base resource supplies the shared model, while the IG gives you the wider implementation context."
                      : "Check which artifact constrains the resource. It does not replace the resource type, and the base cannot express every implementation’s specific agreement."}
                  </p>
                  <SourceLink
                    href={sources.profiling}
                    label="Evidence: Profiling FHIR"
                  />
                  {complete && (
                    <Link className="text-link" to="/learn">
                      Return to your learning path <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            )}
            <button
              className="reset-task"
              onClick={() =>
                setSaved((s) => ({
                  ...s,
                  exerciseComplete: false,
                  draft: structuredClone(freshState.draft),
                }))
              }
            >
              <RotateCcw size={12} />
              Start this task again
            </button>
          </section>
        </aside>
        <section className="research-panel" aria-label="Task research">
          <div className="research-toolbar">
            <div className="segmented-control">
              <button
                className={researchMode === "explore" ? "active" : ""}
                aria-pressed={researchMode === "explore"}
                onClick={() => setResearchMode("explore")}
              >
                <Compass size={15} />
                Explore
              </button>
              <button
                className={researchMode === "graph" ? "active" : ""}
                aria-pressed={researchMode === "graph"}
                onClick={() => setResearchMode("graph")}
              >
                <Network size={15} />
                Relationships
              </button>
            </div>
            <span className="research-scope">R4 · SAMPLE CORPUS</span>
          </div>
          {researchMode === "explore" ? (
            <div className="research-body">
              {artifact ? (
                <ArtifactDetail
                  key={artifact}
                  id={artifact}
                  onOpen={openArtifact}
                  tab={saved.research.tab}
                  elementId={saved.research.element}
                  onTab={(tab) => setResearch({ tab })}
                  onElement={(element) => setResearch({ element })}
                  embedded
                />
              ) : (
                <>
                  <div className="research-welcome">
                    <BookOpen size={23} />
                    <Eyebrow>REFERENCE MATERIAL</Eyebrow>
                    <h2>Search reference material</h2>
                    <p>
                      Explore the artifacts, inspect their roles, and save
                      evidence for your answer.
                    </p>
                  </div>
                  <ArtifactBrowser
                    query={query}
                    onQuery={(query) => setResearch({ query })}
                    kind={kind}
                    onKind={(kind) => setResearch({ kind })}
                    onOpen={openArtifact}
                  />
                </>
              )}
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="empty-state">Loading relationship view…</div>
              }
            >
              <GraphExplorer embedded onOpen={openArtifact} />
            </Suspense>
          )}
          <div className="research-footer">
            <span>Task progress is saved on this device.</span>
            {artifact && (
              <Link
                to={`/explore/${artifacts.find((a) => a.id === artifact)?.id || "Patient"}`}
                aria-label="Open artifact as a full reference page"
              >
                <ExternalLink size={13} />
              </Link>
            )}
          </div>
        </section>
      </div>
      <button
        className="mobile-task-resume"
        onClick={() =>
          setMobileTab(mobileTab === "research" ? "task" : "research")
        }
      >
        {mobileTab === "research" ? "View task" : "Continue research"}
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
