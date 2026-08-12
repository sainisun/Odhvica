# Odhvica — Phase-wise Implementation Roadmap and Task Backlog

| Field | Value |
|---|---|
| Document type | Detailed implementation roadmap and task backlog |
| Project | Odhvica reusable handmade-commerce platform template |
| Status | Approved technology baseline; build not yet started |
| Delivery model | Odhvica reference store first, followed by protected master-template hardening and independent client deployments |
| Version | 1.1 |
| Last updated | 2026-08-12 |

## 1. Purpose

This roadmap converts the approved Odhvica specifications into a practical implementation sequence. It defines the work in delivery phases, epics, task identifiers, dependencies, acceptance criteria and release gates. It does **not** assign calendar estimates because actual duration depends on final provider accounts, product data readiness, design decisions, test results and the number of approved custom workflows.

The roadmap follows one principle throughout: build a small, complete, secure commerce path first; prove it on the Odhvica reference store; then add advanced modules in controlled releases. The goal is not to recreate every e-commerce feature at once. The goal is to create a stable reusable foundation that can later support separately deployed client stores.

> **Build strategy:** establish platform controls first, launch a complete end-to-end handmade purchase flow second, strengthen operations and growth features third, and only then harden the source as a reusable client template.

## 2. Approved Technology Baseline

| Technical concern | Approved baseline |
|---|---|
| Full-stack framework | Next.js App Router with TypeScript |
| UI system | React, Tailwind CSS and Odhvica reusable component/design-token system |
| Database | PostgreSQL, isolated per client deployment |
| Data access | Drizzle ORM, schema migrations and transaction-aware commerce services |
| Authentication | Better Auth with customer/admin identity, sessions and role foundation |
| Validation | Zod at public, admin, API and provider boundaries |
| Asynchronous work | Redis and BullMQ when retries/queues are required |
| Media | S3-compatible object storage, ideally client-owned bucket/namespace |
| Payments | Razorpay, Stripe and PayPal adapter model |
| Deployment | Docker, Docker Compose and client-scoped Hostinger VPS environment |
| Ingress/HTTPS | Caddy reverse proxy with HTTPS |
| Testing | Vitest for unit/integration tests and Playwright for browser end-to-end flows |
| Observability | Structured logs, health checks, error tracking, metrics and alerts |
| Future mobile | Documented service/API contracts for an Expo/React Native application after web core stability |

## 3. Delivery Principles and Non-Negotiables

| Principle | Implementation rule |
|---|---|
| Modular monolith first | Keep storefront, admin and commerce services in one maintainable Next.js system with clear modules. Do not introduce microservices without measured need. |
| Server-authoritative commerce | Prices, discounts, stock, shipping eligibility, payment state and order state are recalculated and validated on the server. |
| Client isolation | Every future client receives a separate repository/project, database, media boundary, domain, provider credentials, VPS environment and backups. |
| Master-template protection | Client-specific work does not enter the protected master source automatically. A feature is promoted only after reuse, quality and security review. |
| Accessibility and performance | Mobile responsiveness, semantic markup, keyboard use, meaningful alternative text, low media weight and Core Web Vitals are built into every public feature. |
| Security by default | Secrets never enter source control, provider callbacks are verified, roles are enforced server-side and sensitive operational actions are audited. |
| Test before launch | No feature is “done” until its defined functional, security, accessibility and regression checks pass. |
| Content/legal ownership | Each client owns and approves brand claims, policies, tax/customs decisions, product information and third-party accounts. |

## 4. High-level Delivery Flow

```mermaid
flowchart LR
    P0[Phase 0
Decisions and readiness] --> P1[Phase 1
Platform foundation]
    P1 --> P2[Phase 2
Storefront foundation]
    P2 --> P3[Phase 3
Catalogue and content]
    P3 --> P4[Phase 4
Cart, checkout and orders]
    P4 --> P5[Phase 5
Admin operations]
    P5 --> P6[Phase 6
Growth and advanced operations]
    P6 --> P7[Phase 7
Quality hardening]
    P7 --> P8[Phase 8
Odhvica production launch]
    P8 --> P9[Phase 9
Master hardening and client rollout]
```

## 5. Roles and Ownership

