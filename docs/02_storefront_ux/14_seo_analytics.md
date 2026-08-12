# Odhvica — SEO and Analytics Blueprint

| Field | Value |
|---|---|
| Document ID | 14 |
| Status | Approved foundation; provider-level setup follows in Batch 3 |
| Version | 0.1 |
| Applies to | Odhvica reference store and future independently deployed client stores |
| Owner | Product owner / growth lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document defines how Odhvica public storefronts should be discoverable, measurable and marketing-ready without sacrificing performance, privacy or customer trust. It establishes SEO and analytics requirements for an image-rich, international handmade-fashion store deployed from a reusable master template.

Every client store must own its own analytics, search-console, advertising and marketing configuration. Tracking identifiers, audiences, customer data and reporting must never be copied from the Odhvica reference store or another client project.

## 2. Objectives

| Objective | Required outcome |
|---|---|
| Search discoverability | Public product, collection, campaign and editorial pages are crawlable, meaningful and structured for search engines. |
| Fast experience | SEO design reinforces mobile performance, stable rendering and accessible content rather than adding unnecessary scripts. |
| Product visibility | Each product has durable URL, title, metadata, descriptive content, image context and accurate availability/price information. |
| Attribution | Store owners can understand how visitors discover products and progress through the commerce funnel. |
| Campaign measurement | Marketing channels and promotions can be measured without breaking privacy/consent rules. |
| Reusable operations | The master template provides an analytics event model and configuration boundary; each client connects its own accounts. |
| Data trust | Reports distinguish observed data, estimated/attributed data and incomplete data; no metric is treated as self-explanatory. |

## 3. SEO Principles

| Principle | Requirement |
|---|---|
| Content value | Pages must answer real customer questions and describe products accurately; avoid thin, copied or keyword-stuffed content. |
| Stable URLs | Product, collection, page and article URLs should be readable, durable and redirect-managed when changed. |
| Semantic structure | Use meaningful headings, landmarks, links, labels, lists, tables and image descriptions. |
| Rendered content | Essential product/collection/page information must be available in a search-friendly rendered response, not hidden behind avoidable client-only interactions. |
| Canonical clarity | Duplicate or variant-like pages must have a documented canonical/indexation strategy. |
| Media discipline | Product/campaign imagery must be optimised, descriptive and contextually connected to the page. |
| Internal linking | Navigation, collections, related products, editorial pages and policy/guide pages should create useful crawlable paths. |
| Honest commerce data | Price, sale, stock, delivery and product claims on the page must match the current product/order configuration. |

## 4. Public Page Inventory and Indexation Intent

| Page type | Default indexation intent | SEO purpose |
|---|---|---|
| Home | Index | Brand/entity entry point and principal discovery page. |
| Product detail | Index when active and meaningful | Product discovery and long-tail search demand. |
| Collection/category | Index when curated/useful | Category, material, style, occasion and campaign discovery. |
| Campaign/landing page | Case-by-case | Seasonal/campaign discovery where content has lasting or active value. |
| Editorial/blog/lookbook | Index when useful | Craft education, styling, care, gift and brand discovery. |
| About/artisan/process | Index | Brand trust, craft/origin and story visibility. |
| Size/care/shipping/returns FAQ | Index when genuinely useful and appropriate | Support, trust and customer-question discovery. |
| Search results | Usually noindex | Prevent thin/infinite query-result pages from competing with curated pages. |
| Cart/checkout/account | Noindex | Private/transactional pages. |
| Filter/sort parameter combinations | Controlled | Avoid uncontrolled duplicate/crawlable URL growth. |
| Internal admin | Noindex and access-controlled | Never public search content. |

## 5. Page-Level Metadata Requirements

| Field | Product | Collection | Editorial/page |
|---|---|---|---|
| Title | Product name plus concise distinguishing context/brand strategy | Collection name plus relevant category/brand context | Clear page/article topic plus brand context as appropriate |
| Description | Useful purchase summary; not generic repetition | Explains collection purpose/selection | Explains content value and expected reader outcome |
| Canonical URL | Required | Required | Required |
| Social share image | Product primary/curated image | Campaign/collection image | Editorial/brand image |
| Robots/indexation | Based on product status and policy | Based on content/usefulness | Based on page value and policy |
| Structured data fields | Product data when valid | Collection/page breadcrumb context | Article/organization/context when valid |
| Alt text | Product-specific imagery | Collection/campaign image description | Meaningful image/caption description |

