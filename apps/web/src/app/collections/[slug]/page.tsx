import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { StorefrontHeader } from "@/components/storefront-header";
import { listPublishedCollection } from "@/lib/catalogue/repository";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await listPublishedCollection(slug);
  if (!products.length && process.env.DATABASE_URL) notFound();
  const title = slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return <main className="min-h-screen"><StorefrontHeader /><section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12"><Link href="/shop" className="text-xs font-bold tracking-[0.14em] text-[var(--ink-muted)] uppercase">← All pieces</Link><p className="mt-9 text-[10px] font-bold tracking-[0.18em] text-[var(--accent)] uppercase">Odhvica collection</p><h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-6xl leading-[0.85] tracking-[-0.05em]">{title}</h1><p className="mt-5 max-w-xl text-[var(--ink-muted)]">A focused edit of handmade pieces, each with its own material, timing and availability details.</p><div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></section></main>;
}
