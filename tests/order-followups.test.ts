import { describe, expect, it } from "vitest";
import { pendingDayMarks } from "@/lib/order-followups";

describe("order-followups", () => {
  it("retourne J+1 quand la commande a au moins 1 jour", () => {
    expect(pendingDayMarks(1, [])).toEqual([1]);
  });

  it("retourne J+1 et J+3 quand éligible", () => {
    expect(pendingDayMarks(3, [])).toEqual([1, 3]);
  });

  it("exclut les relances déjà envoyées", () => {
    expect(pendingDayMarks(7, [1, 3])).toEqual([7]);
  });
});
