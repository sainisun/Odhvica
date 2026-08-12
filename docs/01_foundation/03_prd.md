# Odhvica — Product Requirements Document

| Field | Value |
|---|---|
| Document ID | 03 |
| Status | Approved foundation; detailed acceptance criteria to evolve by release |
| Version | 0.2 |
| Product | Odhvica reusable handmade-fashion e-commerce template |
| Primary implementation | Odhvica reference store |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Product Statement

Odhvica is a reusable full-stack commerce application for independent handmade-fashion and artisan-accessory brands. It provides a high-performance, SEO-first customer storefront and a consistent admin application for running catalogue, orders, customer relationships, promotions, content, shipping, and reporting.

The product is built first as a direct-to-consumer store for handcrafted jackets, kimonos, bags, accessories, and related products. It must subsequently be reusable as a separate client-store implementation without sharing domains, data, databases, hosting environments, payment credentials, or customer records between clients.

## 2. Goals

| Goal | Requirement |
|---|---|
| Sell globally | Support configured countries/regions, multi-currency presentation, regional payment eligibility, shipping zones, and international product information. |
| Tell the product story | Support high-quality media, artisan information, material, care, size, fit, variation, made-to-order timing, and trust content. |
| Operate independently | Allow store owners to manage routine operations through the admin panel without developer support. |
| Convert on mobile | Provide mobile-first browsing, search, filters, product selection, cart and checkout behaviour. |
| Enable repeat marketing | Support customer accounts, email capture, consent-aware marketing integrations, discounts, reviews, wishlists, and analytics. |
| Reuse safely | Allow new client stores to start from a controlled master-template version while redesigning the storefront freely. |

## 3. Non-Goals

The first release will not be a multi-vendor marketplace, a self-service website builder, a public SaaS tenant dashboard, a full warehouse-management system, a point-of-sale system, a native Android/iOS app, or an attempt to replicate every third-party e-commerce extension. These may be considered later only through a documented product decision.

## 4. Actors and Roles

| Actor | Product purpose | Key capabilities |
|---|---|---|
| Guest customer | Discover and buy products without creating an account first | Browse, search, filter, view products, add to cart, checkout as guest, track order where enabled |
| Registered customer | Manage a purchase relationship with the store | Account, addresses, order history, wishlist, reviews, communication preferences and support requests |
| Store owner | Run the business | Full product, order, customer, promotion, content, configuration and reporting management |
| Store staff | Perform assigned operations | Role-limited catalogue, fulfilment, customer-service, content or inventory actions |
| Developer/support operator | Maintain the deployed application | Controlled technical access, release support, diagnostics and approved maintenance only |

## 5. Customer Storefront Requirements

### 5.1 Discovery and Navigation

The storefront must provide a coherent premium-fashion shopping path. Customers must be able to move from campaign content or navigation to collections, product lists, products, cart and checkout without losing context.

| ID | Requirement | Priority |
|---|---|---|
| SF-01 | Display an editable announcement area for shipping, campaign, launch, sale, or time-sensitive messages. | Must |
| SF-02 | Provide brand navigation, store search, account access and cart access on desktop and mobile. | Must |
| SF-03 | Support collection/category landing pages with editorial content, product grids, sorting and appropriate filters. | Must |
| SF-04 | Support search across product titles, descriptions, collections, attributes and relevant tags. | Must |
| SF-05 | Support campaign, new-arrival, bestseller, sale, seasonal and handcrafted-story pages. | Should |
| SF-06 | Support cross-sell and related-product merchandising based on configurable logic. | Should |
| SF-07 | Support country/region and currency awareness without misrepresenting final checkout availability. | Must |

### 5.2 Product Detail Experience

The product-detail page must reduce the uncertainty that is common in handmade purchases. It must make product availability, variation, fit, uniqueness, care, fulfilment timing, and shipping expectations clear before checkout.

