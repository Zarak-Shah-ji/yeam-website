import { NextResponse } from "next/server";
import {
  UPSTREAM,
  clientIp,
  rateLimited,
  recordHit,
  turnstilePassed,
} from "@/lib/demoProxy";

/**
 * Revise a drafted response, conversationally.
 *
 * Sibling of /api/appeal-demo: that one turns a denial into a first draft,
 * this one takes the draft back with an instruction ("cite the LCD", "make it
 * shorter", "they want the op note referenced") and returns the next version
 * plus a short reply to show in the thread.
 *
 * Drafting stays in the Yeam app for the same reasons it always has — it owns
 * the model key and the tuned prompt, and neither should be duplicated here or
 * reach a browser. This is a thin authenticated proxy.
 *
 * UPSTREAM CONTRACT — POST {UPSTREAM}/api/public/appeal-revise
 *   header  x-yeam-demo-secret: PUBLIC_DEMO_SECRET
 *   body    { letter: string, instruction: string,
 *             history: { role: "user" | "assistant", text: string }[] }
 *   200     { letter: string, reply?: string }
 *   4xx/5xx { error: string }
 * `letter` is the full revised draft, not a patch. `reply` is one or two
 * sentences for the chat thread; when it is absent the client shows a default.
 */

export const runtime = "nodejs";
/** Revisions are shorter than a first draft but still model-bound. */
export const maxDuration = 60;

const MAX_LETTER_CHARS = 20_000;
const MAX_INSTRUCTION_CHARS = 2_000;
/** Turns kept for context. Older ones are dropped client-side too. */
const MAX_HISTORY = 12;

type Turn = { role: "user" | "assistant"; text: string };

function cleanHistory(value: unknown): Turn[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (t): t is Turn =>
        !!t &&
        typeof t === "object" &&
        ((t as Turn).role === "user" || (t as Turn).role === "assistant") &&
        typeof (t as Turn).text === "string",
    )
    .slice(-MAX_HISTORY)
    .map((t) => ({ role: t.role, text: t.text.slice(0, MAX_INSTRUCTION_CHARS) }));
}

export async function POST(req: Request) {
  const secret = process.env.PUBLIC_DEMO_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "The demo is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "That's the demo limit for this hour. Book a walkthrough and we'll run it on your own denials.",
      },
      { status: 429 },
    );
  }

  let body: {
    letter?: unknown;
    instruction?: unknown;
    history?: unknown;
    turnstileToken?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Could not read the request." }, { status: 400 });
  }

  const token =
    typeof body.turnstileToken === "string" ? body.turnstileToken : null;
  if (!(await turnstilePassed(token))) {
    return NextResponse.json(
      { error: "Could not verify that request. Please reload and try again." },
      { status: 403 },
    );
  }

  const letter = typeof body.letter === "string" ? body.letter.trim() : "";
  const instruction =
    typeof body.instruction === "string" ? body.instruction.trim() : "";

  if (!letter || !instruction) {
    return NextResponse.json(
      { error: "Draft a response first, then say what to change." },
      { status: 400 },
    );
  }
  if (letter.length > MAX_LETTER_CHARS) {
    return NextResponse.json(
      { error: "That draft is too long to revise here." },
      { status: 413 },
    );
  }
  if (instruction.length > MAX_INSTRUCTION_CHARS) {
    return NextResponse.json(
      { error: "Keep the instruction under 2,000 characters." },
      { status: 413 },
    );
  }

  recordHit(ip);

  try {
    const res = await fetch(`${UPSTREAM}/api/public/appeal-revise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-yeam-demo-secret": secret,
      },
      body: JSON.stringify({
        letter,
        instruction,
        history: cleanHistory(body.history),
      }),
    });
    const data = (await res.json()) as { letter?: string; reply?: string; error?: string };

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Could not revise the response. Please try again." },
        { status: res.status },
      );
    }
    if (!data.letter) {
      return NextResponse.json(
        { error: "Could not revise the response. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ letter: data.letter, reply: data.reply ?? "" });
  } catch (err) {
    console.error("appeal revise upstream failed", err);
    return NextResponse.json(
      { error: "Could not reach the drafting service. Please try again." },
      { status: 502 },
    );
  }
}
