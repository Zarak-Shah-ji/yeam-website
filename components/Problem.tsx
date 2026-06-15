"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const introPanel = {
  type: "intro" as const,
};

const statPanels = [
  {
    type: "stat" as const,
    stat: "$800B",
    headline: "Spent on medical admin every year.",
    sub: "Most of it goes to repetitive tasks your AI staff can handle today.",
  },
  {
    type: "stat" as const,
    stat: "4 hrs",
    headline: "Lost to paperwork, per provider, per day.",
    sub: "Less time for patients. More burnout. Nothing to show for it.",
  },
  {
    type: "stat" as const,
    stat: "60%",
    headline: "Of denied claims are never appealed.",
    sub: "That's money left on the table on every single denial.",
  },
];

const allPanels = [introPanel, ...statPanels];

export default function Problem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const els = panelsRef.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    els.forEach((el, i) => {
      gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${allPanels.length * 100}%`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const idx = Math.min(allPanels.length - 1, Math.floor(self.progress * allPanels.length));
          setActiveIndex(idx);
        },
      },
    });

    els.forEach((el, i) => {
      if (i === 0) return;
      tl.to(els[i - 1], { opacity: 0, y: -40, duration: 0.4 }, i - 0.5)
        .fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, i - 0.1);
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative bg-[#FFFFFF] overflow-hidden" style={{ height: "100vh" }}>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {allPanels.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === activeIndex ? "#1A4FBF" : "#D0D5E8",
              transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {allPanels.map((p, i) => (
        <div
          key={i}
          ref={(el) => { panelsRef.current[i] = el; }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          {p.type === "intro" ? (
            <div className="text-center">
              <h2
                className="font-extrabold text-[#1C1C1C] leading-none tracking-tight"
                style={{ fontSize: "6.75rem" }}
              >
                The Problem
              </h2>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center">
              <div className="font-extrabold text-[#1A4FBF] mb-2 tabular-nums leading-none" style={{ fontSize: "6.75rem" }}>
                {p.stat}
              </div>
              <h2 className="font-bold text-[#1C1C1C] mb-1.5 leading-tight" style={{ fontSize: "3.75rem" }}>
                {p.headline}
              </h2>
              <p className="text-[#6A7A9A] max-w-2xl mx-auto" style={{ fontSize: "2.625rem" }}>{p.sub}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
