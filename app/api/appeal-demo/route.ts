import { NextResponse } from "next/server";

/**
 * Public appeal-drafting demo.
 *
 * The drafting itself lives in the Yeam app (app.yeam.ai), which owns the
 * Gemini key, the document parsers and the tuned prompt. This route forwards
 * to it server-to-server with a shared secret, so none of that has to be
 * duplicated here and no key is ever exposed to a browser.
 *
 * The upstream endpoint is not browser-callable and sets no CORS headers, so
 * this proxy is the only way in from the site.
 */

export const runtime = "nodejs";
/** Drafting regularly takes 10-20s and longer on a cold start. */
export const maxDuration = 60;

const MAX_FILES = 3;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const MAX_NOTES_CHARS = 8_000;

const UPSTREAM =
  process.env.YEAM_APP_URL?.replace(/\/$/, "") ?? "https://app.yeam.ai";

/**
 * Per-IP throttle.
 *
 * Honest limitation: this map lives in one lambda's memory. Vercel runs many
 * instances concurrently and recycles them, so the real ceiling is this number
 * times however many instances are warm, and a cold start resets it entirely.
 * It slows down casual abuse; it is not a quota. Turnstile below is the part
 * that actually stops scripted traffic, once its keys are set.
 */
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function recentHits(ip: string): number[] {
  const now = Date.now();
  return (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
}

function rateLimited(ip: string): boolean {
  const recent = recentHits(ip);
  hits.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

function recordHit(ip: string): void {
  hits.set(ip, [...recentHits(ip), Date.now()]);
  if (hits.size > 500) {
    for (const key of [...hits.keys()]) {
      if (recentHits(key).length === 0) hits.delete(key);
    }
  }
}

/**
 * Verify a Cloudflare Turnstile token.
 *
 * Skipped entirely when TURNSTILE_SECRET_KEY is unset, so the tool can ship
 * before the keys exist. Setting the key switches enforcement on with no code
 * change. Until then the rate limit above is the only guard, which is why it
 * is set conservatively.
 */
async function turnstilePassed(token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // A Cloudflare outage should not take the demo down with it.
    return true;
  }
}

export async function POST(req: Request) {
  const secret = process.env.PUBLIC_DEMO_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "The demo is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "You've reached the demo limit for this hour. Try again shortly." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }

  if (!(await turnstilePassed(form.get("turnstileToken") as string | null))) {
    return NextResponse.json(
      { error: "Could not verify that request. Please reload and try again." },
      { status: 403 },
    );
  }

  const notes = (form.get("notes") as string | null)?.trim() || "";
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0 && !notes) {
    return NextResponse.json(
      { error: "Pick a sample or attach a document first." },
      { status: 400 },
    );
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Attach at most ${MAX_FILES} files.` },
      { status: 400 },
    );
  }
  if (notes.length > MAX_NOTES_CHARS) {
    return NextResponse.json(
      { error: "Those notes are too long — keep them under 8,000 characters." },
      { status: 413 },
    );
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      {
        error: `Those files total ${(totalBytes / 1024 / 1024).toFixed(1)} MB. The limit is 4 MB.`,
      },
      { status: 413 },
    );
  }

  // Rebuild rather than forwarding the original body: the incoming FormData
  // carries the Turnstile token, which the upstream neither needs nor expects.
  const outbound = new FormData();
  for (const file of files) outbound.append("files", file);
  if (notes) outbound.append("notes", notes);

  recordHit(ip);

  try {
    const res = await fetch(`${UPSTREAM}/api/public/appeal-demo`, {
      method: "POST",
      headers: { "x-yeam-demo-secret": secret },
      body: outbound,
    });
    const data = (await res.json()) as { letter?: string; error?: string };

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Could not draft the letter. Please try again." },
        { status: res.status },
      );
    }
    if (!data.letter) {
      return NextResponse.json(
        { error: "Could not draft the letter. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ letter: data.letter });
  } catch (err) {
    console.error("appeal demo upstream failed", err);
    return NextResponse.json(
      { error: "Could not reach the drafting service. Please try again." },
      { status: 502 },
    );
  }
}
