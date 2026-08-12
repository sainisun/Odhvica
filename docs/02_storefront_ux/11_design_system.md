# Odhvica — Design System

| Field | Value |
|---|---|
| Document ID | 11 |
| Status | Approved design foundation; visual tokens to be finalised with Odhvica brand direction |
| Version | 0.1 |
| Applies to | Odhvica admin panel, master storefront primitives and future client storefront redesigns |
| Owner | Product owner / design lead |
| Last updated | 2026-08-12 |

## 1. Purpose

The Odhvica design system provides a consistent foundation for a reusable admin experience and a flexible storefront experience. It prevents the master template from becoming visually inconsistent while allowing every client storefront to have an independently designed brand identity.

The design system is not a fixed page design. It is a collection of tokens, components, patterns, behaviour rules and accessibility constraints. It defines what remains stable underneath a redesign, and what may be changed for a client brand.

## 2. Design-System Structure

| Layer | Purpose | Change policy |
|---|---|---|
| Foundation tokens | Colour roles, typography roles, spacing, radius, elevation, breakpoints, motion and z-index principles | Stable structure; values can be theme-configured within guardrails. |
| Shared primitives | Buttons, inputs, links, alerts, badges, cards, dialogs, menus, drawers, tabs, tables and loading states | Reusable and consistent across the application. |
| Admin system | Operations-focused page patterns and components | Stable across Odhvica and client deployments. |
| Storefront commerce system | Product, collection, cart, checkout, account and content building blocks | Stable commerce behaviour; visual composition can be redesigned. |
| Client theme layer | Brand font, palette, imagery style, spacing character, component expression and page composition | Client-specific storefront implementation. |

> The admin is a product interface and should stay consistent. The storefront is a brand interface and may be visually transformed without breaking underlying commerce contracts.

## 3. Design Principles

| Principle | Application |
|---|---|
| Clear hierarchy | Primary action, price, availability, order state, error and next action must be readable at a glance. |
| Calm premium utility | Handmade fashion requires editorial beauty, but retail controls must remain precise and usable. |
| Consistency before novelty | Reuse controls and patterns when the user task is the same. |
| Accessible by default | Colour, motion, typography, focus and interaction must work for keyboard, screen-reader and touch users. |
| Performance-aware design | Media, animation, fonts and decorative elements must respect mobile performance. |
| Content-first flexibility | Storefront brand expression should emerge through image, typography, layout and content—not by rewriting commerce behaviour. |
| Error-friendly systems | Every interactive component defines default, hover, focus, disabled, loading, success and error states where relevant. |

## 4. Token Framework

The first implementation will define semantic design tokens rather than hard-code visual values throughout components. A semantic token names the job of a value, such as `surface-primary` or `text-danger`, rather than a visual value or client brand name.

| Token family | Purpose | Examples |
|---|---|---|
| Color | Semantic visual roles | background, surface, text-primary, text-muted, border, action-primary, action-danger, success, warning, focus-ring |
| Typography | Text hierarchy and readability | display, heading, title, body, label, caption, price, metadata, button |
| Spacing | Consistent layout rhythm | space-1 through space-10 or equivalent semantic scale |
| Sizing | Input, button, icon, avatar, header and content dimensions | control-sm, control-md, control-lg, icon-sm, content-max |
| Radius | Shape consistency | radius-none, radius-sm, radius-md, radius-lg, radius-full |
| Elevation | Layer and emphasis hierarchy | surface-flat, surface-raised, dialog, navigation overlay |
| Motion | Interaction and transition behaviour | duration-fast, duration-normal, easing-standard, reduced-motion alternative |
| Breakpoints | Responsive behaviour thresholds | compact, mobile, tablet, desktop, wide |
| Z-index | Stable layering | base content, sticky UI, navigation, dialog, notification |

Values will be selected during Odhvica visual design. The token names and semantic roles should remain stable to support client storefront theming.

## 5. Typography Rules

Typography must support premium editorial storytelling and operational clarity. Client storefront font choices can vary, but they must preserve readable body text, accessible contrast, predictable fallback fonts, sensible loading strategy and clear price/form treatment.

