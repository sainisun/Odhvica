# Odhvica — Legal and Compliance Checklist

| Field | Value |
|---|---|
| Document ID | 28 |
| Status | Working compliance checklist; legal review required before any client production launch |
| Version | 0.2 |
| Applies to | Odhvica reference store and each independently deployed client store |
| Owner | Client business owner for business/legal content; technical lead for implementation controls |
| Last updated | 2026-08-12 |

> **Legal notice:** This is a working product and implementation checklist, not formal legal advice. Each client must have a qualified lawyer or appropriate local professional review their terms, privacy notices, tax/customs position, returns policy, consumer obligations and country-specific selling requirements before relying on or publishing them.

## 1. Purpose

Odhvica is designed for international direct-to-consumer handmade-fashion sales. The application must make it possible for each client to publish accurate policies, obtain/manage permissions, protect customer data, present commercial terms, handle returns/refunds and support compliance processes. However, software cannot determine a client’s final legal obligations by itself.

This document defines the legal/compliance implementation responsibilities and launch checks. It separates what the platform must technically support from what the client business owner must provide, approve and maintain.

### 1.1 Applicable-Framework Assessment

For an India-based Odhvica store, the **Digital Personal Data Protection Act, 2023 (DPDP Act)** is an explicit framework to assess for relevant digital personal-data processing. For international selling, the client must assess whether the **General Data Protection Regulation (GDPR), Regulation (EU) 2016/679**, applies to particular processing of personal data of people in the European Economic Area or other relevant territorial situations. Applicability, commencement/enforcement status, lawful basis, cross-border transfer approach, controller/processor roles and local obligations must be confirmed by qualified counsel for the client’s actual facts; the platform does not make that legal determination. [1] [2]

## 2. Responsibility Model

| Area | Client business owner responsibility | Odhvica technical responsibility |
|---|---|---|
| Business identity | Provide accurate legal/display business identity, contact details, registration/tax information and selling regions. | Provide configurable store profile and public-page rendering. |
| Terms and policies | Obtain legal review and approve customer-facing terms, privacy, cookies, shipping, returns/refunds/exchanges and custom-product policies. | Provide editable versioned policy/content pages, links and publication controls. |
| Product claims | Validate material, artisan, sustainability, origin, care, fit, safety, pricing and delivery claims. | Provide structured content fields, review workflow and claim/policy placement capability. |
| Tax/customs | Determine registration, calculation, invoice, customs/duty disclosures and recordkeeping requirements. | Provide configuration/data/reporting hooks; do not claim automated legal correctness without validated scope. |
| Payment accounts | Own/authorise merchant accounts and comply with provider terms. | Integrate securely, protect secrets and record provider/payment state. |
| Customer data | Determine lawful basis, privacy notice, consent language, retention and response obligations. | Provide data minimisation, consent records, access controls, export/delete workflow support and audit records. |
| Security incident | Meet notice/communication obligations with professional advice. | Detect, contain, preserve evidence, restore and document technical incident response. |
| Accessibility | Determine applicable obligations and commitments. | Build toward documented accessibility baseline and support accessible content. |

## 3. Launch Policy Pack

Every client store must have the following customer-facing content before launch, reviewed and approved by the client. The exact language and applicability vary by country, product type and business model.

| Policy/page | Required content responsibility | Platform support |
|---|---|---|
| Business/contact page | Accurate store identity, customer-support method, address/contact details as required. | Content page, footer/header link and configurable contact components. |
| Terms of sale/use | Purchase terms, account use, price/currency, order acceptance, liability/limitations and governing terms as advised. | Versioned content page and acceptance/link placement where approved. |
| Privacy notice | Data categories, purposes, service providers, transfers, retention, rights and contact method. | Versioned content page, consent/configuration support and privacy-request workflow. |
| Cookie/tracking notice | Cookie/analytics/advertising use and preference controls as applicable. | Consent-aware script configuration and preference UI support. |
| Shipping policy | Regions, production versus transit, rates, tracking, delivery estimates, customs/duty position and restrictions. | Editable content, checkout/shipping configuration and policy links. |
| Returns/refunds/exchanges policy | Eligibility, time limits, condition, custom/made-to-order exclusions where lawful, request process and refund method. | Editable content, policy links and support/request workflow. |
| Custom/personalised product policy | Measurement/personalisation process, approval/lead time, variation, cancellation/return limits subject to legal review. | Product disclosure/custom field/order workflow support. |
| Size/care/material guidance | Accurate product-use/care/fit information and any relevant limitations. | Structured product/content fields and page links. |
| Accessibility/contact support | Alternative support route and any published accessibility statement if client chooses/needs one. | Accessible UI baseline and contact path. |

