import { describe, expect, it } from "vitest";
import { InventoryConflictError } from "./service";

describe("atomic inventory service contracts", () => {
  it("uses an explicit conflict error so callers do not retry stale stock writes silently", () => {
    const error = new InventoryConflictError();
    expect(error.name).toBe("InventoryConflictError");
    expect(error.message).toContain("Refresh the record");
  });
});
