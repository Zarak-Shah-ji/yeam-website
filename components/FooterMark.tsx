"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The YEAM watermark, drawn together as the footer arrives.
 *
 * Replaces an opacity loop that pulsed forever whether anyone was looking or
 * not. The letters start apart and settle as you scroll into the footer —
 * scrubbed, so it tracks the scroll rather than playing at it, and it lands
 * exactly when the footer does.
 *
 * The spread offsets are a share of the container width rather than fixed
 * pixels: at 375px a 120px offset would push the M off-screen and add a
 * horizontal scrollbar to every page on the site.
 */

const LETTERS = ["Y", "E", "A", "M"];
const SPREAD = [-0.22, -0.075, 0.075, 0.22];

export default function FooterMark() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-letter]");
    if (prefersReducedMotion()) {
      gsap.set(items, { x: 0 });
      return;
    }

    const width = root.offsetWidth;
    gsap.fromTo(
      items,
      { x: (i: number) => SPREAD[i] * width },
      {
        x: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.closest("footer") ?? root,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }
    );
  }, { scope: rootRef });

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {LETTERS.map((letter) => (
        <span
          key={letter}
          data-letter
          className="font-black text-white"
          style={{
            fontSize: "clamp(6rem, 20vw, 16rem)",
            opacity: 0.05,
            letterSpacing: "0.15em",
            lineHeight: 1,
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