| Role | Primary responsibility |
|---|---|
| Product owner | Scope decisions, release approval, business rules, Odhvica catalogue/content and client-template direction. |
| Technical lead | Architecture, module boundaries, security, migrations, deployment, code review and master-template governance. |
| Frontend/UI developer | Storefront and admin implementation, responsive quality, design-system use and accessibility. |
| Backend/commerce developer | Catalogue, pricing, stock, checkout, order, payment, fulfilment, API and provider integration logic. |
| QA owner | Test strategy, test data, browser/device coverage, release evidence and defect triage. |
| DevOps/operations owner | VPS, DNS, Docker, secrets, backups, monitoring, incident and rollback readiness. |
| Store operator/client owner | Catalogue operations, provider accounts, policies, shipping/tax business inputs, user acceptance and launch sign-off. |

One person can perform multiple roles during the first reference-store build. The responsibilities should still remain explicit.

## 6. Phase 0 — Decisions, Accounts and Build Readiness

### Objective

Remove blocking ambiguity before code is written. Phase 0 confirms the real production constraints, establishes repository governance and prepares safe non-production infrastructure.

### Epic P0-A — Product and provider decisions

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P0-A1 | Freeze Odhvica v1 scope from `03_prd.md`, `04_feature_scope.md` and `05_commerce_rules.md`. | Approved documents | Must-have, later and excluded scope are explicitly tagged. |
| P0-A2 | Finalise initial countries, currencies, shipping zones, GST/tax-invoice scope, tax/display assumptions and made-to-order lead-time rules. | P0-A1 | A signed business configuration sheet exists, including whether India GST is enabled and the required supplier/B2B invoice data. |
| P0-A3 | Confirm payment-account eligibility, supported countries/currencies, provider-hosted payment flow and test/live onboarding requirements for Razorpay, Stripe and PayPal. | P0-A2 | Enabled routes, unavailable routes, client merchant ownership, webhook prerequisites and PCI-scope review responsibilities are recorded. |
| P0-A4 | Select initial courier workflow: manual tracking, courier API, or both. | P0-A2 | First-release fulfilment path is clear without unapproved provider dependency. |
| P0-A5 | Select email sender/provider and customer-support channel. | P0-A2 | Test sender, transactional templates and ownership are identified. |
| P0-A6 | Select object-storage provider and client ownership model. | P0-A2 | Bucket/namespace, retention, private-upload policy and backup responsibility are documented. |

### Epic P0-B — Engineering and operational readiness

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P0-B1 | Create branch strategy, pull-request template, issue labels and release convention in GitHub. | Repository available | `main`, feature branches, review policy and version tags are documented. |
| P0-B2 | Create development, staging and production environment inventory. | P0-A3 to P0-A6 | Every environment has an owner and no production secret is used in development. |
| P0-B3 | Provision non-production VPS or equivalent build environment. | P0-B2 | Secure access, operating-system updates, firewall baseline and DNS/test hostname are ready. |
| P0-B4 | Define secret management process, `.env` variable inventory and mandatory admin 2FA/OTP enrolment/backup/recovery policy. | P0-B2 | Secrets are documented by name/owner/environment and excluded from Git; selected admin second-factor flow is approved for staging and production. |
| P0-B5 | Prepare Odhvica reference assets: logo, fonts, visual direction, products, images, policies and test orders. | P0-A1 | A developer can build against real representative data without publishing confidential customer data. |
| P0-B6 | Define test-data and payment-sandbox policy. | P0-A3 | Test accounts, fake addresses, test cards/orders and cleanup procedure are documented. |

### Phase 0 release gate

Phase 0 passes only when provider/account choices, environment boundaries, first-launch business rules, data/assets, secret process and repository workflow are approved. No engineering feature should use an unapproved live secret or invent missing business rules.

## 7. Phase 1 — Platform Foundation

### Objective

Create the secure, deployable modular base that every later feature depends on. At the end of this phase, the application can build, run locally and on staging, authenticate roles, connect to PostgreSQL, run migrations and report health/errors.

### Epic P1-A — Application structure and developer experience

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P1-A1 | Initialise Next.js App Router, TypeScript, strict linting, formatting and package scripts. | Phase 0 gate | Clean checkout builds and runs through a documented command path. |
| P1-A2 | Implement repository/module folder structure from `23_folder_structure.md`. | P1-A1 | Public storefront, admin, domain services, database, integrations and shared UI have clear boundaries. |
| P1-A3 | Configure Tailwind and the first design tokens/primitives. | P1-A1 | Theme values and basic accessible UI primitives are centrally defined. |
| P1-A4 | Add environment validation and configuration loading. | P0-B4, P1-A1 | App refuses unsafe startup when required variables are absent or malformed. |
| P1-A5 | Establish GitHub Actions baseline: install, typecheck, lint, unit test, build and dependency/security checks. | P1-A1 | Pull requests cannot merge when mandatory checks fail. |

