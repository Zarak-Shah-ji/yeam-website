"use client";

import { useState } from "react";

/**
 * The next step after the worklist.
 *
 * This was a full-bleed blue band selling an "AI Medical Workforce" that
 * handles "reception, documentation, coding, and billing" — a product this
 * site stopped describing several commits ago. It now picks up where the free
 * worklist left off and asks for the three things worth asking for. Clinic name
 * and a free-text message were dropped: neither changed what happened next.
 */
export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    claimVolume: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  return (
    <section id="contact" className="py-20 px-6 bg-[#EEF2FA]">
      <div className="max-w-2xl mx-auto">
        <p className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
          Next step
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
          You&apos;ve seen the worklist. The paid version keeps it running.
        </h2>
        <p className="text-lg text-[#4A5A7A] mb-8">
          Real claim data, deadlines tracked, responses drafted — under a signed BAA.
        </p>

        <div className="rounded-2xl border border-[#E0E6F5] bg-white shadow-sm p-6 sm:p-8">
          {status === "success" ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 bg-[#EBF0FA] rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#1A4FBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">We&apos;ll be in touch.</h3>
              <p className="text-sm text-[#5A6A8A]">
                Someone from the Yeam team will follow up within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E0E6F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                  Work email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@riversidebilling.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E0E6F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="claimVolume" className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                  Monthly claim volume
                </label>
                {/* These options mirror VOLUME_PRESETS in lib/pricing.ts — the
                    pricing calculator offers the same three buckets. */}
                <select
                  id="claimVolume"
                  name="claimVolume"
                  value={form.claimVolume}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E0E6F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] focus:border-transparent text-[#3A3A3A] bg-white"
                >
                  <option value="">Select range...</option>
                  <option value="0-1,000">0 – 1,000 claims/month</option>
                  <option value="1,000-5,000">1,000 – 5,000 claims/month</option>
                  <option value="5,000+">5,000+ claims/month</option>
                </select>
              </div>

              {status === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 bg-[#1A4FBF] text-white font-semibold rounded-lg hover:bg-[#1540A0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending..." : "Request a demo"}
              </button>

              <p className="text-xs text-[#5A6A8A] text-center">
                Or just email{" "}
                <a href="mailto:info@yeam.ai" className="font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors">
                  info@yeam.ai
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
