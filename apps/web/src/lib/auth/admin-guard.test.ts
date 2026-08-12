import { describe, expect, it } from "vitest";
import { AdminAccessError } from "./admin-guard";

describe("admin access errors", () => {
  it("preserves an explicit, non-sensitive denial message", () => {
    const error = new AdminAccessError("Staff access requires enrolled two-factor authentication.");
    expect(error.name).toBe("AdminAccessError");
    expect(error.message).toContain("two-factor authentication");
  });
});
