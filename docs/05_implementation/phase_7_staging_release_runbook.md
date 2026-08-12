# Phase 7 — Staging Acceptance, Release Gate and Rollback Runbook

## Purpose

This runbook turns the Odhvica implementation plan into a controlled client-store release rehearsal. It does not replace the broader VPS policy in `27_devops_deployment.md`; it is the practical evidence checklist that must be completed before a client deployment is approved for production.

## Ownership and go/no-go rule

| Role | Decision responsibility |
|---|---|
| Technical release owner | Owns source revision, migration plan, test evidence, deployment procedure, technical go/no-go and rollback execution. |
| Client store owner | Approves brand content, catalogue, policies, shipping promises, taxes, payment accounts and customer-facing go/no-go. |
| Operations owner | Owns backup/restore evidence, monitoring, incident contact path and infrastructure readiness. |
| Provider owners | Verify client-owned payment, courier, email and analytics accounts in test/staging mode before any production credentials are used. |

> A release is **no-go** if any critical customer path, backup restore, staff access/2FA control, migration rehearsal, provider webhook verification or rollback owner is missing. A deployment may not proceed on the assumption that these can be fixed after launch.

## Preconditions for a staging rehearsal

| Area | Required evidence before staging test |
|---|---|
| Source | Exact Git commit, changelog, passing CI quality workflow and approved release owner. |
| Database | Client-isolated PostgreSQL, least-privilege application user, tested migration order, encrypted backup target and empty/sanitised staging data. |
| Storage | Client-isolated object storage bucket/prefix, access policy and product media retrieval test. |
| Auth | Separate Better Auth staging secret/base URL, staff test accounts, mandatory 2FA enrolment and customer test account. |
| Payments | Razorpay/Stripe/PayPal test accounts, server-side webhook secrets, tested callback endpoints and documented refund test procedure. |
| Operations | Staging domain/TLS, health endpoint, error/uptime logging, CPU/memory/disk signals and named incident contacts. |
| Business rules | Approved GST, prices, currencies, shipping/free-shipping, made-to-order lead time, return/exchange and privacy/consent rules. |

## Staging execution sequence

| Step | Operator action | Pass condition |
|---:|---|---|
| 1 | Record target commit, migration set, environment/configuration diff and rollback owner. | Release record exists and each change has an owner. |
| 2 | Run CI and local `pnpm --filter web quality`; archive failed-test artifacts if any. | Unit/integration, type, lint, E2E and build all pass. |
| 3 | Rebuild the locked production artifact and deploy to staging. | Health endpoint is reachable only through expected route/proxy policy. |
| 4 | Take encrypted database/media/configuration-metadata backup. | Backup reference, timestamp and restoration operator are recorded. |
| 5 | Apply migrations in reviewed order, once, with operator log. | Schema version matches target and application health stays green. |
| 6 | Run customer/staff UAT using staging accounts. | Storefront, account, 2FA staff access, catalogue, bag, checkout and order status work as expected. |
| 7 | Run provider sandbox tests. | Hosted payment handoff, signed webhook verification, duplicate webhook idempotency, notification delivery, courier fallback and refund policy have evidence. |
| 8 | Run accessibility, mobile, performance and security checks. | Critical issues are resolved or explicitly accepted by technical/client owners. |
| 9 | Restore the backup into a controlled restore target. | Products, orders, payments, relationships and media sample retrieval validate after restore. |
| 10 | Complete go/no-go meeting and sign release record. | Both technical and client owners approve, or the release remains blocked. |

## Production smoke test after deploy

The release owner should record the timestamp, operator and result of each smoke test. Do not use real customer accounts for validation.

| Surface | Smoke test |
|---|---|
| Public storefront | Home, collection, product media, price, stock/made-to-order lead time, policy links and mobile rendering. |
| Customer | Registration/sign-in, saved address, bag persistence, checkout validation and no raw card-data collection. |
| Payments | Correct domestic/international provider route, hosted handoff, signed test/live webhook policy and duplicate-event safety. |
| Staff | 2FA required, least-privilege route access, catalogue edit, inventory/production queue, order/fulfilment transition and refund step-up enforcement. |
| Notifications | Transactional email delivery/retry status, recipient masking and marketing-consent exclusion. |
| Operations | Health, error log, TLS, database connectivity, backup result, queue/provider alert path and resource dashboard. |

## Rollback decision table

| Situation | Immediate decision | Recovery validation |
|---|---|---|
| Application defect; schema remains compatible | Re-deploy the prior tested artifact. | Health, public smoke tests, staff access and order writes are stable. |
| Defect requires forward fix; rollback would break schema | Stop release expansion; apply reviewed forward fix. | Migration compatibility, affected orders/payments and logs are reconciled. |
| Migration/data corruption risk | Stop writes where safe, preserve evidence and restore/forward-fix under the named owner. | Restore target validation proves product/order/payment integrity before reopening. |
| Provider misconfiguration | Disable unsafe payment/courier/message path, revert secret/configuration and use manual approved fallback. | No duplicated payment/refund/shipment action; customer communication path is confirmed. |
| Security incident | Contain access, revoke/rotate credentials, preserve evidence and follow security response. | Clean deployment, access review and affected-scope assessment are approved. |

No operator should use an undocumented direct production patch, unreviewed database SQL or a guessed provider retry as a rollback mechanism.

## Remaining blockers that cannot be cleared locally

The repository has complete sandbox boundaries and browser quality coverage, but these are still client/project-specific external dependencies: PostgreSQL/object storage provisioning; Better Auth production configuration and staff 2FA; Razorpay/Stripe/PayPal accounts and webhooks; courier selection; email sender domain; GST/business rules; GA4/Meta/Search Console identifiers; Hostinger VPS/domain/TLS; monitoring; and client UAT acceptance.
