# Odhvica — Folder Structure

| Field | Value |
|---|---|
| Document ID | 23 |
| Status | Approved structural direction; exact framework conventions confirmed during scaffolding |
| Version | 0.1 |
| Applies to | Odhvica master template and independent client-store repositories |
| Owner | Technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document defines the repository and application structure for Odhvica. The structure must support a Next.js-first full-stack application, a reusable commerce core, a consistent admin panel, completely redesignable client storefronts, secure provider adapters, independent client deployments and maintainable documentation/tests/infrastructure.

The goal is not directory complexity for its own sake. The goal is to make it obvious where a feature belongs, where client-specific storefront work belongs, where server-side commerce rules belong, and which areas must not be changed casually.

## 2. Structural Principles

| Principle | Folder-structure implication |
|---|---|
| Domain-first business logic | Catalogue, cart, checkout, orders, payments, inventory and shipping own their server/domain code rather than being scattered by page. |
| UI separation | Storefront, admin and shared components are visually separate; none owns core commerce rules. |
| Client redesign freedom | Client storefront composition/theme lives in clear client/storefront layers, not in order/payment modules. |
| Server-only boundary | Secrets, provider adapters, privileged data access and core policies live outside browser-importable paths. |
| Test proximity | Unit/integration/e2e tests follow modules and critical user flows. |
| Documented infrastructure | Deployment, environment templates, monitoring and migration procedures are stored separately from application code. |
| Master/client clarity | Master template stays brand-neutral; a client project contains its own theme/content/configuration/secrets but not another client’s data. |

## 3. Repository-Level Layout

The initial product uses one application repository per independently deployed client store. The protected master repository is the authoritative reusable baseline. A client repository is created from a known master release and is then maintained with clear upgrade boundaries.

```text
odhvica-store/
├── docs/
├── src/
├── database/
├── public/
├── tests/
├── infra/
├── scripts/
├── config/
├── .github/ or ci/
├── package configuration files
├── environment example files
└── README and contributor guidance
```

| Top-level directory | Responsibility |
|---|---|
| `docs/` | Product, UX, architecture, API, security, operations, client/project and release documentation. |
| `src/` | Application routes, UI, modules, services, adapters and shared code. |
| `database/` | Schema definition, migrations, seeds/sanitised fixtures and database-specific utilities. |
| `public/` | Static non-sensitive assets that are intentionally public; no client secrets or private uploads. |
| `tests/` | Shared test infrastructure, end-to-end flows, fixtures and contract test utilities. |
| `infra/` | Container, proxy, deployment, backup, monitoring and environment operational assets. |
| `scripts/` | Controlled operational/development scripts with documentation; never ad-hoc secret-bearing scripts. |
| `config/` | Versioned non-secret configuration schemas/defaults; production values come from environment/secure configuration. |
| `ci/` | Build, test, security check and release workflow definitions. |

## 4. Application Source Layout

```text
src/
├── app/
│   ├── (storefront)/
│   ├── (admin)/
│   ├── (account)/
│   ├── checkout/
│   ├── api/
│   ├── auth/
│   ├── error and not-found boundaries
│   └── shared route-level layout/providers
├── modules/
│   ├── identity/
│   ├── store/
│   ├── catalogue/
│   ├── content/
│   ├── inventory/
│   ├── pricing/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── payments/
│   ├── fulfilment/
│   ├── customers/
│   ├── notifications/
│   ├── reporting/
│   └── operations/
├── components/
│   ├── ui/
│   ├── storefront/
│   ├── admin/
│   └── commerce/
├── storefront/
│   ├── themes/
│   ├── layouts/
│   ├── blocks/
│   ├── navigation/
│   └── client-brand/
├── server/
│   ├── database/
│   ├── auth/
│   ├── integrations/
│   ├── jobs/
│   ├── cache/
│   ├── observability/
│   └── security/
├── lib/
│   ├── validation/
│   ├── money/
│   ├── dates/
│   ├── ids/
│   ├── errors/
│   └── utilities/
├── styles/
│   ├── tokens/
│   ├── themes/
│   ├── globals/
│   └── admin/
├── types/
└── generated/ (if required; not manually edited)
```

The exact Next.js route-group names may evolve, but this layer separation must remain.

## 5. Route Layer (`src/app/`)

Routes are responsible for request/page composition, layout selection, parameters, metadata and entry into the appropriate application service. Route files must not become the home of large pricing, payment, database, permission or integration logic.

| Route area | Responsibility |
|---|---|
| `(storefront)` | Public home, collections, products, search, editorial pages, policies and brand experience. |
| `(account)` | Customer profile, addresses, orders, wishlist, reviews and support/privacy requests. |
| `checkout` | Controlled checkout route composition and payment continuation/return states. |
| `(admin)` | Authenticated staff/owner administration UI and operations pages. |
| `api` | Route handlers for documented HTTP/API/provider callback contracts where server actions are not appropriate. |
| `auth` | Login, registration, reset, verification and session-related page flow. |
| error/not-found | Safe UX/technical response boundaries with no sensitive error exposure. |

