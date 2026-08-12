# Odhvica — Implementation Plan

| Field | Value |
|---|---|
| Document ID | 29 |
| Status | Approved delivery roadmap; detailed work estimates are created after final technology/provider/brand inputs |
| Version | 0.1 |
| Product | Odhvica reusable handmade-fashion e-commerce template |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document sequences the implementation of Odhvica from documentation-approved concept to launchable reference store and reusable master template. It converts the product, UX, architecture, security, performance, quality, legal/compliance and VPS operations documents into ordered delivery phases with explicit gates.

The plan deliberately starts with a working Odhvica reference store. The objective is to prove a real handmade-fashion commerce workflow before scaling delivery to clients. A future client store is launched from a tested master release, not from an unfinished Odhvica build.

## 2. Delivery Principles

| Principle | Delivery rule |
|---|---|
| Reference store first | Odhvica proves real catalogue, checkout, payment, order and operational workflows before client rollout. |
| Thin vertical slices | Build and test customer/admin flows end-to-end rather than completing isolated UI/data layers that cannot yet sell a product. |
| Security/quality early | Auth, permissions, data model, tests, observability and deployment are introduced alongside the relevant feature, not after all features. |
| Scope control | Core features launch first; advanced/optional/client-custom features follow `04_feature_scope.md`. |
| Client isolation | Every client project is separate from master and other clients from provisioning onward. |
| Documentation parity | Each implementation phase updates the documents that define it and records material decisions in `07_memory.md`. |
| Release gates | No phase is considered complete solely because development work exists; it requires agreed acceptance evidence. |

## 3. Delivery Roadmap Overview

```mermaid
flowchart LR
    P0[Phase 0: Finalise Decisions] --> P1[Phase 1: Foundation]
    P1 --> P2[Phase 2: Catalogue and Storefront]
    P2 --> P3[Phase 3: Cart, Checkout and Orders]
    P3 --> P4[Phase 4: Admin Operations]
    P4 --> P5[Phase 5: Integrations and Growth]
    P5 --> P6[Phase 6: Quality and Launch]
    P6 --> P7[Phase 7: Master Hardening]
    P7 --> P8[Phase 8: Client Store Rollout]
```

| Phase | Outcome |
|---:|---|
| 0 | Final technology, provider, brand and policy decisions ready for implementation. |
| 1 | Secure deployable application foundation, data model, auth, roles, environments and quality pipeline. |
| 2 | Search-friendly responsive storefront and catalogue, including handmade product/variant/customisation model. |
| 3 | Trustworthy cart, checkout, payment, inventory, order, fulfilment and transactional communications. |
| 4 | Complete reusable admin workflows for catalogue, content, orders, customers, promotions and operational settings. |
| 5 | Validated payment/shipping/messaging/analytics integrations and advanced operational/growth modules. |
| 6 | Production-quality Odhvica reference-store launch with security/performance/accessibility/backup/acceptance evidence. |
| 7 | Clean, tagged, documented master template ready for controlled client clones. |
| 8 | Repeatable individual client project onboarding, storefront redesign, launch and upgrade process. |

## 4. Phase 0 — Finalise Implementation Decisions

### Purpose

Before writing production code, finalise the choices that alter architecture, provider contracts, deployment or client delivery. This avoids starting a large build on unverified payment, hosting, media, authentication or legal assumptions.

| Workstream | Required decision/evidence |
|---|---|
| Brand/reference store | Odhvica brand direction, visual references, core catalogue sample, product media plan and initial policy/copy owner. |
| Technical stack | Confirm data access layer, authentication method, job/cache approach, media storage, monitoring/error service and deployment packaging. |
| VPS operations | Confirm expected capacity, operating system, access/backup, reverse proxy, domain and deployment process compatible with target VPS. |
| Payments | Verify actual client eligibility, country/currency/payment method, test mode, verified callback and refund/reconciliation approach for Razorpay, Stripe and PayPal. |
| Shipping | Select initial manual/courier scope, service regions, rate policy, tracking process and provider readiness. |
| Messaging | Select transactional email and optional WhatsApp/SMS provider, sender ownership and consent/template constraints. |
| Compliance | Client/legal owner reviews initial policy, privacy, tax/customs, returns/custom-product and regional selling assumptions. |
| Quality tools | Confirm test, CI, monitoring, backup/restore and release tooling. |

