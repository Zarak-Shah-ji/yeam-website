"use client";

import { useId } from "react";
import gsap from "gsap";

/**
 * Drives every LightPulseLine inside `root`: the faint track marches slowly and
 * the light pulse streams the wire on a continuous loop. Call it from a parent's
 * useGSAP onEnter so the whole diagram shares one timeline and one reduced-motion
 * guard. `stagger` offsets multiple wires so they read as a travelling wave.
 */
export function animateFlowWires(root: HTMLElement | null, opts: { stagger?: number } = {}) {
  const tracks = gsap.utils.toArray<SVGElement>("[data-flow-track]", root);
  const pulses = gsap.utils.toArray<SVGElement>("[data-flow-pulse]", root);
  if (tracks.length) {
    gsap.to(tracks, { attr: { "stroke-dashoffset": -6.5 }, duration: 1.1, ease: "none", repeat: -1 });
  }
  if (pulses.length) {
    // pathLength is normalized to 100 and the dash is a single short segment, so
    // sweeping the offset from just-before-the-start (+20, off-wire) to
    // just-past-the-end (-100) carries the light the full length of the wire.
    gsap.fromTo(
      pulses,
      { attr: { "stroke-dashoffset": 20 } },
      {
        attr: { "stroke-dashoffset": -100 },
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 0.45,
        stagger: opts.stagger ?? 0,
      },
    );
  }
}

/**
 * A premium connector: not a dot sliding down a line, but a pulse of light that
 * streams along a faint, continuously-flowing track.
 *
 * Three stacked strokes share the same geometry:
 *   1. a low-opacity dashed "track" that marches slowly, so the wire always
 *      reads as live even between pulses;
 *   2. a wide, blurred halo stroke, and
 *   3. a thin bright core stroke,
 * both drawn as a single short dash (pathLength-normalized to 100) whose
 * dashoffset the parent animates, so the light travels the whole wire.
 *
 * The parent owns the motion: it targets [data-flow-track] and [data-flow-pulse]
 * with GSAP so the whole diagram animates as one timeline and stays behind
 * prefers-reduced-motion. Colours are decorative blues that read on both themes.
 */
export function LightPulseLine({
  x1,
  y1,
  x2,
  y2,
  w,
  h,
  className,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w: number;
  h: number;
  className?: string;
}) {
  // useId can contain ":" which is awkward inside url(#…); strip it.
  const gid = `flow-${useId().replace(/:/g, "")}`;
  const line = { x1, y1, x2, y2, strokeLinecap: "round" as const };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className={`overflow-visible ${className ?? ""}`}>
      <defs>
        <filter id={gid} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {/* 1 · flowing track */}
      <line
        {...line}
        stroke="#1A4FBF"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeDasharray="1.5 5"
        data-flow-track
      />

      {/* 2 · blurred halo pulse */}
      <line
        {...line}
        stroke="#7CA7F5"
        strokeWidth={5}
        pathLength={100}
        strokeDasharray="16 84"
        strokeDashoffset={20}
        filter={`url(#${gid})`}
        data-flow-pulse
      />

      {/* 3 · bright core pulse */}
      <line
        {...line}
        stroke="#1A4FBF"
        strokeWidth={2}
        pathLength={100}
        strokeDasharray="12 88"
        strokeDashoffset={20}
        data-flow-pulse
      />
    </svg>
  );
}
