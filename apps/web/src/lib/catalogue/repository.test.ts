import { afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { getDatabase } from "@/lib/db";
import { collections, productCollections, productCustomisationFields, productMedia, productVariants, products } from "@/lib/db/schema";
import { findPublishedProduct, listPublishedCollection, listPublishedProducts } from "./repository";

type CatalogueDatabase = ReturnType<typeof getDatabase>;

async function makeDatabase() {
  const client = new PGlite();
  const db = drizzle({ client, schema: { collections, productCollections, productCustomisationFields, productMedia, productVariants, products } });
  await client.exec(`
    CREATE TABLE product (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, title text NOT NULL, slug varchar(180) UNIQUE NOT NULL, product_type text NOT NULL, status text NOT NULL DEFAULT 'draft', short_description text, description text, material_summary text, care_instructions text, variation_notice text, base_price numeric(12,2) NOT NULL, compare_at_price numeric(12,2), currency varchar(3) NOT NULL DEFAULT 'INR', inventory_mode text NOT NULL, lead_time_min_days integer, lead_time_max_days integer, low_stock_threshold integer NOT NULL DEFAULT 2, seo_title text, seo_description text, published_at timestamptz, archived_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE collection (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, title text NOT NULL, slug varchar(160) UNIQUE NOT NULL, description text, status text NOT NULL DEFAULT 'draft', sort_order integer NOT NULL DEFAULT 0, seo_title text, seo_description text, published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE product_collection (product_id uuid NOT NULL, collection_id uuid NOT NULL, sort_order integer NOT NULL DEFAULT 0);
    CREATE TABLE product_variant (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, product_id uuid NOT NULL, sku varchar(96) UNIQUE NOT NULL, title text NOT NULL, option_signature text NOT NULL, price_adjustment numeric(12,2) NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, weight_grams integer, position integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE product_media (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, product_id uuid NOT NULL, variant_id uuid, kind text NOT NULL DEFAULT 'image', storage_key text NOT NULL, alt_text text, focal_point jsonb, width integer, height integer, position integer NOT NULL DEFAULT 0, is_primary boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE product_customisation_field (id uuid PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text)::uuid, product_id uuid NOT NULL, variant_id uuid, type text NOT NULL, label text NOT NULL, instructions text, required boolean NOT NULL DEFAULT false, validation jsonb NOT NULL DEFAULT '{}'::jsonb, price_adjustment numeric(12,2) NOT NULL DEFAULT 0, lead_time_adjustment_days integer NOT NULL DEFAULT 0, position integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
  `);
  return { db, client, repositoryDb: db as unknown as CatalogueDatabase };
}

describe("persisted public catalogue repository", () => {
  const clients: PGlite[] = [];
  afterEach(async () => { await Promise.all(clients.splice(0).map((client) => client.close())); });

  it("exposes only active products with persisted variants, media and customisation state", async () => {
    const { db, client, repositoryDb } = await makeDatabase(); clients.push(client);
    const [active] = await db.insert(products).values({ title: "Active Jacket", slug: "active-jacket", productType: "made_to_order", status: "active", basePrice: "9200", inventoryMode: "made_to_order", materialSummary: "Kantha cotton", careInstructions: "Hand wash", leadTimeMinDays: 7, leadTimeMaxDays: 14 }).returning();
    await db.insert(products).values({ title: "Draft Jacket", slug: "draft-jacket", productType: "standard", status: "draft", basePrice: "100", inventoryMode: "tracked" });
    await db.insert(productVariants).values([{ productId: active.id, sku: "ACTIVE-S", title: "S", optionSignature: "Size=S", position: 0 }, { productId: active.id, sku: "ACTIVE-M", title: "M", optionSignature: "Size=M", position: 1 }]);
    await db.insert(productMedia).values({ productId: active.id, storageKey: "/manus-storage/active-jacket.jpg", altText: "Active jacket", isPrimary: true });
    await db.insert(productCustomisationFields).values({ productId: active.id, type: "measurement", label: "Preferred sleeve length", required: true });

    const published = await listPublishedProducts({ db: repositoryDb });
    expect(published).toHaveLength(1);
    expect(published[0]).toMatchObject({ slug: "active-jacket", databaseBacked: true, image: "/manus-storage/active-jacket.jpg", sizes: ["S", "M"] });
    expect(published[0]?.variantOptions).toHaveLength(2);
    expect(published[0]?.customisation).toContain("Preferred sleeve length");
    expect(await findPublishedProduct("draft-jacket", { db: repositoryDb })).toBeUndefined();
  });

  it("filters a persisted active catalogue by collection slug", async () => {
    const { db, client, repositoryDb } = await makeDatabase(); clients.push(client);
    const [jackets] = await db.insert(collections).values({ title: "Jackets", slug: "jackets", status: "active" }).returning();
    const [bags] = await db.insert(collections).values({ title: "Bags", slug: "bags", status: "active" }).returning();
    const [jacket] = await db.insert(products).values({ title: "Jacket", slug: "jacket", productType: "standard", status: "active", basePrice: "100", inventoryMode: "tracked" }).returning();
    const [bag] = await db.insert(products).values({ title: "Bag", slug: "bag", productType: "standard", status: "active", basePrice: "100", inventoryMode: "tracked" }).returning();
    await db.insert(productCollections).values([{ productId: jacket.id, collectionId: jackets.id }, { productId: bag.id, collectionId: bags.id }]);
    const result = await listPublishedCollection("jackets", { db: repositoryDb });
    expect(result.map((product) => product.slug)).toEqual(["jacket"]);
  });
});
