import { z } from "zod";

type Environment = Record<string, string | undefined>;
export type AnalyticsMode = "sandbox" | "live";
export function getAnalyticsMode(environment: Environment = process.env): AnalyticsMode { return environment.ODHVICA_ANALYTICS_MODE === "live" ? "live" : "sandbox"; }
export function assertLiveAnalyticsConfiguration(environment: Environment = process.env) { if (getAnalyticsMode(environment) !== "live") throw new Error("Analytics remains in sandbox mode."); const missing = ["NEXT_PUBLIC_GA4_MEASUREMENT_ID", "NEXT_PUBLIC_META_PIXEL_ID", "GOOGLE_SEARCH_CONSOLE_VERIFICATION"].filter((key) => !environment[key]); if (missing.length) throw new Error(`Analytics live activation is blocked until configuration is provided: ${missing.join(", ")}.`); }

export const commerceAnalyticsEventSchema = z.object({ event: z.enum(["view_item", "add_to_cart", "begin_checkout", "purchase"]), eventId: z.string().trim().min(12).max(128), currency: z.string().length(3), value: z.number().nonnegative().optional(), itemIds: z.array(z.string().uuid()).max(50).optional(), orderId: z.string().uuid().optional() }).superRefine((input, ctx) => { if (input.event === "purchase" && (!input.orderId || input.value === undefined)) ctx.addIssue({ code: "custom", message: "Purchase events require an order ID and value." }); });
/** Safe data-layer payload: excludes names, email, addresses, payment data and customisation text. */
export function createSafeCommerceAnalyticsEvent(input: z.input<typeof commerceAnalyticsEventSchema>) { return commerceAnalyticsEventSchema.parse(input); }
