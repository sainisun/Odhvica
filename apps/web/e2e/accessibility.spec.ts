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
