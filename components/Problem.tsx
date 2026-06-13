"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    prefix: "$",
    value: 800,
    suffix: "B",
    title: "Spent on medical staff annually",
    body: "Clinics spend hundreds of thousands each year on receptionists, scribes, coders, and billing staff. Most of that time goes to repetitive tasks AI can handle instantly.",
  },
  {
    prefix: "",
    value: 4,
    suffix: " hrs",
    title: "Documentation per provider daily",
    body: "Physicians spend up to 40% of their working day on paperwork, notes, and administrative tasks, leaving less time for actual patient care and accelerating burnout.",
  },
  {
    prefix: "",
    value: 35,
    suffix: "%",
    title: "Average medical staff turnover",
    body: "High turnover in front desk and billing roles creates constant retraining costs and revenue gaps. AI medical employees never quit, never call in sick, and never need onboarding.",
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    stats.forEach((stat, i) => {
      const el = numRefs.current[i];
      if (!el) return;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: stat.value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        onUpdate() {
          el.textContent = Math.round(counter.val).toString();
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-[#1C1C1C]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#D4956A] text-sm font-semibold uppercase tracking-wider mb-3">
            The Problem
          </p>
          <h2 className="text-4xl font-bold text-white">
            Your Clinic Is Drowning
            <br />
            in Work That AI Can Handle.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <div
              key={item.title}
              className="bg-[#2A2A2A] rounded-2xl p-7 border border-[#3A3A3A]"
            >
              <div className="text-5xl font-extrabold text-[#D4956A] mb-3 tabular-nums">
                {item.prefix}
                <span ref={(el) => { numRefs.current[i] = el; }}>0</span>
                {item.suffix}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-[#8A8A8A] mt-10 text-base">
          Most clinics hire more staff to solve these problems. Yeam lets you{" "}
          <span className="text-white font-medium">deploy AI employees instead.</span>
        </p>
      </div>
    </section>
  );
}
