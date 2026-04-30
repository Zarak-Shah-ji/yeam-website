const steps = [
  {
    number: "01",
    title: "Patient Calls or Books Online",
    description:
      "AI Receptionist answers the call, schedules the appointment, verifies insurance, and sends an automated reminder, all without a human at the front desk.",
  },
  {
    number: "02",
    title: "Provider Sees the Patient",
    description:
      "AI Scribe listens to the encounter in real time and generates complete SOAP notes automatically. The provider reviews, signs, and moves on. No typing required.",
  },
  {
    number: "03",
    title: "AI Codes and Submits the Claim",
    description:
      "AI Coder maps clinical notes to accurate ICD-10 and CPT codes, flagging any gaps before submission. AI Billing then submits the claim and monitors payer responses.",
  },
  {
    number: "04",
    title: "Denial Received, AI Appeals in One Click",
    description:
      "If a claim is denied, AI Billing drafts a complete, professional appeal letter using the denial reason, payer rules, and the patient record. Review and submit.",
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
            Patient Call to Paid Claim, All Handled by AI
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Every step of the patient journey has a dedicated AI agent working behind the scenes.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute left-[2.25rem] top-10 bottom-10 w-px bg-slate-200" />

          <div className="space-y-8">
            {steps.map((step) => (
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
