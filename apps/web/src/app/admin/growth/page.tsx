import { GrowthModulesWorkspace } from "@/components/growth-modules-workspace";
import { requireStaffAccess } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";
export default async function AdminGrowthPage() { await requireStaffAccess("orders:read"); return <GrowthModulesWorkspace />; }
