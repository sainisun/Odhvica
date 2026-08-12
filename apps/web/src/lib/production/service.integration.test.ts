import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { getDatabase } from "@/lib/db";
import { auditEvents, productionJobs } from "@/lib/db/schema";
import { createProductionJob, listProductionQueue, transitionProductionJob } from "./service";

type CommerceDatabase = ReturnType<typeof getDatabase>;
async function createProductionDatabase() { const client = new PGlite(); const db = drizzle({ client, schema: { auditEvents, productionJobs } }); await client.exec(`CREATE TABLE production_job (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_id uuid NOT NULL, order_item_id uuid NOT NULL UNIQUE, status text NOT NULL DEFAULT 'queued', lead_time_min_days integer, lead_time_max_days integer, due_at timestamptz, started_at timestamptz, ready_at timestamptz, notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()); CREATE TABLE audit_event (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, actor_user_id text, action text NOT NULL, subject_type text NOT NULL, subject_id text, outcome text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, occurred_at timestamptz NOT NULL DEFAULT now());`); return { db, serviceDb: db as unknown as CommerceDatabase, client }; }

describe("production queue service", () => {
  const clients: PGlite[] = []; afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); });
  it("creates one job per order item and enforces safe production transitions", async () => {
    const { db, serviceDb, client } = await createProductionDatabase(); clients.push(client); const input = { orderId: "00000000-0000-4000-8000-000000000010", orderItemId: "00000000-0000-4000-8000-000000000011", leadTimeMinDays: 7, leadTimeMaxDays: 14 };
    const created = await createProductionJob(input, { db: serviceDb }); const reused = await createProductionJob(input, { db: serviceDb }); expect(created.reused).toBe(false); expect(reused.reused).toBe(true);
    const active = await transitionProductionJob({ orderId: input.orderId, jobId: created.job.id, nextStatus: "in_progress", actorUserId: "staff-1", actorRole: "fulfilment" }, { db: serviceDb }); expect(active.status).toBe("in_progress"); expect((await db.select().from(auditEvents))[0]?.action).toBe("production.transition");
    expect(await listProductionQueue({ db: serviceDb })).toHaveLength(1);
    await expect(transitionProductionJob({ orderId: input.orderId, jobId: created.job.id, nextStatus: "ready_to_ship", actorUserId: "staff-1", actorRole: "fulfilment" }, { db: serviceDb })).rejects.toThrow("cannot transition");
    await expect(transitionProductionJob({ orderId: input.orderId, jobId: created.job.id, nextStatus: "quality_review", actorUserId: "support-1", actorRole: "support" }, { db: serviceDb })).rejects.toThrow("not allowed"); expect(await db.select().from(auditEvents)).toHaveLength(1);
  });
});