## 4. Privacy and Customer Data

The platform must collect only the customer data necessary to sell, deliver, support and improve the store according to approved client policy. Product browsing/checkout/account/admin design must not use convenience as a reason to collect excessive data.

| Data category | Typical purpose | Technical controls |
|---|---|---|
| Account/contact data | Account access, order communication, support | Role/ownership controls, secure auth/session, minimised display/logging. |
| Delivery address | Shipping/fulfilment and order service | Separate protected storage/snapshot, role-limited admin visibility, retention review. |
| Order/payment reference | Transaction/fulfilment/refund/reconciliation | Provider token/reference only; no raw sensitive payment data. |
| Custom measurements/personalisation | Produce requested handmade item | Product-specific validation, limited staff access, explicit privacy/retention handling. |
| Uploaded reference file | Customer custom design/reference request | Private storage, access control, file validation, deletion/retention process. |
| Marketing consent | Optional marketing communication | Timestamp/source/policy version and preference state. |
| Analytics/advertising event | Measure store/campaign use | Consent-aware loading, minimised event properties and no sensitive contents. |
| Support/privacy request | Customer service/right request | Ownership verification, restricted access, request status/audit trail. |

### 4.1 DPDP Act and GDPR Control Mapping

The following map identifies the existing platform controls that support a client’s compliance assessment. It is an implementation mapping, not a conclusion that any deployment is legally compliant.

| Privacy/consent area | Existing Odhvica controls | DPDP Act 2023 assessment mapping | GDPR assessment mapping |
|---|---|---|---|
| Notice and transparency | Versioned privacy notice, policy pages, customer-support/privacy contact route and purpose-linked data inventory in Sections 3–4. | Supports review of notice and purpose/consent communication for digital personal data. | Supports review of transparent privacy information and documented processing context. |
| Purpose limitation and minimisation | Purpose-specific data categories, restricted customisation/upload fields, data minimisation and logging controls in Section 4. | Supports review that personal data is collected/used for stated business purposes. | Supports review of purpose limitation and data-minimisation obligations. |
| Marketing/analytics consent | Timestamp, source, policy version, preference state, withdrawal flow and consent-aware script loading in Sections 4–5 and `14_seo_analytics.md`. | Supports review of consent/withdrawal records and downstream preference handling. | Supports review of consent conditions where consent is the chosen lawful basis; other lawful bases require separate client legal assessment. |
| Customer rights/request handling | Privacy-request record, ownership verification, restricted access, request status/audit trail and export/delete/correction workflow support. | Supports handling and tracking of data-principal rights requests subject to final legal process. | Supports handling and tracking of data-subject access, rectification, erasure, restriction/objection and portability requests where applicable. |
| Security and incident response | Role controls, encrypted backups, secure sessions, audit logs, incident process and provider controls in `21_security_blueprint.md`. | Supports assessment of reasonable security safeguards and breach-response obligations. | Supports assessment of appropriate security, processor controls and personal-data breach process. |
| Retention, deletion and vendors/transfers | Retention/deletion configuration, backup policy, integration ownership, provider inventory and client-isolated storage. | Supports retention/erasure and processor/vendor assessment. | Supports storage limitation, processor/vendor terms and international-transfer assessment where applicable. |

## 5. Consent and Preference Management

