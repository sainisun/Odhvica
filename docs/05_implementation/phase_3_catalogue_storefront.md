# Phase 3 — Catalogue Administration and Public Storefront

## Delivered scope

Phase 3 introduces the first customer-facing Odhvica storefront and a staff-gated catalogue workspace. The UI uses the Phase 2 handmade-catalogue vocabulary: materials, variants, made-to-order lead time, customisation requirements, stock state and product status are visible before a customer continues toward checkout.

| Route | Audience | Current behaviour |
|---|---|---|
| `/` | Public | Editorial home page, collection entry points, selected products and craft/process content. |
| `/shop` | Public | Searchable and filterable collection browsing with accessible filter buttons and an explicit empty state. |
| `/shop/[slug]` | Public | Product detail page with material, care, lead-time, sizes, availability and customisation information. |
| `/admin/catalogue` | Staff only | Dynamic staff-gated catalogue workspace for product summaries and authoring workflow preparation. |

## Visual and interaction system

The public storefront uses a restrained craft-editorial direction: warm paper background, forest ink, terracotta accent, Cormorant Garamond display type and Manrope utility type. Original generated textile visuals are served as WebDev static assets; product copy does not invent customer reviews, ratings or testimonials.

The header exposes the current browse paths without presenting a false working cart. Product actions explicitly state that checkout activation belongs to the next commerce phase. The staff screen is secured with `requireStaffAccess("catalogue:write")`; a logged-out, inactive, non-2FA or unauthorized staff member cannot access the route.

## Accessibility and responsive rules

The Phase 3 UI supplies semantic navigation, labelled search and authoring fields, keyboard-operable filter buttons, `aria-pressed` filter state, meaningful product image alternative text, visible hover/focus treatment and responsive single-column-to-grid layouts. Public browsing remains usable from narrow mobile widths through desktop.

## Current data boundary

The public browsing layer currently uses a typed read model in `src/lib/catalogue/storefront-data.ts` so Phase 3 can be evaluated before the production PostgreSQL environment is provisioned. It is not a substitute for a production catalogue query layer. When the Phase 0 database environment is available, the next increment will replace this temporary read model with server-side database queries, object-storage media metadata and published-product access rules.

## Validation

`storefront-data.test.ts` verifies collection filtering, material/status search and stable product detail lookup. Phase 3 must pass the full Vitest suite, TypeScript check, ESLint, production Next.js build and `git diff --check` before release.

## Deferred work

Product draft form submission, media upload, live product search, persisted filters, cart operations, checkout and payment execution remain deliberately deferred. Those features require the next database-connected admin, storage and commerce phases.
