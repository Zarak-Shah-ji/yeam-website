const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    name: "AI Receptionist",
    audience: "Front Desk",
    description:
      "Handles inbound calls, schedules appointments, verifies insurance, and sends automated patient reminders, without a human picking up the phone.",
    highlights: ["24/7 appointment scheduling", "Insurance verification", "Automated reminders", "Patient intake forms"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
    name: "AI Scribe",
    audience: "Providers",
    description:
      "Listens to patient encounters in real time and generates complete, structured SOAP notes automatically. Providers review and sign, no typing required.",
    highlights: ["Real-time transcription", "Structured SOAP notes", "ICD-10 code suggestions", "Provider review workflow"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
    name: "AI Medical Coder",
    audience: "Billing Staff",
    description:
      "Reads provider notes and maps them to accurate ICD-10 and CPT codes, flagging missing documentation before a claim is ever submitted.",
    highlights: ["ICD-10 & CPT code generation", "Documentation gap flagging", "Payer rule compliance", "One-click claim creation"],
    highlight: true,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
    name: "AI Nurse",
    audience: "Care Team",
    description:
      "Conducts post-visit follow-ups, delivers care plan instructions, answers patient questions, and flags abnormal responses back to the provider.",
    highlights: ["Post-visit follow-up calls", "Care plan delivery", "Patient Q&A (24/7)", "Provider escalation alerts"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    name: "AI Billing Agent",
    audience: "Billing Staff",
    description:
      "Submits claims, monitors payer responses, and drafts complete appeal letters in one click when a denial comes back, with denial reason and payer rules already applied.",
    highlights: ["Automated claim submission", "Real-time denial alerts", "One-click AI appeal drafts", "AR follow-up queue"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    name: "AI Analytics",
    audience: "Owners & Admins",
    description:
      "Practice-wide performance insights delivered in plain English. Revenue trends, denial patterns, and staff productivity, with an AI agent you can ask anything.",
    highlights: ["Revenue & collection charts", "Denial rate benchmarking", "Ask the AI agent anything", "Industry comparisons"],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            The AI Workforce
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Six AI Employees. One Platform.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every role in your clinic covered by a specialized AI agent, working together
            from the first call to the final payment.
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
