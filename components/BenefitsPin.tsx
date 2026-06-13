"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    index: 0,
    headline: "AI Receptionist answers\nin 2 rings.",
    sub: "Schedules, reschedules, confirms — 24/7, in any language. Zero hold time.",
    visual: <PhoneVisual />,
  },
  {
    index: 1,
    headline: "Scribe documents\nin real time.",
    sub: "Every encounter captured as a structured SOAP note before the patient leaves the room.",
    visual: <WaveformVisual />,
  },
  {
    index: 2,
    headline: "Claims submitted\nbefore they walk out.",
    sub: "ICD-10 coded, scrubbed, and queued for submission — automatically, every visit.",
    visual: <ClaimVisual />,
  },
];

function PhoneVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        {/* Phone outline */}
        <div className="w-32 h-52 rounded-[2rem] border-4 border-[#C4622D] bg-[#FAF7F2] flex flex-col items-center justify-center gap-3 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#FDF0E8] border-2 border-[#C4622D] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#C4622D]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </div>
          <div className="text-xs text-[#C4622D] font-semibold">Incoming Call</div>
          <div className="text-xs text-[#8A7060]">Patient: Sarah M.</div>
        </div>
        {/* Pulse rings */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-[2rem] border-2 border-[#C4622D] opacity-0"
            style={{
              animation: `ringPulse 2s ease-out ${i * 0.5}s infinite`,
              transform: `scale(${1 + i * 0.12})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function WaveformVisual() {
  const bars = [3, 6, 9, 5, 12, 8, 4, 11, 7, 3, 9, 6, 10, 5, 8, 4, 12, 7, 3, 9, 6, 11, 4, 8];
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-[#1C1C1C] rounded-2xl p-8 w-72">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#C4622D] animate-pulse" />
          <span className="text-xs text-[#8A8A8A] font-medium">Recording encounter…</span>
        </div>
        <div className="flex items-end gap-1 h-16 justify-center">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-[#C4622D]"
              style={{
                height: `${h * 4}px`,
                opacity: 0.4 + (h / 12) * 0.6,
                animation: `waveBar 1.2s ease-in-out ${i * 0.05}s infinite alternate`,
              }}
            />
          ))}
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="h-2 bg-[#2A2A2A] rounded-full w-full" />
          <div className="h-2 bg-[#2A2A2A] rounded-full w-4/5" />
          <div className="h-2 bg-[#2A2A2A] rounded-full w-3/5" />
        </div>
        <div className="mt-3 text-xs text-[#5A5A5A]">SOAP note generating…</div>
      </div>
    </div>
  );
}

function ClaimVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-white rounded-2xl shadow-xl border border-[#E8DDD4] p-6 w-72 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#5C4A3A] uppercase tracking-wider">Claim</span>
          <span className="text-xs font-bold text-[#C4622D] bg-[#FDF0E8] px-2 py-0.5 rounded-full border border-[#E8C9B4]">
            Submitted ✓
          </span>
        </div>
        <div className="space-y-2">
          {[
            { label: "Patient", value: "Mohamed E." },
            { label: "ICD-10", value: "Z00.00" },
            { label: "CPT", value: "99397" },
            { label: "Payer", value: "Texas Medicaid" },
            { label: "Amount", value: "$5,125.00" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-[#8A7060]">{row.label}</span>
              <span className="font-medium text-[#1C1C1C]">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-[#E8DDD4]">
          <div className="flex items-center gap-2 text-xs text-[#5C8A3A]">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"/>
            </svg>
            Submitted in &lt; 30 seconds
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BenefitsPin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
    if (panels.length === 0) return;

    // Set initial state: all panels except first are hidden
    panels.forEach((panel, i) => {
      gsap.set(panel, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${benefits.length * 100}%`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const idx = Math.min(
            benefits.length - 1,
            Math.floor(self.progress * benefits.length)
          );
          setActiveIndex(idx);
        },
      },
    });

    panels.forEach((panel, i) => {
      if (i === 0) return;
      tl.to(panels[i - 1], { opacity: 0, y: -40, duration: 0.4 }, i - 0.5)
        .fromTo(panel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, i - 0.1);
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative bg-[#FAF7F2] overflow-hidden" style={{ height: "100vh" }}>
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      {/* Section label */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-[#C4622D] text-sm font-semibold uppercase tracking-wider">
          What AI Employees Do
        </p>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {benefits.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === activeIndex ? "#C4622D" : "#E8DDD4",
              transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Benefit panels */}
      {benefits.map((b, i) => (
        <div
          key={i}
          ref={(el) => { panelsRef.current[i] = el; }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <div className="text-5xl md:text-6xl font-extrabold text-[#1C1C1C] leading-tight whitespace-pre-line mb-6">
                {b.headline}
              </div>
              <p className="text-xl text-[#5C4A3A] leading-relaxed">{b.sub}</p>
            </div>
            {/* Right: visual */}
            <div className="h-64 md:h-80">
              {b.visual}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
