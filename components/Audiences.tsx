"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Who this is for.
 *
 * Written for billing companies rather than clinic roles. A billing company
 * already does denial work by hand, carries several practices' volume, needs no
 * EHR from us, and improves its own margin by working more denials per head,
 * so one sale reaches many practices. The clinic-role version this replaced
 * pitched an AI workforce the product does not ship.
 *
 * The three cards used to sit side by side. They now stack: on desktop each card
 * is position:sticky at a slightly lower offset than the last, so scrolling
 * gathers them into a deck with each earlier card peeking above the next. Small
 * screens and reduced-motion visitors get the plain vertical list instead, since
 * a sticky deck is awkward on a short viewport and is motion nobody asked for.
 */

const audiences = [
  {
    role: "Billing company owner",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    headline: "Work more denials per biller, not more billers.",
    points: [
      "Triage arrives sorted, so nobody reads 400 remits to find the live ones",
      "Margin improves without adding headcount",
      "One workspace across every practice you serve",
    ],
  },
  {
    role: "Denial management lead",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    headline: "Nothing dies in the queue on a filing deadline.",
    points: [
      "Every denial carries its remaining days, by payer",
      "Corrected claims separated from appeals before anyone starts writing",
      "Dead denials marked dead, so nobody works them twice",
    ],
  },
  {
    role: "Practice you bill for",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    headline: "Keep your EHR. Recover the revenue anyway.",
    points: [
      "No rip and replace: denials come from the clearinghouse, not the chart",
      "Every response reviewed and approved before it is sent",
      "Repeat denials surfaced so the same mistake stops recurring",
    ],
  },
];

/**
 * One accent per role so the deck does not read as three identical cards. The
 * chip / role label / check / number all sit on tokens that already have a
 * dark-theme entry in globals.css (blue, the green role-chip, the purple
 * role-chip), so they survive the theme flip. The rail (solid) and the drifting
 * sheen (soft, translucent) are applied by inline style: the rail reads on
 * either surface, and the sheen is transparent enough to sit over white in light
 * mode and the dark surface in dark mode without a per-theme override.
 */
const ACCENTS = [
  { chip: "bg-blue-50 text-blue-600", role: "text-blue-600", check: "text-blue-500", num: "text-blue-600", solid: "#1A4FBF", soft: "rgba(26,79,191,0.13)" },
  { chip: "bg-[#F0F7E8] text-[#5C8A3A]", role: "text-[#5C8A3A]", check: "text-[#5C8A3A]", num: "text-[#5C8A3A]", solid: "#5C8A3A", soft: "rgba(92,138,58,0.13)" },
  { chip: "bg-[#F5F0FA] text-[#6B4A8A]", role: "text-[#6B4A8A]", check: "text-[#6B4A8A]", num: "text-[#6B4A8A]", solid: "#6B4A8A", soft: "rgba(107,74,138,0.14)" },
];

export default function Audiences() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Starts false so SSR and the first client render agree; flips to true only
  // when the visitor prefers reduced motion, which drops the sticky deck.
  const [reduce, setReduce] = useState(false);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      if (reduced) setReduce(true);

      const header = gsap.utils.toArray<HTMLElement>("[data-reveal]", rootRef.current);
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", rootRef.current);
      const icons = gsap.utils.toArray<HTMLElement>("[data-icon]", rootRef.current);

      if (reduced) {
        gsap.set([...header, ...cards], { opacity: 1, y: 0 });
        return;
      }

      gsap.set([...header, ...cards], { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(header, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 });
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.1,
          });

          // Each card's icon keeps a slow, out-of-phase bob so the deck feels
          // alive without pulling the eye off the copy.
          icons.forEach((icon, i) => {
            gsap.to(icon, {
              y: -5,
              duration: 2.4,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: 0.6 + i * 0.4,
            });
          });
        },
      });

      // On desktop, where the cards form a sticky deck, scrub each card down a
      // touch (scale, not opacity, to avoid fighting the entrance fade) as the
      // next one rises to cover it. This makes the stack feel like it settles
      // instead of just holding still.
      const wraps = gsap.utils.toArray<HTMLElement>("[data-card-wrap]");
      gsap.matchMedia().add("(min-width: 768px)", () => {
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card, {
            scale: 0.94,
            ease: "none",
            scrollTrigger: {
              trigger: wraps[i + 1],
              start: "top 32%",
              end: "top 12%",
              scrub: true,
            },
          });
        });
      });

      // Ambient glossy sheen: each card's accent glow drifts slowly and out of
      // phase with the others, so the deck feels alive without pulling the eye
      // off the copy. Only runs past the reduced-motion return above.
      const sheens = gsap.utils.toArray<HTMLElement>("[data-sheen]", rootRef.current);
      sheens.forEach((s, i) => {
        gsap.to(s, {
          xPercent: 14,
          yPercent: 10,
          scale: 1.18,
          duration: 6.5 + i,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.7,
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="py-20 md:py-28 px-6 bg-slate-50">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-14 max-w-3xl">
          <p
            data-reveal
            className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3"
          >
            Built for the people who work denials
          </p>
          <h2 data-reveal className="text-3xl md:text-5xl font-light tracking-tight text-slate-900">
            Most denials are never worked at all.
          </h2>
          <p data-reveal className="mt-5 text-lg leading-relaxed text-slate-600">
            On ACA Marketplace plans, fewer than 1% of denied claims are ever
            appealed, and about a third of the ones that are get overturned. The
            money is sitting on the table because writing the appeal is slow,
            manual work.
          </p>
          <p data-reveal className="mt-3">
            <Link
              href="/blog/payer-denial-playbook"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              See the data behind this →
            </Link>
          </p>
        </div>

        <div className="max-w-3xl">
          {audiences.map((a, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={a.role}
                data-card-wrap
                className={reduce ? "mb-6 last:mb-0" : "mb-6 md:mb-0 md:sticky"}
                style={reduce ? undefined : { top: `${6 + i * 2.5}rem`, zIndex: i + 1 }}
              >
                <div
                  data-card
                  className="relative overflow-hidden rounded-3xl bg-white p-8 pl-10 sm:p-10 sm:pl-12 border border-slate-200 shadow-sm md:shadow-xl md:shadow-slate-900/5"
                >
                  {/* Accent rail down the left edge. */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1.5"
                    style={{ backgroundColor: accent.solid }}
                  />
                  {/* Glossy sheen: a soft accent glow that drifts slowly behind
                      the content, so the card is quietly alive, not a flat panel. */}
                  <span
                    data-sheen
                    aria-hidden
                    className="pointer-events-none absolute -left-1/4 -top-1/3 h-[130%] w-3/4 rounded-full blur-2xl"
                    style={{ background: `radial-gradient(circle, ${accent.soft}, transparent 70%)` }}
                  />

                  <div className="relative">
                    <div className="mb-6 flex items-start justify-between">
                      <div data-icon className={`w-14 h-14 rounded-2xl ${accent.chip} flex items-center justify-center`}>
                        {a.icon}
                      </div>
                      <span className={`text-4xl font-extralight leading-none tabular-nums ${accent.num}`}>
                        0{i + 1}
                      </span>
                    </div>
                    <div className={`text-xs font-semibold ${accent.role} uppercase tracking-wider mb-2.5`}>
                      {a.role}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5 leading-snug">
                      {a.headline}
                    </h3>
                    <ul className="space-y-3">
                      {a.points.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-[15px] text-slate-600">
                          <svg
                            className={`w-5 h-5 ${accent.check} shrink-0 mt-0.5`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
