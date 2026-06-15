"use client";

const TILT = 55;

const RINGS = [
  { r: 220, color: "rgba(26,79,191,0.30)", glow: "rgba(26,79,191,0.12)" },
  { r: 360, color: "rgba(21,64,160,0.22)", glow: "rgba(21,64,160,0.08)" },
  { r: 500, color: "rgba(107,155,240,0.18)", glow: "rgba(107,155,240,0.07)" },
];

const AGENTS = [
  { label: "AI Receptionist", dot: "#1A4FBF", ring: 0, startDeg:   0, dur: 11 },
  { label: "AI Scribe",       dot: "#0F2E6B", ring: 1, startDeg:  80, dur: 17 },
  { label: "AI Billing",      dot: "#6B9BF0", ring: 1, startDeg: 255, dur: 17 },
  { label: "AI Coder",        dot: "#1540A0", ring: 2, startDeg:  35, dur: 24 },
  { label: "AI Nurse",        dot: "#1A4FBF", ring: 2, startDeg: 200, dur: 24 },
];

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 px-6 bg-[#FFFFFF] overflow-hidden min-h-[90vh]">

      {/* Warm grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1A4FBF 1px, transparent 1px), linear-gradient(to right, #1A4FBF 1px, transparent 1px)",
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
                  <div className="flex items-center gap-1.5 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E0E6F5] rounded-full px-2.5 py-1 shadow-md -translate-x-1/2 -translate-y-1/2">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                      style={{ backgroundColor: agent.dot }}
                    />
                    <span className="text-xs text-[#4A5A7A] font-medium whitespace-nowrap">
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
              "radial-gradient(ellipse 65% 75% at 50% 35%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.82) 45%, rgba(255,255,255,0.25) 75%, transparent 100%)",
          }}
        />

        <div className="relative text-center max-w-3xl pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EBF0FA] text-[#1A4FBF] rounded-full text-sm font-medium mb-8 border border-[#A8BFEE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A4FBF] inline-block animate-pulse" />
            5 AI roles. 1 clinic. $200/month.
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1C1C1C] leading-tight tracking-tight mb-6">
            Your doctors spend 4 hours a day on paperwork.
            <br />
            <span className="text-[#1A4FBF]">Yeam gives it back.</span>
          </h1>

          <p className="text-xl text-[#4A5A7A] leading-relaxed mb-10">
            A full AI team (receptionist, scribe, coder, biller, nurse) running inside your clinic 24/7. No new hires. No overtime. Integrated with your EHR and ready in days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#contact"
              className="px-8 py-3.5 bg-[#1A4FBF] text-white font-semibold rounded-xl hover:bg-[#1540A0] transition-colors shadow-sm text-base"
            >
              See It Work: Book a Demo
            </a>
            <a
              href="https://yeamagentsystem.vercel.app/login?callbackUrl=%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-transparent text-[#1A4FBF] font-semibold rounded-xl hover:bg-[#EBF0FA] transition-colors border border-[#1A4FBF] text-base"
            >
              See the Platform
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "4 hrs",          label: "Returned per doctor, daily" },
              { value: "60%",            label: "Of denied claims, recovered" },
              { value: "$200/mo",        label: "Flat. All 5 AI roles included." },
              { value: "HIPAA + HL7",    label: "Certified & EHR-ready" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="bg-[#FFFFFF]/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-[#E0E6F5] text-center"
              >
                <div className="text-lg font-bold text-[#1A4FBF]">{badge.value}</div>
                <div className="text-xs text-[#5A6A8A] mt-0.5 leading-snug">{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
