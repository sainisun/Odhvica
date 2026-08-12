# Odhvica — Contributor Guide

| Field | Value |
|---|---|
| Document ID | 08 |
| Status | Active contributor guidance |
| Version | 0.1 |
| Applies to | Developers, designers, QA contributors and future AI-assisted project work |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This guide tells any future contributor how to work on Odhvica without breaking the master-template model. It is intentionally practical: read the right documents first, identify where a request belongs, make only approved changes, validate important commerce paths, update documentation, and preserve client separation.

Odhvica is a reusable single-store e-commerce template for handmade-fashion brands. It is not a multi-tenant marketplace. A contributor must therefore distinguish between changes that belong to the protected master template and changes that belong only to an independent client store.

## 2. First Principles

| Principle | Contributor instruction |
|---|---|
| Master template protection | Treat the master source as a product baseline, not as a place to accumulate every client request. |
| Client independence | Never reuse production client data, images, credentials, domains, analytics IDs, payment accounts or policies in another client project. |
| Fixed admin, flexible storefront | Keep standard admin workflows consistent; allow full storefront redesign through stable commerce contracts. |
| Handmade-commerce fidelity | Account for unique inventory, made-to-order timing, custom inputs, textile variation, size/fit, artisan story and delivery expectations. |
| Performance and SEO | Prefer fast, accessible, indexable and mobile-first solutions. Do not add visual or tracking features without evaluating their cost. |
| Evidence over assumption | Verify provider, security, legal, payment, shipping and integration requirements before claiming support. |
| Documentation as product work | If behaviour changes, update the relevant documentation in the same change. |

## 3. Required Reading Before Work

A contributor must read the applicable documents before changing product behaviour.

| Type of work | Required documents |
|---|---|
| Any Odhvica work | `01_project_summary.md`, `02_project_instruction.md`, `07_memory.md`, this guide |
| New or changed feature | `03_prd.md`, `04_feature_scope.md`, `05_commerce_rules.md` |
| Client implementation | `06_reuse_model.md` and the client’s scope/configuration/launch records |
| Storefront redesign | Product/UX/design-system documents once produced, plus client design brief |
| Payments, shipping or notifications | Commerce rules, integration, security, legal and testing documents once produced |
| Database/API work | System design, schema, API contracts, security and test documents once produced |
| Deployment/release | DevOps deployment, testing, security and implementation plan documents once produced |

If documentation is missing or contradictory, do not invent a permanent behaviour. Record the uncertainty, ask the product owner for a decision, and update `07_memory.md` when the decision is made.

## 4. Request Classification Workflow

Before estimating or building, classify the request.

| Question | If yes | Result |
|---|---|---|
| Is it brand content, logo, imagery, colors, typography or layout? | It affects customer-facing presentation only. | Client storefront configuration/redesign. |
| Is it an existing setting, page block, module or documented feature? | It does not require new core behaviour. | Client configuration or optional-module enablement. |
| Does it modify cart, checkout, payment, order, inventory, customer, data or security behaviour? | It changes commerce logic. | Product/architecture review required. |
| Is it likely needed by multiple handmade clients? | It may strengthen the reusable product. | Candidate master enhancement. |
| Is it unique to one client’s internal process? | It lacks broad reuse. | Client custom; isolate from master. |
| Does it create marketplace/multi-vendor behaviour? | It changes the product model. | Out of scope unless strategy changes. |

A contributor must not start implementation until the classification and the intended source-code location are clear.

## 5. Standard Work Sequence

| Step | Contributor action |
|---:|---|
| 1 | Read applicable documents and identify the current master/client version. |
| 2 | State the business outcome, actor, affected flows, acceptance criteria and classification. |
| 3 | Identify data, API, integration, permission, legal, privacy, security, performance and deployment impact. |
| 4 | Obtain required scope/architecture approval before changing high-risk paths. |
| 5 | Implement the smallest correct change in the correct layer. |
| 6 | Add or update normal, invalid and failure-path tests. |
| 7 | Validate responsive, accessibility, security, performance and SEO impact as applicable. |
| 8 | Update relevant Markdown documents and `07_memory.md` where a material decision changed. |
| 9 | Prepare release notes, migration steps and rollback instructions if required. |
| 10 | Obtain approval and deploy through the documented release process. |

## 6. High-Risk Paths

The following areas require explicit review and cannot be modified as a casual visual or content change:

| High-risk area | Why it requires care |
|---|---|
| Authentication and permissions | May expose customer, admin or operational access. |
| Payment initiation, confirmation, refund or reconciliation | May create financial, duplicate-order or customer-trust issues. |
| Checkout total calculation | Affects price, discounts, shipping, tax, currency and payment correctness. |
| Inventory/stock reservation | May oversell one-of-a-kind or limited handmade products. |
| Order and fulfilment state | May cause wrong customer messages or fulfilment actions. |
| Customer data and uploaded files | Creates privacy, retention and access-control obligations. |
| Shipping/courier workflow | May promise unsupported delivery or corrupt tracking/fulfilment state. |
| Database migrations | Can affect live orders, customers, catalogue and integrations. |
| Production deployment/secrets | Can cause outage, data loss or credential exposure. |

