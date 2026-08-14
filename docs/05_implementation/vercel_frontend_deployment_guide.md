# Odhvica Vercel Frontend Deployment Guide

This document provides an in-depth, step-by-step procedure for deploying the **Odhvica Vercel Frontend (`apps/web`)** while connecting it securely to the **Railway Backend API (`apps/backend`)**.

---

## 1. Prerequisites & Architectural Boundary

Before initiating the Vercel deployment, ensure the following components are ready:
1. **GitHub Repository Access:** Push access to [`https://github.com/sainisun/Odhvica`](https://github.com/sainisun/Odhvica).
2. **Railway Backend Deployed:** The backend API service (`apps/backend`) must already be running on Railway with a public HTTPS URL (e.g., `https://api.odhvica.com`) and connected to PostgreSQL.
3. **Environment Variables Ready:** Vercel requires public client configuration keys, whereas sensitive database and provider secrets remain securely on Railway.

---

## 2. Step-by-Step Vercel Deployment Workflow

### Step 1: Import Project into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import the GitHub repository `sainisun/Odhvica`.

### Step 2: Configure Project Build Settings
When Vercel detects the repository, configure the build options explicitly to match Odhvica's monorepo structure:
* **Root Directory:** Click **Edit** and select `apps/web`.
* **Framework Preset:** Next.js (automatically detected).
* **Build Command:** `pnpm build` (or `next build`).
* **Output Directory:** `.next` (default).
* **Install Command:** `pnpm install --frozen-lockfile`.

### Step 3: Set Environment Variables
In the Vercel project configuration wizard (under **Environment Variables**), add the following client-side and server-side public variables:

| Key | Scope | Example Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Production, Preview, Development | `https://api.odhvica.com` | Public URL of the Railway backend service. |
| `NEXT_PUBLIC_SITE_URL` | Production, Preview, Development | `https://odhvica.com` | Public storefront domain. |
| `NEXT_PUBLIC_APP_TITLE` | Production, Preview, Development | `Odhvica` | Application branding title. |

> **Security Warning:** Do NOT add `DATABASE_URL`, `JWT_SECRET`, `BETTER_AUTH_SECRET`, payment API secrets, webhook signing keys, or storage credentials to Vercel environment variables. Those belong exclusively on Railway.

### Step 4: Deploy
1. Click **Deploy**.
2. Vercel will install dependencies using `pnpm`, compile TypeScript, execute the Next.js build, and output the deployment URL (e.g., `https://odhvica-abc123.vercel.app`).

---

## 3. Post-Deployment Verification & CORS Alignment

Once Vercel successfully builds and deploys the frontend:
1. **Backend CORS Update:** Go to your Railway backend service environment variables and update `ALLOWED_FRONTEND_ORIGIN` to match your exact Vercel deployment domain (e.g., `https://odhvica.vercel.app` or your custom domain `https://odhvica.com`).
2. **Smoke Test:** Navigate to your Vercel URL and verify:
   - Homepage renders correctly.
   - `/shop` fetches published products successfully from the Railway backend API.
   - Cart interactions and sandbox checkout load without cross-origin errors.

---

## 4. Troubleshooting Common Issues

* **CORS Block / Network Error:** Ensure `ALLOWED_FRONTEND_ORIGIN` on Railway exactly matches the protocol and domain of your Vercel app (trailing slashes removed).
* **Build Failure (Module Not Found):** Verify that **Root Directory** in Vercel is strictly set to `apps/web`.
* **Hydration Mismatch:** Ensure server-side and client-side timestamps or currency formatters are aligned.

---

## References
- Vercel Monorepo Deployment Documentation: [https://vercel.com/docs/monorepos](https://vercel.com/docs/monorepos) [1]
- Railway Deployment Guide: [https://docs.railway.app](https://docs.railway.app)
