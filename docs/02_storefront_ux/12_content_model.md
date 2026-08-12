# Odhvica — Content Model

| Field | Value |
|---|---|
| Document ID | 12 |
| Status | Approved content foundation |
| Version | 0.1 |
| Applies to | Odhvica reference store and future independent client stores |
| Owner | Product owner / content lead |
| Last updated | 2026-08-12 |

## 1. Purpose

This document defines the content structures that allow Odhvica storefronts to tell a handmade brand story without requiring code changes for routine content work. It covers product storytelling, collection merchandising, campaign pages, homepage blocks, informational pages, policies, navigation, SEO content, media and publication governance.

The content model supports a fully redesigned storefront. It does not prescribe one visual layout. It defines reusable content objects and safe publishing rules so the same commerce foundation can serve different client brands, campaign styles and editorial directions.

## 2. Content Principles

| Principle | Application |
|---|---|
| Story supports purchase | Brand/artisan/material stories should add confidence and context while preserving clear access to product and purchase information. |
| Structured before freeform | Use structured fields for recurring information such as material, care, lead time, size guide, SEO and campaign links. |
| Reusable blocks, unique composition | Clients may compose blocks into different storefront pages without altering core components. |
| Source accuracy | Product origin, material, artisan, sustainability, stock, delivery and policy claims must be accurate and reviewable. |
| Ownership separation | Never copy one client’s content, images, policies or customer-facing claims into another client store or the master template. |
| Publish safety | Draft, preview, scheduled and published states must be clear; broken links and missing required content must be detectable. |
| Performance-aware media | Images and video must be purposeful, optimised, described and responsive. |

## 3. Content Object Taxonomy

| Content object | Purpose | Primary owner |
|---|---|---|
| Store profile | Store identity, contact, region, social links and high-level brand settings | Owner / manager |
| Navigation item | Menu/flyout/footer destination and label | Content manager |
| Homepage / landing page | Structured editorial and commerce blocks | Content manager / designer |
| Campaign | Time-bound or thematic promotion, launch, festival, occasion or collection story | Marketing / content manager |
| Collection | Curated product group with metadata and editorial introduction | Catalogue / content manager |
| Product story | Customer-facing product description and supporting structured content | Catalogue manager |
| Brand / artisan story | Origin, process, people, values and craft narrative | Owner / content manager |
| Informational page | About, contact, FAQ, size guide, care, shipping, returns, privacy and terms | Content manager / owner |
| Blog / journal / lookbook | Editorial discovery, education, styling and SEO content | Content manager |
| Promotion content | Announcement, sale campaign, offer explanation and supporting terms | Marketing manager |
| SEO metadata | Title, description, canonical/indexation settings and structured-page fields | Content manager / technical reviewer |
| Media asset | Image, video, document or visual source used by content/product objects | Catalogue / content manager |

## 4. Store Profile

The store profile is a configuration-driven content object. It makes brand-level information available to shared storefront components without hard-coding client identity into the master template.

| Field group | Required / optional fields |
|---|---|
| Identity | Store name, legal/display name where applicable, logo, favicon, brand short description, social profiles. |
| Contact | Customer-support email, phone/WhatsApp where enabled, business address or service contact settings. |
| Commerce context | Base country/region, supported regions, default currency, customer-support hours and shipping origin. |
| Brand voice | Approved voice notes, key values, terminology, banned claims and writing guidance. |
| Trust context | Artisan/process statement, material/sourcing statement, relevant certifications or claims only when validated. |
| Legal links | Privacy, terms, shipping, returns/refunds, contact and cookie/consent destinations as required. |

## 5. Homepage and Landing Page Blocks

Homepage and campaign pages are assembled from a controlled library of blocks. The exact block sequence, visual layout and theme expression may differ by client. A content manager should be able to update permitted fields but not accidentally change the underlying commerce or accessibility behaviour.

