import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { getDatabase } from "@/lib/db";
import { auditEvents, fulfilmentEvents, orders, payments, refunds, returnRequests } from "@/lib/db/schema";
import { approveRefund, requestPostPurchase, transitionFulfilment, transitionOrderStatus } from "./operations";
import { prepareSandboxRefundHandoff } from "@/lib/payments/refunds";

type OrdersDatabase = ReturnType<typeof getDatabase>;

async function createOrdersDatabase() {
  const client = new PGlite();
  const db = drizzle({ client, schema: { auditEvents, fulfilmentEvents, orders, payments, refunds, returnRequests } });
  await client.exec(`
    CREATE TABLE "order" (id uuid PRIMARY KEY, order_number varchar(40) NOT NULL UNIQUE, user_id text, checkout_attempt_id uuid, email varchar(320) NOT NULL, currency varchar(3) NOT NULL, order_status text NOT NULL, payment_status text NOT NULL, fulfilment_status text NOT NULL, post_purchase_status text NOT NULL, subtotal numeric(12,2) NOT NULL, discount_total numeric(12,2) NOT NULL DEFAULT 0, shipping_total numeric(12,2) NOT NULL DEFAULT 0, tax_total numeric(12,2) NOT NULL DEFAULT 0, grand_total numeric(12,2) NOT NULL, tax_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, delivery_address jsonb NOT NULL, billing_address jsonb, shipping_snapshot jsonb NOT NULL, promotion_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, notes text, confirmed_at timestamptz, cancelled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE payment (id uuid PRIMARY KEY, order_id uuid NOT NULL, checkout_attempt_id uuid, provider text NOT NULL, status text NOT NULL, amount numeric(12,2) NOT NULL, currency varchar(3) NOT NULL, provider_payment_id varchar(180), provider_reference varchar(180), idempotency_key varchar(128) NOT NULL UNIQUE, provider_payload jsonb NOT NULL DEFAULT '{}'::jsonb, paid_at timestamptz, failed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE fulfilment_event (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_id uuid NOT NULL, status text NOT NULL, tracking_number varchar(180), carrier varchar(120), note text, actor_user_id text, occurred_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE return_request (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_id uuid NOT NULL, order_item_id uuid, type text NOT NULL, status text NOT NULL DEFAULT 'requested', reason text NOT NULL, customer_note text, resolution_note text, requested_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz);
    CREATE TABLE refund (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_id uuid NOT NULL, payment_id uuid NOT NULL, status text NOT NULL DEFAULT 'requested', amount numeric(12,2) NOT NULL, currency varchar(3) NOT NULL, reason text NOT NULL, idempotency_key varchar(128) NOT NULL UNIQUE, provider_refund_id varchar(180), provider_payload jsonb NOT NULL DEFAULT '{}'::jsonb, request_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, requested_by_user_id text, approved_by_user_id text, approved_at timestamptz, completed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE audit_event (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, actor_user_id text, action text NOT NULL, subject_type text NOT NULL, subject_id text, outcome text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, occurred_at timestamptz NOT NULL DEFAULT now());
  `);
  return { db, serviceDb: db as unknown as OrdersDatabase, client };
}

async function seedOrder(db: Awaited<ReturnType<typeof createOrdersDatabase>>["db"]) {
  const orderId = randomUUID(); const paymentId = randomUUID();
  await db.insert(orders).values({ id: orderId, orderNumber: `ODH-${orderId.slice(0, 8)}`, email: "customer@example.com", currency: "INR", orderStatus: "confirmed", paymentStatus: "paid", fulfilmentStatus: "unfulfilled", postPurchaseStatus: "none", subtotal: "9200", grandTotal: "9200", taxSnapshot: {}, deliveryAddress: { countryCode: "IN" }, shippingSnapshot: {} });
  await db.insert(payments).values({ id: paymentId, orderId, provider: "razorpay", status: "paid", amount: "9200", currency: "INR", idempotencyKey: `payment-${paymentId}` });
  return { orderId, paymentId };
}