### Epic P1-B — Database and identity foundation

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P1-B1 | Provision PostgreSQL and configure Drizzle connection/migration workflow. | P0-B3, P1-A4 | Development and staging database migrations run reproducibly. |
| P1-B2 | Implement base schema: users, roles, permissions, sessions, audit-event foundation and timestamps. | P1-B1 | Database constraints and migration history are version-controlled. |
| P1-B3 | Integrate Better Auth and secure customer/admin session handling, including mandatory 2FA/OTP for every admin-panel staff/owner login. | P1-B2, P0-B4 | Customer registration/sign-in/sign-out/session renewal/reset works in staging; no admin session is issued without the configured second-factor verification. |
| P1-B4 | Add server-side role/permission enforcement and protected admin route boundary. | P1-B3 | Unauthorised/forbidden access attempts are rejected and test-covered. |
| P1-B5 | Implement audit-log service for sensitive actions. | P1-B2, P1-B4 | Actor, action, target, timestamp and outcome can be recorded without leaking secrets. |

### Epic P1-C — Deployment, health and baseline security

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P1-C1 | Create production-ready Dockerfile and Docker Compose topology. | P1-A1, P1-B1 | Application can run from a versioned image with documented persistent volumes/networking. |
| P1-C2 | Configure Caddy for staging domain, HTTPS and reverse proxy. | P1-C1, P0-B3 | HTTPS request reaches application and no internal service is publicly exposed. |
| P1-C3 | Add health/readiness endpoints, structured logging and error-boundary pattern. | P1-A1 | Health status, request errors and correlation IDs can be observed safely. |
| P1-C4 | Add baseline headers, rate-limit strategy, CORS/CSRF decisions and secret-redaction rules. | P1-B3, P1-C2 | Security configuration is documented and automated checks cover critical boundaries. |
| P1-C5 | Create backup/restore proof for staging database and configuration. | P1-B1, P1-C1 | A clean restore succeeds in a non-production environment. |

### Phase 1 release gate

A new developer can clone the repository, configure non-production variables, run migrations, start the system through Docker, authenticate as an authorised user and access a secure staging deployment. CI, logging, health checks and a backup/restore proof are available.

## 8. Phase 2 — Storefront Foundation and Design System

### Objective

Build the reusable public storefront foundation and the fixed admin visual foundation. This phase creates the structures that later client storefront redesigns can safely replace without breaking commerce behaviour.

### Epic P2-A — Design system and responsive shell

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P2-A1 | Implement semantic design tokens: color, spacing, typography, borders, motion and breakpoints. | P1-A3 | Tokens can be replaced by a client theme without editing business logic. |
| P2-A2 | Build accessible primitives: buttons, links, fields, selects, dialogs, drawers, alerts, tabs, status badges and loading/error states. | P2-A1 | Components pass keyboard/focus/label/error-state tests. |
| P2-A3 | Build responsive public layout: announcement bar, header, navigation, search entry, footer and policy links. | P2-A2 | Layout works on approved mobile, tablet and desktop breakpoints. |
| P2-A4 | Build fixed admin shell: navigation, top bar, tables, filters, forms, pagination and status patterns. | P2-A2 | Admin screens share a single consistent operational UX. |
| P2-A5 | Implement storefront theme boundary and composition rules. | P2-A1, P2-A3 | A second visual theme can be demonstrated without changing shared commerce component contracts. |

### Epic P2-B — Public pages, content and SEO baseline

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P2-B1 | Implement content/page model for homepage, campaigns, editorial pages, FAQs, policies and navigation. | P1-B1, P2-A3 | Authorised admin can draft and publish safe structured public content. |
| P2-B2 | Build base public routes: home, about/craft story, contact, FAQ, size guide, care guide, shipping/returns, privacy and terms. | P2-B1 | Required pages render server-side with complete metadata and policy navigation. |
| P2-B3 | Add global metadata, canonical URL, robots/sitemap baseline, structured-data strategy and social-card support. | P2-B2 | Representative public pages produce valid expected metadata. |
| P2-B4 | Add image component rules, responsive image sizes, alt text requirement and media placeholders. | P2-A2, P2-B1 | Public pages do not expose unoptimised original images by default. |
| P2-B5 | Add first accessibility and visual-regression checks for public shell and critical policy forms. | P2-A3, P2-B2 | Keyboard navigation and base visual snapshots are recorded in CI/staging. |
| P2-B6 | Add consent-aware measurement boundary: preference state, provider-neutral data layer, GA4/Meta Pixel loading gate and Google Search Console verification surface. | P2-B2, `14_seo_analytics.md`, `28_legal_compliance.md` | No non-essential analytics/advertising script runs before the applicable consent state; no customer personalisation, address or payment data enters the event layer. |

