import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { getDatabase } from "@/lib/db";
import { trackingUpdates } from "@/lib/db/schema";
import { recordSandboxTrackingUpdate } from "./service";

type CommerceDatabase = ReturnType<typeof getDatabase>;
async function createTrackingDatabase() { const client = new PGlite(); const db = drizzle({ client, schema: { trackingUpdates } }); await client.exec(`CREATE TABLE tracking_update (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, order_id uuid NOT NULL, carrier varchar(120) NOT NULL, tracking_number varchar(180) NOT NULL, status text NOT NULL, provider_event_id varchar(180) NOT NULL UNIQUE, payload_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, occurred_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now());`); return { db, serviceDb: db as unknown as CommerceDatabase, client }; }

describe("sandbox tracking service", () => { const clients: PGlite[] = []; afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); }); it("persists a provider event exactly once without network delivery", async () => { const { db, serviceDb, client } = await createTrackingDatabase(); clients.push(client); const input = { orderId: "00000000-0000-4000-8000-000000000001", carrier: "Sandbox Carrier", trackingNumber: "TRACK-001", status: "shipped" as const, providerEventId: "sandbox-carrier-event-001" }; const first = await recordSandboxTrackingUpdate(input, { db: serviceDb }); const repeated = await recordSandboxTrackingUpdate(input, { db: serviceDb }); expect(first.reused).toBe(false); expect(repeated.reused).toBe(true); expect(await db.select().from(trackingUpdates)).toHaveLength(1); }); });
