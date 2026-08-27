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
 * Network is quoted rather than published — see the `custom` flag. Everything
 * else lives here and only here, so changing a price is a one-line edit.
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
  /**
   * Quoted rather than published. A custom tier carries no usable monthly or
   * perDenial, so it is excluded from PAID_TIERS and never enters the
   * recommendation, crossover or savings arithmetic.
   */
  custom?: boolean;
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
    monthly: 15,
    perDenial: 2,
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
    monthly: 99,
    perDenial: 0.75,
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
    // Quoted, not published: at this volume the payer mix and the feed work
    // move the number more than the denial count does.
    monthly: 0,
    perDenial: 0,
    custom: true,
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
export const PAID_TIERS: Tier[] = TIERS.filter((t) => !t.free && !t.custom);

/**
 * Volume past which the published rate stops being the right conversation.
 * recommendedTier keeps returning a tier it can actually price; this is the
 * separate signal that a quote would beat it.
 */
export const CUSTOM_FROM_DENIALS = 1_000;

export function suggestsCustom(denials: number): boolean {
  return denials >= CUSTOM_FROM_DENIALS;
}

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
 * What working one denial costs without Yeam.
 *
 * The comparison is deliberately cost-to-work, not dollars-recovered. Recovery
 * needs the 835 feed to be measurable at all (see the note at the top of this
 * file), and a recovery figure we cannot show the working for is exactly the
 * kind of number this pricing page exists to avoid.
 *
 * $25 is the commonly cited cost to rework a claim; appealing one runs closer
 * to $118. The default sits at the low end on purpose — the conservative
 * number is the one worth arguing from.
 */
export const MANUAL_COST_DEFAULT = 25;

export function manualMonthlyCost(denials: number, manualPerDenial: number): number {
  return Math.max(0, denials) * Math.max(0, manualPerDenial);
}

/** Monthly difference. Negative when Yeam costs more than working by hand. */
export function monthlySavings(
  tier: Tier,
  denials: number,
  manualPerDenial: number
): number {
  return manualMonthlyCost(denials, manualPerDenial) - monthlyCost(tier, denials);
}

/** The same difference per denial. Null at zero volume, where it is undefined. */
export function savingsPerDenial(
  tier: Tier,
  denials: number,
  manualPerDenial: number
): number | null {
  if (denials <= 0) return null;
  return monthlySavings(tier, denials, manualPerDenial) / denials;
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
