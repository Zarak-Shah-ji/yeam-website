const audiences = [
  {
    role: "Clinic Owner / Physician",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    headline: "Reduce staffing costs, not care quality.",
    points: [
      "Replace repetitive admin roles with always-on AI agents",
      "Cut documentation time per provider from hours to minutes",
      "Scale patient volume without scaling your headcount",
    ],
  },
  {
    role: "Practice Manager",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
      </svg>
    ),
    headline: "One AI workforce replaces three full-time hires.",
    points: [
      "AI Receptionist, Scribe, and Coder running 24/7 with no turnover",
      "One dashboard showing every agent's activity across the day",
      "AI flags issues before they become costly problems",
    ],
  },
  {
    role: "Provider / Physician",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    headline: "Practice medicine. Let AI handle the paperwork.",
    points: [
      "AI Scribe writes your notes while you focus on the patient",
      "Review and sign in seconds, no manual documentation",
      "AI Nurse handles follow-ups so your inbox stays clear",
    ],
  },
];

export default function Audiences() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            Built for Everyone in Your Clinic
          </p>
          <h2 className="text-4xl font-bold text-slate-900">
            The Right AI Agent for Every Role
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((a) => (
            <div
              key={a.role}
              className="bg-white rounded-2xl p-7 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                {a.icon}
              </div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                {a.role}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 leading-snug">
                {a.headline}
              </h3>
              <ul className="space-y-2.5">
                {a.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg
                      className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
          ))}
        </div>
      </div>
    </section>
  );
}