| Consent/preference | Platform requirement |
|---|---|
| Marketing email | Capture only with client-approved language; store status, timestamp, source and policy version. |
| Marketing WhatsApp/SMS | Enable only through approved provider/client process with appropriate consent/template requirements. |
| Analytics/cookies | Load/manage tracking according to client-approved consent/market requirements; document configuration. |
| Essential transactional messages | Keep separate from marketing controls and follow final client policy/legal advice. |
| Preference withdrawal | Provide a technically effective update path and propagate change to approved downstream provider processes where applicable. |
| Consent audit | Preserve evidence needed for client operations while respecting retention/deletion policy. |

## 6. International Selling, Tax and Customs

Odhvica supports international region/currency/shipping configuration, but it does not make a client automatically compliant in every destination. Each client must identify the countries it sells to and obtain professional advice on applicable tax, customs, consumer, product, labelling, packaging and import/export requirements.

| Topic | Client decision required | Technical support required |
|---|---|---|
| Selling regions | Which countries/regions are enabled and restricted. | Region eligibility/checkout blocking and customer-facing shipping policy. |
| Currency | Display/settlement currency and rounding/price strategy. | Configured display and checkout currency context. |
| Tax | Registration, calculation, disclosure, invoice/recordkeeping requirements. | Configurable tax/invoice data model and reporting hooks after scoped validation. |
| Customs/duties | Whether customer/store pays, disclosure wording, documents and carrier process. | Policy/checkout disclosure placement and shipping/order data support. |
| Product restrictions | Country/product/material restrictions or safety requirements. | Region/product eligibility configuration and content controls. |
| Returns rights | Market-specific cooling-off/return rights and exclusions. | Policy versions, request workflows and customer communication. |

## 7. Consumer Information and Commerce Transparency

Customer-facing pages and checkout must present commercial information accurately and before purchase. The client owns the underlying business claims; Odhvica provides the surfaces and validation paths to present them consistently.

| Commercial information | Required system support |
|---|---|
| Product identity/description | Product title, image, material/craft, variant, fit/size, care and handmade-variation disclosure. |
| Price | Current price, sale/reference price where truthful, currency context, discount result and final checkout total. |
| Availability | Ready stock, one-of-a-kind, sold-out, made-to-order/pre-order status and lead time. |
| Delivery | Shipping method/cost/estimate, production versus transit distinction and shipping policy link. |
| Customisation | Required/optional fields, validation, lead-time/policy context and order snapshot. |
| Returns/refunds | Accessible policy link and controlled request/support process. |
| Payment | Eligible payment methods, safe provider hand-off and confirmation/failure state. |
| Contact/support | Clear customer-help route before/after purchase. |
| Order confirmation | Durable confirmation/order reference, purchased item/price/shipping snapshot and next steps. |

## 8. Payment and Financial Handling

| Requirement | Platform control |
|---|---|
| Merchant account | Client uses its own authorised Razorpay/Stripe/PayPal or approved provider account. |
| Sensitive payment data | Odhvica does not store raw card/bank credentials; uses provider-approved secure flow. |
| Provider terms | Client must review account/settlement/dispute/refund/country/product eligibility requirements. |
| Refund controls | Role-authorised/refund-audited process with provider confirmation and order timeline. |
| Financial records | Preserve order/payment/refund snapshots and reports according to client professional advice. |
| Currency/transparency | Customer sees final relevant checkout amount/currency before provider payment confirmation. |
| Disputes | Restricted reconciliation/dispute workflow and documented operational owner. |

## 9. Intellectual Property and Content Rights

| Area | Requirement |
|---|---|
| Brand assets | Client confirms ownership/licence to use logos, copy, product photos, videos, font files and design assets. |
| Product imagery | Ensure photographer/model/creator/third-party rights are sufficient for intended markets/channels. |
| Customer uploads | Terms/privacy explain permitted use; access is limited to order/customisation purpose. |
| Artisan/heritage claims | Client verifies origin, process, artisan relationship, cultural references and sustainability claims. |
| Reviews/UGC | Obtain appropriate permission/moderation rights before reusing customer content in marketing. |
| Master template | Developer retains master-source ownership under default commercial model; client receives agreed deployed service/access. |
| Client content isolation | Do not copy client assets/content into another client project or master without written right and approved reuse decision. |

