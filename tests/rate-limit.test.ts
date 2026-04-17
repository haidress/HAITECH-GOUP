import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("autorise les requêtes sous la limite", () => {
    const req = new Request("http://localhost:3000/api/test", {
      headers: { "x-forwarded-for": "1.2.3.4" }
    });
    const first = checkRateLimit(req, "unit-limit-ok", 2, 60_000);
    const second = checkRateLimit(req, "unit-limit-ok", 2, 60_000);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
  });

  it("bloque après dépassement de la limite", () => {
    const req = new Request("http://localhost:3000/api/test", {
      headers: { "x-forwarded-for": "5.6.7.8" }
    });
    checkRateLimit(req, "unit-limit-block", 1, 60_000);
    const blocked = checkRateLimit(req, "unit-limit-block", 1, 60_000);
    expect(blocked.ok).toBe(false);
    expect(typeof blocked.retryAfterSec).toBe("number");
  });
});
