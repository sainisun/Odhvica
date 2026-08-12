# Odhvica — Reference Implementation

| Field | Value |
|---|---|
| Document ID | 24 |
| Status | Approved reference-store blueprint; final brand assets/catalogue data to be supplied during implementation |
| Version | 0.1 |
| Product | Odhvica handmade-fashion reference store |
| Reuse role | First real implementation and validation baseline for the master template |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

Odhvica is the first complete implementation of the reusable e-commerce template. It is not merely a demo site. It must operate as a real handmade-fashion store and prove the catalogue, storefront, checkout, payment, order, fulfilment, content, SEO, accessibility, performance, admin and deployment foundations before the master template is offered to future clients.

This document defines the reference store’s intended feature configuration, sample catalogue patterns, operational flows, validation scenarios and promotion-to-master evidence. A feature should not be called reusable only because it appears in Odhvica; it becomes reusable after it is correctly implemented, tested, documented and suitable for more than one target handmade client.

## 2. Reference Store Profile

| Area | Reference configuration |
|---|---|
| Brand | Odhvica |
| Category | Handmade jackets, kimonos, robes, bags, accessories and related artisan-fashion products |
| Sales model | Direct-to-consumer web store with international selling capability |
| Product characteristics | Ready stock, limited/unique stock, made-to-order items, variants, material/craft story, personalisation and custom measurements where applicable |
| Storefront objective | Premium visual storytelling, clear product confidence, mobile-first conversion and search discoverability |
| Admin objective | Owner-managed catalogue, orders, customers, promotions, content, shipping, settings and reports |
| Payments | Razorpay for India; Stripe and PayPal for eligible international checkout paths after provider validation |
| Shipping | Configurable zones/methods, free-shipping rules, manual tracking at minimum and courier automation when validated |
| Hosting | Independent deployment compatible with Hostinger VPS |
| Future reuse | Master-template proving ground for future handmade-category client stores |

## 3. Reference Store Success Criteria

| Dimension | Success condition |
|---|---|
| Product discovery | A customer can navigate campaigns/collections/search to the intended product and understand the category. |
| Product confidence | A customer can assess product media, material, craft, size/fit, care, variation, stock/made-to-order state and delivery expectation. |
| Purchase | A customer can select a valid variant/customisation, add to cart, complete an eligible payment path and receive reliable order confirmation. |
| Operations | Owner can add/publish products, manage stock, view payment/order state, fulfil orders, add tracking, respond to requests and update content. |
| International readiness | Store can limit availability by region, communicate shipping/currency context and route eligible payment methods correctly. |
| Quality | Critical flows pass security, accessibility, performance and test requirements. |
| Reuse evidence | Core functionality is documented/configurable and free from unnecessary Odhvica-specific assumptions before master promotion. |

## 4. Reference Catalogue Configuration

The initial reference catalogue must contain enough representative product patterns to validate the real handmade-commerce model. It need not launch with every possible product, but it must exercise each critical business rule.

| Product pattern | Example reference product | What it validates |
|---|---|---|
| Ready-stock single item | Handmade tote bag with one finish | Simple product, media, price, shipping and fulfilment. |
| Size variant garment | Cotton/kantha jacket with size options | Variant selection, size guide, availability, price and stock. |
| Colour/material variant | Bag/accessory with colour/material choices | Variant media, attributes, selection state and availability. |
| One-of-a-kind garment | Vintage/unique Kantha or Suzani jacket | Unique stock, sold-out state and oversell protection. |
| Made-to-order item | Jacket/kimono with configured production period | Production lead time, order state and customer communication. |
| Personalised item | Bag with monogram/embroidered text | Custom input validation, order snapshot and fulfilment visibility. |
| Measurement-based item | Tailored/custom-fit garment | Measurement fields, instructions, privacy controls and production review. |
| Gift purchase | Accessory with gift wrap/message option | Gift inputs and order/fulfilment handling. |
| Sale product | Seasonal product with valid sale/reference price | Price display, promotion/discount logic and cart/checkout snapshot. |

## 5. Reference Collections and Content

The reference store should model both product taxonomy and editorial merchandising. Collection titles/visual design will be finalised with Odhvica brand direction, but their functional purpose should be represented from the beginning.

