import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { wishlistItems } from "@/lib/db/schema";

type CommerceDatabase = ReturnType<typeof getDatabase>;

export const wishlistOwnerSchema = z.union([z.object({ userId: z.string().min(1), guestToken: z.undefined().optional() }), z.object({ guestToken: z.string().min(16).max(160), userId: z.undefined().optional() })]);
export const wishlistItemSchema = wishlistOwnerSchema.and(z.object({ productId: z.string().uuid(), variantId: z.string().uuid().optional() }));
type WishlistOwner = z.infer<typeof wishlistOwnerSchema>;
function wishlistCondition(owner: WishlistOwner, productId: string, variantId?: string) {
  return and(owner.userId ? eq(wishlistItems.userId, owner.userId) : eq(wishlistItems.guestToken, owner.guestToken!), eq(wishlistItems.productId, productId), variantId ? eq(wishlistItems.variantId, variantId) : isNull(wishlistItems.variantId));
}

export async function toggleWishlistItem(input: z.input<typeof wishlistItemSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = wishlistItemSchema.parse(input); const db = options.db ?? getDatabase(); const owner = wishlistOwnerSchema.parse(payload);
  return db.transaction(async (tx) => {
    const [existing] = await tx.select().from(wishlistItems).where(wishlistCondition(owner, payload.productId, payload.variantId)).limit(1);
    if (existing) { await tx.delete(wishlistItems).where(eq(wishlistItems.id, existing.id)); return { saved: false, item: existing }; }
    const [item] = await tx.insert(wishlistItems).values({ ...payload, createdAt: options.now ?? new Date() }).returning();
    return { saved: true, item };
  });
}

export async function listWishlistItems(ownerInput: z.input<typeof wishlistOwnerSchema>, options: { db?: CommerceDatabase } = {}) {
  const owner = wishlistOwnerSchema.parse(ownerInput); const db = options.db ?? getDatabase();
  return db.select().from(wishlistItems).where(owner.userId ? eq(wishlistItems.userId, owner.userId) : eq(wishlistItems.guestToken, owner.guestToken!)).orderBy(desc(wishlistItems.createdAt));
}
