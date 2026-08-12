import { expect, test } from "@playwright/test";

test("staff and customer account routes fail closed without a session", async ({ request }) => {
  const sensitiveMarkers: Record<string, string[]> = {
    "/account": ["Saved addresses", "Privacy requests", "Your account"],
    "/admin/orders": ["No orders have been created yet", "Order management"],
    "/admin/production": ["Production queue", "Ready to start"],
  };
  for (const path of Object.keys(sensitiveMarkers)) {
    const response = await request.get(path);
    expect(response.status(), `${path} must not expose a successful protected page to an unauthenticated browser`).toBeGreaterThanOrEqual(400);
    const body = await response.text();
    for (const marker of sensitiveMarkers[path]) expect(body, `${path} must not render protected workspace marker: ${marker}`).not.toContain(marker);
    expect(body).not.toContain("paymentId");
    expect(body).not.toContain("shippingAddress");
  }
});
