# Phase 6 — Notifications and Email Sandbox Foundation

## Delivered in this checkpoint

Odhvica now contains a reusable, database-backed notification foundation for transactional and operational email events. The safe default is `sandbox` mode. It persists an immutable payload snapshot, a masked recipient, a delivery status and a separate delivery-attempt audit record, but it does **not** contact an email provider or send a real message.

The new owner/staff route, `/admin/notifications`, communicates the active delivery mode, event categories, preference rules and future activation requirements. It intentionally does not expose secret configuration, complete recipient email addresses or email message bodies.

## Event and preference boundary

| Event | Class | Preference behavior |
|---|---|---|
| Order confirmed | Transactional | Always eligible for delivery. |
| Payment failed | Transactional | Always eligible for delivery. |
| Fulfilment updated | Transactional | Always eligible for delivery. |
| Refund approved | Transactional | Always eligible for delivery. |
| Staff alert | Operational | Suppressed when the recipient disables operational email. |

Templates accept only the minimum operational data necessary for their event—for example order number, amount/currency or shipment status. Raw card data, card metadata, provider secrets and full notification bodies are not included in staff status records.

## Sandbox behavior

1. A notification receives an idempotency key before persistence.
2. An existing key returns the original notification and does not create another delivery attempt.
3. Eligible notifications receive a deterministic `sandbox_email_*` message identifier, with no external URL or provider call.
4. Preference-suppressed messages are recorded as `suppressed` rather than sent.
5. Tests can request a deterministic sandbox failure, recorded as `failed` with `sandbox_forced_failure`; it remains a local simulation.

## Live activation boundary

The application must remain in `ODHVICA_EMAIL_MODE=sandbox` until a specific client has a sender domain and approved provider account. Live mode is blocked unless all of these values are configured securely:

| Variable | Purpose |
|---|---|
| `EMAIL_PROVIDER_API_KEY` | Client-owned transactional email provider credential. |
| `EMAIL_FROM_ADDRESS` | Verified sender address on the client domain. |
| `EMAIL_SENDER_NAME` | Customer-facing sender display name. |

Before enabling live mode, configure sender-domain DNS records at the selected provider, test to an opted-in mailbox, define unsubscribe handling for marketing messages, configure production monitoring and verify failure/retry behavior. Live delivery provider selection and external API integration remain intentionally deferred.

## Verification

The test suite covers sandbox default/fail-closed live configuration, safe template rendering, event dispatch mapping, recipient masking, mandatory transactional delivery, preference suppression, delivery idempotency and simulated failure attempts in PGlite. No live provider credentials or customer email delivery is used by automated tests.
