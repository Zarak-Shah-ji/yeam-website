"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * A product screenshot, hand-built and now interactive.
 *
 * Polar leans on a big picture of the dashboard; this is ours, drawn in markup
 * so it themes and stays crisp. A window frame holds three summary tiles and the
 * ranked worklist table. Three numbered markers call out the parts that matter,
 * and the same numbers are explained underneath.
 *
 * The picture is no longer a still: on scroll-in the rows arrive unsorted and
 * then rank into place, and they stay clickable. Selecting a denial drops the
 * drafted response for it into a panel below the table, so a visitor can poke at
 * the queue the same way a biller would. Default selection is the top (biggest,
 * soonest) denial. Everything is behind prefers-reduced-motion.
 *
 * Every colour class already has a dark-theme entry in globals.css (the remedy
 * chips are the same tokens DenialTriage uses).
 */

type Row = {
  pri: string;
  code: string;
  payer: string;
  amount: string;
  deadline: string;
  remedy: string;
  chip: string;
  detail: string;
};

const ROWS: Row[] = [
  { pri: "bg-red-500", code: "CO-197", payer: "Aetna", amount: "$1,240", deadline: "6 days", remedy: "Appeal", chip: "bg-[#EBF0FA] text-[#1A4FBF] border-[#A8BFEE]", detail: "Appeal drafted: cites the authorization on file and timely-filing proof. 6 days left to file." },
  { pri: "bg-red-500", code: "CO-50", payer: "UHC", amount: "$920", deadline: "9 days", remedy: "Appeal", chip: "bg-[#EBF0FA] text-[#1A4FBF] border-[#A8BFEE]", detail: "Appeal drafted: medical-necessity packet assembled from the chart notes. 9 days left to file." },
  { pri: "bg-[#1A4FBF]", code: "CO-16", payer: "BCBS", amount: "$380", deadline: "21 days", remedy: "Corrected claim", chip: "bg-[#F5F0FA] text-[#6B4A8A] border-[#D4C0E8]", detail: "Corrected claim: rendering-provider NPI added, ready to resubmit. 21 days left." },
  { pri: "bg-[#1A4FBF]", code: "PR-204", payer: "Cigna", amount: "$210", deadline: "30 days", remedy: "Reprocess", chip: "bg-[#F0F7E8] text-[#5C8A3A] border-[#C8DDB4]", detail: "Reprocessing request: coordination of benefits updated to primary, sent back to the payer. 30 days left." },
  { pri: "bg-slate-400", code: "CO-45", payer: "Medicare", amount: "$60", deadline: "adjust only", remedy: "No action", chip: "bg-slate-50 text-slate-500 border-slate-200", detail: "Contractual adjustment. Nothing to work here: write it off and move on." },
];

const TILES: { label: string; value: string }[] = [
  { label: "Recoverable this remit", value: "$12,480" },
  { label: "Expiring in 7 days", value: "8" },
  { label: "Open denials", value: "42" },
];

const CALLOUTS: string[] = [
  "Totaled the moment your export lands, before anyone opens a claim.",
  "A filing deadline on every denial, so nothing dies in the queue.",
  "The specific remedy, picked per denial, not a generic resubmit.",
];

function Marker({ n }: { n: number }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1A4FBF] text-[11px] font-semibold text-white">
      {n}
    </span>
  );
}

