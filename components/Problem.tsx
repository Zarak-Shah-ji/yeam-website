"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    stat: "$800B",
    headline: "Spent on medical admin every year.",
    sub: "Most of it goes to repetitive tasks your AI staff can handle today.",
  },
  {
    stat: "4 hrs",
    headline: "Lost to paperwork, per provider, per day.",
    sub: "Less time for patients. More burnout. Nothing to show for it.",
  },
  {
    stat: "60%",
    headline: "Of denied claims are never appealed.",
    sub: "That's money left on the table on every single denial.",
  },
];

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
        end: `+=${panels.length * 100}%`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
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
    <div ref={containerRef} className="relative bg-[#1C1C1C] overflow-hidden" style={{ height: "100vh" }}>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-[#5A5A5A] text-sm font-semibold uppercase tracking-wider">
          The Problem
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {panels.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === activeIndex ? "#6B9BF0" : "#3A3A3A",
              transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {panels.map((p, i) => (
        <div
          key={i}
          ref={(el) => { panelsRef.current[i] = el; }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl md:text-7xl font-extrabold text-[#6B9BF0] mb-4 tabular-nums leading-none">
              {p.stat}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {p.headline}
            </h2>
            <p className="text-lg text-[#6A6A6A] max-w-xl mx-auto">{p.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
