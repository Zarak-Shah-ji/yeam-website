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
  MANUAL_COST_DEFAULT,
  manualMonthlyCost,
  monthlySavings,
  savingsPerDenial,
  suggestsCustom,
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
 *
 * The savings panel compares Yeam's blended rate to what working a denial by
 * hand costs — a cost-to-cost comparison, not a claim about recovered dollars.
 * The site refuses to quote recovery until the 835 feed can measure it, and
 * this number has to hold to the same standard.
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
  const [manualCost, setManualCost] = useState(MANUAL_COST_DEFAULT);

  const rootRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const savedRef = useRef<HTMLSpanElement>(null);
  const shownTotal = useRef(0);
  const shownSaved = useRef(0);

  const denials = deniedFromClaims(claims, denialRate);
  const pick = recommendedTier(denials);
  const picked = tierById(pick);
  const total = monthlyCost(picked, denials);

  const blended = effectiveRate(picked, denials);
  const manualTotal = manualMonthlyCost(denials, manualCost);
  const saved = monthlySavings(picked, denials, manualCost);
  const savedEach = savingsPerDenial(picked, denials, manualCost);
  const yeamCostsMore = saved < 0;

  const marks = useMemo(
    () =>
      crossovers()
        .map((c) => ({ ...c, claims: c.denials / denialRate }))
        .filter((c) => c.claims >= CLAIMS_MIN && c.claims <= CLAIMS_MAX),
    [denialRate],
  );

  // Count the two headline figures to their new values. Skipped entirely under
  // reduced motion, where the numbers simply land.
  useGSAP(
    () => {
      const countTo = (
        node: HTMLSpanElement | null,
        from: { current: number },
        to: number,
      ) => {
        if (!node) return;
        if (prefersReducedMotion()) {
          node.textContent = money.format(to);
          from.current = to;
          return;
        }
        const proxy = { v: from.current };
        gsap.to(proxy, {
          v: to,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = money.format(proxy.v);
          },
          onComplete: () => {
            from.current = to;
          },
        });
      };

      countTo(totalRef.current, shownTotal, total);
      // Only animate a positive figure; the "costs more" branch swaps the node
      // out for a sentence, so there is nothing to count into.
      if (!yeamCostsMore) countTo(savedRef.current, shownSaved, saved);
    },
    { scope: rootRef, dependencies: [total, saved, yeamCostsMore] },
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
              // Near either end a centred label hangs off the track, so the
              // ones close to an edge align to it instead.
              const near = pct < 12 ? "left" : pct > 88 ? "right" : "center";
              return (
                <div
                  key={`${m.from}-${m.to}`}
                  className="absolute top-0"
                  style={{ left: `${pct}%` }}
                >
                  <div className="h-2 w-px bg-[#A8BFEE]" />
                  <div
                    className={`mt-0.5 whitespace-nowrap text-[10px] font-medium text-[#8A9BBF] ${
                      near === "left"
                        ? ""
                        : near === "right"
                          ? "-translate-x-full"
                          : "-translate-x-1/2"
                    }`}
                  >
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

          <label htmlFor="manual" className="mt-8 block text-sm font-semibold text-[#1C1C1C]">
            What it costs you to work one denial manually
          </label>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1A4FBF]">{money.format(manualCost)}</span>
            <span className="text-sm text-[#5A6A8A]">per denial</span>
          </div>
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
          <p className="mt-2 text-xs leading-relaxed text-[#5A6A8A]">
            Industry estimates run about $25 to rework a claim and $118 to appeal one. Put your own
            number in if you have it.
          </p>
        </div>

        {/* Result */}
        <div className="rounded-2xl border border-[#A8BFEE] bg-[#EBF0FA] px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1A4FBF]">
            Your plan
          </p>
          <p className="mt-2 text-2xl font-bold text-[#1C1C1C]">{picked.name}</p>

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
                {money.format(picked.monthly)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#5A6A8A]">
                {denials.toLocaleString("en-US")} denials × {rate.format(picked.perDenial)}
              </dt>
              <dd className="font-medium text-[#1C1C1C]">
                {money.format(picked.perDenial * denials)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-[#A8BFEE] pt-2">
              <dt className="text-[#5A6A8A]">Blended cost per denial</dt>
              <dd className="font-medium text-[#1C1C1C]">
                {blended === null ? "—" : rate.format(blended)}
              </dd>
            </div>
          </dl>

          {suggestsCustom(denials) && (
            <p className="mt-4 rounded-lg border border-[#A8BFEE] bg-white px-3 py-2 text-xs leading-relaxed text-[#4A5A7A]">
              At this volume, ask us about{" "}
              <span className="font-semibold text-[#1C1C1C]">Network</span> — it is quoted rather
              than published.
            </p>
          )}

          {/* What the same work costs without us. */}
          <div className="mt-5 border-t border-[#A8BFEE] pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1A4FBF]">
              Against working them manually
            </p>

            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-[#5A6A8A]">
                  <th scope="col" className="w-1/3" />
                  <th scope="col" className="pb-1 text-right font-medium">Per denial</th>
                  <th scope="col" className="pb-1 text-right font-medium">Per month</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="py-1 text-left font-normal text-[#5A6A8A]">Manually</th>
                  <td className="py-1 text-right text-[#1C1C1C]">{rate.format(manualCost)}</td>
                  <td className="py-1 text-right text-[#1C1C1C]">{money.format(manualTotal)}</td>
                </tr>
                <tr>
                  <th scope="row" className="py-1 text-left font-normal text-[#5A6A8A]">With Yeam</th>
                  <td className="py-1 text-right text-[#1C1C1C]">
                    {blended === null ? "—" : rate.format(blended)}
                  </td>
                  <td className="py-1 text-right text-[#1C1C1C]">{money.format(total)}</td>
                </tr>
                <tr className="border-t border-[#A8BFEE]">
                  <th scope="row" className="pt-2 text-left font-semibold text-[#1C1C1C]">
                    You keep
                  </th>
                  {yeamCostsMore || savedEach === null ? (
                    <td colSpan={2} className="pt-2 text-right text-xs text-[#5A6A8A]">
                      {denials <= 0
                        ? "—"
                        : "Yeam costs more than working them manually at this volume."}
                    </td>
                  ) : (
                    <>
                      <td className="pt-2 text-right font-semibold text-[#1A4FBF]">
                        {rate.format(savedEach)}
                      </td>
                      <td className="pt-2 text-right font-extrabold text-[#1A4FBF]">
                        <span ref={savedRef}>{money.format(saved)}</span>
                      </td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>

            <p className="mt-4 text-xs leading-relaxed text-[#5A6A8A]">
              This compares what it costs to <em>work</em>{" "}
              a denial, not what you recover. We
              don&apos;t quote recovered dollars until the 835 feed can prove them. Triage stays
              free at any volume — this is what the drafting, tracking and submission add on top.
            </p>
          </div>
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
