"use client";

import { useMemo, useState } from "react";
import { filterStorefrontProducts } from "@/lib/catalogue/storefront-data";

const statusStyles = {
  "Made to order": "bg-[#f9e7cf] text-[#89551a]",
  "Limited run": "bg-[#e8efe5] text-[#36513a]",
  "One of one": "bg-[#ece6f5] text-[#5b4675]",
};

export function CatalogueWorkspace({ role }: { role: string }) {
  const [query, setQuery] = useState("");
  const products = useMemo(() => filterStorefrontProducts(query, "All"), [query]);

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#203027]">
      <header className="border-b border-[#d9d8cf] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#a8472c] uppercase">Odhvica operations</p>
            <h1 className="mt-1 font-[family-name:var(--font-cormorant)] text-3xl tracking-[-0.04em]">Catalogue workspace</h1>
          </div>
          <div className="text-right text-xs text-[#667069]">
            <p className="font-semibold text-[#203027] capitalize">{role}</p>
            <p>Secure staff session</p>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-7 sm:px-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-[#d9d8cf] bg-white p-5 shadow-[0_10px_30px_rgba(31,41,34,0.04)] sm:p-7">
          <div className="flex flex-col gap-5 border-b border-[#e6e4df] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-[#a8472c] uppercase">Product library</p>
              <h2 className="mt-1 font-[family-name:var(--font-cormorant)] text-4xl tracking-[-0.04em]">Pieces in progress</h2>
            </div>
            <label className="flex min-w-0 items-center gap-2 rounded-lg border border-[#d9d8cf] px-3 py-2 text-sm md:w-72">
              <span className="text-[#667069]">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 outline-none" placeholder="Search products" aria-label="Search catalogue" />
            </label>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[660px] text-left text-sm">
              <thead className="text-[10px] font-bold tracking-[0.14em] text-[#667069] uppercase">
                <tr className="border-b border-[#e6e4df]"><th className="pb-3">Product</th><th className="pb-3">Inventory</th><th className="pb-3">Lead time</th><th className="pb-3">Status</th><th className="pb-3 text-right">Price</th></tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.slug} className="border-b border-[#f0eee9] last:border-0">
                    <td className="py-4"><p className="font-medium">{product.title}</p><p className="mt-1 text-xs text-[#667069]">{product.collection} · {product.material}</p></td>
                    <td className="py-4 text-xs text-[#667069]">{product.status === "Made to order" ? "Made to order" : product.status === "One of one" ? "1 available" : "Low stock alert at 2"}</td>
                    <td className="py-4 text-xs text-[#667069]">{product.leadTime}</td>
                    <td className="py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] uppercase ${statusStyles[product.status]}`}>{product.status}</span></td>
                    <td className="py-4 text-right font-medium">₹{product.price.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <aside className="rounded-2xl border border-[#d9d8cf] bg-[#203027] p-6 text-white shadow-[0_10px_30px_rgba(31,41,34,0.12)]">
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#e1b495] uppercase">Draft new piece</p>
          <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl leading-none tracking-[-0.04em]">Give the craft its data.</h2>
          <p className="mt-4 text-sm leading-6 text-[#c7d0c9]">Use the product workflow to record material, construction, lead-time and customisation before publication.</p>
          <form className="mt-7 space-y-4" aria-label="New product draft form">
            <label className="block text-xs font-semibold text-[#e8ece9]">Product title<input className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-[#e1b495]" placeholder="e.g. Kantha Edit 02" /></label>
            <div className="grid grid-cols-2 gap-3"><label className="block text-xs font-semibold text-[#e8ece9]">Inventory<select className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm outline-none"><option>Made to order</option><option>Tracked</option><option>One of one</option></select></label><label className="block text-xs font-semibold text-[#e8ece9]">Lead time<input className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm outline-none" placeholder="7–14 days" /></label></div>
            <label className="block text-xs font-semibold text-[#e8ece9]">Customisation note<textarea className="mt-1.5 min-h-24 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-[#e1b495]" placeholder="Sizing, materials or fit details" /></label>
            <button type="button" className="w-full rounded-lg bg-[#e1b495] px-4 py-3 text-xs font-bold tracking-[0.14em] text-[#203027] uppercase transition hover:bg-[#f0c6a9]">Save draft when database is connected</button>
          </form>
        </aside>
      </div>
    </main>
  );
}
