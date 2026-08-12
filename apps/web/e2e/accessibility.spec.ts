import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { startWithEmptyBrowserCart } from "./helpers";

test("public storefront has no serious or critical axe violations in its main content", async ({ page }) => {
  await startWithEmptyBrowserCart(page);
  await page.goto("/");
  const results = await new AxeBuilder({ page }).include("main").analyze();
  const blocking = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});

test("product variant controls are keyboard-operable and the mobile layout does not overflow", async ({ page }) => {
  await startWithEmptyBrowserCart(page);
  await page.goto("/shop/kantha-edit-01");
  const variants = page.locator("fieldset").getByRole("button");
  expect(await variants.count()).toBeGreaterThan(1);
  await variants.nth(1).focus();
  await page.keyboard.press("Space");
  await expect(variants.nth(1)).toHaveAttribute("aria-pressed", "true");
  if (page.viewportSize()?.width && page.viewportSize()!.width <= 500) {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
