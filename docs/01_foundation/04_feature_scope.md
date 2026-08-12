# Odhvica — Feature Scope

| Field | Value |
|---|---|
| Document ID | 04 |
| Status | Approved foundation |
| Version | 0.1 |
| Product | Odhvica reusable handmade-fashion e-commerce template |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document controls feature scope for Odhvica. The product goal is to provide an advanced, fast and reusable e-commerce foundation for handmade-fashion stores. The goal is not to add every feature available in commercial platforms before the reference store is reliable.

Scope control is essential because Odhvica serves two objectives at once: it must successfully run the Odhvica reference store and it must become a maintainable master template for future client stores. A feature is valuable only when it improves a proven commerce workflow, strengthens the reusable foundation, or has a clearly paid and isolated client-specific purpose.

## 2. Scope Categories

| Category | Meaning | Release treatment |
|---|---|---|
| Core / Must | Required for a credible, launchable handmade-fashion store and the reusable template baseline. | Included in the reference-store build. |
| Advanced / Should | Valuable operational or conversion capability that follows stable core flows. | Planned after core acceptance; may be included when dependencies are ready. |
| Optional module | Reusable capability enabled only for clients who need it. | Built and priced as a module; configuration remains client-specific. |
| Future / Later | Legitimate strategic capability, but not required to prove the reference store. | Deferred until a documented decision and roadmap slot. |
| Client custom | A requirement with narrow, one-client value. | Scoped, priced, isolated and not merged into master by default. |
| Out of scope | Not aligned with Odhvica’s current product model. | Not built unless the product strategy changes. |

## 3. Core / Must Scope

The following capabilities are mandatory for the reference-store MVP because without them Odhvica would not be a complete direct-to-consumer store.

| Domain | Core capabilities |
|---|---|
| Storefront foundation | Responsive home, navigation, search, collections, product pages, cart, checkout, policy pages, contact and brand-story content. |
| Catalogue | Products, collections, categories, variants, SKU, product media, pricing, sale/reference pricing, stock, product status, SEO fields and merchandising. |
| Handmade products | Size, material, care, made-to-order status, production lead time, unique variation disclosure, optional product custom fields and order-level notes. |
| Customer purchase | Guest checkout, optional customer account, addresses, cart persistence, order confirmation and order-status access. |
| Payments | Configured Razorpay route for India and configured Stripe/PayPal paths for eligible international orders. |
| Shipping | Shipping zones, shipping methods, free-shipping rules, delivery estimates, fulfilment state and manual tracking entry. |
| Admin core | Products, collections, orders, customers, inventory, promotions, content, shipping, store settings, staff access and basic reporting. |
| Promotions | Product sale price, discount codes, eligibility rules and basic automatic-promotion capabilities. |
| Trust and support | Store policies, returns/refunds messaging, reviews foundation, customer-contact route and transactional messages. |
| Growth foundation | Product and collection SEO controls, structured public-page foundations, analytics configuration and marketing-consent capture. |
| Operations | Error handling, backups, role permissions, test coverage for critical commerce flows and deployment/rollback process. |

## 4. Advanced / Should Scope

These features should be planned after the core platform passes acceptance. They are likely valuable for an advanced handmade-fashion store but must not delay a stable checkout, order or catalogue foundation.

| Domain | Advanced capability | Reason for priority after core |
|---|---|---|
| Merchandising | Rich recommendation blocks, recently viewed products, product bundles and complete-the-look suggestions | Needs stable product and collection metadata first. |
| Customer experience | Wishlist, saved preferences, review moderation, gift-wrap selection and gift-message management | Valuable but not required for the first completed order. |
| Handmade workflow | Measurement profile reuse, reference-image upload, advanced validation and manual design-approval status | Requires careful data, privacy and fulfilment design. |
| Shipping | Courier label generation, live shipping rates, pickup requests and tracking-status synchronisation | Depends on courier/provider contracts and failure handling. |
| Customer support | Structured cancellation, return, exchange and refund request flows | Needs policy, roles, inventory and payment reconciliation design. |
| Promotions | Tiered discounts, gifts with purchase, bundles, campaign scheduling and customer-segment offers | Must not create price/stock correctness risks. |
| Reporting | Conversion funnels, customer cohorts, margin-aware reports, campaign attribution and stock forecasting | Depends on clean data collection and reporting definitions. |
| Content | Editorial lookbooks, shoppable stories, artisan profiles and richer campaign-page controls | Requires final content model and storefront design system. |
| International selling | Regionalised content, locale-specific market settings and more refined currency/price rules | Requires validated commercial and legal decisions per market. |

## 5. Optional Reusable Modules

Optional modules are intentionally separate from the mandatory commerce core. They should have defined configuration, dependencies, entitlement, documentation and test coverage before being offered to clients.

