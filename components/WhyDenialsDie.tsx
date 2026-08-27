"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Why denials die.
 *
 * This replaced three cards of three bullets each — nine claims competing for
 * one point, in the house style of every B2B page ever generated. The point was
 * always a sequence, so it is written as one: four flat statements of what
 * happens when nobody works a denial, then the turn.
 *
 * Server HTML renders the lines visible. GSAP hides them in a layout effect and
 * reveals them on scroll, so a JS failure leaves the section readable rather
 * than blank.
 */

const LINES = [
  "A denial lands in a queue.",
  "Nobody reads 400 remits to find the live ones.",
  "The filing window closes.",
  "The money is gone.",
];

export default function WhyDenialsDie() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>("[data-line]");
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top 70%",
      once: true,
      onEnter: () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.35,
        }),
    });
  }, { scope: rootRef });

  return (
    <section ref={rootRef} className="py-24 md:py-32 px-6 bg-[#F7F9FE]">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6 md:space-y-8">
          {LINES.map((line) => (
            <p
              key={line}
              data-line
              className="text-[clamp(1.5rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[#5A6A8A]"
            >
              {line}
            </p>
          ))}
        </div>

        <p
          data-line
          className="mt-12 md:mt-16 pt-10 border-t border-[#E0E6F5] text-[clamp(1.5rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-[#1A4FBF]"
        >
          Yeam works the ones that still pay.
        </p>
      </div>
    </section>
  );
}
