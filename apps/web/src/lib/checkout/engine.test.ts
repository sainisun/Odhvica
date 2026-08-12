import { describe, expect, it } from "vitest";
import { quoteCheckout } from "./engine";

const address = { recipientName: "Aarav Saini", phone: "+919999999999", line1: "14 Craft Lane", city: "Jaipur", postalCode: "302001", countryCode: "IN" };
const lines = [{ cartItemId: "cart-1", title: "Kantha Jacket", variantTitle: "M", quantity: 1, unitPrice: 9200, inventoryMode: "made_to_order" as const }];

describe("server-authoritative checkout quote", () => {
  it("routes an India/INR checkout only to Razorpay and calculates a percentage promotion", () => {
    const quote = quoteCheckout({ lines, currency: "INR", address, shippingTotal: 0, taxTotal: 0, enabledGateways: ["razorpay", "stripe"], promotion: { code: "WELCOME10", type: "percentage", value: 10, minimumSubtotal: 1000, active: true, stackable: false, usageCount: 0 } });
    expect(quote.payment).toEqual({ primary: "razorpay", eligible: ["razorpay"] });
    expect(quote.discountTotal).toBe(920);
    expect(quote.grandTotal).toBe(8280);
  });

  it("uses Stripe primary with PayPal as eligible international fallback", () => {
    const quote = quoteCheckout({ lines, currency: "USD", address: { ...address, countryCode: "US" }, shippingTotal: 35, taxTotal: 0, enabledGateways: ["stripe", "paypal"] });
    expect(quote.payment).toEqual({ primary: "stripe", eligible: ["stripe", "paypal"] });
    expect(quote.grandTotal).toBe(9235);
  });

  it("rejects an exhausted promotion before a payment attempt exists", () => {
    expect(() => quoteCheckout({ lines, currency: "INR", address, shippingTotal: 0, taxTotal: 0, enabledGateways: ["razorpay"], promotion: { code: "GONE", type: "fixed_amount", value: 500, minimumSubtotal: 0, active: true, stackable: false, usageLimit: 1, usageCount: 1 } })).toThrow("Promotion is not eligible");
  });
});
