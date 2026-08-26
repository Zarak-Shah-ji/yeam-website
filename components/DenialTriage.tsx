"use client";

import { useMemo, useRef, useState } from "react";
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
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : "Could not draft the response.");
    } finally {
      setDrafting(false);
    }
  }

  return (
    <section id="triage" className="py-20 px-4 sm:px-6 bg-[#EEF2FA]">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#1A4FBF] text-sm font-semibold uppercase tracking-wider mb-3">
          Free denial worklist
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
          Your denials, sorted by what you&apos;re about to lose.
        </h2>
        <p className="text-lg text-[#4A5A7A] max-w-2xl">
          Export denied claims from your billing system, drop the file here, and see which are
          worth working, what each one actually needs, and how many days are left.{" "}
          <span className="font-semibold text-[#1C1C1C]">
            Your file is read in this browser and never uploaded.
          </span>{" "}
          No account, no BAA.
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
            CSV or XLSX. In most systems this is the &ldquo;denied claims&rdquo; or
            &ldquo;denial detail&rdquo; report. Patient names, member IDs and dates of birth are
            never read — delete those columns first if you prefer.
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
                    {headers.filter(isIgnorableColumn).join(", ")}. These are never read and
                    never leave this browser.
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
                  Unlike the triage above, this sends the codes, amount and dates for this one row
                  to Yeam to write the response. No patient names, member IDs or dates of birth are
                  included.
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
                  <pre className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-[#E0E6F5] bg-[#F7F9FE] p-4 text-[12px] leading-relaxed text-[#1C1C1C] font-mono whitespace-pre-wrap break-words">
                    {draft.text}
                  </pre>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
