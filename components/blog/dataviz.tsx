/**
 * Small presentational data components for data-heavy posts (the Payer Denial
 * Playbook in particular). No hooks, safe in server components. Every color
 * class has a matching entry in the `.dark` block of globals.css, so bars,
 * tables, and cards all stay legible in dark mode.
 */

import type { ReactNode } from "react";

/* ------------------------------- stat cards ------------------------------- */

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{children}</div>;
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#E0E6F5] bg-white px-5 py-5 shadow-sm">
      <p className="text-3xl font-bold text-[#1A4FBF] sm:text-4xl">{value}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-[#4A5A7A]">{label}</p>
    </div>
  );
}

/* --------------------------------- tables --------------------------------- */

export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full min-w-[480px] border-collapse text-left text-[13px] sm:text-sm">{children}</table>;
}

export function TH({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th
      className={`border-b border-[#E0E6F5] px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF] ${
        right ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

export function TD({
  children,
  strong,
  right,
}: {
  children: ReactNode;
  strong?: boolean;
  right?: boolean;
}) {
  return (
    <td
      className={`border-b border-[#E0E6F5] px-4 py-3 align-middle ${right ? "text-right" : ""} ${
        strong ? "font-medium text-[#1C1C1C]" : "text-[#4A5A7A]"
      }`}
    >
      {children}
    </td>
  );
}

/** Inline horizontal bar for a "relative" table column. `value`/`max` set width. */
export function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2 w-full min-w-[80px] max-w-[160px] overflow-hidden rounded-full bg-[#E0E6F5]">
      <div className="h-2 rounded-full bg-[#1A4FBF]" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ------------------------------ category bars ----------------------------- */

/** Labelled horizontal bars for a "share of X" breakdown. `value` is a percent. */
export function CategoryBars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="mt-8 space-y-3.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[#1C1C1C]">{item.label}</span>
            <span className="text-[#4A5A7A]">{item.value}%</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#E0E6F5]">
            <div
              className="h-2.5 rounded-full bg-[#1A4FBF]"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- source list ------------------------------ */

export function SourceList({ sources }: { sources: { label: string; href?: string }[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm">
      {sources.map((s) => (
        <li key={s.label} className="text-[#4A5A7A]">
          {s.href ? (
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A4FBF] transition-colors hover:text-[#1540A0]"
            >
              {s.label}
            </a>
          ) : (
            s.label
          )}
        </li>
      ))}
    </ul>
  );
}
