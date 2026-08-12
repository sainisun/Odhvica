"use client";

import { useState } from "react";

type Variant = { id: string; title: string; priceAdjustment: string };

export function VariantPicker({ variants, basePrice }: { variants: Variant[]; basePrice: number }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id);
  const selected = variants.find((variant) => variant.id === selectedId) ?? variants[0];
  const price = basePrice + Number(selected?.priceAdjustment ?? 0);
  return <fieldset className="mt-8"><legend className="text-xs font-bold tracking-[0.14em] uppercase">Size or variation</legend><div className="mt-3 flex flex-wrap gap-2">{variants.map((variant) => <button key={variant.id} type="button" onClick={() => setSelectedId(variant.id)} aria-pressed={selectedId === variant.id} className={`min-w-12 border px-4 py-2 text-sm transition ${selectedId === variant.id ? "border-[var(--foreground)] bg-[var(--foreground)] text-white" : "border-[var(--line)] hover:border-[var(--foreground)]"}`}>{variant.title}</button>)}</div><p className="mt-3 text-xs text-[var(--ink-muted)]">Selected piece: {selected?.title ?? "Unavailable"} · ₹{price.toLocaleString("en-IN")}</p></fieldset>;
}
