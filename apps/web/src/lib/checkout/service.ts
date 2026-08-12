import { and, eq, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { auditEvents, cartItems, carts, checkoutAttempts, inventoryItems, inventoryMovements, productCustomisationFields, productVariants, products } from "@/lib/db/schema";
import { checkoutAddressSchema, quoteCheckout, type CheckoutLine, type PromotionRule } from "./engine";
import type { PaymentGateway } from "@/lib/commerce/payment-routing";

type CommerceDatabase = ReturnType<typeof getDatabase>;

export const addCartItemSchema = z.object({
  cartId: z.string().uuid(),
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().positive().max(10),
  customisation: z.record(z.string(), z.string().trim().max(1000)).default({}),
});

export type ShippingMethodSnapshot = { id: string; label: string; total: number; estimatedTransitDays?: number };

export async function addCartItem(input: z.infer<typeof addCartItemSchema>, options: { db?: CommerceDatabase } = {}) {
  const payload = addCartItemSchema.parse(input);
  const db = options.db ?? getDatabase();
  return db.transaction(async (tx) => {
    const [cart] = await tx.select().from(carts).where(eq(carts.id, payload.cartId)).limit(1);
    if (!cart || cart.status !== "active") throw new Error("This cart is not available for editing.");
    const [sellable] = await tx
      .select({ product: products, variant: productVariants, inventory: inventoryItems })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .leftJoin(inventoryItems, eq(inventoryItems.variantId, productVariants.id))
      .where(and(eq(productVariants.id, payload.variantId), eq(products.id, payload.productId), eq(productVariants.active, true), eq(products.status, "active")))
      .limit(1);
    if (!sellable) throw new Error("This product variant is no longer available.");
    if (sellable.inventory && !sellable.inventory.allowBackorder && sellable.inventory.onHand - sellable.inventory.reserved < payload.quantity) throw new Error("Requested quantity is no longer available.");
    const requiredFields = await tx.select().from(productCustomisationFields).where(and(eq(productCustomisationFields.productId, payload.productId), eq(productCustomisationFields.required, true), eq(productCustomisationFields.active, true)));
    for (const field of requiredFields) {
      if (!payload.customisation[field.label]?.trim()) throw new Error(`${field.label} is required before adding this item.`);
    }
    const [item] = await tx.insert(cartItems).values(payload).returning();
    await tx.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id));
    return item;
  });
}

export async function buildCartLines(cartId: string, options: { db?: CommerceDatabase } = {}): Promise<CheckoutLine[]> {
  const db = options.db ?? getDatabase();
  const rows = await db
    .select({ item: cartItems, product: products, variant: productVariants })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .where(eq(cartItems.cartId, cartId));
  return rows.map(({ item, product, variant }) => ({
    cartItemId: item.id,
    title: product.title,
    variantTitle: variant.title,
    quantity: item.quantity,
    unitPrice: Number(product.basePrice) + Number(variant.priceAdjustment),
    inventoryMode: product.inventoryMode,
  }));
}

export async function beginCheckout(input: {
  cartId: string;
  idempotencyKey: string;
  currency: string;
  address: z.input<typeof checkoutAddressSchema>;
  shipping: ShippingMethodSnapshot;
  taxTotal: number;
  promotion?: PromotionRule;
  enabledGateways: readonly PaymentGateway[];
}, options: { db?: CommerceDatabase } = {}) {
  const db = options.db ?? getDatabase();
  const [existing] = await db.select().from(checkoutAttempts).where(eq(checkoutAttempts.idempotencyKey, input.idempotencyKey)).limit(1);
  if (existing) return { attempt: existing, reused: true };
  const lines = await buildCartLines(input.cartId, { db });
  const address = checkoutAddressSchema.parse(input.address);
  const quote = quoteCheckout({ lines, currency: input.currency, address, shippingTotal: input.shipping.total, taxTotal: input.taxTotal, promotion: input.promotion, enabledGateways: input.enabledGateways });
  const [attempt] = await db.transaction(async (tx) => {
    const [cart] = await tx.select().from(carts).where(eq(carts.id, input.cartId)).limit(1);
    if (!cart || cart.status !== "active") throw new Error("This cart cannot start checkout.");
    const created = await tx.insert(checkoutAttempts).values({
      cartId: input.cartId,
      idempotencyKey: input.idempotencyKey,
      status: "awaiting_payment",
      deliveryAddress: address,
      shippingMethod: input.shipping,
      pricingSnapshot: quote,
      routingSnapshot: quote.payment,
      selectedProvider: quote.payment.primary,
    }).returning();
    if (quote.stockReservationRequired) {
      const inventoryRows = await tx
        .select({ item: cartItems, inventory: inventoryItems })
        .from(cartItems)
        .leftJoin(inventoryItems, eq(cartItems.variantId, inventoryItems.variantId))
        .where(eq(cartItems.cartId, input.cartId));
      for (const { item, inventory } of inventoryRows) {
        if (!inventory || !["tracked", "one_of_a_kind"].includes(inventory.mode)) continue;
        const reserved = await tx.update(inventoryItems)
          .set({ reserved: sql`${inventoryItems.reserved} + ${item.quantity}`, version: sql`${inventoryItems.version} + 1`, updatedAt: new Date() })
          .where(and(eq(inventoryItems.id, inventory.id), eq(inventoryItems.version, inventory.version), or(eq(inventoryItems.allowBackorder, true), sql`(${inventoryItems.onHand} - ${inventoryItems.reserved}) >= ${item.quantity}`)))
          .returning();
        if (!reserved.length) throw new Error("Checkout inventory is no longer available. Please review your bag.");
        await tx.insert(inventoryMovements).values({ inventoryItemId: inventory.id, type: "reservation", quantityDelta: 0, reason: "Checkout attempt reservation", referenceType: "checkout_attempt", referenceId: created[0]!.id });
      }
    }
    await tx.update(carts).set({ status: "checkout_started", deliveryCountry: address.countryCode, updatedAt: new Date() }).where(eq(carts.id, cart.id));
    await tx.insert(auditEvents).values({ action: "checkout.attempt.created", subjectType: "checkout_attempt", subjectId: created[0]!.id, outcome: "success", metadata: { cartId: input.cartId, provider: quote.payment.primary, reservationRequired: quote.stockReservationRequired } });
    return created;
  });
  return { attempt, reused: false, quote };
}

export function createCheckoutIdempotencyKey(cartId: string, revision: number) {
  return `${cartId}:${revision}:${crypto.randomUUID()}`;
}