### Exit Gate

The phase exits when the open decisions in `16_architecture_design.md`, `20_integration_spec.md`, `27_devops_deployment.md` and `28_legal_compliance.md` have documented outcomes, owners and implementation consequences.

## 5. Phase 1 — Foundation and Secure Platform Core

### Scope

| Deliverable | Required result |
|---|---|
| Repository and module structure | Master project scaffold follows `23_folder_structure.md`; server/UI/client-theme boundaries enforced. |
| Environment setup | Local/test/staging/production configuration schemas and secret handling established. |
| Database foundation | Initial PostgreSQL schema/migrations for users, roles, store config, catalogue baseline, audit/outbox and common metadata. |
| Authentication and roles | Customer/admin authentication foundation, session handling, role/permission checks and access audit. |
| UI foundation | Shared design tokens/primitives, admin shell and storefront base layout. |
| Observability | Structured logs, request correlation, health checks, error reporting and basic operational dashboard/alert path. |
| Delivery automation | Build/type/lint/test checks and controlled deploy/release workflow baseline. |
| Test foundation | Fixtures/test data, unit/integration/contract/e2e harness and quality reporting baseline. |

### Exit Gate

A developer can deploy a protected application skeleton to a non-production environment, authenticate authorised roles, access a client-isolated database, run migrations, observe health/errors and pass foundation quality checks.

## 6. Phase 2 — Catalogue and Storefront Foundation

### Scope

| Workstream | Required result |
|---|---|
| Catalogue | Product, variant, attributes, media, collection, SEO and publication model as defined in `13_catalog_model.md`. |
| Handmade requirements | One-of-a-kind stock model, made-to-order lead time, size/fit, custom measurement/personalisation rules and variation disclosure. |
| Content | Pages, navigation, homepage blocks, collections, FAQs, policy/link surfaces and publication workflow. |
| Public storefront | Home, category/collection, search, product detail, informational pages and responsive/mobile navigation. |
| Design system | Reusable admin/storefront primitives and documented client theme/configuration boundary. |
| Search/SEO | Public rendering, metadata, canonical/sitemap/redirect foundations and controlled product/collection discovery. |
| Accessibility/performance | Critical page semantics, forms, media, mobile/responsive and budget foundations. |

### Vertical Slice Validation

An authorised admin creates a handmade product with media, size/variant, material/care, lead time and custom input; publishes it to a collection; and a guest can find/read/select it on mobile/desktop without code change or inaccessible/slow critical UI.

### Exit Gate

Core product/collection/content scenarios, search/metadata, responsive UI, admin content/catalogue operations and representative handmade product patterns pass documented functional, accessibility and performance tests.

## 7. Phase 3 — Cart, Checkout, Orders and Fulfilment

### Scope

| Workstream | Required result |
|---|---|
| Cart | Guest/customer cart, line items, valid variant/customisation, quantity, promotion, availability/price refresh and expiry/merge policy. |
| Pricing/promotions | Server-authoritative product/variant pricing, sale/reference price, discount codes, free-shipping and price snapshot. |
| Checkout | Address/region validation, shipping selection, payment-method eligibility, final total, error/retry and guest checkout. |
| Payments | Provider adapter, test/sandbox path, verified callback, idempotency, failure/cancellation, refund/reconciliation foundation. |
| Inventory | Reservation/consume/release/adjustment model that protects unique/limited products. |
| Orders | Correct snapshots, order/payment/fulfilment state, customer confirmation, timeline and support context. |
| Fulfilment | Production queue, packing/shipping state, manual tracking, customer update and exception handling. |
| Notifications | Transactional order/payment/production/shipment/refund messages with queue/retry status. |

### Vertical Slice Validation

A customer purchases a representative ready-stock product and a made-to-order/personalised product using eligible test payment paths. Verified events create exactly one correct order, stock/production state, admin fulfilment record and customer communication. Failure, duplicate event and refund paths are also tested.

### Exit Gate

