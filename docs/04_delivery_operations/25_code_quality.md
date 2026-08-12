# Odhvica — Code Quality Standards

| Field | Value |
|---|---|
| Document ID | 25 |
| Status | Approved delivery standard |
| Version | 0.1 |
| Applies to | Odhvica master template and every client-store codebase derived from it |
| Owner | Technical lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document defines the quality standards that keep Odhvica reliable, maintainable, secure and reusable as it grows from the Odhvica reference store into multiple independently deployed client stores. Code quality is not limited to style. It includes architecture adherence, validation, testing, performance awareness, accessibility, security, documentation, review discipline and controlled release practices.

The standards apply to application code, database migrations, infrastructure definitions, integration adapters, test code, scripts, configuration schemas and client-specific storefront work. A client redesign may have a distinct visual identity, but it must not bypass core quality rules.

## 2. Quality Principles

| Principle | Standard |
|---|---|
| Correctness before cleverness | Prefer readable, testable and explicit implementation over compressed or overly abstract code. |
| Domain boundaries | Put catalogue, cart, checkout, order, payment, inventory and fulfilment rules in their owning modules. |
| Server authority | Browser code never becomes the authoritative source for commerce/permission decisions. |
| Reuse without leakage | Master code remains brand-neutral; client-specific brand/data/secrets do not enter shared modules. |
| Secure defaults | Validate inputs, check permissions, handle secrets safely and fail without exposing internals. |
| Test critical risk | Payments, orders, stock, promotions, access, uploads, provider events and migrations require strong coverage. |
| Observable operations | Errors, state changes and external failures are structured, redacted and traceable. |
| Small reviewed changes | Prefer focused changes with clear scope, tests and documentation updates. |
| Documentation parity | When behaviour changes, the relevant `.md` document changes in the same work item. |

## 3. TypeScript and Application Conventions

| Area | Required convention |
|---|---|
| Type safety | Use strict type checking. Avoid broad `any`-style escape hatches except documented interop boundaries. |
| Validation | Treat external input as untrusted until validated by a schema/policy at the server boundary. |
| Domain types | Model money, identifiers, states, permissions and external provider references explicitly rather than as loosely typed strings. |
| Nullability | Represent optional/missing states deliberately; do not rely on implicit undefined behaviour in commerce logic. |
| Enums/states | Use controlled state representations and transition policies; do not create arbitrary status strings. |
| Async handling | Await/handle errors intentionally; do not drop promises or background failures. |
| Comments | Explain non-obvious business/security/performance decisions, not syntax that readable code already conveys. |
| Naming | Use business language consistent with product documents: `order`, `payment`, `fulfillment`, `variant`, `customization`, `promotion`. |

## 4. Module and Dependency Rules

The folder structure in `23_folder_structure.md` is mandatory. Modules own their rules and expose deliberate public interfaces.

| Rule | Requirement |
|---|---|
| Route responsibility | Routes compose page/request context and call application services; they do not contain long business workflows or direct ad-hoc provider logic. |
| UI responsibility | Components render data, capture interaction and invoke documented actions; they do not calculate trusted commerce totals/permissions. |
| Module ownership | Product/variant logic stays in catalogue; stock in inventory; price/discount in pricing; checkout in checkout; provider specifics in integrations. |
| Cross-module access | Use explicit service/contract/event interfaces. Avoid reaching into another module’s private repository or persistence detail. |
| Server boundary | Database clients, secret access, provider SDKs and privileged jobs remain in server-only modules. |
| Shared utility limit | `lib` contains small generic utilities, not hidden business/service code. |
| Client custom boundary | Client storefront customisation stays in the documented client/theme layer and cannot modify shared commerce behaviour without approved master or client-custom scope. |
| Circular dependency | Disallow/rework circular imports; they indicate unclear ownership. |

## 5. Error Handling Standards

| Context | Required behaviour |
|---|---|
| Field validation | Return field-specific, user-safe errors and preserve valid input where possible. |
| Domain/business rule | Return stable error code/message for stock, price, promotion, permission, state or eligibility failure. |
| Provider failure | Record safe provider context, apply retry/reconciliation policy and provide customer/admin recovery path. |
| Unexpected server error | Log structured/redacted details internally; return generic safe message plus correlation ID where appropriate. |
| Background job failure | Record job state/attempt/error category; retry only when idempotent; route terminal failures to operations queue. |
| UI error state | Show usable explanation/retry/support path; do not expose stack trace, secret or database/provider detail. |
| Error swallowing | Prohibited. Every caught exception must be handled, transformed, logged or rethrown intentionally. |

## 6. Data, Money and State Quality

| Domain | Required standard |
|---|---|
| Money | Use precise monetary representation and explicit currency code. Never rely on floating-point arithmetic for business totals. |
| Price calculation | Centralise server-side calculation; UI formats an approved result rather than reconstructing totals. |
| Order snapshots | Preserve purchase-time product/variant/customisation/price/shipping/customer data; do not depend on mutable current catalogue. |
| State transitions | Use explicit allowed transitions for order, payment, fulfilment, refund, job and publication states. |
| Idempotency | Model unique request/provider/event identifiers for duplicate-prone operations. |
| Inventory | Use transactional/concurrency-safe updates; manual change records reason and actor. |
| Audit | Record sensitive/financial/configuration actions with safe before/after summary. |
| Migration | Schema migration is versioned, reviewed, tested and paired with rollback/forward-fix plan. |

## 7. Security Quality Requirements