Metadata templates may help speed client setup, but they must not replace manually reviewed, unique content for high-value product and collection pages.

## 6. Product SEO Requirements

A product page must make the product understandable to both customers and search systems. It must use the real product record as the source of truth.

| Product SEO element | Requirement |
|---|---|
| URL/slug | Human-readable, stable and based on approved product identity; redirects are managed when changed. |
| Product title | Clear product type and useful differentiators; avoid excessive keyword repetition. |
| Description | Explain material, craft/process, style, fit, variation, care and use context where relevant. |
| Media | Descriptive alt text, optimised assets and image order that shows key product detail. |
| Variant content | Avoid creating low-value duplicate pages for every minor option unless a defined strategy supports it. |
| Availability | Reflect current sellability accurately; sold-out/archived policy is explicit. |
| Price | Reflect active price/sale information accurately and consistently with cart/checkout. |
| Structured data | Generate only from valid product data and only where the final technical implementation verifies eligibility. |
| Related links | Connect to relevant collections, care/size guidance, related products and craft/editorial content. |

## 7. Collection and Editorial SEO Requirements

Collections should not merely be empty product filters. A collection that is intended to rank or be shared should include a meaningful title, product curation, descriptive context, internal links and controlled metadata.

Editorial content should help a customer understand the product category: caring for fabrics, choosing fit, understanding craft, styling a garment, selecting a handmade gift, planning delivery, or learning the brand story. It must connect naturally to relevant products/collections without being purely promotional.

| Content type | SEO quality requirement |
|---|---|
| Collection | Clear theme, curated/valid products, useful intro and metadata, controlled filter/indexation behaviour. |
| Material/craft guide | Accurate source-reviewed explanation with relevant product links. |
| Size/care guide | Practical instructions, clear limitations and customer-support route. |
| Lookbook | Visual narrative with meaningful captions, image descriptions and product references. |
| Gift/occasion guide | Useful selection criteria and updated product availability. |
| Campaign | Clear time/status management; archive/redirect policy after campaign ends. |

## 8. International and Multi-Currency SEO Rules

International selling does not automatically mean creating a separate indexable page for every country, currency, language or query parameter. Regionalisation must be planned to avoid confusing duplicate content, price mismatches, checkout ineligibility or unsupported market promises.

| Area | Rule |
|---|---|
| Currency display | Communicate display currency honestly and maintain final-checkout clarity. |
| Region pages | Create only when there is distinct, maintained market content/value and a validated technical strategy. |
| Language | Defer multilingual expansion until translation, content ownership and technical implementation are approved. |
| Shipping claims | Do not claim delivery to a market without configuration and policy support. |
| Canonicals | Use documented canonical rules for region/currency/filter variations. |
| Inventory/price | Ensure public structured/product data remains aligned with customer-visible commerce state. |

## 9. Technical SEO Requirements

The final technical architecture must ensure public pages can be crawled, rendered and understood efficiently. This document defines the required outcome; detailed implementation belongs in later architecture and performance documents.

| Requirement | Expected behaviour |
|---|---|
| Rendering | Essential product, collection, heading, content, price and link information is present in a search-friendly initial/rendered response. |
| Crawl control | Robots directives, sitemap generation and canonical rules are centrally managed and testable. |
| Sitemaps | Include eligible public pages; exclude private, invalid, duplicate or intentionally noindex routes. |
| Redirects | URL changes preserve appropriate permanent redirects and avoid redirect chains. |
| Error pages | Missing product/page routes return useful customer experience and correct technical status. |
| Structured data | Generated from validated records; tested before release; removed/updated when no longer valid. |
| Performance | Core templates minimise render blocking, layout shift, media bloat and unnecessary third-party dependencies. |
| Mobile | Public pages remain responsive, readable and fully navigable on mobile devices. |
| Security | Public SEO systems must not expose admin/private data, preview tokens or secrets. |

## 10. Analytics Event Model

Analytics must be event-driven and intentionally defined. The event model should be provider-neutral at the master-template level; each client connects its own approved analytics and advertising tools.

