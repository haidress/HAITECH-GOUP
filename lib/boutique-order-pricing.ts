export type CouponRule = {
  code: string;
  discount_type: "fixed" | "percent";
  discount_value: number;
};

export type BundleRule = {
  id: number;
  name: string;
  discount_type: "fixed" | "percent";
  discount_value: number;
};

export function applyDiscount(baseAmount: number, type: "fixed" | "percent", value: number) {
  if (baseAmount <= 0) return 0;
  if (type === "fixed") return Math.max(0, baseAmount - Math.max(0, value));
  const safePercent = Math.max(0, Math.min(100, value));
  return Math.max(0, baseAmount - (baseAmount * safePercent) / 100);
}

export function computeOrderAmountWithOffers(input: {
  baseAmount: number;
  coupon?: CouponRule | null;
  bundle?: BundleRule | null;
}) {
  const lines: string[] = [];
  let amount = Math.max(0, input.baseAmount);

  if (input.bundle) {
    const before = amount;
    amount = applyDiscount(amount, input.bundle.discount_type, input.bundle.discount_value);
    if (amount < before) {
      lines.push(`Bundle ${input.bundle.name} appliqué`);
    }
  }
  if (input.coupon) {
    const before = amount;
    amount = applyDiscount(amount, input.coupon.discount_type, input.coupon.discount_value);
    if (amount < before) {
      lines.push(`Coupon ${input.coupon.code} appliqué`);
    }
  }

  return {
    finalAmount: amount,
    notes: lines
  };
}

export function stockState(stock: number, lowStockThreshold: number) {
  if (stock <= 0) return "rupture" as const;
  if (stock <= lowStockThreshold) return "faible" as const;
  return "ok" as const;
}