## 6. Domain Module Layout (`src/modules/`)

Each domain module owns its business rules and provides clear interfaces to routes/UI/jobs/adapters. Modules do not reach into each other’s private persistence/provider implementation without a defined interface.

```text
src/modules/catalogue/
├── domain/
├── application/
├── infrastructure/
├── presentation/ (only if module-owned view helpers are justified)
├── validation/
├── contracts/
├── tests/
└── index/ public module exports
```

| Module subdirectory | Purpose |
|---|---|
| `domain/` | Entities, state/transition rules, policy logic and business invariants. |
| `application/` | Use cases/commands/queries that coordinate domain rules, permissions and transactions. |
| `infrastructure/` | Module-specific database repositories, provider implementation and persistence mapping. |
| `validation/` | Input schema/validation rules shared by approved callers. |
| `contracts/` | Typed command/query/input/output definitions where needed. |
| `tests/` | Module unit/integration tests near the behaviour they protect. |
| public index | Explicit supported exports; prevents accidental internal coupling. |

## 7. UI Component Layout

| Directory | Scope and rules |
|---|---|
| `components/ui/` | Brand-neutral primitives: button, input, select, dialog, drawer, badge, alert, table, tabs, loading and empty state. No business-specific fetch/permission logic. |
| `components/commerce/` | Reusable commerce UI: price display, variant picker, product gallery, cart line, shipping option, order status. Consumes stable contracts. |
| `components/storefront/` | Reusable public page compositions/patterns. Must not contain client brand copy/assets directly. |
| `components/admin/` | Reusable admin tables/forms/status/timeline/settings patterns. Stable across clients. |
| `storefront/blocks/` | Configurable content/campaign block implementations linked to content model. |
| `storefront/themes/` | Theme tokens and theme-level component expressions approved for storefront use. |
| `storefront/client-brand/` | Client-specific theme, assets mapping, page composition and brand extensions; must not alter server commerce rules. |

## 8. Storefront Customisation Boundary

The structural model separates redesignable customer experience from protected commerce engine.

| Location | May contain | Must not contain |
|---|---|---|
| `src/storefront/themes/` | Theme token values, typography, colors, visual variants, client-agnostic theme rules | Client secret, order/payment rules or client private data. |
| `src/storefront/layouts/` | Home/product/collection/editorial layout composition | Direct database/payment calls or duplicated domain validation. |
| `src/storefront/blocks/` | Campaign/editorial block rendering and configured content display | Uncontrolled raw HTML or hard-coded foreign client assets. |
| `src/storefront/client-brand/` | Current client’s logo mapping, composition, visual settings and approved client UI extensions | Another client’s brand assets, provider keys or copied production content. |
| `src/modules/*` | Stable business rules/services | One-off visual layout decisions. |
| `src/server/integrations/` | Provider adapters and secure configuration access | Browser-importable secrets or theme code. |

## 9. Server-Only Layer (`src/server/`)

Server-only code must have import boundaries that prevent it from entering client bundles.

| Directory | Responsibility |
|---|---|
| `database/` | Database client, transactions, repositories/shared persistence utilities and migration helpers. |
| `auth/` | Session validation, role/permission policy, secure account workflow helpers. |
| `integrations/` | Payment, shipping, email, SMS/WhatsApp, media, analytics and monitoring adapters. |
| `jobs/` | Job/outbox processing, retry policy, scheduled operations and dead-job handling. |
| `cache/` | Cache read/write/invalidation policies and public data revalidation helpers. |
| `observability/` | Structured logging, metrics, error reporting, request correlation and health checks. |
| `security/` | Secret access, rate limiting, CSRF/security headers helpers, upload security and redaction. |

No `src/server/` module may be imported into a browser client component. Build/lint conventions should enforce this boundary.

## 10. Shared Libraries (`src/lib/`)

Shared libraries hold small, pure or infrastructure-neutral utilities. They are not a dumping ground for business logic.

| Library area | Intended content |
|---|---|
| `validation/` | Common schema primitives and formatting-safe validation helpers. |
| `money/` | Currency formatting, amount representation and rounding helpers that align with server policy. |
| `dates/` | UTC/time-zone display helpers and duration/date range utilities. |
| `ids/` | Public/order/reference ID formatting and safe identifier utilities. |
| `errors/` | Stable error types/codes and safe mapping helpers. |
| `utilities/` | Small generic deterministic helpers with clear tests. |

Do not put database queries, provider SDK calls, user-role logic, checkout calculations or client-specific copy inside generic libraries.

## 11. Database Directory

```text
database/
├── schema/
├── migrations/
├── seeds/
├── fixtures/
├── queries/ (only if compatible with selected data layer)
├── backup-restore-notes/
└── README.md
```

