# Phase 6 — Growth and Advanced Module Foundations

## Purpose

This checkpoint implements the remaining Phase 6 modules as reusable Odhvica foundations. It deliberately separates **provider-independent application rules** from modules that need a client’s courier, email/WhatsApp, analytics or advertising accounts. No external marketing, courier, analytics or advertising action is made by this code.

## Delivered foundations

| Module | Current implementation | Live activation boundary |
|---|---|---|
| Multi-currency display | Supported display-currency whitelist, correct decimal handling and formatter. Existing server-authoritative order currency remains unchanged. | Approved FX/pricing source, region/currency policy and provider eligibility. |
| Wishlist | Account-scoped toggle/list service with no duplicate saved line for the same product/variant selection. | Customer authentication plus production PostgreSQL migration. |
| Reviews | Database model, rating constraints, pending moderation state and service that requires an owner’s delivered purchase item. | Authenticated customer route, staff moderation workspace and real review-policy approval. |
| Production queue | One production job per order item, lead-time fields, staff-gated lifecycle transitions and audit records. | Persisted order runtime and production-team workflow configuration. |
| Courier tracking | Idempotent sandbox tracking-event storage. | Selected courier adapter, signature verification, webhook/reconciliation rules and manual fallback procedure. |
| Marketing | Marketing opt-in policy separate from operational messages; delivery remains sandbox-only. | Client-owned email/WhatsApp provider, consent/retention policy and approved scheduled delivery workflow. |
| Analytics | Fail-closed GA4/Meta/Search Console config requirement plus safe commerce event schema excluding names, email, addresses, payment data and customisation text. | Client-owned identifiers, consent-aware browser/server wiring and verified event deduplication. |
| SEO content | Editorial article/lookbook model and internal-only 301/302 redirect policy. | Authorised publishing workspace and content/legal approval. |

## Non-negotiable review policy

The application does not seed, fabricate or present any customer review, rating or testimonial. A real review can only enter the system as a pending submission from an authenticated owner of a delivered purchase item; publication needs an authorised moderation decision.

## Tests and operational boundary

PGlite integration tests cover guest/customer wishlist ownership, production-job idempotency, allowed/denied staff transitions with audit records, and idempotent sandbox tracking events. Unit tests cover multi-currency display, analytics fail-closed behaviour, marketing opt-in, abandoned-cart eligibility and safe redirect rules. The protected `/admin/growth` and `/admin/production` routes expose module and production status without provider secrets or payment data.

## Live rollout sequence

1. Apply migrations to an isolated PostgreSQL environment.
2. Activate customer authentication and staff operational workspaces.
3. Choose one courier, then add signed live events and a manual fulfilment fallback.
4. Configure client-owned GA4/Meta/Search Console identifiers behind the consent boundary and verify event deduplication.
5. Configure transactional/marketing provider details and explicit consent before any campaign or abandoned-cart send.
6. Add editorial publishing workflows and moderation controls after content-policy approval.

The remaining Phase 6 external integrations cannot be honestly called live until their client-owned accounts, legal/consent settings and operational test evidence are available.
