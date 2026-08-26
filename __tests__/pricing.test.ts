import { describe, it, expect } from "vitest";
import {
  TIERS,
  PAID_TIERS,
  tierById,
  monthlyCost,
  recommendedTier,
  crossovers,
  effectiveRate,
  deniedFromClaims,
} from "@/lib/pricing";

describe("tier table", () => {
  it("keeps exactly one free tier", () => {
    expect(TIERS.filter((t) => t.free)).toHaveLength(1);
    expect(PAID_TIERS).toHaveLength(TIERS.length - 1);
  });

  it("raises the fee and lowers the rate at every step — the whole mechanic", () => {
    // If a tier ever charged more AND billed more per denial there would be no
    // reason to buy it, and the calculator would recommend it to nobody.
    for (let i = 1; i < PAID_TIERS.length; i++) {
      expect(PAID_TIERS[i].monthly).toBeGreaterThan(PAID_TIERS[i - 1].monthly);
      expect(PAID_TIERS[i].perDenial).toBeLessThan(PAID_TIERS[i - 1].perDenial);
    }
  });

  it("throws on an unknown id rather than returning undefined", () => {
    expect(() => tierById("nope" as never)).toThrow();
  });
});

describe("monthlyCost", () => {
  it("is the fee plus the marginal rate", () => {
    expect(monthlyCost(tierById("practice"), 100)).toBe(200 + 400);
    expect(monthlyCost(tierById("network"), 1000)).toBe(1200 + 600);
  });

  it("is the bare fee at zero volume", () => {
    expect(monthlyCost(tierById("group"), 0)).toBe(600);
  });

  it("treats negative volume as zero rather than crediting the customer", () => {
    expect(monthlyCost(tierById("practice"), -50)).toBe(200);
  });
});

describe("recommendedTier", () => {
  const [first, second] = crossovers();

  it("recommends the entry tier below the first break-even", () => {
    expect(recommendedTier(0)).toBe("practice");
    expect(recommendedTier(first.denials - 1)).toBe("practice");
  });

  it("holds the cheaper commitment at an exact tie", () => {
    // At break-even both plans cost the same; pushing the customer up a tier for
    // identical money is the kind of thing that loses trust.
    expect(monthlyCost(tierById("practice"), first.denials)).toBe(
      monthlyCost(tierById("group"), first.denials),
    );
    expect(recommendedTier(first.denials)).toBe("practice");
  });

  it("flips one denial past each break-even", () => {
    expect(recommendedTier(Math.floor(first.denials) + 1)).toBe("group");
    expect(recommendedTier(Math.floor(second.denials) + 1)).toBe("network");
  });

  it("never recommends a tier that is not the cheapest available", () => {
    for (const n of [1, 50, 160, 161, 400, 666, 667, 2000]) {
      const picked = monthlyCost(tierById(recommendedTier(n)), n);
      const cheapest = Math.min(...PAID_TIERS.map((t) => monthlyCost(t, n)));
      expect(picked).toBe(cheapest);
    }
  });
});

describe("crossovers", () => {
  it("derives one break-even between each consecutive pair", () => {
    expect(crossovers()).toHaveLength(PAID_TIERS.length - 1);
  });

  it("lands where the two plans genuinely cost the same", () => {
    for (const c of crossovers()) {
      expect(monthlyCost(tierById(c.from), c.denials)).toBeCloseTo(
        monthlyCost(tierById(c.to), c.denials),
        6,
      );
    }
  });

  it("rises monotonically, so the slider marks stay in order", () => {
    const points = crossovers().map((c) => c.denials);
    expect([...points].sort((a, b) => a - b)).toEqual(points);
  });
});

describe("effectiveRate", () => {
  it("falls as volume spreads the fee", () => {
    const tier = tierById("practice");
    expect(effectiveRate(tier, 200)!).toBeLessThan(effectiveRate(tier, 50)!);
  });

  it("is null at zero volume instead of dividing by zero", () => {
    expect(effectiveRate(tierById("practice"), 0)).toBeNull();
  });
});

describe("deniedFromClaims", () => {
  it("applies the denial rate and rounds to whole claims", () => {
    expect(deniedFromClaims(1_000, 0.1)).toBe(100);
    expect(deniedFromClaims(1_005, 0.1)).toBe(101);
  });
});
