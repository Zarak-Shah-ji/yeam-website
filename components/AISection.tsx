const agentActivities = [
  { role: "receptionist", color: "bg-green-100 text-green-700", message: "Scheduled 3 appointments for tomorrow and sent confirmation texts to all patients. Prior auth flagged for Mohamed Erdman, 2:59 PM." },
  { role: "scribe", color: "bg-violet-100 text-violet-700", message: "SOAP note generated for Dr. Chen's 1:30 PM encounter. ICD-10 Z00.00 and CPT 99397 suggested based on visit documentation." },
  { role: "coder", color: "bg-amber-100 text-amber-700", message: "3 claims coded and queued for submission. Missing modifier flagged on claim ENC-004 before it goes to payer." },
  { role: "nurse", color: "bg-blue-100 text-blue-700", message: "Post-visit follow-up completed for 8 patients. 1 abnormal response escalated to Dr. Chen for review." },
];

const agentQuestions = [
  "What did my AI Scribe document today?",
  "Show me pending claims from the AI Coder",
  "Any follow-up flags from the AI Nurse?",
  "How many appointments did AI Receptionist book?",
  "Which claims need provider review?",
  "Give me today's AI workforce summary",
];

export default function AISection() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            AI Workforce
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            A Full AI Workforce, Not a Feature.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Yeam runs specialized AI agents simultaneously, across reception, documentation,
            coding, and nursing, so your team always knows what needs attention and why.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Agent Activity Feed */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Agent Activity, Live
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
              AI agents work continuously in the background, keeping you always informed.
            </p>
          </div>

          {/* AI Command Center */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Ask Your AI Workforce
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
                  <span className="font-medium text-blue-600">AI Workforce: </span>
                  Today your AI Receptionist booked 11 appointments, AI Scribe documented 9 encounters, AI Coder queued 14 claims, and AI Nurse completed 8 patient follow-ups. One escalation is pending your review.
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 bg-white">
                  <input
                    type="text"
                    placeholder="Ask anything about your clinic operations..."
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

            {/* Workforce callout */}
            <div className="mt-4 bg-blue-600 rounded-xl p-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-2">
                Why AI Employees?
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Unlike software tools, Yeam&apos;s AI agents <strong className="text-white">take action autonomously</strong>, not just surface information. They schedule, document, code, follow up, and bill, all without a human in the loop unless escalation is needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
