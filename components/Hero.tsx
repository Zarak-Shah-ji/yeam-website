"use client";

const NODES = [
  { id: "receptionist", label: "AI Receptionist", left: "8%",  top: "18%", delay: "0s" },
  { id: "scribe",       label: "AI Scribe",        left: "78%", top: "12%", delay: "1s" },
  { id: "coder",        label: "AI Coder",          left: "82%", top: "68%", delay: "2s" },
  { id: "nurse",        label: "AI Nurse",           left: "6%",  top: "70%", delay: "3s" },
  { id: "billing",      label: "AI Billing",         left: "46%", top: "80%", delay: "4s" },
];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Medical AI Constellation */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Animated connection lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="8%"  y1="18%" x2="78%" y2="12%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 5" opacity="0.18" style={{ animation: "heroDashFlow 4s linear infinite" }} />
          <line x1="78%" y1="12%" x2="82%" y2="68%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 5" opacity="0.18" style={{ animation: "heroDashFlow 4s linear infinite 0.7s" }} />
          <line x1="82%" y1="68%" x2="46%" y2="80%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 5" opacity="0.18" style={{ animation: "heroDashFlow 4s linear infinite 1.4s" }} />
          <line x1="46%" y1="80%" x2="6%"  y2="70%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 5" opacity="0.18" style={{ animation: "heroDashFlow 4s linear infinite 2.1s" }} />
          <line x1="6%"  y1="70%" x2="8%"  y2="18%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 5" opacity="0.18" style={{ animation: "heroDashFlow 4s linear infinite 2.8s" }} />
          <line x1="8%"  y1="18%" x2="82%" y2="68%" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 7" opacity="0.10" style={{ animation: "heroDashFlow 5s linear infinite 1s" }} />
          <line x1="78%" y1="12%" x2="6%"  y2="70%" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 7" opacity="0.10" style={{ animation: "heroDashFlow 5s linear infinite 3s" }} />
        </svg>

        {/* Floating agent nodes */}
        {NODES.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: node.left,
              top: node.top,
              animation: `heroFloat 7s ease-in-out infinite`,
              animationDelay: node.delay,
            }}
          >
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-2.5 py-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{node.label}</span>
            </div>
          </div>
        ))}

        {/* Soft glowing orbs */}
        <div className="absolute w-80 h-80 rounded-full bg-blue-200/25 blur-3xl" style={{ top: "2%", left: "2%", animation: "heroOrb 10s ease-in-out infinite" }} />
        <div className="absolute w-72 h-72 rounded-full bg-indigo-200/20 blur-3xl" style={{ top: "5%", right: "5%", animation: "heroOrb 12s ease-in-out infinite 3s" }} />
        <div className="absolute w-60 h-60 rounded-full bg-teal-200/20 blur-3xl" style={{ bottom: "10%", right: "10%", animation: "heroOrb 9s ease-in-out infinite 6s" }} />
        <div className="absolute w-56 h-56 rounded-full bg-violet-200/15 blur-3xl" style={{ bottom: "8%", left: "8%", animation: "heroOrb 11s ease-in-out infinite 1.5s" }} />
      </div>

      {/* Center radial fade for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 75% at 50% 42%, rgba(255,255,255,0.88) 0%, transparent 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
          AI Medical Workforce Platform
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          Hire AI Medical Employees.
          <br />
          <span className="text-blue-600">Not Software.</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Yeam deploys a full team of AI agents into your clinic, handling reception,
          documentation, coding, and billing, so your human staff can focus entirely on patients.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-base"
          >
            Book a Demo
          </a>
          <a
            href="https://yeamagentsystem.vercel.app/login?callbackUrl=%2F"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 text-base"
          >
            See the Platform
          </a>
        </div>

        {/* Social proof bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "HIPAA",    label: "Compliant" },
            { value: "SOC 2",    label: "Ready" },
            { value: "HL7/FHIR", label: "Compatible" },
            { value: "24/7",     label: "AI Agents Active" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center"
            >
              <div className="text-2xl font-bold text-blue-600">{badge.value}</div>
              <div className="text-xs text-slate-500 mt-1 leading-snug">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
