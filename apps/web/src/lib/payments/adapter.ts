import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { PaymentGateway } from "@/lib/commerce/payment-routing";

const gatewaySchema = z.enum(["razorpay", "stripe", "paypal"]);
export const sandboxPaymentHandoffSchema = z.object({ checkoutAttemptId: z.string().uuid(), provider: gatewaySchema, amount: z.number().positive(), currency: z.string().length(3) });
export const sandboxPaymentEventSchema = z.object({ eventId: z.string().min(12).max(180), checkoutAttemptId: z.string().uuid(), provider: gatewaySchema, providerPaymentId: z.string().min(4).max(180), providerReference: z.string().max(180).optional(), outcome: z.enum(["paid", "failed"]), signature: z.string().min(16) });

export type SandboxPaymentHandoff = { provider: PaymentGateway; sessionId: string; checkoutAttemptId: string; amount: number; currency: string; externalUrl: null; mode: "sandbox"; message: string };
export type SandboxPaymentEvent = z.infer<typeof sandboxPaymentEventSchema>;

export function createSandboxPaymentHandoff(input: z.infer<typeof sandboxPaymentHandoffSchema>): SandboxPaymentHandoff {
  const payload = sandboxPaymentHandoffSchema.parse(input);
  return { provider: payload.provider, sessionId: `sandbox_${payload.provider}_${crypto.randomUUID()}`, checkoutAttemptId: payload.checkoutAttemptId, amount: payload.amount, currency: payload.currency.toUpperCase(), externalUrl: null, mode: "sandbox", message: `${payload.provider} sandbox handoff prepared. No external payment page or charge was created.` };
}

function signingInput(event: Omit<SandboxPaymentEvent, "signature">) {
  return [event.eventId, event.checkoutAttemptId, event.provider, event.providerPaymentId, event.providerReference ?? "", event.outcome].join(".");
}

export function createSandboxPaymentEvent(input: Omit<SandboxPaymentEvent, "signature">, sandboxWebhookSecret = "odhvica-sandbox-webhook-secret"): SandboxPaymentEvent {
  const event = { ...input, provider: gatewaySchema.parse(input.provider) };
  return { ...event, signature: createHmac("sha256", sandboxWebhookSecret).update(signingInput(event)).digest("hex") };
}

export function verifySandboxPaymentEvent(input: SandboxPaymentEvent, sandboxWebhookSecret = "odhvica-sandbox-webhook-secret") {
  const event = sandboxPaymentEventSchema.parse(input);
  const expected = createHmac("sha256", sandboxWebhookSecret).update(signingInput(event)).digest("hex");
  const received = Buffer.from(event.signature, "hex"); const signed = Buffer.from(expected, "hex");
  return received.length === signed.length && timingSafeEqual(received, signed);
}

export function createSandboxRefundHandoff(input: { refundId: string; provider: PaymentGateway; amount: number; currency: string }) {
  if (!gatewaySchema.safeParse(input.provider).success || input.amount <= 0 || input.currency.trim().length !== 3) throw new Error("Sandbox refund handoff is invalid.");
  return { refundId: input.refundId, provider: input.provider, amount: input.amount, currency: input.currency.toUpperCase(), externalUrl: null, mode: "sandbox" as const, message: "Sandbox refund handoff prepared. No provider refund was executed." };
}
