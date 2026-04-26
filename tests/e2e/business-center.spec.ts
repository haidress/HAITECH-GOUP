import { test, expect } from "@playwright/test";

test("business center affiche les CTAs critiques", async ({ page }) => {
  await page.goto("/business-center");

  await expect(page.getByRole("heading", { name: /opportunites concretes/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /discuter sur whatsapp/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /opportunites du moment/i })).toBeVisible();
});
