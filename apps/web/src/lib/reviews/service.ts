import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { orderItems, orders, productReviews } from "@/lib/db/schema";
import { can, type StaffRole } from "@/lib/commerce/roles";

type CommerceDatabase = ReturnType<typeof getDatabase>;
export const reviewSubmissionSchema = z.object({ productId: z.string().uuid(), orderItemId: z.string().uuid(), rating: z.number().int().min(1).max(5), title: z.string().trim().max(120).optional(), body: z.string().trim().min(20).max(4000) });

/** A review is always a pending, attributable submission from the owner of a delivered order item. */
export async function submitVerifiedPurchaseReview(userId: string, input: z.input<typeof reviewSubmissionSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = reviewSubmissionSchema.parse(input); const db = options.db ?? getDatabase();
  const [purchase] = await db.select({ orderItemId: orderItems.id }).from(orderItems).innerJoin(orders, eq(orderItems.orderId, orders.id)).where(and(eq(orderItems.id, payload.orderItemId), eq(orderItems.productId, payload.productId), eq(orders.userId, userId), eq(orders.fulfilmentStatus, "delivered"))).limit(1);
  if (!purchase) throw new Error("Only the owner of a delivered purchase can submit a review.");
  const [existing] = await db.select().from(productReviews).where(eq(productReviews.orderItemId, payload.orderItemId)).limit(1); if (existing) throw new Error("A review already exists for this purchase item.");
  const [review] = await db.insert(productReviews).values({ userId, ...payload, status: "pending", submittedAt: options.now ?? new Date() }).returning(); return review;
}

export async function moderateAuthenticReview(input: { reviewId: string; actorUserId: string; actorRole: StaffRole; status: "approved" | "rejected"; moderationNote?: string }, options: { db?: CommerceDatabase; now?: Date } = {}) {
  if (!can(input.actorRole, "reviews:moderate")) throw new Error("Staff role is not allowed to moderate reviews.");
  const db = options.db ?? getDatabase(); const [review] = await db.select().from(productReviews).where(eq(productReviews.id, input.reviewId)).limit(1); if (!review) throw new Error("Review was not found.");
  if (review.status !== "pending") throw new Error("Only pending reviews can be moderated.");
  const [updated] = await db.update(productReviews).set({ status: input.status, moderationNote: input.moderationNote, moderatedAt: options.now ?? new Date(), moderatedByUserId: input.actorUserId }).where(eq(productReviews.id, input.reviewId)).returning(); return updated;
}
