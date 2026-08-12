FROM node:22-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
RUN corepack enable && pnpm --filter web build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN useradd --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/web/server.js"]
