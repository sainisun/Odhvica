import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { auditEvents, productionJobs } from "@/lib/db/schema";
import { can, type StaffRole } from "@/lib/commerce/roles";

type CommerceDatabase = ReturnType<typeof getDatabase>;
const transitionMap = { queued: ["in_progress", "cancelled"], in_progress: ["quality_review", "cancelled"], quality_review: ["ready_to_ship", "cancelled"], ready_to_ship: [], cancelled: [] } as const;
export type ProductionStatus = keyof typeof transitionMap;

export const productionJobSchema = z.object({ orderId: z.string().uuid(), orderItemId: z.string().uuid(), leadTimeMinDays: z.number().int().nonnegative().optional(), leadTimeMaxDays: z.number().int().nonnegative().optional(), dueAt: z.date().optional(), notes: z.string().trim().max(2000).optional() }).refine((input) => input.leadTimeMinDays === undefined || input.leadTimeMaxDays === undefined || input.leadTimeMinDays <= input.leadTimeMaxDays, { message: "Minimum lead time cannot exceed maximum lead time." });

export async function createProductionJob(input: z.input<typeof productionJobSchema>, options: { db?: CommerceDatabase; now?: Date } = {}) {
  const payload = productionJobSchema.parse(input); const db = options.db ?? getDatabase(); const now = options.now ?? new Date();
  const [existing] = await db.select().from(productionJobs).where(eq(productionJobs.orderItemId, payload.orderItemId)).limit(1); if (existing) return { job: existing, reused: true };
  const [job] = await db.insert(productionJobs).values({ ...payload, createdAt: now, updatedAt: now }).returning(); return { job, reused: false };
}

export async function transitionProductionJob(input: { orderId: string; jobId: string; nextStatus: ProductionStatus; actorUserId: string; actorRole: StaffRole }, options: { db?: CommerceDatabase; now?: Date } = {}) {
  if (!can(input.actorRole, "production:write")) throw new Error("Staff role is not allowed to update production jobs.");
  const db = options.db ?? getDatabase(); const now = options.now ?? new Date();
  const [job] = await db.select().from(productionJobs).where(and(eq(productionJobs.id, input.jobId), eq(productionJobs.orderId, input.orderId))).limit(1); if (!job) throw new Error("Production job was not found for this order.");
  if (!transitionMap[job.status].includes(input.nextStatus as never)) throw new Error(`Production job cannot transition from ${job.status} to ${input.nextStatus}.`);
  const timestamps = input.nextStatus === "in_progress" ? { startedAt: now } : input.nextStatus === "ready_to_ship" ? { readyAt: now } : {};
  return db.transaction(async (tx) => { const [updated] = await tx.update(productionJobs).set({ status: input.nextStatus, updatedAt: now, ...timestamps }).where(eq(productionJobs.id, job.id)).returning(); await tx.insert(auditEvents).values({ actorUserId: input.actorUserId, action: "production.transition", subjectType: "production_job", subjectId: updated.id, outcome: "success", metadata: { orderId: input.orderId, from: job.status, to: input.nextStatus }, occurredAt: now }); return updated; });
}

export async function listProductionQueue(options: { db?: CommerceDatabase } = {}) { const db = options.db ?? getDatabase(); return db.select().from(productionJobs).orderBy(productionJobs.dueAt, productionJobs.createdAt); }
