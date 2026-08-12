export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-10 lg:px-16">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[var(--line)] pb-5 text-sm tracking-[0.14em] uppercase">
        <span className="font-semibold text-[var(--accent)]">Odhvica</span>
        <span className="hidden text-[var(--ink-muted)] sm:block">Handmade commerce foundation</span>
        <span className="text-[var(--ink-muted)]">Phase 1</span>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 py-20 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:py-28">
        <div>
          <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">Made deliberately</p>
          <h1 className="max-w-4xl font-[family-name:var(--font-cormorant)] text-6xl leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
            Commerce built for objects with a story.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-[var(--ink-muted)] sm:text-lg">
            Odhvica is becoming the dependable operating layer for handmade products: thoughtful storefronts, structured catalogue data, secure commerce and calm back-office control.
          </p>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[8px_8px_0_0_#e6ded2]">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">Implementation status</p>
          <p className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl">Foundation underway</p>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">Next.js, typed roles, secure payment-routing rules and Phase 0 provider decisions are being prepared before catalogue and checkout work begins.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
        {[
          ["01", "Craft-aware catalogue", "Variants, materials, made-to-order timings and personalisation are first-class product data."],
          ["02", "Trustworthy commerce", "Server-authoritative pricing, payment routing, tax snapshots and order history protect each transaction."],
          ["03", "Calm operations", "A consistent admin system will give owners, fulfilment and support teams the right tools and boundaries."],
        ].map(([number, title, copy]) => (
          <article key={number} className="bg-[var(--surface)] p-7 sm:p-9">
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">{number}</p>
            <h2 className="mt-10 font-[family-name:var(--font-cormorant)] text-3xl">{title}</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--ink-muted)]">{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
