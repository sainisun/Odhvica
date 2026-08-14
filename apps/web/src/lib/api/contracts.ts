import { z } from 'zod';

export const ApiErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean().default(true),
    data: dataSchema,
    meta: z.record(z.any()).optional(),
  });

export const CatalogueQuerySchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type CatalogueQueryInput = z.infer<typeof CatalogueQuerySchema>;
