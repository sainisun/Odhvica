import type { CustomerAccess } from "@/lib/auth/customer-guard";

const sections = [
  ["Profile", "Your authenticated account identity and personal details.", "Account data activates with the production runtime."],
  ["Saved addresses", "Delivery and billing addresses remain visible only to your account.", "Address management is ready for persisted account data."],
  ["Order history", "Past orders show safe order statuses and totals only.", "No address, card or provider payload is exposed in the list."],
  ["Communication", "Choose operational and marketing email preferences.", "Transactional order messages remain separate from marketing consent."],
  ["Privacy requests", "Request access, correction or erasure review for account data.", "Requests are queued for authorised operational review."],
] as const;

export function CustomerAccountWorkspace({ customer }: { customer: CustomerAccess }) {
  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12"><p className="text-[10px] font-bold tracking-[0.18em] text-[var(--accent)] uppercase">Customer account</p><h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-6xl tracking-[-0.05em]">Hello, {customer.name}.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">Your account foundation is protected by your authenticated session. This reference environment keeps all account actions in safe placeholder mode until the isolated PostgreSQL runtime is provisioned.</p><section className="mt-9 grid gap-4 md:grid-cols-2">{sections.map(([title, description, status]) => <article key={title} className="rounded-2xl border border-[var(--line)] bg-white p-6"><h2 className="font-[family-name:var(--font-cormorant)] text-3xl">{title}</h2><p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{description}</p><p className="mt-5 rounded-lg bg-[#f5f3ee] p-3 text-xs leading-5 text-[var(--ink-muted)]">{status}</p></article>)}</section><section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6"><p className="text-[10px] font-bold tracking-[0.14em] text-[var(--accent)] uppercase">Authenticated email</p><p className="mt-3 text-sm font-semibold">{customer.email}</p><p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">The complete account email is shown only to its authenticated owner. Staff notification screens use masked recipient values instead.</p></section></main>;
}
