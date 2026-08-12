import { and, asc, eq, inArray } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import {
  collections,
  productCollections,
  productCustomisationFields,
  productMedia,
  productVariants,
  products,
} from "@/lib/db/schema";
import { storefrontProducts, type StorefrontProduct } from "./storefront-data";

type CatalogueDatabase = ReturnType<typeof getDatabase>;
type CatalogueReadOptions = { db?: CatalogueDatabase };

export type PersistedProduct = StorefrontProduct & {
  id: string;
  variantOptions: Array<{ id: string; title: string; priceAdjustment: string }>;
  collectionSlugs: string[];
  databaseBacked: boolean;
};

export type CatalogueSummary = {
  totalProducts: number;
  lowStockCount: number;
  collectionCount: number;
};

const fallbackImageByType: Record<string, string> = {
  made_to_order: "/manus-storage/odhvica-product-kantha-jacket_9849a270.jpg",
  one_of_a_kind: "/manus-storage/odhvica-product-craft-detail_21e0ae0b.jpg",
  standard: "/manus-storage/odhvica-product-textile-bag_4cfd06e5.jpg",
};

function mediaUrl(storageKey?: string | null, productType?: string) {
  if (storageKey) return storageKey.startsWith("/") ? storageKey : `/media/${storageKey}`;
  return fallbackImageByType[productType ?? "standard"] ?? fallbackImageByType.standard;
}

function statusLabel(inventoryMode: string) {
  if (inventoryMode === "made_to_order") return "Made to order" as const;
  if (inventoryMode === "one_of_a_kind") return "One of one" as const;
  return "Limited run" as const;
}

function leadTime(min?: number | null, max?: number | null) {
  if (min !== null && min !== undefined && max !== null && max !== undefined) return `Dispatches in ${min}–${max} days`;
  if (min !== null && min !== undefined) return `Dispatches in ${min}+ days`;
  return "Lead time confirmed at checkout";
}

function mapProduct(
  product: typeof products.$inferSelect,
  primaryMedia: typeof productMedia.$inferSelect | undefined,
  productCollectionsForProduct: Array<{ slug: string; title: string }>,
  variants: Array<typeof productVariants.$inferSelect>,
  customisations: Array<typeof productCustomisationFields.$inferSelect>,
): PersistedProduct {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    collection: (productCollectionsForProduct[0]?.title ?? "Textile objects") as StorefrontProduct["collection"],
    price: Number(product.basePrice),
    image: mediaUrl(primaryMedia?.storageKey, product.productType),
    alt: primaryMedia?.altText ?? `${product.title} handmade product photograph`,
    status: statusLabel(product.inventoryMode),
    material: product.materialSummary ?? "Material details are shared by the maker before dispatch.",
    leadTime: leadTime(product.leadTimeMinDays, product.leadTimeMaxDays),
    description: product.description ?? product.shortDescription ?? "A handmade Odhvica piece with its own material story.",
    care: product.careInstructions ?? "Care guidance is confirmed with the final piece.",
    customisation: customisations.length ? customisations.map((field) => field.label).join(" · ") : "No customisation is required for this piece.",
    sizes: variants.map((variant) => variant.title),
    variantOptions: variants.map((variant) => ({ id: variant.id, title: variant.title, priceAdjustment: variant.priceAdjustment })),
    collectionSlugs: productCollectionsForProduct.map((collection) => collection.slug),
    databaseBacked: true,
  };
}