Critical end-to-end commerce scenarios in `26_testing_quality.md` pass, including checkout tampering, payment event verification, duplicate prevention, inventory conflict, customisation preservation, admin order visibility and safe recovery paths.

## 8. Phase 4 — Reusable Admin Operations

### Scope

| Workstream | Required result |
|---|---|
| Product operations | Product/variant/media/inventory/customisation/SEO create-edit-publish-archive/bulk workflows. |
| Order operations | Search/filter/order detail/timeline, production, fulfilment, tracking, notes and exception queues. |
| Customer service | Customer profile, order context, consent, support request, cancellation/return/exchange/refund workflows. |
| Promotion | Discount/sale/freeshipping create/test/schedule/usage reporting. |
| Content | Homepage/campaign/page/navigation/policy/FAQ publish workflow and preview. |
| Settings | Store, shipping, payment/integration health, notifications, staff/roles and controlled configuration. |
| Reporting | Sales, order, product, inventory, promotion, customer and operational dashboards. |
| Audit | Sensitive actions, state changes, configuration and access activity visible to permitted roles. |

### Exit Gate

A non-technical store owner can run daily catalogue, content, customer, order, fulfilment, promotion and basic settings workflows in the reusable admin panel without developer assistance, while role controls and audit records work correctly.

## 9. Phase 5 — Integrations, Growth and Advanced Modules

This phase activates/reviews advanced capability only after the core commerce path is stable.

| Module | Entry condition | Delivery outcome |
|---|---|---|
| Courier automation | Client/provider account, webhook/rate/label/tracking design and manual fallback ready | Optional courier module with verified events/retry/reconciliation. |
| Reviews/wishlist | Customer account/policy/moderation design stable | Customer/review/wishlist flow with moderation and performance/accessibility checks. |
| Return/exchange portal | Policy, inventory, payment/refund and service workflow approved | Configured customer request and admin resolution module. |
| Email/WhatsApp marketing | Consent/provider/template/legal review complete | Segmented consent-aware campaign/automation capability. |
| Advanced merchandising | Catalogue/content/performance foundation stable | Related products, bundles, campaign scheduling, gift options and selected personalisation. |
| Analytics/ads | Event/consent/purchase deduplication validated | Client-owned measurable funnel/campaign setup. |
| Advanced reporting | Clean data model/volume/definitions ready | Controlled reports/exports with clear data limitations. |

No advanced feature is added merely because an external commerce platform offers it. It must pass product-fit, reuse, security, performance, data, support and commercial-value review.

## 10. Phase 6 — Odhvica Reference Store Launch

### Scope

| Launch area | Required evidence |
|---|---|
| Catalogue/content | Approved real products, images, prices, stock, size/care/material/craft information, policies and brand pages. |
| Client/business config | Odhvica domain, payment/courier/messaging/analytics accounts, region/currency/shipping and admin users. |
| Compliance | Client-owner-approved policies, product claims, consent/tracking and legal/professional review as required. |
| Quality | Functional/security/accessibility/performance/migration/provider tests pass; known issues triaged. |
| Operations | VPS hardening, secrets, backups/restore, monitoring, incident/release/rollback runbooks and access review complete. |
| Acceptance | Owner completes admin training and validates critical customer/admin workflows. |
| Go-live | Domain/TLS, redirects, sitemap/robots, post-deploy smoke test and support contacts active. |

### Launch Gate

Odhvica launches only when the full release gate in `26_testing_quality.md`, client/compliance checks in `28_legal_compliance.md`, deployment gate in `27_devops_deployment.md`, and reference scenarios in `24_reference_implementation.md` are satisfied.

## 11. Phase 7 — Master Template Hardening

After Odhvica is live and operating, convert the validated generic parts into a clean master template release.

| Workstream | Required result |
|---|---|
| Brand separation | Remove Odhvica logo/copy/assets/policies/provider keys/data from reusable master paths. |
| Configuration | Document/validate brand, region, shipping, payment, content, theme and deployment configuration templates. |
| Module classification | Label core, optional, future and client-custom features accurately. |
| Documentation | Confirm all product/UX/architecture/testing/DevOps docs match actual implementation. |
| Versioning | Create tagged master release, release notes, migration notes and upgrade policy. |
| Test suite | Run reusable core suite against brand-neutral fixture store. |
| Client provisioning | Prove a clean non-production clone can be configured without Odhvica data/secrets. |
| Support model | Define client support, change request, update, access and incident process. |

