import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StorefrontHeader } from "@/components/storefront-header";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { findPublishedProduct } from "@/lib/catalogue/repository";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await findPublishedProduct(slug);
  return product ? { title: product.title, description: product.description } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await findPublishedProduct(slug);
  if (!product) notFound();

  return (
    <main className="min-h-screen">
      <StorefrontHeader />
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-12">
        <Link href="/shop" className="text-xs font-bold tracking-[0.14em] text-[var(--ink-muted)] uppercase hover:text-[var(--accent)]">← Back to the collection</Link>
        <section className="mt-7 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="bg-[#e9e3d7]"><Image src={product.image} alt={product.alt} width={1000} height={1250} unoptimized className="aspect-[4/5] h-full w-full object-cover" /></div>
          <div className="flex flex-col py-2">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[var(--accent)] uppercase">{product.status}</p>
            <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-6xl leading-[0.85] tracking-[-0.055em]">{product.title}</h1>
            <p className="mt-5 text-xl font-medium">₹{product.price.toLocaleString("en-IN")}</p>
            <p className="mt-7 max-w-lg leading-8 text-[var(--ink-muted)]">{product.description}</p>
            <div className="mt-8 border-y border-[var(--line)]">
              <div className="grid grid-cols-[110px_1fr] gap-5 border-b border-[var(--line)] py-4 text-sm"><span className="font-semibold">Material</span><span className="text-[var(--ink-muted)]">{product.material}</span></div>
              <div className="grid grid-cols-[110px_1fr] gap-5 border-b border-[var(--line)] py-4 text-sm"><span className="font-semibold">Lead time</span><span className="text-[var(--ink-muted)]">{product.leadTime}</span></div>
              <div className="grid grid-cols-[110px_1fr] gap-5 py-4 text-sm"><span className="font-semibold">Care</span><span className="text-[var(--ink-muted)]">{product.care}</span></div>
            </div>
            <ProductPurchasePanel product={{ id: product.id, slug: product.slug, title: product.title, image: product.image, basePrice: product.price, variants: product.variantOptions, customisation: product.customisation }} />
          </div>
        </section>
      </div>
    </main>
  );
}
