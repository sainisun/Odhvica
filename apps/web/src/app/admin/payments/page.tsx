import { PaymentSandboxWorkspace } from "@/components/payment-sandbox-workspace";
import { requireStaffAccess } from "@/lib/auth/admin-guard";
import { getPublicProviderStatuses } from "@/lib/payments/config";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  await requireStaffAccess("payments:configure");
  return <PaymentSandboxWorkspace providers={getPublicProviderStatuses()} />;
}
