import { describe, expect, it } from "vitest";
import { can, requiresStepUp } from "./roles";

describe("staff permissions", () => {
  it("allows owners to access every permission", () => {
    expect(can("owner", "payments:configure")).toBe(true);
  });

  it("keeps fulfilment staff away from content changes", () => {
    expect(can("fulfilment", "content:write")).toBe(false);
  });

  it("allows managers to manage catalogue-adjacent inventory", () => {
    expect(can("manager", "inventory:write")).toBe(true);
  });

  it("allows designated content operators to moderate authentic customer reviews", () => {
    expect(can("content", "reviews:moderate")).toBe(true);
    expect(can("support", "reviews:moderate")).toBe(false);
  });

  it("limits production updates to operational roles", () => {
    expect(can("fulfilment", "production:write")).toBe(true);
    expect(can("support", "production:write")).toBe(false);
  });

  it("requires a fresh second factor for sensitive actions", () => {
    expect(requiresStepUp("refunds:approve")).toBe(true);
    expect(requiresStepUp("orders:fulfil")).toBe(false);
  });
});
