"use server";

import { revalidatePath } from "next/cache";
import { createCatalogueProduct } from "@/lib/catalogue/service";

function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function createProductAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const sizes = String(formData.get("sizes") ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  const collections = String(formData.get("collections") ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  const mediaKey = String(formData.get("mediaKey") ?? "").trim();

  await createCatalogueProduct({
    title,
    slug,
    productType: String(formData.get("productType") ?? "standard") as "standard",
    inventoryMode: String(formData.get("inventoryMode") ?? "tracked") as "tracked",
    basePrice: toNumber(formData.get("basePrice")),
    currency: "INR",
    leadTimeMinDays: toNumber(formData.get("leadMin")),
    leadTimeMaxDays: toNumber(formData.get("leadMax")),
    description: String(formData.get("description") ?? "").trim() || undefined,
    materialSummary: String(formData.get("material") ?? "").trim() || undefined,
    careInstructions: String(formData.get("care") ?? "").trim() || undefined,
    collectionSlugs: collections,
    sizes,
    initialOnHand: toNumber(formData.get("initialOnHand")),
    media: mediaKey ? [{ storageKey: mediaKey, altText: `${title} product image`, isPrimary: true }] : [],
    customisationLabel: String(formData.get("customisation") ?? "").trim() || undefined,
    customisationRequired: formData.get("customisationRequired") === "on",
    publish: formData.get("publish") === "on",
  });
  revalidatePath("/admin/catalogue");
  revalidatePath("/shop");
  revalidatePath("/");
}
