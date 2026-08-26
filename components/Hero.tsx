"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import HeroAppealTool from "./HeroAppealTool";

const STATS = [
  { value: "Live in days",        label: "Not a months-long rollout" },
  { value: "Reads your denials",  label: "EOB, ERA, or a claims export" },
  { value: "Works with your EHR", label: "No rip and replace" },
  { value: "No new hires",        label: "No overtime, no backfill" },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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
      stagger: 0.1,
      delay: 0.05,
    });
  }, { scope: rootRef });

  return (
    <section
      ref={rootRef}
      className="relative pt-28 pb-20 px-6 bg-[#FFFFFF] overflow-hidden"
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

        {/* Headline: badge + single-line H1, spanning the full width */}
        <div>
          <div
            data-hero-anim
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EBF0FA] text-[#1A4FBF] rounded-full text-sm font-medium border border-[#A8BFEE]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A4FBF] inline-block animate-pulse" />
            5 AI roles. 1 clinic. $200/month.
          </div>

          <h1
            data-hero-anim
            className="mt-5 text-[clamp(1.75rem,3.4vw,2.85rem)] font-extrabold text-[#1C1C1C] leading-[1.1] tracking-tight"
          >
            Yeam recovers the revenue{" "}
            <span className="text-[#1A4FBF]">your insurers denied.</span>
          </h1>
        </div>

        {/* Under the headline: supporting copy (left) + product mock (right) */}
        <div className="mt-8 lg:mt-6 grid lg:grid-cols-2 gap-12 lg:gap-10 items-start">

          {/* Left: copy */}
          <div className="max-w-xl">
            <p
              data-hero-anim
              className="text-lg text-[#4A5A7A] leading-relaxed mb-8"
            >
              Our AI drafts each appeal, you approve every one before it&apos;s sent.
            </p>

            <div data-hero-anim className="flex flex-col sm:flex-row gap-3 mb-9">
              <a
                href="#contact"
                className="px-7 py-3.5 bg-[#1A4FBF] text-white font-semibold rounded-xl hover:bg-[#1540A0] transition-colors shadow-sm text-base text-center"
              >
                Request a Demo
              </a>
              {/* See the Platform temporarily hidden until the platform link is fixed
              <a
                href="https://yeamagentsystem.vercel.app/login?callbackUrl=%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-transparent text-[#1A4FBF] font-semibold rounded-xl hover:bg-[#EBF0FA] transition-colors border border-[#1A4FBF] text-base text-center"
              >
                See the Platform
              </a>
              */}
            </div>

            {/* Compact trust row */}
            <div data-hero-anim className="grid grid-cols-2 gap-3">
              {STATS.map((badge) => (
                <div
                  key={badge.label}
                  className="bg-[#FFFFFF]/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-[#E0E6F5]"
                >
                  <div className="text-base font-bold text-[#1A4FBF]">{badge.value}</div>
                  <div className="text-xs text-[#5A6A8A] mt-0.5 leading-snug">{badge.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the live appeal drafter. This replaced an animated mock that
              cycled five fake agent statuses on a timer — decoration that proved
              nothing. Same slot, same chrome, real work. The glow stays; the
              float does not, because a card you click should hold still. */}
          <div data-hero-anim className="relative max-w-xl lg:max-w-none">
            {/* Soft glow behind the card, pushed toward the right edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 -bottom-12 -left-4 -right-16"
              style={{
                background:
                  "radial-gradient(circle at 72% 45%, rgba(26,79,191,0.22) 0%, rgba(107,155,240,0.12) 42%, transparent 72%)",
                animation: "glowPulse 9s ease-in-out infinite",
              }}
            />

            <HeroAppealTool />
          </div>

        </div>
      </div>
    </section>
  );
}
