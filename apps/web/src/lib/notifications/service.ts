import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { notificationDeliveryAttempts, notificationPreferences, notifications } from "@/lib/db/schema";
import { renderNotificationTemplate, notificationTemplateInputSchema } from "./templates";

type CommerceDatabase = ReturnType<typeof getDatabase>;

export const notificationRequestSchema = z.object({
  recipientEmail: z.string().email().max(320),
  userId: z.string().optional(),
  orderId: z.string().uuid().optional(),
  paymentId: z.string().uuid().optional(),
  refundId: z.string().uuid().optional(),
  idempotencyKey: z.string().min(12).max(128),
  sandboxOutcome: z.enum(["deliver", "fail"]).default("deliver"),
  template: notificationTemplateInputSchema,
});

export function maskEmail(email: string) {
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (!local || !domain) return "hidden recipient";
  return `${local.slice(0, 1)}${"•".repeat(Math.max(3, Math.min(8, local.length - 1)))}@${domain}`;
}

function isDeliveryAllowed(deliveryClass: "transactional" | "operational" | "marketing", preference?: { operationalEmail: boolean; marketingEmail: boolean }) {
  if (deliveryClass === "transactional") return true;
  if (deliveryClass === "operational") return preference?.operationalEmail ?? true;
  return preference?.marketingEmail ?? false;
}

export async function deliverSandboxNotification(input: z.input<typeof notificationRequestSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = notificationRequestSchema.parse(input); const rendered = renderNotificationTemplate(payload.template); const db = options.db ?? getDatabase(); const now = options.now ?? new Date();
  return db.transaction(async (tx) => {
    const [existing] = await tx.select().from(notifications).where(eq(notifications.idempotencyKey, payload.idempotencyKey)).limit(1);
    if (existing) return { notification: existing, reused: true };
    const [preference] = await tx.select().from(notificationPreferences).where(eq(notificationPreferences.email, payload.recipientEmail.toLowerCase())).limit(1);
    const allowed = isDeliveryAllowed(rendered.deliveryClass, preference);
    const maskedRecipient = maskEmail(payload.recipientEmail);
    const outcome = !allowed ? "suppressed" : payload.sandboxOutcome === "fail" ? "failed" : "sandbox_delivered";
    const [notification] = await tx.insert(notifications).values({ channel: "email", deliveryClass: rendered.deliveryClass, event: payload.template.event, status: outcome, userId: payload.userId, recipientEmail: payload.recipientEmail.toLowerCase(), maskedRecipient, orderId: payload.orderId, paymentId: payload.paymentId, refundId: payload.refundId, idempotencyKey: payload.idempotencyKey, payloadSnapshot: { subject: rendered.subject, preview: rendered.preview, event: payload.template.event, data: payload.template.data } as Record<string, unknown>, createdAt: now, updatedAt: now }).returning();
    const providerMessageId = outcome === "sandbox_delivered" ? `sandbox_email_${createHash("sha256").update(notification.id).digest("hex").slice(0, 20)}` : undefined;
    await tx.insert(notificationDeliveryAttempts).values({ notificationId: notification.id, outcome, provider: "sandbox", providerMessageId, maskedRecipient, errorCode: outcome === "failed" ? "sandbox_forced_failure" : undefined, attemptedAt: now });
    return { notification, reused: false };
  });
}
