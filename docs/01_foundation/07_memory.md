# Odhvica — Project Memory

| Field | Value |
|---|---|
| Document ID | 07 |
| Status | Active decision log |
| Version | 0.2 |
| Product | Odhvica reusable handmade-fashion e-commerce template |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document is the durable memory for major Odhvica project decisions. It records why a decision was made, what is affected, whether the decision is final or pending, and which document must change if the decision is revised.

This log prevents future developers, designers, and contributors from reopening settled questions without context. It also prevents accidental architectural drift when a client-specific request is mistaken for a master-template requirement.

## 2. How to Use This Log

Each new entry must include a unique decision ID, date, decision, status, context, rationale, impact, owner, and linked documents. Do not use this file for routine task notes, temporary bugs, or informal ideas. It is reserved for decisions that affect scope, architecture, data, security, integrations, deployment, commercial model, user experience, or reuse policy.

| Status | Meaning |
|---|---|
| Accepted | Approved and currently governing the project. |
| Pending validation | Direction is selected, but requires provider, legal, technical or user-experience validation before production use. |
| Superseded | Replaced by a later identified decision; retained for history. |
| Rejected | Considered and intentionally not adopted. |

## 3. Decision Register

### DEC-001 — Product Model: Reusable Independent Client Stores

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted |
| Decision | Odhvica will be a reusable single-store e-commerce template, not a multi-tenant marketplace or a shared SaaS platform. |
| Context | The business objective is to launch stores for multiple clients efficiently without rebuilding the core system every time. |
| Rationale | Separate client deployments provide strong client-data separation and allow storefront redesign without cross-client product constraints. |
| Impact | Each client receives a distinct domain, database, deployment environment, payment credentials and business configuration. |
| Related documents | `01_project_summary.md`, `02_project_instruction.md`, `06_reuse_model.md` |

### DEC-002 — Reference Brand and Initial Product Category

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted |
| Decision | The first reference implementation is named Odhvica and is optimised for handmade-fashion and artisan-accessory products. |
| Context | The initial catalogue direction includes handmade jackets, kimonos, bags, accessories and similar products. |
| Rationale | A focused category produces stronger product, order, content and storefront workflows than a generic early platform. |
| Impact | Catalogue, content, product-detail, made-to-order, media, size, personalisation, shipping and policy design will prioritise this niche. |
| Related documents | `01_project_summary.md`, `03_prd.md`, `05_commerce_rules.md` |

### DEC-003 — Storefront Flexibility and Admin Consistency

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted |
| Decision | The storefront may be completely redesigned for each client; the standard admin-panel design and core operations remain reusable. |
| Context | Each client requires a unique brand experience, while the developer wants to minimise training, support and implementation time for business operations. |
| Rationale | Separating brand/customer experience from core business operations maximises visual flexibility without repeatedly rebuilding catalogue, checkout and order tools. |
| Impact | The design system will have a stable admin layer and a flexible storefront layer. Commerce contracts must remain stable beneath storefront redesigns. |
| Related documents | `02_project_instruction.md`, `03_prd.md`, `06_reuse_model.md` |

### DEC-004 — International Commerce Direction

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Pending validation |
| Decision | The application will be designed for international selling, multiple regions and multi-currency presentation. |
| Context | Odhvica intends to serve all relevant countries for the handmade-product category. |
| Rationale | International demand is important for handmade Indian-fashion products and should be designed into the core commerce model rather than retrofitted later. |
| Impact | Regional checkout eligibility, payments, currency display, shipping zones, tax/duty disclosures, policies and analytics must be configuration-driven. |
| Open validation | Exact countries, currencies, tax/duty treatment, provider support, customer-service coverage and legal obligations remain to be defined. |
| Related documents | `03_prd.md`, `05_commerce_rules.md`, future `20_integration_spec.md`, future `28_legal_compliance.md` |

### DEC-005 — Payment Provider Direction

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Pending validation |
| Decision | Razorpay is the planned India payment route; Stripe and PayPal are planned international payment routes. |
| Context | The product requires domestic and foreign payment capability. |
| Rationale | Separate domestic and international routes can match intended market coverage, subject to provider availability and client account eligibility. |
| Impact | Checkout must support provider eligibility, payment state handling, secure credential configuration, refund paths and provider-specific failure/reconciliation behaviour. |
| Open validation | Supported countries/currencies, account setup, webhook/callback behaviour, dispute rules, fees and refund workflows must be verified before implementation. |
| Related documents | `03_prd.md`, `05_commerce_rules.md`, future `20_integration_spec.md`, future `21_security_blueprint.md` |

