import { and, eq, sql } from "drizzle-orm";
import { requireStaffAccess, type StaffAccess } from "@/lib/auth/admin-guard";
import { getDatabase } from "@/lib/db";
import { auditEvents, inventoryItems, inventoryMovements, products } from "@/lib/db/schema";
import { assertCatalogueWritePermission, assertInventoryWritePermission } from "./permissions";
import { productDraftSchema, type ProductDraft } from "./validation";

export class InventoryConflictError extends Error {
  constructor() {
    super("Inventory changed before this adjustment could be applied. Refresh the record and try again.");
    this.name = "InventoryConflictError";
  }
}

export async function createCatalogueDraft(input: ProductDraft, access?: StaffAccess) {
  const actor = access ?? (await requireStaffAccess("catalogue:write"));
  assertCatalogueWritePermission(actor.role);
  const draft = productDraftSchema.parse(input);
  const db = getDatabase();

  const [product] = await db
    .insert(products)
    .values({
      title: draft.title,
      slug: draft.slug,
      productType: draft.productType,
      inventoryMode: draft.inventoryMode,
      basePrice: String(draft.basePrice),
      currency: draft.currency,
      leadTimeMinDays: draft.leadTimeMinDays,
      leadTimeMaxDays: draft.leadTimeMaxDays,
    })
    .returning();

  await db.insert(auditEvents).values({
    actorUserId: actor.userId,
    action: "catalogue.product.created",
    subjectType: "product",
    subjectId: product.id,
    outcome: "success",
    metadata: { status: "draft" },
  });

  return product;
}

export type AtomicInventoryAdjustment = {
  inventoryItemId: string;
  expectedVersion: number;
  quantityDelta: number;
  reason: string;
  referenceType?: string;
  referenceId?: string;
};

export async function adjustInventoryAtomically(request: AtomicInventoryAdjustment, access?: StaffAccess) {
  const actor = access ?? (await requireStaffAccess("inventory:write"));
  assertInventoryWritePermission(actor.role);

  if (!Number.isInteger(request.expectedVersion) || request.expectedVersion < 0) {
    throw new Error("Inventory adjustment requires a valid record version.");
  }

  if (!Number.isInteger(request.quantityDelta) || request.quantityDelta === 0 || !request.reason.trim()) {
    throw new Error("Inventory adjustment requires a non-zero quantity and audit reason.");
  }

  const db = getDatabase();

  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(inventoryItems)
      .set({
        onHand: sql`${inventoryItems.onHand} + ${request.quantityDelta}`,
        version: sql`${inventoryItems.version} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(inventoryItems.id, request.inventoryItemId),
          eq(inventoryItems.version, request.expectedVersion),
          sql`${inventoryItems.allowBackorder} OR ${inventoryItems.onHand} + ${request.quantityDelta} >= ${inventoryItems.reserved}`,
        ),
      )
      .returning();

    if (!updated) {
      throw new InventoryConflictError();
    }

    await tx.insert(inventoryMovements).values({
      inventoryItemId: updated.id,
      type: "adjustment",
      quantityDelta: request.quantityDelta,
      reason: request.reason.trim(),
      referenceType: request.referenceType,
      referenceId: request.referenceId,
      actorUserId: actor.userId,
    });

    await tx.insert(auditEvents).values({
      actorUserId: actor.userId,
      action: "inventory.adjusted",
      subjectType: "inventory_item",
      subjectId: updated.id,
      outcome: "success",
      metadata: {
        quantityDelta: request.quantityDelta,
        previousVersion: request.expectedVersion,
        nextVersion: updated.version,
      },
    });

    return updated;
  });
}
