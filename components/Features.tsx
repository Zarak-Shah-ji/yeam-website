const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    name: "Real-Time Dashboard",
    audience: "Admin & Owners",
    description:
      "See the health of your entire practice at a glance. Patients today, pending claims, denial rate, and total AR balance — all updated live. No more end-of-month surprises.",
    highlights: ["Live KPI monitoring", "Pending claims tracker", "AR balance view", "Today's appointment feed"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    name: "Patients & Appointments",
    audience: "Front Desk",
    description:
      "Every patient record in one place — demographics, insurance, contact, MRN, and appointment history. Search by name, email, or record number in seconds.",
    highlights: ["Complete patient records", "Insurance tracking", "Appointment scheduling", "MRN-linked history"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
    name: "Clinical Encounters",
    audience: "Providers",
    description:
      "Document every patient visit with clinical notes tied directly to billing codes. What gets documented gets billed — correctly, the first time.",
    highlights: ["Visit documentation", "ICD-10 & CPT code linking", "Provider notes", "Diagnosis tracking"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    name: "Claims Management",
    audience: "Billing Staff",
    description:
      "Track every claim from submission to payment. See status, payer, dates, and amounts across your entire claim volume — filtered any way you need.",
    highlights: ["Full claim lifecycle", "Payer-specific tracking", "Status monitoring", "Submission history"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    name: "AI Billing & Appeal",
    audience: "Billing Staff",
    description:
      "When a claim is denied, Yeam's AI drafts a complete, professional appeal letter in one click — referencing the denial reason, payer rules, and patient data. Submit it immediately.",
    highlights: ["One-click AI appeal drafts", "Denial reason analysis", "Payer-specific language", "Pending submission queue"],
    highlight: true,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    name: "Analytics Intelligence",
    audience: "Owners & Admins",
    description:
      "Revenue trends, denial rate benchmarks, top diagnoses, and AR reporting — with an AI agent you can ask anything in plain English. Compare your performance to 11M+ industry claims.",
    highlights: ["Revenue & collection charts", "Denial rate trend tracking", "Industry benchmarking", "Ask the AI agent anything"],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            The Platform
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Every Part of Your Practice, Connected
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From the front desk to the billing department, Yeam covers the full cycle —
            with AI embedded at every step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.name}
              className={`rounded-2xl p-7 border transition-shadow hover:shadow-md ${
                feature.highlight
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-white border-slate-200"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                  feature.highlight
                    ? "bg-blue-500 text-white"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {feature.icon}
              </div>

              <div
                className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                  feature.highlight ? "text-blue-200" : "text-blue-600"
                }`}
              >
                {feature.audience}
              </div>

              <h3
                className={`text-xl font-bold mb-3 ${
                  feature.highlight ? "text-white" : "text-slate-900"
                }`}
              >
                {feature.name}
              </h3>

              <p
                className={`text-sm leading-relaxed mb-4 ${
                  feature.highlight ? "text-blue-100" : "text-slate-500"
                }`}
              >
                {feature.description}
              </p>

              <ul className="space-y-1.5">
                {feature.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 shrink-0 ${
                        feature.highlight ? "text-blue-200" : "text-blue-500"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={feature.highlight ? "text-blue-100" : "text-slate-600"}>
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
