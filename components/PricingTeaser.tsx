import Link from "next/link";
import Reveal from "./Reveal";
import {
  tierById,
  recommendedTier,
  monthlyCost,
  manualMonthlyCost,
  monthlySavings,
  deniedFromClaims,
  MANUAL_COST_DEFAULT,
  DENIAL_RATE_DEFAULT,
  VOLUME_PRESETS,
} from "@/lib/pricing";

/**
 * A pricing teaser for the home page, so the number is not buried behind a nav
 * link. The figures are computed from lib/pricing, not typed in, so this block
 * can never drift from the real calculator on /pricing. The comparison is
 * cost-to-work by hand versus with Yeam, the same honest framing the pricing
 * page uses (recovered dollars need the 835 feed to be measurable).
 */

const CLAIMS = VOLUME_PRESETS[1].claims; // a mid-size practice
const DENIALS = deniedFromClaims(CLAIMS, DENIAL_RATE_DEFAULT);
const TIER = tierById(recommendedTier(DENIALS));
const YEAM = monthlyCost(TIER, DENIALS);
const MANUAL = manualMonthlyCost(DENIALS, MANUAL_COST_DEFAULT);
const SAVINGS = monthlySavings(TIER, DENIALS, MANUAL_COST_DEFAULT);

const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export default function PricingTeaser() {
  return (
    <section className="bg-[#F7F9FE] px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <p data-reveal className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1A4FBF]">
              Pricing
            </p>
            <h2 data-reveal className="text-3xl font-light tracking-tight text-[#1C1C1C] md:text-5xl">
              The fee buys a lower rate, not a feature gate.
            </h2>
            <p data-reveal className="mt-5 text-lg leading-relaxed text-[#5A6A8A]">
              Every paid plan is the same product. You are not decoding which tier
              holds the feature you need; you are picking the rate that fits your
              volume.
            </p>
            <p data-reveal className="mt-8 text-sm">
              <Link href="/pricing" className="font-medium text-[#1A4FBF] transition-colors hover:text-[#1540A0]">
                See the full calculator →
              </Link>
            </p>
          </div>

          <div data-reveal className="rounded-2xl border border-[#E0E6F5] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A9BBF]">
              A practice working about {DENIALS.toLocaleString()} denials a month
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E0E6F5] bg-[#F7F9FE] px-4 py-4">
                <p className="text-2xl font-light text-[#1C1C1C]">{usd(MANUAL)}</p>
                <p className="mt-1 text-xs text-[#5A6A8A]">by hand, per month</p>
              </div>
              <div className="rounded-xl border border-[#A8BFEE] bg-[#EBF0FA] px-4 py-4">
                <p className="text-2xl font-light text-[#1A4FBF]">{usd(YEAM)}</p>
                <p className="mt-1 text-xs text-[#4A5A7A]">with Yeam, per month</p>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <span className="text-lg font-semibold text-green-600">{usd(SAVINGS)}</span>
              <span className="text-sm text-[#4A5A7A]">less every month, on the {TIER.name} plan</span>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-[#8A9BBF]">
              Working a denial by hand runs about {usd(MANUAL_COST_DEFAULT)}. This
              compares cost to work, not dollars recovered.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
