import { test, expect } from "@playwright/test";

test("la page connexion se charge", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
});

test("le menu compte est visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("Compte utilisateur")).toBeVisible();
});

test("la page espace client est protégée", async ({ page }) => {
  await page.goto("/espace-client");
  await expect(page).toHaveURL(/\/login/);
});
