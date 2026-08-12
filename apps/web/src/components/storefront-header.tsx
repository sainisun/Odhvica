import Link from "next/link";

export function StorefrontHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[color:var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          Odhvica
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-xs font-semibold tracking-[0.16em] text-[var(--foreground)] uppercase md:flex">
          <Link className="transition hover:text-[var(--accent)]" href="/shop">Shop</Link>
          <Link className="transition hover:text-[var(--accent)]" href="/shop?collection=Jackets">Jackets</Link>
          <Link className="transition hover:text-[var(--accent)]" href="/shop?collection=Bags">Bags</Link>
          <a className="transition hover:text-[var(--accent)]" href="#our-process">Our process</a>
        </nav>
        <div className="flex items-center gap-4 text-xs font-semibold tracking-[0.12em] uppercase">
          <span className="hidden text-[var(--ink-muted)] sm:inline">India / INR</span>
          <Link className="border-b border-[var(--foreground)] pb-1 transition hover:border-[var(--accent)] hover:text-[var(--accent)]" href="/shop">Bag 0</Link>
        </div>
      </div>
    </header>
  );
}
