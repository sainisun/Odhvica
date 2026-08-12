import { describe, expect, it } from "vitest";
import { assertLiveAnalyticsConfiguration, createSafeCommerceAnalyticsEvent, getAnalyticsMode } from "./analytics";
import { canQueueMarketingMessage, canQueueOperationalMessage, marketingDeliveryMode } from "./policy";

describe("analytics and marketing boundary", () => {
  it("fails closed without live client-owned tracking identifiers", () => { expect(getAnalyticsMode({})).toBe("sandbox"); expect(() => assertLiveAnalyticsConfiguration({ ODHVICA_ANALYTICS_MODE: "live" })).toThrow("blocked"); });
  it("creates a safe purchase measurement event without personal or payment data", () => { const event = createSafeCommerceAnalyticsEvent({ event: "purchase", eventId: "purchase-measurement-001", orderId: "00000000-0000-4000-8000-000000000001", currency: "INR", value: 9200 }); expect(event).not.toHaveProperty("email"); expect(event).not.toHaveProperty("address"); });
  it("requires opt-in for marketing while retaining default operational eligibility", () => { expect(canQueueMarketingMessage({ marketingEmail: false, operationalEmail: true })).toBe(false); expect(canQueueOperationalMessage(undefined)).toBe(true); expect(marketingDeliveryMode()).toBe("sandbox"); });
});
