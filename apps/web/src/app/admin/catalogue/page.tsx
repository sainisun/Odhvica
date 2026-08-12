import { CatalogueWorkspace } from "@/components/catalogue-workspace";
import { requireStaffAccess } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

export default async function CatalogueAdminPage() {
  const staff = await requireStaffAccess("catalogue:write");
  return <CatalogueWorkspace role={staff.role} />;
}
