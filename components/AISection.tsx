const agentActivities = [
  { role: "receptionist", color: "bg-[#F0F7E8] text-[#5C8A3A]", message: "Scheduled 3 appointments for tomorrow and sent confirmation texts to all patients. Prior auth flagged for Mohamed Erdman, 2:59 PM." },
  { role: "scribe", color: "bg-[#F5F0FA] text-[#6B4A8A]", message: "SOAP note generated for Dr. Chen's 1:30 PM encounter. ICD-10 Z00.00 and CPT 99397 suggested based on visit documentation." },
  { role: "coder", color: "bg-[#FDF0E8] text-[#8B4513]", message: "3 claims coded and queued for submission. Missing modifier flagged on claim ENC-004 before it goes to payer." },
  { role: "nurse", color: "bg-[#FDF0E8] text-[#C4622D]", message: "Post-visit follow-up completed for 8 patients. 1 abnormal response escalated to Dr. Chen for review." },
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
    <section id="ai-workforce" className="py-10 md:py-20 px-6 bg-[#F5F0EB]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-14">
          <p className="text-[#C4622D] text-sm font-semibold uppercase tracking-wider mb-3">
            AI Workforce
          </p>
          <h2 className="text-4xl font-bold text-[#1C1C1C] mb-4">
            A Full AI Workforce, Not a Feature.
          </h2>
          <p className="text-lg text-[#5C4A3A] max-w-2xl mx-auto">
            Yeam runs specialized AI agents simultaneously, across reception, documentation,
            coding, and nursing, so your team always knows what needs attention and why.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* Agent Activity Feed */}
          <div>
            <h3 className="text-sm font-semibold text-[#8A7060] uppercase tracking-wider mb-4">
              Agent Activity, Live
            </h3>
            <div className="space-y-3">
              {agentActivities.map((activity, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-[#E8DDD4] flex gap-3 items-start"
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 mt-0.5 ${activity.color}`}
                  >
                    {activity.role}
                  </span>
                  <p className="text-sm text-[#3A3A3A] leading-relaxed">{activity.message}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#B0A090] mt-3 text-center">
              AI agents work continuously in the background, keeping you always informed.
            </p>
          </div>

          {/* AI Command Center */}
          <div>
            <h3 className="text-sm font-semibold text-[#8A7060] uppercase tracking-wider mb-4">
              Ask Your AI Workforce
            </h3>
            <div className="bg-white rounded-2xl border border-[#E8DDD4] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#E8DDD4] bg-[#FAF7F2]">
                <div className="flex flex-wrap gap-2">
                  {agentQuestions.map((q) => (
                    <span
                      key={q}
                      className="px-3 py-1.5 bg-white border border-[#E8DDD4] rounded-lg text-xs text-[#5C4A3A] cursor-default hover:border-[#C4622D] hover:text-[#C4622D] transition-colors"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="bg-[#FAF7F2] rounded-lg p-3 mb-3 text-sm text-[#3A3A3A] border border-[#E8DDD4]">
                  <span className="font-medium text-[#C4622D]">AI Workforce: </span>
                  Today your AI Receptionist booked 11 appointments, AI Scribe documented 9 encounters, AI Coder queued 14 claims, and AI Nurse completed 8 patient follow-ups. One escalation is pending your review.
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-[#E8DDD4] px-3 py-2.5 bg-white">
                  <input
                    type="text"
                    placeholder="Ask anything about your clinic operations..."
                    className="flex-1 text-sm text-[#8A7060] outline-none bg-transparent"
                    readOnly
                  />
                  <div className="w-7 h-7 rounded-full bg-[#C4622D] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[#B0A090] mt-2 text-center">
                  Available everywhere in the system via <kbd className="px-1 py-0.5 rounded bg-[#F0EBE4] text-[#5C4A3A] font-mono text-xs">⌘K</kbd>
                </p>
              </div>
            </div>

            {/* Workforce callout */}
            <div className="mt-4 bg-[#C4622D] rounded-xl p-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#F5D5C0] mb-2">
                Why AI Employees?
              </div>
              <p className="text-sm text-[#FDEEE6] leading-relaxed">
                Unlike software tools, Yeam&apos;s AI agents <strong className="text-white">take action autonomously</strong>, not just surface information. They schedule, document, code, follow up, and bill, all without a human in the loop unless escalation is needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
