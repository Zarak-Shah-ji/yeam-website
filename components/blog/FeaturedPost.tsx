"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { formatPostDate, type Post } from "@/app/blog/posts";

/**
 * The top post, promoted out of the uniform grid into a wide hero above it.
 *
 * The index otherwise sorts strictly by date, which buried the strongest piece
 * at the bottom. This lifts whichever post carries `featured` to the top and
 * gives it room: a two-column card with the copy on the left and an animated
 * bar-chart panel on the right that echoes the Market Research motif. Bars grow
 * on mount after the text rises; under prefers-reduced-motion everything renders
 * in its final state with no animation. Colours stay on the tokens that already
 * have dark-theme entries in globals.css, so it themes for free.
 */

// Relative bar heights (percent of the panel) for the chart visual.
const BARS = [34, 58, 28, 80, 50, 98, 70];

export default function FeaturedPost({ post }: { post: Post }) {
  const rootRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const items = gsap.utils.toArray<HTMLElement>("[data-fp]");
      const bars = gsap.utils.toArray<HTMLElement>("[data-fp-bar]");

      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        gsap.set(bars, { scaleY: 1 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 20 });
      gsap.set(bars, { scaleY: 0, transformOrigin: "bottom" });
      gsap
        .timeline()
        .to(items, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 })
        .to(bars, { scaleY: 1, duration: 0.7, ease: "power3.out", stagger: 0.06 }, "-=0.3");
    },
    { scope: rootRef },
  );

  return (
    <Link
      ref={rootRef}
      href={`/blog/${post.slug}`}
      className="group relative mt-10 grid overflow-hidden rounded-2xl border border-[#E0E6F5] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md lg:grid-cols-2"
    >
      {/* Copy */}
      <div className="flex flex-col justify-center px-7 py-8 sm:px-9 sm:py-10">
        <p
          data-fp
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1A4FBF]"
        >
          Top post
        </p>
        <span
          data-fp
          className="inline-flex w-fit items-center rounded-full border border-[#A8BFEE] bg-[#EBF0FA] px-2.5 py-0.5 text-xs font-semibold text-[#1A4FBF]"
        >
          {post.tag}
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[#1C1C1C] sm:text-3xl">
          <span data-fp>{post.title}</span>
        </h2>
        <p data-fp className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#4A5A7A]">
          {post.excerpt}
        </p>
        <div
          data-fp
          className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6A8A]"
        >
          <span className="font-medium text-[#1C1C1C]">{post.author}</span>
          <span aria-hidden>·</span>
          <span>{formatPostDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
        <span
          data-fp
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A4FBF]"
        >
          Read the playbook
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>

      {/* Animated bar-chart panel */}
      <div
        aria-hidden
        className="relative flex min-h-[220px] items-end gap-2.5 overflow-hidden border-t border-[#E0E6F5] bg-[#EBF0FA] px-8 py-8 sm:gap-3.5 lg:border-l lg:border-t-0"
      >
        {/* Faint baseline gridlines. */}
        <div className="pointer-events-none absolute inset-x-6 bottom-8 top-8 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="block h-px w-full bg-[#1A4FBF] opacity-[0.08]" />
          ))}
        </div>
        {BARS.map((h, i) => (
          <div
            key={i}
            data-fp-bar
            className="relative w-full rounded-t-md bg-[#1A4FBF]"
            style={{ height: `${h}%`, opacity: 0.35 + (i / (BARS.length - 1)) * 0.55 }}
          />
        ))}
      </div>
    </Link>
  );
}
