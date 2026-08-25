"use client";

import Link from "next/link";
import { useRef, useState } from "react";

/**
 * The live appeal-drafting tool.
 *
 * Sample-first by design. An EOB carries most of the 18 HIPAA identifiers and
 * neither this site nor the app behind it is covered by a BAA, so the default
 * path is three synthetic documents that need no upload at all. Using your own
 * document is a deliberate second step behind an explicit consent checkbox.
 *
 * Colours are constrained to the class strings enumerated in the dark-theme
 * block of globals.css. Dark is the default theme, and any hex not listed there
 * renders light-on-light for most visitors.
 */

type Status = "idle" | "loading" | "success" | "error";

const SAMPLES = [
  {
    id: "eob",
    file: "/samples/sample-eob-denial.pdf",
    name: "sample-eob-denial.pdf",
    type: "application/pdf",
    label: "Payer EOB",
    detail: "CO-50 — not medically necessary",
  },
  {
    id: "letter",
    file: "/samples/sample-denial-letter.pdf",
    name: "sample-denial-letter.pdf",
    type: "application/pdf",
    label: "Denial letter",
    detail: "CO-197 — no prior authorization",
  },
  {
    id: "sheet",
    file: "/samples/sample-denied-claims.xlsx",
    name: "sample-denied-claims.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    label: "Claims export",
    detail: "Four rows, mixed denial codes",
  },
] as const;

const STEPS = [
  {
    title: "Send the denial",
    body: "An EOB, an ERA, a denial letter or a claims export. PDF, photo, Excel or CSV.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-.41-8.98 4.5 4.5 0 0 1 8.4-2.51 5.25 5.25 0 0 1 10.09 2.24"
      />
    ),
  },
  {
    title: "Yeam reads it",
    body: "Pulls the claim, the payer, the amount and the CARC code straight off the document.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    ),
  },
  {
    title: "Get the right document",
    body: "A corrected claim, a reprocessing request or a full appeal — whichever that denial actually calls for.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    ),
  },
];

const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

