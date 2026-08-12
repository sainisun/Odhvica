# Odhvica

Odhvica is a reusable, independently deployed e-commerce foundation for handmade fashion, accessories and made-to-order products. The reference store is built first; only proven, reusable capabilities are later promoted into the protected master template.

## Stack

The canonical application is in `apps/web` and uses Next.js App Router, TypeScript, PostgreSQL, Drizzle ORM, Better Auth, Docker and Caddy-compatible deployment. The full functional/design specification is under `docs/`.

## Local setup

Copy `.env.example` to `.env`, use non-production values, then run the commands below. The authentication route intentionally remains unavailable until `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are configured.

```bash
pnpm install
pnpm dev
```

## Quality and database commands

```bash
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm --filter web db:generate
```

Database migrations are generated in `apps/web/drizzle/`. Apply a reviewed migration only after a PostgreSQL environment exists; never apply a migration against an unreviewed or production database from local development.

## Security baseline

Admin access is server-side role controlled and requires an active staff profile plus a configured second factor. Sensitive permissions require an additional step-up policy before the corresponding mutation is introduced. Provider-hosted payment flows are required; Odhvica does not collect raw card details.
