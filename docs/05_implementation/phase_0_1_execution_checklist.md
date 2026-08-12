# Odhvica — Phase 0 and Phase 1 Detailed Execution Checklist

| Field | Value |
|---|---|
| Document type | Detailed execution checklist |
| Covers | Phase 0: Decisions and Readiness; Phase 1: Platform Foundation |
| Project | Odhvica reusable handmade-commerce template |
| Version | 1.0 |
| Status | Ready for execution |
| Owner | Product owner and technical lead |
| Last updated | 2026-08-12 |

## 1. How to Use This Checklist

This checklist converts the approved roadmap into work that can be assigned, evidenced and signed off. A task may be marked complete only after its deliverable, validation evidence and owner review are recorded. A blocked item must remain visibly blocked rather than being replaced with an assumption.

> **Execution rule:** Phase 1 code may begin only after the Phase 0 gate passes. No live payment credential, real customer data or unapproved tax/privacy decision may be used in development or staging.

| Status | Meaning |
|---|---|
| Not started | No work has begun. |
| In progress | Work has started; evidence is not yet complete. |
| Blocked | A dependency, decision, account or approval is missing. |
| Ready for review | Deliverable and evidence exist; owner review is pending. |
| Complete | Deliverable, validation evidence and owner approval are recorded. |

## 2. Phase 0 — Decisions, Accounts and Build Readiness

### Phase 0 objective

Phase 0 removes business, provider, security and operating ambiguity before product code is written. The output is an approved build brief, not a partially working storefront. This phase protects the project from rework caused by incorrect payment, tax, shipping, privacy, hosting or ownership assumptions.

### Milestone 0.1 — Scope, market and business-operating decisions

| ID | Checklist task | Owner | Required input | Completion evidence |
|---|---|---|---|---|
| P0-01 | [ ] Freeze Odhvica v1 scope. Confirm the reference-store MVP, advanced modules, later items and exclusions against the PRD and feature scope. | Product owner | `03_prd.md`, `04_feature_scope.md`, `05_commerce_rules.md` | Signed scope matrix with one owner and priority for every requested capability. |
| P0-02 | [ ] Prepare the initial market matrix: selling countries, shipping countries, displayed currencies, settlement currencies, languages and customer-support coverage. | Product owner | Sales strategy and carrier reach | Versioned market matrix; unsupported countries are explicitly blocked rather than implied. |
| P0-03 | [ ] Decide the India GST operating scope. Confirm whether GST is enabled for Odhvica v1; if yes, collect legal name, registered address, GSTIN, state/UT code, approved product HSN/SAC values, tax-rate references, fiscal invoice sequence and B2B-invoice process. | Product owner with qualified tax advice | `05_commerce_rules.md`, `18_db_schema.md`, actual business registration | Client-approved GST configuration sheet. This is a product/data readiness item, not tax advice or a compliance conclusion. |
| P0-04 | [ ] Define the delivery and returns operating model: production lead time, ready-stock versus made-to-order rules, cancellation boundary, return/exchange policy inputs, manual tracking process and free-shipping thresholds. | Product owner | Product workflow and customer-service policy | Approved commerce configuration sheet plus published-policy content draft. |
| P0-05 | [ ] Prepare representative catalogue fixtures: one handmade jacket, one bag/accessory, at least one product with variants, one made-to-order item and one customisation example. | Product owner / catalogue operator | Product images, prices, sizes, materials, care, stock and lead times | Sanitised fixture spreadsheet/media pack; no live customer data. |
| P0-06 | [ ] Approve the Odhvica visual brief: logo, font licences, colours, photography direction, product imagery rights, campaign style and public content tone. | Product owner / design owner | Brand assets and content rights confirmation | Brand-asset inventory and approved visual reference pack. |

### Milestone 0.2 — Provider and account readiness

