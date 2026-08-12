# Odhvica — Performance Engineering Plan

| Field | Value |
|---|---|
| Document ID | 22 |
| Status | Approved performance foundation; numerical thresholds finalised through baseline measurement before launch |
| Version | 0.1 |
| Applies to | Odhvica reference store and every client storefront redesign/deployment |
| Owner | Technical lead / performance owner |
| Last updated | 2026-08-12 |

## 1. Purpose

Odhvica is an image-rich handmade-fashion store, so visual quality and performance must be designed together. This document defines how the application will deliver fast, stable, search-friendly and mobile-usable storefronts while supporting large product media, international customers, marketing integrations and independent VPS deployments.

Performance is a product requirement, not a final optimisation task. Every storefront redesign, campaign, media upload, third-party script and client configuration must stay within the performance guardrails defined here.

## 2. Performance Objectives

| Objective | Desired customer outcome |
|---|---|
| Fast first view | Customers can see meaningful brand/product content quickly on mobile and desktop. |
| Responsive interaction | Navigation, search, filters, variant selection, cart and checkout respond without avoidable delay. |
| Stable layout | Product cards, images, banners, pricing and buttons do not shift unexpectedly while loading. |
| Reliable transaction | Cart and checkout remain responsive under normal usage and provider delays show safe progress/recovery. |
| Search-friendly delivery | Essential product/collection/content is rendered in a discoverable form without excessive client-side work. |
| Efficient media | High-quality product imagery is delivered in appropriately sized, optimised formats. |
| Operational visibility | Slow pages, server errors, database latency, job backlog and integration issues are measurable. |

## 3. Performance Principles

| Principle | Requirement |
|---|---|
| Measure before claiming | Use field/lab measurements and production monitoring; do not label a page “fast” from visual judgement alone. |
| Prioritise critical paths | Home, collection, product, cart and checkout are performance-critical; optimise these before lower-value features. |
| Render essential content early | Product title, image, price, variant availability, core description and navigation should not depend on avoidable client-only fetches. |
| Treat media as data | Product/campaign media has dimensions, focal point, priority, derivative and loading strategy. |
| Load less | Minimise JavaScript, CSS, font files, third-party tags and data payloads. |
| Cache public reads safely | Cache public content/catalogue views and invalidate precisely; never cache personal/admin/checkout state publicly. |
| Fail gracefully | Slow provider/analytics/media service must not block core browse/cart/order behaviour unnecessarily. |
| Budget client changes | A new client theme, animation, app integration or campaign asset must be evaluated against performance impact before production. |

## 4. Critical User Paths

| Path | Performance priority | Key experience requirements |
|---|---|---|
| Home load | High | Brand/campaign message and primary navigation visible quickly; hero media does not block meaningful content. |
| Collection browse | High | Product grid, filter/sort and images load predictably; filter changes remain responsive. |
| Product detail | Highest | Primary image, title, price, availability, variant/custom fields and add-to-cart remain quickly usable. |
| Add to cart | Highest | Immediate trustworthy feedback without double submit or stale product state. |
| Cart | Highest | Current line items, totals, promotion and checkout action load with accurate data. |
| Checkout | Highest | Address/shipping/payment stages remain responsive; provider wait state is clear and safe. |
| Account/order status | Medium-high | Customer sees correct order context without leaking or overloading private data. |
| Admin order/product work | High for operations | Lists, detail pages and saves remain responsive at realistic catalogue/order volume. |
| Editorial/campaign pages | Medium | Rich visual content remains within media/script budget and is crawlable. |

## 5. Performance Budgets

Numerical thresholds must be established from the first reference-store baseline and adjusted only with written approval. The table defines budget categories that every release must report.

| Budget area | Requirement |
|---|---|
| Initial document/render | Keep HTML/critical content lean enough for fast server and mobile parsing. |
| Critical JavaScript | Deliver only code necessary for initial route/function; defer non-critical interactive/third-party modules. |
| CSS | Use shared design tokens/components and avoid route-irrelevant/unbounded styles. |
| Fonts | Limit families/weights, provide fallback, preload only truly critical files and avoid render-blocking font behaviour. |
| Hero media | Use responsive dimensions, intentional priority and modern optimised delivery; do not load full-resolution asset for all devices. |
| Product gallery | Load primary media first; lazy-load lower-priority gallery assets while preserving accessible controls. |
| Product grid | Use reserved dimensions, responsive image sizing and incremental/loading strategy that avoids layout shifts. |
| Third-party scripts | Each script has owner, purpose, consent condition, load strategy and performance review. |
| API payloads | Return only required fields; paginate/filter list data; avoid sending full product/admin records for cards. |
| Server/database | Define acceptable route/query latency by critical path and alert on regression. |

