import { z } from "zod";

export const productTypeSchema = z.enum(["standard", "variant", "one_of_a_kind", "made_to_order", "personalised", "measurement_based", "pre_order", "gift"]);
export const inventoryModeSchema = z.enum(["tracked", "one_of_a_kind", "made_to_order", "pre_order"]);
export const customisationFieldTypeSchema = z.enum(["short_text", "long_text", "select", "measurement", "file", "gift_message"]);

export const productDraftSchema = z
  .object({
    title: z.string().trim().min(3).max(180),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase hyphenated slug."),
    productType: productTypeSchema,
    inventoryMode: inventoryModeSchema,
    basePrice: z.number().finite().nonnegative(),
    currency: z.string().length(3).transform((value) => value.toUpperCase()),
    leadTimeMinDays: z.number().int().nonnegative().optional(),
    leadTimeMaxDays: z.number().int().nonnegative().optional(),
  })
  .superRefine((draft, ctx) => {
    if (draft.leadTimeMinDays !== undefined && draft.leadTimeMaxDays !== undefined && draft.leadTimeMinDays > draft.leadTimeMaxDays) {
      ctx.addIssue({ code: "custom", path: ["leadTimeMaxDays"], message: "Maximum lead time must be at least the minimum lead time." });
    }

    if (["made_to_order", "measurement_based"].includes(draft.productType) && draft.inventoryMode !== "made_to_order") {
      ctx.addIssue({ code: "custom", path: ["inventoryMode"], message: "Made-to-order products require made-to-order availability mode." });
    }
  });

export const customisationFieldSchema = z
  .object({
    type: customisationFieldTypeSchema,
    label: z.string().trim().min(2).max(80),
    required: z.boolean(),
    maxLength: z.number().int().positive().max(2000).optional(),
    options: z.array(z.string().trim().min(1).max(80)).min(1).max(20).optional(),
    minValue: z.number().finite().nonnegative().optional(),
    maxValue: z.number().finite().positive().optional(),
  })
  .superRefine((field, ctx) => {
    if (field.type === "select" && !field.options?.length) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "A selectable customisation requires at least one option." });
    }

    if (field.type === "measurement" && (field.minValue === undefined || field.maxValue === undefined || field.minValue >= field.maxValue)) {
      ctx.addIssue({ code: "custom", path: ["maxValue"], message: "A measurement requires a valid minimum and maximum value." });
    }
  });

export type ProductDraft = z.infer<typeof productDraftSchema>;
export type CustomisationField = z.infer<typeof customisationFieldSchema>;

export const catalogueProductInputSchema = productDraftSchema.extend({
  description: z.string().trim().max(6000).optional(),
  materialSummary: z.string().trim().max(600).optional(),
  careInstructions: z.string().trim().max(1200).optional(),
  collectionSlugs: z.array(z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).max(12).default([]),
  sizes: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  skuPrefix: z.string().trim().regex(/^[A-Z0-9-]+$/).max(40).optional(),
  initialOnHand: z.number().int().nonnegative().default(0),
  media: z.array(z.object({ storageKey: z.string().trim().min(1).max(1024), altText: z.string().trim().max(240).optional(), isPrimary: z.boolean().default(false) })).max(20).default([]),
  customisationLabel: z.string().trim().min(2).max(80).optional(),
  customisationRequired: z.boolean().default(false),
  publish: z.boolean().default(false),
});

export type CatalogueProductInput = z.infer<typeof catalogueProductInputSchema>;
