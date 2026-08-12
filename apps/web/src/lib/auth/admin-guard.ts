import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { can, requiresStepUp, type StaffRole } from "@/lib/commerce/roles";
import { createAuth } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { staffProfiles } from "@/lib/db/schema";

export class AdminAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAccessError";
  }
}

export type StaffAccess = {
  userId: string;
  role: StaffRole;
  requiresFreshStepUp: boolean;
};

export async function requireStaffAccess(permission: string): Promise<StaffAccess> {
  const session = await createAuth().api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new AdminAccessError("Authentication is required for staff access.");
  }

  const db = getDatabase();
  const [staff] = await db
    .select({ role: staffProfiles.role, active: staffProfiles.active })
    .from(staffProfiles)
    .where(eq(staffProfiles.userId, session.user.id))
    .limit(1);

  if (!staff?.active) {
    throw new AdminAccessError("An active staff profile is required for admin access.");
  }

  const authUser = session.user as typeof session.user & { twoFactorEnabled?: boolean };
  if (!authUser.twoFactorEnabled) {
    throw new AdminAccessError("Staff access requires enrolled two-factor authentication.");
  }

  if (!can(staff.role, permission)) {
    throw new AdminAccessError("Your staff role cannot perform this action.");
  }

  return {
    userId: session.user.id,
    role: staff.role,
    requiresFreshStepUp: requiresStepUp(permission),
  };
}