### Exit Gate

A new empty/fixture client project can be created from the master release with no Odhvica business data/secrets/brand dependency, and the documented client onboarding path works in a test environment.

## 12. Phase 8 — Future Client Store Rollout

Each future client store is a separate delivery project, not a new shared tenant.

| Step | Required outcome |
|---:|---|
| 1. Discovery | Client niche, products, markets, policies, integrations, budget/support scope and custom needs documented. |
| 2. Classification | Requests classified as configuration, storefront redesign, optional module, master candidate, client custom, future or out of scope. |
| 3. Master selection | Use a tagged/tested master version; record version and compatibility. |
| 4. Provision | Create separate repository, VPS/environment, database, media, domain, secrets and client accounts. |
| 5. Design | Create full client storefront redesign while retaining stable commerce contracts. |
| 6. Configure | Import catalogue/content/settings; connect payments/shipping/messaging/analytics; publish policies. |
| 7. Validate | Run client launch checklist, payment/shipping/domain/accessibility/performance/SEO tests and owner acceptance. |
| 8. Launch/support | Deploy, observe, train client, document access/support and schedule compatible updates. |

## 13. Master Release and Client Upgrade Policy

| Release type | Client treatment |
|---|---|
| Maintenance/security fix | Assess client compatibility; test and roll out according to support policy, with urgent/security communication when needed. |
| Backward-compatible feature | Offer client opt-in/configuration after documentation and test; do not enable blindly. |
| Optional module | Scope, price/configuration, test and train before client enablement. |
| Breaking change | Plan client-specific migration, backup, staging validation, release window, rollback/forward-fix and owner approval. |
| Client custom | Remains client-scoped until master-promotion gates pass. |

## 14. Delivery Roles

| Role | Responsibility |
|---|---|
| Product owner | Scope, prioritisation, master/client classification, acceptance and commercial decision. |
| Technical lead | Architecture, security, data/API/provider design, code quality, release and operational approval. |
| UX/UI designer | Storefront redesign, design system, responsive/accessibility design and content presentation. |
| Developer | Implement documented requirements, tests, migrations, integrations and documentation updates. |
| QA owner | Test strategy, risk coverage, defect triage, release evidence and acceptance support. |
| Client business owner | Brand/content/catalogue/policy/account approval, operational ownership and launch sign-off. |
| Legal/tax professional | Client-specific policy, tax/customs, consumer/privacy/compliance advice where required. |

## 15. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Uncontrolled feature scope | Use `04_feature_scope.md`, vertical slices and phase gates. |
| Provider/market assumption wrong | Validate official provider eligibility/callback/refund flow before integration commitment. |
| Client-specific changes pollute master | Apply `06_reuse_model.md` promotion gates and separate client repository. |
| Performance degradation from design/tags | Enforce `22_performance_plan.md` budgets/review before launch. |
| Payment/order/stock defect | Critical test matrix, verified events, idempotency, audit and staging validation. |
| VPS outage/data loss | Hardened deployment, monitoring, encrypted backups and restore rehearsal. |
| Missing client policy/content | Block launch until client owner approves required business/legal material. |
| Security/privacy incident | Security review, least privilege, secret handling, access review and incident runbook. |
| Slow operational adoption | Consistent admin UX, training, client acceptance and support documentation. |

## 16. Implementation Plan Acceptance Criteria

This plan is successful when Odhvica moves through documented phases without bypassing scope, quality, security, operational or client-approval gates; launches as a credible independent handmade-fashion store; and produces a clean, tested master template from which future client stores can be delivered predictably.

## Related Documents

`01_project_summary.md` through `28_legal_compliance.md` provide the governing product, UX, architecture, quality, deployment and compliance specifications. `30_client_presentation.md` will translate the customer-facing capability, implementation process and client responsibilities into a client-ready presentation.
