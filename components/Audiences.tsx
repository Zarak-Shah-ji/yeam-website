/**
 * Who this is for.
 *
 * Written for billing companies rather than clinic roles. A billing company
 * already does denial work by hand, carries several practices' volume, needs no
 * EHR from us, and improves its own margin by working more denials per head —
 * so one sale reaches many practices. The clinic-role version this replaced
 * pitched an AI workforce the product does not ship.
 */

const audiences = [
  {
    role: "Billing company owner",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    headline: "Work more denials per biller, not more billers.",
    points: [
      "Triage arrives sorted — nobody reads 400 remits to find the live ones",
      "Margin improves without adding headcount",
      "One workspace across every practice you serve",
    ],
  },
  {
    role: "Denial management lead",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    headline: "Nothing dies in the queue on a filing deadline.",
    points: [
      "Every denial carries its remaining days, by payer",
      "Corrected claims separated from appeals before anyone starts writing",
      "Dead denials marked dead, so nobody works them twice",
    ],
  },
  {
    role: "Practice you bill for",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    headline: "Keep your EHR. Recover the revenue anyway.",
    points: [
      "No rip and replace — denials come from the clearinghouse, not the chart",
      "Every response reviewed and approved before it is sent",
      "Repeat denials surfaced so the same mistake stops recurring",
    ],
  },
];

export default function Audiences() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            Built for the people who work denials
          </p>
          <h2 className="text-4xl font-bold text-slate-900">
            Most denials are never worked at all
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
