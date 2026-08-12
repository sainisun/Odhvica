import { expect, test } from "@playwright/test";
import { startWithEmptyBrowserCart } from "./helpers";

test.beforeEach(async ({ page }) => { await startWithEmptyBrowserCart(page); });

test("visitor can add a preview product and review sandbox payment routing without a charge", async ({ page }) => {
  await page.goto("/shop/kantha-edit-01");
  await expect(page.getByRole("heading").first()).toBeVisible();
  const variants = page.locator("fieldset").getByRole("button");
  expect(await variants.count()).toBeGreaterThan(1);
  const selectedVariant = variants.nth(1);
  const selectedVariantTitle = (await selectedVariant.innerText()).trim();
  await selectedVariant.click();
  await expect(selectedVariant).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(`Selected piece: ${selectedVariantTitle}`, { exact: false })).toBeVisible();
  const requiredDetails = page.locator("textarea");
  if (await requiredDetails.count()) await requiredDetails.fill("E2E sizing detail");
  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("status")).toHaveText("Saved to your bag in this browser.");
  await page.getByRole("link", { name: /Bag 1/ }).click();
  await expect(page.getByText(selectedVariantTitle, { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Continue to checkout" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("e2e@example.test");
  await page.getByRole("textbox", { name: "First and last name" }).fill("Test Customer");
  await page.getByRole("textbox", { name: "Phone" }).fill("0000000000");
  await page.getByRole("textbox", { name: "Address" }).fill("Test address");
  await page.getByRole("textbox", { name: "City" }).fill("Jaipur");
  await page.getByRole("textbox", { name: "Postal code" }).fill("302001");
  await page.getByRole("button", { name: "Review payment options" }).click();
  await expect(page.getByRole("status")).toContainText("no payment page opens");
  await expect(page.getByText("No charge will be created.")).toBeVisible();
});
