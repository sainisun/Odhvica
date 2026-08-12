import type { PaymentGateway } from "@/lib/commerce/payment-routing";

export type PaymentMode = "sandbox" | "live";
export type PublicProviderStatus = { provider: PaymentGateway; enabled: boolean; mode: PaymentMode; activation: "sandbox_ready" | "live_credentials_required" };
type Environment = Record<string, string | undefined>;

const providers: PaymentGateway[] = ["razorpay", "stripe", "paypal"];

export function getPaymentMode(environment: Environment = process.env): PaymentMode {
  return environment.ODHVICA_PAYMENT_MODE === "live" ? "live" : "sandbox";
}

export function getPublicProviderStatuses(environment: Environment = process.env): PublicProviderStatus[] {
  const mode = getPaymentMode(environment);
  return providers.map((provider) => ({ provider, enabled: mode === "sandbox", mode, activation: mode === "sandbox" ? "sandbox_ready" : "live_credentials_required" }));
}

export function assertLiveProviderCredentials(environment: Environment = process.env) {
  if (getPaymentMode(environment) !== "live") throw new Error("Live payment credentials cannot be used while ODHVICA_PAYMENT_MODE is sandbox.");
  const requirements: Record<PaymentGateway, string[]> = {
    razorpay: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"],
    stripe: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    paypal: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_WEBHOOK_ID"],
  };
  const missing = Object.entries(requirements).flatMap(([provider, keys]) => keys.filter((key) => !environment[key]).map((key) => `${provider}:${key}`));
  if (missing.length) throw new Error(`Live payment activation is blocked until credentials are configured: ${missing.join(", ")}.`);
}
