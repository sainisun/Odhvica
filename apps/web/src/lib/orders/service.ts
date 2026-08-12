import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { auditEvents, cartItems, carts, checkoutAttempts, fulfilmentEvents, inventoryItems, inventoryMovements, orderItems, orders, payments, productVariants, products } from "@/lib/db/schema";

type CommerceDatabase = ReturnType<typeof getDatabase>;

const pricingSnapshotSchema = z.object({
  currency: z.string().length(3),
  subtotal: z.number().nonnegative(),
  discountTotal: z.number().nonnegative(),
  shippingTotal: z.number().nonnegative(),
  taxTotal: z.number().nonnegative(),
  grandTotal: z.number().nonnegative(),
});

export const verifiedPaymentSchema = z.object({
  checkoutAttemptId: z.string().uuid(),
  provider: z.enum(["razorpay", "stripe", "paypal"]),
  providerPaymentId: z.string().trim().min(4).max(180),
  providerReference: z.string().trim().max(180).optional(),
  idempotencyKey: z.string().trim().min(12).max(128),
});

export function createOrderNumber(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `ODH-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * This function accepts only a payment confirmation that was already verified by
 * a provider-specific webhook adapter. Browser redirect/query data must never call it.
 */
export async function confirmVerifiedPayment(input: z.infer<typeof verifiedPaymentSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = verifiedPaymentSchema.parse(input);
  const db = options.db ?? getDatabase();
  return db.transaction(async (tx) => {
    const [existingOrder] = await tx.select().from(orders).where(eq(orders.checkoutAttemptId, payload.checkoutAttemptId)).limit(1);
    if (existingOrder) return { order: existingOrder, reused: true };

    const [attempt] = await tx.select().from(checkoutAttempts).where(eq(checkoutAttempts.id, payload.checkoutAttemptId)).limit(1);
    if (!attempt || attempt.status !== "awaiting_payment") throw new Error("Checkout attempt cannot be confirmed.");
    if (attempt.selectedProvider !== payload.provider) throw new Error("Payment provider does not match the selected checkout route.");
    const [cart] = await tx.select().from(carts).where(eq(carts.id, attempt.cartId)).limit(1);
    if (!cart || !cart.email) throw new Error("Checkout customer email is required before confirmation.");
    const pricing = pricingSnapshotSchema.parse(attempt.pricingSnapshot);
    const lines = await tx.select({ item: cartItems, product: products, variant: productVariants, inventory: inventoryItems })
      .from(cartItems).innerJoin(products, eq(cartItems.productId, products.id)).innerJoin(productVariants, eq(cartItems.variantId, productVariants.id)).leftJoin(inventoryItems, eq(cartItems.variantId, inventoryItems.variantId)).where(eq(cartItems.cartId, cart.id));
    if (!lines.length) throw new Error("Checkout cart has no lines to confirm.");
    const [order] = await tx.insert(orders).values({
      orderNumber: createOrderNumber(options.now), userId: cart.userId, checkoutAttemptId: attempt.id, email: cart.email, currency: pricing.currency,
      orderStatus: "confirmed", paymentStatus: "paid", fulfilmentStatus: "unfulfilled", postPurchaseStatus: "none",
      subtotal: String(pricing.subtotal), discountTotal: String(pricing.discountTotal), shippingTotal: String(pricing.shippingTotal), taxTotal: String(pricing.taxTotal), grandTotal: String(pricing.grandTotal),
      taxSnapshot: {}, deliveryAddress: attempt.deliveryAddress, billingAddress: attempt.billingAddress, shippingSnapshot: attempt.shippingMethod, promotionSnapshot: { code: cart.promotionCode }, confirmedAt: options.now ?? new Date(),
    }).returning();
    for (const line of lines) {
      await tx.insert(orderItems).values({ orderId: order.id, productId: line.product.id, variantId: line.variant.id, productSnapshot: { title: line.product.title, slug: line.product.slug, variantTitle: line.variant.title, sku: line.variant.sku, material: line.product.materialSummary, leadTimeMinDays: line.product.leadTimeMinDays, leadTimeMaxDays: line.product.leadTimeMaxDays }, customisationSnapshot: line.item.customisation, quantity: line.item.quantity, unitPrice: String(Number(line.product.basePrice) + Number(line.variant.priceAdjustment)), taxSnapshot: {} });
      if (line.inventory && ["tracked", "one_of_a_kind"].includes(line.inventory.mode)) {
        const consumed = await tx.update(inventoryItems).set({ onHand: sql`${inventoryItems.onHand} - ${line.item.quantity}`, reserved: sql`${inventoryItems.reserved} - ${line.item.quantity}`, version: sql`${inventoryItems.version} + 1`, updatedAt: options.now ?? new Date() })
          .where(and(eq(inventoryItems.id, line.inventory.id), gte(inventoryItems.reserved, line.item.quantity), gte(inventoryItems.onHand, line.item.quantity))).returning();
        if (!consumed.length) throw new Error("Reserved inventory could not be consumed for this payment confirmation.");
        await tx.insert(inventoryMovements).values({ inventoryItemId: line.inventory.id, type: "sale", quantityDelta: -line.item.quantity, reason: "Verified payment confirmation", referenceType: "order", referenceId: order.id });
      }
    }
    await tx.insert(payments).values({ orderId: order.id, checkoutAttemptId: attempt.id, provider: payload.provider, status: "paid", amount: String(pricing.grandTotal), currency: pricing.currency, providerPaymentId: payload.providerPaymentId, providerReference: payload.providerReference, idempotencyKey: payload.idempotencyKey, paidAt: options.now ?? new Date() });
    await tx.insert(fulfilmentEvents).values({ orderId: order.id, status: "unfulfilled", note: "Order confirmed after verified payment." });
    await tx.update(checkoutAttempts).set({ status: "completed", updatedAt: options.now ?? new Date() }).where(eq(checkoutAttempts.id, attempt.id));
    await tx.update(carts).set({ status: "converted", updatedAt: options.now ?? new Date() }).where(eq(carts.id, cart.id));
    await tx.insert(auditEvents).values({ action: "order.payment.confirmed", subjectType: "order", subjectId: order.id, outcome: "success", metadata: { checkoutAttemptId: attempt.id, provider: payload.provider, providerPaymentId: payload.providerPaymentId } });
    return { order, reused: false };
  });
}
