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
 *
 * Colour is #1C1C1C rather than white because the footer now shares the page
 * background instead of sitting on a dark slab; that token has a dark-mode
 * entry, so the mark inverts with the theme.
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
          className="font-black text-[#1C1C1C]"
          style={{
            fontSize: "clamp(6rem, 20vw, 16rem)",
            opacity: 0.06,
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