| ID | Checklist task | Owner | Required input | Completion evidence |
|---|---|---|---|---|
| P0-07 | [ ] Create the payment-provider capability matrix for Razorpay, Stripe and PayPal. Record eligible delivery markets, currencies, account status, test/live mode, refund path, dispute owner, webhook prerequisites and fallback behaviour. | Product owner / integration owner | Provider account information and current provider documentation | Approved provider matrix. Unavailable or unverified routes are disabled in the first release. |
| P0-08 | [ ] Confirm provider-hosted payment-flow design. Select the approved Razorpay, Stripe and PayPal hosted/redirect/tokenised route; reject any design that captures raw card number or CVV in Odhvica forms. | Technical lead / integration owner | `20_integration_spec.md`, `21_security_blueprint.md` | Provider-flow decision record, test plan and PCI-scope review note. Client merchants remain responsible for validating actual PCI DSS obligations. |
| P0-09 | [ ] Select the initial shipping process. Decide whether v1 uses manual tracking only or a validated courier API, and define manual fallback for quote, label, pickup and tracking failures. | Product owner / operations owner | Carrier account/serviceability information | Shipping operating procedure and configured service matrix. |
| P0-10 | [ ] Select transactional email provider, sender domain and customer-support contact route. Define order, payment issue, production, shipment, refund and support templates. | Product owner / technical lead | Client-owned email domain/account | Sender/domain ownership record, test sender and message-template inventory. |
| P0-11 | [ ] Select media storage provider and access model. Confirm bucket/namespace, product-media public delivery, private custom-upload handling, retention, backup and access owner. | Technical lead / product owner | Storage account and media policy | Storage design record and client-owned access/backup owner. |
| P0-12 | [ ] Set up client-owned GA4, Meta Pixel and Google Search Console accounts/properties, or record that each remains disabled until client accounts are ready. | Product owner / growth owner | `14_seo_analytics.md` | Account/property ownership checklist. No production identifier is committed to Git. |

### Milestone 0.3 — Privacy, security and compliance readiness

| ID | Checklist task | Owner | Required input | Completion evidence |
|---|---|---|---|---|
| P0-13 | [ ] Approve customer-facing policy ownership and publication workflow for terms, privacy, cookie/tracking, shipping, returns/refunds/exchanges, custom products and size/care content. | Product owner with qualified legal review | `28_legal_compliance.md` | Policy-owner register, content approval process and launch checklist entry. |
| P0-14 | [ ] Decide consent categories and preference behaviour for marketing email, WhatsApp/SMS, analytics and advertising. Define withdrawal handling and data shared with each provider. | Product owner / growth owner / technical lead | `14_seo_analytics.md`, `28_legal_compliance.md` | Consent matrix mapping each integration to purpose, owner, trigger, preference state and removal process. |
| P0-15 | [ ] Set the mandatory admin 2FA/OTP policy. Choose the second-factor method, enrolment sequence, backup/recovery process, support escalation and owner of lost-device recovery. | Technical lead / product owner | `21_security_blueprint.md` | Signed admin-access policy. No production admin account is exempt. |
| P0-16 | [ ] Define data-handling boundaries for addresses, custom measurements, personalisation, private customer uploads, support notes, analytics and backups. | Technical lead / product owner | `18_db_schema.md`, `21_security_blueprint.md`, `28_legal_compliance.md` | Data-classification and retention/configuration sheet; qualified review remains required for client-specific legal obligations. |

### Milestone 0.4 — Repository, environment and operational readiness