## 6. Rendering and Data-Loading Strategy

| Route type | Rendering/data strategy |
|---|---|
| Home / campaign / editorial | Server-render/cache public data; selectively hydrate only interactive blocks. |
| Collection | Server-render initial collection/product data; client enhancements for filters only where needed; validate query server-side. |
| Product detail | Server-render essential product/variant/price/availability content; hydrate selection/cart features minimally. |
| Search | Dynamic server query with bounded/paginated results; avoid shipping full catalogue to browser. |
| Cart | Dynamic authenticated/session-scoped read; no public shared cache. |
| Checkout | Dynamic server-authoritative validation; protect against stale cached totals. |
| Customer account | Dynamic private rendering/data with ownership checks. |
| Admin | Dynamic authenticated rendering/data; use pagination, filtering and efficient query projections. |

The application should prefer progressive enhancement: core browsing and essential product information remain meaningful in the server-rendered experience; richer interaction loads only when needed.

## 7. Media Performance Strategy

| Media area | Requirement |
|---|---|
| Product primary image | Define dimensions/aspect ratio, responsive source sizes, alt text and priority relationship to product page/card. |
| Product gallery | Serve appropriate derivatives; load non-primary images lazily; avoid preloading every gallery asset. |
| Collection/campaign hero | Use art-directed responsive crops when necessary; ensure text/CTA is not trapped inside image. |
| Image format | Use modern optimised formats where browser/delivery support is appropriate, with compatible fallback strategy. |
| Compression | Balance visual textile detail with payload size; test representative fabric/embroidery imagery rather than generic photos only. |
| Layout stability | Persist media dimensions/aspect ratio/focal point to reserve space before image load. |
| Video | Avoid auto-playing high-cost video by default; use poster/consent/motion-aware loading and meaningful fallback. |
| Customer uploads | Process asynchronously; do not block customer checkout on non-essential derivative generation. |
| CDN/object delivery | Use controlled cache headers and client-isolated media delivery strategy where available. |

## 8. JavaScript, CSS and Font Rules

| Area | Rule |
|---|---|
| Component selection | Prefer server-capable/shared components; make only controls that need browser state interactive. |
| Code splitting | Load route/component-specific code only when required, especially for admin reports, charts, editors and modals. |
| Dependencies | Avoid heavy libraries for simple functions; review bundle impact before adding dependency. |
| Animations | Use low-cost, reduced-motion-aware transitions; no continuous effects that impede input/rendering. |
| CSS architecture | Use token/component strategy; avoid global style accumulation and unnecessary runtime styling cost. |
| Fonts | Use limited, licensed fonts with practical fallbacks; monitor font loading effect on text visibility/layout. |
| Client data stores | Do not duplicate large server data into global client state without an interaction need. |
| Analytics | Load consent-aware and deferred where possible; never make critical commerce conditional on analytics availability. |

## 9. Database and Server Performance

| Area | Requirement |
|---|---|
| Query design | Select only required fields, index common product/order/search lookups and avoid per-row follow-up query patterns. |
| List views | Use pagination/cursor/limit and allow-listed filters/sorts; do not load entire catalogue/order history into one response. |
| Transactions | Keep commerce transactions narrow and fast; do not perform network calls while holding database transaction/lock. |
| Inventory | Use controlled row-level/concurrency design for high-contention tracked variants/unique products. |
| Background jobs | Move slow/retryable provider/media/email/report work out of customer request path. |
| Connection management | Configure database connection pooling/limits appropriate to single-client VPS resource constraints. |
| Cache | Cache public product/content reads and static metadata; invalidate on relevant publish/price/availability change. |
| Search | Begin with indexed database search; introduce external search only when measured catalogue/query demands justify it. |

## 10. VPS Resource Planning

Odhvica must remain deployable on a Hostinger VPS, where resources are finite and client environments are independent. The architecture should first scale through efficient rendering, media handling, caching, query design, monitoring and right-sized VPS allocation.

