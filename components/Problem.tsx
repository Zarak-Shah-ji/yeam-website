export default function Problem() {
  return (
    <section className="py-20 px-6 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
            The Problem
          </p>
          <h2 className="text-4xl font-bold text-white">
            Your Clinic Is Drowning
            <br />
            in Work That AI Can Handle.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              stat: "$800B",
              title: "Spent on medical staff annually",
              body:
                "Clinics spend hundreds of thousands each year on receptionists, scribes, coders, and billing staff. Most of that time goes to repetitive tasks AI can handle instantly.",
            },
            {
              stat: "3–4 hrs",
              title: "Documentation per provider daily",
              body:
                "Physicians spend up to 40% of their working day on paperwork, notes, and administrative tasks, leaving less time for actual patient care and accelerating burnout.",
            },
            {
              stat: "35%",
              title: "Average medical staff turnover",
              body:
                "High turnover in front desk and billing roles creates constant retraining costs and revenue gaps. AI medical employees never quit, never call in sick, and never need onboarding.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-800 rounded-2xl p-7 border border-slate-700"
            >
              <div className="text-4xl font-bold text-blue-400 mb-3">{item.stat}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 mt-10 text-base">
          Most clinics hire more staff to solve these problems. Yeam lets you{" "}
          <span className="text-white font-medium">deploy AI employees instead.</span>
        </p>
      </div>
    </section>
  );
}
