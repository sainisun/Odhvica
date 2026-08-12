import { describe, expect, it } from "vitest";
import { createOrderNumber, verifiedPaymentSchema } from "./service";

describe("verified payment order service contracts", () => {
  it("creates time-scoped, non-repeatable order numbers", () => {
    const date = new Date("2026-08-12T00:00:00.000Z");
    expect(createOrderNumber(date)).toMatch(/^ODH-20260812-[A-F0-9]{8}$/);
    expect(createOrderNumber(date)).not.toBe(createOrderNumber(date));
  });
  it("requires a provider verification identifier and idempotency key", () => {
    expect(() => verifiedPaymentSchema.parse({ checkoutAttemptId: "00000000-0000-4000-8000-000000000001", provider: "razorpay", providerPaymentId: "", idempotencyKey: "short" })).toThrow();
  });
});
