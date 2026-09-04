import Link from "next/link";
import Reveal from "./Reveal";

/**
 * The compact home-page teaser for the free worklist.
 *
 * The full tool moved to /worklist; this is the invitation that used to be the
 * whole section. One tinted card: a line, the proof points, and a button. The
 * tint tokens (#EBF0FA / #A8BFEE) both have dark-theme entries in globals.css.
 */

const PROOF = [
  "Runs in your browser",
  "No account",
  "Zero data retention",
  "Free and unlimited",
];

export default function WorklistTeaser() {
  return (
    <section className="bg-[#FFFFFF] px-6 py-20 md:py-24">
      <Reveal className="mx-auto max-w-[1600px]">
        <div
          data-reveal
          className="flex flex-col items-start gap-8 rounded-3xl border border-[#A8BFEE] bg-[#EBF0FA] p-8 sm:p-12 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#1A4FBF]">
              Free, no account
            </p>
            <h2 className="text-2xl font-light tracking-tight text-[#1C1C1C] md:text-4xl">
              Run your own denials, in the browser.
            </h2>
            <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1 text-sm text-[#4A5A7A]">
              {PROOF.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-[#8A9BBF]">
                      ·
                    </span>
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/worklist"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#1A4FBF] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#1540A0]"
          >
            Open the worklist
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
