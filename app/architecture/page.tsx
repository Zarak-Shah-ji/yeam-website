import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArchitectureFlow from "@/components/ArchitectureFlow";

/**
 * How Yeam gets data out of the systems a practice already runs.
 *
 * Ported from the app's internal /how-we-connect page. The flow diagram itself
 * lives in components/ArchitectureFlow (a client component that assembles on
 * scroll and animates the data path); this page keeps the copy and the
 * "where we are" gaps around it.
 */

export const metadata: Metadata = {
  title: "How Yeam Works",
  description:
    "Denials arrive as 835s from the clearinghouse, not the EHR. Yeam ranks each denial by what is recoverable and how long is left, maps even vague codes to a specific fix, and drafts the response for a biller to review.",
};

/** Direct answers to what billers say goes wrong with denial-automation tools:
 *  it is slow, it does not prioritize, it files on its own, and the data is not
 *  safe. Each card names the objection and how Yeam is built against it. */
const ANSWERS: [string, string][] = [
  [
    "Sorted the moment the export lands",
    "No ten-minute wait per claim. The whole remit is screened at once, so a biller starts on the workable denials right away instead of reading 400 lines to find them.",
  ],
  [
    "Ranked, not dumped",
    "Every denial is scored by dollars recoverable and days left to the filing deadline, so the queue leads with what pays and what is about to expire.",
  ],
  [
    "Nothing is sent without a person",
    "Yeam drafts the corrected claim or appeal for a biller to read, edit and approve. It prepares the work; it does not file behind your back.",
  ],
  [
    "Your data does not stick around",
    "The public demo runs on synthetic documents only. Live claims run under a signed BAA with zero data retention, in your browser.",
  ],
];

const GAPS: [string, string][] = [
  [
    "Multi-practice scoping",
    "Serving many practices from one workspace is the next thing we build, and it comes before any EHR connector.",
  ],
  [
    "BAA required for real data",
    "The public demo runs on synthetic documents only. A pilot on live claims means signing BAAs first.",
  ],
  [
    "The engine is the mature part",
    "Payer rules, filing windows and denial playbooks have been reviewed by working billing managers. Ingestion is younger.",
  ],
];

export default function ArchitecturePage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
            Architecture
          </p>
          <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1C] tracking-tight mb-4">
            How Yeam works, end to end
          </h1>
          <p className="text-lg text-[#4A5A7A] max-w-2xl">
            Denials arrive as 835s from the clearinghouse, not the EHR. Yeam reads that
            export, ranks each denial by what is still recoverable and how many days are
            left to file, and drafts the specific fix, all before a biller opens the first
            claim.
          </p>

          <ArchitectureFlow />

          {/* Vague-code worked example: the loudest complaint about denial-automation
              tools is that a code like CO-16 leads nowhere. Show the opposite. */}
          <div className="mt-10 rounded-2xl border border-[#A8BFEE] bg-[#EBF0FA] px-6 py-6 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1A4FBF]">
              A vague code still gets a specific next step
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4A5A7A]">
              CO-16 on its own only says &ldquo;missing information,&rdquo; which can mean a
              dozen different things. Yeam reads the remark codes riding with it, matches the
              payer&rsquo;s rule, and returns the one correction that clears the claim, not a
              generic &ldquo;resubmit with more info.&rdquo;
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="inline-flex w-fit items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-mono text-xs font-semibold text-red-600">
                CO-16 + N290
              </span>
              <svg className="hidden h-4 w-4 shrink-0 text-[#8A9BBF] sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
              <span className="inline-flex w-fit items-center rounded-lg border border-[#E0E6F5] bg-white px-3 py-1.5 text-xs font-medium text-[#4A5A7A]">
                Missing rendering-provider NPI
              </span>
              <svg className="hidden h-4 w-4 shrink-0 text-[#8A9BBF] sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
              <span className="inline-flex w-fit items-center rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                Add NPI, resubmit as corrected claim
              </span>
            </div>
          </div>

          {/* Answers to the objections billers raise about denial automation. */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {ANSWERS.map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-[#E0E6F5] bg-white px-5 py-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#1C1C1C]">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#4A5A7A]">{body}</p>
              </div>
            ))}
          </div>

          {/* Gaps */}
          <h2 className="mt-14 text-xl font-bold text-[#1C1C1C]">Where we are</h2>
          <p className="mt-1 text-sm text-[#5A6A8A]">The part most vendor pages leave out.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {GAPS.map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-[#E0E6F5] bg-white px-5 py-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#1C1C1C]">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#4A5A7A]">{body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-[#4A5A7A]">
            The output routing above is live:{" "}
            <Link
              href="/worklist"
              className="font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
            >
              run it on a sample denial in the worklist
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
