# Phase 9 — Reusable Client Template Release Contract

## Purpose

Odhvica is a **single-store reusable reference application**, not a multi-tenant marketplace. Phase 9 defines how the tested master becomes a separately deployed client store while preserving security, configuration isolation and future upgradeability.

## 1. Clone boundary

| Shared master asset | Client-specific replacement | Must never be shared across clients |
|---|---|---|
| Commerce domain logic, tests, migrations and security policies | Storefront design, brand tokens, copy, catalogue, policy pages and merchandising | Database, storage namespace, domain, secrets, provider accounts, analytics properties, staff/customer records or order data |
| Admin interaction model and permission matrix | Approved client feature flags and workflow labels | Payment webhook secret, email API key, 2FA secret, VPS access or backup archive |
| CI/quality/release runbooks | Client deployment name, staging/production URLs and operational contacts | Production logs or support data from another client |

## 2. Client-store bootstrap checklist

1. Fork/clone an approved tagged master commit into the client repository or deployment workspace; record master commit and client branch/tag.
2. Apply the brand/configuration design layer only through approved storefront tokens, content and feature boundary files. Do not edit payment, order, auth or security flow without a reviewed change.
3. Create isolated staging and production PostgreSQL, storage, domain, secrets and provider accounts using the Phase 8 handoff package.
4. Import client-owned catalogue/media and run stock, pricing, lead-time, tax, shipping and policy review.
5. Execute the full Phase 7 staging runbook, capture acceptance evidence and preserve the release/rollback record.
6. Deliver the deployed site and client-operational access according to the commercial agreement. Source code handover is separate from deployment delivery unless explicitly contracted.

## 3. Configuration contract

The following categories are client configuration, not source-code customisation: site identity, theme/design system, catalogue content/media, serviceable countries/currency display, shipping rules, tax settings, policy pages, provider IDs/secrets, sender identity, analytics IDs and operational contacts. Any custom feature that changes data handling, payment, order state, staff permissions or legal notices requires a new reviewed migration/test/release record.

## 4. Upgrade contract

| Upgrade type | Required treatment |
|---|---|
| Security patch | Apply from master promptly, run quality gate, test client configuration and document version. |
| Shared commerce improvement | Merge/cherry-pick through staging; preserve client theme/content and run compatibility checks. |
| Client-only feature | Isolate behind clear module/configuration boundary; add tests and avoid modifying shared core unless promoted through review. |
| Schema migration | Rehearse on client staging, back up, apply once under release control and preserve rollback/forward-fix plan. |

## 5. Template release criteria

The master may be designated a reusable template only after at least one independently configured client-style staging rehearsal has proved cloning, environment injection, migration, provider sandbox tests, restore/rollback, CI and client launch handoff. Until then, the project is a validated reference foundation, not a proven multi-client deployment template.
