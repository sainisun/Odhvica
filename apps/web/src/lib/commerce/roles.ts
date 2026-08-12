export const staffRoles = ["owner", "manager", "fulfilment", "content", "support"] as const;

export type StaffRole = (typeof staffRoles)[number];

export const rolePermissions: Record<StaffRole, readonly string[]> = {
  owner: ["*"],
  manager: ["catalogue:write", "orders:write", "customers:read", "promotions:write", "reports:read"],
  fulfilment: ["orders:read", "orders:fulfil", "inventory:read", "inventory:write"],
  content: ["catalogue:read", "content:write", "seo:write"],
  support: ["orders:read", "customers:read", "returns:write"],
};

export function can(role: StaffRole, permission: string) {
  const permissions = rolePermissions[role];
  return permissions.includes("*") || permissions.includes(permission);
}

export function requiresStepUp(permission: string) {
  return ["staff:manage", "payments:configure", "refunds:approve", "privacy:export"].includes(permission);
}
