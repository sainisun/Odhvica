import type { getDatabase } from "@/lib/db";
import { deliverSandboxNotification } from "./service";

type CommerceDatabase = ReturnType<typeof getDatabase>;
type Options = { db?: CommerceDatabase; now?: Date };

export function notifyOrderConfirmed(input: { recipientEmail: string; userId?: string; orderId: string; paymentId?: string; idempotencyKey: string; orderNumber: string; grandTotal: number; currency: string }, options: Options = {}) {
  return deliverSandboxNotification({ recipientEmail: input.recipientEmail, userId: input.userId, orderId: input.orderId, paymentId: input.paymentId, idempotencyKey: input.idempotencyKey, template: { event: "order_confirmed", data: { orderNumber: input.orderNumber, grandTotal: input.grandTotal, currency: input.currency } } }, options);
}

export function notifyPaymentFailed(input: { recipientEmail: string; userId?: string; orderId?: string; paymentId?: string; idempotencyKey: string; orderNumber: string }, options: Options = {}) {
  return deliverSandboxNotification({ recipientEmail: input.recipientEmail, userId: input.userId, orderId: input.orderId, paymentId: input.paymentId, idempotencyKey: input.idempotencyKey, template: { event: "payment_failed", data: { orderNumber: input.orderNumber } } }, options);
}

export function notifyFulfilmentUpdated(input: { recipientEmail: string; userId?: string; orderId: string; idempotencyKey: string; orderNumber: string; status: string; trackingReference?: string }, options: Options = {}) {
  return deliverSandboxNotification({ recipientEmail: input.recipientEmail, userId: input.userId, orderId: input.orderId, idempotencyKey: input.idempotencyKey, template: { event: "fulfilment_updated", data: { orderNumber: input.orderNumber, status: input.status, trackingReference: input.trackingReference } } }, options);
}

export function notifyRefundApproved(input: { recipientEmail: string; userId?: string; orderId: string; paymentId: string; refundId: string; idempotencyKey: string; orderNumber: string; amount: number; currency: string }, options: Options = {}) {
  return deliverSandboxNotification({ recipientEmail: input.recipientEmail, userId: input.userId, orderId: input.orderId, paymentId: input.paymentId, refundId: input.refundId, idempotencyKey: input.idempotencyKey, template: { event: "refund_approved", data: { orderNumber: input.orderNumber, amount: input.amount, currency: input.currency } } }, options);
}

export function notifyStaffAlert(input: { recipientEmail: string; userId?: string; idempotencyKey: string; title: string; summary: string }, options: Options = {}) {
  return deliverSandboxNotification({ recipientEmail: input.recipientEmail, userId: input.userId, idempotencyKey: input.idempotencyKey, template: { event: "staff_alert", data: { title: input.title, summary: input.summary } } }, options);
}
