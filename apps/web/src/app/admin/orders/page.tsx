import { OrdersWorkspace } from "@/components/orders-workspace";
import { requireStaffAccess } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

export default async function OrdersPage() { const staff = await requireStaffAccess("orders:read"); return <OrdersWorkspace role={staff.role} />; }