export async function listPublishedProducts(options: CatalogueReadOptions = {}): Promise<PersistedProduct[]> {
  if (!options.db && !process.env.DATABASE_URL) return storefrontProducts.map((product, index) => ({ ...product, id: `preview-${index}`, variantOptions: product.sizes.map((title, sizeIndex) => ({ id: `${product.slug}-${sizeIndex}`, title, priceAdjustment: "0" })), collectionSlugs: [product.collection.toLowerCase().replaceAll(" ", "-")], databaseBacked: false }));
  const db = options.db ?? getDatabase();
  const activeProducts = await db.select().from(products).where(eq(products.status, "active")).orderBy(asc(products.createdAt));
  if (!activeProducts.length) return [];
  const ids = activeProducts.map((product) => product.id);
  const [allMedia, allVariants, allCustomisations, allProductCollections] = await Promise.all([
    db.select().from(productMedia).where(inArray(productMedia.productId, ids)).orderBy(asc(productMedia.position)),
    db.select().from(productVariants).where(and(inArray(productVariants.productId, ids), eq(productVariants.active, true))).orderBy(asc(productVariants.position)),
    db.select().from(productCustomisationFields).where(and(inArray(productCustomisationFields.productId, ids), eq(productCustomisationFields.active, true))).orderBy(asc(productCustomisationFields.position)),
    db.select({ productId: productCollections.productId, slug: collections.slug, title: collections.title }).from(productCollections).innerJoin(collections, eq(productCollections.collectionId, collections.id)).where(inArray(productCollections.productId, ids)),
  ]);
  return activeProducts.map((product) => mapProduct(product, allMedia.find((media) => media.productId === product.id && media.isPrimary) ?? allMedia.find((media) => media.productId === product.id), allProductCollections.filter((collection) => collection.productId === product.id), allVariants.filter((variant) => variant.productId === product.id), allCustomisations.filter((field) => field.productId === product.id)));
}

export async function findPublishedProduct(slug: string, options: CatalogueReadOptions = {}) {
  const productsForStore = await listPublishedProducts(options);
  return productsForStore.find((product) => product.slug === slug);
}

export async function listPublishedCollection(slug: string, options: CatalogueReadOptions = {}) {
  const productsForStore = await listPublishedProducts(options);
  return productsForStore.filter((product) => product.collectionSlugs.includes(slug));
}

export async function listAdminCatalogue(): Promise<{ products: PersistedProduct[]; summary: CatalogueSummary }> {
  if (!process.env.DATABASE_URL) {
    const productList = await listPublishedProducts();
    const collectionSlugs = new Set(productList.flatMap((product) => product.collectionSlugs));
    return { products: productList, summary: { totalProducts: productList.length, lowStockCount: productList.filter((product) => product.status === "Limited run" || product.status === "One of one").length, collectionCount: collectionSlugs.size } };
  }

  const db = getDatabase();
  const allProducts = await db.select().from(products).orderBy(asc(products.createdAt));
  const ids = allProducts.map((product) => product.id);
  const [allMedia, allVariants, allCustomisations, allProductCollections] = ids.length
    ? await Promise.all([
        db.select().from(productMedia).where(inArray(productMedia.productId, ids)).orderBy(asc(productMedia.position)),
        db.select().from(productVariants).where(and(inArray(productVariants.productId, ids), eq(productVariants.active, true))).orderBy(asc(productVariants.position)),
        db.select().from(productCustomisationFields).where(and(inArray(productCustomisationFields.productId, ids), eq(productCustomisationFields.active, true))).orderBy(asc(productCustomisationFields.position)),
        db.select({ productId: productCollections.productId, slug: collections.slug, title: collections.title }).from(productCollections).innerJoin(collections, eq(productCollections.collectionId, collections.id)).where(inArray(productCollections.productId, ids)),
      ])
    : [[], [], [], []] as const;
  const productList = allProducts.map((product) => mapProduct(product, allMedia.find((media) => media.productId === product.id && media.isPrimary) ?? allMedia.find((media) => media.productId === product.id), allProductCollections.filter((collection) => collection.productId === product.id), allVariants.filter((variant) => variant.productId === product.id), allCustomisations.filter((field) => field.productId === product.id)));
  const collectionSlugs = new Set(productList.flatMap((product) => product.collectionSlugs));
  return {
    products: productList,
    summary: {
      totalProducts: productList.length,
      lowStockCount: productList.filter((product) => product.status === "Limited run" || product.status === "One of one").length,
      collectionCount: collectionSlugs.size,
    },
  };
}
