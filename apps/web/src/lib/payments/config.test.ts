import { describe, expect, it } from "vitest";
import { assertLiveProviderCredentials, getPaymentMode, getPublicProviderStatuses } from "./config";

describe("payment configuration", () => {
  it("defaults to enabled sandbox placeholders and does not expose secrets", () => {
    expect(getPaymentMode({})).toBe("sandbox");
    expect(getPublicProviderStatuses({}).map((status) => status.provider)).toEqual(["razorpay", "stripe", "paypal"]);
    expect(getPublicProviderStatuses({}).every((status) => status.activation === "sandbox_ready")).toBe(true);
  });
  it("fails closed when live activation has incomplete credentials", () => {
    expect(() => assertLiveProviderCredentials({ ODHVICA_PAYMENT_MODE: "live", RAZORPAY_KEY_ID: "id" })).toThrow("Live payment activation is blocked");
  });
});
