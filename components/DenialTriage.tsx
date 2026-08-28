"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  readClaimsFile,
  detectMapping,
  buildRows,
  missingRequired,
  isIgnorableColumn,
  FIELD_LABEL,
  type FieldId,
  type Mapping,
} from "@/lib/parseClaims";
import {
  triage,
  EXPIRING_SOON_DAYS,
  type Remedy,
  type TriagedRow,
  type Worklist,
} from "@/lib/triage";

/**
 * The free denial worklist.
 *
 * Everything here runs in the visitor's browser: the file is read with the
 * FileReader API, triaged against the rule set in lib/triage, and rendered. No
 * request is made, which is why the page can promise that a claims export never
 * leaves the machine — a promise worth more than a login, because a billing
 * manager can verify it in the network tab.
 *
 * The one exception is deliberate and per-row: drafting a response calls the
 * existing /api/appeal-demo proxy, and says so at the point of the click.
 *
 * Colour classes are restricted to the ones the dark-theme block in globals.css
 * actually overrides. Amber in particular has no entry there and would render
 * unreadably in dark mode, so urgency is carried by the red tints instead.
 */

const REMEDY_CHIP: Record<Remedy, string> = {
  corrected_claim: "bg-[#F5F0FA] text-[#6B4A8A] border-[#D4C0E8]",
  reprocess: "bg-[#F0F7E8] text-[#5C8A3A] border-[#C8DDB4]",
  appeal: "bg-[#EBF0FA] text-[#1A4FBF] border-[#A8BFEE]",
  not_recoverable: "bg-slate-50 text-slate-500 border-slate-200",
  unknown: "bg-red-50 text-red-600 border-red-200",
};

type ChatTurn = { role: "user" | "assistant"; text: string };

/** Openers, so the first message costs a click rather than a blank page. */
const SUGGESTED_EDITS = [
  "Make it shorter",
  "Cite the payer's policy",
  "Add the medical-necessity argument",
  "More formal tone",
];

