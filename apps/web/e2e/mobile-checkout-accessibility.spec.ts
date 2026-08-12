import { expect, test } from "@playwright/test";
import { startWithEmptyBrowserCart } from "./helpers";

test("mobile checkout required fields remain keyboard reachable and sandbox messaging fits the viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "This responsive checkout accessibility check runs only in mobile Chromium.");
  await startWithEmptyBrowserCart(page);
  await page.goto("/shop/kantha-edit-01");
  const variants = page.locator("fieldset").getByRole("button");
  await variants.nth(1).click();
  const customisation = page.locator("textarea");
  if (await customisation.count()) await customisation.fill("Accessible mobile checkout detail");
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("link", { name: /Bag 1/ }).click();
  await page.getByRole("link", { name: "Continue to checkout" }).click();
  const email = page.getByRole("textbox", { name: "Email" });
  await email.focus();
  await expect(email).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("textbox", { name: "First and last name" })).toBeFocused();
  await email.fill("checkout-mobile@example.test");
  await page.getByRole("textbox", { name: "First and last name" }).fill("Mobile Checkout");
  await page.getByRole("textbox", { name: "Phone" }).fill("0000000000");
  await page.getByRole("textbox", { name: "Address" }).fill("Accessible mobile address");
  await page.getByRole("textbox", { name: "City" }).fill("Jaipur");
  await page.getByRole("textbox", { name: "Postal code" }).fill("302001");
  await page.getByRole("button", { name: "Review payment options" }).click();
  await expect(page.getByText("No charge will be created.")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