| ID | Checklist task | Owner | Required input | Completion evidence |
|---|---|---|---|---|
| P0-17 | [ ] Set GitHub working rules: branch naming, pull-request template, issue labels, review requirement, release-tag convention, changelog expectations and source-code ownership boundary. | Technical lead | Public Odhvica repository and `25_code_quality.md` | Repository governance file or documented project rules are approved. |
| P0-18 | [ ] Build an environment inventory for local, staging and production. Record hostname, purpose, owner, database, storage, provider mode, analytics mode, secret owner and backup owner for each environment. | Technical lead / DevOps owner | Provider and hosting decisions | Environment matrix with no live secret reused outside production. |
| P0-19 | [ ] Provision and harden non-production VPS/staging. Apply OS updates, key-based SSH, least-privilege user, firewall, private database/cache access and test hostname/DNS. | DevOps owner | VPS account and environment matrix | Staging access review, firewall verification and baseline server-hardening evidence. |
| P0-20 | [ ] Define secret-management process. Maintain an inventory of variable name, purpose, environment, owner, rotation trigger and access role; never record secret values in Git or documentation. | Technical lead / DevOps owner | Environment matrix | Secret inventory without values, `.env.example` plan and rotation/revocation procedure. |
| P0-21 | [ ] Prepare test-data and sandbox policy. Create fake customer profiles, test addresses, product fixtures, payment sandbox accounts and cleanup procedure. | QA owner / technical lead | Provider sandbox setup | Test-data policy proves no production customer data is needed in development or staging. |
| P0-22 | [ ] Create Phase 0 risk register. Record unresolved market, GST, payment, shipping, privacy, accessibility, account, VPS and asset risks with owner and due decision. | Product owner / technical lead | Outputs of P0-01 to P0-21 | No launch-blocking unknown remains without an owner and explicit decision date. |

### Phase 0 exit gate

| Gate check | Required proof |
|---|---|
| Product and market | Scope, market/currency, product fixture and commerce configuration sheets are approved. |
| Tax and policy | GST decision is recorded; policy-content ownership and qualified review path are defined. |
| Payments and shipping | Provider capability matrix, hosted-flow design, courier/manual fallback and transactional sender are approved. |
| Security and privacy | Admin 2FA policy, consent matrix, data boundary and secret process are approved. |
| Operations | Git workflow, environment inventory, staging VPS, sandbox data and risk register are ready. |

> **Phase 0 milestone:** The project is ready to create the first application code only when every Phase 0 gate check has evidence or an approved decision that disables the affected feature from v1.

## 3. Phase 1 — Platform Foundation

### Phase 1 objective

Phase 1 builds the secure, repeatable base used by every later Odhvica feature. It does not build catalogue, cart or payments yet. Its milestone is a staging deployment that starts reliably, uses isolated PostgreSQL, enforces roles and 2FA for admin access, records audit events, passes automated checks and can be restored from backup.

### Milestone 1.1 — Application scaffold and engineering workflow

| ID | Checklist task | Owner | Dependency | Completion evidence |
|---|---|---|---|---|
| P1-01 | [ ] Initialise the Next.js App Router and TypeScript project with the approved Node.js LTS version, package scripts and strict compiler settings. | Technical lead | Phase 0 exit gate | Clean clone installs, typechecks, builds and starts locally using documented commands. |
| P1-02 | [ ] Create module boundaries from `23_folder_structure.md`: storefront, admin, domain/commerce, database, integrations, shared UI, configuration and tests. | Technical lead | P1-01 | No route directly bypasses domain/service boundaries for protected data changes. |
| P1-03 | [ ] Configure Tailwind CSS, semantic design tokens, baseline accessible UI primitives and a minimal app shell. | Frontend/UI developer | P1-01 | Tokens and primitives render in a documented component showcase or test route. |
| P1-04 | [ ] Add environment-schema validation at startup. Required variables must have typed names, allowed environments and safe defaults; the app must fail closed when critical configuration is missing. | Technical lead | P0-20, P1-01 | Missing/invalid critical environment configuration produces a safe startup failure. |
| P1-05 | [ ] Configure quality tooling: formatter, linter, typecheck, dependency policy and pre-commit or pull-request checks. | Technical lead | P1-01 | A deliberately invalid lint/type change fails locally and in CI. |
| P1-06 | [ ] Create CI workflow for install, lint, typecheck, unit tests, build and secret/dependency checks. | Technical lead | P1-05, P0-17 | Pull request/branch verification produces visible pass/fail evidence. |

