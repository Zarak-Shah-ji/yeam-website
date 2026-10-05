"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { LightPulseLine, animateFlowWires } from "./FlowLine";
import LogoMark from "./LogoMark";

gsap.registerPlugin(ScrollTrigger);

/**
 * A slim preview of where Yeam sits, pointing at /architecture.
 *
 * Three nodes — EHR, Yeam, Payer — with Yeam emphasised as the middle it sits
 * in. The full Source -> Engine -> Output pipeline lives on the architecture
 * page; this is the compact home-page version. A light pulse streams the wires
 * on a gentle loop so the picture reads as a claim moving through, not a static
 * chart, and the caption names the round trip the diagram implies. All behind
 * prefers-reduced-motion.
 *
 * Every colour class here already has a dark-theme entry in globals.css.
 */

type NodeDef = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const ehrIcon = (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 3.75h6M8 21h8a2 2 0 0 0 2-2V8.5L13.5 4H8a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 4v4.5h4.5" />
  </svg>
);

const payerIcon = (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);

const ENDPOINTS: { ehr: NodeDef; payer: NodeDef } = {
  ehr: { title: "EHR", desc: "Your system of record. The claim starts here.", icon: ehrIcon },
  payer: { title: "Payer", desc: "Adjudicates the claim. Pays, or denies.", icon: payerIcon },
};

/** One endpoint card. Yeam is the emphasised middle; EHR and Payer are plainer. */
function NodeCard({
  title,
  desc,
  icon,
  emphasis,
}: NodeDef & { emphasis?: boolean }) {
  return (
    <div
      data-arch
      className={`flex-1 rounded-2xl border p-5 text-center sm:p-6 ${
        emphasis
          ? "border-[#A8BFEE] bg-[#EBF0FA] shadow-sm"
          : "border-[#E0E6F5] bg-white"
      }`}
    >
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-[#1A4FBF] ${
          emphasis ? "bg-white" : "bg-[#F7F9FE]"
        }`}
      >
        {icon}
      </div>
      <p className={`mt-3 text-base font-semibold ${emphasis ? "text-[#1A4FBF]" : "text-[#1C1C1C]"}`}>
        {title}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-[#5A6A8A]">{desc}</p>
    </div>
  );
}

/** The wire between two nodes: a streaming light pulse with a small caption. */
function Wire({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      data-arch
      className="flex shrink-0 flex-col items-center justify-center gap-1.5 text-[#1A4FBF] md:px-2"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
        {label}
      </span>
      <LightPulseLine x1={10} y1={2} x2={10} y2={26} w={20} h={28} className="md:hidden" />
      <LightPulseLine x1={2} y1={10} x2={54} y2={10} w={56} h={20} className="hidden md:block" />
    </div>
  );
}

export default function ArchitectureTeaser() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reveal = gsap.utils.toArray<HTMLElement>("[data-reveal]", rootRef.current);
      const items = gsap.utils.toArray<HTMLElement>("[data-arch]", rootRef.current);

      if (prefersReducedMotion()) {
        gsap.set([...reveal, ...items], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(reveal, { opacity: 0, y: 16 });
      gsap.set(items, { opacity: 0, y: 12 });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(reveal, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 });
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.15,
          });

          // Stagger the two wires so the light reads as one wave EHR -> Payer.
          animateFlowWires(rootRef.current, { stagger: 0.4 });
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="bg-[#FFFFFF] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="max-w-3xl">
          <p data-reveal className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1A4FBF]">
            How it works
          </p>
          <h2 data-reveal className="text-3xl font-light tracking-tight text-[#1C1C1C] md:text-5xl">
            Between your EHR and the payer.
          </h2>
          <p data-reveal className="mt-5 text-lg leading-relaxed text-[#5A6A8A]">
            A claim&apos;s round trip runs from your EHR out to the payer and back.
            Yeam sits in the middle — tracking each one, catching what stalls, and
            drafting the fix for your biller to approve.
          </p>
        </div>

        <div
          data-reveal
          className="mt-12 rounded-2xl border border-[#E0E6F5] bg-[#F7F9FE] p-6 sm:p-10"
        >
          <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
            <NodeCard {...ENDPOINTS.ehr} />
            <Wire label="claim" />
            <NodeCard
              title="Yeam"
              desc="Tracks every claim. Works what stalls."
              icon={<LogoMark size={28} />}
              emphasis
            />
            <Wire label="submit" />
            <NodeCard {...ENDPOINTS.payer} />
          </div>

          <p data-arch className="mt-6 text-center text-xs leading-relaxed text-[#8A9BBF]">
            Claims flow out to the payer; denials and remittances come back — Yeam
            works the round trip.
          </p>
        </div>

        <p data-reveal className="mt-8 text-sm text-[#4A5A7A]">
          <Link href="/architecture" className="font-medium text-[#1A4FBF] transition-colors hover:text-[#1540A0]">
            See how Yeam works, end to end →
          </Link>
        </p>
      </div>
    </section>
  );
}
