import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { getDatabase } from "@/lib/db";
import { notificationDeliveryAttempts, notificationPreferences, notifications } from "@/lib/db/schema";
import { deliverSandboxNotification } from "./service";
import { notifyFulfilmentUpdated, notifyOrderConfirmed, notifyPaymentFailed, notifyRefundApproved } from "./events";

type CommerceDatabase = ReturnType<typeof getDatabase>;

async function createNotificationDatabase() {
  const client = new PGlite();
  const db = drizzle({ client, schema: { notificationDeliveryAttempts, notificationPreferences, notifications } });
  await client.exec(`
    CREATE TABLE notification_preference (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, user_id text, email varchar(320) NOT NULL, operational_email boolean NOT NULL DEFAULT true, marketing_email boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE notification (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, channel text NOT NULL, delivery_class text NOT NULL, event text NOT NULL, status text NOT NULL, user_id text, recipient_email varchar(320) NOT NULL, masked_recipient varchar(320) NOT NULL, order_id uuid, payment_id uuid, refund_id uuid, idempotency_key varchar(128) NOT NULL UNIQUE, payload_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE notification_delivery_attempt (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, notification_id uuid NOT NULL, outcome text NOT NULL, provider varchar(48) NOT NULL DEFAULT 'sandbox', provider_message_id varchar(180), masked_recipient varchar(320) NOT NULL, error_code varchar(80), attempted_at timestamptz NOT NULL DEFAULT now());
  `);
  return { db, serviceDb: db as unknown as CommerceDatabase, client };
}

describe("sandbox notification delivery", () => {
  const clients: PGlite[] = [];
  afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); });

  it("delivers mandatory transactional email once with a masked recipient and deterministic sandbox identifier", async () => {
    const { db, serviceDb, client } = await createNotificationDatabase(); clients.push(client);
    const input = { recipientEmail: "customer@example.com", idempotencyKey: "transactional-notification-001", template: { event: "order_confirmed" as const, data: { orderNumber: "ODH-001", grandTotal: 9200, currency: "INR" } } };
    const first = await deliverSandboxNotification(input, { db: serviceDb }); const repeated = await deliverSandboxNotification(input, { db: serviceDb });
    expect(first.notification.status).toBe("sandbox_delivered"); expect(first.notification.maskedRecipient).toBe("c•••••••@example.com"); expect(repeated.reused).toBe(true);
    const [attempt] = await db.select().from(notificationDeliveryAttempts); expect(attempt?.providerMessageId).toMatch(/^sandbox_email_/); expect(await db.select().from(notifications)).toHaveLength(1);
  });

  it("suppresses preference-controlled operational mail and records a safe delivery attempt", async () => {
    const { db, serviceDb, client } = await createNotificationDatabase(); clients.push(client);
    await db.insert(notificationPreferences).values({ email: "staff@example.com", operationalEmail: false, marketingEmail: false });
    const result = await deliverSandboxNotification({ recipientEmail: "staff@example.com", idempotencyKey: "operational-notification-001", template: { event: "staff_alert", data: { title: "Low stock", summary: "One jacket remains." } } }, { db: serviceDb });
    expect(result.notification.status).toBe("suppressed"); expect((await db.select().from(notificationDeliveryAttempts))[0]?.outcome).toBe("suppressed");
  });

  it("records a simulated failed delivery without any external email call", async () => {
    const { db, serviceDb, client } = await createNotificationDatabase(); clients.push(client);
    const result = await deliverSandboxNotification({ recipientEmail: "buyer@example.com", idempotencyKey: "failed-notification-001", sandboxOutcome: "fail", template: { event: "payment_failed", data: { orderNumber: "ODH-002" } } }, { db: serviceDb });
    expect(result.notification.status).toBe("failed"); const [attempt] = await db.select().from(notificationDeliveryAttempts); expect(attempt?.errorCode).toBe("sandbox_forced_failure"); expect(attempt?.providerMessageId).toBeNull();
  });

  it("persists order, payment, fulfilment and refund dispatcher events with delivery attempts", async () => {
    const { db, serviceDb, client } = await createNotificationDatabase(); clients.push(client);
    const ids = { recipientEmail: "customer@example.com", orderId: "00000000-0000-4000-8000-000000000001", paymentId: "00000000-0000-4000-8000-000000000002", refundId: "00000000-0000-4000-8000-000000000003" };
    await notifyOrderConfirmed({ ...ids, idempotencyKey: "persist-order-notification-001", orderNumber: "ODH-001", grandTotal: 9200, currency: "INR" }, { db: serviceDb });
    await notifyPaymentFailed({ ...ids, idempotencyKey: "persist-payment-notification-001", orderNumber: "ODH-001" }, { db: serviceDb });
    await notifyFulfilmentUpdated({ ...ids, idempotencyKey: "persist-fulfilment-notification-001", orderNumber: "ODH-001", status: "shipped" }, { db: serviceDb });
    await notifyRefundApproved({ ...ids, idempotencyKey: "persist-refund-notification-001", orderNumber: "ODH-001", amount: 1200, currency: "INR" }, { db: serviceDb });
    const persisted = await db.select().from(notifications); const attempts = await db.select().from(notificationDeliveryAttempts);
    expect(persisted.map((notification) => notification.event)).toEqual(["order_confirmed", "payment_failed", "fulfilment_updated", "refund_approved"]);
    expect(persisted.every((notification) => notification.status === "sandbox_delivered" && notification.maskedRecipient === "c•••••••@example.com")).toBe(true); expect(attempts).toHaveLength(4);
  });
});
