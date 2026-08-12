import { describe, expect, it } from "vitest";
import { filterStorefrontProducts, findStorefrontProduct } from "./storefront-data";

describe("storefront catalogue browsing data", () => {
  it("filters pieces by collection without hiding their handmade availability state", () => {
    const jackets = filterStorefrontProducts("", "Jackets");
    expect(jackets).toHaveLength(1);
    expect(jackets[0]?.status).toBe("Made to order");
  });

  it("searches material and handmade availability descriptors", () => {
    expect(filterStorefrontProducts("woven", "All").map((product) => product.slug)).toEqual(["loom-carryall"]);
    expect(filterStorefrontProducts("one of one", "All").map((product) => product.slug)).toEqual(["quiet-stitch-wrap"]);
  });

  it("finds a public product by its stable URL slug", () => {
    expect(findStorefrontProduct("kantha-edit-01")?.title).toBe("Kantha Edit 01");
    expect(findStorefrontProduct("not-a-piece")).toBeUndefined();
  });
});
