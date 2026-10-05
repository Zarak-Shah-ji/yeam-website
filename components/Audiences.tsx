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
 * The three cards stack into a deck on desktop: each is position:sticky at a
 * 2.5rem-lower offset than the last, so scrolling gathers them with each earlier
 * card peeking (its number + role) above the next. As a card is covered it
 * settles — a small scale + dim anchored to its pinned TOP edge (transform-origin
 * center top), which is what keeps the peek and the seam from drifting. Equal
 * min-heights keep the stair even. Small screens and reduced-motion visitors get
 * the plain vertical list, gated in CSS (md: + motion-reduce:) so the static
 * layout is correct on the first paint, not after a JS flip.
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

/**
 * One datapoint per card, surfaced in the sticky left panel as each card takes
 * the front of the deck. All three are drawn from the linked blog post
 * (/blog/payer-denial-playbook) — KFF/CMS ACA Marketplace figures — so "see the
 * data behind this" actually leads to the numbers shown here. Index matches the
 * `audiences` order: owner → lead → practice.
 */
const DATAPOINTS = [
  { stat: "<1%", label: "of denied claims are ever appealed — a backlog nobody works", accent: "text-blue-600" },
  { stat: "34%", label: "of denials are overturned when someone actually appeals", accent: "text-[#5C8A3A]" },
  { stat: "61%", label: "of denials are administrative or unspecified — fixable, not clinical", accent: "text-[#6B4A8A]" },
];

export default function Audiences() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Which card is at the front of the deck; drives the left panel's datapoint.
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

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

      // On desktop, settle each card as the next rises to cover it: a small
      // scale plus a dim, anchored to the pinned TOP edge (transform-origin
      // center top) so the peek and the seam stay put — scaling from the centre
      // is what made the old deck look broken. The scrub is timed to the
      // covering card reaching this card's resting top, and gated to
      // no-preference so reduced-motion visitors get the flat list.
      const BASE = 96; // 6rem, the first card's sticky top
      const PEEK = 40; // 2.5rem, the stair between cards
      gsap.matchMedia().add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          cards.slice(0, -1).forEach((card, i) => {
            gsap.fromTo(
              card,
              { scale: 1, filter: "brightness(1)" },
              {
                scale: 0.96,
                filter: "brightness(0.93)",
                transformOrigin: "center top",
                ease: "none",
                scrollTrigger: {
                  trigger: cards[i + 1],
                  start: "top bottom",
                  end: `top ${BASE + i * PEEK}px`,
                  scrub: true,
                },
              },
            );
          });
        },
      );

      // Surface a different datapoint in the left panel as each card takes the
      // front of the deck: when a card reaches its resting top it becomes the
      // focus, so switch to its number; reverse on the way back up. Desktop +
      // no-preference only — the flat/reduced layout just keeps the first.
      gsap.matchMedia().add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          cards.forEach((_, i) => {
            ScrollTrigger.create({
              trigger: cards[i],
              start: `top ${BASE + i * PEEK}px`,
              onEnter: () => setActive(i),
              onLeaveBack: () => setActive(Math.max(0, i - 1)),
            });
          });
        },
      );

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
      <div className="max-w-[1600px] mx-auto grid gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 lg:gap-24">
        {/* Left: the editorial intro, pinned while the deck scrolls past it. */}
        <div className="md:sticky md:top-28 md:self-start motion-reduce:static!">
          <p
            data-reveal
            className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3"
          >
            Built for the people who get claims paid
          </p>
          <h2 data-reveal className="text-3xl md:text-5xl font-light tracking-tight text-slate-900">
            Most denials are never worked at all.
          </h2>

          {/* Datapoint that changes as each card takes the front of the deck.
              min-height holds the space so the body copy below never jumps. */}
          <div data-reveal className="mt-8 min-h-[7rem]">
            <div
              key={active}
              style={{ animation: "fadeSlideIn 0.35s ease-out" }}
              className="flex items-start gap-4"
            >
              <span className={`text-6xl font-extralight tabular-nums md:text-7xl ${DATAPOINTS[active].accent}`}>
                {DATAPOINTS[active].stat}
              </span>
              <span className="mt-1 max-w-[14rem] text-sm leading-snug text-slate-600">
                {DATAPOINTS[active].label}
              </span>
            </div>
          </div>

          <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-slate-600">
            Nearly one in five in-network claims on ACA Marketplace plans is denied,
            and most denials are administrative — fixable, not clinical. Almost none
            are ever appealed, so the money just sits on the table.
          </p>
          <p data-reveal className="mt-6">
            <Link
              href="/blog/payer-denial-playbook"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              See the data behind this →
            </Link>
          </p>
        </div>

        {/* Right: the stacking deck fills the rest of the width. */}
        <div>
          {audiences.map((a, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={a.role}
                data-card-wrap
                className="mb-6 md:sticky motion-reduce:static!"
                style={{ top: `${6 + i * 2.5}rem`, zIndex: i + 1 }}
              >
                <div
                  data-card
                  className="relative overflow-hidden rounded-3xl bg-white p-8 pl-10 sm:p-10 sm:pl-12 border border-slate-200 shadow-sm md:min-h-[24rem] md:shadow-[0_18px_50px_-20px_rgba(15,23,42,0.22)]"
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
                      <span className={`text-5xl font-extralight leading-none tabular-nums ${accent.num}`}>
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
