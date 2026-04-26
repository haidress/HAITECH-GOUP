import { describe, expect, it } from "vitest";
import { faqItemsToJsonLd, normalizeFaqFromDb, parseBlogFaqJson } from "@/lib/blog-faq";
import { normalizeFaqJsonForDb } from "@/lib/blog-admin-faq";

describe("parseBlogFaqJson", () => {
  it("parse un tableau valide", () => {
    const raw = JSON.stringify([{ question: "Q1 ?", answer: "Réponse assez longue pour passer le minimum." }]);
    expect(parseBlogFaqJson(raw)).toHaveLength(1);
  });

  it("retourne vide sur JSON invalide", () => {
    expect(parseBlogFaqJson("{")).toEqual([]);
  });
});

describe("normalizeFaqFromDb", () => {
  it("accepte un tableau déjà parsé (mysql2 JSON)", () => {
    const rows = [{ question: "Q ?", answer: "Réponse détaillée pour validation." }];
    expect(normalizeFaqFromDb(rows)).toHaveLength(1);
  });
});

describe("faqItemsToJsonLd", () => {
  it("retourne null si aucune entrée", () => {
    expect(faqItemsToJsonLd([])).toBeNull();
  });

  it("produit un FAQPage schema.org", () => {
    const doc = faqItemsToJsonLd([{ question: "Q ?", answer: "Réponse détaillée pour validation." }]);
    expect(doc).not.toBeNull();
    expect(doc?.["@type"]).toBe("FAQPage");
    expect(Array.isArray(doc?.mainEntity)).toBe(true);
  });
});

describe("normalizeFaqJsonForDb", () => {
  it("normalise une chaîne JSON valide", () => {
    const raw = JSON.stringify([{ question: "Question test ?", answer: "Réponse assez longue pour être acceptée." }]);
    const out = normalizeFaqJsonForDb(raw);
    expect(out).toBeTruthy();
    expect(JSON.parse(out ?? "[]")).toHaveLength(1);
  });

  it("rejette un JSON invalide", () => {
    expect(() => normalizeFaqJsonForDb("{")).toThrow();
  });
});
