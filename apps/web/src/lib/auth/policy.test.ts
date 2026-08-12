import { describe, expect, it } from "vitest";
import { canAccessAdmin } from "./policy";

describe("staff admin access policy", () => {
  it("requires active staff and a verified second factor", () => {
    expect(canAccessAdmin({ active: true, role: "owner", twoFactorEnabled: true, secondFactorVerified: true })).toBe(true);
    expect(canAccessAdmin({ active: true, role: "owner", twoFactorEnabled: false, secondFactorVerified: false })).toBe(false);
  });

  it("denies access to deactivated staff even when two factor verification exists", () => {
    expect(canAccessAdmin({ active: false, role: "support", twoFactorEnabled: true, secondFactorVerified: true })).toBe(false);
  });
});