| Resource | Monitoring/guardrail |
|---|---|
| CPU | Track sustained application/worker/proxy use and identify route/job spikes. |
| Memory | Monitor application, database/cache and background-job usage; avoid unbounded in-memory caches/uploads. |
| Disk | Monitor database, logs, uploaded media, backups and temporary processing space separately. |
| Network | Track media bandwidth, bot/abuse patterns, provider latency and outbound message traffic. |
| Database | Monitor slow queries, locks, connection saturation, backup time and data growth. |
| Queue | Monitor pending/retrying/dead jobs and processing latency. |

VPS tier/sizing is a deployment decision made per client from expected traffic, catalogue/media size, background workload and desired recovery capacity. The product should not claim a universal server size without measured load evidence.

## 11. Third-Party Script and Integration Budget

Every integration has performance cost. A client request to add analytics, chat, reviews, social feeds, video, heatmaps, personalisation or marketing tag must be reviewed before addition.

| Review question | Required answer |
|---|---|
| Business value | What customer/operational result does this integration provide? |
| Owner | Which client role owns the account/configuration and monitors it? |
| Data/consent | What data leaves the store and under what consent/policy rule? |
| Load strategy | Can it load after critical content/interaction or only on affected page? |
| Failure effect | What happens if it is slow/unavailable? Core purchase flow must still work. |
| Bundle/network cost | What JavaScript/network/media impact is added? |
| Removal | Can it be disabled/reverted safely if it harms performance or compliance? |

## 12. Storefront Redesign Guardrails

A client redesign is not exempt from performance constraints.

| Design choice | Required review |
|---|---|
| Large hero video | Assess mobile cost, autoplay/motion/accessibility fallback and LCP impact. |
| Custom font suite | Assess number of files/weights, licensing, fallback and layout shift. |
| Complex animation | Assess input/rendering cost, reduced-motion path and campaign value. |
| Social feed embed | Assess third-party network cost, consent, fallback and rendering stability. |
| Heavy product-card hover | Assess touch alternative, image loading and layout cost. |
| Full-screen modal/popup | Assess interaction delay, focus/accessibility, conversion and script weight. |
| Client tracking stack | Assess cumulative tag cost, consent sequencing and purchase-path impact. |

## 13. Measurement and Monitoring

| Measurement layer | Examples |
|---|---|
| Lab checks | Route render/load analysis, bundle analysis, image audit, simulated network/device checks. |
| Field/user metrics | Real page loading/interaction/layout stability measurements where consent/policy permits. |
| Server metrics | Request duration, error rate, CPU/memory, database latency, cache hit/miss, job lag. |
| Commerce signals | Add-to-cart errors, checkout validation failures, payment initiation/confirmation latency and purchase completion rate. |
| Release regression | Compare critical route metrics before/after release and investigate material regressions. |

Performance monitoring must identify route, client deployment/environment, release version and safe correlation data without exporting sensitive customer/cart/payment content.

## 14. Performance Test Plan

| Test | Coverage |
|---|---|
| Page budget test | Home, collection, product, cart and checkout against approved asset/render budgets. |
| Media test | Representative high-detail textile images, gallery, hero, mobile responsive derivatives and slow-network behaviour. |
| Interaction test | Navigation, filter, variant/custom input, cart and checkout responsiveness on representative mobile/desktop devices. |
| Load test | Public product/collection traffic, checkout initiation and admin list activity at expected client scale. |
| Database test | Catalogues/orders at expected growth volume; query and index review. |
| Integration test | Provider latency/failure does not lock customer request thread or break safe retry state. |
| Regression test | Compare performance metrics for changed components/pages before release. |

## 15. Performance Acceptance Criteria

A release is performance-ready when critical storefront pages deliver meaningful content quickly and stably; product media and selection remain usable on mobile; cart/checkout are responsive and accurate; third-party scripts are controlled; public caching is safe; server/database/job health is observable; and new client design choices remain within documented performance budgets.

## Related Documents

`09_storefront_ux.md`, `11_design_system.md`, `13_catalog_model.md`, `14_seo_analytics.md` and `15_accessibility.md` define experience constraints. `16_architecture_design.md` and `17_system_design.md` define rendering/cache/job architecture. `21_security_blueprint.md` controls safe performance/monitoring data handling. `27_devops_deployment.md` will define deployment monitoring execution.
