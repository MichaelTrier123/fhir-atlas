import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Layers,
  Target,
} from "lucide-react";
import {
  Badge,
  Eyebrow,
  FixtureNotice,
  NextLink,
  PageHeading,
  SourceLink,
} from "../components/ui";
import { modules, sources } from "../fixtures/catalog";
import { useAtlas } from "../app/state";
export function Learn() {
  const { saved } = useAtlas();
  const [selected, setSelected] = useState(2);
  return (
    <div className="page">
      <PageHeading
        eyebrow="LEARN / THE DEVELOPER FOUNDATION"
        title="Learning modules"
        description="Modules covering FHIR concepts, reference material, and implementation tasks."
        action={
          <div className="progress-summary">
            <span>
              {Number(saved.lessonComplete) + Number(saved.exerciseComplete)}
              <small>/ 2</small>
            </span>
            <p>
              activities completed
              <br />
              <small>Saved on this device</small>
            </p>
          </div>
        }
      />
      <div className="learn-layout">
        <div className="module-list">
          {modules.map((m, i) => (
            <button
              key={m[0]}
              className={`module-row ${selected === i ? "selected" : ""}`}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
            >
              <span className="module-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="module-info">
                <strong>{m[0]}</strong>
                <small>{m[1]}</small>
                <span>
                  {i === 2
                    ? "1 lesson · 1 practical task"
                    : "Curriculum preview"}
                </span>
              </span>
              {i === 2 && saved.exerciseComplete ? (
                <CheckCircle2 className="teal" size={20} />
              ) : i === 2 ? (
                <Badge tone="teal">Start here</Badge>
              ) : (
                <ArrowRight size={17} />
              )}
            </button>
          ))}
        </div>
        <aside className="module-preview">
          <div className="module-preview-art">
            <Layers size={55} />
            <span>
              {String(selected + 1).padStart(2, "0")} / THE FOUNDATION
            </span>
          </div>
          <Eyebrow>MODULE {String(selected + 1).padStart(2, "0")}</Eyebrow>
          <h2>{modules[selected][0]}</h2>
          <p>{modules[selected][1]}</p>
          {selected === 2 ? (
            <>
              <h3>By the end, you can</h3>
              <ul className="outcome-list">
                <li>
                  <Check size={15} />
                  Explain resource, profile, and IG roles
                </li>
                <li>
                  <Check size={15} />
                  Find the source of an implementation rule
                </li>
                <li>
                  <Check size={15} />
                  Support a choice with evidence
                </li>
              </ul>
              <Link
                className="lesson-list-item"
                to="/lesson/resource-profile-ig"
              >
                <BookOpen size={18} />
                <span>
                  <strong>
                    Resources, profiles, and implementation guides
                  </strong>
                  <small>8-minute concept lesson</small>
                </span>
                {saved.lessonComplete ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <ArrowRight size={17} />
                )}
              </Link>
              <Link className="lesson-list-item" to="/workspace">
                <Target size={18} />
                <span>
                  <strong>Identify resource constraints</strong>
                  <small>Research-led practical task</small>
                </span>
                {saved.exerciseComplete ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <ArrowRight size={17} />
                )}
              </Link>
              <NextLink to="/lesson/resource-profile-ig">
                {saved.lessonComplete
                  ? "Revisit the lesson"
                  : "Begin this module"}
              </NextLink>
            </>
          ) : (
            <div className="planned-content">
              <Badge>Planned content</Badge>
              <p>
                This module is part of the curriculum architecture. Its lessons
                are not included in this prototype.
              </p>
              <button
                className="button secondary"
                onClick={() => setSelected(2)}
              >
                Try the available module <ArrowRight size={16} />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
const steps = [
  {
    title: "Resource",
    subtitle: "Base resource definition",
    body: "A base resource defines a common structure and terminology for implementations.",
    target: "Patient",
    color: "blue",
    icon: Compass,
  },
  {
    title: "Profile",
    subtitle: "Rules for a context",
    body: "A profile adapts that foundation to an intended use. Its constraints are represented in a StructureDefinition.",
    target: "profile",
    color: "violet",
    icon: Layers,
  },
  {
    title: "Implementation guide",
    subtitle: "The implementation context",
    body: "An IG organizes related rules and artifacts. Use it to discover the profiles and guidance for an exchange.",
    target: "ig",
    color: "teal",
    icon: BookOpen,
  },
];
export function Lesson() {
  const { saved, setSaved } = useAtlas();
  const [selected, setSelected] = useState(0);
  const item = steps[selected];
  return (
    <div className="page lesson-page">
      <Link to="/learn" className="back-link">
        <ArrowLeft size={14} />
        Learning path <span>/</span> Profiles & conformance
      </Link>
      <div className="lesson-header">
        <div>
          <Eyebrow>
            CONCEPT LESSON <span>01 / 01</span>
          </Eyebrow>
          <h1>Resources, profiles, and implementation guides</h1>
          <p>
            Compare base resource definitions, profile constraints, and
            implementation-guide requirements.
          </p>
        </div>
        <div className="lesson-duration">
          <Clock3 size={15} />8 min <span>·</span> Beginner friendly
        </div>
      </div>
      <FixtureNotice />
      <div className="lesson-layout">
        <article>
          <h2>Roles of resources, profiles, and implementation guides</h2>
          <p>
            A developer needs to understand both the common model and the
            requirements of the exchange. Select each artifact type to examine
            its role and where it belongs.
          </p>
          <div
            className="concept-diagram"
            aria-label="Explore the three conceptual layers"
          >
            {steps.map((s, i) => (
              <div className="concept-step" key={s.title}>
                <button
                  onClick={() => setSelected(i)}
                  className={`concept-tile ${s.color} ${selected === i ? "selected" : ""}`}
                  aria-pressed={selected === i}
                >
                  <s.icon size={25} />
                  <span className="tiny-label">0{i + 1}</span>
                  <strong>{s.title}</strong>
                  <small>{s.subtitle}</small>
                </button>
                {i < 2 && <ArrowRight className="concept-arrow" size={20} />}
              </div>
            ))}
          </div>
          <div className="concept-explanation" aria-live="polite">
            <span className={`concept-index ${item.color}`}>
              0{selected + 1}
            </span>
            <div>
              <h3>{item.subtitle}</h3>
              <p>{item.body}</p>
              <Link
                to={`/explore/${item.target}?from=lesson`}
                className="text-link"
              >
                Inspect {item.title.toLowerCase()} in Explore{" "}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <h2>Sources of implementation requirements</h2>
          <p>
            When an integration has specific requirements, inspect the
            applicable profile alongside the base resource. Consult the
            implementation guide for the exchange requirements.
          </p>
          <div className="teaching-callout">
            <Layers size={21} />
            <div>
              <strong>
                A profile still describes the underlying resource.
              </strong>
              <p>
                Profiles specify requirements for a particular use of the
                resource.
              </p>
            </div>
          </div>
          <SourceLink
            href={sources.profiling}
            label="Source: FHIR R4 — Profiling FHIR"
          />
          <div className="lesson-finish">
            <button
              className={`button ${saved.lessonComplete ? "secondary" : ""}`}
              onClick={() => setSaved((s) => ({ ...s, lessonComplete: true }))}
            >
              {saved.lessonComplete ? (
                <CheckCircle2 size={17} />
              ) : (
                <Check size={17} />
              )}{" "}
              {saved.lessonComplete
                ? "Lesson marked as read"
                : "Mark lesson as read"}
            </button>
            <NextLink to="/workspace">Open practice task</NextLink>
          </div>
        </article>
        <aside className="lesson-aside">
          <Eyebrow>YOUR LEARNING GOAL</Eyebrow>
          <h3>Identify the relevant artifact</h3>
          <p>
            Distinguish the base resource, a derived profile, and the
            implementation guide when investigating a requirement.
          </p>
          <div className="aside-divider" />
          <span className="tiny-label">IN THIS LESSON</span>
          <ol>
            <li>Base resource definition</li>
            <li>Rules for a context</li>
            <li>The implementation guide</li>
            <li>Identify and justify</li>
          </ol>
          <div className="aside-divider" />
          <Target size={24} />
          <h4>Related practice task</h4>
          <p>Use the explorer to support a developer decision with evidence.</p>
          <Link className="text-link" to="/workspace">
            Open task <ArrowRight size={14} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
