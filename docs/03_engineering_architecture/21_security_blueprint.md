# Odhvica — Security Blueprint

| Field | Value |
|---|---|
| Document ID | 21 |
| Status | Approved security baseline; implementation controls and legal obligations require release-by-release validation |
| Version | 0.1 |
| Applies to | Odhvica master template and every independent client-store deployment |
| Owner | Technical lead / security owner |
| Last updated | 2026-08-12 |

## 1. Purpose

This document defines the baseline security controls for Odhvica. The application handles customer accounts, addresses, orders, payment-provider references, product uploads, staff access, commerce configuration and third-party integrations. Security must therefore be designed into the master template, client deployment process, admin workflows, provider adapters and support model.

Each client store is independently deployed and independently secured. The master template provides secure patterns; it does not centralise client production customer data or reuse credentials between clients.

## 2. Security Objectives

| Objective | Required outcome |
|---|---|
| Confidentiality | Customer, staff, order, address, secret and client business data is accessible only to authorised actors/systems. |
| Integrity | Prices, promotions, inventory, orders, payments, refunds, fulfilment and settings cannot be silently or unauthorisedly changed. |
| Availability | The store can recover from routine dependency, deployment, user and infrastructure failures without avoidable data loss. |
| Accountability | Material admin, payment, inventory, order, access and configuration actions are auditable. |
| Client isolation | One client’s data, assets, secrets, deployment or support access cannot expose another client. |
| Secure evolution | New features, providers, client customisations and releases receive security review proportionate to risk. |

## 3. Threat Model Summary

| Threat area | Example | Baseline control |
|---|---|---|
| Account takeover | Stolen/reused password, session theft, weak reset flow | Secure auth/session design, rate control, reset protections, optional MFA for staff/owner roles. |
| Broken authorisation | Customer accesses another order; staff performs unauthorised refund | Server-side ownership/permission checks on every protected command. |
| Checkout manipulation | Browser submits altered price, discount, stock or shipping amount | Server-side recalculation and validated checkout snapshot. |
| Payment spoofing | Fake client success redirect or forged provider callback | Verified provider event/callback, idempotency and reconciliation. |
| Inventory/order race | Two buyers purchase one unique product | Transaction/locking/reservation and idempotent state transitions. |
| Secret leakage | Key appears in source, logs, browser bundle or screenshot | Environment secret management, redaction, access restriction and rotation. |
| Injection/XSS | Malicious input in product/content/search/custom field | Validation, output encoding/sanitisation, parameterised data access and content policy. |
| File abuse | Malicious/oversized customer or admin upload | Type/size validation, isolated storage, restricted URL/access and malware strategy. |
| Provider abuse | Unverified webhook, replayed callback, rate-limited integration | Signature verification, event deduplication, allow-list/timeout/retry and monitoring. |
| Operational compromise | Exposed VPS service, weak SSH, unpatched dependency, unsafe deployment | Firewall/TLS, least privilege, patch policy, secure deployment and backup/monitoring. |
| Data loss | Failed migration, deletion, ransomware, provider outage | Encrypted backups, restore testing, rollback/forward-fix and retention controls. |

## 4. Data Classification

| Classification | Examples | Handling requirement |
|---|---|---|
| Public | Published product/content, public policies, storefront images | May be cached/delivered publicly; maintain integrity and publication controls. |
| Internal | Product cost, supplier/internal notes, operational dashboard data, non-public draft content | Restricted to authorised staff; exclude from public APIs/logs. |
| Personal | Customer name, email, phone, address, order history, consent, support requests | Access-controlled, minimised, retained/deleted under policy; never exposed across customers/clients. |
| Sensitive operational | Payment provider references, refund/reconciliation details, admin audit records, user role state | Strict role controls, audit access and secure logging. |
| Secret | Password hashes, API keys, private tokens, webhook secrets, database credentials, SSH keys | Server-only secret storage; never normal logs, source control, browser delivery or general documentation. |
| Restricted upload | Customer reference images, measurement attachments, identity-like documents if ever enabled | Purpose-limited access, isolated storage, retention/deletion rule and download authorisation. |

## 5. Identity and Authentication

### 5.1 Customer Authentication

| Requirement | Baseline control |
|---|---|
| Password handling | Store only strong password hashes if local password auth is used; never plaintext/reversible password storage. |
| Session design | Secure, short-lived/rotatable session/token approach selected by authentication ADR; protect cookies/tokens appropriately. |
| Registration | Validate email and rate-limit abuse; require verification approach appropriate to the selected flow. |
| Password reset | Use single-use, expiring, opaque reset tokens and safe customer messaging. |
| Brute-force protection | Rate-limit/monitor login and reset attempts; avoid account enumeration in customer-facing messages. |
| Customer privacy | Customer account endpoints enforce ownership at server/service layer. |
| Account lifecycle | Support disable/lock/recovery with audit and customer-support procedure. |

