"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

type Variant = { id: string; title: string; priceAdjustment: string };

export function ProductPurchasePanel({ product }: { product: { id: string; slug: string; title: string; image: string; basePrice: number; variants: Variant[]; customisation: string } }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);
  const selected = product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];
  const price = product.basePrice + Number(selected?.priceAdjustment ?? 0);
  const requiresDetails = !product.customisation.toLowerCase().startsWith("no customisation");
  const onAdd = () => {
    if (!selected) return;
    if (requiresDetails && !note.trim()) return;
    addItem({ productId: product.id, productSlug: product.slug, title: product.title, image: product.image, variantId: selected.id, variantTitle: selected.title, unitPrice: price, customisationNote: note.trim() || undefined });
    setAdded(true);
  };
  return <div className="mt-8"><fieldset><legend className="text-xs font-bold tracking-[0.14em] uppercase">Size or variation</legend><div className="mt-3 flex flex-wrap gap-2">{product.variants.map((variant) => <button key={variant.id} type="button" onClick={() => { setVariantId(variant.id); setAdded(false); }} aria-pressed={variantId === variant.id} className={`min-w-12 border px-4 py-2 text-sm transition ${variantId === variant.id ? "border-[var(--foreground)] bg-[var(--foreground)] text-white" : "border-[var(--line)] hover:border-[var(--foreground)]"}`}>{variant.title}</button>)}</div><p className="mt-3 text-xs text-[var(--ink-muted)]">Selected piece: {selected?.title ?? "Unavailable"} · ₹{price.toLocaleString("en-IN")}</p></fieldset><div className="mt-6 rounded-xl bg-[#f0e6d7] p-4"><p className="text-xs font-bold tracking-[0.13em] text-[#89551a] uppercase">Made with you in mind</p><p className="mt-2 text-sm leading-6 text-[#755a35]">{product.customisation}</p>{requiresDetails && <label className="mt-4 block text-xs font-semibold text-[#755a35]">Required maker details<textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1.5 min-h-22 w-full rounded-lg border border-[#c9ad88] bg-white/80 px-3 py-2 text-sm text-[#203027]" placeholder="Add measurements, a personalisation request or the detail requested above." /></label>}</div><button type="button" onClick={onAdd} disabled={!selected || (requiresDetails && !note.trim())} className="mt-7 w-full rounded-full bg-[var(--foreground)] px-5 py-4 text-xs font-bold tracking-[0.15em] text-white uppercase transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40">{added ? "Added to bag" : "Add to bag"}</button>{added && <p role="status" className="mt-3 text-center text-xs font-semibold text-[#36513a]">Saved to your bag in this browser.</p>}</div>;
}
