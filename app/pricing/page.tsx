import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PricingCalculator from "@/components/PricingCalculator";

/**
 * Pricing.
 *
 * Structured after /architecture, including its habit of naming what isn't
 * finished. A pricing page that claims more than the product does gets found
 * out in the first pilot, and billing companies — the audience this page is
 * written for — have been sold vapour before.
 */

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "The worklist is free and runs in your browser. Paid plans add drafting, deadline tracking and real claim data — the monthly fee buys a lower rate per denial worked, and the calculator shows it against what working a denial manually costs you.",
};

const HONEST: [string, string][] = [
  [
    "Live today",
    "Reading a denied-claims export, routing each denial to the right remedy, calculating filing deadlines, and drafting corrected claims, appeals and reprocessing requests.",
  ],
  [
    "Building",
    "The 835 remittance feed and multi-practice scoping. Until the feed lands, denials come in as an export you send us rather than arriving on their own.",
  ],
  [
    "Not yet",
    "Billing on recovered dollars. We can't see what a payer paid until the 835 feed is live, so charging a share of recoveries would be a number we couldn't show you. Per denial worked is what we can prove.",
  ],
];

const FAQ: [string, string][] = [
  [
    "What counts as a denial worked?",
    "One denied claim line that Yeam triages and drafts a response for. Re-drafting the same denial after a payer's second denial counts once more; re-reading it doesn't.",
  ],
  [
    "Why is the worklist free?",
    "It runs entirely in your browser, so it costs us nothing to serve and carries no PHI. It's also the honest way to show what the engine knows before you pay anything.",
  ],
  [
    "Do we need a BAA?",
    "Not for the free worklist — your file never leaves your machine. Any paid plan touching real claim data does, and we sign one before a pilot starts.",
  ],
  [
    "Can we switch tiers?",
    "Every paid tier is the same product at a different rate, so switching changes only the arithmetic. Move whenever your volume says to.",
  ],
  [
    "Where does the $25 come from?",
    "It's the commonly cited cost of reworking a single claim; appealing one runs closer to $118. The slider defaults to the low end because the conservative number is the one worth arguing from — put your own in, it's your figure that matters.",
  ],
  [
    "Why is Network priced on request?",
    "At that volume the payer mix and the feed work move the number more than the denial count does. Publishing a rate we'd renegotiate in the first call is worse than saying so.",
  ],
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
            Pay for denials worked, not seats
          </h1>
          <p className="text-lg text-[#4A5A7A] max-w-2xl">
            The worklist is free forever and runs in your browser. Paid plans add the drafting,
            the deadline tracking and the real claim data — and the monthly fee buys a lower rate
            per denial, not a longer feature list.
          </p>

          <div className="mt-10">
            <PricingCalculator />
          </div>

          {/* What you're actually buying */}
          <h2 className="mt-16 text-xl font-bold text-[#1C1C1C]">What you&apos;re paying for</h2>
          <p className="mt-1 text-sm text-[#5A6A8A]">The part most vendor pages leave out.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {HONEST.map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-[#E0E6F5] bg-white px-5 py-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#1C1C1C]">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#4A5A7A]">{body}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="mt-14 text-xl font-bold text-[#1C1C1C]">Questions worth asking</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {FAQ.map(([q, a]) => (
              <div
                key={q}
                className="rounded-2xl border border-[#E0E6F5] bg-white px-5 py-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#1C1C1C]">{q}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#4A5A7A]">{a}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-[#4A5A7A]">
            Not sure what your denial volume actually is?{" "}
            <Link
              href="/#triage"
              className="font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
            >
              Run your export through the free worklist
            </Link>{" "}
            — it totals it for you, and nothing is uploaded. Or see{" "}
            <Link
              href="/architecture"
              className="font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
            >
              how Yeam connects
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