### 5.2 Staff and Owner Authentication

Staff/owner accounts have access to products, orders, customer data, provider settings and potentially refunds. They require stronger controls.

| Requirement | Baseline control |
|---|---|
| Role separation | Owner, finance, manager, fulfilment, content and support permissions remain separate. |
| MFA | Plan MFA or equivalent stronger verification for owner/high-privilege staff before production maturity. |
| Invitation flow | Invitations are expiring, single-use, role-limited and auditable. |
| Access revocation | Owner can revoke staff/developer access promptly; revoked sessions are invalidated. |
| Sensitive action step-up | Refund, role change, secret/provider configuration, export and destructive actions require re-authentication/confirmation when appropriate. |
| Support access | Developer/support access is time-bound, least-privilege and explicitly authorised. |

## 6. Authorisation and Object Ownership

Permissions are enforced by server-side service/action policy. Hiding a menu or button is not access control.

| Subject | Required checks |
|---|---|
| Guest | Only access explicitly public routes/actions; rate and abuse controls apply. |
| Customer | Authenticated identity plus ownership of cart, address, order, wishlist, review, support or privacy record. |
| Staff | Authenticated staff status plus specific permission for the command and target data. |
| Owner | Elevated permission; sensitive actions still audited/confirmed. |
| Background job | Narrow service identity and action scope; no broad admin bypass. |
| Provider callback | Verified external identity plus event type/endpoint scope; no user session trust. |

Every query that reads private objects must scope by the authorised relationship. Every update/delete/refund/export action checks both permission and valid entity state.

## 7. Application Security Controls

| Area | Required control |
|---|---|
| Input validation | Validate all external input at boundary and enforce business validation at domain service. |
| Data access | Use parameterised/query-builder access patterns; never build database queries from untrusted raw strings. |
| Output encoding | Encode/sanitise rendered user/content fields to prevent script injection; rich text uses controlled sanitisation. |
| CSRF/session protection | Apply protection appropriate to selected auth/session mechanism for state-changing browser actions. |
| Rate limits | Protect authentication, password reset, public search, checkout attempts, uploads, contact/support and provider endpoints. |
| Security headers | Configure restrictive, tested browser security headers and content policies appropriate to required providers/media. |
| Dependencies | Maintain dependency update/vulnerability review process; lock and review critical package changes. |
| Error handling | Return safe messages; store detailed errors internally with secret/PII redaction. |
| Feature flags | Protect unfinished/high-risk functionality from accidental public access. |

## 8. Commerce and Payment Security

| Commerce risk | Security control |
|---|---|
| Price manipulation | Recalculate product/variant/discount/shipping/tax totals server-side from trusted records. |
| Promotion abuse | Evaluate usage/eligibility/stacking atomically and record redemption. |
| Stock oversell | Transactional inventory/reservation control and order/payment idempotency. |
| Order forgery | Create/order transitions only through validated checkout and verified payment/order policy. |
| Payment false-positive | Require verified provider callback/reconciliation rather than browser redirect/success claim. |
| Refund abuse | Permissioned refund workflow, order/payment-state validation, amount limits and audit trail. |
| Provider replay | Store verified provider event ID/reference and process duplicate safely as no-op. |
| Sensitive payment data | Do not store raw payment card/bank credentials; use approved provider flow. |
| Dispute/reconciliation | Restricted exception queue with provider/internal reference and auditable resolution. |

## 9. File and Media Security

Product imagery and content media are business assets. Customer reference files can be private. File flows require their own controls.

| Control | Requirement |
|---|---|
| Authorisation | Confirm actor may upload to intended product/content/order context. |
| File validation | Allow-list type/extension, inspect content where feasible, enforce size/dimension limits and reject malformed files. |
| Storage path | Generate opaque server-controlled object keys; do not use raw user filenames as public paths. |
| Private uploads | Use protected/private access/expiring signed delivery where required. |
| Public media | Publish only approved product/content assets through controlled delivery. |
| Malware handling | Define scanning/quarantine approach before broad untrusted-upload availability. |
| Metadata stripping | Assess image metadata/privacy handling for customer uploads and public product media. |
| Retention | Follow defined content/order/privacy retention and deletion policy. |

## 10. Integration and Webhook Security

| Control | Requirement |
|---|---|
| Secret storage | Provider keys/webhook secrets are server-only and client/environment-specific. |
| Endpoint verification | Verify signature/authentication using current official provider documentation before parsing/acting. |
| Replay defence | Persist provider event ID/signature/time context as appropriate and deduplicate. |
| Payload controls | Limit request size, validate expected event/type/reference and reject unexpected event source. |
| Timeouts/retries | Use bounded network timeouts and idempotent retry strategy; never retry unsafe operation blindly. |
| Outbound data | Send minimum required data and avoid customer/private data in analytics or monitoring payloads. |
| Account scope | One client integration configuration cannot be callable by another client deployment. |
| Error response | Do not reveal verification secrets or internal transaction state to external caller. |

