import Link from "next/link";
import HeroPipeline from "./HeroPipeline";

/**
 * The hero: one light, large line, two buttons, and one large pipeline scene.
 *
 * Deliberately calm. The old hero carried a 3D recovery pipeline, a pulsing cell
 * network and cursor parallax; it read as busy, so it is gone. What is left is
 * the Polar move: a calm, oversized headline set light and left-aligned, the two
 * actions, and a single wide picture of the product's story (HeroPipeline): one
 * export in, a worked queue out. That one scene replaced the four separate proof
 * cells the eye used to have to decode individually.
 */

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] px-6 pt-36 pb-24 md:pt-44 md:pb-32">
      {/* Faint, static brand wash. No motion, just depth behind the type. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 15% 30%, rgba(26,79,191,0.06), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <div className="max-w-4xl">
          <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] font-light leading-[1.05] tracking-tight text-[#1C1C1C]">
            The billing layer between your{" "}
            <span className="text-[#1A4FBF]">EHR</span>
            <br className="hidden sm:block" /> and the{" "}
            <span className="text-[#1A4FBF]">payer</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#5A6A8A]">
            Yeam tracks every claim on its way to getting paid and works the
            money that stalls. Today that means catching the denials worth
            working — ranked by what&apos;s recoverable and when they&apos;re
            due, drafted for your biller to approve. Runs alongside your EHR,
            nothing to rip out.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/worklist"
              className="inline-flex items-center justify-center rounded-xl bg-[#1A4FBF] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#1540A0]"
            >
              Run the free worklist
            </Link>
            <Link
              href="/architecture"
              className="inline-flex items-center justify-center rounded-xl border border-[#E0E6F5] bg-white px-7 py-3.5 text-base font-medium text-[#1C1C1C] transition-colors hover:bg-[#F0F4FC]"
            >
              See how Yeam works
            </Link>
          </div>
        </div>

        {/* The pipeline spans wider than the headline column, so it sits outside
            the max-w-4xl block: one export in, a worked queue out. */}
        <HeroPipeline />
      </div>
    </section>
  );
}
