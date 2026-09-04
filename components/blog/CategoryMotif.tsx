import type { ReactNode } from "react";

/**
 * A faint, oversized motif that bleeds from the corner of a blog card, keyed to
 * the post's category. Each is an inline SVG drawn in the current text color, so
 * one opacity wrapper plus a brand-blue text token (which already has a dark
 * entry in globals.css) makes it theme-aware with no image files. It reads as
 * texture rather than a picture, which is the point: cards stay uniform and on
 * template. Purely decorative, so it is aria-hidden and never takes pointer
 * events. An unknown tag renders nothing.
 */

const DOT_GRID = Array.from({ length: 25 }, (_, i) => {
  const row = Math.floor(i / 5);
  const col = i % 5;
  return (
    <circle key={i} cx={14 + col * 23} cy={14 + row * 23} r={(row * 5 + col) % 4 === 0 ? 7 : 3.5} />
  );
});

const BARS = [40, 66, 30, 88, 54, 104].map((h, i) => (
  <rect key={i} x={8 + i * 19} y={116 - h} width={12} height={h} rx={2} />
));

const MOTIFS: Record<string, ReactNode> = {
  // Data: a heatmap of dots.
  Data: <g fill="currentColor">{DOT_GRID}</g>,

  // Market Research: a bar chart.
  "Market Research": <g fill="currentColor">{BARS}</g>,

  // Engineering: a small node graph.
  Engineering: (
    <g stroke="currentColor" strokeWidth={2.5} fill="none">
      <line x1={20} y1={26} x2={64} y2={60} />
      <line x1={64} y1={60} x2={104} y2={30} />
      <line x1={64} y1={60} x2={40} y2={104} />
      <line x1={64} y1={60} x2={98} y2={98} />
      <g fill="currentColor" stroke="none">
        <circle cx={20} cy={26} r={7} />
        <circle cx={104} cy={30} r={7} />
        <circle cx={64} cy={60} r={9} />
        <circle cx={40} cy={104} r={7} />
        <circle cx={98} cy={98} r={7} />
      </g>
    </g>
  ),

  // Explainer: a run of flow chevrons.
  Explainer: (
    <g stroke="currentColor" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10,20 40,60 10,100" />
      <polyline points="45,20 75,60 45,100" />
      <polyline points="80,20 110,60 80,100" />
    </g>
  ),
};

export default function CategoryMotif({ tag }: { tag: string }) {
  const motif = MOTIFS[tag];
  if (!motif) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className="pointer-events-none absolute -right-5 -top-5 h-36 w-36 text-[#1A4FBF] opacity-[0.06]"
    >
      {motif}
    </svg>
  );
}
