import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { StorefrontHeader } from "@/components/storefront-header";
import { collectionDetails, storefrontProducts } from "@/lib/catalogue/storefront-data";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <StorefrontHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-12">
        <div className="flex flex-col justify-end py-10 lg:py-20">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">The hand-finished edit</p>
          <h1 className="mt-5 max-w-xl font-[family-name:var(--font-cormorant)] text-6xl leading-[0.83] tracking-[-0.055em] sm:text-7xl lg:text-8xl">Made slowly.<br />Worn often.</h1>
          <p className="mt-7 max-w-md text-base leading-8 text-[var(--ink-muted)]">Handmade layers and everyday objects shaped by textile memory, lived-in colour and thoughtful repetition.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link className="rounded-full bg-[var(--foreground)] px-5 py-3 text-xs font-bold tracking-[0.14em] text-white uppercase transition hover:bg-[var(--accent)]" href="/shop">Explore the edit</Link><a className="rounded-full border border-[var(--line)] px-5 py-3 text-xs font-bold tracking-[0.14em] uppercase transition hover:border-[var(--foreground)]" href="#our-process">Meet the process</a></div>
        </div>
        <div className="relative min-h-[470px] overflow-hidden bg-[#d9cabb] sm:min-h-[580px]"><Image src="/manus-storage/odhvica-hero-kantha_28e81d3b.jpg" alt="Woman wearing a hand-quilted kantha jacket in an artisan studio" fill priority unoptimized sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" /><p className="absolute bottom-5 left-5 max-w-[220px] border-l border-white/70 pl-3 text-xs leading-5 text-white">Each piece is composed from hand-selected cloth. No two routes through the colour are the same.</p></div>
      </section>
      <section className="border-y border-[var(--line)] bg-[var(--surface)]"><div className="mx-auto grid max-w-7xl gap-px px-5 sm:grid-cols-3 sm:px-8 lg:px-12">{collectionDetails.map((collection) => <Link key={collection.name} href={`/shop?collection=${encodeURIComponent(collection.name)}`} className="group border-x border-transparent px-0 py-7 sm:px-6 sm:hover:border-[var(--line)]"><p className="text-[10px] font-bold tracking-[0.16em] text-[var(--accent)] uppercase">{String(collection.count).padStart(2, "0")} pieces</p><p className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl tracking-[-0.04em] group-hover:text-[var(--accent)]">{collection.name}</p><p className="mt-1 text-sm text-[var(--ink-muted)]">{collection.note}</p></Link>)}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8 lg:px-12 lg:py-24"><div className="flex items-end justify-between gap-6"><div><p className="text-[10px] font-bold tracking-[0.16em] text-[var(--accent)] uppercase">Selected pieces</p><h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-5xl tracking-[-0.05em]">The current conversation</h2></div><Link href="/shop" className="hidden border-b border-[var(--foreground)] pb-1 text-xs font-bold tracking-[0.14em] uppercase sm:block">View all pieces</Link></div><div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-3">{storefrontProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section>
      <section id="our-process" className="bg-[#203027] text-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-12 lg:py-24"><p className="text-[10px] font-bold tracking-[0.18em] text-[#e1b495] uppercase">Our process</p><div><h2 className="max-w-3xl font-[family-name:var(--font-cormorant)] text-5xl leading-[0.9] tracking-[-0.05em] sm:text-6xl">The irregularity is not a flaw. It is the point.</h2><p className="mt-7 max-w-2xl text-base leading-8 text-[#c7d0c9]">We keep the stitch visible, the material honest and the lead-time clear. Your product page carries the practical details before the piece enters your bag.</p><div className="mt-9 grid gap-5 sm:grid-cols-3">{[["01", "Materials", "Fibre, origin and care notes."],["02", "Make time", "Transparent lead-times for every piece."],["03", "Fit & custom", "Clear requirements before any work begins."]].map(([number,title,copy]) => <div key={number} className="border-t border-white/20 pt-4"><p className="text-xs text-[#e1b495]">{number}</p><p className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl">{title}</p><p className="mt-2 text-sm leading-6 text-[#c7d0c9]">{copy}</p></div>)}</div></div></div></section>
    </main>
  );
}
