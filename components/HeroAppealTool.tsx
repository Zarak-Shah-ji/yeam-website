"use client";

import { useRef, useState } from "react";

/**
 * The live appeal drafter, sitting where the hero's product mock used to.
 *
 * The mock it replaces cycled five fake agent statuses on a timer — decoration
 * that proved nothing. This does the real work in the same space: pick a denial
 * document, watch it come back as the response that denial actually calls for.
 *
 * Sample-first on purpose. An EOB carries most of the 18 HIPAA identifiers and
 * this deployment has no BAA, so the default path is synthetic documents that
 * need no upload. Using your own is behind an explicit consent checkbox.
 *
 * Colours are limited to the class strings in the dark-theme block of
 * globals.css — dark is the default theme and anything outside that block
 * renders light-on-light for most visitors.
 */

type Status = "idle" | "loading" | "success" | "error";

const SAMPLES = [
  {
    id: "eob",
    file: "/samples/sample-eob-denial.pdf",
    name: "sample-eob-denial.pdf",
    type: "application/pdf",
    chip: "Payer EOB",
  },
  {
    id: "letter",
    file: "/samples/sample-denial-letter.pdf",
    name: "sample-denial-letter.pdf",
    type: "application/pdf",
    chip: "Denial letter",
  },
  {
    id: "sheet",
    file: "/samples/sample-denied-claims.xlsx",
    name: "sample-denied-claims.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    chip: "Claims export",
  },
] as const;

const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

/**
 * Name the instrument from the draft itself.
 *
 * The engine picks a corrected claim, a reprocessing request or an appeal based
 * on the denial code, and that choice is the most interesting thing it does —
 * worth surfacing rather than calling every output an "appeal letter".
 */
function instrumentOf(letter: string): string {
  // Only the distinctive openings are matched. A bare "reconsideration" is NOT
  // a signal — "we respectfully request reconsideration" is ordinary appeal
  // prose, and matching on it labelled a CO-50 appeal as a reconsideration.
  const head = letter.slice(0, 700).toLowerCase();
  if (head.includes("corrected claim")) return "Corrected claim";
  if (/request for reprocessing|reprocessing request/.test(head)) {
    return "Reprocessing request";
  }
  return "Appeal letter";
}

export default function HeroAppealTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [letter, setLetter] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [running, setRunning] = useState<string | null>(null);

  const [mode, setMode] = useState<"samples" | "upload">("samples");
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const tooLarge = totalBytes > MAX_TOTAL_BYTES;

  async function draft(payload: File[], sourceId: string) {
    setStatus("loading");
    setRunning(sourceId);
    setErrorMsg("");
    setLetter("");
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

  async function copyLetter() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked over plain http and in some embedded views.
    }
  }

  return (
    <div className="relative z-10 bg-white rounded-2xl border border-[#E0E6F5] shadow-xl shadow-[#1A4FBF]/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E6F5]">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-[#1A4FBF] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-white" />
          </span>
          <span className="text-sm font-bold text-[#1C1C1C]">Appeal drafter</span>
        </div>
        {status === "success" ? (
          <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            {instrumentOf(letter)}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
            Live
          </span>
        )}
      </div>

      {mode === "samples" ? (
        <>
          {/* Sample chips */}
          <div className="px-5 pt-4">
            <p className="text-xs text-[#5A6A8A] mb-2.5">
              Pick a denial document — Yeam reads it and writes the response.
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => runSample(s)}
                  disabled={status === "loading"}
                  className="px-3 py-1.5 bg-[#EBF0FA] border border-[#A8BFEE] rounded-lg text-xs font-medium text-[#1A4FBF] hover:bg-[#D0DAF5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {running === s.id ? "Reading…" : s.chip}
                </button>
              ))}
            </div>
          </div>

          {/* Result / idle */}
          <div className="px-5 py-4">
            {status === "success" ? (
              <pre className="h-[264px] overflow-y-auto rounded-xl bg-[#F7F9FE] border border-[#E0E6F5] p-4 text-[12px] leading-relaxed text-[#1C1C1C] font-mono whitespace-pre-wrap break-words">
                {letter}
              </pre>
            ) : (
              <div className="h-[264px] rounded-xl bg-[#F7F9FE] border border-[#E0E6F5] flex items-center justify-center px-6 text-center">
                {status === "loading" ? (
                  <p className="text-sm text-[#5A6A8A]">
                    Reading the document and drafting…
                    <span className="block text-xs mt-1 text-[#8A9BBF]">
                      usually 10–20 seconds
                    </span>
                  </p>
                ) : status === "error" ? (
                  <p className="text-sm text-red-600">{errorMsg}</p>
                ) : (
                  <p className="text-sm text-[#8A9BBF]">
                    The drafted response appears here.
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Upload */
        <div className="px-5 py-4">
          <p className="text-xs text-[#5A6A8A] mb-2.5">
            PDF, image, Word, Excel or CSV — up to 3 files, 4 MB.
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp,.heic,.csv,.xlsx,.xls,.docx,.txt,.md,.eml"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 3))}
            className="w-full px-3 py-2 rounded-lg border border-[#E0E6F5] text-xs text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] focus:border-transparent"
          />
          {tooLarge && (
            <p className="mt-2 text-xs text-red-600">
              That&apos;s over the 4 MB limit. Try a single document.
            </p>
          )}

          <label className="mt-3 flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 shrink-0 rounded border-[#E0E6F5] accent-[#1A4FBF]"
            />
            <span className="text-xs text-[#5A6A8A] leading-relaxed">
              This contains no real patient information. The demo isn&apos;t covered by a
              BAA, so please don&apos;t send PHI.
            </span>
          </label>

          <button
            type="button"
            onClick={() => draft(files, "upload")}
            disabled={status === "loading" || !consent || files.length === 0 || tooLarge}
            className="mt-3 w-full py-2.5 bg-[#1A4FBF] text-white text-sm font-semibold rounded-lg hover:bg-[#1540A0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {running === "upload" ? "Drafting…" : "Draft the response"}
          </button>

          {status === "success" && (
            <pre className="mt-3 h-[150px] overflow-y-auto rounded-xl bg-[#F7F9FE] border border-[#E0E6F5] p-3 text-[12px] leading-relaxed text-[#1C1C1C] font-mono whitespace-pre-wrap break-words">
              {letter}
            </pre>
          )}
          {status === "error" && <p className="mt-3 text-xs text-red-600">{errorMsg}</p>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[#E0E6F5] bg-[#F7F9FE]">
        <button
          type="button"
          onClick={() => {
            setMode(mode === "samples" ? "upload" : "samples");
            setStatus("idle");
            setLetter("");
            setErrorMsg("");
          }}
          className="text-xs font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
        >
          {mode === "samples" ? "Use your own denial →" : "← Back to samples"}
        </button>

        {status === "success" ? (
          <button
            type="button"
            onClick={copyLetter}
            className="text-[10px] font-semibold text-[#1A4FBF] bg-white border border-[#A8BFEE] px-2 py-0.5 rounded hover:bg-[#D0DAF5] transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : (
          <span className="text-[10px] text-[#8A9BBF]">Nothing you send is stored</span>
        )}
      </div>
    </div>
  );
}
