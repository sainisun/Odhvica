import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { getDatabase } from "@/lib/db";
import { wishlistItems } from "@/lib/db/schema";
import { listWishlistItems, toggleWishlistItem } from "./service";

type CommerceDatabase = ReturnType<typeof getDatabase>;
async function createWishlistDatabase() { const client = new PGlite(); const db = drizzle({ client, schema: { wishlistItems } }); await client.exec(`CREATE TABLE wishlist_item (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, user_id text, guest_token varchar(160), product_id uuid NOT NULL, variant_id uuid, created_at timestamptz NOT NULL DEFAULT now());`); return { db, serviceDb: db as unknown as CommerceDatabase, client }; }

describe("wishlist service", () => {
  const clients: PGlite[] = []; afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); });
  it("toggles one owner-scoped product save without duplicate lines", async () => {
    const { db, serviceDb, client } = await createWishlistDatabase(); clients.push(client); const input = { userId: "customer-1", productId: "00000000-0000-4000-8000-000000000001" };
    expect((await toggleWishlistItem(input, { db: serviceDb })).saved).toBe(true); expect(await listWishlistItems({ userId: "customer-1" }, { db: serviceDb })).toHaveLength(1);
    expect((await toggleWishlistItem(input, { db: serviceDb })).saved).toBe(false); expect(await db.select().from(wishlistItems)).toHaveLength(0);
  });
  it("keeps guest saves separate from authenticated customer saves", async () => {
    const { serviceDb, client } = await createWishlistDatabase(); clients.push(client); const productId = "00000000-0000-4000-8000-000000000002";
    await toggleWishlistItem({ guestToken: "guest-session-token-0001", productId }, { db: serviceDb }); await toggleWishlistItem({ userId: "customer-1", productId }, { db: serviceDb });
    expect(await listWishlistItems({ guestToken: "guest-session-token-0001" }, { db: serviceDb })).toHaveLength(1); expect(await listWishlistItems({ userId: "customer-1" }, { db: serviceDb })).toHaveLength(1);
  });
});
