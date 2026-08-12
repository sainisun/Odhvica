# Odhvica — Accessibility Requirements

| Field | Value |
|---|---|
| Document ID | 15 |
| Status | Approved accessibility foundation |
| Version | 0.1 |
| Applies to | Public storefront, checkout, customer account and admin application |
| Target | Design and test toward WCAG 2.2 AA; any exception requires documented review and remediation plan |
| Owner | Product owner / UX and engineering leads |
| Last updated | 2026-08-12 |

## 1. Purpose

Odhvica must be usable by customers and store staff with different visual, motor, hearing, speech, cognitive and situational access needs. Accessibility is not a final visual QA task. It is a product requirement that shapes navigation, content, components, forms, media, checkout, error recovery, administrative operations and storefront redesign.

This document applies to the reusable master-template components and every client-specific storefront redesign. A client’s visual design must not lower the accessibility baseline established by the master template.

## 2. Accessibility Principles

| Principle | Requirement |
|---|---|
| Perceivable | Information is available through text, structure, contrast, captions/descriptions and not colour/image alone. |
| Operable | Customers and staff can navigate and complete actions with keyboard, touch, pointer and assistive technology. |
| Understandable | Labels, instructions, errors, status messages, language and interactions are predictable and clear. |
| Robust | Semantic structure and accessible component behaviour remain compatible with current assistive-technology expectations. |
| Equivalent experience | Mobile, desktop and responsive layouts retain access to the same essential task, information and recovery path. |
| No inaccessible redesign | Brand/theming freedom does not permit inaccessible contrast, unclear controls, non-semantic visual text or keyboard traps. |

## 3. Scope

| Surface | Accessibility requirement |
|---|---|
| Global navigation | Keyboard/mobile navigable, labelled, focus-managed and structurally clear. |
| Home/campaign pages | Headings, links, media, CTAs and visual storytelling remain perceivable and operable. |
| Collections/search/filters | Controls are labelled, state is announced, filters can be applied/cleared and no-result state is understandable. |
| Product pages | Gallery, variant selection, price, customisation, stock/lead-time, add-to-cart, policy and review content are accessible. |
| Cart/checkout | Every required action, error, total, shipping/payment option and confirmation state is accessible and understandable. |
| Account/support | Authentication, profile, orders, wishlist, review and request flows remain accessible. |
| Admin panel | Tables, forms, status, filters, timelines, settings, bulk actions and dialogs support keyboard and screen-reader operation. |
| Content management | Authors are guided to create accessible headings, alt text, links, tables and media. |

## 4. Semantic Structure and Landmarks

Each page must use a logical, predictable structure. Visual styling must not replace semantic meaning.

| Requirement | Implementation intent |
|---|---|
| Document language | Page language is declared; language changes within content are identified when meaningful. |
| Landmarks | Use appropriate header, navigation, main, complementary and footer regions. |
| Heading hierarchy | One clear page topic and sequential heading structure; do not choose headings only for visual size. |
| Lists/tables | Use semantic list/table structures for real lists/comparisons; avoid using layout elements to fake data tables. |
| Link purpose | Link text explains destination/action in context; avoid repeated vague “click here” labels. |
| Button purpose | Actions use buttons, destinations use links; icon-only controls have accessible names. |
| Reading order | DOM/keyboard/screen-reader order matches meaningful visual/interaction order. |
| Skip link | Provide a visible-on-focus way to bypass repeated navigation to main content. |

## 5. Keyboard and Focus Requirements

No essential customer or admin action may depend only on a pointer, hover or touch gesture.

| Area | Requirement |
|---|---|
| Keyboard navigation | All interactive controls can be reached and operated with keyboard. |
| Focus visibility | Current focus is clearly visible and not clipped, low contrast or hidden by sticky UI. |
| Focus order | Progresses logically through the interface and matches expected task flow. |
| Menus | Open, move through and close using documented keyboard behaviour; focus returns appropriately. |
| Dialogs/drawers | Move focus into opened overlay, constrain focus appropriately, provide clear close action and restore focus to trigger on close. |
| Filters | Mobile filter drawers and desktop filter controls retain selected state and support keyboard clear/apply operations. |
| Product gallery | Thumbnails, next/previous, zoom/lightbox and close controls are keyboard operable. |
| Variant selectors | Buttons, swatches, selects and radios expose state and availability; disabled options are communicated. |
| Cart and checkout | Quantity controls, remove action, coupon, address, shipping and payment selection work fully by keyboard. |
| Admin tables | Sort/filter/row action/bulk selection functions remain operable without mouse-only interactions. |

