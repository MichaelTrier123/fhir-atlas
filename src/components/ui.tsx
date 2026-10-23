import {
  ArrowRight,
  ExternalLink,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function Badge({
  children,
  tone = "",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function IconBox({
  icon: Icon,
  tone = "",
}: {
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <span className={`icon-box ${tone}`}>
      <Icon size={22} />
    </span>
  );
}
export function NextLink({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? "secondary" : ""}`} to={to}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
export function FixtureNotice() {
  return (
    <div className="fixture-notice">
      <FlaskConical size={14} />
      <span>
        Prototype data · Limited sample corpus. DK Core constraints are not yet
        loaded.
      </span>
    </div>
  );
}
export function SourceLink({
  href,
  label = "Read the FHIR R4 source",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      {label}
      <ExternalLink size={13} />
    </a>
  );
}