| Collection / page pattern | Purpose |
|---|---|
| New arrivals | Tests recent-product merchandising and publication flow. |
| Jackets / outerwear | Tests category navigation, size variants and product comparison. |
| Kimonos / robes | Tests style/length/material filters and editorial visuals. |
| Bags / accessories | Tests smaller product types, personalisation and gift merchandising. |
| One of a kind | Tests unique inventory and craftsmanship/variation disclosure. |
| Made to order | Tests production lead-time messaging and custom workflow. |
| Sale / seasonal edit | Tests promotion/sale price/free-shipping campaign communication. |
| Craft / material story | Tests artisan/process/material content, internal linking and trust storytelling. |
| Size and care guides | Tests customer education, support reduction and SEO-accessible informative pages. |
| Shipping / returns / FAQ | Tests policy visibility, support clarity and international customer information. |

## 6. Storefront Reference Requirements

The Odhvica storefront should establish a high-quality reference experience, not a fixed theme copied to future clients. Its page composition should demonstrate how brand story, campaign content, category discovery, product media and commerce detail can coexist.

| Surface | Reference implementation requirement |
|---|---|
| Home | Brand introduction, campaign hero, collections, featured products, craft story, trust content and email/consent capture. |
| Navigation | Clear product categories, editorial/campaign paths, search, account and cart across desktop/mobile. |
| Collection | Editorial introduction, responsive grid, relevant filters/sort, accurate product cards and no-result recovery. |
| Product detail | Rich gallery, price/sale state, variants, handmade details, size/fit/care, lead time, custom inputs, policy/trust and cart action. |
| Cart | Accurate line snapshot, customisation summary, promotion entry, price clarity and checkout path. |
| Checkout | Guest-friendly, validated address/shipping/payment flow with safe provider hand-off and clear confirmation. |
| Account | Orders, addresses, wishlist/consent/support functions as enabled. |
| Editorial/policy | Craft, material, about, care, size, shipping, returns, contact and terms/privacy content. |

## 7. Admin Reference Requirements

The Odhvica admin serves as the standard operating interface future clients will also use. It must prove that a non-technical owner can complete routine store tasks.

| Admin workflow | Reference acceptance scenario |
|---|---|
| Product creation | Owner creates a jacket with product story, images, size variants, stock, price, care, size guide and SEO data. |
| Unique product | Owner creates one-of-a-kind item and confirms it becomes non-sellable after valid purchase. |
| Made-to-order product | Owner sets lead time/custom fields and sees customer selection in the order/production queue. |
| Content update | Owner updates homepage campaign/collection/policy content through approved blocks without code change. |
| Promotion | Owner creates a discount/sale/free-shipping rule, validates eligibility and sees order redemption. |
| Order processing | Owner views payment/order/fulfilment states, reviews custom input, moves to production, adds tracking and sends update. |
| Customer support | Owner views order/customer context and handles configured cancellation/return/exchange/refund request path. |
| Reporting | Owner views sales/product/order/inventory/promotion reports with defined filters/date context. |
| Access | Owner invites/revokes limited staff role and verifies permissions. |

## 8. Reference Integration Configuration

| Integration | Reference-store objective | Promotion requirement |
|---|---|---|
| Razorpay | Validate India payment route in provider-approved test and production process. | Verified current documentation, callback, idempotency, refund and reconciliation test. |
| Stripe | Validate eligible international payment route. | Provider eligibility/currency/callback/refund flow tested. |
| PayPal | Validate eligible international payment route. | Provider eligibility/callback/refund flow tested. |
| Email | Confirm order/payment/shipment/support notification delivery. | Template, retry, delivery result and client sender setup documented. |
| Courier/manual shipping | Validate zones, rate, fulfilment and tracking communication. | Provider adapter only after live-rate/label/tracking error handling is tested. |
| Analytics | Validate consent-aware core event funnel and search/SEO measurement. | No sensitive event properties; purchase deduplication proven. |
| Media storage | Validate product/content/customer-upload storage, optimisation and access. | Backup, private/public separation and lifecycle tested. |

## 9. Master-Template Configuration Matrix

The reference implementation must distinguish values that are Odhvica-specific from those that are reusable template features.

| Odhvica-specific configuration | Reusable master capability |
|---|---|
| Odhvica logo, wordmark, colors, typography and visual mood | Theme tokens and storefront component slots. |
| Odhvica campaign copy, images, craft story and policies | Content blocks, pages, navigation and publication workflow. |
| Odhvica products, collections, prices and stock | Catalogue, variants, media, attributes, pricing and inventory modules. |
| Odhvica payment credentials and shipping account | Provider adapter interfaces, secure configuration and integration health model. |
| Odhvica domain/analytics IDs | Deployment/configuration schema and consent-aware event model. |
| Odhvica-specific one-off workflow | Candidate master feature only after reuse review. |

## 10. Reference Validation Scenarios

