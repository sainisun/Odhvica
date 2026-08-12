export type MarketingPreference = { marketingEmail: boolean; operationalEmail: boolean };
export function canQueueMarketingMessage(preference: MarketingPreference | undefined) { return preference?.marketingEmail === true; }
export function canQueueOperationalMessage(preference: MarketingPreference | undefined) { return preference?.operationalEmail ?? true; }
/** Abandoned-cart campaigns remain policy-only until explicit consent, provider credentials and a scheduled job are configured. */
export function marketingDeliveryMode() { return "sandbox" as const; }