| Block | Content fields | Governance |
|---|---|---|
| Announcement | Short message, optional link, active date, dismissible setting | Must not obscure critical navigation or mislead about offer terms. |
| Hero | Eyebrow, title, body, primary/secondary CTA, responsive media, focal point, alt text | Essential information must not exist only in image text. |
| Collection feature | Collection reference, image, title, summary, CTA | Collection must be published and link valid. |
| Product rail | Configured product set, title, supporting copy, display limit | Product availability/price is live commerce data, not manually duplicated copy. |
| Split editorial | Image/media, heading, body, CTA and destination | Must preserve responsive reading order. |
| Craft story | Title, narrative, media, related collection/page/product links | Claims require owner approval. |
| Lookbook / gallery | Media set, captions, optional product tags | Media rights and image optimisation required. |
| Testimonial/review | Approved quote/review reference, attribution and product context | Use only authorised/verified content. |
| Newsletter | Value statement, consent language, form settings and success state | Consent rules must be honoured. |
| FAQ | Question/answer set, category, expansion state | Must not replace full legal policy pages. |
| Rich text | Heading, body, links and limited formatting | Sanitised input and accessible heading order required. |

## 6. Product Story Content

Products need a mixture of structured commercial data and editorial explanation. Structured data is defined further in `13_catalog_model.md`; this document defines how it is presented as customer-facing content.

| Product-content area | Requirement |
|---|---|
| Product title | Clear and descriptive without keyword stuffing or misleading claims. |
| Short summary | Concise positioning, product type, key material/style cue and use/occasion context where appropriate. |
| Full description | Explains design, textile/material, craft/finish, styling and expected variation in a scannable format. |
| Material and care | Structured, accurate material composition/care guidance; clear limitations where applicable. |
| Fit and size | Fit language, size chart reference, garment measurement/context and free-size explanation where relevant. |
| Handmade disclosure | Explains natural variation, handmade finish, print/placement variation or unique-item condition where relevant. |
| Production and delivery | Clear production lead time, dispatch expectation and link to shipping detail. |
| Origin/craft story | Optional product-level source, artisan/process or cultural context with verified claims. |
| Personalisation | Plain explanation of available fields, limits, lead-time impact and custom-product policy. |
| Trust/policy | Accessible links to returns, shipping, contact and relevant policy information. |

## 7. Collection Content

A collection is both a product grouping and an editorial landing surface. It may represent a product type, material, season, occasion, new arrival, sale, style, campaign, gift theme or curated story.

| Collection field | Requirement |
|---|---|
| Identity | Title, slug, status, primary type and navigation placement. |
| Introduction | Short visible summary plus optional extended editorial description. |
| Media | Hero/card media with responsive focal point and alt text. |
| Product rule | Manual curation, configured rule or hybrid; rule behaviour must be visible to admins. |
| Merchandising | Sort/featured positions, related collections, campaign association and recommended filter configuration. |
| SEO | Title, description, canonical/indexation controls and structured content where supported. |
| Availability | Publication state and valid product count; empty published collections need explicit approved handling. |

## 8. Informational and Policy Content

Informational pages build trust, improve service, and reduce support questions. Policy content must be managed as content with ownership and review—not as temporary footer text.

| Page type | Minimum content |
|---|---|
| About / brand story | Brand origin, values, craft/process, product category and customer relationship. |
| Artisan / process | Accurate description of making process, people, source and variation where applicable. |
| Size guide | Garment/size measurements, measurement instructions, fit notes and support route. |
| Care guide | Textile/material care, washing/storage/caution information and limitation disclaimer as required. |
| Shipping | Regions, production versus transit, rate approach, tracking, customs/duty position and support route. |
| Returns / refunds / exchanges | Eligibility, timing, exclusions, condition requirements, request path and refund method/timing as approved. |
| FAQ | Shipping, sizing, materials, orders, payments, custom work and care questions. |
| Contact | Customer-support channels, response expectation and order/support context guidance. |
| Privacy / terms / cookies | Approved legal content; technical system must link and surface consent choices as required. |

The platform must not generate legal claims or policies automatically without client review. Legal/compliance documentation will define review controls.

## 9. Blog, Journal and Lookbook Content

Editorial content supports discovery, brand depth and SEO. It must have a clear purpose and relationship to products or customer questions.