## 6. Visual Contrast, Colour and Typography

| Area | Requirement |
|---|---|
| Text contrast | Text must maintain the project’s approved accessibility contrast target against its background. |
| Interactive contrast | Buttons, input borders, focus indicators, icons and selected states must remain perceivable. |
| Colour independence | Do not communicate availability, validation, error, status or required state only with colour. |
| Sale price | Current price, reference price and sale state are distinguishable using text/structure in addition to visual styling. |
| Typography | Storefront/client fonts must remain readable at user zoom, avoid overly small body text and preserve line height/spacing. |
| Text resize | The layout must tolerate browser zoom and text enlargement without hiding content or controls. |
| Motion | Animation must not be required to understand status or complete action; reduced-motion preference is honoured. |
| Image text | Critical product, pricing, offer, policy or navigation text must not exist only inside an image. |

## 7. Images, Video and Media

Fashion e-commerce relies on visual content, so media accessibility is a core merchandising requirement.

| Media type | Requirement |
|---|---|
| Product image | Provide useful alt text describing product, relevant colour/material/detail and view when it supports purchase understanding. |
| Decorative image | Mark as decorative only when it conveys no unique content or function. |
| Campaign/hero image | Do not embed the only version of essential promotional/offer information inside the image; provide equivalent text. |
| Image gallery | Give gallery controls accessible names and communicate selected/current image state. |
| Video | Provide captions for meaningful spoken content; provide transcript/summary where appropriate; do not autoplay audio. |
| Motion/animation | Offer reduced motion or avoid non-essential motion that can distract or trigger discomfort. |
| File upload | Explain accepted file types/size, privacy handling and error state in text; do not rely only on visual drop zones. |

## 8. Form Requirements

Forms include login, registration, newsletter, product customisation, contact, address, checkout, return/support request and admin configuration. They must be understandable before and after submission.

| Requirement | Expected behaviour |
|---|---|
| Labels | Every input has a visible or reliably associated text label. Placeholder text is not the only label. |
| Required fields | Required state is communicated in text/semantics, not only colour or an unexplained symbol. |
| Help text | Measurements, customisation, password, address and policy-dependent inputs provide concise instructions before errors occur. |
| Error identification | Invalid fields are identified in text close to the field and in a clear error summary where needed. |
| Error recovery | Preserve valid entered data; explain how to correct the value; move focus appropriately only when helpful. |
| Grouped choices | Use fieldset/legend or equivalent grouping for shipping, payment, size, consent and related options. |
| Input purpose | Use appropriate autocomplete/input purpose semantics where supported to reduce effort and error. |
| Dynamic total/status | Cart/checkout price, shipping and promotion updates are communicated without disruptive focus jumps. |
| Confirmation | Successful submission explains outcome and next step, especially for payment/order/request forms. |

## 9. Product and Handmade-Commerce Requirements

| Customer decision area | Accessibility rule |
|---|---|
| Product title/price | Readable programmatic and visual relationship; currency and sale/reference context are clear. |
| Size and variants | Selection controls expose option name, selected state, unavailable state, price impact and validation requirement. |
| Swatches | Provide text name/value; do not use colour alone to identify a variant. |
| Custom measurements | Explain unit, expected measurement method, required/optional state, range/error and privacy implications. |
| Personalisation | Clarify character limits, allowed content, lead-time impact and custom-product policy. |
| Made-to-order lead time | Present in text near purchase decision; not only in a badge/tooltip. |
| Stock state | Sold-out, low-stock, unique-item or made-to-order state is communicated in text. |
| Size/care/policy | Reachable with keyboard and available without hover-only tooltips. |
| Gallery/zoom | Zoom is optional; the core product image/content remains available without it. |

## 10. Dynamic Content and Status Messages

Dynamic interfaces must communicate meaningful changes to assistive technologies without creating confusing or excessive announcements.

| Situation | Requirement |
|---|---|
| Add to cart | Confirm item addition, selected variant/customisation summary where practical, and next action without losing page context unexpectedly. |
| Cart total update | Communicate material total/discount/shipping changes. |
| Filter results | Announce updated result count/state after an intentional filter action. |
| Validation | Announce errors/success in a predictable manner; do not rely on colour border alone. |
| Checkout/payment | Communicate processing, success, failure and safe retry status. |
| Stock/variant change | Update availability state clearly when selection changes. |
| Admin save/publish | Confirm saved/published/failed state with visible and assistive feedback. |
| Background refresh | Do not unexpectedly steal focus or reset a user’s work. |

