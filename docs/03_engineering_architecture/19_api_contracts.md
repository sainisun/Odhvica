# Odhvica — API Contracts

| Field | Value |
|---|---|
| Document ID | 19 |
| Status | Approved contract foundation; endpoint schemas to be generated/validated during implementation |
| Version | 0.1 |
| Product | Odhvica reusable handmade-fashion e-commerce template |
| Owner | Technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document defines the interface rules between Odhvica storefront pages, admin pages, application services, future mobile clients and external provider adapters. It establishes stable resource boundaries, authentication expectations, response/error conventions, idempotency, versioning and contract-change governance.

The initial application may implement many contracts as server actions or internal route handlers within a Next.js modular monolith. They must still follow documented contract rules. The purpose is to prevent business logic from being coupled only to one page/component and to keep future mobile/API expansion possible.

## 2. Contract Principles

| Principle | Requirement |
|---|---|
| Server authority | APIs/services calculate price, stock, eligibility, permissions and state transitions server-side. |
| Explicit resources | Contracts use clear domain resources instead of exposing database tables directly. |
| Minimal data | Return only fields required for the caller/task; never expose internal secrets, sensitive notes or unnecessary personal data. |
| Stable public shape | Customer/mobile/admin contracts change intentionally, with versioning/deprecation when breaking. |
| Validation | Every command validates type, business rule, permission and state transition. |
| Consistent errors | Callers receive machine-readable code plus safe human-readable message and field details where relevant. |
| Idempotency | Checkout, payment, refund, provider callback and other retried operations use deduplication/idempotency controls. |
| Auditability | Sensitive commands create appropriate audit/event records. |
| Client isolation | Contracts operate only within the active independently deployed store; no cross-client data parameters exist. |

## 3. API Surface Classification

| Surface | Consumers | Access model | Examples |
|---|---|---|---|
| Public read | Unauthenticated storefront/browser/search systems | Public, rate-limited and cache-aware | Product detail, collection, content, search, store config. |
| Customer account | Authenticated customer | Customer ownership check | Profile, addresses, orders, wishlist, support requests. |
| Customer commerce write | Guest or customer | Cart/checkout token/session plus validation | Cart mutation, checkout, payment continuation. |
| Admin | Authorised staff | Role/permission and audit check | Product, order, content, promotion, report and settings actions. |
| Internal service | Application modules/jobs | Trusted in-process/internal identity | Payment/order/inventory service commands. |
| Provider callback | Payment/shipping/messaging provider | Signature/authentication verification and idempotency | Payment event, shipment status event. |
| Future mobile | Native apps | Customer/staff auth plus public contracts | Same stable business operations, tailored response payload. |

## 4. Common Request and Response Rules

### 4.1 Request Requirements

| Requirement | Rule |
|---|---|
| Content type | Structured request body for write operations; file upload uses controlled media/upload contract. |
| Input validation | Validate shape, field constraints, business rules and authorisation before state change. |
| Authentication | Use secure session/token approach selected by authentication ADR; never trust client-provided role/user ID. |
| Correlation | Assign/propagate request/correlation ID for traceability. |
| Pagination | List contracts use explicit cursor/page strategy, limit bounds, sort and filter validation. |
| Filtering | Allow only documented filters; do not expose arbitrary query-to-database mapping. |
| Dates/currency | Use documented ISO-like date/timestamp and currency formats; money uses integer minor units or precise decimal representation consistently. |
| Idempotency key | Required for retry-prone monetary/commerce commands and supported where appropriate elsewhere. |

### 4.2 Response Envelope

The exact implementation shape may differ for server actions versus HTTP routes, but externally visible contracts should consistently communicate success, data, metadata and errors.

| Field | Purpose |
|---|---|
| `data` | Requested resource/result payload. |
| `meta` | Pagination, cursor, request ID, totals or non-sensitive context. |
| `error` | Null on success; structured safe error on failure. |
| `error.code` | Stable machine-readable category. |
| `error.message` | Safe customer/admin-facing explanation; no internal stack trace/secrets. |
| `error.fields` | Optional field-level validation issues. |
| `request_id` | Correlates client/support report to logs where appropriate. |

## 5. Error Taxonomy

| Error code family | Meaning | Caller response |
|---|---|---|
| `VALIDATION_*` | Input missing/invalid | Highlight relevant field and retain valid input. |
| `AUTH_REQUIRED` | Sign-in required | Direct to approved authentication flow. |
| `FORBIDDEN` | Authenticated actor lacks permission/ownership | Show safe unavailable message; do not disclose protected data. |
| `NOT_FOUND` | Resource not available/does not exist | Show controlled not-found/recovery path. |
| `CONFLICT` | State/version/stock/idempotency conflict | Refresh/retry or show changed-condition message. |
| `UNAVAILABLE` | Temporary dependency/service problem | Preserve safe state and offer retry/support path. |
| `PAYMENT_*` | Payment/provider/eligibility issue | Explain safe next action; preserve/reconcile order context. |
| `SHIPPING_*` | Address/region/method/carrier issue | Prompt correction/alternative method or support. |
| `RATE_LIMITED` | Request limit reached | Delay/retry; do not reveal internal control logic. |
| `INTERNAL_ERROR` | Unexpected safe failure | Generic message with request ID; log internally. |

