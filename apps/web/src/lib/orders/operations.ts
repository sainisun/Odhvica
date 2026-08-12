import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { auditEvents, fulfilmentEvents, orders, payments, refunds, returnRequests } from "@/lib/db/schema";
import { can, requiresStepUp, type StaffRole } from "@/lib/commerce/roles";
import { assertFulfilmentTransition, assertOrderTransition, assertPostPurchaseRequest, type FulfilmentStatus, type OrderStatus, type PostPurchaseStatus } from "./state-machine";

type CommerceDatabase = ReturnType<typeof getDatabase>;
type StaffAccess = { userId: string; role: StaffRole; hasFreshStepUp: boolean };

function assertPermission(access: StaffAccess, permission: string) {
  if (!can(access.role, permission)) throw new Error(`${access.role} staff cannot perform ${permission}.`);
  if (requiresStepUp(permission) && !access.hasFreshStepUp) throw new Error(`A fresh second-factor challenge is required for ${permission}.`);
}

export const fulfilmentTransitionSchema = z.object({ orderId: z.string().uuid(), nextStatus: z.enum(["unfulfilled", "review_required", "in_production", "ready_to_ship", "partially_fulfilled", "fulfilled", "shipped", "delivered", "returned"]), note: z.string().trim().max(1000).optional(), carrier: z.string().trim().max(120).optional(), trackingNumber: z.string().trim().max(180).optional() });
export const orderTransitionSchema = z.object({ orderId: z.string().uuid(), nextStatus: z.enum(["draft", "pending_confirmation", "confirmed", "cancelled", "completed", "archived"]), note: z.string().trim().max(1000).optional() });
export const postPurchaseRequestSchema = z.object({ orderId: z.string().uuid(), orderItemId: z.string().uuid().optional(), type: z.enum(["cancellation_requested", "return_requested", "exchange_requested", "refund_under_review"]), reason: z.string().trim().min(4).max(1000), customerNote: z.string().trim().max(1000).optional() });
export const refundRequestSchema = z.object({ orderId: z.string().uuid(), paymentId: z.string().uuid(), amount: z.number().positive(), currency: z.string().length(3), reason: z.string().trim().min(4).max(1000), idempotencyKey: z.string().trim().min(12).max(128) });

export async function transitionFulfilment(input: z.infer<typeof fulfilmentTransitionSchema>, options: { db?: CommerceDatabase; access: StaffAccess }) {
  const payload = fulfilmentTransitionSchema.parse(input); assertPermission(options.access, "orders:fulfil");
  const db = options.db ?? getDatabase();
  return db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, payload.orderId)).limit(1);
    if (!order) throw new Error("Order not found.");
    assertFulfilmentTransition(order.fulfilmentStatus as FulfilmentStatus, payload.nextStatus);
    const [updated] = await tx.update(orders).set({ fulfilmentStatus: payload.nextStatus, updatedAt: new Date() }).where(eq(orders.id, order.id)).returning();
    await tx.insert(fulfilmentEvents).values({ orderId: order.id, status: payload.nextStatus, note: payload.note, carrier: payload.carrier, trackingNumber: payload.trackingNumber, actorUserId: options.access.userId });
    await tx.insert(auditEvents).values({ actorUserId: options.access.userId, action: "order.fulfilment.transitioned", subjectType: "order", subjectId: order.id, outcome: "success", metadata: { from: order.fulfilmentStatus, to: payload.nextStatus } });
    return updated;
  });
}

export async function transitionOrderStatus(input: z.infer<typeof orderTransitionSchema>, options: { db?: CommerceDatabase; access: StaffAccess }) {
  const payload = orderTransitionSchema.parse(input); assertPermission(options.access, "orders:write");
  const db = options.db ?? getDatabase();
  return db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, payload.orderId)).limit(1);
    if (!order) throw new Error("Order not found.");
    assertOrderTransition(order.orderStatus as OrderStatus, payload.nextStatus);
    const [updated] = await tx.update(orders).set({ orderStatus: payload.nextStatus, updatedAt: new Date() }).where(eq(orders.id, order.id)).returning();
    await tx.insert(auditEvents).values({ actorUserId: options.access.userId, action: "order.status.transitioned", subjectType: "order", subjectId: order.id, outcome: "success", metadata: { from: order.orderStatus, to: payload.nextStatus, note: payload.note } });
    return updated;
  });
}

export async function requestPostPurchase(input: z.infer<typeof postPurchaseRequestSchema>, options: { db?: CommerceDatabase; userId?: string } = {}) {
  const payload = postPurchaseRequestSchema.parse(input); const db = options.db ?? getDatabase();
  return db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, payload.orderId)).limit(1);
    if (!order) throw new Error("Order not found.");
    assertPostPurchaseRequest(order.postPurchaseStatus as PostPurchaseStatus, payload.type);
    const [request] = await tx.insert(returnRequests).values({ orderId: order.id, orderItemId: payload.orderItemId, type: payload.type, reason: payload.reason, customerNote: payload.customerNote }).returning();
    await tx.update(orders).set({ postPurchaseStatus: payload.type, updatedAt: new Date() }).where(eq(orders.id, order.id));
    await tx.insert(auditEvents).values({ actorUserId: options.userId, action: "order.post_purchase.requested", subjectType: "order", subjectId: order.id, outcome: "success", metadata: { requestId: request.id, type: payload.type } });
    return request;
  });
}

export async function approveRefund(input: z.infer<typeof refundRequestSchema>, options: { db?: CommerceDatabase; access: StaffAccess }) {
  const payload = refundRequestSchema.parse(input); assertPermission(options.access, "refunds:approve");
  const db = options.db ?? getDatabase();
  return db.transaction(async (tx) => {
    const [existing] = await tx.select().from(refunds).where(eq(refunds.idempotencyKey, payload.idempotencyKey)).limit(1);
    if (existing) return { refund: existing, reused: true };
    const [order] = await tx.select().from(orders).where(eq(orders.id, payload.orderId)).limit(1);
    const [payment] = await tx.select().from(payments).where(eq(payments.id, payload.paymentId)).limit(1);
    if (!order || !payment || payment.orderId !== order.id || payment.status !== "paid") throw new Error("A paid payment for this order is required before approving a refund.");
    if (payload.currency.toUpperCase() !== payment.currency.toUpperCase() || payload.amount > Number(payment.amount)) throw new Error("Refund amount or currency is not valid for this payment.");
    const [refund] = await tx.insert(refunds).values({ orderId: order.id, paymentId: payment.id, status: "approved", amount: String(payload.amount), currency: payload.currency.toUpperCase(), reason: payload.reason, idempotencyKey: payload.idempotencyKey, requestSnapshot: { paymentStatus: payment.status, paymentAmount: payment.amount }, requestedByUserId: options.access.userId, approvedByUserId: options.access.userId, approvedAt: new Date() }).returning();
    await tx.update(orders).set({ postPurchaseStatus: "refund_under_review", updatedAt: new Date() }).where(eq(orders.id, order.id));
    await tx.insert(auditEvents).values({ actorUserId: options.access.userId, action: "refund.approved", subjectType: "refund", subjectId: refund.id, outcome: "success", metadata: { orderId: order.id, amount: payload.amount, paymentId: payment.id } });
    return { refund, reused: false };
  });
}