### Milestone 1.2 — PostgreSQL, Drizzle and base data model

| ID | Checklist task | Owner | Dependency | Completion evidence |
|---|---|---|---|---|
| P1-07 | [ ] Provision separate local and staging PostgreSQL databases with non-production credentials and restricted network access. | DevOps owner / technical lead | P0-18, P0-19 | Application can connect to each intended non-production database; no production database is reachable from public internet. |
| P1-08 | [ ] Configure Drizzle ORM, migration generation/application workflow and migration naming/review rules. | Backend/commerce developer | P1-07 | Empty database can be migrated repeatedly through one documented command path. |
| P1-09 | [ ] Implement base schema: users, staff/customer profiles, roles, permissions, sessions, store settings, audit logs and common timestamps/identifiers. | Backend/commerce developer | P1-08, `18_db_schema.md` | Constraints, foreign keys and indexes are migration-managed and unit/integration tested. |
| P1-10 | [ ] Create non-production seed fixtures for one owner, restricted staff role, customer role and safe store configuration. | Backend/commerce developer / QA owner | P1-09, P0-21 | Seed/reset process creates predictable demo data without personal or live provider information. |
| P1-11 | [ ] Prove migration safety: apply base migration to clean staging, inspect schema, run seed and perform rollback/forward-fix rehearsal. | Technical lead / QA owner | P1-08 to P1-10 | Migration execution record and recovery notes are retained. |

### Milestone 1.3 — Identity, mandatory admin 2FA and access control

| ID | Checklist task | Owner | Dependency | Completion evidence |
|---|---|---|---|---|
| P1-12 | [ ] Configure Better Auth for customer and staff identity, secure session settings, password hashing, verification/reset flow and safe error messages. | Backend/commerce developer | P1-09, P0-15 | Customer sign-up/sign-in/sign-out/reset works in staging without account enumeration or plaintext secret exposure. |
| P1-13 | [ ] Implement staff invitation flow, role assignment and session revocation. | Backend/commerce developer | P1-12, P1-09 | Invitation is expiring/single-use; revoked user loses protected access. |
| P1-14 | [ ] Implement mandatory admin 2FA/OTP enrolment and verification. All owner/staff admin sessions must require a second factor after primary authentication. | Backend/commerce developer / security owner | P0-15, P1-12 | Tests prove that a password-only staff login cannot access admin routes or issue an admin session. |
| P1-15 | [ ] Implement secure 2FA/OTP recovery: backup/recovery path, identity verification, owner audit requirement and session invalidation after recovery. | Technical lead / security owner | P1-14 | Lost-device scenario is rehearsed in staging and produces an audit record. |
| P1-16 | [ ] Enforce server-side permissions and object-ownership policy. Protect admin routes/actions and define guest/customer/staff/owner boundaries. | Backend/commerce developer | P1-12 to P1-14 | Automated tests prove that unauthorised or lower-privilege access is rejected. |
| P1-17 | [ ] Add recent re-authentication/step-up confirmation for sensitive actions such as future refunds, role changes, provider configuration, exports and destructive settings. | Backend/commerce developer | P1-14, P1-16 | Protected-action test requires fresh verification and records the result. |
| P1-18 | [ ] Implement structured audit-log service for authentication, access denial, role changes, admin 2FA recovery and future sensitive action categories. | Backend/commerce developer | P1-09, P1-16 | Audit entries contain actor, action, object, outcome and correlation context without passwords, tokens or private content. |

### Milestone 1.4 — Staging deployment, observability and recovery

