import { describe, expect, it } from "vitest";
import { applyInventoryAdjustment, availableQuantity, isLowStock, isSellable } from "./inventory";

describe("inventory availability", () => {
  it("accounts for reserved stock before permitting sale", () => {
    const item = { mode: "tracked" as const, onHand: 3, reserved: 2, lowStockThreshold: 2, allowBackorder: false };
    expect(availableQuantity(item)).toBe(1);
    expect(isSellable(item)).toBe(true);
    expect(isLowStock(item)).toBe(true);
  });

  it("keeps made-to-order products sellable without ready stock", () => {
    const item = { mode: "made_to_order" as const, onHand: 0, reserved: 0, lowStockThreshold: 0, allowBackorder: false };
    expect(isSellable(item)).toBe(true);
  });

  it("blocks unaudited or invalid stock reductions", () => {
    const item = { mode: "tracked" as const, onHand: 1, reserved: 1, lowStockThreshold: 1, allowBackorder: false };
    expect(() => applyInventoryAdjustment(item, { quantityDelta: -1, reason: "", role: "fulfilment" })).toThrow("audit reason");
    expect(() => applyInventoryAdjustment(item, { quantityDelta: -1, reason: "damaged", role: "fulfilment" })).toThrow("below reserved");
  });

  it("records a valid manager adjustment without mutating the source snapshot", () => {
    const item = { mode: "tracked" as const, onHand: 4, reserved: 1, lowStockThreshold: 1, allowBackorder: false };
    expect(applyInventoryAdjustment(item, { quantityDelta: 2, reason: "stock count", role: "manager" })).toMatchObject({ onHand: 6 });
    expect(item.onHand).toBe(4);
  });
});
