import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  MarkerType,
  type NodeProps,
  type Node,
  type Edge,
} from "@xyflow/react";
import {
  ArrowRight,
  BookOpen,
  Braces,
  ChevronRight,
  Layers,
  List,
  Network,
  UserRound,
} from "lucide-react";
import {
  Badge,
  Eyebrow,
  FixtureNotice,
  PageHeading,
  SourceLink,
} from "../components/ui";
import { sources } from "../fixtures/catalog";
type GraphData = {
  label: string;
  kind: string;
  description: string;
  target?: string;
  source: string;
  tone: string;
};
type GraphNode = Node<GraphData>;
const referenceNodes: GraphNode[] = [
  {
    id: "Observation",
    position: { x: 40, y: 60 },
    data: {
      label: "Observation",
      kind: "RESOURCE",
      description:
        "An observation can identify a patient as its subject and refer to an encounter.",
      target: "Observation",
      source: sources.observation,
      tone: "amber",
    },
  },
  {
    id: "Patient",
    position: { x: 340, y: 185 },
    data: {
      label: "Patient",
      kind: "RESOURCE",
      description:
        "A possible subject of an observation. The edge shows an allowed target, not a claim about every observation instance.",
      target: "Patient",
      source: sources.patient,
      tone: "blue",
    },
  },
  {
    id: "Encounter",
    position: { x: 40, y: 315 },
    data: {
      label: "Encounter",
      kind: "RESOURCE",
      description:
        "The care interaction associated with an observation. This resource is shown as a reference target; a detailed fixture is not included.",
      source: "https://hl7.org/fhir/R4/encounter.html",
      tone: "teal",
    },
  },
];
const conceptNodes: GraphNode[] = [
  {
    id: "ig",
    position: { x: 35, y: 60 },
    data: {
      label: "Implementation guide",
      kind: "CONCEPT",
      description:
        "Organizes related implementation artifacts and guidance. This diagram is a simplified conceptual model.",
      target: "ig",
      source: sources.profiling,
      tone: "teal",
    },
  },
  {
    id: "profile",
    position: { x: 340, y: 185 },
    data: {
      label: "Resource profile",
      kind: "CONCEPT",
      description:
        "Expresses constraints on a resource using a StructureDefinition.",
      target: "profile",
      source: sources.profiling,
      tone: "violet",
    },
  },
  {
    id: "Patient",
    position: { x: 35, y: 315 },
    data: {
      label: "Base resource",
      kind: "CONCEPT",
      description:
        "The shared model on which a derived profile is based. Patient is the example used in this prototype.",
      target: "Patient",
      source: sources.patient,
      tone: "blue",
    },
  },
];
function GraphTile({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div className={`graph-tile ${data.tone} ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Left} />
      <span className="tiny-label">{data.kind}</span>
      <strong>
        {data.label === "Patient" ? (
          <UserRound size={20} />
        ) : data.kind === "RESOURCE" ? (
          <Braces size={20} />
        ) : (
          <Layers size={20} />
        )}{" "}
        {data.label}
      </strong>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
const nodeTypes = { atlas: GraphTile };
export function Relationships() {
  return (
    <div className="page relationships-page">
      <PageHeading
        eyebrow="EXPLORE / RELATIONSHIPS"
        title="Resource relationships"
        description="Inspect possible reference targets and conceptual profile dependencies."
      />
      <FixtureNotice />
      <GraphExplorer />
    </div>
  );
}
export function GraphExplorer({
  embedded = false,
  onOpen,
}: {
  embedded?: boolean;
  onOpen?: (id: string) => void;
}) {
  const [mode, setMode] = useState("references");
  const [view, setView] = useState("graph");
  const [selected, setSelected] = useState("Patient");
  const [filter, setFilter] = useState("all");
  const baseNodes = mode === "references" ? referenceNodes : conceptNodes;
  const current = baseNodes.find((n) => n.id === selected) || baseNodes[0];
  const edges = useMemo<Edge[]>(
    () =>
      mode === "references"
        ? [
            {
              id: "subject",
              source: "Observation",
              target: "Patient",
              label: "subject → Patient",
            },
            {
              id: "encounter",
              source: "Observation",
              target: "Encounter",
              label: "encounter → Encounter",
            },
          ]
        : [
            {
              id: "organizes",
              source: "ig",
              target: "profile",
              label: "organizes (conceptual)",
            },
            {
              id: "base",
              source: "profile",
              target: "Patient",
              label: "derived from (conceptual)",
            },
          ],
    [mode],
  );
  const shownEdges = edges.filter(
    (e) => mode !== "references" || filter === "all" || e.id === filter,
  );
  const shownNodes = baseNodes.filter(
    (n) =>
      filter === "all" ||
      mode !== "references" ||
      shownEdges.some((e) => e.source === n.id || e.target === n.id),
  );
  const nodes = shownNodes.map((n) => ({
    ...n,
    type: "atlas",
    selected: n.id === current.id,
    ariaLabel: `Inspect ${n.data.label}`,
  }));
  const selectedData = current.data;
  return (
    <section className={`graph-explorer ${embedded ? "embedded-graph" : ""}`}>
      <div className="graph-toolbar">
        <div className="segmented-control" aria-label="Relationship type">
          <button
            className={mode === "references" ? "active" : ""}
            aria-pressed={mode === "references"}
            onClick={() => {
              setMode("references");
              setSelected("Patient");
              setFilter("all");
            }}
          >
            Resource references
          </button>
          <button
            className={mode === "concepts" ? "active" : ""}
            aria-pressed={mode === "concepts"}
            onClick={() => {
              setMode("concepts");
              setSelected("profile");
              setFilter("all");
            }}
          >
            Concept map
          </button>
        </div>
        <div className="graph-view-controls">
          <label className="sr-only" htmlFor="edge-filter">
            Filter reference edges
          </label>
          {mode === "references" && (
            <select
              id="edge-filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setSelected(
                  e.target.value === "encounter" ? "Encounter" : "Patient",
                );
              }}
            >
              <option value="all">All references</option>
              <option value="subject">Subject only</option>
              <option value="encounter">Encounter only</option>
            </select>
          )}
          <button
            className="icon-button"
            aria-label={
              view === "graph"
                ? "Show accessible relationship list"
                : "Show graph"
            }
            onClick={() => setView((v) => (v === "graph" ? "list" : "graph"))}
          >
            {view === "graph" ? <List size={18} /> : <Network size={18} />}
          </button>
        </div>
      </div>
      <div className="graph-content">
        <div className="graph-canvas">
          <div className="graph-caption">
            <span className="status-dot" />
            {mode === "references"
              ? "POSSIBLE REFERENCE TARGETS"
              : "SIMPLIFIED CONCEPTUAL RELATIONSHIPS"}
          </div>
          {view === "graph" ? (
            <ReactFlow
              key={mode + filter}
              nodes={nodes}
              edges={shownEdges.map((e) => ({
                ...e,
                markerEnd: { type: MarkerType.ArrowClosed, color: "#7f9d95" },
                style: { stroke: "#7f9d95", strokeWidth: 1.5 },
                labelStyle: { fontSize: 11, fill: "#50635c" },
                labelBgStyle: { fill: "#f6f8f4" },
                labelBgPadding: [7, 5],
              }))}
              nodeTypes={nodeTypes}
              onNodeClick={(_, node) => setSelected(node.id)}
              onNodesChange={() => {}}
              nodesDraggable={false}
              nodesConnectable={false}
              edgesFocusable={false}
              fitView
              fitViewOptions={{ padding: 0.25 }}
              minZoom={0.4}
              maxZoom={1.6}
              proOptions={{ hideAttribution: false }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="#ced9d0"
              />
              <Controls showInteractive={false} />
            </ReactFlow>
          ) : (
            <div className="relationship-list">
              <h3>Relationships, in reading order</h3>
              {shownEdges.map((e) => (
                <button key={e.id} onClick={() => setSelected(e.target)}>
                  <span>
                    {baseNodes.find((n) => n.id === e.source)?.data.label}
                  </span>
                  <small>{e.label}</small>
                  <strong>
                    {baseNodes.find((n) => n.id === e.target)?.data.label}
                  </strong>
                  <ChevronRight size={16} />
                </button>
              ))}
              <p>Select a relationship to inspect its target.</p>
            </div>
          )}
          <div className="graph-legend">
            <span>
              <i className="legend-dot blue" />
              Resource
            </span>
            <span>
              <i className="legend-edge" />
              {mode === "references"
                ? "Allowed reference"
                : "Conceptual dependency"}
            </span>
          </div>
        </div>
        <aside className="graph-inspector" aria-live="polite">
          <Eyebrow>CONNECTION INSPECTOR</Eyebrow>
          <span className={`graph-inspector-icon ${selectedData.tone}`}>
            {mode === "references" ? (
              <Braces size={26} />
            ) : (
              <BookOpen size={26} />
            )}
          </span>
          <h2>{selectedData.label}</h2>
          <Badge>
            {mode === "references"
              ? "FHIR R4 resource"
              : "Concept illustration"}
          </Badge>
          <p>{selectedData.description}</p>
          <div className="inspector-divider" />
          <h3>Related connections</h3>
          {shownEdges
            .filter((e) => e.source === current.id || e.target === current.id)
            .map((e) => (
              <div key={e.id} className="edge-description">
                <ArrowRight size={13} />
                <span>{e.label}</span>
              </div>
            ))}
          {selectedData.target &&
            (onOpen ? (
              <button
                className="button secondary"
                onClick={() => onOpen(selectedData.target!)}
              >
                Open in Explorer <ArrowRight size={15} />
              </button>
            ) : (
              <Link
                className="button secondary"
                to={`/explore/${selectedData.target}`}
              >
                Open in Explorer <ArrowRight size={15} />
              </Link>
            ))}
          <SourceLink href={selectedData.source} label="View FHIR R4 source" />
          <p className="provenance-note">
            Prototype subset. Reference possibilities do not establish a
            business relationship or a required link in every instance.
          </p>
        </aside>
      </div>
    </section>
  );
}