### Phase 2 release gate

The Odhvica storefront shell renders fast, responsively and accessibly with configurable content, SEO metadata and a consent-aware measurement boundary. A new client can later receive a different visual storefront without rebuilding public route, navigation, page, metadata or component contracts.

## 9. Phase 3 — Catalogue, Content Operations and Product Discovery

### Objective

Implement structured handmade-product management and the customer product-discovery path. This phase transforms the storefront from a visual shell into a browsable catalogue.

### Epic P3-A — Catalogue data and admin management

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P3-A1 | Implement schema/migrations for products, variants, options, media, attributes, collections, SEO fields, publication state and optional India GST/tax-invoice entities. | P1-B1, `18_db_schema.md` | Relationships, constraints and indexes are documented/test-covered; GST fields, invoice sequence and immutable invoice snapshots are inactive unless client tax configuration is approved. |
| P3-A2 | Implement handmade fields: material, care, craft story, origin, size/fit, production lead time, made-to-order and customisation configuration. | P3-A1 | Fields are structured, validated and displayed only where relevant. |
| P3-A3 | Build admin product editor with draft/review/publish/archive state. | P2-A4, P3-A1 | Admin can create, edit, preview, schedule/publish and archive products with validation. |
| P3-A4 | Integrate object storage for product media and controlled customer-upload foundation. | P0-A6, P3-A3 | Upload type/size/access policy and image processing path are enforced. |
| P3-A5 | Build inventory model for ready stock, limited/unique stock and made-to-order status. | P3-A1 | Stock rules are explicit and later checkout service can reserve/decrement safely. |
| P3-A6 | Build collection/category, merchandising and related-product admin workflows. | P3-A3 | Admin can order products and publish collection landing pages. |

### Epic P3-B — Customer discovery and product detail

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P3-B1 | Build collection pages with filtering, sorting, pagination and empty/loading states. | P3-A1, P3-A6 | Filters only expose valid product/variant data and are SEO/performance reviewed. |
| P3-B2 | Build product-detail page: gallery, price, variants, stock/made-to-order state, size/care, delivery information and trust content. | P3-A2 to P3-A5 | Customer cannot choose an invalid variant and receives clear availability information. |
| P3-B3 | Implement product customisation UI and server-side validation: text, options, size/measurements and controlled reference upload. | P3-A2, P3-B2 | Custom inputs are preserved safely and map to the future order snapshot. |
| P3-B4 | Implement search baseline and search-result page. | P3-A1 | Relevant indexed catalogue fields can be searched with safe query handling. |
| P3-B5 | Add product/collection schema metadata and SEO test cases. | P2-B3, P3-B1, P3-B2 | Product and collection metadata/structured data are validated against approved templates. |

### Phase 3 release gate

A store operator can publish representative jackets, bags and made-to-order products. A customer can discover collections, filter/search, understand product detail and select only valid variants/customisation choices on mobile and desktop.

## 10. Phase 4 — Cart, Checkout, Payments and Orders

### Objective

Create the first complete revenue path: from product selection to a verified paid/pending order, inventory/production update and customer confirmation. This is the highest-risk commerce phase and receives the strongest server-side validation and test coverage.

### Epic P4-A — Cart, pricing and availability

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P4-A1 | Implement durable guest/customer cart model and line-item snapshot rules. | P3-B2, P3-B3 | Cart persists expected items and never trusts browser-provided price/stock. |
| P4-A2 | Implement server-side price, discount, tax-display and promotion calculation service. | P4-A1, `05_commerce_rules.md` | Every total is recalculated server-side and covered by calculation tests. |
| P4-A3 | Implement inventory revalidation/reservation strategy for ready/limited inventory. | P3-A5, P4-A1 | Concurrent purchase scenarios cannot oversell according to approved policy. |
| P4-A4 | Implement coupon/discount eligibility, usage limits and audit trail. | P4-A2 | Ineligible or altered coupons do not change order totals. |
| P4-A5 | Implement shipping eligibility, zone/rate/free-shipping rules and delivery estimates. | P0-A4, P4-A2 | Checkout displays only approved rates/methods for eligible destination/order. |
| P4-A6 | Implement optional India GST calculation, B2B GSTIN capture, immutable order tax snapshots and tax-invoice sequence service. | P0-A2, P3-A1, `05_commerce_rules.md` | When enabled by approved client tax configuration, checkout/order records preserve taxable value, HSN/SAC, GST components and invoice context; otherwise the module remains inactive. |

