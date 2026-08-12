import { expect, test } from "@playwright/test";

test("staff and customer account routes fail closed without a session", async ({ request }) => {
  for (const path of ["/admin/orders", "/admin/production", "/account"]) {
    const response = await request.get(path);
    expect(response.status(), `${path} must not expose a successful protected page to an unauthenticated browser`).toBeGreaterThanOrEqual(400);
  }
});
