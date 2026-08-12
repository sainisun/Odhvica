# Odhvica — Project Summary

| Field | Value |
|---|---|
| Document ID | 01 |
| Status | Approved foundation |
| Version | 0.1 |
| Product | Odhvica reusable single-store e-commerce template |
| Primary reference store | Odhvica handmade-fashion reference implementation |
| Primary users | Handmade-fashion store owners, store staff, customers, and internal developers |
| Document owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

Odhvica is a high-performance, SEO-first e-commerce application designed first for handmade jackets, kimonos, bags, accessories, and related artisan-fashion products. It will operate as the reference implementation for a protected reusable source-code template.

The objective is not to create a shared marketplace or a multi-tenant SaaS product. The objective is to maintain one robust commerce engine that can be cloned into an independent client project. Every client receives an individually deployed website with its own domain, database, VPS environment, payment credentials, catalogue, customers, orders, and branding. The reusable master source code remains owned and controlled by the platform developer.

> The core commerce engine and admin experience are reusable. The storefront experience is intentionally redesignable for each client brand.

## 2. Product Vision

Odhvica should allow a handmade-fashion business to sell internationally without depending on a marketplace as its only sales channel. The storefront must communicate product craftsmanship, material quality, unique variation, artisan story, care instructions, delivery expectations, and customer trust. The admin application must make product, order, customer, inventory, promotion, content, and shipping management understandable for a non-technical store owner.

The resulting template should enable the developer to launch future client stores faster while maintaining reliable checkout, product management, international commerce, marketing integrations, and operational control.

## 3. Primary Business Outcomes

| Outcome | Definition of success |
|---|---|
| Direct-to-customer ownership | The store owner controls its own domain, customer data, catalogue, checkout experience, analytics, and communications subject to applicable privacy obligations. |
| Reusable delivery model | A new handmade-category client store starts from the maintained master template rather than from a blank project. |
| Premium storefront quality | Every client can receive a distinct, brand-specific storefront without rewriting the underlying commerce engine. |
| Operational independence | Store owners can run catalogue, order, promotion, fulfilment, customer, and content activities through the standard admin panel. |
| International readiness | The platform supports regional selling, multi-currency presentation, India and international payment routes, and configurable shipping rules. |
| Long-term maintainability | Shared improvements are released from a controlled master template; one client’s custom feature does not destabilise other client projects. |

## 4. Target Category and Catalogue Profile

The first release is optimised for the handmade-fashion and artisan-accessories category. The reference catalogue can contain ready-stock, made-to-order, limited-run, and one-of-a-kind products. Product groups may include quilted jackets, Kantha and Suzani jackets, kimonos, robes, dresses, tote bags, toiletry bags, duffle bags, fabric, embroidered items, and seasonal collections.

The template must represent both standard variants and artisan-specific information. Required catalogue capabilities include size, colour, material, fabric, fit, length, care instructions, production lead time, stock, image gallery, sale pricing, original/reference price, collection placement, international shipping eligibility, and optional personalisation or custom-order notes.

## 5. Experience Principles

| Principle | Meaning for Odhvica |
|---|---|
| Story before commodity | Product pages should explain craftsmanship, materials, origin, care, uniqueness, and delivery expectations rather than presenting only price and variants. |
| Mobile-first speed | The storefront must remain light, image-efficient, responsive, and search-engine friendly on mobile networks. |
| Conversion without pressure | Product discovery, filters, size guidance, delivery information, trust signals, reviews, and checkout must reduce uncertainty without clutter. |
| Admin consistency | Admin design, workflows, and information hierarchy remain stable across client projects. |
| Storefront freedom | Brand visuals, page composition, campaign storytelling, navigation style, collection presentation, typography, and merchandising can be redesigned per client. |
| Safe reuse | Client-specific work is isolated until it is proven reusable and intentionally promoted into a versioned master release. |

## 6. Confirmed Scope Baseline

| Area | Baseline decision |
|---|---|
| Deployment model | Independent client project and independent deployment for each store |
| Hosting target | Deployment compatible with a Hostinger VPS environment |
| Application direction | Next.js-first, full-stack web application with strong SEO and performance requirements |
| Storefront | Fully redesignable for each client |
| Admin panel | Standard reusable interface, with client-specific feature additions only when scoped and approved |
| Domestic payments | Razorpay integration for India |
| International payments | Stripe and PayPal integrations for supported foreign transactions |
| Shipping | Courier integration capability, configurable shipping methods, and free-shipping rules |
| Commerce functions | Catalogue, variants, inventory, cart, checkout, customer accounts, discounts, orders, returns, refunds, exchanges, reviews, wishlist, notifications, marketing and analytics |
| Future channel | Android and iOS applications may be added later using the same commerce foundation; they are not part of the first build |
| Client delivery | The client receives the live deployed store and appropriate admin access, not the master source code |

## 7. Non-Goals for the Initial Product

Odhvica is not intended to be an Etsy-style multi-vendor marketplace, a generic website builder, a food-delivery system, a social network, an ERP replacement, or a public self-service SaaS onboarding platform in the first release. The product will not attempt to replicate every feature of every commercial e-commerce platform before launch.

Advanced capabilities may be planned, but only after the core handmade-commerce experience is stable. Priorities are defined in `03_prd.md` and controlled through `04_feature_scope.md`.

## 8. Reference-Informed Requirements

The KanthaPrints reference demonstrates the relevance of broad handmade-fashion collections, artisan storytelling, sale presentation, free-delivery messaging, category navigation, reviews, shop policies, and worldwide-shipping communication. The Mulmul reference demonstrates a premium collection-led storefront with campaign imagery, clear brand navigation, product discovery controls, and visual merchandising. [1] [2]

Odhvica will use these as directional references, not as visual copies. The product must establish its own reusable component system and support each future client’s distinct brand identity.

## 9. Success Measures

The exact numerical targets will be finalised in the performance, testing, and analytics documents. The initial acceptance measures are qualitative and operational:

| Domain | Initial success condition |
|---|---|
| Storefront | A customer can discover products, understand product details, add products to cart, complete checkout, and receive order confirmation on mobile and desktop. |
| Handmade workflow | Required product variants, stock, made-to-order details, personalisation and production information are captured accurately with the order. |
| Admin operations | A store owner can manage catalogue, promotions, orders, fulfilment, customers, content, and store settings without developer intervention for routine work. |
| Reuse | A second client store can be launched from the master template without copying Odhvica-specific branding, payment accounts, data, or business content. |
| Reliability | Payment, order, shipping, email, and inventory paths are testable and observable before release. |

## 10. Related Documents

This summary governs Batch 1 documents `02_project_instruction.md` through `08_agent.md`. Later UX, system architecture, database, integration, security, performance, deployment, testing, and implementation documents must remain consistent with this summary.

## References

[1]: https://www.etsy.com/in-en/shop/kanthaprints "KanthaPrints Etsy Store"
[2]: https://shopmulmul.com/collections/mulmul-wedding "Mulmul Wedding Collection"