| Role | Use | Rule |
|---|---|---|
| Display | Hero/campaign statement | Use sparingly; must not contain essential information only in an image. |
| Heading | Page, collection, product and section hierarchy | Hierarchy is semantic, not created only through size/weight. |
| Product title | Product identity | Must remain readable on card and product page at all breakpoints. |
| Price | Price, sale price, reference price, discount | Must differentiate current and reference price without relying only on colour/strikethrough. |
| Body | Descriptions, stories, policy content | Optimise line length, line height and contrast for long reading. |
| Label | Form and selection controls | Every form control has visible or programmatically associated label. |
| Caption/meta | SKU, secondary product data, timestamps | Not used for information that needs primary emphasis. |
| Admin table text | Dense operational data | Use readable minimum size and support zoom/reflow. |

## 6. Colour Rules

Colour is a themeable storefront attribute and a stable admin usability attribute. The semantic colour system must support light/dark surfaces only where fully designed and tested; a dark palette must not be added merely as decoration.

| Semantic role | Use | Constraint |
|---|---|---|
| Text primary | Main text and product information | Must meet readable contrast on its intended surface. |
| Text secondary | Supporting information | Must not be too faint for policy, price or operational information. |
| Action primary | Primary purchase/save/confirm action | Must remain distinguishable in hover, focus, disabled and loading states. |
| Action secondary | Lower-priority action | Must not visually compete with the primary decision. |
| Success | Confirmed/order/stock positive state | Always paired with text/icon, not colour alone. |
| Warning | Attention or pending condition | Used for meaningful action-needed state, not decoration. |
| Danger | Destructive/error state | Requires clear action/recovery language. |
| Sale | Price promotion treatment | Must remain truthful, legible and not replace price hierarchy. |
| Focus ring | Keyboard focus | Highly visible against all relevant surfaces. |

## 7. Layout and Responsive System

| Layout concept | Requirement |
|---|---|
| Content container | Public content uses a configurable maximum width; full-bleed media is allowed only with accessible content alignment. |
| Grid | Use responsive grid primitives rather than one-off breakpoint layouts. |
| Spacing rhythm | Sections and components use the shared spacing scale; client visual character can tune scale values through approved theme tokens. |
| Page hierarchy | Each page has an identifiable title/primary context, main content region and usable navigation. |
| Sticky UI | Use only when it improves task completion and does not obscure essential content or accessibility controls. |
| Mobile touch targets | Controls must remain comfortably tappable and separated. |
| Layout shifts | Images, banners, product cards and asynchronous modules reserve appropriate space. |
| Reduced motion | Transitions/animations honour user motion preferences and never prevent core interaction. |

## 8. Shared Primitive Components

All components must have documented behaviour, states, keyboard interaction and accessibility semantics before being treated as reusable.

| Component | Required variants / states | Primary contexts |
|---|---|---|
| Button | Primary, secondary, tertiary, destructive, icon; default, hover, focus, disabled, loading | Add to cart, save, publish, refund, apply filter |
| Link | Inline, navigation, card, external; visited/focus states | Content, navigation and policy routes |
| Text input | Default, focus, filled, invalid, disabled, help text | Search, address, personalisation, admin forms |
| Select / combobox | Searchable where needed, multi-select where justified, error/disabled state | Variants, filters, collection selection, admin settings |
| Checkbox / radio / switch | Labelled, keyboard operable, indeterminate where necessary | Filters, consent, shipping options, settings |
| Form field group | Label, description, validation, required state, input and error | Checkout/admin/product editor |
| Badge / status | Text plus semantic visual role | Order, inventory, payment, sale, publication state |
| Alert | Informational, warning, success, error; dismissible only when appropriate | Cart, checkout, integration and admin notices |
| Dialog | Focus management, close behaviour, destructive confirmation treatment | Delete, refund, discard draft, permissions |
| Drawer | Mobile navigation, filters, quick cart, responsive admin detail | Must have focus and screen-reader handling |
| Tabs | Clearly associated panels and selected state | Product details, account, settings, reports |
| Table | Sorting/filtering, responsive alternative, row actions and bulk selection | Products, orders, customers, reports |
| Empty state | Explanation plus recovery action | Search, collection, wishlist, admin lists |
| Skeleton/loading | Reserved layout and non-confusing progress state | Product grids, dashboard, content surfaces |

## 9. Storefront Commerce Components

The following components are the reusable commerce layer beneath client-specific visual design.

