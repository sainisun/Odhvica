import { NotificationSandboxWorkspace } from "@/components/notification-sandbox-workspace";
import { requireStaffAccess } from "@/lib/auth/admin-guard";
import { getEmailMode } from "@/lib/notifications/config";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  await requireStaffAccess("orders:read");
  return <NotificationSandboxWorkspace mode={getEmailMode()} />;
}
