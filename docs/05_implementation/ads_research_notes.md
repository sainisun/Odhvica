# Ads Research Notes — Odhvica

## Official-source findings

| Source | Finding used in guide |
|---|---|
| Google Ads conversion tracking | Google Ads defines a conversion as a valuable action after an ad interaction and identifies purchases, add-to-cart actions, sign-ups and other actions as trackable examples. Google describes setup as creating a conversion action and installing a Google tag. |
| Meta Ads Manager hierarchy | Meta describes campaign as the objective/buying level; ad set as the audience, placement, budget and schedule level; and ad as the creative, format and identity level. |
| Meta Conversions API | Meta describes Conversions API as a server connection for website/app/CRM/offline events that can support measurement, reporting and optimisation. Its recommended setup includes implementation plus verification/deduplication. |

## Source URLs

1. https://business.google.com/us/ad-tools/conversion-tracking/
2. https://www.facebook.com/business/help/621956575422138
3. https://developers.facebook.com/documentation/ads-commerce/conversions-api

## Odhvica implications

The website must not begin paid acquisition until authoritative purchase data exists after payment verification. During the current sandbox state, ad platforms may receive only test-mode/pending implementation planning—not fabricated purchases. The live tracking plan should send no payment-card data or sensitive checkout details and must be deployed behind the consent boundary defined in Odhvica specifications.