### DEC-006 — Hosting and Application Direction

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted direction; implementation details pending |
| Decision | Odhvica will use a Next.js-first full-stack application direction with SEO, lightweight delivery and strong performance as key requirements. Production deployment must be compatible with a Hostinger VPS plan. |
| Context | The product requires a fast, SEO-friendly and independently deployable e-commerce application rather than a constrained hosted marketplace storefront. |
| Rationale | This direction supports server-rendered/discoverable pages and a controlled client-specific deployment model. |
| Impact | Architecture, deployment, media, caching, database, environment management, monitoring and rollback decisions must be validated for VPS operation. |
| Open validation | Final stack components, database, storage, process manager, backups, monitoring, VPS sizing and deployment automation remain architecture decisions. |
| Related documents | Future `16_architecture_design.md`, future `22_performance_plan.md`, future `27_devops_deployment.md` |

### DEC-007 — Client Source-Code Delivery Boundary

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted |
| Decision | The default client delivery is a live deployed website and agreed admin access; the master source code is not handed over. |
| Context | The reusable codebase is the developer’s product asset and enables repeatable service delivery. |
| Rationale | Retaining the protected master template preserves maintainability, version control and the business model. |
| Impact | Contracts, client presentation, access control, support agreements and project repositories must clearly distinguish deployed-store use from source-code ownership. |
| Related documents | `02_project_instruction.md`, `06_reuse_model.md`, future `28_legal_compliance.md`, future `30_client_presentation.md` |

### DEC-008 — Full Store-Owner Admin Operations

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted |
| Decision | Clients will manage routine store operations themselves through the reusable admin panel. |
| Context | The product must be a complete e-commerce package rather than a website that requires the developer for everyday product and order changes. |
| Rationale | Independent operations reduce ongoing manual work and increase the value of the delivered solution. |
| Impact | Admin usability, permissions, catalogue management, orders, promotions, content, settings, reporting, help and quality assurance are core requirements. |
| Related documents | `03_prd.md`, future `10_admin_ux.md`, future `26_testing_quality.md` |

### DEC-009 — Advanced Feature Strategy

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted |
| Decision | Odhvica will aim for advanced e-commerce capabilities, but features will be prioritised and modular rather than all implemented before the core reference store launches. |
| Context | The product owner wants a platform that can exceed typical paid e-commerce add-ons while preserving performance and maintainability. |
| Rationale | Uncontrolled feature accumulation would delay launch and weaken the reusable master template. |
| Impact | The project uses Core, Advanced, Optional Module, Future, Client Custom and Out-of-Scope categories. |
| Related documents | `04_feature_scope.md`, `06_reuse_model.md`, future `29_implementation_plan.md` |

### DEC-010 — Future Mobile Applications

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Deferred |
| Decision | Android and iOS applications may be built later from the same commerce foundation, but are not part of the initial web-app release. |
| Context | The product owner intends to expand to mobile applications in the future. |
| Rationale | Web product, data model, APIs, checkout behaviour and administrative workflows must be stable before mobile applications consume them. |
| Impact | Architecture must avoid web-only assumptions, but native mobile UX and delivery are deferred. |
| Related documents | `03_prd.md`, future `16_architecture_design.md`, future `19_api_contracts.md` |

### DEC-011 — India GST Data and Tax-Invoice Foundation

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted direction; tax validation required |
| Decision | The master template will include optional India GST data and immutable tax-invoice foundations: supplier/customer GSTIN where applicable, HSN/SAC classification, CGST/SGST/UTGST/IGST line and order snapshots, and controlled tax-invoice sequencing. |
| Context | India-based Odhvica stores need a concrete data model for client-approved GST invoice workflows rather than generic tax placeholders. |
| Rationale | Structured invoice snapshots and sequences preserve historic commercial records and avoid retrofitting tax-critical fields after order launch. |
| Impact | `05_commerce_rules.md` and `18_db_schema.md` define configurable GST fields/behaviour. Client tax review remains required for classification, rates, place of supply, invoice format, filing and e-invoice/e-way-bill obligations. |
| Related documents | `05_commerce_rules.md`, `18_db_schema.md`, `28_legal_compliance.md` |

### DEC-012 — Initial Named Analytics Integration Set

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted |
| Decision | The initial supported measurement integrations are Google Analytics 4 (GA4), Meta Pixel and Google Search Console. |
| Context | Generic analytics/pixel language did not define the first provider set or their client/account/consent boundaries. |
| Rationale | Naming an intentionally limited first set creates a clear implementation and client-onboarding baseline without locking the master template to one client account. |
| Impact | Each client supplies its own GA4 property, Meta Pixel and Search Console property/access. Consent-aware loading, data minimisation, staging separation and provider performance review are required. |
| Related documents | `14_seo_analytics.md`, `20_integration_spec.md`, `28_legal_compliance.md` |

