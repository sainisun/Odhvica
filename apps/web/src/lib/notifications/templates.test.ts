import { describe, expect, it } from "vitest";
import { renderNotificationTemplate } from "./templates";

describe("notification templates", () => {
  it("renders transactional order confirmation without customer payment data", () => {
    const rendered = renderNotificationTemplate({ event: "order_confirmed", data: { orderNumber: "ODH-001", grandTotal: 9200, currency: "INR" } });
    expect(rendered.deliveryClass).toBe("transactional"); expect(rendered.subject).toContain("ODH-001");
  });
  it("renders operational staff alert from minimal safe content", () => { expect(renderNotificationTemplate({ event: "staff_alert", data: { title: "Low stock", summary: "One Kantha jacket is left." } }).deliveryClass).toBe("operational"); });
});