| Module | Intended use |
|---|---|
| Custom measurements | Tailored jackets, garments, made-to-measure pieces and garment fit information. |
| Personalisation | Monogram, engraving, custom text, gift message, colour or material choices. |
| Made-to-order operations | Production queues, lead times, order review, custom approval and handcrafted status handling. |
| Courier automation | Provider-specific labels, tracking sync, pickup scheduling and shipment events. |
| Returns and exchange portal | Customer-request workflow linked to orders, policies, inventory and refund handling. |
| Reviews and UGC | Product review collection, moderation, image reviews and storefront display. |
| Wishlist and back-in-stock | Customer intent capture and targeted notification. |
| Loyalty and referrals | Repeat-customer programmes after consent and communication foundations are mature. |
| Wholesale / B2B | Restricted catalogue/pricing, account approval, purchase-order flows and bulk ordering. |
| Subscription / pre-order | Repeat products or future-production releases where the business model supports them. |

## 6. Future / Later Scope

The following are strategic possibilities, but they are not first-version commitments. They may be considered only when the core template is stable, monitored, documented, and operating successfully for more than one use case.

| Capability | Why deferred |
|---|---|
| Native Android and iOS applications | The web commerce foundation and API contracts must be stable before mobile clients are added. |
| Advanced headless marketplace connectors | Adds external dependency and operational complexity. |
| Multi-vendor seller management | Changes the product from a single-store platform into a marketplace model. |
| Point of sale | Requires in-person inventory, payment and hardware workflows. |
| Full ERP/accounting replacement | Requires specialist financial, warehouse and regulatory design. |
| AI merchandising or support automation | Must demonstrate a safe, valuable and measurable business case before inclusion. |
| Complex global tax automation | Requires jurisdiction-specific legal and provider review. |
| Multi-language content-management system | Should follow validated localisation priorities and content governance. |

## 7. Client Customisation Boundary

A fully redesigned storefront is an expected client implementation activity, not a product deviation. Brand assets, visual language, page layout, campaign direction, navigation presentation, product-card design and editorial content may be custom-built while consuming the stable commerce system.

A client custom feature is different. It changes operational, payment, order, data, administration or integration behaviour in a way that is not covered by the standard template. Such work must have a separate written scope and must not be represented as a default product capability.

| Request type | Classification | Default treatment |
|---|---|---|
| New brand look and storefront layout | Standard client implementation | Design and build inside the client storefront layer. |
| Product catalogue/import and store settings | Standard configuration | Configure client deployment and data. |
| Existing module such as custom measurements | Optional reusable module | Enable after scope, entitlement and test checks. |
| New feature useful for multiple handmade stores | Candidate master enhancement | Evaluate using the admission process below. |
| One client’s proprietary order/approval process | Client custom | Build in the client project unless explicitly promoted later. |
| Marketplace seller onboarding | Out of scope | Decline unless product strategy is formally changed. |

## 8. Master Feature Admission Process

A new feature can enter the master template only after it passes the following questions.

| Decision question | Required answer before master inclusion |
|---|---|
| Reuse | Is the feature likely to be useful for multiple future handmade-category clients? |
| Product fit | Does it support the single-store direct-to-consumer model? |
| Design fit | Can it be configured without forcing one client’s brand/process onto others? |
| Data impact | Are new records, permissions, migrations, exports and retention rules defined? |
| Commerce impact | Are price, payment, tax, inventory, order and fulfilment effects known? |
| Security impact | Are access control, privacy, file handling, provider credentials and failure modes documented? |
| Delivery impact | Is the feature testable, deployable, observable and reversible? |
| Commercial impact | Is the implementation and ongoing support effort justified? |

If any material answer is unknown, the request remains a client custom or backlog candidate rather than a master-template change.

## 9. Scope Change Protocol

All scope changes must state the requested outcome, user role, business rationale, affected flows, data impact, integration impact, acceptance criteria, estimate, risks, source-code location, and decision outcome. The product owner must approve additions that change committed release scope.

Emergency bug fixes may be made to protect customers or operations. They must still be documented afterward in `07_memory.md` with the incident context, permanent corrective work and release impact.

## 10. Scope Principles

Odhvica may eventually provide capabilities comparable to advanced paid e-commerce extensions, but feature quantity is not the product objective. The objective is a fast, reliable, visually premium and maintainable commerce system for handmade brands. Core commerce correctness, operational usability, storefront conversion, security, performance and reuse discipline take priority over feature count.

## Related Documents

`03_prd.md` defines the detailed requirements. `05_commerce_rules.md` will define promotion, order, payment, refund, shipping, tax and regional decision rules. `06_reuse_model.md` governs how approved enhancements move between a client project and the master template.