### Epic P4-B — Checkout, payment and order creation

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P4-B1 | Implement checkout address/contact/consent flow with validation, including optional B2B GSTIN/legal-name capture only when GST tax-invoice configuration is enabled. | P4-A5, P4-A6 | Invalid addresses/contact data are blocked; privacy/marketing consent remains separate; ordinary consumer checkout is not forced to provide B2B tax data. |
| P4-B2 | Implement merchant/provider adapter contract, server-side route resolver and Razorpay test integration for eligible India/INR checkout. | P0-A3, P4-B1 | Validated India/INR checkout offers Razorpay only when configured/eligible; provider-hosted initiation and verified callback create correct order/payment records. |
| P4-B3 | Implement Stripe and PayPal adapters behind the same contract for eligible international checkout, including server-side priority/fallback behaviour. | P4-B2 | Stripe is primary when eligible; PayPal is an eligible customer-selectable option/fallback; unavailable methods are not offered and no payment attempt silently changes provider. |
| P4-B4 | Implement webhook signature verification, idempotency, event log and reconciliation routine. | P4-B2 | Duplicate, delayed, invalid and out-of-order provider events are safe and traceable. |
| P4-B5 | Implement immutable order snapshots for product, price, tax/discount, shipping and customisation data. | P4-A1 to P4-A5 | Later catalogue edits do not alter historic order facts. |
| P4-B6 | Implement order state machine: pending, payment review, paid, production, packed, dispatched, delivered, cancelled, refund/return states. | P4-B4, P4-B5 | Invalid state transitions are rejected and every permitted state change is audited. |
| P4-B7 | Implement transactional customer/order confirmation and admin exception notifications. | P4-B5, P4-B6 | Notification failure does not lose/corrupt the order; retry path is visible. |

### Epic P4-C — Commerce quality evidence

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P4-C1 | Add unit/integration tests for totals, promotions, shipping, stock reservation and state transitions. | P4-A1 to P4-B6 | Critical rules have passing and failure-path coverage. |
| P4-C2 | Add Playwright test for guest purchase and customer purchase. | P4-B7 | Test verifies browse-to-confirmation without live-money use. |
| P4-C3 | Add payment-route and provider-event test matrix: India/INR route, international Stripe/PayPal eligibility/fallback, success, failure, pending, duplicate, invalid signature and refund event. | P4-B4 | Each result produces the expected safe state; IP alone cannot select or override the final payment route. |
| P4-C4 | Run security review for checkout, provider callbacks, logging and custom upload boundaries. | P4-B1 to P4-B6 | No high-severity unresolved issue remains. |

### Phase 4 release gate

A customer can complete representative domestic/international test orders through enabled server-selected payment routes. The application verifies provider events, preserves accurate order and optional GST invoice snapshots, protects stock rules, handles failure/duplicate events and gives customer/admin a reliable order record.

## 11. Phase 5 — Admin Operations and Customer Service

### Objective

Make Odhvica operable without developer involvement for everyday store work. The admin remains standardised across future clients while products/content/settings are client-specific.

### Epic P5-A — Store operations

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P5-A1 | Build order workspace: filters, order detail, payment timeline, customisation, production notes, fulfilment and tracking. | P4-B6 | Authorised staff can process an order without direct database access. |
| P5-A2 | Implement inventory adjustments, stock alerts and audit reasons. | P3-A5, P5-A1 | Manual stock changes are permission-controlled and traceable. |
| P5-A3 | Build customer workspace: profile, order history, address, consent and service notes. | P4-B5 | Sensitive customer data is shown only to authorised staff. |
| P5-A4 | Implement return/cancellation/exchange/refund workflows according to approved commerce rules. | P4-B6, P0-A2 | State, payment/refund and stock consequences remain consistent. |
| P5-A5 | Build staff roles and access settings for owner, catalogue/content, fulfilment and support users. | P1-B4 | A lower-privilege role cannot perform owner-only actions. |

### Epic P5-B — Store management and reporting

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P5-B1 | Complete content, navigation, homepage/campaign and policy management workflows. | P2-B1 | Admin content changes have preview/publish safeguards. |
| P5-B2 | Build promotions, discount reporting and redemption visibility. | P4-A4 | Store owner can review active rules and usage outcomes. |
| P5-B3 | Build operational dashboard: sales/orders/status, low stock, fulfilment queue and provider exceptions. | P5-A1 to P5-A3 | Dashboard uses read-optimised queries and does not expose unauthorised data. |
| P5-B4 | Add basic export and privacy-request workflow boundaries. | P5-A3, `28_legal_compliance.md` | Export/deletion requests have permission, audit and operational review controls. |
| P5-B5 | Build optional India GST invoice workspace: invoice view/download, B2B tax details, credit-note/cancellation operation boundary and restricted financial access. | P4-A6, P5-A1 | Authorised finance/owner roles can view historic immutable invoice snapshots; invoice changes follow the approved client tax workflow and are fully audited. |

