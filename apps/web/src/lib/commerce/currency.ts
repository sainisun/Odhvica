const zeroDecimalCurrencies = new Set(["JPY", "KRW", "VND"]);
const supportedDisplayCurrencies = new Set(["INR", "USD", "EUR", "GBP", "AED", "AUD", "CAD", "JPY"]);

export function assertSupportedDisplayCurrency(currency: string) { const normalized = currency.toUpperCase(); if (!supportedDisplayCurrencies.has(normalized)) throw new Error(`Unsupported display currency: ${normalized}.`); return normalized; }
export function displayMinorUnits(currency: string) { return zeroDecimalCurrencies.has(assertSupportedDisplayCurrency(currency)) ? 0 : 2; }
export function formatDisplayCurrency(amount: number, currency: string, locale = "en-IN") { const normalized = assertSupportedDisplayCurrency(currency); return new Intl.NumberFormat(locale, { style: "currency", currency: normalized, minimumFractionDigits: displayMinorUnits(normalized), maximumFractionDigits: displayMinorUnits(normalized) }).format(amount); }
/** Currency display is presentation-only until a client-approved FX/pricing source is configured. */
export function preserveAuthoritativeCurrency<T extends { currency: string }>(record: T) { return { ...record, currency: assertSupportedDisplayCurrency(record.currency) }; }