## 6. Public Storefront Read Contracts

| Contract | Method / indicative route | Primary response |
|---|---|---|
| Store context | `GET /api/store` | Public brand, supported regional/currency display settings, navigation/footer-safe config. |
| Home content | `GET /api/pages/home` or rendered route data | Published homepage blocks and referenced commerce content. |
| Collection list/detail | `GET /api/collections`, `GET /api/collections/{slug}` | Collection content, paginated products, filter/sort metadata. |
| Product detail | `GET /api/products/{slug}` | Public product, variants, media, availability, customisation rules, SEO-safe content and related products. |
| Search | `GET /api/search?q=...` | Validated search result set with products/collections/pages as configured. |
| Page/article | `GET /api/pages/{slug}`, `GET /api/articles/{slug}` | Published public content and metadata. |
| Size/care/policy | Public page/content contracts | Published controlled information. |

Public responses must not expose internal cost, supplier/artisan-private notes, raw inventory movement history, staff identities, integration settings, unpublished product data, customer information or secret configuration.

## 7. Cart Contracts

| Command | Indicative route | Required input | Required result |
|---|---|---|---|
| Read cart | `GET /api/cart` | Secure cart/customer context | Cart lines, current price/availability summary and allowed next actions. |
| Add item | `POST /api/cart/items` | Product/variant, quantity, valid customisation input | Updated cart plus line-level validation/availability result. |
| Update item | `PATCH /api/cart/items/{id}` | Quantity and/or permitted customisation change | Revalidated cart totals and state. |
| Remove item | `DELETE /api/cart/items/{id}` | Cart/item context | Updated cart and removal confirmation. |
| Apply discount | `POST /api/cart/discounts` | Code | Evaluation result, accepted/rejected reason and updated totals. |
| Remove discount | `DELETE /api/cart/discounts/{id}` | Applied discount context | Updated totals. |
| Refresh cart | `POST /api/cart/refresh` | Cart context | Current product, price, stock and promotion validation state. |

Cart commands must validate ownership/session context. They may return a changed-condition response when a product/variant/price/promotion is no longer valid.

## 8. Checkout and Payment Contracts

| Command | Indicative route | Required behaviour |
|---|---|---|
| Begin/refresh checkout | `POST /api/checkout` | Revalidate cart, region, addresses, stock, promotion, shipping and payment eligibility; create/refresh bounded checkout session. |
| Update checkout address | `PATCH /api/checkout/{id}/address` | Validate address and re-evaluate shipping/tax/region eligibility. |
| Select shipping method | `PATCH /api/checkout/{id}/shipping` | Accept only an eligible method returned for current checkout snapshot. |
| Create payment attempt | `POST /api/checkout/{id}/payments` | Select eligible provider/method, require idempotency key, return safe client continuation data. |
| Query checkout state | `GET /api/checkout/{id}` | Return safe customer-owned state; never expose provider secrets. |
| Confirm order read | `GET /api/orders/{public_number}` | Customer ownership/auth/token check; return order confirmation/status. |
| Payment callback | `POST /api/webhooks/{provider}` | Verify provider event and perform idempotent internal transition; no browser session trust required. |

The contract must not accept client-supplied totals, currency conversion, tax, shipping price, discount amount, payment confirmation or order status as authoritative values.

## 9. Customer Account Contracts

| Contract group | Representative operations |
|---|---|
| Profile | Read/update approved profile fields; secure credential/account flows through authentication design. |
| Addresses | Create/list/update/delete saved address with customer ownership check. |
| Orders | List customer orders, view allowed order detail/status and initiate approved support/request flow. |
| Wishlist | Read/add/remove customer wishlist items. |
| Reviews | Create/edit within eligibility/moderation rules; list public approved reviews. |
| Consent | Read/update communication preferences with policy/source audit. |
| Support/privacy | Submit/read owned support, return/exchange/cancellation or privacy requests where enabled. |

## 10. Admin Contracts

Admin contracts use permission codes, not only broad role labels. They may be provided through route handlers, server actions or an internal BFF style layer, but must preserve the same validation/audit rules.

