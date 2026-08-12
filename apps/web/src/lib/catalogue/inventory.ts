import type { StaffRole } from "@/lib/commerce/roles";

export type InventorySnapshot = {
  mode: "tracked" | "one_of_a_kind" | "made_to_order" | "pre_order";
  onHand: number;
  reserved: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
};

export type InventoryAdjustment = {
  quantityDelta: number;
  reason: string;
  role: StaffRole;
};

export function availableQuantity(snapshot: InventorySnapshot) {
  return Math.max(0, snapshot.onHand - snapshot.reserved);
}

export function isSellable(snapshot: InventorySnapshot) {
  if (snapshot.mode === "made_to_order" || snapshot.mode === "pre_order") return true;
  return snapshot.allowBackorder || availableQuantity(snapshot) > 0;
}

export function isLowStock(snapshot: InventorySnapshot) {
  return ["tracked", "one_of_a_kind"].includes(snapshot.mode) && availableQuantity(snapshot) <= snapshot.lowStockThreshold;
}

export function applyInventoryAdjustment(snapshot: InventorySnapshot, adjustment: InventoryAdjustment) {
  if (!["owner", "manager", "fulfilment"].includes(adjustment.role)) {
    throw new Error("Your staff role cannot adjust inventory.");
  }

  if (!adjustment.reason.trim()) {
    throw new Error("Inventory adjustments require an audit reason.");
  }

  const nextOnHand = snapshot.onHand + adjustment.quantityDelta;
  if (!snapshot.allowBackorder && nextOnHand < snapshot.reserved) {
    throw new Error("This adjustment would reduce available stock below reserved quantity.");
  }

  return { ...snapshot, onHand: nextOnHand };
}
