import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  jsonb,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const staffRoleEnum = pgEnum("staff_role", ["owner", "manager", "fulfilment", "content", "support"]);
export const productStatusEnum = pgEnum("product_status", ["draft", "review_required", "active", "scheduled", "sold_out", "archived"]);
export const productTypeEnum = pgEnum("product_type", ["standard", "variant", "one_of_a_kind", "made_to_order", "personalised", "measurement_based", "pre_order", "gift"]);
export const inventoryModeEnum = pgEnum("inventory_mode", ["tracked", "one_of_a_kind", "made_to_order", "pre_order"]);
export const inventoryMovementEnum = pgEnum("inventory_movement_type", ["initial", "adjustment", "reservation", "release", "sale", "return", "restock", "damage"]);
export const customisationFieldTypeEnum = pgEnum("customisation_field_type", ["short_text", "long_text", "select", "measurement", "file", "gift_message"]);
export const mediaKindEnum = pgEnum("media_kind", ["image", "video"]);

// Better Auth-compatible identity tables. These stay intentionally separate from
// commerce data so customer identities and staff authorisation can evolve safely.
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_idx").on(table.userId)],
);

export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("account_user_idx").on(table.userId)],
);

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const twoFactor = pgTable(
  "two_factor",
  {
    id: text("id").primaryKey(),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("two_factor_user_idx").on(table.userId)],
);

export const staffProfiles = pgTable(
  "staff_profile",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
    role: staffRoleEnum("role").notNull(),
    active: boolean("active").notNull().default(true),
    invitedAt: timestamp("invited_at", { withTimezone: true }),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("staff_profile_role_idx").on(table.role)],
);

export const auditEvents = pgTable(
  "audit_event",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    subjectType: text("subject_type").notNull(),
    subjectId: text("subject_id"),
    outcome: text("outcome").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_event_actor_idx").on(table.actorUserId), index("audit_event_action_idx").on(table.action)],
);

export const collections = pgTable(
  "collection",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    description: text("description"),
    status: productStatusEnum("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("collection_status_idx").on(table.status)],
);

export const products = pgTable(
  "product",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    productType: productTypeEnum("product_type").notNull(),
    status: productStatusEnum("status").notNull().default("draft"),
    shortDescription: text("short_description"),
    description: text("description"),
    materialSummary: text("material_summary"),
    careInstructions: text("care_instructions"),
    variationNotice: text("variation_notice"),
    basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
    compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    inventoryMode: inventoryModeEnum("inventory_mode").notNull().default("tracked"),
    leadTimeMinDays: integer("lead_time_min_days"),
    leadTimeMaxDays: integer("lead_time_max_days"),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(2),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("product_base_price_nonnegative", sql`${table.basePrice} >= 0`),
    check("product_compare_price_nonnegative", sql`${table.compareAtPrice} IS NULL OR ${table.compareAtPrice} >= 0`),
    check("product_lead_time_range", sql`${table.leadTimeMinDays} IS NULL OR ${table.leadTimeMaxDays} IS NULL OR ${table.leadTimeMinDays} <= ${table.leadTimeMaxDays}`),
    index("product_status_idx").on(table.status),
    index("product_type_idx").on(table.productType),
  ],
);

export const productCollections = pgTable(
  "product_collection",
  {
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    collectionId: uuid("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.collectionId] }),
    index("product_collection_product_idx").on(table.productId),
    index("product_collection_collection_idx").on(table.collectionId),
  ],
);

export const productOptions = pgTable(
  "product_option",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("product_option_product_idx").on(table.productId)],
);

export const productOptionValues = pgTable(
  "product_option_value",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    optionId: uuid("option_id").notNull().references(() => productOptions.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("product_option_value_option_idx").on(table.optionId)],
);

export const productVariants = pgTable(
  "product_variant",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 96 }).notNull().unique(),
    title: text("title").notNull(),
    optionSignature: text("option_signature").notNull(),
    priceAdjustment: numeric("price_adjustment", { precision: 12, scale: 2 }).notNull().default("0"),
    active: boolean("active").notNull().default(true),
    weightGrams: integer("weight_grams"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("product_variant_product_idx").on(table.productId)],
);

export const productVariantOptionValues = pgTable(
  "product_variant_option_value",
  {
    variantId: uuid("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
    optionValueId: uuid("option_value_id").notNull().references(() => productOptionValues.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.variantId, table.optionValueId] }),
    index("variant_option_variant_idx").on(table.variantId),
    index("variant_option_value_idx").on(table.optionValueId),
  ],
);

export const productMedia = pgTable(
  "product_media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    kind: mediaKindEnum("kind").notNull().default("image"),
    storageKey: text("storage_key").notNull(),
    altText: text("alt_text"),
    focalPoint: jsonb("focal_point"),
    width: integer("width"),
    height: integer("height"),
    position: integer("position").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("product_media_product_idx").on(table.productId), index("product_media_variant_idx").on(table.variantId)],
);

export const productAttributes = pgTable(
  "product_attribute",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 80 }).notNull(),
    value: text("value").notNull(),
    filterable: boolean("filterable").notNull().default(false),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("product_attribute_product_idx").on(table.productId), index("product_attribute_filter_idx").on(table.key, table.value)],
);

export const productCustomisationFields = pgTable(
  "product_customisation_field",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    type: customisationFieldTypeEnum("type").notNull(),
    label: text("label").notNull(),
    instructions: text("instructions"),
    required: boolean("required").notNull().default(false),
    validation: jsonb("validation").notNull().default({}),
    priceAdjustment: numeric("price_adjustment", { precision: 12, scale: 2 }).notNull().default("0"),
    leadTimeAdjustmentDays: integer("lead_time_adjustment_days").notNull().default(0),
    position: integer("position").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("customisation_product_idx").on(table.productId), index("customisation_variant_idx").on(table.variantId)],
);

export const inventoryItems = pgTable(
  "inventory_item",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id").notNull().unique().references(() => productVariants.id, { onDelete: "cascade" }),
    mode: inventoryModeEnum("mode").notNull(),
    onHand: integer("on_hand").notNull().default(0),
    reserved: integer("reserved").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(2),
    allowBackorder: boolean("allow_backorder").notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("inventory_on_hand_nonnegative", sql`${table.onHand} >= 0`),
    check("inventory_reserved_nonnegative", sql`${table.reserved} >= 0`),
    check("inventory_reservation_limit", sql`${table.allowBackorder} OR ${table.reserved} <= ${table.onHand}`),
    check("inventory_one_of_a_kind_limit", sql`${table.mode} <> 'one_of_a_kind' OR ${table.onHand} <= 1`),
    check("inventory_threshold_nonnegative", sql`${table.lowStockThreshold} >= 0`),
    index("inventory_mode_idx").on(table.mode),
  ],
);

export const inventoryMovements = pgTable(
  "inventory_movement",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    inventoryItemId: uuid("inventory_item_id").notNull().references(() => inventoryItems.id, { onDelete: "cascade" }),
    type: inventoryMovementEnum("type").notNull(),
    quantityDelta: integer("quantity_delta").notNull(),
    reason: text("reason").notNull(),
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("inventory_movement_item_idx").on(table.inventoryItemId), index("inventory_movement_actor_idx").on(table.actorUserId)],
);

export const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
  twoFactor,
};
