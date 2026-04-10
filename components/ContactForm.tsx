"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    clinicName: "",
    email: "",
    claimVolume: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <section id="contact" className="py-20 px-6 bg-blue-600">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">We&apos;ll be in touch soon.</h2>
          <p className="text-blue-100 text-lg">
            Thanks for reaching out. Someone from the Yeam team will follow up within one
            business day.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 px-6 bg-blue-600">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: copy */}
          <div className="text-white">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-4">
              Book a Demo
            </p>
            <h2 className="text-4xl font-bold mb-5 leading-tight">
              See Yeam Working in Your Clinic&apos;s Data.
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              We&apos;ll walk you through a live demo using real clinic data — so you can see
              exactly how Yeam surfaces denial patterns, drafts appeals, and shows you where your
              revenue is going.
            </p>
            <ul className="space-y-3">
              {[
                "30-minute live walkthrough",
                "Personalized to your clinic size & payer mix",
                "No commitment required",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-blue-100">
                  <svg className="w-5 h-5 text-blue-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Request a Demo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Jane Smith"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Clinic Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="clinicName"
                    value={form.clinicName}
                    onChange={handleChange}
                    required
                    placeholder="Riverside Family Clinic"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Clinic Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@rivesideclinic.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Monthly Claim Volume
                </label>
                <select
                  name="claimVolume"
                  value={form.claimVolume}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white"
                >
                  <option value="">Select range...</option>
                  <option value="0-1,000">0 – 1,000 claims/month</option>
                  <option value="1,000-5,000">1,000 – 5,000 claims/month</option>
                  <option value="5,000+">5,000+ claims/month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your current billing challenges..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-red-600 text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending..." : "Request Demo"}
              </button>

              <p className="text-xs text-slate-400 text-center">
                We&apos;ll follow up within one business day at the email provided.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
