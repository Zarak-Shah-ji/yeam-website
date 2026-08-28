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
  manualMonthlyCost,
  monthlySavings,
  savingsPerDenial,
  suggestsCustom,
  MANUAL_COST_DEFAULT,
  CUSTOM_FROM_DENIALS,
} from "@/lib/pricing";

describe("tier table", () => {
  it("keeps exactly one free tier", () => {
    expect(TIERS.filter((t) => t.free)).toHaveLength(1);
  });

  it("keeps quoted tiers out of the priced set", () => {
    // A custom tier has no usable monthly or perDenial, so letting it into
    // PAID_TIERS would hand recommendedTier and crossovers a free plan to
    // recommend to everybody.
    expect(TIERS.some((t) => t.custom)).toBe(true);
    expect(PAID_TIERS.some((t) => t.custom || t.free)).toBe(false);
    expect(PAID_TIERS).toHaveLength(
      TIERS.filter((t) => !t.free && !t.custom).length,
    );
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
    expect(monthlyCost(tierById("practice"), 100)).toBe(15 + 200);
    expect(monthlyCost(tierById("group"), 1000)).toBe(99 + 750);
  });

  it("is the bare fee at zero volume", () => {
    expect(monthlyCost(tierById("group"), 0)).toBe(99);
  });

  it("treats negative volume as zero rather than crediting the customer", () => {
    expect(monthlyCost(tierById("practice"), -50)).toBe(15);
  });
});

describe("recommendedTier", () => {
  const [first] = crossovers();

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

  it("flips one denial past the break-even", () => {
    expect(recommendedTier(Math.floor(first.denials) + 1)).toBe("group");
  });

  it("never recommends a tier that is not the cheapest available", () => {
    for (const n of [1, 25, 67, 68, 200, 1_000, 2_000]) {
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

describe("savings against working manually", () => {
  const practice = tierById("practice");

  it("clamps negative inputs rather than inventing a credit", () => {
    expect(manualMonthlyCost(-10, 25)).toBe(0);
    expect(manualMonthlyCost(10, -25)).toBe(0);
  });

  it("is null per denial at zero volume instead of dividing by zero", () => {
    expect(savingsPerDenial(practice, 0, MANUAL_COST_DEFAULT)).toBeNull();
  });

  it("is positive at the default manual cost", () => {
    expect(monthlySavings(practice, 100, MANUAL_COST_DEFAULT)).toBeGreaterThan(0);
    expect(savingsPerDenial(practice, 100, MANUAL_COST_DEFAULT)!).toBeGreaterThan(0);
  });

  it("goes negative when Yeam costs more than the manual baseline", () => {
    // The calculator has to say so rather than render a negative "saving".
    const manual = 1;
    expect(monthlySavings(practice, 25, manual)).toBeLessThan(0);
    expect(savingsPerDenial(practice, 25, manual)!).toBeLessThan(0);
  });

  it("agrees with the blended rate it is drawn against", () => {
    const denials = 200;
    const perDenial = savingsPerDenial(practice, denials, MANUAL_COST_DEFAULT)!;
    expect(perDenial).toBeCloseTo(
      MANUAL_COST_DEFAULT - effectiveRate(practice, denials)!,
      6,
    );
  });
});

describe("suggestsCustom", () => {
  it("holds off below the threshold and fires at it", () => {
    expect(suggestsCustom(CUSTOM_FROM_DENIALS - 1)).toBe(false);
    expect(suggestsCustom(CUSTOM_FROM_DENIALS)).toBe(true);
  });

  it("never displaces the priced recommendation", () => {
    // recommendedTier must keep returning something the calculator can price.
    expect(PAID_TIERS.map((t) => t.id)).toContain(recommendedTier(5_000));
  });
});
