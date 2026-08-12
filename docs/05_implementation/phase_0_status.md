# Odhvica — Phase 0 Decision Register

| Field | Value |
|---|---|
| Status | In progress |
| Canonical stack | Next.js App Router, TypeScript, PostgreSQL, Drizzle, Better Auth, Docker and Caddy |
| Source repository | `sainisun/Odhvica` |
| Rule | No live credential, provider account, real customer data or unapproved tax/legal rule enters source control. |

## Completed decisions

| ID | Decision | Status | Evidence |
|---|---|---|---|
| P0-D01 | Canonical implementation uses the approved Next.js/PostgreSQL/Better Auth stack rather than the managed Vite/MySQL scaffold. | Complete | User approval recorded on 2026-08-12. |
| P0-D02 | Odhvica is the reference store; future clients receive separately deployed stores, not a shared marketplace. | Complete | `06_reuse_model.md` and Master Blueprint. |
| P0-D03 | Payment routing is Razorpay for eligible India/INR, Stripe primary internationally and PayPal eligible fallback. | Complete | `05_commerce_rules.md` and `20_integration_spec.md`. |
| P0-D04 | PostgreSQL/Drizzle auth, staff-role, 2FA and audit schema migration was generated and reviewed but remains unapplied until the separate Odhvica PostgreSQL environment is provisioned. | Complete | `apps/web/drizzle/0000_shallow_trish_tilby.sql`. |

## Required business/provider inputs

| ID | Decision or input | Owner | Status | Blocks |
|---|---|---|---|---|
| P0-D05 | Initial selling countries, supported delivery countries and display/settlement currencies. | Product owner | Pending | Checkout, shipping and payment route activation. |
| P0-D06 | GST registration decision, supplier identity, GSTIN, state/UT, HSN/SAC and invoice sequence. | Product owner with qualified tax review | Pending | GST invoice activation. |
| P0-D07 | Razorpay, Stripe and PayPal merchant-account eligibility and sandbox/live ownership. | Product owner | Pending | Live payment enablement. |
| P0-D08 | Courier workflow, free-shipping thresholds and manual fallback procedure. | Product owner | Pending | Shipping rate and fulfilment configuration. |
| P0-D09 | Transactional email sender/domain and customer-support channel. | Product owner | Pending | Customer notification activation. |
| P0-D10 | Object-storage provider/bucket ownership and private customer-upload retention policy. | Product owner | Pending | Product media and reference-upload activation. |
| P0-D11 | Consent text, GA4, Meta Pixel and Google Search Console client-owned accounts. | Product owner | Pending | Production analytics activation. |
| P0-D12 | Staff 2FA method, recovery owner and production staff list. | Product owner and technical lead | Pending | Production admin access enforcement. |

## Phase 0 execution rule

The application foundation may use safe local/staging placeholders, but any feature depending on a pending decision remains disabled or configuration-gated. This register must be updated before the corresponding feature moves into production.
