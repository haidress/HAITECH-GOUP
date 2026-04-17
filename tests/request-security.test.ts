import { describe, expect, it } from "vitest";
import { ensureSameOrigin } from "@/lib/request-security";

describe("ensureSameOrigin", () => {
  it("laisse passer les GET", () => {
    const req = new Request("http://localhost:3000/api/test", { method: "GET" });
    expect(ensureSameOrigin(req)).toBeNull();
  });

  it("bloque un POST sans origin", async () => {
    const req = new Request("http://localhost:3000/api/test", { method: "POST" });
    const res = ensureSameOrigin(req);
    expect(res).not.toBeNull();
    if (!res) return;
    expect(res.status).toBe(403);
  });

  it("laisse passer un POST même origine", () => {
    const req = new Request("http://localhost:3000/api/test", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        host: "localhost:3000"
      }
    });
    expect(ensureSameOrigin(req)).toBeNull();
  });
});
