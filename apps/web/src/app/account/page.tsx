import { CustomerAccountWorkspace } from "@/components/customer-account-workspace";
import { requireCustomerAccess } from "@/lib/auth/customer-guard";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await requireCustomerAccess();
  return <CustomerAccountWorkspace customer={customer} />;
}
