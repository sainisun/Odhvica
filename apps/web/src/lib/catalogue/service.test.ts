import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { getDatabase } from "@/lib/db";
import { auditEvents, inventoryItems, inventoryMovements, products } from "@/lib/db/schema";
import { adjustInventoryAtomically, createCatalogueDraft, InventoryConflictError } from "./service";

const manager = { userId: "staff-manager", role: "manager" as const, requiresFreshStepUp: false };
const contentEditor = { userId: "staff-content", role: "content" as const, requiresFreshStepUp: false };
const supportAgent = { userId: "staff-support", role: "support" as const, requiresFreshStepUp: false };
type ServiceDatabase = ReturnType<typeof getDatabase>;

async function createTestDatabase() {
  const client = new PGlite();
  const db = drizzle({ client, schema: { auditEvents, inventoryItems, inventoryMovements, products } });

  await client.exec(`
    CREATE TABLE product (
      id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, title text NOT NULL, slug varchar(180) UNIQUE NOT NULL,
      product_type text NOT NULL, status text NOT NULL DEFAULT 'draft', short_description text, description text,
      material_summary text, care_instructions text, variation_notice text, base_price numeric(12,2) NOT NULL,
      compare_at_price numeric(12,2), currency varchar(3) NOT NULL DEFAULT 'INR', inventory_mode text NOT NULL,
      lead_time_min_days integer, lead_time_max_days integer, low_stock_threshold integer NOT NULL DEFAULT 2,
      seo_title text, seo_description text, published_at timestamptz, archived_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE inventory_item (
      id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, variant_id uuid UNIQUE NOT NULL, mode text NOT NULL,
      on_hand integer NOT NULL DEFAULT 0, reserved integer NOT NULL DEFAULT 0, low_stock_threshold integer NOT NULL DEFAULT 2,
      allow_backorder boolean NOT NULL DEFAULT false, version integer NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE inventory_movement (
      id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, inventory_item_id uuid NOT NULL, type text NOT NULL,
      quantity_delta integer NOT NULL, reason text NOT NULL, reference_type text, reference_id text,
      actor_user_id text, occurred_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE audit_event (
      id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, actor_user_id text, action text NOT NULL,
      subject_type text NOT NULL, subject_id text, outcome text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
      occurred_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  return { db, serviceDb: db as unknown as ServiceDatabase, client };
}

describe("catalogue and atomic inventory services", () => {
  const clients: PGlite[] = [];

  afterEach(async () => {
    await Promise.all(clients.splice(0).map((client) => client.close()));
  });

  it("persists a permitted content-editor catalogue draft and audit event", async () => {
    const { db, serviceDb, client } = await createTestDatabase();
    clients.push(client);

    const product = await createCatalogueDraft(
      {
        title: "Hand-Quilted Kantha Jacket",
        slug: "hand-quilted-kantha-jacket",
        productType: "made_to_order",
        inventoryMode: "made_to_order",
        basePrice: 9200,
        currency: "inr",
        leadTimeMinDays: 7,
        leadTimeMaxDays: 14,
      },
      { db: serviceDb, access: contentEditor },
    );

    const events = await db.select().from(auditEvents);
    expect(product.slug).toBe("hand-quilted-kantha-jacket");
    expect(events).toHaveLength(1);
    expect(events[0]?.action).toBe("catalogue.product.created");
  });

  it("rejects catalogue writes for support staff before persistence", async () => {
    const { db, serviceDb, client } = await createTestDatabase();
    clients.push(client);

    await expect(
      createCatalogueDraft(
        {
          title: "Hand-Quilted Kantha Jacket",
          slug: "restricted-kantha-jacket",
          productType: "standard",
          inventoryMode: "tracked",
          basePrice: 9200,
          currency: "INR",
        },
        { db: serviceDb, access: supportAgent },
      ),
    ).rejects.toThrow("cannot write catalogue");

    expect(await db.select().from(products)).toHaveLength(0);
  });

  it("rejects a stale competing inventory adjustment and persists only one movement", async () => {
    const { db, serviceDb, client } = await createTestDatabase();
    clients.push(client);
    const itemId = randomUUID();
    await db.insert(inventoryItems).values({ id: itemId, variantId: randomUUID(), mode: "tracked", onHand: 2, reserved: 0, version: 0 });

    const first = await adjustInventoryAtomically({ inventoryItemId: itemId, expectedVersion: 0, quantityDelta: -1, reason: "stock count" }, { db: serviceDb, access: manager });
    expect(first.onHand).toBe(1);
    expect(first.version).toBe(1);

    await expect(
      adjustInventoryAtomically({ inventoryItemId: itemId, expectedVersion: 0, quantityDelta: -1, reason: "stale update" }, { db: serviceDb, access: manager }),
    ).rejects.toBeInstanceOf(InventoryConflictError);

    expect(await db.select().from(inventoryMovements)).toHaveLength(1);
    expect(await db.select().from(auditEvents)).toHaveLength(1);
  });

  it("rejects a stock reduction below existing reserved quantity inside the conditional update", async () => {
    const { db, serviceDb, client } = await createTestDatabase();
    clients.push(client);
    const itemId = randomUUID();
    await db.insert(inventoryItems).values({ id: itemId, variantId: randomUUID(), mode: "tracked", onHand: 1, reserved: 1, version: 0 });

    await expect(
      adjustInventoryAtomically({ inventoryItemId: itemId, expectedVersion: 0, quantityDelta: -1, reason: "damage" }, { db: serviceDb, access: manager }),
    ).rejects.toBeInstanceOf(InventoryConflictError);

    const [unchanged] = await db.select().from(inventoryItems);
    expect(unchanged?.onHand).toBe(1);
    expect(await db.select().from(inventoryMovements)).toHaveLength(0);
  });
});