### Phase 5 release gate

An authorised store owner can publish products/content, manage orders/stock/customers, process approved after-sales actions and view operational exceptions without relying on a developer or direct server/database access.

## 12. Phase 6 — Growth, International Commerce and Advanced Modules

### Objective

Add high-value advanced capabilities only after the revenue and operations core is stable. Every module remains optional, configurable and independently testable for future client deployments.

### Epic P6-A — International and fulfilment enhancements

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P6-A1 | Add multi-region currency display/rounding/eligibility rules. | P4-A2, P4-A5 | Currency presentation never changes authoritative order/payment totals incorrectly. |
| P6-A2 | Add courier adapter(s) for selected provider features: rates, labels and/or tracking. | P0-A4, P5-A1 | Provider failures fall back to safe manual fulfilment process. |
| P6-A3 | Add tracking updates and delivery-status notifications through queued jobs. | P6-A2, P4-B7 | Repeated/failed provider events do not spam or corrupt order state. |
| P6-A4 | Add advanced made-to-order production queue and lead-time visibility. | P5-A1 | Production staff can see requirement, sequence, due expectation and exception status. |

### Epic P6-B — Marketing, retention and discoverability

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P6-B1 | Implement wishlist and save-for-later capability. | P3-B2, P1-B3 | Guest/customer identity handling respects privacy and does not duplicate lines. |
| P6-B2 | Implement review/UGC policy and moderated review workflow. | P5-A3 | Reviews are attributable, moderated and safely displayed. |
| P6-B3 | Add consent-aware email/WhatsApp marketing integration and abandoned-cart workflow. | P0-A5, P4-A1, P5-A3 | Marketing is never sent without applicable consent/operational rules. |
| P6-B4 | Configure GA4, Meta Pixel and Google Search Console on the approved consent-aware measurement boundary; implement discovery/cart/checkout funnel dashboards. | P2-B6, P4-B7, `14_seo_analytics.md` | Client-owned identifiers are isolated; events avoid sensitive data, purchase events deduplicate correctly and Search Console coverage/sitemap checks are operational. |
| P6-B5 | Add deeper SEO content workflow: articles/lookbooks, internal links, redirects and structured-data checks. | P2-B3, P3-B5 | Publishing controls preserve metadata, canonical and redirect integrity. |

### Phase 6 release gate

Each enabled advanced module has its business owner, privacy/security requirements, provider configuration, observability, test coverage and fallback procedure documented. Optional modules do not weaken the stable commerce core.

## 13. Phase 7 — Quality Hardening and Launch Readiness

### Objective

Transform feature-complete software into launch-ready commerce infrastructure through systematic testing, performance work, accessibility validation, recovery testing and user acceptance.

### Epic P7-A — Quality and security hardening

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P7-A1 | Expand Vitest unit/integration coverage for domain services and provider adapters. | Phases 1–6 | Critical commerce/security services meet approved coverage/quality threshold. |
| P7-A2 | Complete Playwright test suite for storefront, checkout, admin and after-sales flows. | Phases 2–6 | Critical release flow passes on Chromium, Firefox, WebKit and mobile emulation where applicable. |
| P7-A3 | Run accessibility audit, fix keyboard/focus/label/contrast/form/media issues and record residual exceptions. | Phases 2–6 | Public and admin critical journeys meet documented accessibility acceptance criteria. |
| P7-A4 | Run performance audit for home, collection, product, cart and checkout pages. | Phases 2–6 | Measured result is within approved performance budgets for representative network/device conditions. |
| P7-A5 | Complete threat-model/security review and remediation: permissions, mandatory admin 2FA/OTP, uploads, provider-hosted payment scope, provider events, rate limits, logs, secrets, privacy/consent controls and backups. | Phases 1–6 | No unresolved critical/high issue exists without explicit documented acceptance; no production admin login bypasses 2FA/OTP. |
| P7-A6 | Run migration, backup and restore drills. | P1-C5, all schema work | Data can be restored to a clean non-production environment and verified. |

