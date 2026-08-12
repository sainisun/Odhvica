"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { collectionDetails, filterStorefrontProducts } from "@/lib/catalogue/storefront-data";

const filters = ["All", ...collectionDetails.map((collection) => collection.name)];

export function ShopExplorer({ initialCollection = "All" }: { initialCollection?: string }) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState(filters.includes(initialCollection) ? initialCollection : "All");
  const products = useMemo(() => filterStorefrontProducts(query, collection), [query, collection]);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
      <div className="grid gap-4 border-y border-[var(--line)] py-4 md:grid-cols-[1fr_auto] md:items-center">
        <label className="flex items-center gap-3 text-sm text-[var(--ink-muted)]">
          <span className="text-xs font-bold tracking-[0.14em] uppercase">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Material, piece or collection"
            className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-[var(--ink-muted)]"
            aria-label="Search handmade products"
          />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Filter by collection">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setCollection(filter)}
              aria-pressed={collection === filter}
              className={`rounded-full border px-3 py-2 text-[10px] font-bold tracking-[0.12em] uppercase transition ${collection === filter ? "border-[var(--foreground)] bg-[var(--foreground)] text-white" : "border-[var(--line)] hover:border-[var(--foreground)]"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between py-7">
        <p className="text-sm text-[var(--ink-muted)]">{products.length} pieces shown</p>
        <p className="text-xs font-semibold tracking-[0.12em] uppercase">Stories in every stitch</p>
      </div>
      {products.length ? (
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      ) : (
        <div className="border border-dashed border-[var(--line)] px-6 py-16 text-center">
          <p className="font-[family-name:var(--font-cormorant)] text-3xl">No pieces found</p>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">Try a broader search or return to all collections.</p>
        </div>
      )}
    </section>
  );
}
