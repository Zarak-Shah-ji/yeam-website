"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The connect flow, animated.
 *
 * Ported out of the architecture page so it can run on the client. The stages
 * assemble left to right the first time the diagram scrolls into view, then a
 * packet travels each connector on a gentle loop so the picture reads as data
 * moving through, not a static chart. Everything degrades to the plain diagram
 * under prefers-reduced-motion.
 *
 * Colour classes are restricted to the ones the dark-theme block in globals.css
 * overrides (tones, borders, blue tokens), so the whole thing themes for free.
 */

type Status = "live" | "building" | "roadmap";

/** Every class here appears in the dark-theme block of globals.css. */
const TONE: Record<Status, string> = {
  live: "bg-green-50 border-green-200",
  building: "bg-[#EBF0FA] border-[#A8BFEE]",
  roadmap: "bg-slate-50 border-slate-200",
};

const LEGEND: { status: Status; label: string; pill: string }[] = [
  { status: "live", label: "Live today", pill: "bg-green-50 text-green-600 border-green-200" },
  { status: "building", label: "Building", pill: "bg-[#EBF0FA] text-[#1A4FBF] border-[#A8BFEE]" },
  { status: "roadmap", label: "Roadmap", pill: "bg-slate-50 text-slate-500 border-slate-200" },
];

const SOURCES: { label: string; sub: string; status: Status }[] = [
  { label: "Denial letter / EOB", sub: "PDF · image · Word", status: "live" },
  { label: "Claims export", sub: "CSV · XLSX", status: "live" },
  { label: "835 ERA", sub: "clearinghouse", status: "building" },
  { label: "Chart notes", sub: "EHR · FHIR R4", status: "roadmap" },
];

const ENGINE: { label: string; sub: string; status: Status }[] = [
  { label: "Denial playbook", sub: "picks the remedy", status: "live" },
  { label: "Payer profile", sub: "window · channel · form", status: "live" },
];

const OUTPUTS: { label: string; sub: string; status: Status }[] = [
  { label: "Corrected claim", sub: "CO-11 · CO-16 · CO-18", status: "live" },
  { label: "Appeal letter", sub: "CO-50 · CO-97 · CO-151 · CO-197", status: "live" },
  { label: "Reprocessing request", sub: "CO-45 · PR-204", status: "live" },
];

/** The output does not arrive as a pile: it is ranked by what is recoverable and
 *  how long is left to file. This is the picture billers actually care about. */
const WORKLIST: { dot: string; code: string; amount: string; note: string }[] = [
  { dot: "bg-red-500", code: "CO-197", amount: "$1,240", note: "auth appeal · 6 days to file" },
  { dot: "bg-[#1A4FBF]", code: "CO-16", amount: "$380", note: "missing NPI · 21 days" },
  { dot: "bg-slate-400", code: "CO-45", amount: "$60", note: "contractual · adjust only" },
];

function Node({ label, sub, status }: { label: string; sub: string; status: Status }) {
  return (
    <div data-arch className={`rounded-lg border px-4 py-3 ${TONE[status]}`}>
      <p className="text-[15px] font-semibold leading-snug text-[#1C1C1C]">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#5A6A8A]">{sub}</p>
    </div>
  );
}

/** A connector with a packet that travels it once the diagram is revealed. */
function Connector() {
  return (
    <div
      aria-hidden
      data-arch
      className="flex shrink-0 items-center justify-center py-1 md:py-0"
    >
      {/* Mobile: the stages stack, so the flow runs downward. */}
      <svg className="md:hidden" width="20" height="34" viewBox="0 0 20 34" fill="none">
        <line
          x1="10" y1="2" x2="10" y2="32"
          stroke="currentColor" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round"
          className="text-[#1A4FBF] opacity-30"
        />
        <circle data-packet-y cx="10" cy="2" r="4" fill="currentColor" className="text-[#1A4FBF]" />
      </svg>
      {/* Desktop: the stages sit in a row, so the flow runs rightward. */}
      <svg className="hidden md:block" width="40" height="20" viewBox="0 0 40 20" fill="none">
        <line
          x1="2" y1="10" x2="38" y2="10"
          stroke="currentColor" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round"
          className="text-[#1A4FBF] opacity-30"
        />
        <circle data-packet-x cx="2" cy="10" r="4" fill="currentColor" className="text-[#1A4FBF]" />
      </svg>
    </div>
  );
}