### Epic P7-B — Business acceptance and operations readiness

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P7-B1 | Prepare Odhvica representative catalogue, prices, content, policies, shipping configuration and test users. | Phases 2–6 | All business inputs are client-owner approved. |
| P7-B2 | Conduct user acceptance testing with store operator scenarios. | P7-A1 to P7-A5 | UAT outcomes, defects, decisions and sign-off are recorded. |
| P7-B3 | Finalise monitoring, alert routing, incident contacts and support runbook. | P1-C3, P6 modules | Operations owner can detect, triage and escalate common failure conditions. |
| P7-B4 | Finalise release and rollback runbook. | P1-C1 to P1-C5 | Release rehearsal and rollback rehearsal succeed in staging. |

### Phase 7 release gate

Odhvica has passing critical test evidence, resolved launch-blocking defects, accessible and performance-reviewed key journeys, validated recovery capability, business-approved content/policies and operational release/incident readiness.

## 14. Phase 8 — Odhvica Production Launch

### Objective

Safely launch the Odhvica reference store with real infrastructure, live provider accounts, monitoring and ownership handover.

### Production launch checklist

| ID | Task | Acceptance criteria |
|---|---|---|
| P8-1 | Provision production VPS, domain/DNS, Caddy HTTPS and application deployment. | Public domain resolves over HTTPS; internal services remain private. |
| P8-2 | Provision separate production PostgreSQL, media and optional Redis boundaries. | No staging data/credentials are reused in production. |
| P8-3 | Configure live Razorpay/Stripe/PayPal routes that are actually eligible and approved, using the provider-hosted payment flow and documented server-side route rules. | Live webhook verification, route/fallback behaviour and reconciliation are tested with controlled launch procedure. |
| P8-4 | Configure production email, support, GA4, Meta Pixel, Google Search Console, privacy/consent and courier settings. | Senders/domains/events/search property are verified, client-owned and correctly scoped. |
| P8-5 | Import Odhvica catalogue/content and run pre-launch content/legal/business checklist. | All product claims, policies, prices, stock and shipping statements approved by owner. |
| P8-6 | Run production smoke test: browse, search, cart, checkout, payment, order, notification, admin, backup and monitoring. | Every launch-critical pathway is verified with recorded evidence. |
| P8-7 | Perform controlled go-live, observe monitoring and maintain rollback readiness. | No unresolved launch-blocking issue remains during observation window. |
| P8-8 | Conduct post-launch review and prioritise first improvement release. | Observations, issues, metrics and next release backlog are documented. |

### Phase 8 release gate

Odhvica is live, monitored, recoverable and operated through its approved admin workflows. The store is the evidence base for master-template hardening; it is not merely a demonstration site.

## 15. Phase 9 — Master Template Hardening and Client Rollout

### Objective

Convert the proven Odhvica reference implementation into a protected reusable master template. Future clients receive independent deployments from this version, while Odhvica-specific branding/content/secrets remain isolated.

### Epic P9-A — Master-template hardening

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P9-A1 | Remove Odhvica-specific branding, live provider keys, domain assumptions and production content from shared source paths. | Phase 8 | Clean master contains fixtures/configuration interfaces, not Odhvica private/live data. |
| P9-A2 | Create documented client configuration contract for branding, theme, content, catalogue, regions, providers and deployment. | P9-A1 | A developer can identify every client-owned variable without editing core logic. |
| P9-A3 | Produce seed fixtures and a clean demo store for non-production client setup. | P9-A1 | Demo data can provision a safe staging clone. |
| P9-A4 | Tag first reusable master release and publish release notes/migration guidance. | P9-A1 to P9-A3 | Version is immutable, reproducible and linked to test evidence. |
| P9-A5 | Perform a clean clone proof: deploy a new non-production client store from master. | P9-A2 to P9-A4 | Clone contains no Odhvica customer/product/secret leakage and passes baseline tests. |

### Epic P9-B — Future client delivery workflow

| ID | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| P9-B1 | Use client discovery brief to classify standard configuration, redesign, optional module and custom work. | P9-A4 | Scope, ownership, exclusions, account responsibility and acceptance criteria are agreed. |
| P9-B2 | Create isolated client repository, VPS, database, media, domain and provider-account checklist. | P9-A5 | Client infrastructure is isolated and access-controlled. |
| P9-B3 | Apply storefront redesign while keeping admin/core contracts stable. | P9-B1 | New visual design passes responsive/accessibility/performance checks without breaking commerce tests. |
| P9-B4 | Configure/import client catalogue, content, policies, shipping, payment and analytics. | P9-B2 | Client-specific configuration is complete and owner approved. |
| P9-B5 | Execute client launch test, training, plain-business Client Presentation handover, support and release record. | P9-B3, P9-B4, `30_client_presentation.md` | Client store meets the same launch gates used by Odhvica; delivery/ownership/admin/support responsibilities are acknowledged. |
| P9-B6 | Review client-specific features for master promotion. | P9-B5 | Promotion requires repeat-value, design/security review, documentation, tests and migration path. |