## 11. Responsive and Touch Requirements

Responsive design is an accessibility concern. Customers may use small screens, zoom, touch, keyboard overlays, screen readers, low bandwidth or landscape orientation.

| Requirement | Rule |
|---|---|
| Touch targets | Interactive controls are comfortably tappable and not tightly packed. |
| Orientation | Essential tasks work in supported orientations; no unnecessary orientation lock. |
| Reflow | Content remains usable without forced two-dimensional scrolling except for genuinely tabular data with an accessible alternative. |
| Sticky elements | Sticky headers/cart buttons do not cover focused fields, error messages or essential content. |
| Mobile drawers | Navigation/filter/cart drawers can be closed, focus-managed and read in a logical order. |
| Zoom | Product selection, cart and checkout do not lose controls when zoomed. |
| Gesture alternatives | Swipe/drag/hover interactions have buttons or other accessible alternatives. |

## 12. Admin Accessibility Requirements

Admin workflows must not become inaccessible because they are information-dense.

| Admin pattern | Requirement |
|---|---|
| Data tables | Column labels, sorting state, row selection, action menus and responsive alternatives are clear. |
| Status badges | State is written as text and not encoded by colour alone. |
| Dense forms | Group sections, headings, validation and field descriptions logically; support keyboard review. |
| Charts | Provide summary, data table or textual equivalent for essential business information. |
| Bulk actions | Clearly announce selection count, affected scope and confirmation impact. |
| Timelines | Present chronological information in logical reading order with understandable timestamps/status. |
| Permissions | Explain access restrictions and disabled action reason where useful. |
| Notifications | Important notices are visible and accessible without creating unmanageable announcement noise. |

## 13. Content Authoring Requirements

The CMS/admin content experience must guide authors toward accessible content.

| Authoring area | Requirement |
|---|---|
| Headings | Encourage logical hierarchy and avoid style-only headings. |
| Images | Require/encourage alt text with context-specific guidance. |
| Links | Flag empty/vague links and allow descriptive labels. |
| Tables | Support header cells and discourage tables for visual layout. |
| Video | Capture caption/transcript details where relevant. |
| Colour/style | Do not let authors make critical information understandable only through colour or image text. |
| Preview | Provide responsive preview and content validation cues for missing required accessibility fields. |

## 14. Testing Strategy

Accessibility testing must combine automated checks with human interaction testing. Automated tools catch common issues but cannot validate product clarity, keyboard flow, reasonable labels, useful alt text, checkout comprehension or screen-reader experience by themselves.

| Test type | Minimum expectation |
|---|---|
| Automated lint/audit | Run during development and release checks for common semantic, label, contrast and ARIA issues. |
| Keyboard test | Complete navigation, search, filters, product selection, cart, checkout, account and key admin flows without mouse. |
| Screen-reader spot test | Verify landmarks, headings, labels, errors, dialogs, dynamic status and product/checkout information for critical flows. |
| Zoom/reflow test | Test customer and admin flows at browser zoom and narrow viewport conditions. |
| Contrast and visual review | Review theme tokens and key component states against approved targets. |
| Content review | Inspect product alt text, campaign text, links, forms, policies and image-only information. |
| Regression test | Repeat critical checks whenever shared components, storefront theme, checkout or admin controls change. |

## 15. Exception Process

No accessibility requirement may be silently ignored for visual preference or implementation convenience. If an exception is unavoidable, record the user impact, reason, alternatives considered, compensating measure, owner, remediation target and test plan. Exceptions must be reviewed before release and added to the decision log where material.

## 16. Acceptance Criteria

A release meets this accessibility foundation when customers and staff can use critical flows without relying only on colour, hover or a mouse; all essential forms provide labels/instructions/errors; focus and dialogs are managed correctly; product/customisation/checkout information is understandable; media has appropriate alternatives; and client storefront theming does not weaken the approved baseline.

## Related Documents

`09_storefront_ux.md` defines customer flows. `10_admin_ux.md` defines administrative tasks. `11_design_system.md` defines component behaviour. `12_content_model.md` and `13_catalog_model.md` define accessible content/product data. `14_seo_analytics.md` aligns semantic content and privacy-aware measurement. Security, testing and legal documents will extend these requirements in later batches.
