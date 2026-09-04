"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The hero visual, rebuilt as one large pipeline scene.
 *
 * This replaces the old four-cell proof row (HeroProof). Instead of four small,
 * separate motions the eye has to decode, the hero now tells the product's whole
 * story in one streamlined flow, left to right: a raw 835 remit export goes into
 * Yeam's triage, and a ranked, worked queue with a drafted response comes out.
 * It says the same thing the section copy does ("One export in. A worked queue
 * out.") in a single picture.
 *
 * The scene assembles on mount (the hero is above the fold), then holds a slow
 * ambient loop: the connectors fill as a batch flows through, the triage node
 * glows, the worked rows drop into place ranked, and the drafted-response line
 * appears. Everything is behind prefersReducedMotion(); every colour is on a
 * token the dark-theme block in globals.css already overrides.
 *
 * Transform note (same as the old HeroProof): elements GSAP animates avoid
 * Tailwind's own transform utilities, because GSAP writes the whole `transform`
 * and would drop them. The connector fill grows on both axes from a single
 * top-left origin, so one animation reveals it rightward on desktop (horizontal
 * line) and downward on mobile (vertical line).
 */

const EXPORT_ROWS = [
  { code: "CO-45", payer: "Medicare", amt: "$60" },
  { code: "CO-197", payer: "Aetna", amt: "$1,240" },
  { code: "PR-204", payer: "Cigna", amt: "$210" },
  { code: "CO-16", payer: "BCBS", amt: "$380" },
  { code: "CO-50", payer: "UHC", amt: "$920" },
];

const QUEUE_ROWS = [
  { dot: "bg-red-500", code: "CO-197", amt: "$1,240", remedy: "Appeal" },
  { dot: "bg-red-500", code: "CO-50", amt: "$920", remedy: "Appeal" },
  { dot: "bg-[#1A4FBF]", code: "CO-16", amt: "$380", remedy: "Corrected" },
  { dot: "bg-[#1A4FBF]", code: "PR-204", amt: "$210", remedy: "Reprocess" },
  { dot: "bg-slate-400", code: "CO-45", amt: "$60", remedy: "No action" },
];

function Connector() {
  // A faint track with a bright fill that scales in from its top-left corner.
  // Horizontal on desktop, vertical on mobile; the same 0->1 scale reveals it in
  // whichever direction the track runs.
  return (
    <div className="relative mx-auto my-1.5 h-6 w-px shrink-0 bg-[#E0E6F5] md:mx-0 md:my-0 md:h-px md:w-14 lg:w-20">
      <span data-fill aria-hidden className="absolute inset-0 block bg-[#1A4FBF]" />
    </div>
  );
}

export default function HeroPipeline() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const blocks = gsap.utils.toArray<HTMLElement>("[data-block]", root);
      const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", root);
      const rows = gsap.utils.toArray<HTMLElement>("[data-queue-row]", root);
      const draft = root.querySelector<HTMLElement>("[data-draft]");
      const glow = root.querySelector<HTMLElement>("[data-glow]");

      gsap.set(fills, { transformOrigin: "top left" });

      // Reduced motion: land the finished state, run no loops.
      if (prefersReducedMotion()) {
        gsap.set(blocks, { opacity: 1, y: 0 });
        gsap.set(fills, { scaleX: 1, scaleY: 1 });
        gsap.set(rows, { opacity: 1, y: 0 });
        gsap.set([draft], { opacity: 1, y: 0 });
        gsap.set([glow], { opacity: 0.35 });
        return;
      }

      // Starting state.
      gsap.set(blocks, { opacity: 0, y: 16 });
      gsap.set(fills, { scaleX: 0, scaleY: 0 });
      gsap.set(rows, { opacity: 0, y: 8 });
      gsap.set([draft], { opacity: 0, y: 6 });
      gsap.set([glow], { opacity: 0 });

      // Assemble on mount.
      gsap.to(blocks, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.15,
      });

      // Ambient loop: one batch flows all the way through, then resets.
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.5, delay: 1 })
        .to(fills[0], { scaleX: 1, scaleY: 1, duration: 0.5, ease: "power1.inOut" })
        .to(glow, { opacity: 0.4, duration: 0.4, ease: "sine.out" }, "-=0.2")
        .to(fills[1], { scaleX: 1, scaleY: 1, duration: 0.5, ease: "power1.inOut" }, "-=0.1")
        .to(rows, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1 }, "-=0.1")
        .to(draft, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.05")
        .to(glow, { opacity: 0.16, duration: 0.7, ease: "sine.inOut" }, ">")
        .to({}, { duration: 1.7 })
        .to([...rows, draft, ...fills, glow], { opacity: 0, duration: 0.45, ease: "power1.in" })
        .set(fills, { scaleX: 0, scaleY: 0, opacity: 1 })
        .set(rows, { y: 8 })
        .set([draft], { y: 6 });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="mt-14 flex flex-col items-stretch md:mt-16 md:flex-row md:items-center"
    >
      {/* Stage 1 — the raw export */}
      <div data-block className="md:flex-1">
        <div className="rounded-2xl border border-[#E0E6F5] bg-[#F7F9FE] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
              835 remit export
            </span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#8A9BBF] ring-1 ring-[#E0E6F5]">
              raw
            </span>
          </div>
          <div className="space-y-1.5">
            {EXPORT_ROWS.map((r) => (
              <div
                key={r.code}
                className="flex items-center gap-3 rounded-lg border border-[#E0E6F5] bg-white px-3 py-2 text-xs"
              >
                <span className="font-mono font-semibold text-[#5A6A8A]">{r.code}</span>
                <span className="truncate text-[#8A9BBF]">{r.payer}</span>
                <span className="ml-auto font-semibold text-[#5A6A8A]">{r.amt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Connector />

      {/* Stage 2 — Yeam triage */}
      <div data-block className="relative mx-auto my-1 shrink-0 md:mx-0 md:my-0">
        <span
          data-glow
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-2xl bg-[#1A4FBF] opacity-0 blur-lg"
        />
        <div className="relative flex flex-col items-center gap-0.5 rounded-2xl border border-[#A8BFEE] bg-white px-5 py-4">
          <span className="text-base font-semibold text-[#1A4FBF]">Yeam</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
            Triage
          </span>
        </div>
      </div>

      <Connector />

      {/* Stage 3 — the worked queue */}
      <div data-block className="md:flex-1">
        <div className="rounded-2xl border border-[#E0E6F5] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
              Worked queue
            </span>
            <span className="rounded-full bg-[#F0F7E8] px-2 py-0.5 text-[10px] font-semibold text-[#5C8A3A]">
              ranked
            </span>
          </div>
          <div className="space-y-1.5">
            {QUEUE_ROWS.map((r, i) => (
              <div
                key={r.code}
                data-queue-row
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                  i === 0
                    ? "border-[#A8BFEE] bg-[#EBF0FA]"
                    : "border-[#E0E6F5] bg-[#F7F9FE]"
                }`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${r.dot}`} />
                <span className="font-mono font-semibold text-[#1C1C1C]">{r.code}</span>
                <span className="ml-auto font-semibold text-[#1A4FBF]">{r.amt}</span>
                <span className="rounded-full border border-[#A8BFEE] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1A4FBF]">
                  {r.remedy}
                </span>
              </div>
            ))}
          </div>
          <div
            data-draft
            className="mt-3 flex items-center gap-2 rounded-lg border border-[#E0E6F5] bg-[#F7F9FE] px-3 py-2 text-[11px] text-[#4A5A7A]"
          >
            <svg className="h-3.5 w-3.5 shrink-0 text-[#1A4FBF]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
            Response drafted for the top denial, ready to review.
          </div>
        </div>
      </div>
    </div>
  );
}