### Phase 9 release gate

The master template can create a clean, isolated, branded client store without Odhvica dependencies. Client delivery is a repeatable governed service, not an uncontrolled fork of source code.

## 16. Cross-phase Dependency Map

| Dependency | Why it blocks later work |
|---|---|
| Final provider eligibility/accounts | Payment, email, courier and live production workflows cannot be treated as complete without real provider constraints. |
| Auth/roles before admin | Admin catalogue, orders, customer data and content controls cannot be safely exposed without permission enforcement. |
| Database/schema before commerce | Products, order snapshots, stock, payments, audit and provider events require stable relational models. |
| Catalogue before cart | Cart items must reference valid purchasable variants/options and product rules. |
| Cart/pricing/stock before payment | Payment amount and availability must be recalculated server-side before initiating payment. |
| Verified payment events before fulfilment | Production/dispatch must not rely on browser-only payment claims. |
| Operations/admin before launch | Store owner needs products, orders, content, customer service and exceptions controls. |
| Test/backup/monitoring before production | Successful launch requires recovery and operational confidence, not only feature completion. |
| Odhvica launch before master hardening | Reuse decisions should be based on a proven reference implementation, not assumptions. |

## 17. Priority Rules for the Task Backlog

| Priority | Meaning | Examples |
|---|---|---|
| P0 — Launch blocker | Required for safe Odhvica revenue path or infrastructure | Auth, database, product, cart, checkout, payment verification, orders, HTTPS, backups, test evidence. |
| P1 — Strong first-release value | Needed to operate/high-quality storefront, but can follow core vertical slice | Admin reporting, reviews, richer search, wishlists, selected courier integration. |
| P2 — Controlled later expansion | Important only after real usage proves need | Advanced marketing automation, complex shipping rules, wholesale, native mobile app. |
| Custom client | Client-funded unique workflow | Must remain isolated unless master-promotion criteria are satisfied. |

## 18. Definition of Done for Any Task

A task is complete only when all applicable conditions below are satisfied.

| Area | Required evidence |
|---|---|
| Requirements | Acceptance criteria met; scope/classification is still valid. |
| Implementation | Module boundary respected; no secrets, temporary bypasses or undocumented assumptions. |
| Tests | Relevant unit/integration/end-to-end tests written or updated and passing. |
| Security | Inputs/permissions/provider callbacks/logging/storage addressed for the risk level. |
| UX/accessibility | Responsive states, keyboard/focus, labels/errors, loading/empty/error states reviewed. |
| Performance/SEO | Public-route rendering, media, metadata and query impact considered. |
| Operations | Logging, alerts, migrations, configuration, backup/rollback impact documented where required. |
| Documentation | Relevant project documents, changelog and decision memory updated. |
| Review | Peer/technical review and business/UAT approval received where required. |

## 19. Master Feature-Promotion Checklist

A client-specific capability may enter the protected master source only when it meets every applicable requirement.

| Check | Required question |
|---|---|
| Reuse value | Is the feature likely useful for multiple handmade-commerce clients? |
| Domain fit | Does it belong to Odhvica’s catalogue, commerce, operations or storefront scope? |
| Configuration | Can it be configurable rather than hard-coded to one client process? |
| Data/migration | Is a safe schema/data migration and rollback path defined? |
| Security/privacy | Does it introduce new access, provider, personal-data or file-upload risk? |
| UX | Does it preserve fixed admin usability and flexible storefront boundaries? |
| Quality | Are unit/integration/end-to-end tests, documentation and support guidance available? |
| Versioning | Is it released as a versioned master change rather than copied informally? |

## 20. Immediate Next Actions

The next work should begin with Phase 0. The first formal backlog items are **P0-A1 through P0-B6**. No checkout or product code should begin until provider/account, environment, business-rule and asset decisions are sufficiently locked.

After Phase 0, implementation should proceed in order through the vertical commerce path: **Foundation → Storefront → Catalogue → Cart/Checkout/Orders → Admin Operations → Quality → Odhvica Launch → Master Hardening**. This sequence protects the project from both feature creep and a visually complete but commercially unreliable store.

## Related Documents

This roadmap operationalises `01_project_summary.md` through `30_client_presentation.md`, especially the PRD, commerce rules, reuse model, UX/design, architecture, security, testing, deployment, compliance, client-handover and master-template specifications.
