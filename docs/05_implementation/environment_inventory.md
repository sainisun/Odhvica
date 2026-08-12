# Odhvica Environment Inventory

## Purpose

This is the single authoritative inventory for values in `.env.example`, based on the current runtime modules. It separates values that are read by the application today from infrastructure placeholders required for future production activation. All secret values belong only in a client-specific secret manager or deployment environment.

| Key | Current source/consumer | Stage purpose | Required state |
|---|---|---|---|
| `DATABASE_URL` | Drizzle/`pg` database bootstrap | Staging and production database connection | Mandatory before database-backed catalogue, orders, auth or account flows run. |
| `BETTER_AUTH_SECRET` | Better Auth initialisation | Session/auth cryptographic secret | Mandatory for authenticated routes; different per environment. |
| `BETTER_AUTH_URL` | Better Auth initialisation | Canonical auth callback/base URL | Mandatory for authenticated routes; must match environment domain. |
| `ODHVICA_PAYMENT_MODE` | Payment config | `sandbox` or controlled `live` provider activation | Defaults to sandbox; live requires every selected provider credential. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Payment live credential guard | Razorpay hosted India/INR payment and signed events | Required only for Razorpay live activation. |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Payment live credential guard | Stripe international payment and signed events | Required only for Stripe live activation. |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID` | Payment live credential guard | PayPal fallback payment and verification | Required only for PayPal live activation. |
| `ODHVICA_EMAIL_MODE` | Notification config | `sandbox` or controlled live email activation | Defaults to sandbox. |
| `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_SENDER_NAME` | Notification live configuration guard | Transactional sender/provider configuration | Required only for live email activation after sender verification. |
| `ODHVICA_ANALYTICS_MODE` | Analytics config | `sandbox` or consent-aware live analytics activation | Defaults to sandbox. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `GOOGLE_SEARCH_CONSOLE_VERIFICATION` | Analytics live configuration guard | Client-owned web measurement/verification identifiers | Required only for live analytics activation and must pass consent checks. |
| `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Phase 8 object-storage handoff placeholder | Client-isolated product/media storage | Infrastructure requirement before media write runtime is activated; not yet consumed by a live adapter. |
| `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL` | Deployment/site-identity configuration | Client storefront identity and canonical URL | Client-specific public configuration, validated during staging. |
| `ODHVICA_E2E`, `NEXT_TELEMETRY_DISABLED` | Playwright local server only | Local/CI test isolation | Test/CI-only; never used as live commerce configuration. |

## Activation rule

The documented modules fail closed when their live mode is selected without all required values. A client deployment must retain `sandbox` mode for payment, email and analytics until the Phase 8 staging evidence and client approvals in `phase_8_staging_production_handoff.md` are complete.
