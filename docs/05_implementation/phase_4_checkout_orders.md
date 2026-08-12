# Phase 4 — Cart, Checkout and Order Foundation

## Delivered foundation

The implementation now contains an explicit relational model for customer addresses, carts, cart items, promotions, checkout attempts, orders, order items, payments, fulfilment events, return requests and immutable refund approvals. Migrations `0003_strange_plazm.sql` and `0004_dapper_bromley.sql` must be applied only to the isolated PostgreSQL environment after Phase 0 provider and tax configuration is approved.

The public UI exposes a browser-persisted bag, address capture, order summary and payment-route preview. It deliberately does **not** collect payment-card data or initiate provider payments before the client store has configured verified merchant accounts, shipping/tax rules, and the PostgreSQL runtime. The browser bag is a presentation bridge; server-side `cart`, `cart_item` and `checkout_attempt` records are the authoritative runtime model when database configuration is enabled.

## Server-authoritative checkout path

1. `addCartItem` validates product/variant publication, availability and required customisation fields before persisting a line.
2. `beginCheckout` validates the address, reads current catalogue prices, creates a price/routing snapshot, selects an eligible provider on the server and writes a unique checkout attempt.
3. For tracked or one-of-a-kind items, checkout conditionally increments `inventory_item.reserved` only when the expected version and sellable stock condition still hold. A reservation movement and audit event are written in the same transaction.
4. A repeated idempotency key returns the existing attempt without creating a second reservation.
5. A provider-specific adapter must verify a webhook signature before calling `confirmVerifiedPayment`. Browser redirects, query parameters and client-reported success are never enough to confirm an order.
6. Verified payment confirmation creates immutable order/item snapshots, consumes the reserved stock, creates the payment and fulfilment records, converts the cart, completes the checkout attempt and records an audit event in one transaction.

## Payment routing boundary

India delivery with INR is eligible for Razorpay only when Razorpay is enabled. Non-India deliveries use Stripe as the preferred method when eligible; PayPal remains an eligible customer-selected alternative/fallback. The system preserves the selected provider and routing snapshot per checkout attempt and does not silently change a provider after payment initiation.

## Order lifecycle boundary

Order, payment, fulfilment and post-purchase states are separate. `state-machine.ts` rejects impossible transitions, while protected operations persist allowed order and fulfilment transitions, return/exchange requests, refund approvals and audit events. Refund approvals require the `refunds:approve` permission plus a fresh second-factor challenge; their idempotency key ensures a retry cannot create a second approval. The protected `/admin/orders` workspace is reserved for authenticated staff, but remains unpopulated until verified checkouts create persisted orders.

PGlite-backed integration tests cover fulfilment and order-state persistence, return and exchange requests, refund approval idempotency, audit side effects, permission boundaries and second-factor enforcement. Provider execution is intentionally not simulated: no real refund is attempted until the store-owned payment-provider adapter has verified credentials and webhook/reconciliation policy.

## Remaining activation work

Live Razorpay, Stripe and PayPal adapter calls, webhook signature verification, provider-side refund execution/reconciliation, courier/tracking APIs, GST calculation/invoice generation, customer accounts and actual production database/object-storage configuration are intentionally deferred until the client’s business/provider credentials and policy inputs are available. No payment secret or customer payment data is committed to the repository.
