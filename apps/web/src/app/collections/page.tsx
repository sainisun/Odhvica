import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { collectionDetails } from "@/lib/catalogue/storefront-data";

export default function CollectionsPage() {
  return <main className="min-h-screen"><StorefrontHeader /><section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12"><p className="text-[10px] font-bold tracking-[0.18em] text-[var(--accent)] uppercase">Browse by story</p><h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-6xl leading-[0.85] tracking-[-0.05em]">The collections</h1><div className="mt-12 grid gap-5 md:grid-cols-3">{collectionDetails.map((collection) => <Link key={collection.name} href={`/collections/${collection.name.toLowerCase().replaceAll(" ", "-")}`} className="border border-[var(--line)] bg-[var(--surface)] p-7 transition hover:-translate-y-1 hover:border-[var(--foreground)]"><p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">{collection.count} pieces</p><p className="mt-10 font-[family-name:var(--font-cormorant)] text-4xl tracking-[-0.04em]">{collection.name}</p><p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{collection.note}</p></Link>)}</div></section></main>;
}
