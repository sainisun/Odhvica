import { ProductionQueueWorkspace } from "@/components/production-queue-workspace";
import { requireStaffAccess } from "@/lib/auth/admin-guard";
import { listProductionQueue } from "@/lib/production/service";
export const dynamic = "force-dynamic";
export default async function AdminProductionPage() { await requireStaffAccess("orders:fulfil"); const jobs = await listProductionQueue(); return <ProductionQueueWorkspace jobs={jobs} />; }