| Directory | Rules |
|---|---|
| `schema/` | Authoritative schema definitions/models and related documentation references. |
| `migrations/` | Immutable version-controlled migrations; never edit deployed migration history. |
| `seeds/` | Non-production/reference data only; no client secrets or production customer data. |
| `fixtures/` | Sanitised test data representing handmade catalogue/order/payment scenarios. |
| `backup-restore-notes/` | Operational restore validation references; actual backups remain outside repository. |

## 12. Test Directory

```text
tests/
├── unit/
├── integration/
├── contract/
├── e2e/
├── performance/
├── security/
├── accessibility/
├── fixtures/
└── helpers/
```

| Test area | Scope |
|---|---|
| Unit | Pure domain policies, money, validation, state transitions and component behaviour. |
| Integration | Database repositories, service/use-case flows, jobs and provider-adapter test doubles. |
| Contract | API request/response/error/authorisation compatibility. |
| E2E | Critical customer and admin flows: browse, cart, checkout, order, fulfilment, refund and product/content operations. |
| Performance | Route/media/bundle/load baselines and regression checks. |
| Security | Auth, authorisation, tampering, webhook, upload and secret/configuration checks. |
| Accessibility | Automated checks plus structured critical-flow test support. |

## 13. Infrastructure Directory

```text
infra/
├── containers/
├── proxy/
├── deployment/
├── environments/
├── monitoring/
├── backups/
├── scripts/
└── runbooks/
```

| Directory | Responsibility |
|---|---|
| `containers/` | Container build/runtime configuration; no embedded production secrets. |
| `proxy/` | Reverse-proxy/TLS/request-limit configuration templates. |
| `deployment/` | Release, rollback, migration and environment deployment instructions. |
| `environments/` | Non-secret config schemas/example files; production values injected safely. |
| `monitoring/` | Health, log, alert and dashboard configuration templates. |
| `backups/` | Backup schedule/restore procedure templates and validation records. |
| `runbooks/` | Operational incident, provider failure, migration and support procedures. |

## 14. Documentation Directory

```text
docs/
├── 01_foundation/
├── 02_storefront_ux/
├── 03_engineering_architecture/
├── 04_delivery_operations/
├── 05_client_material/
├── adr/
├── client-projects/
└── changelog/
```

The documentation structure mirrors the project batches. Each deployed client repository should retain the common master documents plus client-specific scope, storefront, configuration, integration, launch and support records under `docs/client-projects/` or an equivalent external secure client-workspace structure.

## 15. Configuration Strategy

| Configuration type | Location | Rule |
|---|---|---|
| Versioned defaults | `config/` | Safe non-secret defaults/schema only. |
| Theme/brand config | `src/storefront/client-brand/` and approved configuration records | Client-specific and source-controlled only when non-secret. |
| Runtime secrets | Environment/secret manager | Never committed or browser-delivered unless intentionally public. |
| Feature flags | Controlled config/database record | Document owner, default, rollout and removal. |
| Content/catalogue | Database/content admin | Do not hard-code business data into source unless explicitly fixture/reference data. |
| Deployment settings | `infra/` templates plus secured runtime values | Environment-specific, reviewed and auditable. |

## 16. Import and Dependency Rules

| Rule | Requirement |
|---|---|
| Route to module | Routes/UI invoke public module application interfaces, not internal repository/provider details. |
| UI to server | Browser UI uses documented server actions/API contracts; no secret/database import. |
| Module coupling | Modules use explicit public interfaces/events; avoid circular imports and hidden database coupling. |
| Shared component use | Use `components/ui` primitives before creating duplicate controls. |
| Theme use | Storefront themes may alter presentation through approved slots/tokens, not fork all commerce components by default. |
| Generated files | Do not manually edit generated client/schema artifacts. |
| Dependency additions | Record rationale, bundle/security/license impact and test coverage for material additions. |

## 17. Client Project Creation from Master

| Step | Repository consequence |
|---:|---|
| 1 | Select tagged/released master-template version. |
| 2 | Create independent client repository/project with separate remote/access controls. |
| 3 | Configure client-specific environment, database, storage and provider accounts outside committed source. |
| 4 | Build client brand/storefront work inside documented client storefront/theme boundaries. |
| 5 | Add client scope/configuration/launch documentation without copying confidential data into master. |
| 6 | Test/deploy using client-specific infrastructure and release history. |
| 7 | Evaluate later master upgrades through controlled compatibility process. |

## 18. Structure Acceptance Criteria

The repository structure is acceptable when a developer can locate a business rule, UI component, client storefront layer, provider adapter, schema/migration, test, document and deployment asset without ambiguity; when secrets are structurally excluded from browser/source paths; and when a client redesign does not require editing core order/payment/inventory logic.

## Related Documents

`02_project_instruction.md` and `06_reuse_model.md` define master/client boundaries. `11_design_system.md` defines UI system layers. `16_architecture_design.md`, `17_system_design.md`, `18_db_schema.md`, `19_api_contracts.md`, `20_integration_spec.md`, `21_security_blueprint.md` and `22_performance_plan.md` define the technical rules this structure must support.
