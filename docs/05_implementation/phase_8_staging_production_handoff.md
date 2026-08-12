# Phase 8 — Staging and Production Handoff Package

## Scope

Phase 8 cannot be completed entirely from source code because each client store needs separately owned infrastructure, business rules and provider accounts. This package defines the exact handoff inputs, verification evidence and activation order required to turn the validated Odhvica foundation into one client’s staging and production store.

> **Do not use production keys in local development or sandbox testing.** Each client receives separate credentials, database, storage namespace, domain and provider configuration. The repository never contains secret values.

## 1. Client-owned input matrix

| Area | Required client input | Staging evidence | Production activation evidence |
|---|---|---|---|
| Domain | Domain owner, DNS access, preferred storefront URL and redirect policy | Staging subdomain resolves with TLS. | Canonical domain resolves with TLS and HTTP→HTTPS redirect. |
| PostgreSQL | Isolated database endpoint, least-privilege application role and backup destination | Migrations run on empty/sanitised staging database. | Backup created and restore rehearsal reference recorded. |
| Object storage | Client-isolated bucket/prefix, region/endpoint and scoped credentials | Product image upload/retrieval test passes. | Lifecycle, recovery and public/private media policy are approved. |
| Staff auth | `BETTER_AUTH_SECRET`, staging/production `BETTER_AUTH_URL`, named staff users and 2FA recovery policy | Customer + staff staging accounts work; staff 2FA is enforced. | Client owner and minimum staff access is confirmed. |
| Payments | Client-owned Razorpay, Stripe and PayPal account selection and test credentials | Hosted handoff, webhook signature, duplicate event and refund policy are tested. | Live keys/webhooks are enabled only after client approval. |
| Email | Provider choice, verified sender domain/address and sender name | Test recipient receives transactional mail; masking/retry are checked. | DNS sender verification and live sending ownership confirmed. |
| Courier | Provider choice, serviceable regions, shipping/free-shipping rule and return workflow | Sandbox/manual fallback and tracking update path are tested. | Label/tracking live credential validation is approved. |
| GST and operations | GSTIN, state, HSN/SAC mapping, invoice series, taxes, currency/pricing and lead-time rules | Test order has approved tax/price/shipping behaviour. | Client signs off on legal/business display and invoice policy. |
| Analytics | GA4 property, Meta Pixel, Search Console and consent policy | Consent-aware event payload test has no personal/payment data. | Client-owned IDs are enabled and verified. |

## 2. Environment configuration procedure

Copy the root `.env.example` to the secret manager or deployment environment; never commit a populated file. `environment_inventory.md` is the authoritative per-key source, consumer, staging/live purpose and activation rule.

| Configuration group | Required keys |
|---|---|
| Site/runtime | `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL` |
| Auth | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` |
| Payments | `ODHVICA_PAYMENT_MODE`, Razorpay/Stripe/PayPal credentials and webhook secrets listed in `.env.example` |
| Email | `ODHVICA_EMAIL_MODE`, `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_SENDER_NAME` |
| Storage | `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` |
| Analytics | `ODHVICA_ANALYTICS_MODE`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `GOOGLE_SEARCH_CONSOLE_VERIFICATION` |

The payment, email and analytics modules default to sandbox mode and fail closed when their corresponding live configuration is incomplete. Set a module to live only during the controlled staging/production activation step.

## 3. Migration and deploy sequence

1. Select the approved Git commit and successful CI run. Build the locked Docker/Next.js artifact; the current health probe is `GET /api/health`.
2. Provision the client-isolated PostgreSQL database and object storage before attempting any migration or persisted runtime flow.
3. Back up the target database, then apply `apps/web/drizzle/` migrations in journal order. Record operator, start/end time, migration state and any incompatibility.
4. Deploy to the staging domain with staging-only secrets and no production data. The container is a standalone Next.js server on port `3000`; a reverse proxy/TLS layer is an infrastructure responsibility.
5. Execute `phase_7_staging_release_runbook.md`: authenticated staff/customer E2E, provider sandbox, backup restore, accessibility/performance, monitoring and client UAT.
6. Obtain technical + client owner go/no-go approval, take the production backup/rollback reference, deploy the same approved artifact, migrate once, and record post-deploy smoke results.

## 4. Acceptance evidence template

| Check | Staging result | Production result | Owner/date |
|---|---|---|---|
| Commit / CI run |  |  |  |
| Database migration and schema verification |  |  |  |
| Backup and controlled restore |  |  |  |
| Authenticated customer/staff/2FA tests |  |  |  |
| Payment hosted flow/webhook/reconciliation |  |  |  |
| Email/courier/analytics consent checks |  |  |  |
| Health/TLS/monitoring/alerts |  |  |  |
| Client catalogue/policy/GST/UAT sign-off |  |  |  |
| Rollback owner and retained version |  |  |  |

## 5. Explicit release blockers

The following cannot be claimed complete until evidence exists in the target client environment: provider-hosted payment processing; live email and courier delivery; GST invoice execution; staff 2FA enrolment/recovery; authenticated customer operations; object storage writes; analytics collection; database backup/restore; VPS monitoring/TLS; and client UAT approval.
