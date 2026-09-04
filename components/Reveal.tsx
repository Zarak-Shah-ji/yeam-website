"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The shared, Polar-style reveal.
 *
 * Wrap any static (server-rendered) section in <Reveal> and mark the elements
 * that should rise into view with `data-reveal`. Each marked element starts a
 * touch lower and transparent, then settles once the block scrolls into view,
 * with a small stagger so a section assembles rather than popping in at once.
 *
 * This is the calm replacement for the loud hero motion the site used to carry:
 * one gentle fade-and-rise, once, everywhere. Matches the existing ScrollTrigger
 * pattern in Integrations / Audiences / ArchitectureFlow so the whole page reads
 * as one system. Under prefers-reduced-motion it jumps straight to the final
 * state and animates nothing.
 */
export default function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scope the query to this wrapper's own subtree. gsap.utils.toArray with a
      // bare selector queries the whole document, so without the second argument
      // every Reveal on the page would grab (and reveal) every other section's
      // items at once. The second arg confines it to this instance.
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      if (!items.length) return;

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 16 });
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 82%",
        once: true,
        onEnter: () =>
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
          }),
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
