import { CheckoutView } from "@/components/checkout-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { getPublicProviderStatuses } from "@/lib/payments/config";

export default function CheckoutPage() { return <main className="min-h-screen"><StorefrontHeader /><CheckoutView providers={getPublicProviderStatuses()} /></main>; }
