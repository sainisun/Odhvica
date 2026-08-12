import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import type { getDatabase } from "@/lib/db";
import { auditEvents, cartItems, carts, checkoutAttempts, fulfilmentEvents, inventoryItems, inventoryMovements, orderItems, orders, payments, productVariants, products } from "@/lib/db/schema";
import { createSandboxPaymentEvent } from "./adapter";
import { processVerifiedSandboxPaymentEvent } from "./webhook";

type CommerceDatabase = ReturnType<typeof getDatabase>;

async function createPaymentDatabase() {
  const client = new PGlite();
  const db = drizzle({ client, schema: { auditEvents, cartItems, carts, checkoutAttempts, fulfilmentEvents, inventoryItems, inventoryMovements, orderItems, orders, payments, productVariants, products } });
  await client.exec(`
    CREATE TABLE product (id uuid PRIMARY KEY, title text NOT NULL, slug varchar(180) NOT NULL, product_type text NOT NULL, status text NOT NULL, short_description text, description text, material_summary text, care_instructions text, variation_notice text, base_price numeric(12,2) NOT NULL, compare_at_price numeric(12,2), currency varchar(3) NOT NULL, inventory_mode text NOT NULL, lead_time_min_days integer, lead_time_max_days integer, low_stock_threshold integer NOT NULL DEFAULT 2, seo_title text, seo_description text, published_at timestamptz, archived_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE product_variant (id uuid PRIMARY KEY, product_id uuid NOT NULL, sku varchar(96) NOT NULL, title text NOT NULL, option_signature text NOT NULL, price_adjustment numeric(12,2) NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, weight_grams integer, position integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE inventory_item (id uuid PRIMARY KEY, variant_id uuid NOT NULL, mode text NOT NULL, on_hand integer NOT NULL, reserved integer NOT NULL DEFAULT 0, low_stock_threshold integer NOT NULL DEFAULT 2, allow_backorder boolean NOT NULL DEFAULT false, version integer NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE cart (id uuid PRIMARY KEY, user_id text, session_token varchar(160), email varchar(320), currency varchar(3) NOT NULL, delivery_country varchar(2), status text NOT NULL, promotion_code varchar(80), expires_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE cart_item (id uuid PRIMARY KEY, cart_id uuid NOT NULL, product_id uuid NOT NULL, variant_id uuid NOT NULL, quantity integer NOT NULL, customisation jsonb NOT NULL DEFAULT '{}'::jsonb, added_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE checkout_attempt (id uuid PRIMARY KEY, cart_id uuid NOT NULL, idempotency_key varchar(128) NOT NULL UNIQUE, status text NOT NULL, delivery_address jsonb NOT NULL, billing_address jsonb, shipping_method jsonb NOT NULL, pricing_snapshot jsonb NOT NULL, routing_snapshot jsonb NOT NULL, selected_provider text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE "order" (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_number varchar(40) NOT NULL UNIQUE, user_id text, checkout_attempt_id uuid UNIQUE, email varchar(320) NOT NULL, currency varchar(3) NOT NULL, order_status text NOT NULL, payment_status text NOT NULL, fulfilment_status text NOT NULL, post_purchase_status text NOT NULL, subtotal numeric(12,2) NOT NULL, discount_total numeric(12,2) NOT NULL DEFAULT 0, shipping_total numeric(12,2) NOT NULL DEFAULT 0, tax_total numeric(12,2) NOT NULL DEFAULT 0, grand_total numeric(12,2) NOT NULL, tax_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, delivery_address jsonb NOT NULL, billing_address jsonb, shipping_snapshot jsonb NOT NULL, promotion_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, notes text, confirmed_at timestamptz, cancelled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE order_item (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_id uuid NOT NULL, product_id uuid, variant_id uuid, product_snapshot jsonb NOT NULL, customisation_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, quantity integer NOT NULL, unit_price numeric(12,2) NOT NULL, discount_total numeric(12,2) NOT NULL DEFAULT 0, tax_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE payment (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_id uuid NOT NULL, checkout_attempt_id uuid, provider text NOT NULL, status text NOT NULL, amount numeric(12,2) NOT NULL, currency varchar(3) NOT NULL, provider_payment_id varchar(180), provider_reference varchar(180), idempotency_key varchar(128) NOT NULL UNIQUE, provider_payload jsonb NOT NULL DEFAULT '{}'::jsonb, paid_at timestamptz, failed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE fulfilment_event (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_id uuid NOT NULL, status text NOT NULL, tracking_number varchar(180), carrier varchar(120), note text, actor_user_id text, occurred_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE inventory_movement (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, inventory_item_id uuid NOT NULL, type text NOT NULL, quantity_delta integer NOT NULL, reason text NOT NULL, reference_type text, reference_id text, actor_user_id text, occurred_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE audit_event (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, actor_user_id text, action text NOT NULL, subject_type text NOT NULL, subject_id text, outcome text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, occurred_at timestamptz NOT NULL DEFAULT now());
  `);
  return { db, serviceDb: db as unknown as CommerceDatabase, client };
}