function Stage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 flex-1">
      <p
        data-arch
        className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]"
      >
        {title}
      </p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

export default function ArchitectureFlow() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-arch]");
      const packetsX = gsap.utils.toArray<SVGElement>("[data-packet-x]");
      const packetsY = gsap.utils.toArray<SVGElement>("[data-packet-y]");

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 16 });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.07,
          });

          // The packets start after the stages have assembled, then loop as a
          // wave so the eye follows source to output.
          const packet = { duration: 1.6, ease: "none", repeat: -1, delay: 0.7, repeatDelay: 0.4 };
          if (packetsX.length) {
            gsap.to(packetsX, { attr: { cx: 38 }, stagger: { each: 0.35 }, ...packet });
          }
          if (packetsY.length) {
            gsap.to(packetsY, { attr: { cy: 32 }, stagger: { each: 0.35 }, ...packet });
          }

          // The Engine keeps a slow brand glow so the eye reads it as the
          // load-bearing stage, which is what the copy claims.
          gsap.to("[data-arch-pulse]", {
            opacity: 0.16,
            duration: 2.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.9,
          });
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="mt-10 overflow-x-auto rounded-2xl border border-[#E0E6F5] bg-white shadow-sm px-6 py-8 sm:px-8"
    >
      <div className="flex min-w-[280px] flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <Stage title="Source">
          {SOURCES.map((s) => (
            <Node key={s.label} {...s} />
          ))}
        </Stage>

        <Connector />

        <Stage title="Adapter">
          <Node
            label="Field mapping"
            sub="one config per source; a new EHR is a mapping file, not a new integration"
            status="building"
          />
        </Stage>

        <Connector />

        <Stage title="Normalized claim">
          <Node
            label="Claim record"
            sub="payer · CARC · amounts · dates; everything downstream reads this shape only"
            status="building"
          />
        </Stage>

        <Connector />

        {/* Engine is the mature part, so it gets a soft brand glow behind it. */}
        <div className="relative min-w-0 flex-1">
          <div
            aria-hidden
            data-arch-pulse
            className="pointer-events-none absolute -inset-3 rounded-3xl bg-[#1A4FBF] opacity-0 blur-2xl"
          />
          <div className="relative">
            <Stage title="Engine">
              {ENGINE.map((e) => (
                <Node key={e.label} {...e} />
              ))}
            </Stage>
          </div>
        </div>

        <Connector />

        <Stage title="Output">
          {OUTPUTS.map((o) => (
            <Node key={o.label} {...o} />
          ))}
        </Stage>
      </div>

      {/* The output, already ranked. Answers the loudest biller complaint about
          AI tools: no prioritization. Highest recoverable and nearest deadline
          rise to the top. */}
      <div data-arch className="mt-8 rounded-xl border border-[#E0E6F5] bg-[#F7F9FE] p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
          What lands in the worklist, already ranked
        </p>
        <div className="mt-3 space-y-2">
          {WORKLIST.map((row) => (
            <div
              key={row.code}
              data-arch
              className="flex items-center gap-3 rounded-lg border border-[#E0E6F5] bg-white px-3 py-2"
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.dot}`} />
              <span className="font-mono text-xs font-semibold text-[#1C1C1C]">{row.code}</span>
              <span className="text-xs font-semibold text-[#1A4FBF]">{row.amount}</span>
              <span className="ml-auto text-right text-xs text-[#5A6A8A]">{row.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        data-arch
        className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#E0E6F5] pt-5"
      >
        {LEGEND.map((l) => (
          <span
            key={l.status}
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${l.pill}`}
          >
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
