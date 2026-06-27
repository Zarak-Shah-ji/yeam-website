"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ROLE_CYCLE_MS = 2200;

// On-brand blue shades so each role reads distinctly while the palette stays blue.
const ROLES = [
  { label: "AI Receptionist", dot: "#1A4FBF", status: "4 calls answered", metric: "live" },
  { label: "AI Scribe",       dot: "#1540A0", status: "SOAP note drafted", metric: "done" },
  { label: "AI Coder",        dot: "#6B9BF0", status: "9 charts coded", metric: "+9" },
  { label: "AI Biller",       dot: "#0F2E6B", status: "2 denials appealed", metric: "+2" },
  { label: "AI Nurse",        dot: "#3B6FD4", status: "5 follow-ups sent", metric: "+5" },
];

const STATS = [
  { value: "Live in days",        label: "Not a months-long rollout" },
  { value: "HIPAA + HL7",         label: "Certified and secure" },
  { value: "Works with your EHR", label: "No rip and replace" },
  { value: "No new hires",        label: "No overtime, no backfill" },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeRole, setActiveRole] = useState(0);

  // Cycle the highlighted agent row, unless the user prefers reduced motion.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = setInterval(() => {
      setActiveRole((r) => (r + 1) % ROLES.length);
    }, ROLE_CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

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

      {/* Contained gradient glow (replaces the oversized orbit rings) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-10%] right-[-5%] w-[680px] max-w-full h-[680px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(26,79,191,0.18) 0%, rgba(107,155,240,0.10) 40%, transparent 70%)",
          animation: "glowPulse 9s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">

        {/* Left: copy */}
        <div className="max-w-xl">
          <div
            data-hero-anim
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EBF0FA] text-[#1A4FBF] rounded-full text-sm font-medium mb-6 border border-[#A8BFEE]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A4FBF] inline-block animate-pulse" />
            5 AI roles. 1 clinic. $200/month.
          </div>

          <h1
            data-hero-anim
            className="text-4xl sm:text-5xl font-extrabold text-[#1C1C1C] leading-[1.08] tracking-tight mb-5"
          >
            Your doctors lose 4 hours a day to paperwork.
            <br />
            <span className="text-[#1A4FBF]">Yeam gives it back.</span>
          </h1>

          <p
            data-hero-anim
            className="text-lg text-[#4A5A7A] leading-relaxed mb-8"
          >
            A full AI workforce that runs inside your clinic, around the clock.
          </p>

          <div data-hero-anim className="flex flex-col sm:flex-row gap-3 mb-9">
            <a
              href="#contact"
              className="px-7 py-3.5 bg-[#1A4FBF] text-white font-semibold rounded-xl hover:bg-[#1540A0] transition-colors shadow-sm text-base text-center"
            >
              Book a Demo
            </a>
            <a
              href="https://yeamagentsystem.vercel.app/login?callbackUrl=%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 bg-transparent text-[#1A4FBF] font-semibold rounded-xl hover:bg-[#EBF0FA] transition-colors border border-[#1A4FBF] text-base text-center"
            >
              See the Platform
            </a>
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

        {/* Right: animated product mock */}
        <div data-hero-anim className="relative">
          <div
            className="relative bg-white rounded-2xl border border-[#E0E6F5] shadow-xl shadow-[#1A4FBF]/5 overflow-hidden"
            style={{ animation: "heroFloat 6s ease-in-out infinite" }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E6F5]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#1A4FBF] flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-sm bg-white" />
                </span>
                <span className="text-sm font-bold text-[#1C1C1C]">Yeam AI Team</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                Live
              </span>
            </div>

            {/* Agent rows */}
            <div className="p-3 space-y-1">
              {ROLES.map((role, i) => {
                const isActive = i === activeRole;
                return (
                  <div
                    key={role.label}
                    className={`relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-colors duration-300 ${
                      isActive ? "bg-[#EBF0FA]" : "bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? "animate-pulse" : ""}`}
                        style={{ backgroundColor: role.dot }}
                      />
                      <span className="text-sm font-medium text-[#1C1C1C] truncate">
                        {role.label}
                      </span>
                    </div>
                    <span className={`text-xs whitespace-nowrap ${isActive ? "text-[#1A4FBF] font-semibold" : "text-[#8A9BBF]"}`}>
                      {role.status}
                    </span>
                    {isActive && (
                      <span
                        key={activeRole}
                        aria-hidden="true"
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1A4FBF]/60"
                        style={{ animation: `barFill ${ROLE_CYCLE_MS}ms linear` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E0E6F5] bg-[#F7F9FE]">
              <span className="text-xs text-[#5A6A8A]">Integrated with your EHR</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[#1A4FBF] bg-white border border-[#A8BFEE] px-1.5 py-0.5 rounded">HIPAA</span>
                <span className="text-[10px] font-semibold text-[#1A4FBF] bg-white border border-[#A8BFEE] px-1.5 py-0.5 rounded">HL7</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