| Component | Fixed commerce behaviour | Client design flexibility |
|---|---|---|
| Announcement bar | Configurable message/link/dismiss state | Full brand styling, placement and campaign expression within accessibility rules. |
| Header | Access to navigation, search, account and cart | Structure, visual style, menu presentation and media treatment. |
| Collection card | Link and collection identity | Image, crop, typography, card layout and grid placement. |
| Product card | Product link, image, title, price, sale/availability state | Visual layout, hover/tap treatment, badge style and secondary details. |
| Product gallery | Ordered product media and accessible controls | Gallery arrangement, thumbnail treatment, lightbox expression and image ratio. |
| Variant selector | Valid option selection and availability logic | Chips, buttons, dropdowns, swatches, labels and placement. |
| Customisation field | Required/optional input, validation and order association | Input styling, help content and visual grouping. |
| Add-to-cart control | Cart mutation, validation, loading/error state | Button style, sticky placement and supporting microcopy. |
| Cart line item | Product/variant/customisation/quantity/price summary | Layout, image scale and editing presentation. |
| Price display | Current/reference price and discount clarity | Typography, layout and sale emphasis. |
| Shipping/policy disclosure | Access to configured information | Accordion, inline, side panel or content placement. |
| Review block | Approved review data and moderation state | Visual treatment, card/grid/list layout and editorial placement. |

## 10. Admin Components and Patterns

The admin layer should prioritise repeatable operations over client-specific visual design.

| Pattern | Use |
|---|---|
| Data table + filters | Products, orders, customers, promotions, inventory and reports. |
| Page header + primary action | Product creation, discount creation, content page creation and settings save. |
| Side detail/drawer | Quick inspect/edit where full page navigation is unnecessary. |
| Grouped form sections | Product editor, settings, shipping and integration configuration. |
| Action confirmation | Delete/archive, refund, publish, bulk update and permission changes. |
| Timeline | Order activity, integration activity, customer/service history and audit record. |
| Status summary | Payment, fulfilment, inventory, publication and integration health. |
| Inline validation | Fast correction of product/settings form errors without losing context. |
| Saved views | Frequent operational queues, such as paid/unfulfilled orders or low-stock items. |

## 11. Component State Model

Every interactive component must define state explicitly. A component is incomplete if it only has a default visual state.

| State | Requirement |
|---|---|
| Default | Clearly communicates purpose and whether action is available. |
| Hover | Adds feedback on pointer devices without being the only interaction cue. |
| Focus | Visibly identifies keyboard focus with non-clipped focus treatment. |
| Active/selected | Differentiates current selection without ambiguity. |
| Disabled | Explains unavailable action when context requires it; does not hide required information. |
| Loading | Prevents duplicate action and communicates progress. |
| Success | Confirms completion without interrupting subsequent work unnecessarily. |
| Error | Explains failure in useful language and provides recovery path. |
| Empty | Explains absence of content and offers valid next action. |

## 12. Client Storefront Theming Rules

A client storefront may introduce a unique visual identity through semantic token values, typographic pairing, image art direction, component expression and page composition. The following constraints preserve maintainability.

| Themeable | Not themeable without approved development work |
|---|---|
| Palette, font family, typography scale within readability limits, spacing character, border radius, imagery style, icon expression | Underlying order/payment state model, product/variant validation, cart persistence, checkout data contract, permission behaviour |
| Header/footer treatment, product-card layout, collection grid style, campaign blocks, navigation presentation | Security controls, pricing calculation, inventory rules, tax/shipping eligibility or payment confirmations |
| Product-page layout, content ordering, review display, storytelling modules | Required information disclosure, required custom input validation, accessibility semantics and audit/logging rules |

## 13. Accessibility Requirements

The design system is responsible for making accessible implementation the easiest implementation. Component specifications must include semantic HTML intention, labels, roles only where necessary, keyboard interaction, focus behaviour, screen-reader announcement expectations, contrast constraints and reduced-motion behaviour. Detailed criteria are recorded in `15_accessibility.md`.

## 14. Documentation and Governance

Each reusable component must have a concise specification: purpose, approved variants, props/data requirements, visual states, interaction behaviour, accessibility requirements, responsive rules, analytics event where needed, and examples of valid/invalid usage.

A new client-specific component may remain in a client storefront. It enters the shared design system only when it represents a repeated task/pattern, is free from one-client brand assumptions, has defined states and accessibility behaviour, and has been tested across intended contexts.

## Related Documents

`09_storefront_ux.md` defines customer journeys and page requirements. `10_admin_ux.md` defines operations patterns. `12_content_model.md` defines editable content blocks. `13_catalog_model.md` defines commerce data shown by product components. `14_seo_analytics.md` and `15_accessibility.md` define supporting requirements.