const MAPPABLE: FieldId[] = [
  "carc",
  "billed",
  "denialDate",
  "payer",
  "claimNumber",
  "cpt",
  "icd10",
  "reason",
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Stage = "idle" | "mapping" | "results";

function Tile({
  value,
  label,
  tone = "plain",
}: {
  value: string;
  label: string;
  tone?: "plain" | "primary" | "urgent" | "muted";
}) {
  const tones = {
    plain: "bg-white border-[#E0E6F5] text-[#1C1C1C]",
    primary: "bg-[#EBF0FA] border-[#A8BFEE] text-[#1A4FBF]",
    urgent: "bg-red-50 border-red-200 text-red-600",
    muted: "bg-slate-50 border-slate-200 text-slate-500",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${tones[tone]}`}>
      <div className="text-xl font-bold leading-tight">{value}</div>
      <div className="mt-0.5 text-xs leading-snug text-[#5A6A8A]">{label}</div>
    </div>
  );
}

function DaysCell({ row }: { row: TriagedRow }) {
  if (row.daysLeft === null) {
    return <span className="text-slate-400">No date</span>;
  }
  if (row.expired) {
    return <span className="text-slate-500">Window closed</span>;
  }
  const urgent = row.daysLeft <= EXPIRING_SOON_DAYS;
  return (
    <span className={urgent ? "font-semibold text-red-600" : "text-[#1C1C1C]"}>
      {row.daysLeft} {row.daysLeft === 1 ? "day" : "days"}
    </span>
  );
}

/** Length of the preview shown before the reader expands the full letter. */
const PREVIEW_CHARS = 420;

/** Cut at the last full line so the preview never ends mid-word. */
function preview(letter: string): string {
  if (letter.length <= PREVIEW_CHARS) return letter;
  const slice = letter.slice(0, PREVIEW_CHARS);
  const lastBreak = slice.lastIndexOf("\n");
  return `${(lastBreak > PREVIEW_CHARS * 0.5 ? slice.slice(0, lastBreak) : slice).trimEnd()}…`;
}

/**
 * A drafted response, presented the way the reviewer portal at /appeals
 * presents one: the claim it belongs to and the codes above it, the letter
 * collapsed to a preview until asked for, and copy/download beneath. A raw
 * <pre> in a scroll box gave none of that context, and the letter is the thing
 * a biller is about to file — it should read like a document, not like output.
 */
function DraftedLetter({
  row,
  letter,
  expanded,
  onToggle,
}: {
  row: TriagedRow;
  letter: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const fields: [string, string][] = (
    [
      ["Payer", row.payer],
      ["Denial code", `${row.carc} · ${row.carcLabel}`],
      ["Procedure", row.cpt],
      ["Diagnosis", row.icd10],
      ["Amount in dispute", money.format(row.billed)],
      [
        "Filing deadline",
        row.daysLeft !== null && row.daysLeft > 0
          ? `${row.daysLeft} days left · ${row.windowDays}-day window${
              row.windowSource === "payer" ? " (this payer)" : " (default)"
            }`
          : null,
      ],
    ] as [string, string | null | undefined][]
  ).filter((f): f is [string, string] => !!f[1]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked over plain http and in some embedded views. The
      // letter is selectable on the page, so this degrades quietly.
    }
  }

  function download() {
    const name = `${row.remedyLabel.toLowerCase().replace(/\s+/g, "-")}-${(
      row.claimNumber ?? "draft"
    ).replace(/[^a-z0-9-]/gi, "")}.txt`;
    const url = URL.createObjectURL(
      new Blob([letter], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <article className="mt-4 overflow-hidden rounded-xl border border-[#E0E6F5] bg-white">
      <div className="border-b border-[#E0E6F5] px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-semibold text-[#1C1C1C]">
            {row.claimNumber ?? row.remedyLabel}
          </h4>
          <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
            {row.carc}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${REMEDY_CHIP[row.remedy]}`}
          >
            {row.remedyLabel}
          </span>
        </div>

        {fields.length > 0 && (
          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-wide text-[#8A9BBF]">
                  {label}
                </dt>
                <dd className="text-[#1C1C1C]">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="px-5 py-4">
        <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-[#1C1C1C]">
          {expanded ? letter : preview(letter)}
        </pre>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="text-sm font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
          >
            {expanded ? "Show less" : `Read full ${row.remedyLabel.toLowerCase()}`}
          </button>
          <span className="text-[#E0E6F5]">·</span>
          <button
            type="button"
            onClick={() => void copy()}
            className="rounded-lg border border-[#A8BFEE] px-3 py-1.5 text-xs font-semibold text-[#1A4FBF] transition-colors hover:bg-[#EBF0FA]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={download}
            className="rounded-lg border border-[#A8BFEE] px-3 py-1.5 text-xs font-semibold text-[#1A4FBF] transition-colors hover:bg-[#EBF0FA]"
          >
            Download .txt
          </button>
        </div>
      </div>
    </article>
  );
}

export default function DenialTriage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Mapping>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  const [openRow, setOpenRow] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ row: number; text: string } | null>(null);
  const [draftError, setDraftError] = useState("");
  const [drafting, setDrafting] = useState(false);

  // The revision thread. Cleared whenever a new draft lands, because a
  // conversation about the previous letter means nothing against this one.
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [revising, setRevising] = useState(false);
  const [chatError, setChatError] = useState("");
  const [letterOpen, setLetterOpen] = useState(true);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = threadRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [chat, revising]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [today] = useState(() => new Date());

  const missing = missingRequired(mapping);

  const worklist: Worklist | null = useMemo(() => {
    if (stage !== "results" || missing.length > 0) return null;
    const { rows } = buildRows(dataRows, mapping);
    return triage(rows, today);
  }, [stage, dataRows, mapping, missing.length, today]);

  const skipped = useMemo(() => {
    if (stage !== "results" || missing.length > 0) return 0;
    return buildRows(dataRows, mapping).skipped;
  }, [stage, dataRows, mapping, missing.length]);

  function reset() {
    setStage("idle");
    setFileName("");
    setHeaders([]);
    setDataRows([]);
    setMapping({});
    setError("");
    setOpenRow(null);
    setDraft(null);
    setDraftError("");
    setShowColumns(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function ingest(file: File) {
    setBusy(true);
    setError("");
    setOpenRow(null);
    setDraft(null);
    try {
      const { headers: h, dataRows: d } = await readClaimsFile(file);
      const detected = detectMapping(h);
      setFileName(file.name);
      setHeaders(h);
      setDataRows(d);
      setMapping(detected);
      // Only stop for the mapping step when detection actually came up short —
      // a clean export should go straight to the answer.
      const stillMissing = missingRequired(detected);
      setStage(stillMissing.length > 0 ? "mapping" : "results");
      setShowColumns(stillMissing.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that file.");
      setStage("idle");
    } finally {
      setBusy(false);
    }
  }

  async function useSample() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/samples/sample-denied-claims.xlsx");
      const blob = await res.blob();
      await ingest(
        new File([blob], "sample-denied-claims.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
    } catch {
      setError("Could not load the sample file. Please try again.");
      setBusy(false);
    }
  }

  /**
   * Draft one response. This is the only call that leaves the browser, it
   * carries codes and amounts rather than patient details, and the button says
   * so before it is pressed.
   */
  async function draftFor(index: number, row: TriagedRow) {
    setDrafting(true);
    setDraftError("");
    setDraft(null);
    try {
      const notes = [
        `Denial requiring a ${row.remedyLabel.toLowerCase()}.`,
        row.payer ? `Payer: ${row.payer}` : null,
        `Reason code: ${row.carc} — ${row.carcLabel}`,
        row.cpt ? `Procedure (CPT): ${row.cpt}` : null,
        row.icd10 ? `Diagnosis (ICD-10): ${row.icd10}` : null,
        `Billed amount: ${money.format(row.billed)}`,
        row.claimNumber ? `Claim reference: ${row.claimNumber}` : null,
        row.daysLeft !== null ? `Days remaining to file: ${row.daysLeft}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const body = new FormData();
      body.append("notes", notes);
      const res = await fetch("/api/appeal-demo", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not draft the response.");
      setDraft({ row: index, text: data.letter });
      setChat([]);
      setChatError("");
      setLetterOpen(true);
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : "Could not draft the response.");
    } finally {
      setDrafting(false);
    }
  }

  /**
   * Revise the current draft from an instruction, keeping the thread as
   * context. The letter is replaced wholesale rather than patched — the
   * upstream returns the next full version, and a half-applied edit in a
   * document someone is about to file would be worse than none.
   */
  async function revise(instruction: string) {
    const text = instruction.trim();
    if (!text || !draft || revising) return;

    const history = chat;
    setChat([...history, { role: "user", text }]);
    setChatInput("");
    setChatError("");
    setRevising(true);

    try {
      const res = await fetch("/api/appeal-demo/revise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter: draft.text, instruction: text, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not revise the response.");

      setDraft({ row: draft.row, text: data.letter });
      setChat((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "Updated the draft above." },
      ]);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Could not revise the response.");
    } finally {
      setRevising(false);
    }
  }

  return (
    <section id="triage" className="py-20 px-4 sm:px-6 bg-[#EEF2FA]">
      <div className="max-w-6xl mx-auto">
        {/* The privacy fact used to sit mid-paragraph, which is no place for the
            single objection this section exists to answer. It gets its own chip. */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <p className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider">
            Free denial worklist
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A8BFEE] bg-[#EBF0FA] px-2.5 py-1 text-xs font-semibold text-[#1A4FBF]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Runs in your browser · zero data retention
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
          Your <span className="text-[#1A4FBF]">denials</span>, sorted by what you&apos;re
          about to lose.
        </h2>
        <p className="text-lg text-[#4A5A7A] max-w-2xl">
          Drop in your denied-claims export and see which are worth working, what each one
          needs, and how many days are left.
        </p>

        {/* Input */}
        <div className="mt-8 rounded-2xl border border-[#E0E6F5] bg-white shadow-sm px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={useSample}
              disabled={busy}
              className="px-5 py-2.5 bg-[#1A4FBF] text-white text-sm font-semibold rounded-lg hover:bg-[#1540A0] transition-colors disabled:opacity-60"
            >
              {busy ? "Reading…" : "Run the sample export"}
            </button>

            <span className="text-xs text-[#8A9BBF] sm:px-1">or</span>

            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void ingest(f);
              }}
              className="text-xs text-[#4A5A7A] file:mr-3 file:rounded-lg file:border file:border-[#A8BFEE] file:bg-[#EBF0FA] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#1A4FBF] hover:file:bg-[#D0DAF5]"
            />

            {stage !== "idle" && (
              <button
                type="button"
                onClick={reset}
                className="text-xs font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors sm:ml-auto"
              >
                Start over
              </button>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#5A6A8A]">
            CSV or XLSX — usually your &ldquo;denied claims&rdquo; report. Patient names, member
            IDs and dates of birth are never read.
          </p>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        {/* Column mapping */}
        {stage !== "idle" && (
          <div className="mt-4 rounded-2xl border border-[#E0E6F5] bg-white shadow-sm px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#1C1C1C]">
                {fileName}{" "}
                <span className="font-normal text-[#5A6A8A]">
                  · {dataRows.length} rows · {headers.length} columns
                </span>
              </p>
              <button
                type="button"
                onClick={() => setShowColumns((v) => !v)}
                className="text-xs font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
              >
                {showColumns ? "Hide columns" : "Review columns"}
              </button>
            </div>

            {missing.length > 0 && (
              <p className="mt-2 text-sm text-red-600">
                Point these at the right columns to continue:{" "}
                {missing.map((f) => FIELD_LABEL[f]).join(", ")}.
              </p>
            )}

            {showColumns && (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {MAPPABLE.map((field) => (
                    <label key={field} className="block">
                      <span className="block text-xs font-medium text-[#5A6A8A] mb-1">
                        {FIELD_LABEL[field]}
                        {(field === "carc" || field === "billed") && (
                          <span className="text-red-600"> *</span>
                        )}
                      </span>
                      <select
                        value={mapping[field] ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setMapping((m) => ({
                            ...m,
                            [field]: v === "" ? undefined : Number(v),
                          }));
                          setOpenRow(null);
                          setDraft(null);
                        }}
                        className="w-full rounded-lg border border-[#E0E6F5] bg-white px-2 py-1.5 text-xs text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#1A4FBF]"
                      >
                        <option value="">— not in this file —</option>
                        {headers.map((h, i) => (
                          <option key={`${h}-${i}`} value={i}>
                            {h || `Column ${i + 1}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>

                {headers.some(isIgnorableColumn) && (
                  <p className="mt-4 text-xs leading-relaxed text-[#5A6A8A]">
                    <span className="font-semibold text-[#1C1C1C]">Ignored entirely:</span>{" "}
                    {headers.filter(isIgnorableColumn).join(", ")}.
                  </p>
                )}

                {missing.length === 0 && stage === "mapping" && (
                  <button
                    type="button"
                    onClick={() => setStage("results")}
                    className="mt-4 px-5 py-2.5 bg-[#1A4FBF] text-white text-sm font-semibold rounded-lg hover:bg-[#1540A0] transition-colors"
                  >
                    Build the worklist
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Worklist */}
        {worklist && (
          <>
            <div className="mt-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Tile
                value={money.format(worklist.atStake)}
                label={`Recoverable across ${worklist.actionable} denials`}
                tone="primary"
              />
              <Tile
                value={String(worklist.expiringSoon)}
                label={`Expiring within ${EXPIRING_SOON_DAYS} days — ${money.format(
                  worklist.expiringSoonBilled,
                )}`}
                tone={worklist.expiringSoon > 0 ? "urgent" : "plain"}
              />
              <Tile
                value={String(worklist.byRemedy.corrected_claim.count)}
                label="Need a corrected claim, not an appeal"
              />
              <Tile
                value={String(worklist.notRecoverable + worklist.expired)}
                label="Not worth working — closed or patient responsibility"
                tone="muted"
              />
            </div>

            {(worklist.unknown > 0 || skipped > 0 || worklist.rows.some((r) => r.daysLeft === null)) && (
              <p className="mt-3 text-xs leading-relaxed text-[#5A6A8A]">
                {worklist.unknown > 0 && (
                  <>
                    {worklist.unknown} row{worklist.unknown === 1 ? "" : "s"} carry a reason code
                    outside the public rule set and need a human.{" "}
                  </>
                )}
                {skipped > 0 && (
                  <>
                    {skipped} row{skipped === 1 ? "" : "s"} had no reason code and were left out.{" "}
                  </>
                )}
                {worklist.rows.some((r) => r.windowSource === "default") && (
                  <>
                    Rows without a recognised payer use a conservative{" "}
                    {worklist.rows.find((r) => r.windowSource === "default")?.windowDays}-day
                    filing window — confirm against your payer contract.
                  </>
                )}
              </p>
            )}

            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E0E6F5] bg-white shadow-sm">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E0E6F5]">
                    {["Days left", "Claim", "Denial", "What it needs", "Billed", ""].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A9BBF]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {worklist.rows.map((row, i) => (
                    <tr
                      key={`${row.claimNumber ?? "row"}-${i}`}
                      className="border-b border-[#E0E6F5] last:border-0 align-top"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <DaysCell row={row} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1C1C1C]">
                          {row.claimNumber ?? "—"}
                        </div>
                        <div className="text-xs text-[#8A9BBF]">
                          {[row.cpt, row.icd10].filter(Boolean).join(" · ") || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs font-semibold text-[#1C1C1C]">
                          {row.carc}
                        </div>
                        <div className="text-xs text-[#5A6A8A]">{row.carcLabel}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            REMEDY_CHIP[row.remedy]
                          }`}
                        >
                          {row.remedyLabel}
                        </span>
                        {openRow === i && (
                          <p className="mt-2 max-w-md text-xs leading-relaxed text-[#5A6A8A]">
                            {row.note}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-[#1C1C1C]">
                        {money.format(row.billed)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenRow(openRow === i ? null : i);
                            setDraft(null);
                            setDraftError("");
                          }}
                          className="text-xs font-medium text-[#1A4FBF] hover:text-[#1540A0] transition-colors"
                        >
                          {openRow === i ? "Close" : "What to do"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Per-row drafting: the one thing that leaves the browser. */}
            {openRow !== null && worklist.rows[openRow]?.actionable && (
              <div className="mt-4 rounded-2xl border border-[#E0E6F5] bg-white shadow-sm px-5 py-4 sm:px-6">
                <p className="text-sm font-semibold text-[#1C1C1C]">
                  Draft the {worklist.rows[openRow].remedyLabel.toLowerCase()} for{" "}
                  {worklist.rows[openRow].claimNumber ?? "this claim"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#5A6A8A]">
                  This one sends the codes, amount and dates for this row to Yeam — no patient
                  names, member IDs or dates of birth.
                </p>

                <button
                  type="button"
                  onClick={() => void draftFor(openRow, worklist.rows[openRow])}
                  disabled={drafting}
                  className="mt-3 px-5 py-2.5 bg-[#1A4FBF] text-white text-sm font-semibold rounded-lg hover:bg-[#1540A0] transition-colors disabled:opacity-60"
                >
                  {drafting ? "Drafting…" : "Draft this response"}
                </button>

                {draftError && <p className="mt-3 text-sm text-red-600">{draftError}</p>}

                {draft?.row === openRow && (
                  <>
                    <DraftedLetter
                      row={worklist.rows[openRow]}
                      letter={draft.text}
                      expanded={letterOpen}
                      onToggle={() => setLetterOpen((v) => !v)}
                    />

                    {/* Revision chat. A first draft is rarely the one that goes
                        out — this is where a biller says what the payer wants
                        and watches the letter above change. */}
                    <div className="mt-4 rounded-xl border border-[#E0E6F5] bg-white overflow-hidden">
                      <p className="px-4 py-2.5 border-b border-[#E0E6F5] text-xs font-semibold text-[#1C1C1C]">
                        Not quite right? Tell it what to change.
                      </p>

                      {(chat.length > 0 || revising) && (
                        <div
                          ref={threadRef}
                          className="max-h-56 overflow-y-auto px-4 py-3 space-y-2.5"
                        >
                          {chat.map((turn, i) => (
                            <div
                              key={i}
                              className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <p
                                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                  turn.role === "user"
                                    ? "bg-[#1A4FBF] text-white"
                                    : "bg-[#EEF2FA] text-[#1C1C1C]"
                                }`}
                              >
                                {turn.text}
                              </p>
                            </div>
                          ))}
                          {revising && (
                            <p className="text-xs text-[#8A9BBF]">Revising the draft…</p>
                          )}
                        </div>
                      )}

                      {chat.length === 0 && !revising && (
                        <div className="px-4 pt-3 flex flex-wrap gap-2">
                          {SUGGESTED_EDITS.map((hint) => (
                            <button
                              key={hint}
                              type="button"
                              onClick={() => void revise(hint)}
                              className="rounded-lg border border-[#A8BFEE] bg-[#EBF0FA] px-2.5 py-1 text-[11px] font-medium text-[#1A4FBF] transition-colors hover:bg-[#D0DAF5]"
                            >
                              {hint}
                            </button>
                          ))}
                        </div>
                      )}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          void revise(chatInput);
                        }}
                        className="flex items-center gap-2 px-4 py-3"
                      >
                        <label htmlFor="revise" className="sr-only">
                          What should change in this draft?
                        </label>
                        <input
                          id="revise"
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={revising}
                          placeholder="Cite the payer's own policy…"
                          className="flex-1 min-w-0 rounded-lg border border-[#E0E6F5] px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] focus:border-transparent disabled:opacity-60"
                        />
                        <button
                          type="submit"
                          disabled={revising || !chatInput.trim()}
                          className="shrink-0 rounded-lg bg-[#1A4FBF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1540A0] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Send
                        </button>
                      </form>

                      {chatError && (
                        <p className="px-4 pb-3 text-xs text-red-600">{chatError}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
