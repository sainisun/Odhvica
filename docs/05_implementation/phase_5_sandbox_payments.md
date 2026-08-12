# Phase 5 — Sandbox Payment Adapter Foundation

## Delivered in this checkpoint

Odhvica now has reusable **test-only** adapter contracts for Razorpay, Stripe and PayPal. The default mode is `sandbox`; it creates internal hosted-payment handoff objects, signed simulated webhook events and refund-handoff records without opening a provider URL, contacting a merchant API, charging a customer or issuing a provider refund.

The checkout view explicitly labels the payment environment as sandbox mode. The owner-only `/admin/payments` route displays the readiness state for all three providers and explains that each provider is a placeholder until a specific client supplies its own merchant account. The page is not a secret-entry screen and never displays credentials.

## Sandbox workflow

1. Server payment routing determines Razorpay for India/INR and Stripe-primary/PayPal-eligible options internationally.
2. A sandbox adapter creates an internal handoff with `externalUrl: null`; no browser redirect or remote request occurs.
3. Tests create a deterministic HMAC-signed sandbox event. A modified signature is rejected before any order write.
4. A signed `paid` event calls the existing `confirmVerifiedPayment` transaction. This preserves the production boundary: only verified provider events may create an order.
5. A repeated sandbox event is idempotent and returns the original order rather than creating another order or payment.
6. A `failed` event is ignored. An already approved refund can create a deterministic sandbox refund handoff with no external URL; it cannot perform a provider refund or mutate provider state.

## Test configuration contract

| Variable | Sandbox behavior | Live activation requirement |
|---|---|---|
| `ODHVICA_PAYMENT_MODE` | Omit or set to `sandbox`; this is the safe default. | Set to `live` only after all provider configuration is complete. |
| `RAZORPAY_KEY_ID` | Not read by sandbox adapters. | Required with `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET`. |
| `STRIPE_SECRET_KEY` | Not read by sandbox adapters. | Required with `STRIPE_WEBHOOK_SECRET`. A publishable key is also required by the real hosted client flow. |
| `PAYPAL_CLIENT_ID` | Not read by sandbox adapters. | Required with `PAYPAL_CLIENT_SECRET` and `PAYPAL_WEBHOOK_ID`. |

`assertLiveProviderCredentials` fails closed if live mode is requested without the complete secret set. It is deliberately a readiness boundary, not a live provider SDK integration.

## What this does not implement

This checkpoint does **not** call Razorpay, Stripe or PayPal; it contains no provider SDK dependency, no merchant credentials, no public webhook endpoint and no payment-refund execution. It also does not treat browser redirects as proof of payment. Those features will be activated only after each separately deployed client store provides its own verified account, live credentials, real webhook URL and business/KYC approval.

## Verification

The automated suite covers default sandbox configuration, fail-closed live credential readiness, all three no-network handoff contracts, valid/invalid signatures, failed event handling, duplicate delivery idempotency and PGlite-backed order/payment confirmation. No production or external provider data is used by tests.
