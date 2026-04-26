import { describe, expect, it } from "vitest";
import { appendLeadBesoinBlock, normalizeLeadEmail, normalizeLeadPhoneDigits } from "@/lib/lead-normalize";

describe("lead-normalize", () => {
  it("normalise l'e-mail", () => {
    expect(normalizeLeadEmail("  Test@Example.COM ")).toBe("test@example.com");
  });

  it("normalise le téléphone en chiffres", () => {
    expect(normalizeLeadPhoneDigits("+225 07-89-17-46-19")).toBe("2250789174619");
    expect(normalizeLeadPhoneDigits("123")).toBe(null);
    expect(normalizeLeadPhoneDigits(null)).toBe(null);
  });

  it("concatène les messages de lead", () => {
    const merged = appendLeadBesoinBlock("Ancien", "Nouveau", new Date("2026-01-15T12:00:00Z"));
    expect(merged).toContain("Ancien");
    expect(merged).toContain("Nouveau");
  });
});
