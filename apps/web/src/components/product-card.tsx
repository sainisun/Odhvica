import Link from "next/link";
import Image from "next/image";
import type { StorefrontProduct } from "@/lib/catalogue/storefront-data";

export function ProductCard({ product }: { product: StorefrontProduct }) {
  return (
    <article className="group min-w-0">
      <Link href={`/shop/${product.slug}`} className="block overflow-hidden bg-[#e9e3d7]">
        <Image
          src={product.image}
          alt={product.alt}
          width={800}
          height={1000}
          unoptimized
          className="aspect-[4/5] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
        />
      </Link>
      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--accent)] uppercase">{product.status}</p>
          <Link href={`/shop/${product.slug}`} className="mt-1 block font-[family-name:var(--font-cormorant)] text-2xl leading-none tracking-[-0.03em] transition hover:text-[var(--accent)]">
            {product.title}
          </Link>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">{product.leadTime}</p>
        </div>
        <p className="pt-3 text-sm font-medium">₹{product.price.toLocaleString("en-IN")}</p>
      </div>
    </article>
  );
}
