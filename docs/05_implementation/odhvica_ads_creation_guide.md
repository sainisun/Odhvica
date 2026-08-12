# Odhvica Ads Creation Guide — Google Ads and Meta Ads

## 1. Use this guide only after the revenue path is ready

Paid ads should not be launched from the current sandbox storefront. First activate isolated PostgreSQL, real product media, shipping rules, a live domain, provider-hosted checkout and verified purchase confirmation. A campaign can be created before these steps, but purchase optimisation and profitability decisions must wait until real, consent-aware purchase measurement exists.

Google Ads identifies actions such as purchases and add-to-cart as conversions, and describes setup as creating a conversion action followed by installation of the Google tag.[1] Meta structures ad creation at campaign, ad-set and ad levels.[2]

| Launch prerequisite | Owner | Pass condition |
|---|---|---|
| Product page | Store owner | Price, stock/made-to-order lead time, returns and shipping information are accurate. |
| Checkout | Technical owner | A verified payment creates exactly one confirmed order. |
| Consent | Store/legal owner | Analytics and advertising tags load only under the applicable consent rule. |
| Measurement | Technical owner | `view_item`, `add_to_cart`, `begin_checkout` and deduplicated `purchase` events are tested. |
| Creative assets | Brand owner | Rights-cleared images/video, product claims and offer terms are approved. |

## 2. Measurement setup before ads

Create a client-owned Google Ads account, GA4 property, Meta Business Portfolio, Meta ad account, Facebook Page and Instagram account. Do not reuse these accounts across clients. Configure GA4, Meta Pixel and Search Console only through the Odhvica fail-closed configuration boundary after client-owned identifiers are available.

> Only send event ID, currency, value, product IDs and an authoritative order ID where necessary. Do **not** place full name, email address, phone, shipping address, payment details, custom measurement data or customer notes in browser advertising events.

For Meta server-side measurement, Conversions API can send marketing events from an advertiser’s server and Meta recommends verifying receipt, deduplication and matching after implementation.[3] The same purchase event ID must be used for the browser/server pair so one sale is not counted twice.

## 3. Start with a small campaign structure

Do not create many countries, audiences and products in the first week. Select **one primary market** first: India/INR or one specific international market where delivery, duties and payment eligibility are already approved. Keep a separate campaign per country/currency only when landing pages, price, shipping policy and payment route are genuinely different.

| Channel | First campaign | Goal | Landing destination |
|---|---|---|---|
| Google Ads | Brand Search | Capture high-intent searches for the brand/product collection. | Relevant collection or category page. |
| Google Ads | Product/Shopping or Performance Max | Test product discovery after Merchant Center feed is approved. | Product detail page with current price and availability. |
| Meta Ads | Sales — prospecting | Find new customers using product-led visual creative. | Collection page or a tightly matched product page. |
| Meta Ads | Sales — remarketing | Re-engage product viewers/cart users who have consented. | Exact product/cart page, subject to local consent rules. |

## 4. Google Ads step by step

1. Create the client-owned Google Ads account and verify billing, business details, target country, timezone and currency before spend begins.
2. In **Goals → Conversions**, create `purchase` as the primary business conversion. Keep `add_to_cart` and `begin_checkout` as diagnostic/secondary conversions until enough real purchases exist.
3. Install the Google tag through the consent-aware Odhvica analytics layer. Test events with a real test order and verify `value`, `currency`, `transaction/order ID` and deduplication.
4. If using product ads, create Merchant Center, verify/claim the domain, and submit product data with accurate ID, title, price, availability, image, destination URL and shipping information. Google’s product data specification is the controlling source for feed fields.[4]
5. Build a **Brand Search** campaign first. Use only exact/phrase variations of the real brand name and controlled product terms. Add irrelevant-query negatives regularly.
6. Build a product/Shopping campaign only after feed diagnostics are clean. Do not advertise a one-of-a-kind or out-of-stock variant as available.
7. Write ads using truthful handmade attributes: craft technique, material, collection, personalisation availability and lead time. Never claim “best”, “limited”, “organic”, “sustainable” or delivery promises unless documented and supportable.
8. Use a small test budget that the client is comfortable losing while measurement is validated. Do not set automated profit targets until delivery has accumulated meaningful verified purchase data.
9. After launch, inspect search terms, product disapprovals, conversion lag, purchase values and refund/cancellation context—not clicks alone.

