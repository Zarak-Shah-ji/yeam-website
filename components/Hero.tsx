"use client";

const TILT = 55;

const RINGS = [
  { r: 220, color: "rgba(196,98,45,0.30)", glow: "rgba(196,98,45,0.12)" },
  { r: 360, color: "rgba(139,69,19,0.22)", glow: "rgba(139,69,19,0.08)" },
  { r: 500, color: "rgba(212,149,106,0.18)", glow: "rgba(212,149,106,0.07)" },
];

const AGENTS = [
  { label: "AI Receptionist", dot: "#C4622D", ring: 0, startDeg:   0, dur: 11 },
  { label: "AI Scribe",       dot: "#8B4513", ring: 1, startDeg:  80, dur: 17 },
  { label: "AI Billing",      dot: "#D4956A", ring: 1, startDeg: 255, dur: 17 },
  { label: "AI Coder",        dot: "#A8522A", ring: 2, startDeg:  35, dur: 24 },
  { label: "AI Nurse",        dot: "#C4622D", ring: 2, startDeg: 200, dur: 24 },
];

export default function Hero() {
  return (
    <section className="relative pt-28 pb-0 px-6 bg-[#FAF7F2] overflow-hidden min-h-[90vh]">

      {/* Warm grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#C4622D 1px, transparent 1px), linear-gradient(to right, #C4622D 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* 3D orbiting rings */}
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
                  <div className="flex items-center gap-1.5 bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#E8DDD4] rounded-full px-2.5 py-1 shadow-md -translate-x-1/2 -translate-y-1/2">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                      style={{ backgroundColor: agent.dot }}
                    />
                    <span className="text-xs text-[#5C4A3A] font-medium whitespace-nowrap">
                      {agent.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Text block */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center">

        {/* Cream radial fade behind text */}
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
              "radial-gradient(ellipse 65% 75% at 50% 35%, rgba(250,247,242,0.97) 0%, rgba(250,247,242,0.82) 45%, rgba(250,247,242,0.25) 75%, transparent 100%)",
          }}
        />

        <div className="relative text-center max-w-3xl pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FDF0E8] text-[#C4622D] rounded-full text-sm font-medium mb-8 border border-[#E8C9B4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4622D] inline-block animate-pulse" />
            AI Medical Workforce Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1C1C1C] leading-tight tracking-tight mb-6">
            Hire AI Medical Employees.
            <br />
            <span className="text-[#C4622D]">Not Software.</span>
          </h1>

          <p className="text-xl text-[#5C4A3A] leading-relaxed mb-10">
            Yeam deploys a full team of AI agents into your clinic — handling reception,
            documentation, coding, and billing so your human staff can focus entirely on patients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#contact"
              className="px-8 py-3.5 bg-[#C4622D] text-white font-semibold rounded-xl hover:bg-[#A8522A] transition-colors shadow-sm text-base"
            >
              Book a Demo
            </a>
            <a
              href="https://yeamagentsystem.vercel.app/login?callbackUrl=%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-transparent text-[#C4622D] font-semibold rounded-xl hover:bg-[#FDF0E8] transition-colors border border-[#C4622D] text-base"
            >
              See the Platform
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "HIPAA",    label: "Compliant" },
              { value: "SOC 2",    label: "Ready" },
              { value: "HL7/FHIR", label: "Compatible" },
              { value: "24/7",     label: "AI Agents Active" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="bg-[#FAF7F2]/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-[#E8DDD4] text-center"
              >
                <div className="text-lg font-bold text-[#C4622D]">{badge.value}</div>
                <div className="text-xs text-[#8A7060] mt-0.5 leading-snug">{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