| Content type | Purpose | Required fields |
|---|---|---|
| Journal article | Craft education, care, styling, brand story or customer education | Title, slug, author/source, publish state, date, body, media, SEO fields and related links. |
| Lookbook | Visual styling, seasonal story, collection context | Title, media, captions, product references, CTA and responsive presentation. |
| Gift / occasion guide | Merchandising for gift/seasonal demand | Title, criteria, product references, customer guidance and offer terms if relevant. |
| Material guide | Explain textile, sourcing, care or process | Verified source content, media, related products and policy links. |

## 10. Media Model

Media is a first-class content asset because handmade fashion relies on rich visual presentation. Each media asset must have a clear owner, intended usage, accessibility description, rights context and optimisation path.

| Field | Requirement |
|---|---|
| Asset identity | Filename/identifier, creator/source, upload date and usage status. |
| Association | Linked product, collection, page, campaign or general asset library location. |
| Accessibility | Alt text for meaningful images; decorative designation only when appropriate; captions/transcripts for relevant rich media. |
| Responsive use | Defined crop/focal point, aspect ratio intent and responsive sizes. |
| Rights | Confirmed right to use in client storefront; no unlicensed reuse across clients. |
| Performance | Optimised formats/sizes and loading priority appropriate to page role. |
| Lifecycle | Draft, published, replaced, archived and deletion/reference awareness. |

## 11. Publishing Workflow

Content must pass through a controlled lifecycle to prevent unfinished or misleading information from reaching customers.

| State | Meaning | Allowed action |
|---|---|---|
| Draft | Incomplete/private content | Edit, preview, assign review. |
| In review | Awaiting content/brand/legal approval | Comment, approve/reject according to role. |
| Scheduled | Approved for future publication | Edit schedule or return to draft with audit record. |
| Published | Live customer-facing content | Update through governed edit/publish flow. |
| Archived | Retained internally but no longer public | Restore, inspect references or delete through controlled action. |

High-impact content—pricing claims, promotion terms, policies, sustainability/craft claims, shipping promises, returns exclusions, legal pages and payment-related guidance—should require owner/manager approval before publication.

## 12. Content Governance and Quality Rules

| Rule | Requirement |
|---|---|
| Brand accuracy | Use approved brand voice and verified product/business information. |
| Claim review | Do not make environmental, artisan, material, delivery, pricing, medical or legal claims without verification/approval. |
| Link safety | Validate internal/external links before publication and preserve redirect strategy when URL changes. |
| SEO integrity | Use descriptive titles/headings, unique metadata and useful content; avoid duplicate/thin/keyword-stuffed pages. |
| Accessibility | Use heading hierarchy, alt text, readable link names, semantic lists/tables and captions where relevant. |
| Client separation | Client content belongs only to that client project unless a separate written right and reuse decision exists. |
| Version awareness | Policy and critical content changes should preserve review/publication history. |

## 13. Content Permissions

| Role | Default content capability |
|---|---|
| Owner | Full publish/approval access including policy and store profile. |
| Content manager | Create/edit/preview standard pages, campaigns, collections and SEO content; publish according to assigned permission. |
| Catalogue manager | Edit product-related content/media/SEO and configured collection information. |
| Marketing manager | Create approved campaigns/promotions content and schedule eligible pages. |
| Support staff | Read relevant policy/contact content; no unrestricted publication access. |
| Developer/support operator | Technical content-model maintenance only; no routine customer-facing content changes without authorisation. |

## 14. Content Acceptance Criteria

Content functionality is acceptable when a store owner can create and publish an accurate product story, collection, campaign and policy page; connect content to products/collections; preview responsive output; manage media responsibly; preserve SEO/accessibility requirements; and avoid code changes for routine content updates.

## Related Documents

`09_storefront_ux.md` defines where content appears. `10_admin_ux.md` defines management workflows. `11_design_system.md` defines block/component presentation. `13_catalog_model.md` defines product/variant data. `14_seo_analytics.md` and `15_accessibility.md` define supporting quality rules.
