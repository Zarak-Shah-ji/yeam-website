const agentActivities = [
  { role: "analytics", color: "bg-blue-100 text-blue-700", message: "Denial rate this month is 8.2% — up from 6.1% last month. Top cause: missing prior authorizations for Z00.00 visits." },
  { role: "billing", color: "bg-amber-100 text-amber-700", message: "Draft appeal ready for ENC-CMNAPYNX (Kareem Marks, Texas Medicaid). Reason: services medically necessary per clinical notes dated 12/28." },
  { role: "analytics", color: "bg-blue-100 text-blue-700", message: "Your collection rate (67%) is below the Texas Medicaid benchmark of 78%. Primary gap: 34 claims over 90 days unpursued." },
  { role: "front desk", color: "bg-green-100 text-green-700", message: "Patient Mohamed Erdman has a lapsed prior auth. Flagging before today's 2:59 PM appointment." },
];

const agentQuestions = [
  "What is our current denial rate?",
  "Show me revenue trends for the last 30 days",
  "How do our collection rates compare to industry benchmark?",
  "Which payers are denying most frequently?",
  "Are there anomalies in our denial data?",
  "Give me a performance report on claims",
];

export default function AISection() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            AI Agents
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Not Just a Chatbot. An AI Team.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Yeam runs multiple AI agents simultaneously — across analytics, billing,
            and front desk — so your team always knows what needs attention and why.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Agent Activity Feed */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Agent Activity — Live
            </h3>
            <div className="space-y-3">
              {agentActivities.map((activity, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-slate-200 flex gap-3 items-start"
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 mt-0.5 ${activity.color}`}
                  >
                    {activity.role}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{activity.message}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              AI agents work continuously in the background — you're always informed.
            </p>
          </div>

          {/* Analytics AI Chat */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Ask the Analytics Agent
            </h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex flex-wrap gap-2">
                  {agentQuestions.map((q) => (
                    <span
                      key={q}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 cursor-default hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="bg-slate-50 rounded-lg p-3 mb-3 text-sm text-slate-700 border border-slate-100">
                  <span className="font-medium text-blue-600">Analytics Agent: </span>
                  Yes — I have access to the statewide Texas Medicaid dataset (11M+ claims, 2018–2024) and your clinic&apos;s own EHR data. I can benchmark your performance against the full industry.
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 bg-white">
                  <input
                    type="text"
                    placeholder="Ask anything about your practice data..."
                    className="flex-1 text-sm text-slate-500 outline-none bg-transparent"
                    readOnly
                  />
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Available everywhere in the system via <kbd className="px-1 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-xs">⌘K</kbd>
                </p>
              </div>
            </div>

            {/* Benchmark callout */}
            <div className="mt-4 bg-blue-600 rounded-xl p-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-2">
                Industry Benchmarking
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Yeam is trained on <strong className="text-white">11M+ Texas Medicaid claims</strong> (2018–2024) — so you can see exactly how your denial rate, collection rate, and top diagnoses compare to every other clinic in your state.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
