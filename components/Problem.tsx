export default function Problem() {
  return (
    <section className="py-20 px-6 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
            The Problem
          </p>
          <h2 className="text-4xl font-bold text-white">
            Your EHR Generates Data.
            <br />
            Your Revenue Disappears Anyway.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              stat: "5–8%",
              title: "Average denial rate",
              body:
                "The average small clinic denies 5–8% of claims — and most never know why. That's thousands of dollars walking out the door every month.",
            },
            {
              stat: "40%",
              title: "Of billing time is rework",
              body:
                "Billing staff spend nearly half their day chasing down denied claims, correcting errors, and resubmitting — instead of growing the practice.",
            },
            {
              stat: "60%",
              title: "Of denied claims go unappealed",
              body:
                "Most denied claims are never appealed — not because they can't be won, but because drafting appeals takes too long. Clinics just write it off.",
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
          Most EHRs show you what happened. Yeam tells you what to do about it —{" "}
          <span className="text-white font-medium">automatically.</span>
        </p>
      </div>
    </section>
  );
}