| ID | Requirement | Priority |
|---|---|---|
| PDP-01 | Show an optimised, multi-image product gallery with descriptive media information. | Must |
| PDP-02 | Show title, active price, optional original/reference price, sale status and currency context. | Must |
| PDP-03 | Support product variants such as size, colour, fabric, material, length, or other configured options. | Must |
| PDP-04 | Support custom fields where relevant, including personalisation, measurement, production note, gift message or reference-file upload. | Must |
| PDP-05 | Show stock availability or made-to-order status, production lead time and delivery expectations. | Must |
| PDP-06 | Show product description, material, artisan/brand story, care, fit/size guide, returns information and shipping information. | Must |
| PDP-07 | Provide wishlist, share, reviews, trust content and related products where enabled. | Should |
| PDP-08 | Prevent invalid variant/customisation combinations from being added to cart. | Must |

### 5.3 Cart and Checkout

Checkout is a critical commerce path and must be designed for clarity, correctness, provider eligibility, and reliable order confirmation.

| ID | Requirement | Priority |
|---|---|---|
| CO-01 | Allow guest checkout and optional account creation. | Must |
| CO-02 | Preserve product variant and required customisation data from product page through order record. | Must |
| CO-03 | Show item, quantity, discounts, shipping method, taxes where applicable, currency and final payable total before payment confirmation. | Must |
| CO-04 | Support configured promotional codes and automatic promotions without invalid stacking. | Must |
| CO-05 | Select available payment methods based on configured country, currency and checkout conditions. | Must |
| CO-06 | Support Razorpay for India and Stripe/PayPal routes for eligible international checkout paths. | Must |
| CO-07 | Create a durable order record only after the appropriate payment/order-state conditions are satisfied. | Must |
| CO-08 | Show a confirmation page and send transactional confirmation communication after a successful order. | Must |
| CO-09 | Handle cancelled, failed, pending and duplicate payment conditions without silently losing the customer cart or creating duplicate fulfilment. | Must |

### 5.4 Customer Account and Support

| ID | Requirement | Priority |
|---|---|---|
| CA-01 | Allow customers to create an account, authenticate securely and reset access credentials. | Must |
| CA-02 | Allow customers to manage their profile and saved addresses. | Must |
| CA-03 | Display order history and appropriate order-status information. | Must |
| CA-04 | Support wishlist functionality when enabled. | Should |
| CA-05 | Allow review submission only under defined eligibility rules. | Should |
| CA-06 | Support configured order enquiry, cancellation, return, exchange or refund request paths. | Must |
| CA-07 | Capture and honour communication consent choices. | Must |

## 6. Admin Application Requirements

The admin panel is a reusable operating environment. Its visual design and standard workflows should remain consistent across Odhvica and future client stores.

| Module | Required capabilities |
|---|---|
| Dashboard | Store performance overview, order status, sales, inventory warnings, operational tasks and key exceptions. |
| Catalogue | Products, variants, collections, tags, media, prices, sales, product SEO, inventory, custom fields and made-to-order configuration. |
| Orders | Search, review, payment state, fulfilment state, customer details, shipping, notes, refund/return/exchange handling and order timeline. |
| Customers | Customer record, contact details, addresses, orders, marketing consent, notes and support context. |
| Promotions | Discount codes, automatic discounts, sale campaigns, eligibility rules and usage reporting. |
| Content | Store navigation, policy pages, FAQs, homepage blocks, campaign pages, blog/CMS content and SEO metadata. |
| Shipping | Shipping zones, methods, free-shipping thresholds, courier configuration, tracking and fulfilment rules. |
| Payments | Provider configuration state, transaction visibility, refund controls and failure/reconciliation status subject to provider capabilities. |
| Reviews | Moderation, publish/hide state, response and product association. |
| Settings | Store identity, regional rules, currencies, tax settings, notifications, integrations, users and permissions. |
| Reporting | Sales, product performance, discount use, customer behaviour, fulfilment and inventory reports. |

## 7. Handmade-Category Requirements

