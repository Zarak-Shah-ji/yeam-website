"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// `target` drives the count-up; `prefix`/`suffix` wrap it. `bar` is the
// magnitude of the visual accent (a filling bar), purely illustrative.
const STATS = [
  {
    prefix: "$",
    target: 800,
    suffix: "B",
    bar: 88,
    headline: "Spent on medical admin every year.",
    sub: "Most of it is repetitive work AI can handle.",
  },
  {
    prefix: "",
    target: 4,
    suffix: " hrs",
    bar: 55,
    headline: "Lost to paperwork, per provider, per day.",
    sub: "Less time for patients, more burnout.",
  },
  {
    prefix: "",
    target: 60,
    suffix: "%",
    bar: 60,
    headline: "Of denied claims are never appealed.",
    sub: "Revenue left on the table on every denial.",
  },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Problem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const reduce = prefersReducedMotion();

    // Header reveal
    const headerItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (reduce) {
      gsap.set(headerItems, { opacity: 1, y: 0 });
    } else {
      gsap.set(headerItems, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        once: true,
        onEnter: () =>
          gsap.to(headerItems, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
          }),
      });
    }

    // Cards: reveal + count-up + accent bar
    STATS.forEach((stat, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      const numEl = card.querySelector<HTMLElement>("[data-num]");
      const barEl = card.querySelector<HTMLElement>("[data-bar]");

      if (reduce) {
        gsap.set(card, { opacity: 1, y: 0 });
        if (numEl) numEl.textContent = `${stat.prefix}${stat.target}${stat.suffix}`;
        if (barEl) gsap.set(barEl, { width: `${stat.bar}%` });
        return;
      }

      gsap.set(card, { opacity: 0, y: 32 });
      if (numEl) numEl.textContent = `${stat.prefix}0${stat.suffix}`;
      if (barEl) gsap.set(barEl, { width: "0%" });

      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: card,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(card, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: i * 0.1 });
          gsap.to(counter, {
            val: stat.target,
            duration: 1.4,
            delay: i * 0.1,
            ease: "power2.out",
            onUpdate: () => {
              if (numEl) numEl.textContent = `${stat.prefix}${Math.round(counter.val)}${stat.suffix}`;
            },
          });
          if (barEl) {
            gsap.to(barEl, { width: `${stat.bar}%`, duration: 1.4, delay: i * 0.1, ease: "power2.out" });
          }
        },
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-[#FFFFFF] overflow-hidden py-20 md:py-28 px-6">

      {/* Soft gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] max-w-full h-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26,79,191,0.10) 0%, rgba(107,155,240,0.06) 45%, transparent 72%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p data-reveal className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
            The Problem
          </p>
          <h2 data-reveal className="text-3xl md:text-4xl font-bold text-[#1C1C1C] tracking-tight">
            Medical admin is bleeding your clinic dry.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {STATS.map((stat, i) => (
            <div
              key={stat.headline}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="bg-white rounded-2xl border border-[#E0E6F5] shadow-sm p-6 md:p-7"
            >
              <div
                data-num
                className="text-5xl md:text-6xl font-extrabold text-[#1A4FBF] tabular-nums leading-none mb-4"
              >
                {stat.prefix}{stat.target}{stat.suffix}
              </div>

              {/* Visual accent: filling magnitude bar */}
              <div className="h-1.5 w-full bg-[#EBF0FA] rounded-full overflow-hidden mb-4">
                <div
                  data-bar
                  className="h-full rounded-full bg-gradient-to-r from-[#1A4FBF] to-[#6B9BF0]"
                  style={{ width: `${stat.bar}%` }}
                />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[#1C1C1C] leading-snug mb-2">
                {stat.headline}
              </h3>
              <p className="text-sm md:text-base text-[#6A7A9A] leading-relaxed">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        <p data-reveal className="text-center text-base md:text-lg text-[#4A5A7A] mt-12 max-w-xl mx-auto">
          Yeam turns all three into automated work.
        </p>
      </div>
    </section>
  );
}
