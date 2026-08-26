/**
 * Reading a denied-claims export in the browser.
 *
 * Every billing system — Athena, eCW, Kareo, AdvancedMD — will export "denials,
 * last 90 days" to CSV or XLSX. That export is the only integration Yeam needs
 * to say something true about a practice's own denials: no API, no IT ticket, no
 * BAA. This module turns whichever shape it arrives in into `ClaimRow[]`.
 *
 * XLSX is unzipped with `DecompressionStream("deflate-raw")` rather than a
 * spreadsheet library. That is a deliberate call: this code path parses
 * untrusted files uploaded by strangers on a healthcare site, and the smallest
 * available supply chain is no supply chain. It reads cell values and shared
 * strings, which is all triage needs — it is not a general XLSX implementation.
 *
 * Nothing here touches the network. That is load-bearing, not incidental: the
 * promise on the page is that the visitor's file never leaves their machine.
 */

import type { ClaimRow } from "./triage";

/* ------------------------------------------------------------------ CSV --- */

/** RFC 4180: quoted fields may contain commas, newlines and doubled quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let i = 0;

  // A BOM survives most Excel exports and would otherwise poison the first header.
  if (text.charCodeAt(0) === 0xfeff) i = 1;

  while (i < text.length) {
    const ch = text[i];

    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      quoted = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (ch === "\r") {
      i += 1;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/* ----------------------------------------------------------------- XLSX --- */

const ZIP_EOCD = 0x06054b50;
const ZIP_CENTRAL = 0x02014b50;

type ZipEntry = { name: string; offset: number; compressedSize: number; method: number };