| Event | Trigger | Core properties |
|---|---|---|
| `page_view` | Eligible page is viewed | page type, URL, referrer context, region/currency context where consent allows |
| `view_collection` | Collection/listing view | collection ID/name, product count, sort/filter state |
| `search` | Customer submits search | query, result count, search context; do not capture sensitive input unnecessarily |
| `filter_apply` | Filter state changes | filter type/value, collection/search context |
| `view_item` | Product detail is viewed | product ID, variant context, category/collection, price/currency |
| `select_variant` | Variant option is selected | product ID, option name/value, availability state |
| `customisation_complete` | Required/optional custom input successfully completes | product ID, field type/completion state; never send private customer-entered content to analytics by default |
| `add_to_cart` | Valid line item added | product/variant IDs, quantity, price/currency, collection context |
| `view_cart` | Cart is viewed | item count, cart value/currency, discount state |
| `begin_checkout` | Checkout begins | cart value, item count, eligible shipping/payment context |
| `add_shipping_info` | Valid shipping step completed | shipping method/region only; minimise personal data capture |
| `add_payment_info` | Payment method selected/initiated | provider/method category; never transmit payment details |
| `purchase` | Purchase confirmed under approved order/payment rule | order ID, value, tax/shipping/discount, currency, items; deduplicate reliably |
| `add_to_wishlist` | Wishlist action | product/variant context |
| `generate_lead` | Newsletter/approved lead consent submission | source/page context and consent state only |
| `support_request` | Customer starts approved support path | request type and order context only where permitted |

## 11. Consent and Privacy Rules

Analytics and advertising measurement must follow the final privacy/legal design. The template must support consent-aware loading/configuration and minimise collection of personal data. Customer-entered notes, measurements, contact fields, addresses, payment details, uploaded references and other sensitive data must never be treated as normal analytics event properties.

| Rule | Requirement |
|---|---|
| Client ownership | Each client owns/configures its own tracking accounts and identifiers. |
| Consent | Script activation and data use follow the approved client privacy/cookie policy and regional requirements. |
| Data minimisation | Collect events needed for business understanding; avoid form contents and sensitive identifiers. |
| Purchase deduplication | Ensure purchase events do not double-count browser/server/provider confirmations. |
| Test environment | Use separate test/staging tracking where possible to avoid contaminating production reports. |
| Access | Analytics access follows client/staff/developer role and contract boundaries. |

## 12. Reporting Requirements

The admin/reporting surface should use commerce data as the authoritative operational source and may combine it with external analytics context where clearly labelled.

| Report area | Questions to answer |
|---|---|
| Sales | What was ordered, paid, refunded and fulfilled by period, product, collection, region and channel context? |
| Product performance | Which products/collections attract views, carts, purchases, returns or stock issues? |
| Funnel | Where do customers progress or drop between product view, cart, checkout and purchase? |
| Search | What customers search for, whether they find results and which queries need catalogue/content attention? |
| Promotion | Which discounts/campaigns are used and what commercial effect do they have? |
| Customer | Repeat purchase, order frequency, geographic distribution and consent-aware audience growth. |
| Operations | Production/fulfilment time, shipping issues, return/refund/exchange patterns and inventory risk. |

Metrics must include date range, currency/context, source, inclusion rules and known limitations. Reports should not imply causal attribution where only correlation or platform attribution is available.

## 13. Marketing Integration Governance

Marketing integrations may include analytics, search-console verification, advertising pixels, email marketing, WhatsApp, reviews and product feeds. An integration must be added only after business need, consent impact, performance cost, data shared, owner, failure behaviour and removal procedure are known.

No client tracking account, audience, conversion ID, feed or private campaign data is included in the master repository or copied to another client project.

## 14. SEO and Analytics Acceptance Criteria

A release is acceptable when public pages have intentional indexation/metadata behaviour, product and collection data render accurately, sitemaps/robots/canonical behaviour is testable, pages meet responsive/performance expectations, and key discovery-to-purchase events can be measured without collecting sensitive customer data or contaminating client environments.

## Related Documents

`09_storefront_ux.md` defines public journeys. `11_design_system.md` defines component and performance-aware presentation. `12_content_model.md` governs publishable content. `13_catalog_model.md` provides product data. `15_accessibility.md` defines inclusive public-page requirements. Later architecture, API, integration, security, performance, legal and testing documents will define provider-specific implementation.
