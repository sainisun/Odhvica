export type PaymentGateway = "razorpay" | "stripe" | "paypal";

export type PaymentRouteInput = {
  shippingCountry: string;
  currency: string;
  enabledGateways: readonly PaymentGateway[];
};

export type PaymentRoute = {
  primary: PaymentGateway;
  eligible: PaymentGateway[];
};

export function resolvePaymentRoute({ shippingCountry, currency, enabledGateways }: PaymentRouteInput): PaymentRoute {
  const country = shippingCountry.trim().toUpperCase();
  const selectedCurrency = currency.trim().toUpperCase();
  const enabled = new Set(enabledGateways);

  if (country === "IN" && selectedCurrency === "INR" && enabled.has("razorpay")) {
    return { primary: "razorpay", eligible: ["razorpay"] };
  }

  const internationalGateways: PaymentGateway[] = ["stripe", "paypal"];
  const eligible = internationalGateways.filter((gateway) => enabled.has(gateway));

  if (eligible.includes("stripe")) {
    return { primary: "stripe", eligible };
  }

  if (eligible.includes("paypal")) {
    return { primary: "paypal", eligible };
  }

  throw new Error("No eligible payment gateway is enabled for this checkout.");
}
