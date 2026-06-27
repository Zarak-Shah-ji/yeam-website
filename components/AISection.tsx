"use client";

import { useState, useRef, useEffect } from "react";

const suggestions = [
  "What did my scribe document?",
  "Show pending claims",
  "Any follow-up flags?",
  "How many appointments?",
  "Today's summary",
];

const responses: Record<string, string> = {
  "What did my scribe document?": "9 SOAP notes generated today. 2 are waiting on provider sign-off.",
  "Show pending claims": "14 claims queued. ENC-004 has a missing modifier, flagged for your review.",
  "Any follow-up flags?": "8 follow-ups completed. 1 abnormal lab result escalated to Dr. Chen.",
  "How many appointments?": "11 appointments booked today. 3 confirmation texts sent, 1 prior auth flagged.",
  "Today's summary": "11 booked, 9 documented, 14 claims coded, 8 follow-ups done. 1 escalation needs your review.",
};

const FALLBACK = "I don't have specific data on that. Try asking about appointments, claims, or follow-ups.";

type Message = { from: "user" | "ai"; text: string };

export default function AISection() {
  const [messages, setMessages] = useState<Message[]>([
    { from: "ai", text: "Today: 11 appointments booked, 9 encounters documented, 14 claims coded, 8 follow-ups completed. 1 escalation needs your review." },
  ]);
  const [input, setInput] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setTimeout(() => {
      const reply = responses[trimmed] ?? FALLBACK;
      setMessages((prev) => [...prev, { from: "ai", text: reply }]);
    }, 500);
  }

  return (
    <section id="ai-workforce" className="py-20 px-4 sm:px-6 bg-[#EEF2FA] overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
            AI Workforce
          </p>
          <h2 className="text-4xl font-bold text-[#1C1C1C] mb-4">
            A Full AI Workforce, Not a Feature.
          </h2>
          <p className="text-lg text-[#4A5A7A] max-w-2xl mx-auto">
            Your AI staff doesn&apos;t just flag work, it completes it: scheduling,
            documentation, coding, and billing, done automatically on every visit.
            Ask it anything.
          </p>
        </div>

        {/* Chat */}
        <div className="w-full bg-white rounded-2xl border border-[#E0E6F5] shadow-sm flex flex-col overflow-hidden min-h-[300px] h-[420px]">
          {/* Message thread */}
          <div ref={threadRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                {msg.from === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-[#1A4FBF] flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "bg-[#1A4FBF] text-white rounded-br-sm"
                      : "bg-[#F4F6FB] text-[#1C1C1C] rounded-bl-sm border border-[#E0E6F5]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion chips */}
          <div className="px-4 py-2 border-t border-[#E0E6F5] flex gap-2 overflow-x-auto max-w-full" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="shrink-0 px-3 py-1 bg-[#EBF0FA] border border-[#A8BFEE] rounded-lg text-xs text-[#1A4FBF] hover:bg-[#D0DAF5] transition-colors whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#E0E6F5] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about appointments, claims, follow-ups..."
              className="flex-1 text-sm text-[#1C1C1C] outline-none placeholder:text-[#9AA8BF] bg-transparent"
            />
            <button
              onClick={() => send(input)}
              className="w-7 h-7 rounded-full bg-[#1A4FBF] flex items-center justify-center hover:bg-[#1540A0] transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-xs text-[#7A8AAF] mt-3 text-center">
          Available anywhere in the platform via{" "}
          <kbd className="px-1 py-0.5 rounded bg-[#EBF0FA] text-[#4A5A7A] font-mono text-xs">⌘K</kbd>
        </p>
      </div>
    </section>
  );
}
