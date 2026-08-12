import type { Page } from "@playwright/test";

export async function startWithEmptyBrowserCart(page: Page) {
  await page.addInitScript(() => localStorage.removeItem("odhvica-browser-cart-v1"));
}
