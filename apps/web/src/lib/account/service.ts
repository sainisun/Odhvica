import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { customerAddresses, notificationPreferences, orders, privacyRequests } from "@/lib/db/schema";

type CommerceDatabase = ReturnType<typeof getDatabase>;

const addressFields = {
  label: z.string().trim().max(80).optional(), recipientName: z.string().trim().min(2).max(160), phone: z.string().trim().min(6).max(32), line1: z.string().trim().min(3).max(240), line2: z.string().trim().max(240).optional(), city: z.string().trim().min(2).max(120), region: z.string().trim().max(120).optional(), postalCode: z.string().trim().min(3).max(32), countryCode: z.string().trim().length(2), taxId: z.string().trim().max(32).optional(), defaultShipping: z.boolean().default(false), defaultBilling: z.boolean().default(false),
};

export const saveAddressSchema = z.object({ id: z.string().uuid().optional(), ...addressFields });
export const preferenceSchema = z.object({ operationalEmail: z.boolean(), marketingEmail: z.boolean() });
export const privacyRequestSchema = z.object({ type: z.enum(["access", "erasure", "correction"]), details: z.string().trim().max(1000).optional(), idempotencyKey: z.string().trim().min(12).max(128) });

export async function listAccountAddresses(userId: string, options: { db?: CommerceDatabase } = {}) {
  const db = options.db ?? getDatabase();
  return db.select().from(customerAddresses).where(eq(customerAddresses.userId, userId)).orderBy(desc(customerAddresses.updatedAt));
}

export async function saveAccountAddress(userId: string, input: z.input<typeof saveAddressSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = saveAddressSchema.parse(input); const db = options.db ?? getDatabase(); const now = options.now ?? new Date();
  return db.transaction(async (tx) => {
    if (payload.id) {
      const [existing] = await tx.select().from(customerAddresses).where(and(eq(customerAddresses.id, payload.id), eq(customerAddresses.userId, userId))).limit(1);
      if (!existing) throw new Error("Address was not found for this customer account.");
    }
    if (payload.defaultShipping) await tx.update(customerAddresses).set({ defaultShipping: false, updatedAt: now }).where(eq(customerAddresses.userId, userId));
    if (payload.defaultBilling) await tx.update(customerAddresses).set({ defaultBilling: false, updatedAt: now }).where(eq(customerAddresses.userId, userId));
    const values = { ...payload, countryCode: payload.countryCode.toUpperCase(), userId, updatedAt: now };
    const [address] = payload.id ? await tx.update(customerAddresses).set(values).where(and(eq(customerAddresses.id, payload.id), eq(customerAddresses.userId, userId))).returning() : await tx.insert(customerAddresses).values({ ...values, createdAt: now }).returning();
    return address;
  });
}

export async function removeAccountAddress(userId: string, addressId: string, options: { db?: CommerceDatabase } = {}) {
  const db = options.db ?? getDatabase();
  const removed = await db.delete(customerAddresses).where(and(eq(customerAddresses.id, addressId), eq(customerAddresses.userId, userId))).returning();
  if (!removed.length) throw new Error("Address was not found for this customer account.");
  return removed[0];
}

export async function updateAccountPreferences(userId: string, email: string, input: z.input<typeof preferenceSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = preferenceSchema.parse(input); const db = options.db ?? getDatabase(); const now = options.now ?? new Date();
  return db.transaction(async (tx) => {
    const [existing] = await tx.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId)).limit(1);
    const values = { email: email.toLowerCase(), userId, ...payload, updatedAt: now };
    const [preference] = existing ? await tx.update(notificationPreferences).set(values).where(eq(notificationPreferences.id, existing.id)).returning() : await tx.insert(notificationPreferences).values({ ...values, createdAt: now }).returning();
    return preference;
  });
}

export async function submitPrivacyRequest(userId: string, email: string, input: z.input<typeof privacyRequestSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = privacyRequestSchema.parse(input); const db = options.db ?? getDatabase();
  return db.transaction(async (tx) => {
    const [existing] = await tx.select().from(privacyRequests).where(eq(privacyRequests.idempotencyKey, payload.idempotencyKey)).limit(1);
    if (existing) {
      if (existing.userId !== userId) throw new Error("Privacy request idempotency key belongs to another account.");
      return { request: existing, reused: true };
    }
    const [request] = await tx.insert(privacyRequests).values({ userId, requesterEmailSnapshot: email.toLowerCase(), type: payload.type, details: payload.details, idempotencyKey: payload.idempotencyKey, requestedAt: options.now ?? new Date() }).returning();
    return { request, reused: false };
  });
}

export async function listAccountOrders(userId: string, options: { db?: CommerceDatabase } = {}) {
  const db = options.db ?? getDatabase();
  return db.select({ id: orders.id, orderNumber: orders.orderNumber, currency: orders.currency, orderStatus: orders.orderStatus, paymentStatus: orders.paymentStatus, fulfilmentStatus: orders.fulfilmentStatus, postPurchaseStatus: orders.postPurchaseStatus, grandTotal: orders.grandTotal, createdAt: orders.createdAt }).from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}
