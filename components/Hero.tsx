"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * One line, one button.
 *
 * What this replaced: a price pill, a two-tone headline, a four-line paragraph,
 * two competing buttons, four stat cards and a live appeal drafter — all above
 * the fold, all at once. The drafter was the only part doing real work, and it
 * now has its own section under the worklist where the story reaches it in
 * order. What's left here has to say what Yeam is and get out of the way.
 */

const PROOF = [
  "Runs in your browser",
  "Nothing uploaded",
  "No account",
  "Works alongside your EHR",
];

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Staggered entrance. useGSAP runs in a layout effect, so there is no flash.
  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>("[data-hero-anim]");
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(items, { opacity: 0, y: 24 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.05,
    });
  }, { scope: rootRef });

  return (
    <section
      ref={rootRef}
      className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 bg-[#FFFFFF] overflow-hidden"
    >
      {/* Faint grid with a human-heartbeat pulse (background only) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1A4FBF 1px, transparent 1px), linear-gradient(to right, #1A4FBF 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.05,
          animation: "gridHeartbeat 2.8s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <h1
            data-hero-anim
            className="text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold text-[#1C1C1C] leading-[1.05] tracking-tight"
          >
            A <span className="text-[#1A4FBF]">denial recovery</span> platform
            for medical billing.
          </h1>

          <div data-hero-anim className="mt-9">
            <a
              href="#triage"
              className="inline-block px-7 py-3.5 bg-[#1A4FBF] text-white font-semibold rounded-xl hover:bg-[#1540A0] transition-colors shadow-sm text-base"
            >
              Run your denial export
            </a>
          </div>

          {/* One thin line where four cards used to sit. Same claims, a tenth
              of the weight. */}
          <ul
            data-hero-anim
            className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#5A6A8A]"
          >
            {PROOF.map((item, i) => (
              <li key={item} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-[#8A9BBF]">·</span>}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