| ID | Checklist task | Owner | Dependency | Completion evidence |
|---|---|---|---|---|
| P1-19 | [ ] Create a production-oriented Dockerfile with a reproducible build, non-root runtime user and no embedded secret values. | Technical lead / DevOps owner | P1-01, P1-04 | Local container build runs successfully and image inspection shows no injected credential. |
| P1-20 | [ ] Create Docker Compose staging topology for application, PostgreSQL and optional internal services. Use named volumes/private networking and environment separation. | DevOps owner | P1-07, P1-19 | Staging stack starts from documented configuration; database/cache ports are not publicly exposed. |
| P1-21 | [ ] Configure Caddy for staging hostname, HTTPS, reverse proxy, request/body limits, security headers and safe static/media routing. | DevOps owner | P0-19, P1-20 | HTTPS works, insecure HTTP redirects safely and internal service ports cannot be reached publicly. |
| P1-22 | [ ] Add health, readiness and version endpoints plus structured redacted application logs and correlation IDs. | Technical lead | P1-01, P1-20 | Health checks distinguish startup/readiness failure; test error does not expose secrets or private data. |
| P1-23 | [ ] Configure baseline monitoring and alert routing for uptime, application errors, VPS resource pressure, database availability, backup result and failed health checks. | DevOps owner | P1-22, P0-18 | Test alert reaches the named operations owner; alert includes no unnecessary customer data. |
| P1-24 | [ ] Apply application security baseline: secure cookies/session settings, CSRF/CORS decisions, rate limits, headers, error redaction, dependency scanning and secret scanning. | Technical lead / security owner | P1-12, P1-21 | Security checklist and automated checks pass; known exceptions have an owner and remediation date. |
| P1-25 | [ ] Automate encrypted staging database backup and prove restoration into a clean non-production database. | DevOps owner / QA owner | P1-07, P1-20 | Backup job report and successful restore verification are retained. |
| P1-26 | [ ] Run Phase 1 staging smoke test: deploy, health check, customer session, staff 2FA login, role denial, audit event, database migration, backup and restore. | QA owner / technical lead | P1-01 to P1-25 | Test run record shows every critical scenario pass or an approved release-blocking defect. |

### Phase 1 exit gate

| Gate check | Required proof |
|---|---|
| Application quality | Next.js project builds, typechecks, lints and passes baseline tests in CI. |
| Deployment | Staging stack runs through Docker/Compose behind HTTPS with no public database/cache exposure. |
| Data | PostgreSQL and Drizzle migrations are reproducible; fixture seed and restore drill pass. |
| Access | Customer auth works; admin roles are server-enforced; every staff/owner admin login requires 2FA/OTP. |
| Security | Secrets are excluded/redacted, baseline headers/rate controls exist and audit events work. |
| Operations | Health checks, logs, monitoring and an alert test are successful. |

> **Phase 1 milestone:** Odhvica has a secure, observable, recoverable staging foundation. Only after this gate passes should Phase 2 storefront/content work and Phase 3 catalogue implementation begin.

## 4. Phase 0–1 Handoff to Phase 2

The Phase 2 owner receives the following approved assets: the scope and market configuration; staging access; secure environment inventory; design tokens and app shell; role/2FA model; migrations and fixtures; content/policy ownership; media-storage decision; payment/shipping route decisions; measurement/consent boundary; test data; and the Phase 1 evidence record.

Any requested change that affects the market matrix, GST, payment routing, provider-hosted payment design, 2FA policy, privacy/consent, database baseline, VPS topology or release gate must be recorded in `07_memory.md` before it is implemented.

## Related Documents

This execution checklist operationalises `implementation_roadmap.md` and must remain consistent with `03_prd.md`, `05_commerce_rules.md`, `07_memory.md`, `14_seo_analytics.md`, `18_db_schema.md`, `20_integration_spec.md`, `21_security_blueprint.md`, `25_code_quality.md`, `26_testing_quality.md`, `27_devops_deployment.md`, `28_legal_compliance.md` and `30_client_presentation.md`.