async function seedAwaitingPayment(db: Awaited<ReturnType<typeof createPaymentDatabase>>["db"]) {
  const productId = randomUUID(); const variantId = randomUUID(); const inventoryId = randomUUID(); const cartId = randomUUID(); const checkoutAttemptId = randomUUID();
  await db.insert(products).values({ id: productId, title: "Kantha Jacket", slug: `kantha-${productId.slice(0, 6)}`, productType: "variant", status: "active", basePrice: "9200", currency: "INR", inventoryMode: "tracked" });
  await db.insert(productVariants).values({ id: variantId, productId, sku: `KJ-${variantId.slice(0, 8)}`, title: "M", optionSignature: "size:M", priceAdjustment: "0" });
  await db.insert(inventoryItems).values({ id: inventoryId, variantId, mode: "tracked", onHand: 1, reserved: 1, version: 1 });
  await db.insert(carts).values({ id: cartId, email: "buyer@example.com", currency: "INR", status: "active" });
  await db.insert(cartItems).values({ id: randomUUID(), cartId, productId, variantId, quantity: 1, customisation: {} });
  await db.insert(checkoutAttempts).values({ id: checkoutAttemptId, cartId, idempotencyKey: `checkout-${checkoutAttemptId}`, status: "awaiting_payment", deliveryAddress: { countryCode: "IN" }, shippingMethod: { id: "standard" }, pricingSnapshot: { currency: "INR", subtotal: 9200, discountTotal: 0, shippingTotal: 0, taxTotal: 0, grandTotal: 9200 }, routingSnapshot: { primary: "razorpay" }, selectedProvider: "razorpay" });
  return { cartId, checkoutAttemptId };
}

describe("sandbox verified payment webhook", () => {
  const clients: PGlite[] = [];
  afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); });

  it("confirms a signed paid event once and treats duplicate delivery as idempotent", async () => {
    const { db, serviceDb, client } = await createPaymentDatabase(); clients.push(client); const { checkoutAttemptId, cartId } = await seedAwaitingPayment(db);
    const event = createSandboxPaymentEvent({ eventId: "sandbox-webhook-payment-0001", checkoutAttemptId, provider: "razorpay", providerPaymentId: "pay_sandbox_001", outcome: "paid" });
    const first = await processVerifiedSandboxPaymentEvent(event, { db: serviceDb, now: new Date("2026-08-12T00:00:00.000Z") });
    const repeated = await processVerifiedSandboxPaymentEvent(event, { db: serviceDb, now: new Date("2026-08-12T00:00:00.000Z") });
    expect(first.status).toBe("confirmed"); expect(repeated.status).toBe("confirmed");
    if (first.status === "confirmed" && repeated.status === "confirmed") expect(repeated.confirmation.reused).toBe(true);
    expect(await db.select().from(orders)).toHaveLength(1); expect(await db.select().from(payments)).toHaveLength(1);
    expect((await db.select().from(carts).where(eq(carts.id, cartId)))[0]?.status).toBe("converted");
  });

  it("rejects invalid signatures and ignores simulated failed payments without creating orders", async () => {
    const { db, serviceDb, client } = await createPaymentDatabase(); clients.push(client); const { checkoutAttemptId } = await seedAwaitingPayment(db);
    const paid = createSandboxPaymentEvent({ eventId: "sandbox-webhook-invalid-0001", checkoutAttemptId, provider: "razorpay", providerPaymentId: "pay_sandbox_invalid", outcome: "paid" });
    await expect(processVerifiedSandboxPaymentEvent({ ...paid, signature: "a".repeat(64) }, { db: serviceDb })).rejects.toThrow("signature is invalid");
    const failed = createSandboxPaymentEvent({ eventId: "sandbox-webhook-failed-0001", checkoutAttemptId, provider: "razorpay", providerPaymentId: "pay_sandbox_failed", outcome: "failed" });
    await expect(processVerifiedSandboxPaymentEvent(failed, { db: serviceDb })).resolves.toMatchObject({ status: "ignored" });
    expect(await db.select().from(orders)).toHaveLength(0); expect(await db.select().from(payments)).toHaveLength(0);
  });
});