The following scenario set is mandatory before calling the reference store launch-ready. More detailed automated/manual test scripts will be defined in Batch 4.

| ID | Scenario | Expected result |
|---|---|---|
| RI-01 | Browse collection on mobile with filter/sort | Responsive product discovery works; state is understandable and accessible. |
| RI-02 | Open a size-variant jacket and select valid size | Price/availability/gallery/input state update correctly. |
| RI-03 | Add one-of-a-kind product to cart from two sessions | Only valid confirmed purchase consumes item; second path receives safe unavailable state. |
| RI-04 | Buy made-to-order garment with custom measurements | Validation, order snapshot, production state and customer message preserve data. |
| RI-05 | Buy personalisable bag with gift message | Personalisation/gift input appears correctly in admin fulfilment record. |
| RI-06 | Apply valid/invalid promotion | Eligibility/total/error states are correct and auditable. |
| RI-07 | Complete eligible India payment route | Verified callback creates exactly one correct order/payment state. |
| RI-08 | Complete eligible international payment route | Route/method eligibility and verified confirmation behave correctly. |
| RI-09 | Payment cancellation/failure/duplicate callback | Cart/order/payment state remains safe, recoverable and non-duplicated. |
| RI-10 | Fulfil order and add tracking | Customer and admin see accurate fulfilment/tracking state. |
| RI-11 | Start return/refund/exchange request | Policy-aware request and authorised resolution path are correctly recorded. |
| RI-12 | Publish/edit product/collection/page | Public storefront/cache/SEO output updates accurately without stale critical data. |
| RI-13 | Verify accessibility critical flow | Keyboard, labels, errors, focus, gallery/variant/cart/checkout work. |
| RI-14 | Verify performance critical routes | Home/collection/product/cart/checkout meet approved measured budgets. |
| RI-15 | Verify client-isolation readiness | No reference-store secret/data/brand material is hard-coded into the reusable core. |

## 11. Reference Store Release Gates

| Gate | Evidence required |
|---|---|
| Product scope | Core PRD/commerce rules and reference catalogue scenarios are implemented. |
| UX/design | Storefront/admin experience passes documented responsive/accessibility acceptance. |
| Data/API | Schema, migrations, contracts and order snapshots are verified. |
| Payments/shipping | Provider test flows, callbacks, failures/refunds and manual fallback pass. |
| Security | Auth/authorisation, secrets, payment callback, upload, audit and deployment baseline pass. |
| Performance | Critical-page metrics and media/script budget meet approved baseline. |
| Operations | Backups/restore, monitoring, error response, release/rollback and support runbook pass. |
| Documentation | Product/UX/architecture/test/deployment documents match actual implementation. |
| Master readiness | Odhvica-specific values are separated and reusable features satisfy promotion criteria. |

## 12. Master Promotion Evidence

When Odhvica validates a feature, it must be assessed before inclusion in a master release.

| Evidence | Requirement |
|---|---|
| Product fit | Feature supports more than one likely handmade-category client. |
| Configuration | Feature can be configured without embedding Odhvica copy/design/data/process assumptions. |
| UX | Behaviour works in flexible storefront/admin design system. |
| Security | Permission, privacy, secret and failure implications are reviewed. |
| Performance | Feature remains within critical performance budgets. |
| Data/API | Schema/contracts/migrations are stable and documented. |
| Tests | Normal, invalid, duplicate and failure paths are covered. |
| Operations | Deployment, monitoring, rollback and support impact are understood. |

## 13. Future Client Implementation Readiness

The reference store is ready to seed client projects only after it can be cloned without carrying Odhvica business data or secrets and after the client onboarding workflow is documented. A future client must start from a tagged master release, then receive separate branding, storefront design, data, integrations, domain, deployment and launch validation.

The reference store does not automatically make every installed feature mandatory for client projects. Core, optional-module and client-custom classification remains governed by `04_feature_scope.md` and `06_reuse_model.md`.

## 14. Reference Implementation Acceptance Criteria

Odhvica succeeds as a reference implementation when it operates as a credible real handmade-fashion business, demonstrates all core commerce paths, is observable and secure, achieves approved storefront quality/performance/accessibility, and can be cleanly separated into a protected master template plus client-specific configuration/design/data.

## Related Documents

`01_project_summary.md` defines product intent. `03_prd.md` to `06_reuse_model.md` define scope and reuse. `09_storefront_ux.md` to `15_accessibility.md` define experience. `16_architecture_design.md` to `23_folder_structure.md` define technical implementation. `25_code_quality.md` through `29_implementation_plan.md` will define delivery and release execution.
