"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { LightPulseLine, animateFlowWires } from "./FlowLine";

gsap.registerPlugin(ScrollTrigger);

/**
 * A slim preview of the pipeline, pointing at /architecture.
 *
 * The full Source -> Engine -> Output diagram lives on the architecture page
 * (components/ArchitectureFlow). This is the compact home-page version: three
 * stages, a couple of items each. It borrows the same motion the full diagram
 * uses so the two pages read as one system: the stages assemble the first time
 * it scrolls into view, then a packet travels each connector on a gentle loop so
 * the picture reads as data moving through, not a static chart. All of it is
 * behind prefers-reduced-motion.
 *
 * The copy mirrors the real stages so the two pages agree.
 */

const STAGES: { title: string; items: string[] }[] = [
  { title: "Source", items: ["Denial letter / EOB", "Claims export", "835 ERA"] },
  { title: "Engine", items: ["Denial playbook", "Payer profile"] },
  { title: "Output", items: ["Corrected claim", "Appeal letter", "Reprocessing request"] },
];

/** A connector carrying a streaming light pulse: downward on stacked mobile,
 *  rightward on the desktop row. */
function Connector() {
  return (
    <div aria-hidden data-arch className="flex justify-center py-1 text-[#1A4FBF] md:px-4 md:py-0">
      <LightPulseLine x1={10} y1={2} x2={10} y2={32} w={20} h={34} className="md:hidden" />
      <LightPulseLine x1={2} y1={10} x2={38} y2={10} w={40} h={20} className="hidden md:block" />
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
            stagger: 0.06,
            delay: 0.15,
          });

          // Stagger the two connectors so the light reads as one wave running
          // Source -> Engine -> Output.
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
            From a raw remit to a specific fix.
          </h2>
          <p data-reveal className="mt-5 text-lg leading-relaxed text-[#5A6A8A]">
            Denials come in as documents and exports, get normalized to one claim
            shape, and leave as the exact response each payer wants.
          </p>
        </div>

        <div
          data-reveal
          className="mt-12 flex flex-col items-stretch gap-4 rounded-2xl border border-[#E0E6F5] bg-[#F7F9FE] p-6 sm:p-8 md:flex-row md:items-center"
        >
          {STAGES.map((stage, i) => (
            <div key={stage.title} className="contents md:flex md:flex-1 md:items-center">
              <div className="min-w-0 flex-1">
                <p data-arch className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]">
                  {stage.title}
                </p>
                <div className="space-y-2.5">
                  {stage.items.map((item) => (
                    <div
                      key={item}
                      data-arch
                      className="rounded-lg border border-[#E0E6F5] bg-white px-4 py-2.5 text-sm font-medium text-[#1C1C1C]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {i < STAGES.length - 1 && <Connector />}
            </div>
          ))}
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
