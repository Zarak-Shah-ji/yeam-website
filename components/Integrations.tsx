"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// EHR / health-IT vendor wordmarks. Each is a self-contained inline SVG so the
// mark themes via `currentColor` (grayscale to brand blue on hover, light and
// dark mode for free) with no licensed image files. These are simplified
// wordmarks: drop an official vendor SVG into a `svg` entry to swap one out
// without touching the marquee. `w` is the intrinsic width used for the
// viewBox; height is fixed at 26.
type Logo = { name: string; w: number; svg: React.ReactNode };

function wordmark(text: string, w: number, opts?: { italic?: boolean; weight?: number }) {
  return (
    <text
      x={w / 2}
      y="19"
      textAnchor="middle"
      fontFamily="var(--font-sans, ui-sans-serif, system-ui, sans-serif)"
      fontSize="22"
      fontWeight={opts?.weight ?? 700}
      fontStyle={opts?.italic ? "italic" : "normal"}
      letterSpacing="-0.5"
      fill="currentColor"
    >
      {text}
    </text>
  );
}

const LOGOS: Logo[] = [
  { name: "Epic", w: 64, svg: wordmark("Epic", 64) },
  { name: "Oracle Health", w: 168, svg: wordmark("Oracle Health", 168) },
  { name: "Cerner", w: 96, svg: wordmark("Cerner", 96) },
  { name: "MEDITECH", w: 132, svg: wordmark("MEDITECH", 132, { weight: 800 }) },
  { name: "athenahealth", w: 156, svg: wordmark("athenahealth", 156, { weight: 600 }) },
  { name: "Veradigm", w: 124, svg: wordmark("Veradigm", 124) },
  { name: "eClinicalWorks", w: 178, svg: wordmark("eClinicalWorks", 178, { weight: 600 }) },
  { name: "NextGen Healthcare", w: 210, svg: wordmark("NextGen Healthcare", 210) },
];

function LogoMark({ logo, decorative }: { logo: Logo; decorative?: boolean }) {
  return (
    <span className="group inline-flex shrink-0 items-center px-7" aria-hidden={decorative}>
      <svg
        role={decorative ? "presentation" : "img"}
        aria-label={decorative ? undefined : logo.name}
        viewBox={`0 0 ${logo.w} 26`}
        height={26}
        width={logo.w}
        className="h-6 w-auto text-[#8A97B5] opacity-70 grayscale transition-all duration-300 group-hover:text-[#1A4FBF] group-hover:opacity-100 group-hover:grayscale-0"
      >
        {!decorative && <title>{logo.name}</title>}
        {logo.svg}
      </svg>
    </span>
  );
}

export default function Integrations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Starts false so SSR and first client render agree (marquee markup); flips
  // to a static grid after mount only when the user prefers reduced motion.
  const [reduce, setReduce] = useState(false);

  useGSAP(() => {
    const reduced = prefersReducedMotion();
    if (reduced) setReduce(true);

    // Header reveal on first scroll into view, matching the rest of the page.
    const headerItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (reduced) {
      gsap.set(headerItems, { opacity: 1, y: 0 });
    } else {
      gsap.set(headerItems, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        once: true,
        onEnter: () =>
          gsap.to(headerItems, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
          }),
      });
    }

    // Static grid path: no marquee when motion is reduced.
    if (reduced || !trackRef.current || !marqueeRef.current) return;

    // Two identical copies live in the track, so translating by half its width
    // loops seamlessly.
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
    tl.to(trackRef.current, { xPercent: -50, duration: 32 });

    const node = marqueeRef.current;
    const pause = () => gsap.to(tl, { timeScale: 0, duration: 0.4, overwrite: true });
    const resume = () => gsap.to(tl, { timeScale: 1, duration: 0.4, overwrite: true });
    node.addEventListener("mouseenter", pause);
    node.addEventListener("mouseleave", resume);

    return () => {
      node.removeEventListener("mouseenter", pause);
      node.removeEventListener("mouseleave", resume);
      tl.kill();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-[#FFFFFF] overflow-hidden py-20 md:py-28 px-6">
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p data-reveal className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
            Integrations
          </p>
          <h2 data-reveal className="text-3xl md:text-4xl font-bold text-[#1C1C1C] tracking-tight">
            Works with the systems you already run on.
          </h2>
          <p data-reveal className="text-base md:text-lg text-[#4A5A7A] leading-relaxed mt-4 max-w-xl mx-auto">
            Yeam connects to the EHRs and practice systems your team uses every day, so it fits into your workflow instead of replacing it.
          </p>
        </div>
      </div>

      {/* Full-bleed marquee with edge fades. Two copies of the list scroll as
          one continuous loop; the second copy is decorative. */}
      <div
        ref={marqueeRef}
        data-reveal
        className="relative w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        {reduce ? (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-6 max-w-5xl mx-auto">
            {LOGOS.map((logo) => (
              <LogoMark key={logo.name} logo={logo} />
            ))}
          </div>
        ) : (
          <div ref={trackRef} className="flex w-max items-center">
            {LOGOS.map((logo) => (
              <LogoMark key={logo.name} logo={logo} />
            ))}
            {LOGOS.map((logo) => (
              <LogoMark key={`dup-${logo.name}`} logo={logo} decorative />
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-[#6A7A9A] mt-12 max-w-xl mx-auto">
        Logos are trademarks of their respective owners and are shown to indicate integration support, not partnership or endorsement.
      </p>
    </section>
  );
}