## 10. Accessibility and Inclusive Service

Odhvica is designed toward the accessibility baseline in `15_accessibility.md`. Client storefront redesigns must preserve keyboard, focus, labels, error handling, semantic content, media alternatives and responsive access. Clients should obtain legal advice on any jurisdiction-specific accessibility obligations or required public statements.

Accessibility support should include a visible customer-contact route for customers who need assistance with purchase, product information, checkout or post-purchase service.

## 11. Security, Incident and Records Governance

| Area | Client/business responsibility | Technical responsibility |
|---|---|---|
| Data security | Approve personnel/access and provider choices; follow internal policy. | Secure app/infrastructure, auth, permissions, secret handling and logging. |
| Incident decision | Determine notices/communications with legal/professional guidance. | Detect/contain/preserve/recover/document according to security runbook. |
| Access review | Maintain staff role approvals and remove departed staff. | Provide role/access/revocation/audit functionality. |
| Retention | Define record/data retention based on business/legal advice. | Configure/enforce technically feasible retention/archive/delete workflows. |
| Backup | Approve recovery objectives/business priority. | Run encrypted backups and restore tests. |
| Evidence | Maintain required business records. | Maintain technical audit/order/payment/configuration event records per policy. |

## 12. Client Compliance Onboarding Checklist

| Step | Client deliverable | Technical verification |
|---:|---|---|
| 1 | Legal business identity, customer support contacts and approved selling regions. | Store profile/contact configuration complete. |
| 2 | Approved terms, privacy, cookie/tracking, shipping, returns/refunds/exchanges and custom-product policies. | Published page links/version/status verified. |
| 3 | Accurate product/material/craft/care/size/lead-time claims. | Product content/disclosures complete before publication. |
| 4 | Tax/customs/invoice/region advice and commercial decision. | Relevant settings/checkout/policy disclosure configured. |
| 5 | Approved payment/courier/messaging/analytics accounts and provider terms. | Client-specific secret/configuration and callbacks tested. |
| 6 | Consent language and marketing/tracking decision. | Consent/analytics/script preference configuration tested. |
| 7 | Content/image/font/UGC rights confirmation. | Asset/media usage review complete. |
| 8 | Customer support/return/refund operating owner and workflow. | Admin roles/request/notification flows tested. |
| 9 | Incident/access/backup contacts and decision owner. | Monitoring, access controls, backup/restore and incident runbook verified. |
| 10 | Qualified legal/professional review and client launch sign-off. | Launch checklist records approval. |

## 13. Compliance Change Management

Client policies, regions, prices, tax/customs settings, provider terms, marketing consent, product claims and privacy practices can change over time. The client must notify the technical owner before a change that affects checkout, order handling, data, integrations or public content. The change must be classified, reviewed, tested, documented and published through controlled workflow.

Do not alter legal/policy text during an emergency technical release without client approval, unless an authorised incident owner directs it. Preserve policy version/date history where required by the client’s obligations.

## 14. Compliance Acceptance Criteria

A client store is compliance-ready from a product/technical perspective when it has approved customer-facing policies, accurate commercial disclosures, configurable region/payment/shipping/privacy/consent support, protected data/access, provider/account ownership, record/audit capability and documented client-owner sign-off. The client remains responsible for obtaining qualified legal/tax advice for its actual selling markets and business situation.

## Related Documents

`05_commerce_rules.md` defines commercial behaviour. `12_content_model.md` governs policy/content publication. `14_seo_analytics.md` defines named consent-aware measurement tools. `20_integration_spec.md`, `21_security_blueprint.md`, `26_testing_quality.md` and `27_devops_deployment.md` define technical controls. `30_client_presentation.md` summarises client responsibilities in non-technical language.

## References

[1]: https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf "Digital Personal Data Protection Act, 2023 — MeitY"
[2]: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng "Regulation (EU) 2016/679 — GDPR, EUR-Lex"