The core template must handle categories where product availability and customer input differ from mass-produced retail.

| ID | Requirement | Priority |
|---|---|---|
| HC-01 | Support one-of-a-kind stock and prevent overselling after a confirmed purchase. | Must |
| HC-02 | Support made-to-order products with configurable production lead time. | Must |
| HC-03 | Support free-size and structured size-chart products. | Must |
| HC-04 | Support optional custom measurements with validation and order visibility. | Must |
| HC-05 | Support personalisation/engraving/monogram fields and gift-message fields. | Should |
| HC-06 | Support product variation notes where textile pattern, handmade finish or colour placement can vary. | Must |
| HC-07 | Support care, material, origin and artisan-story content as reusable product/content elements. | Must |
| HC-08 | Support manual operational review for selected orders before fulfilment. | Should |

## 8. International Commerce Requirements

| ID | Requirement | Priority |
|---|---|---|
| IC-01 | Configure selling regions and block checkout where a region is unsupported. | Must |
| IC-02 | Support store-defined currency display and explain when final payment currency may be provider-dependent. | Must |
| IC-03 | Configure domestic and international shipping methods, rates, free-shipping conditions and delivery estimates. | Must |
| IC-04 | Collect shipping address information required for configured fulfilment routes. | Must |
| IC-05 | Support tax, duty, customs and policy messaging as configured by the store owner; exact legal treatment requires professional validation. | Must |
| IC-06 | Support relevant payment-method routing and failure handling by market. | Must |

## 9. Marketing, SEO and Analytics Requirements

| ID | Requirement | Priority |
|---|---|---|
| MA-01 | Provide editable search metadata for products, collections, pages and content. | Must |
| MA-02 | Provide indexable, structured and performant public product and collection pages. | Must |
| MA-03 | Support editorial pages, blog/CMS content and campaign landing pages. | Should |
| MA-04 | Support analytics and advertising/pixel integrations through a governed configuration model. | Must |
| MA-05 | Capture newsletter/marketing consent and make the consent state available for compliant downstream use. | Must |
| MA-06 | Support email and WhatsApp notification integrations subject to consent, provider capability and regional rules. | Should |
| MA-07 | Support abandoned-cart recovery as a later release only after privacy, consent and delivery design are approved. | Later |

> **Approved scope record:** The `Later` priority for MA-07 is a deliberate product-owner scope decision, not an omission. It may be promoted only through a documented change decision after privacy, consent, delivery, provider and test design are approved.

## 10. Quality Requirements

The product must be responsive, accessible, secure, observable, and testable. It must be optimised for mobile buyers and image-rich fashion pages. Data-changing actions must have clear state handling and auditability appropriate to their risk.

Detailed performance budgets, security controls, test strategy, API contracts, schema and deployment procedures are defined in later documents. This PRD establishes that these are product requirements, not optional technical enhancements.

## 11. Release Priority

| Release | Included scope |
|---|---|
| Reference-store MVP | Storefront, collection pages, product pages, search/filter foundation, variants, product media, cart, guest checkout, payments, orders, customer communications, admin catalogue/orders/customers, shipping, core policies, SEO foundation and responsive design. |
| Advanced commerce | Coupons, automatic promotions, reviews, wishlists, return/refund/exchange workflows, richer reports, courier integration, role refinement and advanced content controls. |
| Growth and scale | Advanced email/WhatsApp flows, loyalty, subscriptions, wholesale/B2B modules, deeper analytics, advanced automation and mobile-app integration. |

## 12. Acceptance Principle

A requirement is accepted only when the relevant user can complete the intended task, invalid and failure cases have defined behaviour, permissions are respected, the result is visible in the correct system record, and the feature has passed its defined test and release checks.

## Related Documents

`04_feature_scope.md` categorises these requirements. `05_commerce_rules.md` defines commercial behaviour. `06_reuse_model.md` governs template/client application. Detailed UX, schema, API, security, performance and testing design will be developed in later batches.
