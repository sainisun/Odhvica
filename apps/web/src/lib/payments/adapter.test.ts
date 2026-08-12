import { describe, expect, it } from "vitest";
import { createSandboxPaymentEvent, createSandboxPaymentHandoff, createSandboxRefundHandoff, verifySandboxPaymentEvent } from "./adapter";

const base = { eventId: "sandbox-event-0001", checkoutAttemptId: "00000000-0000-4000-8000-000000000001", provider: "razorpay" as const, providerPaymentId: "pay_sandbox_001", outcome: "paid" as const };

describe("sandbox payment adapters", () => {
  it("creates a no-network hosted-payment handoff for every supported provider", () => {
    for (const provider of ["razorpay", "stripe", "paypal"] as const) {
      const handoff = createSandboxPaymentHandoff({ checkoutAttemptId: base.checkoutAttemptId, provider, amount: 2500, currency: "INR" });
      expect(handoff.externalUrl).toBeNull(); expect(handoff.mode).toBe("sandbox");
    }
  });
  it("creates verifiable simulated webhook events and rejects tampering", () => {
    const event = createSandboxPaymentEvent(base); expect(verifySandboxPaymentEvent(event)).toBe(true);
    expect(verifySandboxPaymentEvent({ ...event, providerPaymentId: "tampered" })).toBe(false);
  });
  it("creates a no-network refund handoff", () => {
    expect(createSandboxRefundHandoff({ refundId: "refund_001", provider: "stripe", amount: 10, currency: "usd" }).externalUrl).toBeNull();
  });
});