For high-risk work, the contributor must document the proposed state change, affected records, permissions, failure handling, test plan, release plan and rollback path.

## 7. Storefront Redesign Rules

A client storefront may be fully redesigned, but the redesign must not mutate the stable commerce contract without approval. A fresh visual design should consume the existing product, cart, customer, search, checkout and content interfaces whenever possible.

| Allowed without core rewrite | Requires product/architecture review |
|---|---|
| New visual system, typography, color palette, content hierarchy and campaign creative | New checkout or payment behaviour |
| New home, collection, lookbook and product-page compositions | New order states, refund rules or fulfilment logic |
| New navigation, search presentation, filtering UI and product-card layouts | New data requirements or product customisation semantics |
| New responsive layouts and microinteractions | Bypassing validation, inventory or eligibility rules |
| Client-specific content blocks and storytelling | Changing security, permissions, pricing or customer-data handling |

The contributor must preserve semantic markup, accessible focus/keyboard behaviour, image performance, mobile usability, analytics instrumentation, policy visibility, price clarity and customer trust signals.

## 8. Master-Template Contribution Rules

A change may enter the master template only when it is reusable, documented, tested and free of client-specific data or assumptions.

| Master contribution check | Required evidence |
|---|---|
| General need | At least a credible multi-client handmade-commerce use case. |
| Configuration design | The feature can be enabled/configured without custom code for each future client. |
| UI separation | The feature does not force a particular client’s storefront visual design. |
| Data design | Schema impact, historical data, migration and deletion/export behaviour are defined. |
| Security | Roles, permissions, validation, secrets and privacy impact are reviewed. |
| Integration | Provider contracts, credentials and error behaviour are documented. |
| Quality | Test plan covers normal, invalid, failure and regression paths. |
| Operations | Deployment, monitoring, rollback and support implications are known. |
| Documentation | Relevant files and decision log are updated before release. |

If these conditions are not met, build the feature only as an explicitly scoped client custom or defer it.

## 9. Data and Secret Handling

Credentials, payment keys, private customer data, production order data, addresses, access tokens, webhooks, private media and database backups are sensitive. They must not be committed to source control, embedded in screenshots, copied into normal documentation, transmitted through insecure channels or reused across clients.

Use environment-specific configuration and the approved deployment process. When documenting an integration, describe the type of secret and the configuration location, never the secret value itself. Access must follow least privilege and be removed when no longer needed.

## 10. Documentation Update Map

| Change type | Documents likely to update |
|---|---|
| New product feature or scope change | PRD, feature scope, decision memory, implementation plan |
| Pricing, promotions, refunds, shipping or checkout rule | Commerce rules, system design, API contracts, testing, legal/integration documents |
| Client/master separation decision | Reuse model, project instructions, decision memory |
| New storefront pattern | Storefront UX, design system, content model, accessibility and performance plan |
| New admin workflow | Admin UX, PRD, roles/permissions, testing documentation |
| Database or API change | Schema, system design, API contracts, security, testing and migration/release notes |
| Provider integration | Integration, security, legal/compliance, testing and deployment documentation |
| Deployment/operational change | DevOps, security, testing, implementation plan and decision memory |

## 11. Quality Expectations

A completed change must be understandable, testable and maintainable. It must not merely render correctly in one browser or environment. Verify the relevant customer and admin flow, invalid input, error state, loading state, mobile layout, accessibility, permissions, SEO/rendering implications, performance impact, integration failure behaviour and release/rollback plan.

For Odhvica specifically, always check product variant selection, handmade custom input preservation, stock/made-to-order messaging, pricing/discount accuracy, shipping eligibility, payment state, order creation, confirmation communication and admin visibility whenever those paths are affected.

## 12. Communication Expectations

Use precise language in issues, requirements and release notes. State what changes for the user, what remains unchanged, where the change belongs, what data is affected, what must be tested, and whether client action is required. Do not promise a feature until it is approved and scoped.

When communicating with a client, distinguish between standard included capability, configurable option, optional paid module and client-specific development. Do not expose another client’s implementation, data, design or commercial information.

## 13. Definition of Done

A task is complete only when the approved requirement is implemented in the correct project layer, relevant tests pass, high-risk paths are reviewed, documentation is current, configuration is documented, release/rollback impact is known, and the result has passed the required acceptance gate.

## Related Documents

`01_project_summary.md` through `07_memory.md` form the foundational reference set. Later documents will add detailed UX, design-system, architecture, data, API, integration, security, performance, test and deployment instructions.
