import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Compass,
  Layers,
  Network,
  Play,
  Search,
  Target,
} from "lucide-react";
import { Eyebrow, IconBox, NextLink } from "../components/ui";
import { useAtlas } from "../app/state";
function AtlasIllustration() {
  return (
    <div
      className="atlas-illustration"
      aria-label="Conceptual illustration connecting Patient, Observation, a profile and an implementation guide"
      role="img"
    >
      <svg viewBox="0 0 620 430" className="atlas-lines" aria-hidden="true">
        <defs>
          <pattern
            id="dots"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#b4c7bf" opacity=".5" />
          </pattern>
          <radialGradient id="glow">
            <stop stopColor="#d6e8d8" stopOpacity=".8" />
            <stop offset="1" stopColor="#f5f7ef" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="620" height="430" fill="url(#dots)" />
        <ellipse cx="310" cy="220" rx="275" ry="195" fill="url(#glow)" />
        <g fill="none" stroke="#c5d4c5" strokeWidth="1">
          <ellipse cx="310" cy="220" rx="95" ry="95" />
          <ellipse cx="310" cy="220" rx="155" ry="155" />
          <ellipse
            cx="310"
            cy="220"
            rx="220"
            ry="205"
            transform="rotate(-18 310 220)"
          />
        </g>
        <g fill="none" stroke="#7eaa99" strokeDasharray="4 5">
          <path d="M310 220 L136 116 M310 220 L479 110 M310 220 L136 333 M310 220 L484 333" />
        </g>
        <g fill="#4d8a73">
          <circle cx="217" cy="202" r="4" />
          <circle cx="380" cy="358" r="4" />
          <circle cx="464" cy="199" r="4" />
        </g>
      </svg>
      <div className="map-coord">
        FHIR R4 · 4.0.1 <span>CONCEPT OVERVIEW</span>
      </div>
      <div className="map-node center">
        <span className="map-node-icon">
          <Compass size={31} />
        </span>
        <strong>FHIR</strong>
        <small>Base specification</small>
      </div>
      <div className="map-node patient">
        <span className="node-overline">RESOURCE</span>
        <strong>Patient</strong>
        <span className="node-code">resourceType: Patient</span>
      </div>
      <div className="map-node observation">
        <span className="node-overline">RESOURCE</span>
        <strong>Observation</strong>
        <span className="mini-node-dot" /> <small>Connected by reference</small>
      </div>
      <div className="map-node profile">
        <span className="node-overline">CONFORMANCE</span>
        <strong>
          <Layers size={17} /> Profile
        </strong>
        <small>Rules for a context</small>
      </div>
      <div className="map-node guide">
        <span className="node-overline">IMPLEMENTATION</span>
        <strong>
          <BookOpen size={17} /> Guide
        </strong>
        <small>Related implementation artifacts</small>
      </div>
      <span className="map-label">SIMPLIFIED CONCEPTUAL MODEL</span>
    </div>
  );
}
export function Home() {
  const navigate = useNavigate();
  const { saved } = useAtlas();
  return (
    <div className="page home-page">
      <div className="home-intro">
        <Eyebrow>
          <span className="eyebrow-line" />
          LEARNING & REFERENCE
        </Eyebrow>
        <span className="edition">
          R4 EDITION <span>01 /</span>
        </span>
      </div>
      <section className="home-hero">
        <div className="hero-copy">
          <h1>
            FHIR learning
            <br />
            and <span>reference</span>
          </h1>
          <p>Lessons, resource definitions, and exercises for FHIR R4.</p>
          <div className="hero-actions">
            <NextLink to="/learn">Start learning</NextLink>
            <Link className="subtle-link" to="/explore">
              Explore the standard <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <AtlasIllustration />
      </section>
      <form
        className="home-search"
        action="#/explore"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          navigate(
            `/explore?q=${encodeURIComponent(String(data.get("q") || ""))}`,
          );
        }}
      >
        <Search size={21} />
        <label className="sr-only" htmlFor="home-search">
          Search the atlas
        </label>
        <input
          name="q"
          id="home-search"
          placeholder="Search resources, concepts, or canonical identifiers"
        />
        <span>Search the atlas</span>
        <button aria-label="Submit search">
          <ArrowRight size={20} />
        </button>
      </form>
      <section className="entry-paths" aria-label="Ways to explore">
        <Link to="/learn">
          <span className="entry-number">01</span>
          <IconBox icon={BookOpen} />
          <h2>Learning modules</h2>
          <p>Lessons on FHIR concepts and implementation requirements.</p>
          <span className="entry-cta">
            View modules <ArrowUpRight size={16} />
          </span>
        </Link>
        <Link to="/explore">
          <span className="entry-number">02</span>
          <IconBox icon={Compass} tone="blue" />
          <h2>Reference explorer</h2>
          <p>Browse resource structures, datatypes, and related definitions.</p>
          <span className="entry-cta">
            Open the explorer <ArrowUpRight size={16} />
          </span>
        </Link>
        <Link to="/workspace">
          <span className="entry-number">03</span>
          <IconBox icon={Target} tone="amber" />
          <h2>Practice tasks</h2>
          <p>Use reference material to answer implementation questions.</p>
          <span className="entry-cta">
            Open practice task <ArrowUpRight size={16} />
          </span>
        </Link>
      </section>
      <section className="home-bottom">
        <div className="continue-panel">
          <div className="section-label">
            <span>
              {saved.lessonComplete ? "CONTINUE LEARNING" : "AVAILABLE LESSON"}
            </span>
            <span>GUIDED LEARNING</span>
          </div>
          <div className="continue-content">
            <div className="lesson-art">
              <Layers size={30} />
              <span>BASE → PROFILE → IG</span>
            </div>
            <div>
              <span className="tiny-label">PROFILES & CONFORMANCE</span>
              <h3>Resources, profiles, and implementation guides</h3>
              <p>Understand resources, profiles, and implementation guides.</p>
              <div className="lesson-meta">
                <Clock3 size={13} /> 8 min <span>·</span>
                {saved.lessonComplete ? (
                  <>
                    <CheckCircle2 size={13} />
                    Lesson read
                  </>
                ) : (
                  <>Concept lesson + practical task</>
                )}
              </div>
            </div>
            <Link
              className="circle-button"
              to="/lesson/resource-profile-ig"
              aria-label="Open resource, profile and IG lesson"
            >
              <Play size={17} />
            </Link>
          </div>
        </div>
        <Link className="connections-panel" to="/relationships">
          <Network size={27} />
          <h3>Resource relationships</h3>
          <p>Inspect reference targets and profile dependencies.</p>
          <ArrowUpRight size={20} />
        </Link>
      </section>
    </div>
  );
}
