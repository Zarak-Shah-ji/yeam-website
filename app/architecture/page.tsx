import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * How Yeam gets data out of the systems a practice already runs.
 *
 * Ported from the app's internal /how-we-connect page. The status palette had
 * to change: the original used emerald/amber/slate, and amber has no entry in
 * the dark-theme block in globals.css, so it would render light-on-light for
 * the default visitor. Building is the blue tint here instead.
 */

export const metadata: Metadata = {
  title: "How Yeam Connects — Yeam.ai",
  description:
    "Denials arrive as 835s from the clearinghouse, not from the EHR. How Yeam gets claim data out of the systems your practices already run.",
};

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

const GAPS: [string, string][] = [
  [
    "Multi-practice scoping",
    "Serving many practices from one workspace is the next thing we build, and it comes before any EHR connector.",
  ],
  [
    "BAA required for real data",
    "The public demo runs on synthetic documents only. A pilot on live claims means signing BAAs first.",
  ],
  [
    "The engine is the mature part",
    "Payer rules, filing windows and denial playbooks have been reviewed by working billing managers. Ingestion is younger.",
  ],
];

function Node({ label, sub, status }: { label: string; sub: string; status: Status }) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${TONE[status]}`}>
      <p className="text-[15px] font-semibold leading-snug text-[#1C1C1C]">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#5A6A8A]">{sub}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center justify-center py-1 text-2xl leading-none text-[#8A9BBF] md:py-0"
    >
      <span className="md:hidden">↓</span>
      <span className="hidden md:inline">→</span>
    </div>
  );
}

function Stage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
        {title}
      </p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
            Architecture
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
            How Yeam connects
          </h1>
          <p className="text-lg text-[#4A5A7A] max-w-2xl">
            Denials arrive as 835s from the clearinghouse, not from the EHR. One connection
            there covers every practice, whatever each one runs.
          </p>

          {/* Flow */}
          <div className="mt-10 overflow-x-auto rounded-2xl border border-[#E0E6F5] bg-white shadow-sm px-6 py-8 sm:px-8">
            <div className="flex min-w-[280px] flex-col gap-3 md:flex-row md:items-center md:gap-5">
              <Stage title="Source">
                {SOURCES.map((s) => (
                  <Node key={s.label} {...s} />
                ))}
              </Stage>

              <Arrow />

              <Stage title="Adapter">
                <Node
                  label="Field mapping"
                  sub="one config per source — a new EHR is a mapping file, not a new integration"
                  status="building"
                />
              </Stage>

              <Arrow />

              <Stage title="Normalized claim">
                <Node
                  label="Claim record"
                  sub="payer · CARC · amounts · dates — everything downstream reads this shape only"
                  status="building"
                />
              </Stage>

              <Arrow />

              <Stage title="Engine">
                {ENGINE.map((e) => (
                  <Node key={e.label} {...e} />
                ))}
              </Stage>

              <Arrow />

              <Stage title="Output">
                {OUTPUTS.map((o) => (
                  <Node key={o.label} {...o} />
                ))}
              </Stage>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#E0E6F5] pt-5">
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

          {/* Gaps */}
          <h2 className="mt-14 text-xl font-bold text-[#1C1C1C]">Where we are</h2>
          <p className="mt-1 text-sm text-[#5A6A8A]">The part most vendor pages leave out.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {GAPS.map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-[#E0E6F5] bg-white px-5 py-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#1C1C1C]">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#4A5A7A]">{body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-[#4A5A7A]">
            The output routing above is live —{" "}
            <Link
              href="/#try-it"
              className="font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
            >
              run it on a sample denial
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
