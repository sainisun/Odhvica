import { expect, test } from "@playwright/test";
import { startWithEmptyBrowserCart } from "./helpers";

test.beforeEach(async ({ page }) => { await startWithEmptyBrowserCart(page); });

test("visitor can discover products through the storefront search", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Made slowly. Worn often." })).toBeVisible();
  await page.getByRole("link", { name: "Explore the edit" }).click();
  await expect(page).toHaveURL(/\/shop$/);
  const search = page.getByRole("textbox", { name: "Search handmade products" });
  await search.fill("no matching textile");
  await expect(page.getByText("No pieces found")).toBeVisible();
  await search.fill("kantha");
  await expect(page.getByRole("link", { name: /Kantha/i }).first()).toBeVisible();
});

test("public home has one primary heading and named desktop navigation controls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chromium", "Mobile navigation is covered by the dedicated responsive shopper journey.");
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("navigation").getByRole("link", { name: /Shop/i })).toBeVisible();
  const loadDuration = await page.evaluate(() => performance.getEntriesByType("navigation")[0]?.duration ?? 0);
  expect(loadDuration).toBeLessThan(10_000);
});
