/**
 * What Yeam charges, and the arithmetic behind choosing a plan.
 *
 * The shape is borrowed from Polar: the monthly fee does not unlock features,
 * it buys a lower rate on the unit of work. Every paid tier is the same product,
 * so nobody has to decode which plan holds the feature they need, and upgrading
 * becomes arithmetic a customer can do themselves instead of a sales call.
 *
 * The unit is a denial *worked*, not a letter drafted. Drafting is the cheap
 * part; deciding what to file and by when is the work. Billing on recovered
 * dollars would be the better alignment still, but it is unmeasurable until the
 * 835 remittance feed lands — see /architecture. Revisit this then.
 *
 * NOTE: these numbers are placeholders pending real unit economics. They live
 * here and only here so changing them is a one-line edit.
 */

export type TierId = "triage" | "practice" | "group" | "network";

export type Tier = {
  id: TierId;
  name: string;
  /** Fixed monthly platform fee, USD. */
  monthly: number;
  /** Marginal cost per denial worked, USD. */
  perDenial: number;
  tagline: string;
  features: string[];
  /** Free tier is priced at zero but doesn't do the paid job — see PAID_TIERS. */
  free?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "triage",
    name: "Triage",
    monthly: 0,
    perDenial: 0,
    free: true,
    tagline: "The worklist, in your browser. Free, unlimited, no account.",
    features: [
      "Upload a denied-claims export",
      "Correct remedy per denial",
      "Filing deadline per denial",
      "Your file never leaves your browser",
      "No BAA required",
    ],
  },
  {
    id: "practice",
    name: "Practice",
    monthly: 200,
    perDenial: 4,
    tagline: "One practice, working denials on real claim data.",
    features: [
      "Everything in Triage",
      "Drafted corrected claims, appeals and reprocessing requests",
      "Deadlines tracked, not just calculated",
      "Real PHI under a signed BAA",
      "Submission-ready output per payer",
    ],
  },
  {
    id: "group",
    name: "Group",
    monthly: 600,
    perDenial: 1.5,
    tagline: "Several practices from one workspace.",
    features: [
      "Everything in Practice",
      "Multi-practice scoping",
      "Repeat-denial patterns by payer and code",
      "Per-practice reporting",
      "Shared payer profiles",
    ],
  },
  {
    id: "network",
    name: "Network",
    monthly: 1200,
    perDenial: 0.6,
    tagline: "Billing companies running denials at volume.",
    features: [
      "Everything in Group",
      "835 remittance feed from your clearinghouse",
      "Win rates by payer and reason code",
      "Priority payer-rule coverage",
      "Dedicated support",
    ],
  },
];

/** The tiers that actually compete on price. Triage is free but does less. */
export const PAID_TIERS: Tier[] = TIERS.filter((t) => !t.free);

export function tierById(id: TierId): Tier {
  const tier = TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown tier: ${id}`);
  return tier;
}

export function monthlyCost(tier: Tier, denials: number): number {
  return tier.monthly + tier.perDenial * Math.max(0, denials);
}

/**
 * Cheapest paid tier at this volume. Ties go to the lower monthly commitment —
 * at the break-even point the customer should not be pushed onto a bigger plan
 * for the same money.
 */
export function recommendedTier(denials: number): TierId {
  let best = PAID_TIERS[0];
  for (const tier of PAID_TIERS.slice(1)) {
    if (monthlyCost(tier, denials) < monthlyCost(best, denials)) best = tier;
  }
  return best.id;
}

export type Crossover = { from: TierId; to: TierId; denials: number };

/**
 * Break-even volumes between consecutive paid tiers, derived rather than
 * hardcoded so the marks on the slider can never drift from the real maths.
 */
export function crossovers(): Crossover[] {
  const out: Crossover[] = [];
  for (let i = 0; i < PAID_TIERS.length - 1; i++) {
    const a = PAID_TIERS[i];
    const b = PAID_TIERS[i + 1];
    const rateGap = a.perDenial - b.perDenial;
    if (rateGap <= 0) continue;
    out.push({
      from: a.id,
      to: b.id,
      denials: (b.monthly - a.monthly) / rateGap,
    });
  }
  return out;
}

/** Blended cost per denial — the number that makes tiers comparable. */
export function effectiveRate(tier: Tier, denials: number): number | null {
  if (denials <= 0) return null;
  return monthlyCost(tier, denials) / denials;
}

/**
 * Denials per month implied by claim volume. The bucket labels mirror the ones
 * the contact form already asks visitors to pick from.
 */
export const DENIAL_RATE_DEFAULT = 0.1;

export const VOLUME_PRESETS: { label: string; claims: number }[] = [
  { label: "0 – 1,000 claims/month", claims: 1_000 },
  { label: "1,000 – 5,000 claims/month", claims: 5_000 },
  { label: "5,000+ claims/month", claims: 12_000 },
];

export function deniedFromClaims(claims: number, denialRate: number): number {
  return Math.round(claims * denialRate);
}