## 5. Meta Ads step by step

1. In Meta Business Portfolio, create/connect the client-owned Page, Instagram account, ad account and dataset. Confirm business/billing ownership before campaign creation.
2. Configure the Meta Pixel through the consent-aware Odhvica boundary. Add Conversions API only after a server-side secret/configuration and event-deduplication test are approved.
3. In Events Manager, test `ViewContent`, `AddToCart`, `InitiateCheckout` and `Purchase`. A purchase may be sent only after Odhvica verifies the payment/order event, never from an unverified browser redirect.
4. In Ads Manager, choose **Sales** as the campaign objective. At campaign level choose the objective; at ad-set level set audience, placements, budget and schedule; at ad level set the format, creative, text and identity.[2]
5. Create one prospecting ad set for the approved country/market. Begin broad enough to let the platform learn, while excluding existing customers where operationally appropriate.
6. Create a separate remarketing ad set only after the consent/permitted-audience policy is confirmed. Exclude purchasers with a verified-purchase audience when available.
7. Launch 3–5 genuinely different creatives, not tiny copy variations of the same image. Test a craft/process video, a product-in-motion video, a detail/texture image and an editorial outfit image.
8. Use destination URLs that exactly match the creative. A Kantha jacket creative should not land on an unrelated bag collection.
9. Review spend, delivery, frequency, landing-page behaviour, verified purchases, refunds and creative fatigue. Pause only after enough delivery to make a considered decision; do not react to a few clicks.

## 6. Handmade-fashion creative brief

| Asset | First 2 seconds / first frame | Proof to show | CTA |
|---|---|---|---|
| Craft process reel | Hand embroidery/texture close-up | Maker process, material, time/technique claim only if accurate | Explore the collection |
| Product movement video | Garment drape or bag scale | Fit, lining, pockets, texture and real colour | View details |
| Editorial image | Finished outfit in context | Styling/use case and product silhouette | Shop the look |
| Personalisation asset | Clear customisation option | What can be customised and lead-time expectation | Create yours |

Every asset needs approved rights, clear text overlays, mobile-safe framing, legible contrast and an honest landing-page match. Do not use customer photos, UGC or testimonials unless the store has documented permission.

## 7. Weekly operating routine

| Frequency | Action |
|---|---|
| Daily during launch | Check account disapprovals, broken links, product availability, spend anomalies and event errors. |
| Twice weekly | Compare verified purchases, conversion value, cost per verified purchase, checkout abandonment and refund/cancellation notes. |
| Weekly | Add Google negatives, refresh weakest creative, review frequency and decide whether a winner deserves more budget. |
| Monthly | Reconcile platform purchase count/value against authoritative Odhvica orders; review country, product and creative profitability before scaling. |

## 8. Do not launch when any of these are true

Do not start paid traffic if checkout is sandbox-only, purchase events are unverified, product stock/lead time is uncertain, return/shipping policies are absent, consent behaviour is unclear, or a client’s business/billing account is unverified. Ads are an acquisition layer, not a substitute for the commerce, fulfilment and customer-service foundation.

## References

[1] [Google Ads — Conversion tracking](https://business.google.com/us/ad-tools/conversion-tracking/)

[2] [Meta Business Help Centre — Advertising levels in Ads Manager](https://www.facebook.com/business/help/621956575422138)

[3] [Meta for Developers — Conversions API](https://developers.facebook.com/documentation/ads-commerce/conversions-api)

[4] [Google Ads Help — Product data specification](https://support.google.com/google-ads/answer/7052112)
