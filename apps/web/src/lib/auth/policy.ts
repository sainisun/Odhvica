import type { StaffRole } from "@/lib/commerce/roles";

export type AdminAccessState = {
  active: boolean;
  role: StaffRole;
  twoFactorEnabled: boolean;
  secondFactorVerified: boolean;
};

export function canAccessAdmin(state: AdminAccessState) {
  return state.active && state.twoFactorEnabled && state.secondFactorVerified;
}
