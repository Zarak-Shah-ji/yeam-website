const steps = [
  {
    number: "01",
    title: "Patient Checks In",
    description:
      "Front desk logs the appointment. Insurance is verified. The encounter is opened — and every subsequent action is linked to this visit.",
  },
  {
    number: "02",
    title: "Provider Documents, Claim Is Generated",
    description:
      "The provider documents the encounter with clinical notes and diagnosis codes. Yeam maps this to a claim automatically, flagging any coding gaps before submission.",
  },
  {
    number: "03",
    title: "Claim Submitted. AI Monitors.",
    description:
      "The claim goes to the payer. Yeam tracks every status update. If a denial comes back, it's surfaced immediately — not buried in a worklist.",
  },
  {
    number: "04",
    title: "Denial Received — AI Appeals in One Click",
    description:
      "Click 'AI Appeal.' Yeam drafts a complete, professional appeal letter using the denial reason, payer rules, and the patient's clinical record. Review and submit.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Patient Visit to Paid Claim — All in One System
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Yeam connects every step of the revenue cycle so nothing falls through
            the cracks.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute left-[2.25rem] top-10 bottom-10 w-px bg-slate-200" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-6 items-start relative">
                <div className="shrink-0 w-[4.5rem] h-[4.5rem] rounded-2xl bg-blue-50 border-2 border-blue-100 flex flex-col items-center justify-center z-10">
                  <span className="text-xs font-bold text-blue-400">{step.number}</span>
                </div>
                <div className="pt-3">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            See It in Action
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
