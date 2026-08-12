# Phase 7 — Quality Hardening and Launch Readiness

## Purpose

Phase 7 introduces a reproducible browser-level quality gate for the canonical Odhvica application. The E2E suite runs only against deterministic preview data and sandbox-safe workflows. It must never create a real payment, courier label, email, marketing send, analytics event or production database record.

## Test commands

| Command | Purpose |
|---|---|
| `pnpm --filter web test` | Runs unit and PGlite-backed integration tests. |
| `pnpm --filter web check` | Runs strict TypeScript validation. |
| `pnpm --filter web lint` | Runs ESLint. |
| `pnpm --filter web e2e` | Starts the local Next.js E2E server on port 3100 and runs Playwright Chromium tests. |
| `pnpm --filter web quality` | Runs the full unit, integration, type, lint, E2E and production-build sequence. |

Playwright retains a trace, screenshot and video on failure, and writes its HTML report under `apps/web/playwright-report/`. The report and test result artifacts are git-ignored operational output; they are not product assets. GitHub Actions installs Playwright Chromium, runs the same suite after unit/type/lint checks, and retains Playwright failure artifacts for seven days only when the workflow fails.

## Current browser coverage

| Journey | Expected assertion |
|---|---|
| Storefront discovery | The homepage has one primary heading; the shopper can reach `/shop`, use the accessible product search, observe an empty state, and recover to a matching product. |
| Browser bag and checkout sandbox | A preview product can enter browser-local bag state, the checkout form can show sandbox payment review messaging, and the UI confirms that no payment page or charge is created. |
| Mobile shopper flow | Mobile Chromium changes a non-default variant, carries it into the browser bag, enters checkout and confirms the sandbox no-charge message. |
| Protected routes | Unauthenticated requests to account and staff routes do not return a successful protected page in the unprovisioned E2E environment. |
| Accessibility smoke | Axe scans `main` on the public storefront and fails on serious or critical violations. |
| Local performance guardrail | The public home navigation timing must remain below the intentionally generous 10-second local-development budget. This is a smoke guard, not a production Core Web Vitals measurement. |

## Local E2E boundary

The test server sets `ODHVICA_E2E=1`, disables Next telemetry, uses no `DATABASE_URL`, and clears the `odhvica-browser-cart-v1` local-storage key before each stateful scenario. The catalogue repository therefore uses its controlled preview data. Authentication/provider secrets remain absent by design; protected routes fail closed rather than being artificially authenticated.

## Release checklist before a real launch

1. Provision isolated PostgreSQL and object storage; apply migrations in order and validate backup/restore from a non-production copy.
2. Configure real Better Auth secrets, session domain/cookies and mandatory staff two-factor enrolment, then run authenticated Playwright tests with dedicated non-production users.
3. Add store-owned Razorpay, Stripe and PayPal credentials; verify signed webhooks, idempotency and refund reconciliation with provider test accounts.
4. Configure GST, shipping/courier, returns, legal policies, sender-domain authentication and consent behaviour for the specific client store.
5. Add client-owned GA4, Meta Pixel and Search Console identifiers only after consent-aware data-layer tests and event deduplication pass.
6. Run production-environment Lighthouse/Core Web Vitals, keyboard/screen-reader review, mobile-device checks, security review, deployment smoke tests and staff UAT.
7. Confirm rollback: retained prior image/release, migration compatibility, database backup restore point, incident contacts and provider escalation details.

## Explicit limitations

Playwright confirms that the local preview behaves safely; it does not certify real payment, tax, email, courier, auth, analytics or database operations. Those require the client’s verified external accounts, production configuration, lawful consent settings and a separate staging/UAT evidence run.

`phase_7_staging_release_runbook.md` is the operational handoff for the staging rehearsal, go/no-go gate, rollback decision and production acceptance evidence.
