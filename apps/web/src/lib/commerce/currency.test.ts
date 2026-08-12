import { describe, expect, it } from "vitest";
import { assertSupportedDisplayCurrency, displayMinorUnits, formatDisplayCurrency, preserveAuthoritativeCurrency } from "./currency";

describe("currency display policy", () => {
  it("formats supported currencies without changing the authoritative currency", () => { expect(formatDisplayCurrency(1250, "INR")).toContain("1,250"); expect(preserveAuthoritativeCurrency({ currency: "usd", total: 100 })).toEqual({ currency: "USD", total: 100 }); });
  it("uses zero decimals for JPY and rejects unsupported display currencies", () => { expect(displayMinorUnits("JPY")).toBe(0); expect(() => assertSupportedDisplayCurrency("BTC")).toThrow("Unsupported display currency"); });
});
