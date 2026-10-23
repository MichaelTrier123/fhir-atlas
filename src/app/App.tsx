import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Compass,
  FlaskConical,
  Home as HomeIcon,
  Menu,
  Network,
  Search,
  Target,
  X,
} from "lucide-react";
import { useAtlas } from "./state";
import { searchArtifacts } from "../fixtures/catalog";
import { Home } from "../features/Home";
import { Learn, Lesson } from "../features/Learn";
import { Explore } from "../features/Explore";
const Relationships = lazy(() =>
  import("../features/Relationships").then((m) => ({
    default: m.Relationships,
  })),
);
import { Workspace } from "../features/Workspace";
import { NextLink } from "../components/ui";
const navigation = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/relationships", label: "Relationships", icon: Network },
  { to: "/workspace", label: "Workspace", icon: Target },
];
const positions = new Map<string, number>();
export default function App() {
  const { saved, storageAvailable } = useAtlas();
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const drawer = useRef<HTMLElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const drawerWasOpen = useRef(false);
  const [search, setSearch] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = searchArtifacts(search);
  useEffect(() => {
    if (!menu) {
      if (drawerWasOpen.current) menuTrigger.current?.focus();
      drawerWasOpen.current = false;
      return;
    }
    drawerWasOpen.current = true;
    drawer.current?.querySelector<HTMLButtonElement>(".mobile-close")?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(
        drawer.current?.querySelectorAll<HTMLElement>("a,button") || [],
      ).filter((el) => el.getClientRects().length > 0);
      const first = items[0],
        last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [menu]);
  function openSearch() {
    dialog.current?.showModal();
    setTimeout(() => input.current?.focus(), 0);
  }
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  useLayoutEffect(() => {
    const key = location.pathname + location.search;
    const frame = requestAnimationFrame(() =>
      window.scrollTo(0, positions.get(key) || 0),
    );
    return () => {
      cancelAnimationFrame(frame);
      positions.set(key, window.scrollY);
    };
  }, [location.pathname, location.search]);
  useEffect(() => {
    setMenu(false);
    const name = location.pathname.split("/")[1];
    document.title = `${name ? name.charAt(0).toUpperCase() + name.slice(1) : "Home"} · FHIR Atlas`;
  }, [location.pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
          document.getElementById("main")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <aside ref={drawer} className={`sidebar ${menu ? "open" : ""}`}>
        <Link className="brand" to="/" aria-label="FHIR Atlas home">
          <span className="brand-symbol">✳</span>
          <span>
            FHIR <strong>Atlas</strong>
            <small>LEARNING & REFERENCE</small>
          </span>
        </Link>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        >
          <X />
        </button>
        <div className="nav-label">NAVIGATION</div>
        <nav aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"}>
              <Icon size={18} />
              {label}
              {to === "/workspace" && saved.activeTask && (
                <span className="nav-dot" />
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="tiny-label">PRACTICE</span>
          <p>Exercises using reference material.</p>
          <Link to="/workspace">
            Open practice task <ArrowRight size={14} />
          </Link>
        </div>
        <div className="sidebar-bottom">
          <div className="spec-context">
            <span className="status-dot" />
            FHIR R4 <span>4.0.1</span>
          </div>
          <div className="spec-context">
            DK Core <span>Planned package</span>
          </div>
          <div className="prototype-label">
            <FlaskConical size={13} /> UX prototype · WP02
          </div>
        </div>
      </aside>
      {menu && (
        <button
          aria-label="Dismiss navigation"
          className="nav-overlay"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="app-body" inert={menu}>
        <header className="topbar">
          <button
            ref={menuTrigger}
            className="mobile-menu icon-button"
            aria-label="Open navigation"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
          >
            <Menu />
          </button>
          <div className="top-breadcrumb">
            FHIR Atlas <ChevronRight size={13} />
            <span>
              {location.pathname.startsWith("/lesson")
                ? "Learn / Lesson"
                : navigation.find(
                    (n) => n.to !== "/" && location.pathname.startsWith(n.to),
                  )?.label || "Overview"}
            </span>
          </div>
          <div className="top-actions">
            {saved.activeTask &&
              !location.pathname.startsWith("/workspace") && (
                <Link className="resume-task" to="/workspace">
                  <span className="status-dot" />
                  Resume task
                </Link>
              )}
            <button
              className="global-search"
              aria-label="Search the atlas"
              onClick={openSearch}
            >
              <Search size={15} />
              <span>Search the atlas</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="local-indicator">
              <span className="status-dot" />
              Local progress
            </span>
          </div>
        </header>
        {!storageAvailable && (
          <div className="storage-warning" role="status">
            Browser storage is unavailable. Your work stays in this session but
            cannot be saved.
          </div>
        )}
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/lesson/resource-profile-ig" element={<Lesson />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:artifactId" element={<Explore />} />
            <Route
              path="/relationships"
              element={
                <Suspense
                  fallback={<div className="page">Loading relationships…</div>}
                >
                  <Relationships />
                </Suspense>
              }
            />
            <Route path="/workspace" element={<Workspace />} />
            <Route
              path="*"
              element={
                <div className="page">
                  <h1>Page not found</h1>
                  <p>The requested page could not be found.</p>
                  <NextLink to="/">Return home</NextLink>
                </div>
              }
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <span>
            FHIR Atlas <span className="footer-dot">/</span> FHIR R4 · 4.0.1
          </span>
          <span>
            <FlaskConical size={12} /> Prototype · Synthetic examples ·
            Device-local progress
          </span>
        </footer>
      </div>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
      >
        <div className="dialog-search">
          <Search size={21} />
          <label className="sr-only" id="search-title" htmlFor="atlas-search">
            Search the atlas
          </label>
          <input
            id="atlas-search"
            ref={input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources, concepts, profiles…"
          />
          <button
            className="icon-button"
            aria-label="Close search"
            onClick={() => dialog.current?.close()}
          >
            <X size={18} />
          </button>
        </div>
        <div className="dialog-meta">
          {search ? "MATCHING THE SAMPLE CORPUS" : "START EXPLORING"}
          <span>{results.length} results</span>
        </div>
        <div className="search-results">
          {results.map((a) => (
            <Link
              to={`/explore/${a.id}`}
              key={a.id}
              onClick={() => dialog.current?.close()}
            >
              <span className="search-result-icon">
                <Compass size={18} />
              </span>
              <span>
                <strong>{a.name}</strong>
                <small>{a.summary}</small>
              </span>
              <span className="badge">{a.kind}</span>
              <ChevronRight size={15} />
            </Link>
          ))}
          {!results.length && (
            <div className="empty-state">
              <Search />
              <h3>No matches in this prototype</h3>
              <p>Try “Patient”, “profile”, or “guide”.</p>
            </div>
          )}
        </div>
        <div className="dialog-footer">
          <span>Limited, labeled prototype fixtures</span>
          <button
            onClick={() => {
              navigate(`/explore?q=${encodeURIComponent(search)}`);
              dialog.current?.close();
            }}
          >
            Browse all results <ArrowRight size={13} />
          </button>
        </div>
      </dialog>
      <span className="sr-only" role="status">
        {saved.exerciseComplete
          ? "Practice task complete"
          : saved.lessonComplete
            ? "Lesson read"
            : ""}
      </span>
    </>
  );
}
