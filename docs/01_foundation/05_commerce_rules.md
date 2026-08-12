# Odhvica — Commerce Rules

| Field | Value |
|---|---|
| Document ID | 05 |
| Status | Approved foundation; regional/provider detail pending later integration and legal review |
| Version | 0.1 |
| Product | Odhvica reusable handmade-fashion e-commerce template |
| Owner | Product owner / technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document defines the commercial behaviour that must remain consistent across the Odhvica master template and its independently deployed client stores. It covers product availability, pricing, promotions, currency, checkout, payment, orders, shipping, cancellations, returns, refunds, exchanges, and customer communication.

It is a product and implementation rules document. It is not tax, customs, consumer-protection, payment-provider, or legal advice. The rules must be validated against the final client’s legal jurisdiction, payment-provider terms, shipping providers, and published policies before production launch.

## 2. Rule Hierarchy

| Priority | Rule source | Application |
|---:|---|---|
| 1 | Applicable law, payment-provider terms, tax/duty requirements and consumer rights | Must be followed even if a configuration or historic policy conflicts. |
| 2 | Approved client commercial policy | Governs the specific client store’s delivery, returns, exchanges, regional selling and support terms. |
| 3 | Odhvica master commerce rules | Defines safe default behaviour for the reusable template. |
| 4 | Store configuration | Sets region, currencies, rates, promotion parameters and enabled modules within approved boundaries. |

## 3. Product Availability and Inventory

Handmade commerce may involve ready stock, limited quantities, one-of-a-kind pieces, and made-to-order production. The system must represent these states clearly and prevent the storefront from making an incorrect promise.

| Product mode | Customer-facing rule | Operational rule |
|---|---|---|
| Ready stock | Show availability when inventory is sellable. | Decrease/reserve stock through the approved checkout/order workflow. |
| Limited stock | Show available variant selection only while the variant is sellable. | Low-stock alert and oversell prevention are required. |
| One of a kind | Make uniqueness clear where relevant. | Only one confirmed sellable order may consume the unique item. |
| Made to order | Show configured production lead time before checkout. | Order enters a production/approval workflow before fulfilment. |
| Pre-order | Show release/dispatch expectation and policy. | Use only after the dedicated module and customer terms are approved. |
| Unavailable | Prevent cart addition and checkout. | Preserve product history; do not delete records that are referenced by prior orders. |

A product variant is the unit of sellable availability unless the product is explicitly configured as non-variant. Inventory changes must be attributable to a defined event such as manual adjustment, confirmed order, cancellation/restock, return received, or approved stock correction.

## 4. Handmade Product Configuration

A handmade product may need inputs beyond a standard size and colour variant. Required fields must be validated before cart addition and remain immutable in the order snapshot once the order is confirmed, except through an auditable support/admin change process.

| Field type | Example | Rule |
|---|---|---|
| Variant | Size, colour, material, length, lining | Determines price/availability where configured. |
| Required custom input | Personalisation text, specific measurement, custom color note | Must be captured before cart addition and visible to operations. |
| Optional custom input | Gift message, request note, reference image | Must be associated with the cart/order and handled according to privacy/file rules. |
| Product disclosure | Fabric variation, handmade finish, care, fit, origin | Must be visible before purchase when material to the purchase decision. |
| Production rule | Production lead time, custom approval, manual review | Must affect the order workflow and customer communications where configured. |

## 5. Pricing and Currency

Each client store must maintain a clear base pricing strategy. The base product price, variant adjustments, product-level sale price, promotion eligibility, shipping cost, tax treatment and payment-provider fees must not produce contradictory totals.

| Rule | Requirement |
|---|---|
| Base price | Every sellable product/variant must have a valid active base price in the store’s base currency. |
| Sale/reference price | A sale price may be displayed only when it is valid, has clear effective dates if scheduled, and does not create a misleading reference/original price presentation. |
| Variant price adjustment | Variant-level adjustments must be reflected consistently in product page, cart, checkout, order and refund calculations. |
| Display currency | The storefront may display configured local currencies, but the checkout must disclose the actual payable amount/currency before payment confirmation. |
| Currency conversion | Conversion source, rounding approach, refresh frequency and fallback behaviour must be defined in the later integration specification. |
| Price snapshot | Order records must preserve the price, discount, currency, tax and shipping values actually accepted at checkout. |
| Manual price changes | After a confirmed order, manual adjustments require a defined approval, communication and audit path. |

## 6. Promotions and Discounts

Promotions must be explicit, testable and conflict-safe. The system must calculate eligibility before a customer is charged and save the applied promotion result with the order.

| Promotion type | Default rule |
|---|---|
| Product sale | Product/variant sale price may apply within configured availability and campaign dates. |
| Discount code | Code may apply based on configured currency, customer, collection, product, cart minimum, date, usage and stacking rules. |
| Automatic promotion | Must show the benefit clearly in cart and checkout without requiring manual code entry. |
| Free shipping | Applies only when configured zone, delivery method, cart threshold, product eligibility and promotion conditions are all met. |
| First-order/customer segment discount | Must depend on a reliable, consent-safe and defined customer identity/eligibility rule. |
| Combined promotions | Disallowed by default unless a priority/stacking rule is explicitly configured and tested. |
| Refund interaction | Refunds must use the actual paid/discounted order value, not the current product price. |

Promotions must never make the final order total negative. Invalid, expired, ineligible, exhausted or conflicting offers must return clear customer-facing messages and must not silently alter a cart.

## 7. Cart Rules

A cart is a temporary purchase intention. It must accurately preserve configured product/variant/customisation data while allowing price, availability and promotion eligibility to be revalidated before checkout.

