import Reveal from "./Reveal";
import { TriageMotif, DraftMotif, PayerMotif, EhrMotif } from "./FeatureMotifs";

/**
 * The capability sections, Polar-style.
 *
 * Each capability gets one row: a short eyebrow, a light heading, one sentence,
 * three small bullets, and a small illustrative panel that alternates side by
 * side with the copy. The point is a lot of white space and very little text,
 * with a picture that says what the words would have.
 *
 * Every colour class here already has a dark-theme entry in globals.css, so the
 * whole block themes for free. The motifs are inline SVG/markup on currentColor,
 * no asset files; they animate themselves (see FeatureMotifs), a scroll-in
 * assemble plus a small ambient loop each, all behind prefers-reduced-motion.
 */

type Feature = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  motif: React.ReactNode;
};

const FEATURES: Feature[] = [
  {
    eyebrow: "Triage",
    title: "Every remit, sorted the moment it lands.",
    body: "No ten-minute wait per claim. The whole export is screened at once and ranked, so a biller opens the workable denials first.",
    points: [
      "Ranked by dollars recoverable and days left to file",
      "Corrected claims separated from appeals up front",
      "Dead denials marked dead, so nobody works them twice",
    ],
    motif: <TriageMotif />,
  },
  {
    eyebrow: "Drafting",
    title: "The response, drafted for a person to approve.",
    body: "Yeam prepares the corrected claim, appeal or reprocessing request for the payer. It does the writing; a biller does the sending.",
    points: [
      "Submission-ready output per payer",
      "Corrected claims, appeals and reprocessing requests",
      "Nothing is filed without a review",
    ],
    motif: <DraftMotif />,
  },
  {
    eyebrow: "Payer intelligence",
    title: "A vague code still gets a specific next step.",
    body: "CO-16 alone only says missing information. Yeam reads the remark codes riding with it, matches the payer rule, and returns the one fix that clears the claim.",
    points: [
      "Remark codes read, not ignored",
      "Payer windows, channels and forms built in",
      "One correction, not a generic resubmit",
    ],
    motif: <PayerMotif />,
  },
  {
    eyebrow: "Works with your stack",
    title: "Keep your EHR. Recover the revenue anyway.",
    body: "Denials arrive as 835s from the clearinghouse, not the chart, so there is nothing to rip out and replace. Yeam runs alongside what you already have.",
    points: [
      "No integration project to start working denials",
      "Runs on the export you already pull",
      "Repeat denials surfaced by payer and code",
    ],
    motif: <EhrMotif />,
  },
];

export default function Features() {
  return (
    <section className="bg-[#FFFFFF] px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-[1600px]">
        <p data-reveal className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1A4FBF]">
          What Yeam does
        </p>
        <h2 data-reveal className="max-w-3xl text-3xl font-light tracking-tight text-[#1C1C1C] md:text-5xl">
          One export in. A worked queue out.
        </h2>

        <div className="mt-16 flex flex-col gap-16 md:gap-24">
          {FEATURES.map((f, i) => (
            <div
              key={f.eyebrow}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div data-reveal className={i % 2 === 1 ? "md:order-2" : ""}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#1A4FBF]">
                  {f.eyebrow}
                </p>
                <h3 className="text-2xl font-light tracking-tight text-[#1C1C1C] md:text-3xl">
                  {f.title}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#5A6A8A]">
                  {f.body}
                </p>
                <ul className="mt-6 space-y-3">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[15px] text-[#4A5A7A]">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#1A4FBF]" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div data-reveal className={i % 2 === 1 ? "md:order-1" : ""}>
                <div className="rounded-2xl border border-[#E0E6F5] bg-[#F7F9FE] p-6 shadow-sm sm:p-8">
                  {f.motif}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
