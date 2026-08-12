# Odhvica — Phase 1 Official Reference Notes

These links support the implementation choices recorded in the Phase 1 foundation. They are reference material, not a substitute for the project specifications or client-specific security, tax and legal review.

| Area | Key implementation point | Official source |
|---|---|---|
| Better Auth with Drizzle | The Drizzle adapter supports PostgreSQL through the `pg` provider and maps Better Auth models to the supplied schema. | https://better-auth.com/docs/adapters/drizzle |
| Better Auth with Next.js | Next.js route handlers mount Better Auth at `/api/auth/[...all]` using `toNextJsHandler`. | https://better-auth.com/docs/integrations/next |
| Better Auth 2FA | The two-factor plugin supports TOTP/OTP, backup codes and trusted devices; staff 2FA policy remains enforced by Odhvica role/access rules. | https://better-auth.com/docs/plugins/2fa |
| Better Auth schema tooling | The CLI can generate schema requirements; Drizzle migrations remain reviewed and applied through the chosen database process. | https://better-auth.com/docs/concepts/cli |
| Drizzle with PostgreSQL | Drizzle supports PostgreSQL with `node-postgres` or `postgres.js`; Odhvica uses the `node-postgres` direction. | https://orm.drizzle.team/docs/get-started-postgresql |

## Applied design boundaries

- Odhvica uses a provider-hosted payment boundary and does not collect raw card details.
- Better Auth is request-time configured so builds do not use a fallback secret; required credentials remain environment-only.
- The generated PostgreSQL migration is reviewed and committed but remains unapplied until the isolated Odhvica PostgreSQL environment is provisioned.
- Admin access requires an active staff record, staff role authorisation and two-factor enrolment. Sensitive admin mutations will additionally require an explicit fresh-step-up verification flow before they are introduced.