function readZipDirectory(view: DataView): ZipEntry[] {
  // The EOCD sits at the end, behind a comment of up to 64 KiB. Scan backwards.
  let eocd = -1;
  const min = Math.max(0, view.byteLength - 65_557);
  for (let i = view.byteLength - 22; i >= min; i--) {
    if (view.getUint32(i, true) === ZIP_EOCD) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("Not a valid .xlsx file.");

  const count = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);
  const entries: ZipEntry[] = [];
  const decoder = new TextDecoder();

  for (let n = 0; n < count; n++) {
    if (view.getUint32(p, true) !== ZIP_CENTRAL) break;
    const method = view.getUint16(p + 10, true);
    const compressedSize = view.getUint32(p + 20, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const offset = view.getUint32(p + 42, true);
    const name = decoder.decode(
      new Uint8Array(view.buffer as ArrayBuffer, view.byteOffset + p + 46, nameLen),
    );
    entries.push({ name, offset, compressedSize, method });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function readZipEntry(view: DataView, entry: ZipEntry): Promise<string> {
  // The central directory's name/extra lengths need not match the local header's.
  const nameLen = view.getUint16(entry.offset + 26, true);
  const extraLen = view.getUint16(entry.offset + 28, true);
  const start = entry.offset + 30 + nameLen + extraLen;

  // Copied into a freshly allocated buffer rather than viewed in place: a view
  // over the caller's ArrayBuffer is typed as ArrayBufferLike, which Blob will
  // not accept, and the payloads here are spreadsheet-sized.
  const bytes = new Uint8Array(entry.compressedSize);
  bytes.set(
    new Uint8Array(view.buffer as ArrayBuffer, view.byteOffset + start, entry.compressedSize),
  );

  if (entry.method === 0) return new TextDecoder().decode(bytes);
  if (entry.method !== 8) throw new Error("Unsupported compression in this .xlsx file.");

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Response(stream).text();
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function decodeXml(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body: string) => {
    if (body[0] === "#") {
      const code =
        body[1] === "x" || body[1] === "X"
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ENTITIES[body] ?? whole;
  });
}

/** Concatenate every <t> inside each <si> — rich-text runs split a single string. */
function parseSharedStrings(xml: string): string[] {
  const out: string[] = [];
  for (const si of xml.match(/<si\b[\s\S]*?<\/si>|<si\b[^>]*\/>/g) ?? []) {
    let text = "";
    for (const t of si.match(/<t\b[^>]*>[\s\S]*?<\/t>/g) ?? []) {
      text += decodeXml(t.replace(/^<t\b[^>]*>/, "").replace(/<\/t>$/, ""));
    }
    out.push(text);
  }
  return out;
}

/** "A" -> 0, "Z" -> 25, "AA" -> 26. */
function columnIndex(ref: string): number {
  const letters = ref.match(/^[A-Z]+/)?.[0] ?? "A";
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

function parseSheet(xml: string, shared: string[]): string[][] {
  const rows: string[][] = [];

  for (const rowXml of xml.match(/<row\b[\s\S]*?<\/row>|<row\b[^>]*\/>/g) ?? []) {
    const cells: string[] = [];
    for (const cellXml of rowXml.match(/<c\b[\s\S]*?<\/c>|<c\b[^>]*\/>/g) ?? []) {
      const ref = cellXml.match(/\br="([A-Z]+\d+)"/)?.[1];
      const type = cellXml.match(/\bt="([^"]+)"/)?.[1] ?? "n";
      const idx = ref ? columnIndex(ref) : cells.length;

      let value = "";
      if (type === "inlineStr") {
        for (const t of cellXml.match(/<t\b[^>]*>[\s\S]*?<\/t>/g) ?? []) {
          value += decodeXml(t.replace(/^<t\b[^>]*>/, "").replace(/<\/t>$/, ""));
        }
      } else {
        const raw = cellXml.match(/<v\b[^>]*>([\s\S]*?)<\/v>/)?.[1] ?? "";
        const decoded = decodeXml(raw);
        if (type === "s") {
          value = shared[Number.parseInt(decoded, 10)] ?? "";
        } else if (type === "b") {
          value = decoded === "1" ? "TRUE" : "FALSE";
        } else {
          value = decoded;
        }
      }

      while (cells.length < idx) cells.push("");
      cells[idx] = value;
    }
    rows.push(cells);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export async function parseXlsx(buffer: ArrayBuffer): Promise<string[][]> {
  if (typeof DecompressionStream === "undefined") {
    throw new Error(
      "This browser can't read .xlsx files. Export the report as CSV and try again.",
    );
  }

  const view = new DataView(buffer);
  const entries = readZipDirectory(view);

  const sharedEntry = entries.find((e) => e.name === "xl/sharedStrings.xml");
  const shared = sharedEntry ? parseSharedStrings(await readZipEntry(view, sharedEntry)) : [];

  // Prefer the workbook's first declared sheet; fall back to lowest-numbered file.
  let sheetEntry: ZipEntry | undefined;
  const workbook = entries.find((e) => e.name === "xl/workbook.xml");
  const rels = entries.find((e) => e.name === "xl/_rels/workbook.xml.rels");
  if (workbook && rels) {
    try {
      const rid = (await readZipEntry(view, workbook)).match(
        /<sheet\b[^>]*r:id="([^"]+)"/,
      )?.[1];
      const target = (await readZipEntry(view, rels))
        .match(new RegExp(`<Relationship\\b[^>]*Id="${rid}"[^>]*>`))?.[0]
        ?.match(/Target="([^"]+)"/)?.[1];
      if (target) {
        const normalized = `xl/${target.replace(/^\/?xl\//, "").replace(/^\//, "")}`;
        sheetEntry = entries.find((e) => e.name === normalized);
      }
    } catch {
      // Fall through to the filename heuristic below.
    }
  }
  sheetEntry ??= entries
    .filter((e) => /^xl\/worksheets\/sheet\d+\.xml$/.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))[0];

  if (!sheetEntry) throw new Error("That .xlsx file has no readable worksheet.");
  return parseSheet(await readZipEntry(view, sheetEntry), shared);
}

/* -------------------------------------------------------------- coercion --- */

/** "$1,234.50", "(75.00)" and "1234.5" all mean what you think they mean. */
export function parseMoney(raw: string): number {
  const s = (raw ?? "").trim();
  if (!s) return 0;
  const negative = /^\(.*\)$/.test(s) || s.startsWith("-");
  const n = Number.parseFloat(s.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return negative ? -n : n;
}

const EXCEL_EPOCH_UTC = Date.UTC(1899, 11, 30);
const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");

/**
 * Dates arrive as US-formatted text, ISO text, or an Excel serial number.
 *
 * US ordering (MM/DD) is assumed for slash dates — these are US payer remittance
 * exports. A DD/MM export would misread, which is why the UI shows the parsed
 * date back and lets the column be remapped.
 */
export function parseDate(raw: string): Date | null {
  const s = (raw ?? "").trim();
  if (!s) return null;

  // Excel serial. Bounded to a sane window so a claim ID never reads as a date.
  if (/^\d+(\.\d+)?$/.test(s)) {
    const serial = Number.parseFloat(s);
    if (serial > 20_000 && serial < 80_000) {
      return new Date(EXCEL_EPOCH_UTC + Math.floor(serial) * 86_400_000);
    }
    return null;
  }

  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);

  const us = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (us) {
    let year = +us[3];
    if (year < 100) year += year < 70 ? 2000 : 1900;
    return new Date(year, +us[1] - 1, +us[2]);
  }

  const named = s.match(/^(\d{1,2})[-\s]([A-Za-z]{3,})[-\s](\d{4})$/);
  if (named) {
    const m = MONTHS.indexOf(named[2].slice(0, 3).toLowerCase());
    if (m >= 0) return new Date(+named[3], m, +named[1]);
  }

  const parsed = new Date(s);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/* --------------------------------------------------------------- mapping --- */

export type FieldId =
  | "claimNumber"
  | "payer"
  | "carc"
  | "billed"
  | "denialDate"
  | "cpt"
  | "icd10"
  | "reason";

export const FIELD_LABEL: Record<FieldId, string> = {
  claimNumber: "Claim number",
  payer: "Payer",
  carc: "Reason code (CARC)",
  billed: "Billed amount",
  denialDate: "Remit or service date",
  cpt: "Procedure (CPT)",
  icd10: "Diagnosis (ICD-10)",
  reason: "Denial reason text",
};

/** Without a code and an amount there is nothing to triage. */
export const REQUIRED_FIELDS: FieldId[] = ["carc", "billed"];

/**
 * Header patterns, most specific first. A remittance date beats a service date
 * for deadline purposes, so it is matched ahead of the DOS fallback.
 */
const HEADER_PATTERNS: [FieldId, RegExp][] = [
  ["carc", /\b(carc|reason\s*code|adjustment\s*code|denial\s*code|group\s*code)\b/i],
  ["billed", /\b(billed|charge[ds]?|billed\s*amount|charge\s*amount|total\s*charge)\b/i],
  ["denialDate", /\b(remit|remittance|denial\s*date|denied\s*on|eob\s*date|check\s*date|paid\s*date)\b/i],
  ["denialDate", /\b(dos|service\s*date|date\s*of\s*service|from\s*date)\b/i],
  ["payer", /\b(payer|payor|insurance|carrier|plan\s*name)\b/i],
  ["claimNumber", /\b(claim\s*(number|no|num|#|id)|icn)\b/i],
  ["cpt", /\b(cpt|hcpcs|procedure\s*code|proc\s*code)\b/i],
  ["icd10", /\b(icd|diagnosis|dx)\b/i],
  ["reason", /\b(denial\s*reason|reason\s*desc|description|remark)\b/i],
];

/** Columns we deliberately never read. Surfaced in the UI so it's visible. */
const IGNORED_PATTERN =
  /\b(patient|member|subscriber|dob|birth|ssn|mrn|npi|address|phone|email|guarantor|first\s*name|last\s*name)\b/i;

export function isIgnorableColumn(header: string): boolean {
  return IGNORED_PATTERN.test(header ?? "");
}

export type Mapping = Partial<Record<FieldId, number>>;

export function detectMapping(headers: string[]): Mapping {
  const mapping: Mapping = {};
  for (const [field, pattern] of HEADER_PATTERNS) {
    if (mapping[field] !== undefined) continue;
    const idx = headers.findIndex(
      (h) => pattern.test(h ?? "") && !isIgnorableColumn(h ?? ""),
    );
    if (idx >= 0) mapping[field] = idx;
  }
  return mapping;
}

export function missingRequired(mapping: Mapping): FieldId[] {
  return REQUIRED_FIELDS.filter((f) => mapping[f] === undefined);
}

export type BuildResult = { rows: ClaimRow[]; skipped: number };

/**
 * Turn mapped cells into claim rows. Rows with no reason code are counted as
 * skipped rather than silently dropped — a file that mostly fails to map should
 * look wrong, not look empty.
 */
export function buildRows(dataRows: string[][], mapping: Mapping): BuildResult {
  const at = (row: string[], field: FieldId): string => {
    const idx = mapping[field];
    return idx === undefined ? "" : (row[idx] ?? "").trim();
  };

  const rows: ClaimRow[] = [];
  let skipped = 0;

  for (const row of dataRows) {
    const carc = at(row, "carc");
    if (!carc) {
      skipped += 1;
      continue;
    }
    rows.push({
      claimNumber: at(row, "claimNumber") || undefined,
      payer: at(row, "payer") || undefined,
      carc,
      billed: parseMoney(at(row, "billed")),
      denialDate: parseDate(at(row, "denialDate")),
      cpt: at(row, "cpt") || undefined,
      icd10: at(row, "icd10") || undefined,
      reason: at(row, "reason") || undefined,
    });
  }
  return { rows, skipped };
}

/** Read a File into a header row plus data rows, by extension. */
export async function readClaimsFile(
  file: File,
): Promise<{ headers: string[]; dataRows: string[][] }> {
  const isXlsx = /\.xlsx$/i.test(file.name);
  const table = isXlsx ? await parseXlsx(await file.arrayBuffer()) : parseCsv(await file.text());

  if (table.length < 2) {
    throw new Error("That file has no data rows under its header.");
  }
  return { headers: table[0].map((h) => (h ?? "").trim()), dataRows: table.slice(1) };
}
