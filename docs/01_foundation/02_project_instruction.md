# Odhvica — Project Instructions

| Field | Value |
|---|---|
| Document ID | 02 |
| Status | Approved foundation |
| Version | 0.1 |
| Applies to | All Odhvica master-template and client-store development work |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document contains standing project rules for developers, designers, technical writers, QA staff, and future contributors working on Odhvica. It converts the business model into operational boundaries so that the reusable master template remains stable while each client can receive a completely distinct storefront.

These rules apply unless a later approved architecture, security, legal, or release decision explicitly supersedes them. Any superseding decision must be recorded in `07_memory.md`.

## 2. Product Identity

Odhvica is a reusable, single-store e-commerce application for handmade-fashion and artisan-accessory businesses. It is a master template used to create separate, independently deployed client stores. It is not a shared marketplace, a multi-tenant SaaS platform, or a store-builder in which clients independently provision themselves.

Each production client store must have independent ownership boundaries for its domain, database, deployment environment, business data, payment credentials, customer data, and operational configuration.

## 3. Rule Precedence

When requirements conflict, follow this order of precedence:

| Priority | Source | Rule |
|---:|---|---|
| 1 | Security, privacy, payment-provider, and legal obligations | Never bypass safety, privacy, permission, or payment handling requirements for speed or convenience. |
| 2 | Approved client contract and approved scope | Deliver only what is contracted; record agreed change requests. |
| 3 | Odhvica master-template boundaries | Protect reusability and prevent client-specific leakage into the core. |
| 4 | Approved product and architecture documents | Follow the latest approved system and product decisions. |
| 5 | Design preferences | Adjust visual or interaction details without breaking higher-priority rules. |

## 4. Master Template Rules

The master template is the only authoritative baseline for reusable code, documentation, shared design-system components, migration patterns, test strategy, and deployment procedure. It must remain brand-neutral and safe to clone for a new client.

| Required practice | Instruction |
|---|---|
| Versioning | Every master release must have a clear version, change summary, test status, and migration notes where relevant. |
| Brand neutrality | Do not hard-code Odhvica or any client’s logo, copy, domain, products, prices, policy text, images, analytics IDs, or payment credentials into reusable modules. |
| Data isolation | Do not reuse production client data, credentials, media, databases, or secrets in another client project. |
| Controlled promotion | A feature created for one client enters the master only after it meets the reuse criteria in `06_reuse_model.md`. |
| Safe rollback | Any master or client release must preserve a defined rollback path. |
| Documentation | A change to behaviour, configuration, schema, APIs, integrations, security, or deployment must update the relevant Markdown document. |

## 5. Client Store Rules

A client store is a separate production application created from a defined master-template version. It may receive a unique storefront design, content model usage, catalogue, selected modules, integrations, domain, data, deployment configuration, and brand assets.

The client should not receive the master source code by default. The delivery commitment is a functioning deployed website, the agreed administrator access, operating guidance, and the contracted support scope.

| Allowed client-level change | Default treatment |
|---|---|
| Logo, colors, typography, page visuals, copy, brand voice | Client-specific storefront configuration or implementation |
| Home page, collection page, product page and campaign page design | Client-specific storefront redesign |
| Catalogue, policies, prices, currencies, shipping rates, tax and promotions | Client data and configuration |
| Payment account, email sender, analytics and ad identifiers | Client-owned configuration/secrets |
| Existing optional commerce module | Enable only after verifying configuration, QA and scope |
| One-off business process | Separate scoped customisation; do not automatically merge into master |

## 6. Fixed Admin and Flexible Storefront Principle

The admin application is a reusable operations product. Its navigation, design system, role model, page structure, and standard operations should remain consistent from client to client. This reduces training time, testing cost, support complexity, and implementation delay.

The storefront is a brand and conversion product. It is intentionally flexible. Each client may require a different visual design, editorial composition, campaign treatment, product-card styling, navigation pattern, collection experience, typography, and brand storytelling approach. Storefront redesign must reuse stable commerce contracts rather than duplicate or alter core order, payment, inventory, authentication, and customer logic.

> Redesign the customer-facing experience freely; do not rewrite stable commerce behaviour without an approved product and architecture decision.

## 7. Handmade-Commerce Requirements

All implementation decisions must account for the reality of handmade-fashion products. This includes limited or unique inventory, made-to-order production, product variation, custom measurements, personalisation, textile/material information, care notes, artisan/brand story, image-rich merchandising, international delivery expectations, and transparent returns/refunds terms.

A product cannot be treated as a simple generic SKU when it needs custom details. Required inputs and operational consequences must be explicitly documented before development. Examples include a garment size chart, a custom measurement collection flow, a monogram field, a production lead time, a one-of-a-kind inventory lock, and manual order review before fulfilment.

## 8. Performance and SEO Instructions

The product direction is Next.js-first and performance-oriented. Each storefront must be designed as a search-engine discoverable and mobile-first retail experience. Visual richness must not be achieved by uncontrolled media weight, blocking scripts, unusable filter interactions, or unnecessary animation.

Performance requirements will be measurable in `22_performance_plan.md` and testable in `26_testing_quality.md`. Until those documents are complete, contributors must use image optimisation, responsive media, semantic page structure, accessible forms, predictable navigation, minimal third-party scripts, and progressive enhancement as default practices.

## 9. International Commerce Instructions

The master template must support international commerce without pretending that every market, payment provider, tax rule, courier, or currency is identical. Country availability, currency display, payment method eligibility, tax handling, shipping zones, delivery promises, returns, and compliance content must remain configuration-driven and testable.

Razorpay is the India payment route. Stripe and PayPal are the planned international routes. No payment credential may be committed to source control, copied into documentation, or shared between clients. Exact implementation constraints and fallback behaviours will be governed by `20_integration_spec.md`.

## 10. Documentation and Decision Discipline

Development work must begin with a documented requirement, flow, or approved change request. If a decision changes the product boundary, data model, integration behaviour, checkout experience, security posture, deployment process, or client reuse policy, update the relevant document and add a decision entry to `07_memory.md`.

Do not create untracked “quick fixes” that change business behaviour. Where urgent remediation is required, document the issue, temporary mitigation, owner, risk, and planned permanent solution.

## 11. Quality Gate Rules

No feature is complete solely because it appears to work in a development environment. A releaseable feature must have defined acceptance criteria, normal and failure-path coverage, responsive behaviour, permission checks where applicable, documentation updates, and release verification.

Payment, authentication, order, refund, inventory, pricing, discount, shipping, privacy, and data-changing operations are high-risk paths. They require explicit testing and review before production release.

## 12. Prohibited Practices

The following are prohibited unless explicitly approved and documented:

| Prohibited practice | Reason |
|---|---|
| Using one client’s production database or secrets for another client | Security, privacy, and operational isolation failure |
| Copying a client’s branding or content into the master template | Breaks reuse and creates intellectual-property risk |
| Adding every custom request to shared code | Produces an unmaintainable template |
| Exposing payment keys or sensitive configuration to the browser or repository | Security breach risk |
| Rewriting checkout/order logic to solve a visual storefront issue | Creates unnecessary commerce risk |
| Releasing without a tested rollback path | Increases production outage risk |
| Treating unapproved feature ideas as commitments | Causes scope and commercial confusion |

## 13. Related Documents

`01_project_summary.md` defines the product purpose. `03_prd.md` defines behaviour and priorities. `04_feature_scope.md` controls what is included. `05_commerce_rules.md` defines commercial rules. `06_reuse_model.md` governs master/client branching and promotion. `07_memory.md` records decisions. `08_agent.md` explains how future project work must be performed.
