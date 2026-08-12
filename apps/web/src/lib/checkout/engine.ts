import { z } from "zod";
import { resolvePaymentRoute, type PaymentGateway } from "@/lib/commerce/payment-routing";

const money = z.number().finite().nonnegative();

export const checkoutAddressSchema = z.object({
  recipientName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(6).max(32),
  line1: z.string().trim().min(3).max(240),
  line2: z.string().trim().max(240).optional(),
  city: z.string().trim().min(2).max(120),
  region: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().min(3).max(32),
  countryCode: z.string().trim().length(2).transform((value) => value.toUpperCase()),
  taxId: z.string().trim().max(32).optional(),
});

export type CheckoutAddress = z.infer<typeof checkoutAddressSchema>;

export type CheckoutLine = {
  cartItemId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  unitPrice: number;
  inventoryMode: "tracked" | "one_of_a_kind" | "made_to_order" | "pre_order";
};

export type PromotionRule = {
  code: string;
  type: "percentage" | "fixed_amount" | "free_shipping";
  value: number;
  minimumSubtotal: number;
  active: boolean;
  stackable: boolean;
  startsAt?: Date;
  endsAt?: Date;
  usageLimit?: number;
  usageCount: number;
};

export type CheckoutQuoteInput = {
  lines: CheckoutLine[];
  currency: string;
  address: CheckoutAddress;
  shippingTotal: number;
  taxTotal: number;
  promotion?: PromotionRule;
  enabledGateways: readonly PaymentGateway[];
  now?: Date;
};

export type CheckoutQuote = {
  currency: string;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  promotionCode?: string;
  payment: ReturnType<typeof resolvePaymentRoute>;
  stockReservationRequired: boolean;
};

function cents(value: number) { return Math.round(value * 100); }
function decimal(value: number) { return cents(value) / 100; }

export function quoteCheckout(input: CheckoutQuoteInput): CheckoutQuote {
  const address = checkoutAddressSchema.parse(input.address);
  const currency = input.currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Checkout currency must be a three-letter currency code.");
  if (!input.lines.length) throw new Error("Checkout requires at least one cart item.");
  const lines = input.lines.map((line) => ({ ...line, quantity: z.number().int().positive().parse(line.quantity), unitPrice: money.parse(line.unitPrice) }));
  const subtotal = decimal(lines.reduce((sum, line) => sum + cents(line.unitPrice) * line.quantity, 0) / 100);
  let shippingTotal = money.parse(input.shippingTotal);
  const taxTotal = money.parse(input.taxTotal);
  let discountTotal = 0;
  const promotion = input.promotion;
  const now = input.now ?? new Date();

  if (promotion) {
    const inWindow = (!promotion.startsAt || promotion.startsAt <= now) && (!promotion.endsAt || promotion.endsAt >= now);
    const quotaAvailable = promotion.usageLimit === undefined || promotion.usageCount < promotion.usageLimit;
    if (!promotion.active || !inWindow || !quotaAvailable || subtotal < promotion.minimumSubtotal) throw new Error("Promotion is not eligible for this checkout.");
    if (promotion.type === "percentage") discountTotal = decimal((subtotal * promotion.value) / 100);
    if (promotion.type === "fixed_amount") discountTotal = Math.min(subtotal, money.parse(promotion.value));
    if (promotion.type === "free_shipping") shippingTotal = 0;
  }

  const grandTotal = decimal(Math.max(0, subtotal - discountTotal + shippingTotal + taxTotal));
  return {
    currency,
    subtotal,
    discountTotal,
    shippingTotal,
    taxTotal,
    grandTotal,
    promotionCode: promotion?.code,
    payment: resolvePaymentRoute({ shippingCountry: address.countryCode, currency, enabledGateways: input.enabledGateways }),
    stockReservationRequired: lines.some((line) => line.inventoryMode === "tracked" || line.inventoryMode === "one_of_a_kind"),
  };
}
