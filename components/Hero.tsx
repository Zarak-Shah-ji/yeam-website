export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
          AI-Embedded EHR for Small & Mid-Size Clinics
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          Stop Losing Revenue
          <br />
          <span className="text-blue-600">to Denied Claims.</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Yeam is the only EHR that embeds AI across your entire revenue cycle —
          from the first patient visit to the final claim appeal. Full visibility.
          Fewer denials. More money in your pocket.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-base"
          >
            Book a Demo
          </a>
          <a
            href="#features"
            className="px-8 py-3.5 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 text-base"
          >
            See the Platform
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "34K+", label: "Claims tracked monthly" },
            { value: "8%", label: "Avg denial rate identified" },
            { value: "$14M+", label: "AR balance under management" },
            { value: "24/7", label: "AI agents working for you" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center"
            >
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
