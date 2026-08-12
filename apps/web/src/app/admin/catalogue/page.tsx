import { CatalogueWorkspace } from "@/components/catalogue-workspace";
import { requireStaffAccess } from "@/lib/auth/admin-guard";
import { listAdminCatalogue } from "@/lib/catalogue/repository";
import { createProductAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CatalogueAdminPage() {
  const staff = await requireStaffAccess("catalogue:write");
  const catalogue = await listAdminCatalogue();
  return <CatalogueWorkspace role={staff.role} products={catalogue.products} summary={catalogue.summary} createProductAction={createProductAction} databaseReady={Boolean(process.env.DATABASE_URL)} />;
}
