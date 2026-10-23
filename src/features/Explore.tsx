import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Copy,
  FileCode2,
  Info,
  Layers,
  ListFilter,
  Network,
  Search,
} from "lucide-react";
import { artifacts, searchArtifacts } from "../fixtures/catalog";
import type { ElementDefinition } from "../domain/model";
import {
  Badge,
  Eyebrow,
  FixtureNotice,
  PageHeading,
  SourceLink,
} from "../components/ui";
import { useAtlas } from "../app/state";
export const kinds = [
  "All",
  "Resource",
  "Data type",
  "Concept",
  "Implementation guide",
];
export function ArtifactBrowser({
  query,
  onQuery,
  kind,
  onKind,
  onOpen,
}: {
  query: string;
  onQuery: (q: string) => void;
  kind: string;
  onKind: (k: string) => void;
  onOpen: (id: string) => void;
}) {
  const results = searchArtifacts(query, kind);
  return (
    <>
      <div className="explore-search">
        <Search size={19} />
        <label className="sr-only" htmlFor="artifact-query">
          Search prototype artifacts
        </label>
        <input
          id="artifact-query"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search a resource, concept, or canonical URL…"
        />
        <ListFilter size={17} />
      </div>
      <div className="filter-pills" aria-label="Artifact type filter">
        {kinds.map((k) => (
          <button
            key={k}
            className={kind === k ? "active" : ""}
            aria-pressed={kind === k}
            onClick={() => onKind(k)}
          >
            {k === "All" ? "All artifacts" : k}
          </button>
        ))}
      </div>
      <div className="catalog-heading">
        <span>{results.length} SAMPLE ARTIFACTS</span>
        <span>FHIR R4 · 4.0.1</span>
      </div>
      <div className="artifact-grid">
        {results.map((a) => (
          <button
            key={a.id}
            onClick={() => onOpen(a.id)}
            className="artifact-card"
          >
            <span
              className={`artifact-type-icon ${a.kind === "Concept" ? "violet" : a.kind === "Resource" ? "blue" : ""}`}
            >
              {a.kind === "Concept" ? (
                <Layers size={24} />
              ) : a.kind === "Resource" ? (
                <Braces size={24} />
              ) : (
                <FileCode2 size={24} />
              )}
            </span>
            <Badge>{a.kind}</Badge>
            <h2>{a.name}</h2>
            <p>{a.summary}</p>
            <span className="artifact-card-foot">
              {a.id === "DKCore" ? "Metadata preview" : "Prototype fixture"}
              <ArrowUpRightIcon />
            </span>
          </button>
        ))}
      </div>
      {!results.length && (
        <div className="empty-state">
          <Search size={30} />
          <h2>No matches in this sample corpus.</h2>
          <p>Try a broader term, or clear the filters.</p>
          <button
            className="button secondary"
            onClick={() => {
              onQuery("");
              onKind("All");
            }}
          >
            Clear search and filters
          </button>
        </div>
      )}
    </>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={17} className="diagonal-arrow" />;
}
export function Explore() {
  const { artifactId } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const kind = params.get("kind") || "All";
  function change(key: string, value: string) {
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }
  return (
    <div className="page explore-page">
      {params.get("from") === "lesson" && (
        <Link className="return-strip" to="/lesson/resource-profile-ig">
          <ArrowLeft size={15} />
          Return to lesson · Resources, profiles, and implementation guides
        </Link>
      )}
      {artifactId ? (
        <ArtifactDetail
          key={artifactId}
          id={artifactId}
          tab={params.get("tab") || "Overview"}
          elementId={params.get("element") || ""}
          onTab={(tab) => change("tab", tab)}
          onElement={(id) => change("element", id)}
        />
      ) : (
        <>
          <PageHeading
            eyebrow="EXPLORE / THE REFERENCE ATLAS"
            title="Reference explorer"
            description="Search resources, datatypes, and explanatory concepts."
          />
          <FixtureNotice />
          <ArtifactBrowser
            query={query}
            onQuery={(q) => change("q", q)}
            kind={kind}
            onKind={(k) => change("kind", k)}
            onOpen={(id) => {
              navigate(`/explore/${id}?${params.toString()}`);
            }}
          />
        </>
      )}
    </div>
  );
}
export function ArtifactDetail({
  id,
  tab: externalTab,
  elementId: externalElement,
  onTab,
  onElement,
  onOpen,
  embedded = false,
}: {
  id: string;
  tab?: string;
  elementId?: string;
  onTab?: (tab: string) => void;
  onElement?: (id: string) => void;
  onOpen?: (id: string) => void;
  embedded?: boolean;
}) {
  const { saved, setSaved } = useAtlas();
  const artifact = artifacts.find((a) => a.id === id);
  const [localTab, setLocalTab] = useState("Overview");
  const [localElement, setLocalElement] = useState("");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(["Patient.name"]);
  const requestedTab = externalTab || localTab;
  const selectTab = onTab || setLocalTab;
  const elementId = externalElement || localElement;
  const selectElement = onElement || setLocalElement;
  if (!artifact)
    return (
      <div className="empty-state">
        <Compass size={30} />
        <h2>Artifact not in this prototype.</h2>
        <Link className="button secondary" to="/explore">
          Browse the sample corpus
        </Link>
      </div>
    );
  const flat =
    artifact.elements?.flatMap((e) => [e, ...(e.children || [])]) || [];
  const selected = flat.find((e) => e.id === elementId) || flat[0];
  function evidence() {
    setSaved((s) => ({
      ...s,
      activeTask: true,
      draft: {
        ...s.draft,
        evidence: [...new Set([...s.draft.evidence, "profile-definition"])],
      },
    }));
  }
  function artifactLink(target: string, label: string) {
    return onOpen ? (
      <button className="text-link" onClick={() => onOpen(target)}>
        {label}
        <ArrowRight size={14} />
      </button>
    ) : (
      <Link className="text-link" to={`/explore/${target}`}>
        {label}
        <ArrowRight size={14} />
      </Link>
    );
  }
  const ArtifactHeading = embedded ? "h2" : "h1";
  const tabs = artifact.elements
    ? ["Overview", "Structure", "Example", "Base & profile"]
    : ["Overview"];
  const tab = tabs.includes(requestedTab) ? requestedTab : "Overview";
  return (
    <div className={`artifact-detail ${embedded ? "embedded" : ""}`}>
      <div className="artifact-breadcrumb">
        {onOpen ? (
          <button onClick={() => onOpen("")}>
            <ArrowLeft size={13} />
            All artifacts
          </button>
        ) : (
          <Link to="/explore">
            <ArrowLeft size={13} />
            All artifacts
          </Link>
        )}
        <ChevronRight size={12} />
        {artifact.kind}
        <ChevronRight size={12} />
        {artifact.name}
      </div>
      <div className="artifact-title">
        <span className="artifact-title-icon">
          <Braces size={26} />
        </span>
        <div>
          <div className="artifact-title-line">
            <ArtifactHeading>{artifact.name}</ArtifactHeading>
            <Badge tone={artifact.kind === "Resource" ? "blue" : "violet"}>
              {artifact.kind}
            </Badge>
          </div>
          <p>{artifact.summary}</p>
        </div>
      </div>
      <FixtureNotice />
      <div
        className="artifact-tabs"
        role="tablist"
        aria-label="Artifact sections"
      >
        {tabs.map((t) => (
          <button
            id={`tab-${t.replaceAll(" ", "-")}`}
            role="tab"
            aria-selected={tab === t}
            aria-controls="artifact-panel"
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => selectTab(t)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const index =
                  (tabs.indexOf(t) +
                    (e.key === "ArrowRight" ? 1 : -1) +
                    tabs.length) %
                  tabs.length;
                selectTab(tabs[index]);
                document
                  .getElementById(`tab-${tabs[index].replaceAll(" ", "-")}`)
                  ?.focus();
              }
            }}
            tabIndex={tab === t ? 0 : -1}
          >
            {t}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="artifact-panel"
        aria-labelledby={`tab-${tab.replaceAll(" ", "-")}`}
      >
        {tab === "Overview" && (
          <div className="artifact-overview">
            <section>
              <Eyebrow>
                {artifact.kind === "Concept"
                  ? "UNDERSTAND THE CONCEPT"
                  : "AT A GLANCE"}
              </Eyebrow>
              <h2>
                {artifact.id === "DKCore"
                  ? "DK Core package status"
                  : artifact.summary}
              </h2>
              <p>{artifact.description}</p>
              {id === "profile" && (
                <div className="evidence-block">
                  <Layers size={22} />
                  <div>
                    <h3>A profile is represented by a StructureDefinition.</h3>
                    <p>
                      Follow its constraints and base definition to investigate
                      how the intended use relates to the shared model.
                    </p>
                    <button className="button secondary" onClick={evidence}>
                      {saved.draft.evidence.includes("profile-definition") ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}{" "}
                      {saved.draft.evidence.includes("profile-definition")
                        ? "Evidence saved to task"
                        : "Save as task evidence"}
                    </button>
                  </div>
                </div>
              )}
              {id === "DKCore" && (
                <div className="teaching-callout">
                  <Info size={20} />
                  <p>
                    No package version or constraints are claimed here. The
                    compatible DK Core package will be verified before real-data
                    integration.
                  </p>
                </div>
              )}
              <div className="related-links">
                <h3>Related artifacts</h3>
                {id !== "Patient" &&
                  artifactLink("Patient", "Inspect the base Patient resource")}
                {id !== "profile" &&
                  artifactLink("profile", "Understand the role of a profile")}
                {id !== "ig" &&
                  artifactLink("ig", "Understand implementation guides")}
                {!embedded && (
                  <Link className="text-link" to="/relationships">
                    <Network size={14} />
                    View relationships <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </section>
            <aside className="provenance-panel">
              <Eyebrow>SOURCE & CONTEXT</Eyebrow>
              <dl>
                <dt>Dataset</dt>
                <dd>Hand-curated prototype fixture</dd>
                <dt>FHIR baseline</dt>
                <dd>R4 · 4.0.1</dd>
                <dt>Package ingestion</dt>
                <dd>Not implemented</dd>
                <dt>Scope</dt>
                <dd>Limited teaching sample</dd>
              </dl>
              {artifact.canonical && (
                <>
                  <span className="tiny-label">CANONICAL IDENTIFIER</span>
                  <p className="canonical">{artifact.canonical}</p>
                  <button
                    className="text-link"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          artifact.canonical!,
                        );
                        setCopied(true);
                      } catch {
                        setCopied(false);
                      }
                    }}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}{" "}
                    {copied ? "Copied" : "Copy identifier"}
                  </button>
                </>
              )}
              <SourceLink
                href={artifact.source}
                label={
                  id === "DKCore"
                    ? "Visit DK Core"
                    : "Open authoritative source"
                }
              />
              <p className="provenance-note">
                Teaching summaries are simplified. The linked source is
                authoritative; this fixture is not a complete definition.
              </p>
            </aside>
          </div>
        )}
        {tab === "Structure" && (
          <div className="structure-layout">
            <div className="definition-table-wrap">
              <div className="structure-caption">
                <Braces size={15} />
                {artifact.name}
                <span>Selected elements only</span>
              </div>
              <table className="definition-table">
                <thead>
                  <tr>
                    <th scope="col">Element</th>
                    <th scope="col">Type</th>
                    <th scope="col">Card.</th>
                  </tr>
                </thead>
                <tbody>
                  {artifact.elements?.map((e) => (
                    <ElementRows
                      key={e.id}
                      element={e}
                      selected={selected?.id || ""}
                      onSelect={selectElement}
                      expanded={expanded.includes(e.id)}
                      onExpand={() =>
                        setExpanded((s) =>
                          s.includes(e.id)
                            ? s.filter((x) => x !== e.id)
                            : [...s, e.id],
                        )
                      }
                    />
                  ))}
                </tbody>
              </table>
              <p className="table-note">
                R4 teaching subset · inherited fields and some elements omitted.
                <br />
                Nested name fields use the HumanName datatype structure.
              </p>
            </div>
            {selected && (
              <aside className="element-inspector">
                <Eyebrow>ELEMENT INSPECTOR</Eyebrow>
                <h2>{selected.id}</h2>
                <div className="inspector-badges">
                  <Badge tone="blue">{selected.type}</Badge>
                  <Badge>{selected.cardinality}</Badge>
                </div>
                <p>{selected.description}</p>
                <dl>
                  <dt>Requirement origin</dt>
                  <dd>FHIR R4 base definition</dd>
                  <dt>DK Core changes</dt>
                  <dd>Not loaded</dd>
                </dl>
                {selected.type === "HumanName" &&
                  artifactLink("HumanName", "Explore HumanName")}
                <SourceLink
                  href={
                    artifact.source +
                    (artifact.source.includes("#") ? "" : `#${selected.id}`)
                  }
                  label="Inspect the source definition"
                />
              </aside>
            )}
          </div>
        )}
        {tab === "Example" && (
          <div className="example-panel">
            <div className="code-heading">
              <span>
                <FileCode2 size={16} /> {artifact.name.toLowerCase()}
                -example.json
              </span>
              <Badge>Synthetic</Badge>
            </div>
            <pre>
              <code>
                {JSON.stringify(
                  artifact.example || { note: "No example in this fixture" },
                  null,
                  2,
                )}
              </code>
            </pre>
            <div className="example-caption">
              <Info size={16} />
              <p>
                A minimal fictional teaching example. No claim of DK Core
                conformance or full validation is made.
              </p>
            </div>
          </div>
        )}
        {tab === "Base & profile" && (
          <div className="comparison-panel">
            <Eyebrow>SEPARATE THE SHARED MODEL FROM ITS CONSTRAINTS</Eyebrow>
            <h2>Base definition and derived profile</h2>
            <div className="comparison-columns">
              <div>
                <Badge tone="blue">FHIR base</Badge>
                <h3>{artifact.name}</h3>
                <p>The shared resource or datatype definition.</p>
                <span className="tiny-label">SOURCE: FHIR R4</span>
              </div>
              <ArrowRight size={24} />
              <div>
                <Badge tone="violet">Derived profile</Badge>
                <h3>A context-specific agreement</h3>
                <p>
                  Additional constraints are inspected against the base
                  definition.
                </p>
                <span className="tiny-label">CONCEPTUAL ILLUSTRATION</span>
              </div>
            </div>
            <div className="teaching-callout">
              <Info size={20} />
              <p>
                Actual DK Core differences are not available in this prototype.
                A real comparison will use verified package definitions and
                inheritance semantics.
              </p>
            </div>
            {artifactLink("profile", "Read about resource profiles")}
          </div>
        )}
      </div>
    </div>
  );
}
function ElementRows({
  element: e,
  selected,
  onSelect,
  expanded,
  onExpand,
}: {
  element: ElementDefinition;
  selected: string;
  onSelect: (id: string) => void;
  expanded: boolean;
  onExpand: () => void;
}) {
  return (
    <>
      <tr className={selected === e.id ? "selected" : ""}>
        <td>
          <div className="element-cell">
            {e.children ? (
              <button
                className="tree-toggle"
                aria-label={`${expanded ? "Collapse" : "Expand"} ${e.id}`}
                aria-expanded={expanded}
                onClick={onExpand}
              >
                {expanded ? (
                  <ChevronDown size={13} />
                ) : (
                  <ChevronRight size={13} />
                )}
              </button>
            ) : (
              <span className="tree-indent" />
            )}
            <button
              onClick={() => onSelect(e.id)}
              aria-pressed={selected === e.id}
            >
              {e.id.split(".").at(-1)}
            </button>
          </div>
        </td>
        <td>{e.type}</td>
        <td>{e.cardinality}</td>
      </tr>
      {expanded &&
        e.children?.map((child) => (
          <tr
            className={selected === child.id ? "selected" : ""}
            key={child.id}
          >
            <td>
              <button
                className="child-element"
                onClick={() => onSelect(child.id)}
                aria-pressed={selected === child.id}
              >
                <span aria-hidden="true">↳</span>
                {child.id.split(".").at(-1)}
              </button>
            </td>
            <td>{child.type}</td>
            <td>{child.cardinality}</td>
          </tr>
        ))}
    </>
  );
}
