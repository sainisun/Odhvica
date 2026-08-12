import type { getDatabase } from "@/lib/db";
import { confirmVerifiedPayment } from "@/lib/orders/service";
import { sandboxPaymentEventSchema, verifySandboxPaymentEvent, type SandboxPaymentEvent } from "./adapter";

type CommerceDatabase = ReturnType<typeof getDatabase>;

export async function processVerifiedSandboxPaymentEvent(input: SandboxPaymentEvent, options: { db?: CommerceDatabase; sandboxWebhookSecret?: string; now?: Date } = {}) {
  const event = sandboxPaymentEventSchema.parse(input);
  if (!verifySandboxPaymentEvent(event, options.sandboxWebhookSecret)) throw new Error("Sandbox payment webhook signature is invalid.");
  if (event.outcome !== "paid") return { status: "ignored" as const, eventId: event.eventId, reason: "Sandbox event is not a successful payment." };
  const confirmation = await confirmVerifiedPayment({ checkoutAttemptId: event.checkoutAttemptId, provider: event.provider, providerPaymentId: event.providerPaymentId, providerReference: event.providerReference, idempotencyKey: `sandbox-${event.eventId}` }, { db: options.db, now: options.now });
  return { status: "confirmed" as const, eventId: event.eventId, confirmation };
}
