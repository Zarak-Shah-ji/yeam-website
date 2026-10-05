"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import {
  TIERS,
  deniedFromClaims,
  monthlyCost,
  recommendedTier,
  tierById,
  DENIAL_RATE_DEFAULT,
  VOLUME_PRESETS,
  MANUAL_COST_DEFAULT,
  MINUTES_PER_DENIAL,
  manualMonthlyCost,
  monthlySavings,
  hoursReclaimed,
} from "@/lib/pricing";

/**
 * The pricing calculator.
 *
 * One primary control — claims a month — drives one headline: the staff hours
 * and dollars Yeam hands back by taking over the denial work your team does
 * today. The two assumptions behind it (denial rate, cost to work one by hand)
 * carry sourced defaults and hide behind a reveal, so the first read is a single
 * slider. The plans themselves live in the tier tiles below; the recommended
 * one lifts as the slider moves.
 *
 * No recovered-dollar claims: the site won't quote what it can't yet measure, so
 * the figures are strictly cost-to-work and time saved, which Yeam can stand
 * behind. The count-up writes through a ref rather than React state.
 */

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Per-denial rates run to cents ($0.75), so they need their own formatter.
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
  const [manualCost, setManualCost] = useState(MANUAL_COST_DEFAULT);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLSpanElement>(null);
  const savedRef = useRef<HTMLSpanElement>(null);
  const shownHours = useRef(0);
  const shownSaved = useRef(0);

  const denials = deniedFromClaims(claims, denialRate);
  const pick = recommendedTier(denials);
  const picked = tierById(pick);
  const total = monthlyCost(picked, denials);

  const manualTotal = manualMonthlyCost(denials, manualCost);
  const saved = monthlySavings(picked, denials, manualCost);
  const hours = hoursReclaimed(denials, MINUTES_PER_DENIAL);
  const yeamCostsMore = saved < 0;

  // Count the two headline figures to their new values.
  useGSAP(
    () => {
      const countTo = (
        node: HTMLSpanElement | null,
        from: { current: number },
        to: number,
        format: (n: number) => string,
      ) => {
        if (!node) return;
        if (prefersReducedMotion()) {
          node.textContent = format(to);
          from.current = to;
          return;
        }
        const proxy = { v: from.current };
        gsap.to(proxy, {
          v: to,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = format(proxy.v);
          },
          onComplete: () => {
            from.current = to;
          },
        });
      };

      countTo(hoursRef.current, shownHours, hours, (n) => Math.round(n).toLocaleString("en-US"));
      if (!yeamCostsMore) countTo(savedRef.current, shownSaved, saved, (n) => money.format(n));
    },
    { scope: rootRef, dependencies: [hours, saved, yeamCostsMore] },
  );

  // Lift the recommended tile. Transform only, so nothing reflows.
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
        {/* One primary control; the assumptions hide behind a reveal. */}
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
          <div className="mt-3 flex flex-wrap gap-2">
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

          <p className="mt-4 text-sm text-[#5A6A8A]">
            About{" "}
            <span className="font-semibold text-[#1C1C1C]">
              {denials.toLocaleString("en-US")} denials
            </span>{" "}
            a month to work, at {Math.round(denialRate * 100)}% and {money.format(manualCost)} each by
            hand.
          </p>

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#1A4FBF] transition-colors hover:text-[#1540A0]"
          >
            {showAdvanced ? "Hide" : "Adjust"} the assumptions
            <span aria-hidden className="text-xs">{showAdvanced ? "▲" : "▼"}</span>
          </button>

          {showAdvanced && (
            <div className="mt-5 space-y-6 rounded-xl border border-[#E0E6F5] bg-[#F7F9FE] p-4 sm:p-5">
              <div>
                <label htmlFor="rate" className="block text-sm font-semibold text-[#1C1C1C]">
                  Share of claims denied — {Math.round(denialRate * 100)}%
                </label>
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
                <p className="mt-1.5 text-xs leading-relaxed text-[#5A6A8A]">
                  Industry average is about 12% (Experian, 2024). The free worklist totals yours.
                </p>
              </div>

              <div>
                <label htmlFor="manual" className="block text-sm font-semibold text-[#1C1C1C]">
                  Cost to work one denial by hand — {money.format(manualCost)}
                </label>
                <input
                  id="manual"
                  type="range"
                  min={1}
                  max={150}
                  step={1}
                  value={manualCost}
                  onChange={(e) => setManualCost(Number(e.target.value))}
                  className="mt-3 w-full accent-[#1A4FBF]"
                />
                <p className="mt-1.5 text-xs leading-relaxed text-[#5A6A8A]">
                  About $57 to rework a denied claim (Premier, 2023), more to appeal a complex one.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* One headline: what you get back. */}
        <div className="rounded-2xl border border-[#A8BFEE] bg-[#EBF0FA] px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1A4FBF]">
            What Yeam hands back each month
          </p>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="flex items-baseline gap-1">
                <span ref={hoursRef} className="text-4xl font-extrabold text-[#1C1C1C]">
                  {Math.round(hours).toLocaleString("en-US")}
                </span>
                <span className="text-sm font-medium text-[#5A6A8A]">hrs</span>
              </p>
              <p className="mt-1 text-xs text-[#5A6A8A]">staff time off this work</p>
            </div>
            <div>
              {yeamCostsMore ? (
                <p className="text-sm font-medium text-[#5A6A8A]">
                  Below Yeam&apos;s cost at this volume — the worklist stays free.
                </p>
              ) : (
                <>
                  <p className="flex items-baseline gap-1">
                    <span ref={savedRef} className="text-4xl font-extrabold text-[#1A4FBF]">
                      {money.format(saved)}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[#5A6A8A]">saved vs working by hand</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-[#A8BFEE] pt-4">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#5A6A8A]">Working them by hand</dt>
                <dd className="font-medium text-[#1C1C1C]">{money.format(manualTotal)}/mo</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#5A6A8A]">With Yeam ({picked.name})</dt>
                <dd className="font-semibold text-[#1A4FBF]">{money.format(total)}/mo</dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-[#5A6A8A]">
              Hours and cost on the work Yeam takes over, not dollars recovered — we don&apos;t quote
              recovered revenue until the 835 feed can prove it. The worklist stays free at any
              volume.
            </p>
          </div>
        </div>
      </div>

      {/* The plans. Every paid tier is the same product at a different rate; the
          one your volume makes cheapest lifts. */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => {
          const active = tier.id === pick;
          return (
            <div
              key={tier.id}
              data-tier={tier.id}
              className={`rounded-2xl border px-5 py-5 ${
                active ? "border-[#1A4FBF] bg-white shadow-sm" : "border-[#E0E6F5] bg-white"
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
                  {tier.free ? "Free" : tier.custom ? "Custom" : money.format(tier.monthly)}
                </span>
                {!tier.free && !tier.custom && (
                  <span className="text-xs text-[#5A6A8A]">/month</span>
                )}
              </div>
              <p className="mt-1 text-xs font-medium text-[#1A4FBF]">
                {tier.free
                  ? "Unlimited, in your browser"
                  : tier.custom
                    ? "Priced on your volume"
                    : `+ ${rate.format(tier.perDenial)} per denial worked`}
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
                href={tier.free ? "/worklist" : "#contact"}
                className={`mt-5 block rounded-lg px-4 py-2 text-center text-xs font-semibold transition-colors ${
                  tier.free
                    ? "border border-[#1A4FBF] text-[#1A4FBF] hover:bg-[#EBF0FA]"
                    : "bg-[#1A4FBF] text-white hover:bg-[#1540A0]"
                }`}
              >
                {tier.free ? "Run the worklist" : tier.custom ? "Talk to us" : "Request a demo"}
              </a>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-[#5A6A8A]">
        Every paid tier is the same product; the fee just buys a lower rate on each denial worked,
        so the right plan is whichever your own volume makes cheapest — the slider above finds it.
      </p>
    </div>
  );
}