## 11. Infrastructure and Deployment Security

| Layer | Baseline control |
|---|---|
| Network | Expose only required web/proxy ports; restrict database/cache/admin ports from public internet. |
| TLS | Enforce HTTPS, redirect insecure traffic and maintain certificate renewal/monitoring. |
| Reverse proxy | Configure request limits, secure headers, proxy trust, body/upload limits and route restrictions. |
| Application process | Run with minimal OS privileges; separate deployment/runtime user from root where practical. |
| Database | Use restricted database role, strong credentials, network isolation, encrypted connection where supported and backup controls. |
| Cache/queue | Private network/service access; authentication if exposed beyond local protected boundary. |
| SSH/server access | Key-based access, restricted users, firewall, patch policy and access review. |
| Containers/processes | Pin/review images/dependencies, do not embed secrets, restrict permissions and monitor health. |
| Environments | Separate local/test/staging/production secrets/data; no production data in development without approved sanitisation. |
| Backups | Encrypt, restrict access, test restoration and document retention/restore objectives. |

## 12. Logging, Monitoring and Audit

Security logging must be useful without becoming a new data leak.

| Event class | Required record |
|---|---|
| Authentication | Login success/failure category, reset/invitation flow, session revoke and suspicious rate-limit events. |
| Access control | Material denied access, role/permission changes and privileged access use. |
| Commerce | Payment/refund/order/price/inventory/fulfilment state transitions and failure categories. |
| Configuration | Integration, secret reference, shipping/payment/tax, feature flag and store setting changes. |
| Data actions | Export, privacy request, bulk update, archive/delete and sensitive record access where warranted. |
| Infrastructure | Deployment, backup/restore, migration, health and unexpected process/dependency events. |

Logs must not include raw passwords, tokens, private keys, card data, full payment payloads, full customer addresses, personalisation content or other unnecessary sensitive data. Use correlation IDs and structured redacted summaries.

## 13. Incident Response Baseline

| Phase | Required action |
|---|---|
| Detect | Monitoring/alert or report identifies suspected security, data, payment or availability incident. |
| Triage | Assess affected client deployment, data class, scope, active compromise and urgency. |
| Contain | Disable/revoke affected secret/session/integration/path; limit access or pause unsafe operation. |
| Preserve | Retain relevant logs/audit/event evidence without altering source data unnecessarily. |
| Eradicate | Patch vulnerability, rotate credentials, correct configuration or remove malicious content. |
| Recover | Restore validated service/data, reconcile orders/payments and verify monitoring. |
| Communicate | Follow client contract/legal obligations for owner/customer/authority communication. |
| Learn | Record decision/incident, root cause, remediation and test/process update. |

## 14. Security Review Gates

| Change type | Required review |
|---|---|
| Authentication/roles | Security and permission review, abuse testing and audit update. |
| Payment/refund/checkout | Security, provider verification, idempotency and failure-path review. |
| New provider/webhook | Secret, signature, data sharing, retry/replay and monitoring review. |
| File upload | Validation/storage/access/retention review. |
| Customer data export/privacy | Ownership, verification, data scope and legal/compliance review. |
| Database migration | Data integrity, backup, rollback/forward-fix and access review. |
| Admin setting | Permission/audit/validation review. |
| Client custom feature | Classification, client isolation and master-promotion security check. |
| Deployment change | Infrastructure, secret, firewall/TLS, backup and rollback review. |

## 15. Security Testing Requirements

Security tests are part of product quality. They include permission/ownership tests, input/output validation tests, secure session/auth flows, rate-limit/abuse checks, checkout/price/stock tampering attempts, webhook verification/replay tests, upload abuse tests, dependency review, secret scanning and deployment configuration review.

High-risk production changes must be tested in a non-production environment with safe test accounts/data before release. Any discovered critical weakness blocks production release until mitigated or formally risk-accepted with an approved remediation plan.

## 16. Security Acceptance Criteria

Odhvica is security-ready for a client release when client data/secrets are isolated; auth and server-side permissions protect customer/admin objects; checkout/payment/order/inventory transitions resist manipulation and duplication; providers are verified; uploads are controlled; infrastructure is hardened; logs/audits are useful and redacted; backups are recoverable; and incident/release procedures are documented.

## Related Documents

`16_architecture_design.md` defines trust boundaries. `17_system_design.md` defines critical flows. `18_db_schema.md` defines data classification and audit entities. `19_api_contracts.md` and `20_integration_spec.md` define interface/provider rules. `26_testing_quality.md` and `27_devops_deployment.md` will define test and deployment execution details.
