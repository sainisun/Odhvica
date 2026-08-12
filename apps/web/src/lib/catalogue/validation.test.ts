import { describe, expect, it } from "vitest";
import { customisationFieldSchema, productDraftSchema } from "./validation";

describe("handmade catalogue validation", () => {
  it("requires made-to-order availability for measurement products", () => {
    const result = productDraftSchema.safeParse({
      title: "Custom Kantha Jacket",
      slug: "custom-kantha-jacket",
      productType: "measurement_based",
      inventoryMode: "tracked",
      basePrice: 9000,
      currency: "inr",
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid personalised product customisation fields", () => {
    expect(
      customisationFieldSchema.safeParse({ type: "short_text", label: "Monogram", required: false, maxLength: 12 }).success,
    ).toBe(true);
  });

  it("requires options for a selectable customisation", () => {
    expect(customisationFieldSchema.safeParse({ type: "select", label: "Lining", required: true }).success).toBe(false);
  });
});
