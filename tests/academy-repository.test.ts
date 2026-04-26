import { describe, expect, it } from "vitest";
import { mapDbFormationToCatalogFormation } from "@/lib/repositories/academy-repository";

describe("academy repository mapper", () => {
  it("mappe une formation web depuis la base", () => {
    const mapped = mapDbFormationToCatalogFormation({
      titre: "React JS avancé",
      description: "Hooks, routing, architecture",
      prix: 120000,
      niveau: "Avancé",
      duree: "8 semaines",
      image: "/slide-sites.png"
    });

    expect(mapped.name).toBe("React JS avancé");
    expect(mapped.category).toBe("Développement web");
    expect(mapped.level).toBe("Avancé");
    expect(mapped.format).toBe("Présentiel / Visio");
    expect(mapped.price).toBe(120000);
    expect(mapped.outcomes?.[0]).toContain("Hooks");
  });
});
