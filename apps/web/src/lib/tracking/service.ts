import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { trackingUpdates } from "@/lib/db/schema";

type CommerceDatabase = ReturnType<typeof getDatabase>;
export const trackingUpdateSchema = z.object({ orderId: z.string().uuid(), carrier: z.string().trim().min(2).max(120), trackingNumber: z.string().trim().min(3).max(180), status: z.enum(["unfulfilled", "in_production", "ready_to_ship", "shipped", "delivered", "review_required", "partially_fulfilled", "fulfilled", "returned"]), providerEventId: z.string().trim().min(12).max(180), payloadSnapshot: z.record(z.string(), z.unknown()).default({}) });

/** Stores a trusted sandbox carrier event exactly once. Live carriers must be signature-verified before this boundary. */
export async function recordSandboxTrackingUpdate(input: z.input<typeof trackingUpdateSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = trackingUpdateSchema.parse(input); const db = options.db ?? getDatabase();
  const [existing] = await db.select().from(trackingUpdates).where(eq(trackingUpdates.providerEventId, payload.providerEventId)).limit(1); if (existing) return { update: existing, reused: true };
  const [update] = await db.insert(trackingUpdates).values({ ...payload, occurredAt: options.now ?? new Date(), createdAt: options.now ?? new Date() }).returning(); return { update, reused: false };
}
