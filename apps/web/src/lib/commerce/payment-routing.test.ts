import { describe, expect, it } from "vitest";
import { resolvePaymentRoute } from "./payment-routing";

describe("payment route resolution", () => {
  it("selects Razorpay only for eligible India and INR checkout", () => {
    expect(resolvePaymentRoute({ shippingCountry: "IN", currency: "INR", enabledGateways: ["razorpay", "stripe"] })).toEqual({
      primary: "razorpay",
      eligible: ["razorpay"],
    });
  });

  it("selects Stripe first for eligible international checkout and keeps PayPal available", () => {
    expect(resolvePaymentRoute({ shippingCountry: "US", currency: "USD", enabledGateways: ["stripe", "paypal"] })).toEqual({
      primary: "stripe",
      eligible: ["stripe", "paypal"],
    });
  });

  it("rejects checkout when no eligible gateway is enabled", () => {
    expect(() => resolvePaymentRoute({ shippingCountry: "DE", currency: "EUR", enabledGateways: ["razorpay"] })).toThrow(
      "No eligible payment gateway is enabled for this checkout.",
    );
  });
});