export default function DashboardShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", rootRef.current);
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", rootRef.current);

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
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          });

          // The rows arrive unsorted, then rank into place: the top-priority
          // denial rises from the bottom to the top slot while the rest settle
          // around it. This replaces the old count-up on the summary tiles; the
          // queue sorting itself is the point, not a number ticking.
          if (rows.length) {
            // The slot each row occupies before it sorts (a scramble of 0..n-1).
            // Row 0 is the highest-priority denial, so it starts at the bottom
            // and rises to the top as the queue ranks.
            const startSlot = [4, 1, 3, 0, 2];
            const pitch = rows[0].getBoundingClientRect().height;
            rows.forEach((row, i) => {
              const from = startSlot[i] ?? i;
              gsap.set(row, { opacity: 0, y: (from - i) * pitch });
            });
            gsap
              .timeline({ delay: 0.35 })
              .to(rows, { opacity: 1, duration: 0.4, ease: "power1.out", stagger: 0.06 })
              .to(
                rows,
                { y: 0, duration: 0.75, ease: "power3.inOut", stagger: 0.05 },
                "+=0.3",
              );
          }
        },
      });
    },
    { scope: rootRef },
  );

  const active = ROWS[selected];

  return (
    <section ref={rootRef} className="bg-[#F7F9FE] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="max-w-3xl">
          <p data-reveal className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1A4FBF]">
            The worklist
          </p>
          <h2 data-reveal className="text-3xl font-light tracking-tight text-[#1C1C1C] md:text-5xl">
            See the queue before you touch a claim.
          </h2>
          <p data-reveal className="mt-5 text-lg leading-relaxed text-[#5A6A8A]">
            The same export you already pull, read and ranked. Highest recoverable
            and nearest deadline rise to the top. Pick any denial to see the
            response Yeam drafted for it.
          </p>
        </div>

        {/* Window frame */}
        <div data-reveal className="mt-12 overflow-hidden rounded-2xl border border-[#E0E6F5] bg-white shadow-xl shadow-slate-900/5">
          <div className="flex items-center gap-2 border-b border-[#E0E6F5] bg-[#F7F9FE] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-[#E0E6F5]" />
            <span className="h-3 w-3 rounded-full bg-[#E0E6F5]" />
            <span className="ml-3 inline-flex rounded-md bg-white px-3 py-1 text-xs text-[#8A9BBF] ring-1 ring-[#E0E6F5]">
              app.yeam.ai/worklist
            </span>
          </div>

          <div className="p-5 sm:p-7">
            {/* Summary tiles (callout 1) */}
            <div className="mb-6 flex items-start gap-2">
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                {TILES.map((t) => (
                  <div key={t.label} className="rounded-xl border border-[#E0E6F5] bg-[#F7F9FE] px-4 py-3">
                    <p className="text-2xl font-light text-[#1C1C1C]">
                      {t.value}
                    </p>
                    <p className="mt-0.5 text-xs text-[#5A6A8A]">{t.label}</p>
                  </div>
                ))}
              </div>
              <div className="hidden pt-1 sm:block">
                <Marker n={1} />
              </div>
            </div>

            {/* Ranked table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E0E6F5] text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
                    <th className="py-2 pr-3 font-semibold">Code</th>
                    <th className="py-2 pr-3 font-semibold">Payer</th>
                    <th className="py-2 pr-3 font-semibold">Amount</th>
                    <th className="py-2 pr-3 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        Deadline <Marker n={2} />
                      </span>
                    </th>
                    <th className="py-2 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        Remedy <Marker n={3} />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => {
                    const isActive = i === selected;
                    return (
                      <tr
                        key={r.code}
                        data-row
                        onClick={() => setSelected(i)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelected(i);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isActive}
                        aria-label={`Show the drafted response for ${r.code}, ${r.payer}`}
                        className={`cursor-pointer border-b border-[#E0E6F5] outline-none transition-colors last:border-0 focus-visible:ring-2 focus-visible:ring-[#1A4FBF] ${
                          isActive ? "bg-[#EBF0FA]" : "hover:bg-[#F7F9FE]"
                        }`}
                      >
                        <td className="py-3 pr-3">
                          <span className="inline-flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.pri}`} />
                            <span className="font-mono text-xs font-semibold text-[#1C1C1C]">{r.code}</span>
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-sm text-[#4A5A7A]">{r.payer}</td>
                        <td className="py-3 pr-3 text-sm font-semibold text-[#1A4FBF]">{r.amount}</td>
                        <td className="py-3 pr-3 text-sm text-[#4A5A7A]">{r.deadline}</td>
                        <td className="py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${r.chip}`}>
                            {r.remedy}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Drafted-response panel for the selected denial. Keyed on the
                selection so it re-runs its small fade each time a row changes. */}
            <div
              key={selected}
              style={{ animation: "fadeSlideIn 0.3s ease-out" }}
              className="mt-5 flex items-start gap-3 rounded-xl border border-[#E0E6F5] bg-[#F7F9FE] p-4"
            >
              <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${active.pri}`} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A9BBF]">
                  {active.code} · {active.payer} · {active.remedy}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#4A5A7A]">{active.detail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Numbered legend for the markers above */}
        <div data-reveal className="mt-8 grid gap-4 sm:grid-cols-3">
          {CALLOUTS.map((c, i) => (
            <div key={c} className="flex items-start gap-3">
              <Marker n={i + 1} />
              <p className="text-sm leading-relaxed text-[#4A5A7A]">{c}</p>
            </div>
          ))}
        </div>

        <p data-reveal className="mt-8 text-sm text-[#4A5A7A]">
          <Link href="/worklist" className="font-medium text-[#1A4FBF] transition-colors hover:text-[#1540A0]">
            Run it on your own export →
          </Link>
        </p>
      </div>
    </section>
  );
}
