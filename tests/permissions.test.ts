import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCurrentUserMock } = vi.hoisted(() => ({
  getCurrentUserMock: vi.fn()
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: getCurrentUserMock
}));

import { hasPermission } from "@/lib/permissions";

describe("permissions", () => {
  beforeEach(() => {
    getCurrentUserMock.mockReset();
  });

  it("autorise catalog.manage pour admin", async () => {
    getCurrentUserMock.mockResolvedValue({ role: "admin" });
    expect(await hasPermission("catalog.manage")).toBe(true);
  });

  it("refuse catalog.pricing pour catalog_manager", async () => {
    getCurrentUserMock.mockResolvedValue({ role: "catalog_manager" });
    expect(await hasPermission("catalog.pricing")).toBe(false);
  });

  it("autorise catalog.pricing pour sales_manager", async () => {
    getCurrentUserMock.mockResolvedValue({ role: "sales_manager" });
    expect(await hasPermission("catalog.pricing")).toBe(true);
  });
});
