/**
 * Prose primitives for blog post bodies.
 *
 * The site has no `@tailwindcss/typography` plugin, and dark mode in globals.css
 * is keyed to exact color-utility classes, so instead of a generic `prose`
 * wrapper, post bodies are composed from these small styled elements. Every
 * color class used here has a matching entry in the `.dark` block of globals.css,
 * so the whole set stays legible in both themes.
 */

import type { ReactNode } from "react";

/** Opening paragraph under the title. */
export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-lg leading-relaxed text-[#4A5A7A]">{children}</p>;
}

/** Section heading. Pass `eyebrow` for the numbered brief-style label above it. */
export function H2({ id, eyebrow, children }: { id?: string; eyebrow?: string; children: ReactNode }) {
  return (
    <div className="mt-14 scroll-mt-28" id={id}>
      {eyebrow && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-[#1C1C1C]">{children}</h2>
    </div>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-lg font-semibold text-[#1C1C1C]">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[15px] leading-relaxed text-[#4A5A7A]">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 space-y-2">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-relaxed text-[#4A5A7A]">
      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A4FBF]" />
      <span>{children}</span>
    </li>
  );
}

/** Pull quote with attribution. */
export function Quote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="mt-8 border-l-2 border-[#A8BFEE] pl-5">
      <blockquote className="text-lg font-medium italic leading-relaxed text-[#1C1C1C]">
        {children}
      </blockquote>
      {cite && <figcaption className="mt-2 text-sm text-[#5A6A8A]">{cite}</figcaption>}
    </figure>
  );
}

/** Tinted "what this means" style aside. */
export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border border-[#A8BFEE] bg-[#EBF0FA] px-5 py-4">
      {title && <p className="text-sm font-semibold text-[#1A4FBF]">{title}</p>}
      <div className="mt-1 text-[15px] leading-relaxed text-[#4A5A7A]">{children}</div>
    </div>
  );
}

/**
 * Wraps wide content (tables, charts) so it scrolls on small screens instead of
 * pushing the page. Optional caption underneath.
 */
export function Figure({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="mt-8">
      <div className="overflow-x-auto rounded-2xl border border-[#E0E6F5] bg-white shadow-sm">
        {children}
      </div>
      {caption && <figcaption className="mt-3 text-xs leading-relaxed text-[#5A6A8A]">{caption}</figcaption>}
    </figure>
  );
}
