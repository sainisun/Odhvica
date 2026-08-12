import { describe, expect, it } from "vitest";
import { fulfilmentTransitionSchema, orderTransitionSchema, postPurchaseRequestSchema, refundRequestSchema } from "./operations";
import { can, requiresStepUp } from "@/lib/commerce/roles";

describe("protected order operation contracts", () => {
  it("allows fulfilment-shaped input but rejects incomplete post-purchase and refund requests", () => {
    expect(fulfilmentTransitionSchema.parse({ orderId: "00000000-0000-4000-8000-000000000001", nextStatus: "in_production" }).nextStatus).toBe("in_production");
    expect(orderTransitionSchema.parse({ orderId: "00000000-0000-4000-8000-000000000001", nextStatus: "completed" }).nextStatus).toBe("completed");
    expect(() => postPurchaseRequestSchema.parse({ orderId: "00000000-0000-4000-8000-000000000001", type: "return_requested", reason: "no" })).toThrow();
    expect(() => refundRequestSchema.parse({ orderId: "00000000-0000-4000-8000-000000000001", paymentId: "00000000-0000-4000-8000-000000000002", amount: 0, currency: "INR", reason: "refund please", idempotencyKey: "short" })).toThrow();
  });
  it("keeps refund approval permissioned and step-up-sensitive", () => {
    expect(can("manager", "refunds:approve")).toBe(true);
    expect(can("support", "refunds:approve")).toBe(false);
    expect(requiresStepUp("refunds:approve")).toBe(true);
  });
});
