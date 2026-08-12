import { can, type StaffRole } from "@/lib/commerce/roles";

export function canWriteCatalogue(role: StaffRole) {
  return can(role, "catalogue:write") || can(role, "content:write");
}

export function canAdjustInventory(role: StaffRole) {
  return can(role, "inventory:write");
}

export function assertCatalogueWritePermission(role: StaffRole) {
  if (!canWriteCatalogue(role)) {
    throw new Error("Your staff role cannot write catalogue data.");
  }
}

export function assertInventoryWritePermission(role: StaffRole) {
  if (!canAdjustInventory(role)) {
    throw new Error("Your staff role cannot adjust inventory.");
  }
}
