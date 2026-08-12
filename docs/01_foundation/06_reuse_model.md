# Odhvica — Reuse Model

| Field | Value |
|---|---|
| Document ID | 06 |
| Status | Approved foundation |
| Version | 0.1 |
| Product | Odhvica reusable handmade-fashion e-commerce template |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document defines how one protected Odhvica master codebase becomes independent client stores without turning the product into a shared marketplace or multi-tenant SaaS platform. It establishes the separation between reusable commerce capability, fixed admin experience, variable storefront design, client data/configuration, and one-off custom development.

The reuse model is a business and engineering control. It protects delivery speed, source-code quality, customer-data separation, testing discipline, support boundaries, and future profitability.

## 2. Operating Model

Odhvica is developed first as a complete reference store. Once the reference store is stable, the same master template can be used to create a new client project. A client project is not another tenant inside the Odhvica database. It is an independently configured and deployed application.

> One master template creates many independent stores. It does not place many stores inside one shared production application.

| Layer | Reuse approach | Client variation |
|---|---|---|
| Commerce core | Reused | No client-specific rewrite by default |
| Admin application | Reused | Client data/configuration and approved modules only |
| Storefront commerce contracts | Reused | No unnecessary alteration to cart, checkout, orders or authentication behaviour |
| Storefront visual/UI layer | Reused components where suitable | Fully redesignable per client |
| Brand content | Never copied between clients | Unique logo, copy, imagery, policies, campaigns and social links |
| Store configuration | Template structure reused | Separate currencies, regions, payments, shipping, emails, analytics and legal settings |
| Data | Never shared | Separate database and storage boundaries |
| Deployment | Repeatable procedure reused | Separate VPS environment, domain, secrets and release history |

## 3. Definitions

| Term | Definition |
|---|---|
| Master template | The protected authoritative source baseline for reusable Odhvica code, documents, tests, modules and release procedure. |
| Reference store | The Odhvica store implementation used to validate real requirements before a feature is offered to clients. |
| Client store | A separate project created from an approved master-template version for one client brand. |
| Core feature | A stable function expected across most stores, such as product catalogue, cart, checkout, orders or admin management. |
| Optional module | A reusable capability enabled only for clients who require it, such as custom measurements or courier automation. |
| Client configuration | Client-specific data/settings that do not change the shared application behaviour. |
| Storefront redesign | A client-specific customer-facing visual and interaction implementation that consumes stable commerce contracts. |
| Client custom | A scoped one-client capability that changes behaviour beyond existing template configuration/modules. |
| Master promotion | The controlled process of turning a proven reusable client feature into a master-template release. |

## 4. Separation Requirements

Each client store must be operationally independent from every other client store and from the Odhvica reference store.

| Asset or boundary | Required separation |
|---|---|
| Domain and SSL | Separate client-owned or client-authorised domain configuration. |
| Deployment | Separate production deployment, release history, environment configuration and rollback path. |
| Database | Separate database instance/schema boundary appropriate to the deployment design; never co-mingle production client records. |
| Media storage | Separate client media namespace/bucket/directory and access boundaries. |
| Payment credentials | Separate client-owned gateway accounts and secrets. |
| Email/SMS/WhatsApp | Separate authorised sender and provider configuration where required. |
| Analytics and ads | Separate identifiers, accounts, consent configuration and reporting access. |
| Customers and orders | Never visible or transferable across client projects. |
| Brand assets/content | Client-specific intellectual property must not be copied into master or another client project. |
| Support access | Limited, auditable and granted only as required by the support agreement. |

## 5. Master Template Composition

The master template is not a frozen code snapshot. It is a maintained product baseline containing only features that can be safely reused.

| Master-template area | Included | Excluded by default |
|---|---|---|
| Commerce engine | Catalogue, variants, cart, checkout, payments, orders, inventory, customer accounts and standard promotion rules | A client’s unique pricing or fulfilment policy unless generic and approved |
| Admin | Standard management modules, roles, reusable workflows and documented configuration controls | Bespoke client dashboard layouts or proprietary operational processes |
| Storefront foundation | Shared accessible components, page contracts, SEO foundations, content primitives and design tokens | Client logos, images, copy, exact visual composition and proprietary campaigns |
| Integration framework | Provider abstractions, credential handling, failure patterns and documented capabilities | Another client’s provider keys, account IDs, webhooks or transaction records |
| Infrastructure | Deployable application configuration, environment templates, backup/monitoring and release practices | Client-specific domain, secrets, server access and production data |
| Documentation | Architecture, requirements, test strategy, module documentation, change log and migration notes | Confidential client contract details or operational data |

## 6. New Client Store Lifecycle

Every new client store must follow an intentional lifecycle. The goal is predictable quality rather than a quick but undocumented copy.