| Event | Required behaviour |
|---|---|
| Add to cart | Validate product availability, variant availability and required inputs. |
| Quantity change | Revalidate stock, pricing and eligible promotions. |
| Product/price update | Inform the customer when a cart item is no longer available or when a material price condition changed. |
| Currency/region change | Recalculate display and checkout eligibility according to configured rules. |
| Cart expiry | Define a configurable retention period; do not treat an expired cart as an order. |
| Checkout start | Revalidate all prices, inventory, shipping, tax and payment eligibility. |

## 8. Checkout and Payment Rules

The checkout must be the authoritative place where the final purchase terms are presented. Customers must be able to review selected products, customisation data, delivery address, shipping method, discounts, tax where applicable, currency, payment method and total before final confirmation.

| Payment route | Intended scope | Core rule |
|---|---|---|
| Razorpay | India checkout path | Enable only for eligible customer, currency and store configuration. |
| Stripe | Supported international checkout path | Enable only for eligible market/payment configuration. |
| PayPal | Supported international checkout path | Enable only for eligible market/payment configuration. |
| Cash on delivery | Optional future/client setting | Must have explicit region, product, amount and operational eligibility rules before activation. |

No order should enter fulfilment solely because the customer reached a success-looking browser page. The system must use the approved payment/order confirmation state from the provider/integration workflow. Pending, failed, cancelled, abandoned, duplicate and delayed confirmation cases need defined order and customer-notification behaviour.

## 9. Order Lifecycle

The master template will use a state model that separates order, payment, fulfilment and post-purchase activity. A single status must not hide the distinction between payment success and physical dispatch.

| Lifecycle area | Initial states |
|---|---|
| Order | Draft, pending confirmation, confirmed, cancelled, completed, archived |
| Payment | Not required, pending, authorised, paid, failed, cancelled, partially refunded, refunded, disputed where applicable |
| Fulfilment | Unfulfilled, review required, in production, ready to ship, partially fulfilled, fulfilled, shipped, delivered, returned where applicable |
| Post-purchase | No request, cancellation requested, return requested, exchange requested, refund under review, resolved |

The exact transitions, permissions, provider confirmations and automation events will be specified in the later system-design, API-contract and integration documents. The admin must preserve an order timeline for significant events, communications, payment updates, fulfilment changes, refunds and support actions.

## 10. Shipping and Fulfilment Rules

| Rule area | Requirement |
|---|---|
| Selling zone | Customers can checkout only where the store has enabled delivery. |
| Shipping options | Available methods depend on destination, product rules, cart conditions and client configuration. |
| Free shipping | Must apply only under the configured conditions and must be visible before payment. |
| Delivery estimate | Show a configured estimate that distinguishes production time from transit time when relevant. |
| Address validation | Validate required address fields before payment and before fulfilment. |
| Tracking | Manual tracking entry is a core requirement; automated tracking is an optional courier module. |
| Partial fulfilment | Support only where the business process and customer communication are explicitly configured. |
| Customs/duties | Product/store policy must communicate the applicable commercial position; system behaviour requires jurisdiction-specific validation. |

## 11. Cancellation, Return, Exchange and Refund Rules

Customer policies differ by product, market and handmade customisation status. The application must therefore support configurable policy display and controlled requests rather than promising universal automatic acceptance.

| Operation | Default platform rule |
|---|---|
| Cancellation | A customer may request cancellation through the configured support path. Automatic cancellation is allowed only before the configured order/production/payment boundary. |
| Return | A return request must reference an order and item, capture the reason and follow the published client policy. |
| Exchange | Exchange must consider product availability, price difference, shipping and return receipt rules. |
| Refund | Refund amount and payment route must follow the actual paid order record and provider capability. |
| Custom-made product | Eligibility may differ; the store policy must be shown before purchase and enforced consistently. |
| Returned inventory | Stock may be restored only after defined receipt/inspection conditions are met. |
| Customer communication | Each decision must produce clear status communication without revealing sensitive internal notes. |

## 12. Customer Communications and Consent

Transactional communications are required for confirmed orders and major lifecycle updates. Marketing communications require consent-aware handling based on the final legal/compliance design.

| Communication | Trigger |
|---|---|
| Order confirmation | Confirmed order/payment state under the configured payment flow |
| Payment issue | Payment failed, cancelled or requires customer action where relevant |
| Production update | Made-to-order status change when enabled |
| Shipment confirmation | Tracking/fulfilment event when available |
| Return/refund/exchange update | Support or operation state change |
| Marketing message | Only through approved consent, customer-preference and provider rules |

## 13. Exceptions and Manual Review

The system must make exceptions visible rather than hiding them. Orders may require manual review because of payment uncertainty, high value, custom measurements, fraud signal, address problem, product availability issue, production limitation, currency mismatch, or shipping restriction.

Manual review should pause fulfilment, record the reason, identify the responsible staff role, preserve the customer-facing status and provide a documented next action.

## 14. Required Later Decisions

The following must be finalised in the integration, legal, database, system-design and testing documents before production release:

| Decision | Why it remains open |
|---|---|
| Country availability and currency list | Depends on store business decisions and provider support. |
| Tax/duty calculation and disclosure | Requires jurisdiction-specific review. |
| Courier provider set and label/tracking automation | Depends on client contracts and APIs. |
| Return/exchange policy parameters | Must match actual client policy and product customisation terms. |
| Payment failure/reconciliation mechanism | Requires validated provider integration design. |
| Conversion-rate source and rounding rules | Requires a chosen provider/data source. |
| Communication provider and templates | Requires provider, consent and brand decisions. |

## Related Documents

`03_prd.md` lists functional requirements. `04_feature_scope.md` classifies features and modules. `06_reuse_model.md` defines how client-specific commercial rules remain separated from master rules. Later documents will turn these rules into system, database, API, security, integration, testing and deployment specifications.
