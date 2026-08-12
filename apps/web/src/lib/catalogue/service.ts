import { and, eq, inArray, sql } from "drizzle-orm";
import { requireStaffAccess, type StaffAccess } from "@/lib/auth/admin-guard";
import { getDatabase } from "@/lib/db";
import {
  auditEvents,
  collections,
  inventoryItems,
  inventoryMovements,
  productAttributes,
  productCollections,
  productCustomisationFields,
  productMedia,
  productOptionValues,
  productOptions,
  productVariantOptionValues,
  productVariants,
  products,
} from "@/lib/db/schema";
import { assertCatalogueWritePermission, assertInventoryWritePermission } from "./permissions";
import { catalogueProductInputSchema, productDraftSchema, type CatalogueProductInput, type ProductDraft } from "./validation";

type CatalogueDatabase = ReturnType<typeof getDatabase>;

type ServiceOptions = {
  access?: StaffAccess;
  db?: CatalogueDatabase;
};

export class InventoryConflictError extends Error {
  constructor() {
    super("Inventory changed before this adjustment could be applied. Refresh the record and try again.");
    this.name = "InventoryConflictError";
  }
}

export async function createCatalogueDraft(input: ProductDraft, options: ServiceOptions = {}) {
  const actor = options.access ?? (await requireStaffAccess("catalogue:write"));
  assertCatalogueWritePermission(actor.role);
  const draft = productDraftSchema.parse(input);
  const db = options.db ?? getDatabase();

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

export async function createCatalogueProduct(input: CatalogueProductInput, options: ServiceOptions = {}) {
  const actor = options.access ?? (await requireStaffAccess("catalogue:write"));
  assertCatalogueWritePermission(actor.role);
  const payload = catalogueProductInputSchema.parse(input);
  const db = options.db ?? getDatabase();

  return db.transaction(async (tx) => {
    const [product] = await tx
      .insert(products)
      .values({
        title: payload.title,
        slug: payload.slug,
        productType: payload.productType,
        status: payload.publish ? "active" : "draft",
        description: payload.description,
        materialSummary: payload.materialSummary,
        careInstructions: payload.careInstructions,
        basePrice: String(payload.basePrice),
        currency: payload.currency,
        inventoryMode: payload.inventoryMode,
        leadTimeMinDays: payload.leadTimeMinDays,
        leadTimeMaxDays: payload.leadTimeMaxDays,
        publishedAt: payload.publish ? new Date() : undefined,
      })
      .returning();

    const selectedCollections = payload.collectionSlugs.length
      ? await tx.select({ id: collections.id }).from(collections).where(inArray(collections.slug, payload.collectionSlugs))
      : [];
    if (selectedCollections.length) {
      await tx.insert(productCollections).values(selectedCollections.map((collection, index) => ({ productId: product.id, collectionId: collection.id, sortOrder: index })));
    }

    if (payload.materialSummary) {
      await tx.insert(productAttributes).values({ productId: product.id, key: "material", value: payload.materialSummary, filterable: true });
    }

    const selections = payload.sizes.length ? payload.sizes : ["One size"];
    const [sizeOption] = await tx.insert(productOptions).values({ productId: product.id, name: "Size", position: 0 }).returning();
    for (const [position, size] of selections.entries()) {
      const [optionValue] = await tx.insert(productOptionValues).values({ optionId: sizeOption.id, value: size, position }).returning();
      const [variant] = await tx
        .insert(productVariants)
        .values({
          productId: product.id,
          sku: `${payload.skuPrefix ?? payload.slug.toUpperCase()}-${String(position + 1).padStart(2, "0")}`,
          title: size,
          optionSignature: `Size=${size}`,
          position,
        })
        .returning();
      await tx.insert(inventoryItems).values({
        variantId: variant.id,
        mode: payload.inventoryMode,
        onHand: payload.inventoryMode === "made_to_order" ? 0 : payload.initialOnHand,
        allowBackorder: payload.inventoryMode === "made_to_order" || payload.inventoryMode === "pre_order",
      });
      await tx.insert(productVariantOptionValues).values({ variantId: variant.id, optionValueId: optionValue.id });
    }

    if (payload.media.length) {
      await tx.insert(productMedia).values(payload.media.map((media, position) => ({
        productId: product.id,
        storageKey: media.storageKey,
        altText: media.altText,
        isPrimary: media.isPrimary || (position === 0 && !payload.media.some((item) => item.isPrimary)),
        position,
      })));
    }
    if (payload.customisationLabel) {
      await tx.insert(productCustomisationFields).values({
        productId: product.id,
        type: "long_text",
        label: payload.customisationLabel,
        required: payload.customisationRequired,
        instructions: "Add the details requested by the maker before checkout.",
      });
    }
    await tx.insert(auditEvents).values({
      actorUserId: actor.userId,
      action: "catalogue.product.persisted",
      subjectType: "product",
      subjectId: product.id,
      outcome: "success",
      metadata: { status: product.status, variants: selections.length, collections: selectedCollections.length },
    });
    return product;
  });
}

export type AtomicInventoryAdjustment = {
  inventoryItemId: string;
  expectedVersion: number;
  quantityDelta: number;
  reason: string;
  referenceType?: string;
  referenceId?: string;
};

export async function adjustInventoryAtomically(request: AtomicInventoryAdjustment, options: ServiceOptions = {}) {
  const actor = options.access ?? (await requireStaffAccess("inventory:write"));
  assertInventoryWritePermission(actor.role);

  if (!Number.isInteger(request.expectedVersion) || request.expectedVersion < 0) {
    throw new Error("Inventory adjustment requires a valid record version.");
  }

  if (!Number.isInteger(request.quantityDelta) || request.quantityDelta === 0 || !request.reason.trim()) {
    throw new Error("Inventory adjustment requires a non-zero quantity and audit reason.");
  }

  const db = options.db ?? getDatabase();

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
          sql`(${inventoryItems.allowBackorder} OR ${inventoryItems.onHand} + ${request.quantityDelta} >= ${inventoryItems.reserved})`,
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
