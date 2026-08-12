# Odhvica — Phase 2 Catalogue and Inventory Implementation

## Delivered foundation

Phase 2 translates the approved handmade catalogue model into PostgreSQL entities and typed business rules. The schema keeps product storytelling, purchasable variants, media metadata, controlled attributes, customisation rules and stock audit history separate so later storefront and admin workflows do not duplicate business logic.

| Capability | Implemented foundation |
|---|---|
| Handmade product modes | Standard, variant, one-of-a-kind, made-to-order, personalised, measurement-based, pre-order and gift modes. |
| Catalogue structure | Products, collections, options, option values, variants, controlled attributes and SEO content fields. |
| Media metadata | Storage key, accessible alt text, focal point, dimensions, position, primary flag and variant association. |
| Customisation | Typed text, select, measurement, file and gift-message rules with validation metadata, price/lead-time adjustments and variant applicability. |
| Inventory | Tracked, one-of-a-kind, made-to-order and pre-order modes; on-hand/reserved values; backorder flag; low-stock threshold; immutable movement records and optimistic version number. |
| Security | Only owner, manager and fulfilment roles may request an inventory adjustment; a non-empty audit reason is mandatory. Catalogue content writes are limited to owner, manager and content roles. |
| Concurrency | Inventory writes use one database transaction, a conditional version match and an availability predicate. A stale competing write returns a conflict rather than overwriting current stock. |

## Activation boundary

The migration generated in this phase is reviewed and committed but not applied. A provisioned, isolated PostgreSQL environment and a reviewed migration application procedure are required before database-backed catalogue or inventory features are switched on.

## Deferred work

The following require later phases or provider configuration: actual object-storage upload/derivative processing, staff catalogue UI, customer browsing/search/filter UI, checkout reservation workflow, collection merchandising rules and the immutable order snapshot created at checkout.
