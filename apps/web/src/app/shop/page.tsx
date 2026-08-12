import type { Metadata } from "next";
import { StorefrontHeader } from "@/components/storefront-header";
import { ShopExplorer } from "@/components/shop-explorer";

export const metadata: Metadata = { title: "Shop handmade pieces", description: "Browse Odhvica handmade jackets, bags and textile objects." };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ collection?: string }> }) {
  const { collection } = await searchParams;
  return <main className="min-h-screen"><StorefrontHeader /><section className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:px-12"><p className="text-[10px] font-bold tracking-[0.18em] text-[var(--accent)] uppercase">The collection</p><h1 className="mt-3 max-w-3xl font-[family-name:var(--font-cormorant)] text-6xl leading-[0.85] tracking-[-0.05em] sm:text-7xl">Pieces with a past, made for the present.</h1><p className="mt-6 max-w-xl leading-7 text-[var(--ink-muted)]">Every item includes its material story, care notes, stock or make-time and any customisation details before you continue to checkout.</p></section><ShopExplorer initialCollection={collection} /></main>;
}