| Stage | Required outcome |
|---|---|
| 1. Discovery | Client category, products, markets, payment eligibility, shipping needs, policy requirements, modules, support scope and commercial constraints are recorded. |
| 2. Scope classification | Requests are labelled configuration, storefront redesign, optional module, candidate master feature, client custom, future, or out of scope. |
| 3. Master version selection | The client starts from a known tested master-template release with a recorded version number. |
| 4. Project creation | A separate client code repository/project, database, storage boundary, deployment target and secret set are prepared. |
| 5. Storefront implementation | The storefront is designed and built for the client brand while preserving approved commerce contracts. |
| 6. Configuration and content | Catalogue, pages, policies, regions, currencies, shipping, tax settings, providers, analytics and communications are configured. |
| 7. QA and launch | Functionality, payment, shipping, accessibility, performance, security, SEO and rollback are tested; client signs off on launch readiness. |
| 8. Support and releases | The client receives approved access and training; updates follow documented support and release controls. |

## 7. Change Classification Rules

Every request must be classified before work begins.

| Request example | Classification | Source-code location | Default commercial treatment |
|---|---|---|---|
| Brand colors, logo, fonts and imagery | Client configuration/design | Client storefront | Standard implementation scope |
| A unique homepage and product-card layout | Storefront redesign | Client storefront | Standard or separately scoped design work |
| Product categories, policies, catalogue, shipping rates | Client configuration/data | Client project configuration/data | Standard setup scope |
| Custom measurements module | Optional reusable module | Master module plus client configuration | Enable/price as applicable |
| A feature likely useful to many handmade apparel stores | Candidate master enhancement | Evaluated in master first | Planned product work after approval |
| One client’s internal production approval flow | Client custom | Client project | Separate paid development scope |
| Client wants source-code ownership/handover | Commercial/contract exception | Requires legal and delivery decision | Not default; requires explicit agreement |

## 8. Master Promotion Policy

A client custom must not be copied into the master template merely because it has been built once. Promotion is allowed only after an evidence-based review.

| Promotion gate | Required evidence |
|---|---|
| Reuse potential | The feature addresses a recurring need for multiple target handmade clients. |
| Product fit | It supports the single-store direct-to-consumer product model. |
| Design abstraction | It can be configured rather than carrying one client’s visual identity or workflow assumptions. |
| Data and migration design | Schema, data lifecycle, permissions, export/import and backward compatibility are defined. |
| Integration design | Provider and credential boundaries are clear; no client account dependency is embedded. |
| Quality evidence | Functional, failure-path, security, accessibility and performance tests are defined and passed. |
| Documentation | PRD, scope, system, API, security, test and deployment documents are updated. |
| Release plan | Version number, migration path, rollback plan and client adoption plan are approved. |

If the feature does not meet all gates, it remains isolated in the client project.

## 9. Versioning and Update Policy

The master template must have controlled versions. A version identifies the exact reusable product baseline a client store began from and helps determine which later updates may be safely applied.

| Release type | Meaning | Example impact |
|---|---|---|
| Maintenance release | Bug fix, security patch, non-breaking performance improvement or documentation correction | May be offered broadly after validation. |
| Feature release | New backward-compatible module or capability | Client adoption requires configuration and testing. |
| Breaking release | Change that requires data migration, integration action, frontend adaptation or operational retraining | Client upgrade must be separately planned and approved. |

No client production deployment is automatically upgraded solely because the master template changed. Each upgrade requires compatibility assessment, backup, test environment validation, rollout plan and rollback plan.

## 10. Source Ownership and Access

The default commercial model is that the developer owns and maintains the master template. The client receives a deployed application and agreed administrative access. Client content, product data, customer data, payment accounts, domains and other business-owned assets remain subject to the client agreement and applicable obligations.

If a client requests source-code handover, exclusive ownership, unrestricted redistribution rights, or third-party development rights, that is not a standard technical configuration. It requires an explicit commercial and legal agreement before work is committed.

## 11. Storefront Redesign Guardrails

Complete storefront redesign is a planned capability. It must not weaken accessibility, SEO, performance, core payment/order behaviour, security or administrative consistency.

| Storefront area | Design flexibility | Non-negotiable guardrail |
|---|---|---|
| Brand style | Full | Maintain accessible contrast, responsive usability and semantic structure. |
| Navigation | High | Preserve discoverability, cart/account access, search where required and mobile usability. |
| Product cards | High | Preserve price, availability, product identity, variant/quick-action behaviour and image performance. |
| Product pages | High | Preserve required product inputs, price clarity, stock/made-to-order status, policy links and cart integrity. |
| Campaign pages | Full | Preserve performance, analytics and content-management boundaries. |
| Cart/checkout visuals | Controlled | Do not alter the validated commerce contract without approved product and QA work. |

## 12. Required Records for Each Client

A client project must have, at minimum, its own discovery/scope brief, selected master version, storefront design brief, integration configuration record, data/import plan, launch checklist, client access record, support boundary, release log and change-request history. These templates will be defined in later documentation batches.

## Related Documents

`02_project_instruction.md` provides standing rules. `04_feature_scope.md` classifies what is core, optional, future and custom. `05_commerce_rules.md` defines standard commercial behaviour. `07_memory.md` records change and promotion decisions. `29_implementation_plan.md` will define the long-term rollout sequence.
