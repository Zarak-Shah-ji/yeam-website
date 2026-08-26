"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import {
  PAID_TIERS,
  TIERS,
  crossovers,
  deniedFromClaims,
  effectiveRate,
  monthlyCost,
  recommendedTier,
  tierById,
  DENIAL_RATE_DEFAULT,
  VOLUME_PRESETS,
} from "@/lib/pricing";

/**
 * The pricing calculator.
 *
 * This is the one piece of motion on the site that does work rather than
 * decorating. It exists because the tier structure only makes sense as
 * arithmetic — the monthly fee buys a lower per-denial rate, so the right plan
 * is whichever one your own volume makes cheapest. Showing that as a number
 * moving under a slider explains it faster than a paragraph can.
 *
 * The count-up writes through a ref rather than React state: sixty renders a
 * second to animate one number would be a poor trade.
 */

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const rate = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const CLAIMS_MIN = 250;
const CLAIMS_MAX = 20_000;

export default function PricingCalculator() {
  const [claims, setClaims] = useState(2_000);
  const [denialRate, setDenialRate] = useState(DENIAL_RATE_DEFAULT);

  const rootRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const shownTotal = useRef(0);

  const denials = deniedFromClaims(claims, denialRate);
  const pick = recommendedTier(denials);
  const total = monthlyCost(tierById(pick), denials);

  const marks = useMemo(
    () =>
      crossovers()
        .map((c) => ({ ...c, claims: c.denials / denialRate }))
        .filter((c) => c.claims >= CLAIMS_MIN && c.claims <= CLAIMS_MAX),
    [denialRate],
  );

  // Count the headline figure to its new value. Skipped entirely under reduced
  // motion, where the number simply lands.
  useGSAP(
    () => {
      const node = totalRef.current;
      if (!node) return;

      if (prefersReducedMotion()) {
        node.textContent = money.format(total);
        shownTotal.current = total;
        return;
      }

      const proxy = { v: shownTotal.current };
      gsap.to(proxy, {
        v: total,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          node.textContent = money.format(proxy.v);
        },
        onComplete: () => {
          shownTotal.current = total;
        },
      });
    },
    { scope: rootRef, dependencies: [total] },
  );

  // Lift the recommended card. Transform only, so nothing reflows.
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-tier]");
      if (prefersReducedMotion()) {
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }
      for (const card of cards) {
        const active = card.dataset.tier === pick;
        gsap.to(card, {
          y: active ? -8 : 0,
          opacity: active ? 1 : 0.72,
          duration: 0.45,
          ease: "power3.out",
        });
      }
    },
    { scope: rootRef, dependencies: [pick] },
  );

  return (
    <div ref={rootRef} className="rounded-2xl border border-[#E0E6F5] bg-white shadow-sm px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* Controls */}
        <div>
          <label htmlFor="claims" className="block text-sm font-semibold text-[#1C1C1C]">
            Claims you bill each month
          </label>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#1A4FBF]">
              {claims.toLocaleString("en-US")}
            </span>
            <span className="text-sm text-[#5A6A8A]">claims/month</span>
          </div>

          <input
            id="claims"
            type="range"
            min={CLAIMS_MIN}
            max={CLAIMS_MAX}
            step={50}
            value={claims}
            onChange={(e) => setClaims(Number(e.target.value))}
            className="mt-3 w-full accent-[#1A4FBF]"
          />

          {/* Break-even marks: where the cheapest plan actually changes. */}
          <div className="relative mt-1 h-9" aria-hidden="true">
            {marks.map((m) => {
              const pct =
                ((m.claims - CLAIMS_MIN) / (CLAIMS_MAX - CLAIMS_MIN)) * 100;
              return (
                <div
                  key={`${m.from}-${m.to}`}
                  className="absolute top-0 -translate-x-1/2 text-center"
                  style={{ left: `${pct}%` }}
                >
                  <div className="mx-auto h-2 w-px bg-[#A8BFEE]" />
                  <div className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-[#8A9BBF]">
                    {tierById(m.to).name} wins
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {VOLUME_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setClaims(Math.min(CLAIMS_MAX, p.claims))}
                className="rounded-lg border border-[#A8BFEE] bg-[#EBF0FA] px-3 py-1.5 text-xs font-medium text-[#1A4FBF] transition-colors hover:bg-[#D0DAF5]"
              >
                {p.label}
              </button>
            ))}
          </div>

          <label htmlFor="rate" className="mt-8 block text-sm font-semibold text-[#1C1C1C]">
            Share of claims denied
          </label>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1A4FBF]">
              {Math.round(denialRate * 100)}%
            </span>
            <span className="text-sm text-[#5A6A8A]">
              — {denials.toLocaleString("en-US")} denials/month
            </span>
          </div>
          <input
            id="rate"
            type="range"
            min={3}
            max={25}
            step={1}
            value={Math.round(denialRate * 100)}
            onChange={(e) => setDenialRate(Number(e.target.value) / 100)}
            className="mt-3 w-full accent-[#1A4FBF]"
          />
          <p className="mt-2 text-xs leading-relaxed text-[#5A6A8A]">
            Most practices land between 5% and 15%. Your denial report has the real number — the
            free worklist above will total it for you.
          </p>
        </div>

        {/* Result */}
        <div className="rounded-2xl border border-[#A8BFEE] bg-[#EBF0FA] px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1A4FBF]">
            Your plan
          </p>
          <p className="mt-2 text-2xl font-bold text-[#1C1C1C]">{tierById(pick).name}</p>

          <div className="mt-4 flex items-baseline gap-1.5">
            <span ref={totalRef} className="text-4xl font-extrabold text-[#1A4FBF]">
              {money.format(total)}
            </span>
            <span className="text-sm font-medium text-[#5A6A8A]">/month</span>
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#5A6A8A]">Platform fee</dt>
              <dd className="font-medium text-[#1C1C1C]">
                {money.format(tierById(pick).monthly)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#5A6A8A]">
                {denials.toLocaleString("en-US")} denials × {rate.format(tierById(pick).perDenial)}
              </dt>
              <dd className="font-medium text-[#1C1C1C]">
                {money.format(tierById(pick).perDenial * denials)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-[#A8BFEE] pt-2">
              <dt className="text-[#5A6A8A]">Blended cost per denial</dt>
              <dd className="font-medium text-[#1C1C1C]">
                {effectiveRate(tierById(pick), denials) === null
                  ? "—"
                  : rate.format(effectiveRate(tierById(pick), denials)!)}
              </dd>
            </div>
          </dl>

          <p className="mt-5 text-xs leading-relaxed text-[#5A6A8A]">
            Triage stays free at any volume. This is what the drafting, tracking and submission
            add on top.
          </p>
        </div>
      </div>

      {/* Tier cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => {
          const active = tier.id === pick;
          return (
            <div
              key={tier.id}
              data-tier={tier.id}
              className={`rounded-2xl border px-5 py-5 ${
                active
                  ? "border-[#1A4FBF] bg-white shadow-sm"
                  : "border-[#E0E6F5] bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#1C1C1C]">{tier.name}</p>
                {active && (
                  <span className="rounded-full border border-[#A8BFEE] bg-[#EBF0FA] px-2 py-0.5 text-[10px] font-semibold text-[#1A4FBF]">
                    Best at your volume
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#1C1C1C]">
                  {tier.free ? "Free" : money.format(tier.monthly)}
                </span>
                {!tier.free && <span className="text-xs text-[#5A6A8A]">/month</span>}
              </div>
              <p className="mt-1 text-xs font-medium text-[#1A4FBF]">
                {tier.free ? "Unlimited, in your browser" : `+ ${rate.format(tier.perDenial)} per denial worked`}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-[#5A6A8A]">{tier.tagline}</p>

              <ul className="mt-4 space-y-1.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-xs leading-relaxed text-[#4A5A7A]">
                    <span aria-hidden className="mt-0.5 shrink-0 text-[#1A4FBF]">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={tier.free ? "/#triage" : "#contact"}
                className={`mt-5 block rounded-lg px-4 py-2 text-center text-xs font-semibold transition-colors ${
                  tier.free
                    ? "border border-[#1A4FBF] text-[#1A4FBF] hover:bg-[#EBF0FA]"
                    : "bg-[#1A4FBF] text-white hover:bg-[#1540A0]"
                }`}
              >
                {tier.free ? "Run the worklist" : "Request a demo"}
              </a>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-[#5A6A8A]">
        Every paid tier is the same product — the monthly fee buys a lower rate per denial, not
        extra features. That means the right plan is whichever one your own volume makes cheapest,
        and the slider above finds it.{" "}
        {PAID_TIERS.length > 1 && (
          <>
            Break-even sits at{" "}
            {crossovers()
              .map((c) => `${Math.round(c.denials).toLocaleString("en-US")} denials`)
              .join(" and ")}{" "}
            per month.
          </>
        )}
      </p>
    </div>
  );
}
