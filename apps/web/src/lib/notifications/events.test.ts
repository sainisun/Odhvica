import { describe, expect, it, vi } from "vitest";
import { notifyFulfilmentUpdated, notifyOrderConfirmed, notifyPaymentFailed, notifyRefundApproved, notifyStaffAlert } from "./events";
import { deliverSandboxNotification } from "./service";

vi.mock("./service", () => ({ deliverSandboxNotification: vi.fn(async (input) => ({ notification: input, reused: false })) }));

const identifiers = { recipientEmail: "customer@example.com", orderId: "00000000-0000-4000-8000-000000000001", paymentId: "00000000-0000-4000-8000-000000000002", refundId: "00000000-0000-4000-8000-000000000003" };

describe("notification event dispatchers", () => {
  it("maps order, payment, fulfilment and refund events to safe transactional payloads", async () => {
    await notifyOrderConfirmed({ ...identifiers, idempotencyKey: "notification-order-confirmed-001", orderNumber: "ODH-001", grandTotal: 9200, currency: "INR" });
    await notifyPaymentFailed({ ...identifiers, idempotencyKey: "notification-payment-failed-001", orderNumber: "ODH-001" });
    await notifyFulfilmentUpdated({ ...identifiers, idempotencyKey: "notification-fulfilment-001", orderNumber: "ODH-001", status: "shipped", trackingReference: "TRACK-001" });
    await notifyRefundApproved({ ...identifiers, idempotencyKey: "notification-refund-approved-001", orderNumber: "ODH-001", amount: 1200, currency: "INR" });
    const calls = vi.mocked(deliverSandboxNotification).mock.calls.map(([input]) => input.template.event);
    expect(calls).toEqual(["order_confirmed", "payment_failed", "fulfilment_updated", "refund_approved"]);
  });
  it("maps minimal operational staff alerts without customer transaction data", async () => {
    await notifyStaffAlert({ recipientEmail: "staff@example.com", idempotencyKey: "notification-staff-alert-001", title: "Low stock", summary: "A jacket is nearly sold out." });
    expect(vi.mocked(deliverSandboxNotification).mock.calls.at(-1)?.[0].template).toEqual({ event: "staff_alert", data: { title: "Low stock", summary: "A jacket is nearly sold out." } });
  });
});
