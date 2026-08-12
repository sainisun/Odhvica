import { z } from "zod";

export const notificationTemplateInputSchema = z.discriminatedUnion("event", [
  z.object({ event: z.literal("order_confirmed"), data: z.object({ orderNumber: z.string().min(3), grandTotal: z.number().nonnegative(), currency: z.string().length(3) }) }),
  z.object({ event: z.literal("payment_failed"), data: z.object({ orderNumber: z.string().min(3) }) }),
  z.object({ event: z.literal("fulfilment_updated"), data: z.object({ orderNumber: z.string().min(3), status: z.string().min(2), trackingReference: z.string().max(80).optional() }) }),
  z.object({ event: z.literal("refund_approved"), data: z.object({ orderNumber: z.string().min(3), amount: z.number().positive(), currency: z.string().length(3) }) }),
  z.object({ event: z.literal("staff_alert"), data: z.object({ title: z.string().min(3).max(120), summary: z.string().min(3).max(500) }) }),
]);

export type NotificationTemplateInput = z.infer<typeof notificationTemplateInputSchema>;

export function renderNotificationTemplate(input: NotificationTemplateInput) {
  const message = notificationTemplateInputSchema.parse(input);
  if (message.event === "order_confirmed") return { subject: `Order confirmed · ${message.data.orderNumber}`, preview: `Your order total is ${message.data.currency.toUpperCase()} ${message.data.grandTotal.toFixed(2)}.`, deliveryClass: "transactional" as const };
  if (message.event === "payment_failed") return { subject: `Payment needs attention · ${message.data.orderNumber}`, preview: "Your order remains unconfirmed until a verified payment succeeds.", deliveryClass: "transactional" as const };
  if (message.event === "fulfilment_updated") return { subject: `Order update · ${message.data.orderNumber}`, preview: `Your order is now ${message.data.status}.${message.data.trackingReference ? ` Tracking: ${message.data.trackingReference}.` : ""}`, deliveryClass: "transactional" as const };
  if (message.event === "refund_approved") return { subject: `Refund approved · ${message.data.orderNumber}`, preview: `${message.data.currency.toUpperCase()} ${message.data.amount.toFixed(2)} is approved for processing.`, deliveryClass: "transactional" as const };
  return { subject: message.data.title, preview: message.data.summary, deliveryClass: "operational" as const };
}
