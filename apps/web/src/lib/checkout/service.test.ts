import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import type { getDatabase } from "@/lib/db";
import { auditEvents, cartItems, carts, checkoutAttempts, inventoryItems, inventoryMovements, productCustomisationFields, productVariants, products } from "@/lib/db/schema";
import { addCartItemSchema, beginCheckout, createCheckoutIdempotencyKey } from "./service";

type ServiceDatabase = ReturnType<typeof getDatabase>;

async function createCheckoutDatabase() {
  const client = new PGlite();
  const db = drizzle({ client, schema: { auditEvents, cartItems, carts, checkoutAttempts, inventoryItems, inventoryMovements, productCustomisationFields, productVariants, products } });
  await client.exec(`
    CREATE TABLE product (id uuid PRIMARY KEY, title text NOT NULL, slug varchar(180) NOT NULL, product_type text NOT NULL, status text NOT NULL, short_description text, description text, material_summary text, care_instructions text, variation_notice text, base_price numeric(12,2) NOT NULL, compare_at_price numeric(12,2), currency varchar(3) NOT NULL, inventory_mode text NOT NULL, lead_time_min_days integer, lead_time_max_days integer, low_stock_threshold integer NOT NULL DEFAULT 2, seo_title text, seo_description text, published_at timestamptz, archived_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE product_variant (id uuid PRIMARY KEY, product_id uuid NOT NULL, sku varchar(96) NOT NULL, title text NOT NULL, option_signature text NOT NULL, price_adjustment numeric(12,2) NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, weight_grams integer, position integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE inventory_item (id uuid PRIMARY KEY, variant_id uuid NOT NULL, mode text NOT NULL, on_hand integer NOT NULL, reserved integer NOT NULL DEFAULT 0, low_stock_threshold integer NOT NULL DEFAULT 2, allow_backorder boolean NOT NULL DEFAULT false, version integer NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE cart (id uuid PRIMARY KEY, user_id text, session_token varchar(160), email varchar(320), currency varchar(3) NOT NULL, delivery_country varchar(2), status text NOT NULL, promotion_code varchar(80), expires_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE cart_item (id uuid PRIMARY KEY, cart_id uuid NOT NULL, product_id uuid NOT NULL, variant_id uuid NOT NULL, quantity integer NOT NULL, customisation jsonb NOT NULL DEFAULT '{}'::jsonb, added_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE product_customisation_field (id uuid PRIMARY KEY, product_id uuid NOT NULL, variant_id uuid, type text NOT NULL, label text NOT NULL, instructions text, required boolean NOT NULL DEFAULT false, validation jsonb NOT NULL DEFAULT '{}'::jsonb, price_adjustment numeric(12,2) NOT NULL DEFAULT 0, lead_time_adjustment_days integer NOT NULL DEFAULT 0, position integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE checkout_attempt (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, cart_id uuid NOT NULL, idempotency_key varchar(128) NOT NULL UNIQUE, status text NOT NULL, delivery_address jsonb NOT NULL, billing_address jsonb, shipping_method jsonb NOT NULL, pricing_snapshot jsonb NOT NULL, routing_snapshot jsonb NOT NULL, selected_provider text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE inventory_movement (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, inventory_item_id uuid NOT NULL, type text NOT NULL, quantity_delta integer NOT NULL, reason text NOT NULL, reference_type text, reference_id text, actor_user_id text, occurred_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE audit_event (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, actor_user_id text, action text NOT NULL, subject_type text NOT NULL, subject_id text, outcome text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, occurred_at timestamptz NOT NULL DEFAULT now());
  `);
  return { db, serviceDb: db as unknown as ServiceDatabase, client };
}

async function seedCheckout(db: Awaited<ReturnType<typeof createCheckoutDatabase>>["db"], quantity = 1) {
  const productId = randomUUID(); const variantId = randomUUID(); const inventoryId = randomUUID(); const cartId = randomUUID();
  await db.insert(products).values({ id: productId, title: "Kantha Jacket", slug: `kantha-${productId.slice(0, 6)}`, productType: "variant", status: "active", basePrice: "9200", currency: "INR", inventoryMode: "tracked" });
  await db.insert(productVariants).values({ id: variantId, productId, sku: `SKU-${variantId.slice(0, 8)}`, title: "M", optionSignature: "size:M", priceAdjustment: "0" });
  await db.insert(inventoryItems).values({ id: inventoryId, variantId, mode: "tracked", onHand: 1, reserved: 0, version: 0 });
  await db.insert(carts).values({ id: cartId, currency: "INR", status: "active" });
  await db.insert(cartItems).values({ id: randomUUID(), cartId, productId, variantId, quantity, customisation: {} });
  return { cartId, inventoryId };
}

describe("cart and checkout service contracts", () => {
  const clients: PGlite[] = [];
  afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); });
  it("requires positive quantities and structured customisation data", () => {
    expect(() => addCartItemSchema.parse({ cartId: "not-a-uuid", productId: "x", variantId: "y", quantity: 0 })).toThrow();
  });

  it("creates distinct idempotency keys for repeated checkout starts", () => {
    const cartId = "00000000-0000-4000-8000-000000000001";
    expect(createCheckoutIdempotencyKey(cartId, 1)).not.toBe(createCheckoutIdempotencyKey(cartId, 1));
  });

  it("reserves stock once, records an audit trail and reuses an idempotent checkout attempt", async () => {
    const { db, serviceDb, client } = await createCheckoutDatabase(); clients.push(client);
    const { cartId, inventoryId } = await seedCheckout(db);
    const input = { cartId, idempotencyKey: "checkout-idempotency-1", currency: "INR", address: { recipientName: "Aarav Saini", phone: "+919999999999", line1: "14 Craft Lane", city: "Jaipur", postalCode: "302001", countryCode: "IN" }, shipping: { id: "standard", label: "Standard", total: 0 }, taxTotal: 0, enabledGateways: ["razorpay"] as const };
    const first = await beginCheckout(input, { db: serviceDb });
    expect(first.reused).toBe(false); expect(first.quote?.payment.primary).toBe("razorpay");
    const [reserved] = await db.select().from(inventoryItems); expect(reserved?.reserved).toBe(1); expect(reserved?.version).toBe(1);
    expect(await db.select().from(inventoryMovements)).toHaveLength(1); expect((await db.select().from(auditEvents))[0]?.action).toBe("checkout.attempt.created");
    const second = await beginCheckout(input, { db: serviceDb });
    expect(second.reused).toBe(true); expect(second.attempt.id).toBe(first.attempt.id);
    expect(await db.select().from(inventoryMovements)).toHaveLength(1); expect((await db.select().from(inventoryItems).where(eq(inventoryItems.id, inventoryId)))[0]?.reserved).toBe(1);
  });

  it("rolls back the checkout attempt when server-side reservation would oversell stock", async () => {
    const { db, serviceDb, client } = await createCheckoutDatabase(); clients.push(client);
    const { cartId } = await seedCheckout(db, 2);
    await expect(beginCheckout({ cartId, idempotencyKey: "checkout-idempotency-oversell", currency: "INR", address: { recipientName: "Aarav Saini", phone: "+919999999999", line1: "14 Craft Lane", city: "Jaipur", postalCode: "302001", countryCode: "IN" }, shipping: { id: "standard", label: "Standard", total: 0 }, taxTotal: 0, enabledGateways: ["razorpay"] }, { db: serviceDb })).rejects.toThrow("inventory is no longer available");
    expect(await db.select().from(checkoutAttempts)).toHaveLength(0); expect(await db.select().from(inventoryMovements)).toHaveLength(0);
  });
});
