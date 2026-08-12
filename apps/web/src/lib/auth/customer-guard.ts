import { headers } from "next/headers";
import { createAuth } from "@/lib/auth";

export class CustomerAccessError extends Error {
  constructor(message: string) { super(message); this.name = "CustomerAccessError"; }
}

export type CustomerAccess = { userId: string; name: string; email: string };

export async function requireCustomerAccess(): Promise<CustomerAccess> {
  const session = await createAuth().api.getSession({ headers: await headers() });
  if (!session?.user?.id || !session.user.email) throw new CustomerAccessError("Authentication is required to access a customer account.");
  return { userId: session.user.id, name: session.user.name || "Customer", email: session.user.email };
}
