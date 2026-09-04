"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { LightPulseLine, animateFlowWires } from "./FlowLine";

gsap.registerPlugin(ScrollTrigger);

/**
 * The animated "What Yeam does" motifs.
 *
 * Each is a small motion piece, not a static picture: a scroll-triggered
 * assemble, then a purposeful ambient loop. The shared vocabulary is a pulse of
 * light streaming along a flowing wire (see FlowLine), nodes that illuminate as
 * the pulse arrives, count-ups, filling bars and a drafting state machine.
 * Everything is behind prefersReducedMotion() with the CSS backstop catching
 * ambient loops; colours stay on tokens the dark-theme block already overrides.
 */

/** "$1,240" -> { prefix:"$", target:1240 } so the amount can count up. */
function parseAmount(v: string) {
  const m = v.match(/^(\D*)([\d,]+)/);
  return { prefix: m?.[1] ?? "", target: Number((m?.[2] ?? "0").replace(/,/g, "")) };
}

/* ------------------------------------------------------------------ Triage */

/** A live triage: rows settle in, a scanner sweep passes over them, each row's
 *  recoverable bar fills to scale and its amount counts up, and the top denial
 *  keeps a soft glow so the eye starts where the money is. */
export function TriageMotif() {
  const ref = useRef<HTMLDivElement>(null);

  const ROWS = [
    { dot: "bg-red-500", code: "CO-197", amount: "$1,240", scale: 1, glow: true },
    { dot: "bg-[#1A4FBF]", code: "CO-16", amount: "$380", scale: 0.55, glow: false },
    { dot: "bg-slate-400", code: "CO-45", amount: "$60", scale: 0.22, glow: false },
  ];

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", ref.current);
      const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", ref.current);
      const amounts = gsap.utils.toArray<HTMLElement>("[data-amount]", ref.current);
      const scan = ref.current?.querySelector<HTMLElement>("[data-scan]") ?? null;
      const glow = ref.current?.querySelector<HTMLElement>("[data-glow]") ?? null;
      if (!rows.length) return;

      const setFinal = () => {
        gsap.set(rows, { opacity: 1, y: 0 });
        gsap.set(bars, { scaleX: (i) => Number(bars[i].dataset.scale) });
        amounts.forEach((el) => (el.textContent = el.dataset.value ?? ""));
      };

      if (prefersReducedMotion()) {
        setFinal();
        return;
      }

      gsap.set(rows, { opacity: 0, y: 14 });
      gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(scan, { xPercent: -140, opacity: 0 });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(rows, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)", stagger: 0.12 })
            .to(scan, { opacity: 1, duration: 0.15 }, 0.15)
            .to(scan, { xPercent: 240, duration: 0.9, ease: "power2.inOut" }, "<")
            .to(scan, { opacity: 0, duration: 0.2 }, ">-0.2")
            .to(
              bars,
              {
                scaleX: (i) => Number(bars[i].dataset.scale),
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.1,
              },
              0.35,
            );

          amounts.forEach((el, i) => {
            const { prefix, target } = parseAmount(el.dataset.value ?? "");
            const o = { n: 0 };
            gsap.to(o, {
              n: target,
              duration: 0.9,
              ease: "power2.out",
              delay: 0.4 + i * 0.1,
              onUpdate: () => (el.textContent = prefix + Math.round(o.n).toLocaleString()),
            });
          });

          if (glow) {
            gsap.to(glow, {
              opacity: 0.9,
              duration: 1.4,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: 1.1,
            });
          }
          // A soft periodic re-scan keeps the queue feeling live.
          gsap.to(scan, {
            keyframes: [
              { opacity: 0, duration: 0 },
              { xPercent: -140, duration: 0 },
              { opacity: 0.7, duration: 0.15 },
              { xPercent: 240, duration: 1, ease: "power2.inOut" },
              { opacity: 0, duration: 0.2 },
            ],
            repeat: -1,
            repeatDelay: 3.2,
            delay: 3.5,
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative space-y-2.5 overflow-hidden rounded-xl">
      {ROWS.map((r) => (
        <div
          key={r.code}
          data-row
          className="relative flex items-center gap-3 rounded-lg border border-[#E0E6F5] bg-white px-3 py-2.5 transition-transform duration-200 hover:-translate-y-0.5"
        >
          {r.glow && (
            <span
              data-glow
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-lg bg-red-500/0 opacity-0 ring-2 ring-red-400/40"
            />
          )}
          <span className={`relative h-2.5 w-2.5 shrink-0 rounded-full ${r.dot}`} />
          <span className="relative w-14 shrink-0 font-mono text-xs font-semibold text-[#1C1C1C]">{r.code}</span>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#EBF0FA]">
            <span data-bar data-scale={r.scale} className="block h-full rounded-full bg-[#1A4FBF]" />
          </span>
          <span data-amount data-value={r.amount} className="relative ml-1 w-14 text-right text-xs font-semibold text-[#1A4FBF]">
            {r.amount}
          </span>
        </div>
      ))}

      {/* Scanner sweep */}
      <span
        data-scan
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#1A4FBF]/10 to-transparent"
      />
    </div>
  );
}

/* ------------------------------------------------------------------- Draft */

/** Yeam drafting a response, on a loop: the body lines write themselves in with
 *  a blinking caret, the status flips from a spinning "Drafting" to a green
 *  "Ready for review" whose check draws itself, it holds, then re-drafts. */
export function DraftMotif() {
  const ref = useRef<HTMLDivElement>(null);
  const LINES = ["w-2/3", "w-full", "w-full", "w-4/5", "w-1/2"];

  useGSAP(
    () => {
      const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", ref.current);
      const caret = ref.current?.querySelector<HTMLElement>("[data-caret]") ?? null;
      const drafting = ref.current?.querySelector<HTMLElement>("[data-drafting]") ?? null;
      const ready = ref.current?.querySelector<HTMLElement>("[data-ready]") ?? null;
      const check = ref.current?.querySelector<SVGPathElement>("[data-check]") ?? null;
      const spinner = ref.current?.querySelector<SVGElement>("[data-spinner]") ?? null;
      if (!fills.length) return;

      gsap.set(fills, { transformOrigin: "left center" });

      if (prefersReducedMotion()) {
        gsap.set(fills, { scaleX: 1 });
        gsap.set(drafting, { opacity: 0 });
        gsap.set([ready, caret], { opacity: 1 });
        gsap.set(check, { strokeDashoffset: 0 });
        return;
      }

      const CHECK_LEN = 22;
      gsap.set(fills, { scaleX: 0 });
      gsap.set(check, { strokeDasharray: CHECK_LEN, strokeDashoffset: CHECK_LEN });
      gsap.set(ready, { opacity: 0, y: -4 });
      gsap.set(drafting, { opacity: 1, y: 0 });

      // Caret blink runs on its own so it reads as a real cursor.
      gsap.to(caret, { opacity: 0, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true });
      if (spinner) gsap.to(spinner, { rotate: 360, transformOrigin: "center", duration: 0.9, ease: "none", repeat: -1 });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.6 });
          tl.set([drafting, caret], { opacity: 1 })
            .set(ready, { opacity: 0, y: -4 })
            .set(check, { strokeDashoffset: CHECK_LEN })
            .set(fills, { scaleX: 0 })
            .to(fills, { scaleX: 1, duration: 0.34, ease: "power1.inOut", stagger: 0.16 })
            .to(drafting, { opacity: 0, y: -4, duration: 0.3, ease: "power2.in" }, "+=0.1")
            .to(ready, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" }, "<")
            .to(caret, { opacity: 0, duration: 0.2 }, "<")
            .to(check, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, "<0.05")
            .to({}, { duration: 2.2 }) // hold the finished draft
            .to(fills, { opacity: 0, duration: 0.4, ease: "power1.in" })
            .set(fills, { opacity: 1 });
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="rounded-lg border border-[#E0E6F5] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex rounded-full bg-[#EBF0FA] px-2 py-0.5 text-[10px] font-semibold text-[#1A4FBF]">
          Appeal letter
        </span>

        {/* Status: the two pills share the slot and cross-fade. */}
        <span className="relative ml-auto inline-flex h-[18px] items-center">
          <span data-drafting className="absolute right-0 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#EBF0FA] px-2 py-0.5 text-[10px] font-semibold text-[#1A4FBF]">
            <svg data-spinner className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
              <path d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Drafting
          </span>
          <span data-ready className="absolute right-0 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
            <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
              <path data-check d="M2.5 6.5 5 9l4.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ready for review
          </span>
        </span>
      </div>

      <div className="space-y-2">
        {LINES.map((w, i) => (
          <div key={i} className={`relative flex items-center ${w}`}>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EBF0FA]">
              <span data-fill className="block h-full rounded-full bg-gradient-to-r from-[#9DB4E0] to-[#C7D4EA]" />
            </span>
            {i === LINES.length - 1 && (
              <span data-caret className="ml-1 h-2.5 w-[2px] shrink-0 rounded-full bg-[#1A4FBF]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Payer */

/** A vague code resolved into a specific fix. The remark chip drops in, a pulse
 *  of light streams down the wire, and on each arrival the green remedy card
 *  flashes and its check confirms. */
export function PayerMotif() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", ref.current);
      const remark = ref.current?.querySelector<HTMLElement>("[data-remark]") ?? null;
      const glow = ref.current?.querySelector<HTMLElement>("[data-glow]") ?? null;
      const check = ref.current?.querySelector<SVGPathElement>("[data-check]") ?? null;
      if (!steps.length) return;

      const CHECK_LEN = 16;

      if (prefersReducedMotion()) {
        gsap.set(steps, { opacity: 1, y: 0 });
        gsap.set(remark, { opacity: 1, scale: 1 });
        gsap.set(check, { strokeDashoffset: 0 });
        return;
      }

      gsap.set(steps, { opacity: 0, y: 12 });
      gsap.set(remark, { opacity: 0, scale: 0.6, x: -6 });
      gsap.set(check, { strokeDasharray: CHECK_LEN, strokeDashoffset: CHECK_LEN });
      gsap.set(glow, { opacity: 0 });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.timeline()
            .to(steps, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.18 })
            .to(remark, { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(2.2)" }, "-=0.2");

          animateFlowWires(ref.current);

          // Sync the remedy card's flash + check to the pulse cadence (1.95s).
          gsap
            .timeline({ repeat: -1, delay: 1.2 })
            .to(glow, { opacity: 0.85, duration: 0.35, ease: "power2.out" })
            .to(check, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, "<")
            .to(glow, { opacity: 0, duration: 0.7, ease: "power2.in" }, "+=0.3")
            .set(check, { strokeDashoffset: CHECK_LEN })
            .to({}, { duration: 0.5 });
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex flex-col items-start">
      <div data-step className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-mono text-xs font-semibold text-red-600">
          CO-16
        </span>
        <span data-remark className="inline-flex items-center rounded-md border border-red-200 bg-red-50/70 px-2 py-1 font-mono text-[10px] font-semibold text-red-500">
          + N290
        </span>
      </div>

      <LightPulseLine x1={11} y1={2} x2={11} y2={34} w={22} h={36} className="my-0.5 text-[#1A4FBF]" />

      <div data-step className="relative">
        <span data-glow aria-hidden className="pointer-events-none absolute -inset-1 rounded-xl bg-green-400/30 opacity-0 blur-md" />
        <span className="relative inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
            <path data-check d="M4 8.5 7 11l5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add rendering-provider NPI, resubmit as corrected claim
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- EHR */

/** The EHR sits calm and unchanged while Yeam runs beside it: an 835 keeps
 *  arriving from the clearinghouse into the Yeam node, which carries a spinning
 *  processing ring and a soft brand glow. */
export function EhrMotif() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ring = ref.current?.querySelector<SVGElement>("[data-ring]") ?? null;
      const glow = ref.current?.querySelector<HTMLElement>("[data-glow]") ?? null;
      const packet = ref.current?.querySelector<HTMLElement>("[data-packet]") ?? null;
      if (prefersReducedMotion()) {
        gsap.set(packet, { opacity: 0 });
        return;
      }

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          animateFlowWires(ref.current);
          if (ring) gsap.to(ring, { rotate: 360, transformOrigin: "center", duration: 3, ease: "none", repeat: -1 });
          if (glow) gsap.to(glow, { opacity: 0.2, duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true });

          // An 835 drops into the Yeam node on a loop.
          if (packet) {
            gsap
              .timeline({ repeat: -1, repeatDelay: 0.6 })
              .fromTo(
                packet,
                { opacity: 0, y: -14, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
              )
              .to(packet, { opacity: 0, y: 6, duration: 0.4, ease: "power2.in" }, "+=0.8");
          }
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex items-center gap-2">
      <div className="flex-1 rounded-lg border border-[#E0E6F5] bg-white px-3 py-4 text-center">
        <p className="text-xs font-semibold text-[#1C1C1C]">Your EHR</p>
        <p className="mt-1 text-[11px] text-[#5A6A8A]">unchanged</p>
      </div>

      <LightPulseLine x1={2} y1={9} x2={46} y2={9} w={48} h={18} className="shrink-0 text-[#1A4FBF]" />

      <div className="relative flex-1">
        <span data-glow aria-hidden className="pointer-events-none absolute -inset-2 rounded-2xl bg-[#1A4FBF] opacity-0 blur-xl" />

        {/* incoming 835 */}
        <span
          data-packet
          className="pointer-events-none absolute -top-2 left-1/2 z-10 inline-flex -translate-x-1/2 rounded-md border border-[#A8BFEE] bg-white px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#1A4FBF] shadow-sm"
        >
          835
        </span>

        <div className="relative rounded-lg border border-[#A8BFEE] bg-[#EBF0FA] px-3 py-4 text-center">
          <span className="mb-1 inline-flex items-center justify-center gap-1.5">
            <svg data-ring className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#1A4FBF" strokeOpacity="0.25" strokeWidth="1.5" />
              <path d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5" stroke="#1A4FBF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-xs font-semibold text-[#1A4FBF]">Yeam</p>
          </span>
          <p className="text-[11px] text-[#4A5A7A]">works the denials</p>
        </div>
      </div>
    </div>
  );
}
