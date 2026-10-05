"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The privacy pillar, front and centre under the hero.
 *
 * Four guarantees, each with its own small self-animating motif drawn in inline
 * SVG on currentColor so it themes for free. The motion follows the house
 * pattern the FeatureMotifs use: a scroll-in entrance once, then a quiet ambient
 * loop per tile, all behind prefers-reduced-motion (JS guard here + the CSS
 * backstop in globals.css).
 *
 * Every colour class below already has a dark-theme entry in globals.css
 * (bg-[#F7F9FE], bg-white, border-[#E0E6F5], text-[#1A4FBF], text-green-600,
 * text tokens), so the whole band flips with the footer toggle.
 *
 * The four claims are ones the product already makes elsewhere on the site
 * (worklist teaser, pricing FAQ, architecture gaps). A fifth, "no model
 * training", is intentionally left out until it can be confirmed true of the
 * paid pipeline — swap one tile's copy in once verified.
 */

type Tile = {
  label: string;
  detail: string;
  motif: React.ReactNode;
};

const TILES: Tile[] = [
  {
    label: "Runs in your browser",
    detail: "The free worklist reads your export locally. No upload, no account.",
    motif: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <rect x="6" y="9" width="36" height="30" rx="3" stroke="currentColor" strokeWidth="2" />
        <line x1="6" y1="17" x2="42" y2="17" stroke="currentColor" strokeWidth="2" />
        <circle cx="10.5" cy="13" r="1.1" fill="currentColor" />
        <circle cx="14.5" cy="13" r="1.1" fill="currentColor" />
        {/* padlock, centred in the viewport area */}
        <circle data-browser-glow cx="24" cy="29" r="9" fill="currentColor" opacity="0.12" />
        <rect data-browser-lock x="19" y="27" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <path data-browser-lock d="M21 27v-2.5a3 3 0 0 1 6 0V27" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Zero data retention",
    detail: "Nothing is stored. Close the tab and it is gone.",
    motif: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <rect x="10" y="9" width="28" height="30" rx="3" stroke="currentColor" strokeWidth="2" />
        <rect data-retain-row x="15" y="15" width="18" height="3" rx="1.5" fill="currentColor" />
        <rect data-retain-row x="15" y="22" width="18" height="3" rx="1.5" fill="currentColor" />
        <rect data-retain-row x="15" y="29" width="12" height="3" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "No model training",
    detail: "Your claims are worked, never harvested to train a model.",
    motif: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        {/* a tiny net: three nodes and their edges, with a barrier drawn across */}
        <line x1="14" y1="16" x2="34" y2="16" stroke="currentColor" strokeWidth="1.75" opacity="0.5" />
        <line x1="14" y1="16" x2="24" y2="33" stroke="currentColor" strokeWidth="1.75" opacity="0.5" />
        <line x1="34" y1="16" x2="24" y2="33" stroke="currentColor" strokeWidth="1.75" opacity="0.5" />
        <circle data-train-node cx="14" cy="16" r="3.5" fill="currentColor" />
        <circle data-train-node cx="34" cy="16" r="3.5" fill="currentColor" />
        <circle data-train-node cx="24" cy="33" r="3.5" fill="currentColor" />
        <line data-train-slash x1="10" y1="38" x2="38" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" pathLength={1} />
      </svg>
    ),
  },
  {
    label: "PHI only under a BAA",
    detail: "Real claim data runs on a signed BAA, never in the public demo.",
    motif: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <path d="M13 8h14l8 8v24a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
        <path d="M27 8v8h8" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="23" x2="28" y2="23" stroke="currentColor" strokeWidth="1.75" opacity="0.45" />
        <line x1="16" y1="28" x2="24" y2="28" stroke="currentColor" strokeWidth="1.75" opacity="0.45" />
        <path
          data-baa-check
          d="M16 33.5l4 4 8-8.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="text-green-600"
        />
      </svg>
    ),
  },
];

export default function PrivacyBar() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const head = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", root);

      const q = (sel: string) => gsap.utils.toArray<SVGElement>(sel, root);
      const glow = q("[data-browser-glow]");
      const lock = q("[data-browser-lock]");
      const retainRows = q("[data-retain-row]");
      const trainNodes = q("[data-train-node]");
      const trainSlash = q("[data-train-slash]");
      const baaCheck = q("[data-baa-check]");

      // Self-drawing strokes start hidden (pathLength normalised to 1).
      gsap.set([...trainSlash, ...baaCheck], { strokeDasharray: 1, strokeDashoffset: 1 });

      if (prefersReducedMotion()) {
        gsap.set([...head, ...tiles], { opacity: 1, y: 0 });
        gsap.set([...trainSlash, ...baaCheck], { strokeDashoffset: 0 });
        return;
      }

      gsap.set([...head, ...tiles], { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: root,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(head, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 });
          gsap.to(tiles, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.1,
            onComplete: startAmbient,
          });
          // Draw the barrier and the check as the tiles land.
          gsap.to(trainSlash, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", delay: 0.5 });
        },
      });

      function startAmbient() {
        // 1 · Browser: the lock breathes, its glow pulsing out of phase.
        gsap.to(glow, { opacity: 0.22, scale: 1.15, transformOrigin: "center", duration: 2.2, ease: "sine.inOut", repeat: -1, yoyo: true });
        gsap.to(lock, { y: -1.5, duration: 2.2, ease: "sine.inOut", repeat: -1, yoyo: true });

        // 2 · Retention: rows appear, then dissolve upward — data that never sticks.
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.6 })
          .set(retainRows, { opacity: 0, y: 4 })
          .to(retainRows, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.18 })
          .to({}, { duration: 0.9 })
          .to(retainRows, { opacity: 0, y: -6, duration: 0.5, ease: "power2.in", stagger: 0.12 });

        // 3 · No training: the nodes pulse, but the barrier holds — nothing gets through.
        gsap.to(trainNodes, { scale: 0.7, transformOrigin: "center", duration: 1.3, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.25 });

        // 4 · BAA: the check redraws on a slow loop.
        gsap
          .timeline({ repeat: -1, repeatDelay: 2.4 })
          .to(baaCheck, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" })
          .to(baaCheck, { opacity: 1, duration: 1.6 })
          .set(baaCheck, { strokeDashoffset: 1 });
      }
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="bg-[#F7F9FE] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <p data-reveal className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1A4FBF]">
          Private by default
        </p>
        <h2 data-reveal className="max-w-3xl text-2xl font-light tracking-tight text-[#1C1C1C] md:text-4xl">
          Your patients&apos; data{" "}
          <span className="font-semibold">never has to leave your control</span>.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((t) => (
            <div
              key={t.label}
              data-tile
              className="rounded-2xl border border-[#E0E6F5] bg-white p-6 shadow-sm"
            >
              <div className="text-[#1A4FBF]">{t.motif}</div>
              <h3 className="mt-4 text-base font-semibold text-[#1C1C1C]">{t.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5A6A8A]">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
