FROM node:22-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS builder
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile || pnpm install
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --prod --frozen-lockfile || pnpm install --prod
COPY --from=builder /app/dist ./dist

EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/index.js"]