describe("persisted order operations", () => {
  const clients: PGlite[] = [];
  afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); });

  it("persists an allowed fulfilment transition, event and audit trail", async () => {
    const { db, serviceDb, client } = await createOrdersDatabase(); clients.push(client); const { orderId } = await seedOrder(db);
    const updated = await transitionFulfilment({ orderId, nextStatus: "in_production", note: "Handwork started" }, { db: serviceDb, access: { userId: "staff-1", role: "fulfilment", hasFreshStepUp: false } });
    expect(updated.fulfilmentStatus).toBe("in_production"); expect(await db.select().from(fulfilmentEvents)).toHaveLength(1);
    expect((await db.select().from(auditEvents))[0]?.action).toBe("order.fulfilment.transitioned");
  });

  it("persists a return request and reflects the customer post-purchase state on the order", async () => {
    const { db, serviceDb, client } = await createOrdersDatabase(); clients.push(client); const { orderId } = await seedOrder(db);
    const request = await requestPostPurchase({ orderId, type: "return_requested", reason: "The size does not fit correctly." }, { db: serviceDb, userId: "customer-1" });
    expect(request.type).toBe("return_requested"); expect((await db.select().from(returnRequests)).length).toBe(1);
    expect((await db.select().from(orders))[0]?.postPurchaseStatus).toBe("return_requested");
  });

  it("persists allowed staff order-state transitions and records the audit event", async () => {
    const { db, serviceDb, client } = await createOrdersDatabase(); clients.push(client); const { orderId } = await seedOrder(db);
    const updated = await transitionOrderStatus({ orderId, nextStatus: "completed", note: "All fulfilment steps complete." }, { db: serviceDb, access: { userId: "manager-1", role: "manager", hasFreshStepUp: false } });
    expect(updated.orderStatus).toBe("completed"); expect((await db.select().from(auditEvents))[0]?.action).toBe("order.status.transitioned");
  });

  it("persists an exchange request independently from a return request", async () => {
    const { db, serviceDb, client } = await createOrdersDatabase(); clients.push(client); const { orderId } = await seedOrder(db);
    const request = await requestPostPurchase({ orderId, type: "exchange_requested", reason: "The customer needs a larger size." }, { db: serviceDb, userId: "customer-2" });
    expect(request.type).toBe("exchange_requested"); expect((await db.select().from(orders))[0]?.postPurchaseStatus).toBe("exchange_requested");
  });

  it("persists one approved refund, creates its audit trail and reuses the idempotency key", async () => {
    const { db, serviceDb, client } = await createOrdersDatabase(); clients.push(client); const { orderId, paymentId } = await seedOrder(db);
    const input = { orderId, paymentId, amount: 9200, currency: "INR", reason: "Approved cancellation before dispatch.", idempotencyKey: "approved-refund-idempotency-001" };
    const first = await approveRefund(input, { db: serviceDb, access: { userId: "manager-1", role: "manager", hasFreshStepUp: true } });
    const repeated = await approveRefund(input, { db: serviceDb, access: { userId: "manager-1", role: "manager", hasFreshStepUp: true } });
    expect(first.reused).toBe(false); expect(repeated.reused).toBe(true); expect(await db.select().from(refunds)).toHaveLength(1);
    expect((await db.select().from(auditEvents))[0]?.action).toBe("refund.approved");
  });

  it("prepares a repeatable no-network sandbox refund handoff only from an approved refund", async () => {
    const { db, serviceDb, client } = await createOrdersDatabase(); clients.push(client); const { orderId, paymentId } = await seedOrder(db);
    const { refund } = await approveRefund({ orderId, paymentId, amount: 1200, currency: "INR", reason: "Approved return received.", idempotencyKey: "approved-sandbox-refund-handoff-001" }, { db: serviceDb, access: { userId: "manager-1", role: "manager", hasFreshStepUp: true } });
    const first = await prepareSandboxRefundHandoff(refund.id, { db: serviceDb });
    const repeated = await prepareSandboxRefundHandoff(refund.id, { db: serviceDb });
    expect(first).toEqual(repeated); expect(first.externalUrl).toBeNull(); expect(first.mode).toBe("sandbox");
    expect((await db.select().from(refunds))[0]?.status).toBe("approved");
  });

  it("rejects refund approval until the staff member completes a fresh second-factor challenge", async () => {
    const { db, serviceDb, client } = await createOrdersDatabase(); clients.push(client); const { orderId, paymentId } = await seedOrder(db);
    await expect(approveRefund({ orderId, paymentId, amount: 100, currency: "INR", reason: "Customer request accepted.", idempotencyKey: "refund-step-up-required-001" }, { db: serviceDb, access: { userId: "manager-1", role: "manager", hasFreshStepUp: false } })).rejects.toThrow("fresh second-factor");
    expect(await db.select().from(refunds)).toHaveLength(0);
  });

  it("rejects unauthorized fulfilment, order-state and refund mutations before writing business or audit records", async () => {
    const { db, serviceDb, client } = await createOrdersDatabase(); clients.push(client); const { orderId, paymentId } = await seedOrder(db);
    await expect(transitionFulfilment({ orderId, nextStatus: "in_production" }, { db: serviceDb, access: { userId: "support-1", role: "support", hasFreshStepUp: true } })).rejects.toThrow("support staff cannot perform orders:fulfil");
    await expect(transitionOrderStatus({ orderId, nextStatus: "completed" }, { db: serviceDb, access: { userId: "content-1", role: "content", hasFreshStepUp: true } })).rejects.toThrow("content staff cannot perform orders:write");
    await expect(approveRefund({ orderId, paymentId, amount: 100, currency: "INR", reason: "Customer request accepted.", idempotencyKey: "unauthorized-refund-attempt-001" }, { db: serviceDb, access: { userId: "support-1", role: "support", hasFreshStepUp: true } })).rejects.toThrow("support staff cannot perform refunds:approve");
    expect(await db.select().from(fulfilmentEvents)).toHaveLength(0); expect(await db.select().from(refunds)).toHaveLength(0); expect(await db.select().from(auditEvents)).toHaveLength(0);
  });
});
