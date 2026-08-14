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
|  - Commerce API Routes (`/api/v1/*`)                        |
|  - Better Auth + RBAC + Mandatory 2FA                      |
|  - Checkout Engine, Order State Machine, Webhook Handlers   |
+------------------------------+------------------------------+
                               | Drizzle ORM (SSL)
                               v
+-------------------------------------------------------------+
|                Managed PostgreSQL & S3 Storage              |
+-------------------------------------------------------------+
