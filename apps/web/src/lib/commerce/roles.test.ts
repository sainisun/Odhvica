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

  it("requires a fresh second factor for sensitive actions", () => {
    expect(requiresStepUp("refunds:approve")).toBe(true);
    expect(requiresStepUp("orders:fulfil")).toBe(false);
  });
});