| Area | Required standard |
|---|---|
| Input/output | Validate input; encode/sanitise rendered content; avoid unsafe raw HTML/database query patterns. |
| Auth/permission | Every protected server operation checks authenticated identity, role/permission and object ownership. |
| Secrets | Never commit, log, render or paste secrets into normal docs. Use client/environment-specific secret management. |
| Payment | Verify provider callback/authenticity; do not trust client redirect or client-supplied payment state. |
| Uploads | Validate authorisation, type, size, intended relation and storage path; protect private assets. |
| Dependencies | Review security/license/maintenance impact before adding packages; maintain update process. |
| Logging | Redact passwords, tokens, addresses, customisation content, raw provider payloads and sensitive data. |
| High-risk review | Refund, role, integration, export, checkout, data deletion and deployment changes require explicit security review. |

## 8. Performance and Accessibility Quality Requirements

| Area | Required standard |
|---|---|
| Rendering | Keep essential public product/collection content server-rendered/discoverable where planned. |
| Client JavaScript | Add client code only for necessary interaction; review package/bundle impact. |
| Media | Use configured responsive/optimised media path; preserve dimensions and accessible alt text. |
| Data fetching | Return only required fields; paginate lists; avoid request waterfalls and per-item query patterns. |
| Caching | Use approved cache/invalidation helpers; never cache personal/checkout/admin state publicly. |
| Accessibility | Shared components include labels, keyboard/focus behaviour, states and semantic structure. |
| Storefront redesign | New theme/components must comply with performance and accessibility acceptance checks. |
| Third parties | New tag/embed/review/chat/animation requires performance, consent and failure-impact review. |

## 9. Test Quality Expectations

Code is not complete because it compiles. Each changed behaviour needs the appropriate test level.

| Change type | Minimum test expectation |
|---|---|
| Pure utility/domain policy | Unit test normal, boundary and invalid inputs. |
| Module service | Integration test with data/policy behaviour. |
| API/server action | Contract/authorisation/error/idempotency coverage. |
| Payment/order/stock/refund | Unit plus integration and relevant end-to-end failure/retry scenario. |
| UI component | Behaviour/state/accessibility test where meaningful. |
| Storefront flow | End-to-end path for discovery, product selection, cart/checkout or account flow affected. |
| Admin workflow | End-to-end or integration test for product/order/content/settings behaviour affected. |
| Migration | Migration test, data-integrity check and rollback/forward-fix rehearsal proportionate to risk. |
| Provider integration | Adapter test double plus validated non-production provider flow before production. |

## 10. Code Review Checklist

Every change should be reviewed against the following questions.

| Review area | Reviewer question |
|---|---|
| Scope | Does this solve the approved requirement and remain inside master/client boundary? |
| Ownership | Is the code in the correct route/UI/module/server layer? |
| Behaviour | Are normal, validation, conflict, failure and retry outcomes defined? |
| Data | Are schema, snapshots, money, timezone, state and migration effects correct? |
| Security | Are permissions, ownership, input, output, secrets, provider verification and logs safe? |
| Performance | Does it add avoidable queries, payload, client script, media weight or third-party cost? |
| Accessibility | Are semantics, labels, keyboard/focus/error states and responsive behaviour correct? |
| Tests | Do tests cover the behaviour and risk level; are failures meaningful? |
| Documentation | Are affected PRD/system/API/security/deployment/test docs and memory log updated? |
| Operations | Is deployment, configuration, monitoring, rollback or client migration impact known? |

## 11. Change and Branch Discipline

| Practice | Standard |
|---|---|
| Work item | Every material change has a short purpose, scope, acceptance criteria and affected documents. |
| Change size | Prefer cohesive, reviewable changes. Split unrelated refactoring from business feature changes. |
| Commit message | Explain user/business outcome and technical scope; avoid vague “fix” messages for significant work. |
| Branch/release | Follow master/client versioning policy; production fixes are traceable to release record. |
| Feature flags | Use for controlled rollout only when configuration, cleanup and monitoring are defined. |
| Refactor | Refactor only with tests/behaviour preservation; document architecture changes. |
| Client patch | Label clearly as client-specific; do not merge into master without `06_reuse_model.md` promotion review. |

## 12. Documentation Update Map

| Code change | Required documentation review |
|---|---|
| Feature/priority | PRD, feature scope, project memory, implementation plan. |
| Commerce rule | Commerce rules, system design, API contracts, test plan, legal/integration documents. |
| Catalogue/content/UX | Storefront/admin UX, design system, content/catalogue model, SEO/accessibility. |
| Data/API | Database schema, system design, API contracts, security, testing and migration notes. |
| Provider | Integration spec, security blueprint, testing and deployment/runbook. |
| Security/access | Security blueprint, project memory, testing, deployment and access procedure. |
| Performance | Performance plan, design system, testing and release notes. |
| Deployment | DevOps deployment, implementation plan, security and support runbook. |

## 13. Definition of Done

A development task is complete only when the approved requirement is implemented in the correct layer; validation, permissions, error/retry states and data effects are correct; relevant tests pass; performance/accessibility/security effects have been reviewed; documentation is current; and release/rollback/configuration impact is known.

## Related Documents

`02_project_instruction.md`, `06_reuse_model.md` and `08_agent.md` establish project behaviour. `16_architecture_design.md` through `24_reference_implementation.md` define technical foundations. `26_testing_quality.md`, `27_devops_deployment.md` and `29_implementation_plan.md` define delivery execution.
