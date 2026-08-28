/**
 * Shared plumbing for the two public demo proxies.
 *
 * Both /api/appeal-demo and /api/appeal-demo/revise forward to the Yeam app,
 * which owns the model key, the parsers and the tuned prompt. They also share
 * one throttle budget on purpose: a visitor who drafts a letter and then chats
 * about it is one demo session, not two, and splitting the budget would let a
 * script get twice the calls by alternating endpoints.
 */

export const UPSTREAM =
  process.env.YEAM_APP_URL?.replace(/\/$/, "") ?? "https://app.yeam.ai";

/**
 * Per-IP throttle.
 *
 * Honest limitation: this map lives in one lambda's memory. Vercel runs many
 * instances concurrently and recycles them, so the real ceiling is this number
 * times however many instances are warm, and a cold start resets it entirely.
 * It slows down casual abuse; it is not a quota. Turnstile is the part that
 * actually stops scripted traffic, once its keys are set.
 */
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

/** Local development is not rate limited — it only ever gets in the way there. */
const RATE_LIMIT_ENABLED = process.env.NODE_ENV === "production";
const hits = new Map<string, number[]>();

function recentHits(ip: string): number[] {
  const now = Date.now();
  return (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
}

export function rateLimited(ip: string): boolean {
  if (!RATE_LIMIT_ENABLED) return false;
  const recent = recentHits(ip);
  hits.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

export function recordHit(ip: string): void {
  hits.set(ip, [...recentHits(ip), Date.now()]);
  if (hits.size > 500) {
    for (const key of [...hits.keys()]) {
      if (recentHits(key).length === 0) hits.delete(key);
    }
  }
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * Verify a Cloudflare Turnstile token.
 *
 * Skipped entirely when TURNSTILE_SECRET_KEY is unset, so the tools can ship
 * before the keys exist. Setting the key switches enforcement on with no code
 * change. Until then the rate limit above is the only guard, which is why it
 * is set conservatively.
 */
export async function turnstilePassed(token: string | null): Promise<boolean> {
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
