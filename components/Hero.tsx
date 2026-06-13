"use client";

const TILT = 55;

// Foreground ring radii — scaled up to fill the section
const RINGS = [
  { r: 220, color: "rgba(59,130,246,0.28)", glow: "rgba(59,130,246,0.10)" },
  { r: 360, color: "rgba(99,102,241,0.22)", glow: "rgba(99,102,241,0.08)" },
  { r: 500, color: "rgba(20,184,166,0.18)", glow: "rgba(20,184,166,0.06)" },
];

const AGENTS = [
  { label: "AI Receptionist", dot: "#3b82f6", ring: 0, startDeg:   0, dur: 11 },
  { label: "AI Scribe",       dot: "#14b8a6", ring: 1, startDeg:  80, dur: 17 },
  { label: "AI Billing",      dot: "#6366f1", ring: 1, startDeg: 255, dur: 17 },
  { label: "AI Coder",        dot: "#8b5cf6", ring: 2, startDeg:  35, dur: 24 },
  { label: "AI Nurse",        dot: "#10b981", ring: 2, startDeg: 200, dur: 24 },
];

export default function Hero() {
  return (
    <section className="relative pt-28 pb-0 px-6 bg-white overflow-hidden min-h-[90vh]">

      {/* ── 1. Static grid ────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── 2. Aurora blobs (mix-blend-mode: multiply on white = soft tint) ──── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Teal — upper-left */}
        <div
          className="absolute rounded-full"
          style={{
            width: 680, height: 680,
            background: "#2dd4bf",
            filter: "blur(130px)",
            opacity: 0.18,
            top: -160, left: -120,
            mixBlendMode: "multiply",
            animation: "auroraBlob1 22s ease-in-out infinite",
          }}
        />
        {/* Blue — upper-right */}
        <div
          className="absolute rounded-full"
          style={{
            width: 560, height: 560,
            background: "#60a5fa",
            filter: "blur(110px)",
            opacity: 0.16,
            top: -80, right: -100,
            mixBlendMode: "multiply",
            animation: "auroraBlob2 28s ease-in-out infinite",
          }}
        />
        {/* Indigo — lower-center (left: calc centers the 620px blob) */}
        <div
          className="absolute rounded-full"
          style={{
            width: 620, height: 620,
            background: "#818cf8",
            filter: "blur(120px)",
            opacity: 0.13,
            bottom: -60, left: "calc(50% - 310px)",
            mixBlendMode: "multiply",
            animation: "auroraBlob3 19s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── 3. Full-section orbiting rings ───────────────────────────────────────
           Centered at 58% of section height so rings fill the lower hero area
           while the top arc sits just behind the text block.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: "58%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1100px",
          height: "1100px",
          perspective: "1200px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transform: `rotateX(${TILT}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Ring borders */}
          {RINGS.map((ring, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: ring.r * 2,
                height: ring.r * 2,
                top: "50%",
                left: "50%",
                marginTop: -ring.r,
                marginLeft: -ring.r,
                border: `1px solid ${ring.color}`,
                boxShadow: `0 0 40px ${ring.glow}`,
              }}
            />
          ))}

          {/* Orbiting agent nodes */}
          {AGENTS.map((agent) => {
            const r = RINGS[agent.ring].r;
            const delay = -((agent.startDeg / 360) * agent.dur);
            return (
              <div
                key={agent.label}
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{
                  animation: `orbit ${agent.dur}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              >
                <div
                  className="absolute"
                  style={{
                    transform: `translateX(${r}px) rotateX(-${TILT}deg)`,
                    top: 0,
                    left: 0,
                  }}
                >
                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-2.5 py-1 shadow-md -translate-x-1/2 -translate-y-1/2">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                      style={{ backgroundColor: agent.dot }}
                    />
                    <span className="text-xs text-slate-700 font-medium whitespace-nowrap">
                      {agent.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Text block — white radial fade behind copy only ───────────────── */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center">

        {/* Localized backdrop — softens aurora + rings behind text without
            wiping out the full hero background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            top: -24,
            left: "50%",
            transform: "translateX(-50%)",
            width: "860px",
            height: "640px",
            background:
              "radial-gradient(ellipse 65% 75% at 50% 35%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.20) 75%, transparent 100%)",
          }}
        />

        <div className="relative text-center max-w-3xl pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            AI Medical Workforce Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            Hire AI Medical Employees.
            <br />
            <span className="text-blue-600">Not Software.</span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed mb-10">
            Yeam deploys a full team of AI agents into your clinic — handling reception,
            documentation, coding, and billing so your human staff can focus entirely on patients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

          {/* Social proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "HIPAA",    label: "Compliant" },
              { value: "SOC 2",    label: "Ready" },
              { value: "HL7/FHIR", label: "Compatible" },
              { value: "24/7",     label: "AI Agents Active" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-slate-100 text-center"
              >
                <div className="text-lg font-bold text-blue-600">{badge.value}</div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
