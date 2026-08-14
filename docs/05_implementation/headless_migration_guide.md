# Odhvica Headless Architecture & Deployment Guide

This document defines the production architecture, environment contracts, and deployment runbook for splitting Odhvica into a **Vercel-hosted frontend (Storefront & Admin UI)** and a **Railway-hosted backend (Commerce API & Database)**.

## 1. Architectural Topology

```
+-------------------------------------------------------------+
|                     Vercel Frontend                         |
|  - Next.js 16 App Router (Storefront, Admin UI, SSR/ISR)    |
|  - Talks to Backend via typed apiClient (`NEXT_PUBLIC_API`) |
+------------------------------+------------------------------+
                               | CORS-secured JSON / Cookie session
                               v
+-------------------------------------------------------------+
|                     Railway Backend                         |
|  - Express / Node API Service (`apps/backend`)              |
|  - Better Auth + RBAC + Mandatory 2FA                      |
|  - Catalogue API, Checkout Engine, Order State Machine      |
+------------------------------+------------------------------+
                               | Drizzle ORM (SSL)
                               v
+-------------------------------------------------------------+
|                Managed PostgreSQL & S3 Storage              |
+-------------------------------------------------------------+
```

## 2. Environment Variables Matrix

### Railway Backend (`apps/backend`)
- `PORT`: 4000
- `DATABASE_URL`: PostgreSQL connection string with SSL
- `ALLOWED_FRONTEND_ORIGIN`: Exact URL of Vercel frontend (e.g., `https://odhvica.vercel.app`)
- `BETTER_AUTH_SECRET`: Secret signing key for auth tokens
- `BETTER_AUTH_URL`: Railway backend public URL

### Vercel Frontend (`apps/web`)
- `NEXT_PUBLIC_API_BASE_URL`: Railway backend public URL (e.g., `https://api.odhvica.com`)
