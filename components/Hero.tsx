"use client";

// ECG waveform: 10 cycles × 240px = 2400px per sweep, doubled for seamless scroll
const W = 240;   // one heartbeat cycle width
const B = 60;    // baseline y inside the 120-height SVG viewport
const N = 10;    // cycles per half (one full screen sweep)

function buildEcg(totalCycles: number): string {
  let d = "";
  for (let i = 0; i < totalCycles; i++) {
    const x = i * W;
    d += `${i === 0 ? "M" : "L"}${x},${B} `;
    d += `L${x + 45},${B} `;                          // flat baseline
    d += `L${x + 50},${B - 5} `;                      // P wave rise
    d += `L${x + 55},${B} `;                          // P wave fall
    d += `L${x + 68},${B} `;                          // PR interval
    d += `L${x + 71},${B - 50} `;                     // R peak (QRS up)
    d += `L${x + 74},${B + 46} `;                     // S trough (QRS down)
    d += `L${x + 77},${B} `;                          // QRS return
    d += `L${x + 95},${B} `;                          // ST segment
    d += `Q${x + 118},${B - 20} ${x + 140},${B} `;   // T wave
    d += `L${x + W},${B} `;                           // flat to next beat
  }
  return d.trim();
}

// Build 2N cycles so we can scroll by exactly N×W and loop seamlessly
const ECG_PATH = buildEcg(N * 2);
const SWEEP_PX = N * W; // 2400 — the translateX jump, matching CSS keyframe below

const TRACES = [
  { top: "18%",  opacity: 0.10, color: "#3b82f6", stroke: 1,   duration: 20, delay: -8  },
  { top: "50%",  opacity: 0.22, color: "#3b82f6", stroke: 1.5, duration: 15, delay:  0, glow: true },
  { top: "78%",  opacity: 0.08, color: "#818cf8", stroke: 1,   duration: 24, delay: -14 },
];

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

      {/* ECG traces + agent nodes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

        {/* Scrolling ECG heartbeat lines */}
        {TRACES.map((t, i) => (
          <div
            key={i}
            className="absolute overflow-hidden"
            style={{ top: t.top, left: 0, right: 0, height: 120, marginTop: -60, opacity: t.opacity }}
          >
            <svg
              width={SWEEP_PX * 2}
              height={120}
              viewBox={`0 0 ${SWEEP_PX * 2} 120`}
              style={{
                animation: `ecgScroll ${t.duration}s linear infinite`,
                animationDelay: `${t.delay}s`,
                filter: t.glow ? "drop-shadow(0 0 4px #3b82f6)" : "none",
              }}
            >
              <path d={ECG_PATH} fill="none" stroke={t.color} strokeWidth={t.stroke} />
            </svg>
          </div>
        ))}

        {/* Floating agent node pills */}
        {NODES.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: node.left,
              top: node.top,
              animation: "heroFloat 7s ease-in-out infinite",
              animationDelay: node.delay,
            }}
          >
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-2.5 py-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{node.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Center radial fade so headline stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 75% at 50% 42%, rgba(255,255,255,0.90) 0%, transparent 100%)",
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
