"use client";

import { useState, useEffect } from "react";

const STEP_DURATION = 2500;

const APPEAL_TEXT =
  "Dear Appeals Department,\n\nWe are writing to formally appeal the denial of claim ENC-CMNAPYNX for services rendered to patient Mohamed Erdman on December 28, 2024.\n\nThe wellness visit (Z00.00) is a covered benefit under Texas Medicaid for patients 65+. Clinical documentation confirms medical necessity.";


const steps = [
  {
    id: 1,
    label: "Patient checks in",
    role: "Front Desk",
    roleColor: "text-green-700 bg-green-50 border-green-200",
    panel: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Record</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
            Checked In
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-base font-bold text-slate-900 mb-0.5">Mohamed Erdman</div>
          <div className="text-sm text-slate-500 mb-3">90y · MRN-TX-001671</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-slate-400">Appointment</div>
              <div className="font-medium text-slate-700">2:59 PM today</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Insurance</div>
              <div className="font-medium text-slate-700">Texas Medicaid</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
          AI flagged: prior auth may be needed for Z00.00
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: "Encounter documented",
    role: "Provider",
    roleColor: "text-violet-700 bg-violet-50 border-violet-200",
    panel: (
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinical Note</span>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">Chief Complaint</div>
            <div className="text-sm text-slate-700 font-medium">Annual wellness visit</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Diagnosis (ICD-10)</div>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md text-xs font-mono text-blue-700 font-semibold">
                Z00.00
              </div>
              <div className="text-xs text-slate-400 mt-1">General adult medical exam</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Procedure (CPT)</div>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md text-xs font-mono text-blue-700 font-semibold">
                99397
              </div>
              <div className="text-xs text-slate-400 mt-1">Preventive visit, 65+</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-0.5">Provider</div>
            <div className="text-sm text-slate-700 font-medium">Dr. Sarah Chen, MD</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd"/>
          </svg>
          Claim auto-generated from this encounter
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: "Claim submitted",
    role: "Billing",
    roleColor: "text-blue-700 bg-blue-50 border-blue-200",
    panel: (
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim Status</span>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-slate-700">ENC-CMNAPYNX</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse" />
              Submitted
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-slate-400">Payer</div>
              <div className="font-medium text-slate-700">Texas Medicaid</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Billed Amount</div>
              <div className="font-medium text-slate-700">$5,125.00</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Date Submitted</div>
              <div className="font-medium text-slate-700">Dec 28, 2024</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Patient</div>
              <div className="font-medium text-slate-700">Mohamed Erdman</div>
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "40%" }} />
        </div>
        <p className="text-xs text-slate-400 text-center">Awaiting payer adjudication · Est. 14–30 days</p>
      </div>
    ),
  },
  {
    id: 4,
    label: "Denial received",
    role: "Billing",
    roleColor: "text-blue-700 bg-blue-50 border-blue-200",
    panel: (
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim Update</span>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-slate-700">ENC-CMNAPYNX</span>
            <span className="text-xs font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
              DENIED
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Denial Reason</div>
            <div className="text-sm text-slate-700 font-medium leading-snug">
              Missing prior authorization for wellness visit (Z00.00) — procedure not pre-approved by payer.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-slate-400">Amount at Risk</div>
              <div className="font-bold text-red-600">$5,125.00</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Denial Date</div>
              <div className="font-medium text-slate-700">Jan 12, 2025</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          AI is ready to draft an appeal — click AI Appeal
        </div>
      </div>
    ),
  },
  {
    id: 5,
    label: "AI drafts appeal",
    role: "AI Agent",
    roleColor: "text-purple-700 bg-purple-50 border-purple-200",
    panel: null, // rendered separately for typewriter
  },
  {
    id: 6,
    label: "Appeal submitted",
    role: "Billing",
    roleColor: "text-blue-700 bg-blue-50 border-blue-200",
    panel: (
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Appeal Status</span>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div className="text-base font-bold text-green-800">Appeal Submitted</div>
          <div className="text-sm text-green-600">ENC-CMNAPYNX · Texas Medicaid</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Revenue protected</span>
            <span className="font-bold text-slate-900">$5,125.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Time to appeal</span>
            <span className="font-bold text-slate-900">&lt; 2 minutes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Est. resolution</span>
            <span className="font-bold text-slate-900">14 business days</span>
          </div>
        </div>
        <div className="text-center text-xs text-slate-400">
          Without Yeam, 60% of denied claims are never appealed.
        </div>
      </div>
    ),
  },
];

function TypewriterPanel({ active }: { active: boolean }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(APPEAL_TEXT.slice(0, i));
      if (i >= APPEAL_TEXT.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Appeal Draft</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          Drafting with AI...
        </span>
      </div>
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 min-h-[160px]">
        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
          {displayed}
          {displayed.length < APPEAL_TEXT.length && (
            <span className="inline-block w-0.5 h-3.5 bg-blue-500 ml-0.5 animate-pulse align-middle" />
          )}
        </pre>
      </div>
      {displayed.length >= APPEAL_TEXT.length && (
        <button className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg">
          Submit Appeal →
        </button>
      )}
    </div>
  );
}

export default function AnimatedWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Advance step on a clean timeout — no interval interference
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setActiveStep((s) => (s + 1) % steps.length);
    }, STEP_DURATION);
    return () => clearTimeout(timer);
  }, [activeStep, paused]);

  // Animate progress bar independently
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const tick = 50;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + (tick / STEP_DURATION) * 100;
        return next >= 100 ? 100 : next;
      });
    }, tick);
    return () => clearInterval(interval);
  }, [activeStep, paused]);

  const current = steps[activeStep];

  return (
    <section className="py-20 px-6 bg-white border-y border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
            A Day in the Life
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            From Patient Visit to Paid Claim
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Watch how Yeam moves a claim through the full revenue cycle —
            and recovers denied revenue automatically.
          </p>
        </div>

        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Progress bar */}
          <div className="h-0.5 bg-slate-100">
            <div
              className="h-full bg-blue-500 transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid md:grid-cols-[240px_1fr]">
            {/* Left: step list */}
            <div className="border-r border-slate-100 p-5 space-y-1">
              {steps.map((step, i) => {
                const isActive = i === activeStep;
                const isDone = i < activeStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(i)}
                    className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Step circle */}
                    <div
                      className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                        isDone
                          ? "bg-blue-600 text-white"
                          : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isDone ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-medium leading-snug ${isActive ? "text-blue-700" : isDone ? "text-slate-500" : "text-slate-600"}`}>
                        {step.label}
                      </div>
                      <div className={`text-xs mt-0.5 px-1.5 py-0.5 rounded border inline-block ${step.roleColor}`}>
                        {step.role}
                      </div>
                    </div>
                  </button>
                );
              })}
              <p className="text-xs text-slate-300 text-center pt-2">
                Hover to pause
              </p>
            </div>

            {/* Right: active panel */}
            <div className="p-6 min-h-[320px]">
              <div
                key={activeStep}
                className="animate-[fadeSlideIn_0.3s_ease]"
              >
                {current.id === 5 ? (
                  <TypewriterPanel active={activeStep === 4} />
                ) : (
                  current.panel
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
