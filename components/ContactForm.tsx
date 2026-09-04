"use client";

import { useState } from "react";

/**
 * Getting started, and the way out for people who need a conversation.
 *
 * This was a five-field demo form on a blue band, then a three-field one. Both
 * put a form between a visitor and a product they can already use for free.
 * The worklist above is the lead magnet, so the primary action is to go use it;
 * anyone who needs a contract, a BAA or a pilot takes the second door, and the
 * direct email address stays visible for people who would rather not fill in
 * anything at all.
 */
export default function ContactForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", claimVolume: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
    <section id="contact" className="py-24 md:py-32 px-6 bg-[#EEF2FA]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-light text-[#1C1C1C] tracking-tight">
          Start with your own denials.
        </h2>
        <p className="mt-4 text-lg text-[#4A5A7A]">
          The worklist is free, needs no account, and runs in your browser. Paid plans add
          real claim data, tracked deadlines and drafted responses under a signed BAA.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://app.yeam.ai"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1A4FBF] text-white font-semibold rounded-xl hover:bg-[#1540A0] transition-colors shadow-sm text-base text-center"
          >
            Get started
          </a>
          {!open && status !== "success" && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 text-[#1A4FBF] font-semibold rounded-xl hover:bg-[#E0E6F5] transition-colors text-base"
            >
              Talk to sales →
            </button>
          )}
        </div>

        <p className="mt-5 text-sm text-[#5A6A8A]">
          Or email{" "}
          <a
            href="mailto:info@yeam.ai"
            className="font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
          >
            info@yeam.ai
          </a>{" "}
          directly.
        </p>

        {status === "success" ? (
          <div className="mt-9 rounded-2xl border border-[#E0E6F5] bg-white shadow-sm p-8 text-left">
            <div className="w-12 h-12 bg-[#EBF0FA] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1A4FBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1C1C1C] mb-1">We&apos;ll be in touch.</h3>
            <p className="text-sm text-[#5A6A8A]">
              Someone from the Yeam team will follow up within one business day.
            </p>
          </div>
        ) : (
          open && (
            <form
              onSubmit={handleSubmit}
              className="mt-9 rounded-2xl border border-[#E0E6F5] bg-white shadow-sm p-6 sm:p-8 space-y-4 text-left"
            >
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
                {status === "loading" ? "Sending..." : "Request a walkthrough"}
              </button>
            </form>
          )
        )}
      </div>
    </section>
  );
}