| Admin area | Representative operations |
|---|---|
| Products | Create, draft, edit, validate, publish, archive, bulk update, import/export, manage variants/media/attributes/custom fields. |
| Collections/content | Create/edit/review/publish/archive collections, pages, blocks, navigation, articles, FAQs and SEO metadata. |
| Inventory | View, adjust with reason, reserve/release, set thresholds and review history. |
| Orders | Search/filter, read detail, transition allowed fulfilment state, add note, resolve request, create tracking/shipment. |
| Payments/refunds | View authorised records, initiate approved refund, review reconciliation exception. |
| Customers | View permitted customer data, manage support context, consent and privacy-request workflow. |
| Promotions | Create/test/publish/disable discounts and view usage. |
| Shipping/settings | Manage authorised zones/methods/integration configuration references and notification settings. |
| Reports | Request aggregated report/export subject to role, retention and data-minimisation rules. |
| Users/roles | Invite/revoke/assign roles only with elevated permission and audit record. |

## 11. Provider and Webhook Contracts

Provider callbacks are not normal browser APIs. They require raw request verification according to validated provider documentation, provider-event ID deduplication, safe mapping to internal events and durable processing result.

| Callback type | Required contract behaviour |
|---|---|
| Payment event | Verify signature/authentication, record event, reconcile relevant attempt/order, apply idempotent transition and respond safely. |
| Courier event | Verify source/authorisation where available, map tracking status, avoid invalid fulfilment transition and record history. |
| Messaging delivery event | Verify source, update notification delivery state and queue failure/retry actions where applicable. |
| Marketing/event callback | Process only approved data, honour consent/privacy boundary and prevent open webhook abuse. |

Provider-specific payloads must be stored only as needed for audit/reconciliation and protected as potentially sensitive. Exact fields and signature mechanisms require current provider-documentation validation before implementation.

## 12. Pagination, Filtering and Sorting

List endpoints must expose predictable query options. Every filter and sort must be allow-listed and validated. Cursor-based pagination is preferred for large mutable operational lists; an implementation may choose page/offset for controlled low-volume content lists if consistency/performance are sufficient.

| List type | Recommended filters/sorts |
|---|---|
| Public collection | Availability, category, material/style attributes, price range, size, sale; featured/newest/price sort. |
| Admin products | Status, collection, type, inventory state, sale/made-to-order, updated date; title/updated/date sort. |
| Admin orders | Order/payment/fulfilment state, date, customer, country, shipping, product/custom state; date/priority sort. |
| Customers | Search, order count/date, consent, country, customer state; update/order/revenue-like sort subject to data policy. |
| Reports | Defined date range, comparison range, approved grouping/filter set only. |

## 13. Contract Versioning and Deprecation

Internal refactoring that does not alter caller-observable behaviour does not need API versioning. Public/mobile/provider-facing breaking changes do. A breaking change includes removed field, changed meaning, stricter input requirement, changed error/side effect, altered auth scope or changed monetary/state semantics.

| Change type | Policy |
|---|---|
| Add optional field/endpoint | Backward-compatible; document and test. |
| Add enum value/state | Assess caller tolerance; version/feature-flag when callers may break. |
| Rename/remove/change required field | Breaking; introduce migration/compatibility/deprecation plan. |
| Change money/state logic | High risk; product, system, test and release approval required. |
| Provider payload mapping change | Version/audit carefully; retain reconciliation ability. |

## 14. API Security Rules

All contracts require schema validation, output filtering, rate limiting where exposed, appropriate CSRF/session controls according to auth mechanism, object ownership checks, permission checks, secure error handling, request logging without sensitive body leakage, and upload-specific controls.

Admin/internal endpoints must never be trusted because a browser hides a button. Customer account endpoints must validate ownership. Webhook endpoints must verify provider origin/signature. File upload endpoints must validate type, size, storage key/path and authorised relationship to the intended resource.

## 15. Contract Testing Requirements

| Test type | Coverage |
|---|---|
| Schema validation | Valid/invalid request/response shape, required fields and controlled enums. |
| Authorisation | Guest/customer/staff/owner denial and allowed-path checks. |
| Business rules | Price, stock, promotion, checkout, refund, order and fulfilment transitions. |
| Idempotency | Duplicate checkout/payment/refund/callback/job requests. |
| Error handling | Provider failure, stale cart, invalid address, unavailable variant and conflict paths. |
| Contract compatibility | Client/storefront/mobile consumer expectations across supported versions. |
| Security | Output redaction, ownership checks, rate limits and webhook verification. |

## 16. Contract Acceptance Criteria

The API contract layer is acceptable when each consumer has a documented, permission-safe and stable route/service to complete its task; commerce-critical commands are server-authoritative and idempotent; errors are recoverable; sensitive data is not overexposed; and contract changes can be released without silently breaking storefront, admin, mobile or provider flows.

## Related Documents

`16_architecture_design.md` and `17_system_design.md` define layers/flows. `18_db_schema.md` defines data entities. `20_integration_spec.md` details providers. `21_security_blueprint.md` defines security controls. `26_testing_quality.md` will define the full contract test strategy.
