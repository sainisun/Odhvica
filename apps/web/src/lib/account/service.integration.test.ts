import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { getDatabase } from "@/lib/db";
import { customerAddresses, notificationPreferences, orders, privacyRequests, users } from "@/lib/db/schema";
import { listAccountAddresses, listAccountOrders, removeAccountAddress, saveAccountAddress, submitPrivacyRequest, updateAccountPreferences } from "./service";

type CommerceDatabase = ReturnType<typeof getDatabase>;

async function createAccountDatabase() {
  const client = new PGlite(); const db = drizzle({ client, schema: { customerAddresses, notificationPreferences, orders, privacyRequests, users } });
  await client.exec(`
    CREATE TABLE "user" (id text PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE, email_verified boolean NOT NULL DEFAULT false, image text, two_factor_enabled boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE customer_address (id uuid PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000001'::uuid, user_id text, label varchar(80), recipient_name text NOT NULL, phone varchar(32) NOT NULL, line_1 text NOT NULL, line_2 text, city varchar(120) NOT NULL, region varchar(120), postal_code varchar(32) NOT NULL, country_code varchar(2) NOT NULL, tax_id varchar(32), default_shipping boolean NOT NULL DEFAULT false, default_billing boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE notification_preference (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, user_id text, email varchar(320) NOT NULL, operational_email boolean NOT NULL DEFAULT true, marketing_email boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE privacy_request (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, user_id text NOT NULL, type text NOT NULL, status text NOT NULL DEFAULT 'requested', requester_email_snapshot varchar(320) NOT NULL, details text, idempotency_key varchar(128) NOT NULL UNIQUE, resolution_note text, requested_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz);
    CREATE TABLE "order" (id uuid PRIMARY KEY, order_number varchar(40) NOT NULL UNIQUE, user_id text, checkout_attempt_id uuid, email varchar(320) NOT NULL, currency varchar(3) NOT NULL, order_status text NOT NULL, payment_status text NOT NULL, fulfilment_status text NOT NULL, post_purchase_status text NOT NULL, subtotal numeric(12,2) NOT NULL, discount_total numeric(12,2) NOT NULL DEFAULT 0, shipping_total numeric(12,2) NOT NULL DEFAULT 0, tax_total numeric(12,2) NOT NULL DEFAULT 0, grand_total numeric(12,2) NOT NULL, tax_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, delivery_address jsonb NOT NULL, billing_address jsonb, shipping_snapshot jsonb NOT NULL, promotion_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, notes text, confirmed_at timestamptz, cancelled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
  `);
  return { db, serviceDb: db as unknown as CommerceDatabase, client };
}

const address = { label: "Home", recipientName: "Aarav Saini", phone: "+919999999999", line1: "14 Craft Lane", city: "Jaipur", postalCode: "302001", countryCode: "in", defaultShipping: true, defaultBilling: true };

describe("customer account services", () => {
  const clients: PGlite[] = []; afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); });
  it("keeps saved addresses scoped to their authenticated owner", async () => {
    const { db, serviceDb, client } = await createAccountDatabase(); clients.push(client); const userId = "customer-1"; await db.insert(users).values([{ id: userId, name: "Aarav", email: "aarav@example.com" }, { id: "customer-2", name: "Mira", email: "mira@example.com" }]);
    const saved = await saveAccountAddress(userId, address, { db: serviceDb }); expect(saved.countryCode).toBe("IN"); expect(await listAccountAddresses(userId, { db: serviceDb })).toHaveLength(1);
    await expect(saveAccountAddress("customer-2", { ...address, id: saved.id, label: "Other" }, { db: serviceDb })).rejects.toThrow("not found for this customer account");
    await expect(removeAccountAddress("customer-2", saved.id, { db: serviceDb })).rejects.toThrow("not found for this customer account");
  });
  it("persists account communication choices and idempotent owner-scoped privacy requests", async () => {
    const { db, serviceDb, client } = await createAccountDatabase(); clients.push(client); await db.insert(users).values({ id: "customer-1", name: "Aarav", email: "aarav@example.com" });
    const preference = await updateAccountPreferences("customer-1", "AARAV@example.com", { operationalEmail: true, marketingEmail: false }, { db: serviceDb }); expect(preference.email).toBe("aarav@example.com");
    const request = { type: "access" as const, details: "Please prepare my account export.", idempotencyKey: "privacy-request-access-001" }; const first = await submitPrivacyRequest("customer-1", "aarav@example.com", request, { db: serviceDb }); const repeated = await submitPrivacyRequest("customer-1", "aarav@example.com", request, { db: serviceDb });
    expect(first.reused).toBe(false); expect(repeated.reused).toBe(true); expect(await db.select().from(privacyRequests)).toHaveLength(1);
  });
  it("returns only the authenticated customer order history and excludes address/payment payloads", async () => {
    const { db, serviceDb, client } = await createAccountDatabase(); clients.push(client); const first = randomUUID(); const second = randomUUID();
    await db.insert(orders).values([{ id: first, orderNumber: "ODH-100", userId: "customer-1", email: "a@example.com", currency: "INR", orderStatus: "confirmed", paymentStatus: "paid", fulfilmentStatus: "unfulfilled", postPurchaseStatus: "none", subtotal: "9200", grandTotal: "9200", taxSnapshot: {}, deliveryAddress: { line1: "private" }, shippingSnapshot: {} }, { id: second, orderNumber: "ODH-101", userId: "customer-2", email: "b@example.com", currency: "INR", orderStatus: "confirmed", paymentStatus: "paid", fulfilmentStatus: "unfulfilled", postPurchaseStatus: "none", subtotal: "5000", grandTotal: "5000", taxSnapshot: {}, deliveryAddress: { line1: "private" }, shippingSnapshot: {} }]);
    const history = await listAccountOrders("customer-1", { db: serviceDb }); expect(history).toHaveLength(1); expect(history[0]?.orderNumber).toBe("ODH-100"); expect(history[0]).not.toHaveProperty("deliveryAddress");
  });
});
