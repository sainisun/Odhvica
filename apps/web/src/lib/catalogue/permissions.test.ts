import { describe, expect, it } from "vitest";
import { assertCatalogueWritePermission, assertInventoryWritePermission, canWriteCatalogue } from "./permissions";

describe("catalogue staff permissions", () => {
  it("allows content, manager and owner roles to write catalogue content", () => {
    expect(canWriteCatalogue("content")).toBe(true);
    expect(canWriteCatalogue("manager")).toBe(true);
    expect(canWriteCatalogue("owner")).toBe(true);
  });

  it("denies fulfilment and support roles catalogue writes", () => {
    expect(() => assertCatalogueWritePermission("fulfilment")).toThrow("cannot write catalogue");
    expect(() => assertCatalogueWritePermission("support")).toThrow("cannot write catalogue");
  });

  it("allows inventory changes only for operationally authorised roles", () => {
    expect(() => assertInventoryWritePermission("fulfilment")).not.toThrow();
    expect(() => assertInventoryWritePermission("content")).toThrow("cannot adjust inventory");
  });
});