### DEC-013 — DPDP Act and GDPR Implementation Mapping

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted implementation mapping; legal validation required |
| Decision | The compliance checklist explicitly maps Odhvica privacy, consent, rights-request, security, retention and vendor controls to assessment of India’s DPDP Act 2023 and GDPR where applicable. |
| Context | Odhvica is India-based and intends international selling, so generic privacy language was insufficient for client launch review. |
| Rationale | A named framework map helps clients and developers identify relevant technical controls without claiming that a template determines legal applicability or compliance. |
| Impact | Client counsel must still assess actual applicability, lawful basis, implementation dates, controller/processor roles, transfers, notices and country-specific obligations. |
| Related documents | `14_seo_analytics.md`, `21_security_blueprint.md`, `28_legal_compliance.md`, `30_client_presentation.md` |

### DEC-014 — Authoritative Payment-Route Resolution

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted direction; provider validation required |
| Decision | Payment eligibility is resolved server-side from validated shipping-address country, configured currency, enabled routing rules, cart/order conditions and provider capability/health. IP geolocation may suggest a pre-checkout context only and cannot select or override a final payment route. |
| Context | Razorpay, Stripe and PayPal require deterministic customer-visible routing and safe fallback behaviour at checkout. |
| Rationale | Validated address/configuration inputs are auditable and avoid exposing customers to incorrect provider/currency routes caused by browser-only or IP-only logic. |
| Impact | India/INR defaults to eligible Razorpay; international checkout prioritises eligible Stripe and offers eligible PayPal as a customer-selected route/fallback; no eligible method blocks payment without silently switching provider. |
| Open validation | Provider country/currency/method capability, merchant account eligibility and exact SDK/webhook flows must be verified before production enablement. |
| Related documents | `05_commerce_rules.md`, `20_integration_spec.md`, `21_security_blueprint.md` |

### DEC-015 — Mandatory Admin 2FA and Provider-Hosted Payment Scope

| Field | Record |
|---|---|
| Date | 2026-08-12 |
| Status | Accepted security control; PCI/merchant validation required |
| Decision | Every production admin-panel staff/owner login requires 2FA/OTP. Razorpay, Stripe and PayPal card routes must use their approved provider-hosted, redirect, hosted-field or tokenised flow; Odhvica never handles raw cardholder data. |
| Context | Admin users can access refunds, financial records, customer data and provider settings; payment integrations require explicit scope boundaries. |
| Rationale | Mandatory second-factor authentication reduces account-takeover risk, while provider-hosted card flow is intended to minimise payment-card handling by the application. |
| Impact | Admin authentication implementation and release tests must enforce 2FA/OTP; new payment form/provider changes require PCI scope review. Client merchants must validate actual PCI DSS/SAQ obligations with their acquirer, provider and qualified assessor where appropriate. |
| Related documents | `20_integration_spec.md`, `21_security_blueprint.md`, `26_testing_quality.md`, `28_legal_compliance.md` |

## 4. Decision Entry Template

Use this template for all future material decisions.

```text
### DEC-XXX — Short Decision Title

| Field | Record |
|---|---|
| Date | YYYY-MM-DD |
| Status | Accepted / Pending validation / Superseded / Rejected |
| Decision | Clear statement of what was decided. |
| Context | Problem, request or constraint that required a decision. |
| Rationale | Why this option was selected. |
| Impact | Product, design, code, data, integration, operations or commercial consequences. |
| Open validation | What remains to be checked, if anything. |
| Related documents | Relevant filenames. |
```

## 5. Change-Control Rules

A decision must be added or updated when it changes a confirmed requirement, master/client boundary, payment/shipping/checkout behaviour, data structure, role permission, security control, deployment approach, ownership model, legal/compliance assumption, or release commitment.

When a decision is replaced, do not delete the original entry. Mark it `Superseded`, add the new decision ID, and state the effective change. This preserves a reliable history for future developers and clients.

## Related Documents

`01_project_summary.md` explains the product context. `02_project_instruction.md` contains standing rules. `04_feature_scope.md` controls future features. `05_commerce_rules.md` defines commercial behaviour. `06_reuse_model.md` defines master/client separation. `30_client_presentation.md` explains the client-facing delivery boundary.