export default function AppealDemo() {
  const [status, setStatus] = useState<Status>("idle");
  const [letter, setLetter] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [running, setRunning] = useState<string | null>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<Status>("idle");
  const [emailMsg, setEmailMsg] = useState("");

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const tooLarge = totalBytes > MAX_TOTAL_BYTES;

  async function draft(payload: File[], sourceId: string) {
    setStatus("loading");
    setRunning(sourceId);
    setErrorMsg("");
    setLetter("");
    setEmailState("idle");

    try {
      const body = new FormData();
      for (const f of payload) body.append("files", f);

      const res = await fetch("/api/appeal-demo", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setLetter(data.letter);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRunning(null);
    }
  }

  async function runSample(sample: (typeof SAMPLES)[number]) {
    if (status === "loading") return;
    try {
      const res = await fetch(sample.file);
      const blob = await res.blob();
      await draft([new File([blob], sample.name, { type: sample.type })], sample.id);
    } catch {
      setStatus("error");
      setErrorMsg("Could not load that sample. Please try again.");
      setRunning(null);
    }
  }

  function addFiles(picked: FileList | null) {
    if (!picked) return;
    setFiles(Array.from(picked).slice(0, 3));
  }

  async function copyLetter() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable over plain http and in some embedded views.
      // The download button below still works, so fail quietly.
    }
  }

  function downloadLetter() {
    const url = URL.createObjectURL(new Blob([letter], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "yeam-appeal-draft.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (emailState === "loading") return;
    setEmailState("loading");
    setEmailMsg("");
    try {
      const res = await fetch("/api/appeal-demo/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, letter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send that.");
      setEmailState("success");
      setEmailMsg(data.message ?? "Sent.");
    } catch (err: unknown) {
      setEmailState("error");
      setEmailMsg(err instanceof Error ? err.message : "Could not send that.");
    }
  }

  return (
    <section id="try-it" className="py-20 px-6 bg-[#EEF2FA]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <p className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
            Try It
          </p>
          <h2 className="text-4xl font-bold text-[#1C1C1C] mb-4">
            Give it a denial. Get the response.
          </h2>
          <p className="text-lg text-[#4A5A7A] max-w-2xl mx-auto">
            This is the live product, not a video. Pick a sample below and watch it read the
            document and write the response that denial actually calls for.
          </p>
        </div>

        {/* Three-step flow */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] border border-[#A8BFEE] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#1A4FBF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    {step.icon}
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8A9BBF] mb-0.5">Step {i + 1}</p>
                <h3 className="font-bold text-[#1C1C1C] mb-1">{step.title}</h3>
                <p className="text-sm text-[#4A5A7A] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* The tool */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E0E6F5] shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-[#1C1C1C] mb-1">Run a sample</h3>
            <p className="text-sm text-[#5A6A8A] mb-5">
              Three synthetic denial documents. No upload, no sign-up.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => runSample(sample)}
                  disabled={status === "loading"}
                  className="text-left p-4 rounded-xl border border-[#E0E6F5] bg-[#F7F9FE] hover:bg-[#F0F4FC] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="block text-sm font-semibold text-[#1C1C1C]">
                    {running === sample.id ? "Reading…" : sample.label}
                  </span>
                  <span className="block text-xs text-[#5A6A8A] mt-1">{sample.detail}</span>
                </button>
              ))}
            </div>

            {/* Own document */}
            <div className="mt-6 pt-6 border-t border-[#E0E6F5]">
              {!showUpload ? (
                <button
                  type="button"
                  onClick={() => setShowUpload(true)}
                  className="text-sm font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
                >
                  Or use your own document →
                </button>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                    Your denial document{" "}
                    <span className="text-[#5A6A8A] font-normal">
                      (PDF, image, Word, Excel or CSV — up to 3 files, 4 MB)
                    </span>
                  </label>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.heic,.csv,.xlsx,.xls,.docx,.txt,.md,.eml"
                    onChange={(e) => addFiles(e.target.files)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E0E6F5] text-sm text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] focus:border-transparent"
                  />

                  {files.length > 0 && (
                    <p className="mt-2 text-xs text-[#5A6A8A]">
                      {files.map((f) => f.name).join(", ")} —{" "}
                      {(totalBytes / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                  {tooLarge && (
                    <p className="mt-2 text-sm text-red-600">
                      That&apos;s over the 4 MB limit. Try a single document.
                    </p>
                  )}

                  <label className="mt-4 flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 shrink-0 rounded border-[#E0E6F5] accent-[#1A4FBF]"
                    />
                    <span className="text-sm text-[#4A5A7A] leading-relaxed">
                      This document contains no real patient information. This demo is not
                      covered by a BAA, so please don&apos;t send us PHI.
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => draft(files, "upload")}
                    disabled={
                      status === "loading" || !consent || files.length === 0 || tooLarge
                    }
                    className="mt-4 px-7 py-3 bg-[#1A4FBF] text-white font-semibold rounded-xl hover:bg-[#1540A0] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {running === "upload" ? "Drafting…" : "Draft the response"}
                  </button>
                </div>
              )}
            </div>

            {status === "loading" && (
              <p className="mt-5 text-sm text-[#5A6A8A]">
                Reading the document and drafting — this usually takes 10–20 seconds.
              </p>
            )}
            {status === "error" && <p className="mt-5 text-sm text-red-600">{errorMsg}</p>}
          </div>

          {/* Result */}
          {status === "success" && letter && (
            <div className="border-t border-[#E0E6F5] bg-[#F7F9FE] p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-[#1C1C1C]">What Yeam sent back</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyLetter}
                    className="px-3 py-1.5 text-xs font-medium text-[#1A4FBF] bg-[#EBF0FA] border border-[#A8BFEE] rounded-lg hover:bg-[#D0DAF5] transition-colors"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={downloadLetter}
                    className="px-3 py-1.5 text-xs font-medium text-[#1A4FBF] bg-[#EBF0FA] border border-[#A8BFEE] rounded-lg hover:bg-[#D0DAF5] transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>

              <pre className="bg-white rounded-xl p-4 border border-[#E0E6F5] text-[13px] leading-relaxed text-[#1C1C1C] font-mono whitespace-pre-wrap break-words max-h-[420px] overflow-y-auto">
                {letter}
              </pre>

              <p className="mt-3 text-xs text-[#6A7A9A]">
                Drafted just now, from that document alone. Nothing you send is stored — the
                file is read in memory and the draft is not retained.
              </p>

              {emailState === "success" ? (
                <p className="mt-5 text-sm text-green-600">{emailMsg}</p>
              ) : (
                <form onSubmit={sendEmail} className="mt-5 flex flex-wrap items-start gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@clinic.com"
                    className="flex-1 min-w-[220px] px-3 py-2.5 rounded-lg border border-[#E0E6F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={emailState === "loading"}
                    className="px-5 py-2.5 bg-[#1A4FBF] text-white text-sm font-semibold rounded-lg hover:bg-[#1540A0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {emailState === "loading" ? "Sending…" : "Email me a copy"}
                  </button>
                  {emailState === "error" && (
                    <p className="w-full text-sm text-red-600">{emailMsg}</p>
                  )}
                </form>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[#5A6A8A]">
          Want to see how this connects to your systems?{" "}
          <Link
            href="/architecture"
            className="font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
          >
            See the architecture →
          </Link>
        </p>
      </div>
    </section>
  );
}
