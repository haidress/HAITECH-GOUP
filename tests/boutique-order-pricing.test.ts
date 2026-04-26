import { describe, expect, it } from "vitest";
import { applyDiscount, computeOrderAmountWithOffers, stockState } from "@/lib/boutique-order-pricing";

describe("boutique-order-pricing", () => {
  it("applique une remise fixe", () => {
    expect(applyDiscount(10000, "fixed", 2500)).toBe(7500);
  });

  it("applique une remise en pourcentage", () => {
    expect(applyDiscount(10000, "percent", 20)).toBe(8000);
  });

  it("cumule bundle puis coupon", () => {
    const out = computeOrderAmountWithOffers({
      baseAmount: 100000,
      bundle: { id: 1, name: "Bundle Pro", discount_type: "percent", discount_value: 10 },
      coupon: { code: "PROMO10", discount_type: "percent", discount_value: 10 }
    });
    expect(out.finalAmount).toBe(81000);
    expect(out.notes.length).toBe(2);
  });

  it("détermine correctement l'état de stock", () => {
    expect(stockState(0, 5)).toBe("rupture");
    expect(stockState(3, 5)).toBe("faible");
    expect(stockState(10, 5)).toBe("ok");
  });
});
