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
export const cartStatusEnum = pgEnum("cart_status", ["active", "checkout_started", "abandoned", "expired", "converted"]);
export const checkoutStatusEnum = pgEnum("checkout_status", ["started", "awaiting_payment", "payment_processing", "completed", "failed", "expired"]);
export const paymentProviderEnum = pgEnum("payment_provider", ["razorpay", "stripe", "paypal"]);
export const paymentStatusEnum = pgEnum("payment_status", ["not_required", "pending", "authorised", "paid", "failed", "cancelled", "partially_refunded", "refunded", "disputed"]);
export const orderStatusEnum = pgEnum("order_status", ["draft", "pending_confirmation", "confirmed", "cancelled", "completed", "archived"]);
export const fulfilmentStatusEnum = pgEnum("fulfilment_status", ["unfulfilled", "review_required", "in_production", "ready_to_ship", "partially_fulfilled", "fulfilled", "shipped", "delivered", "returned"]);
export const postPurchaseStatusEnum = pgEnum("post_purchase_status", ["none", "cancellation_requested", "return_requested", "exchange_requested", "refund_under_review", "resolved"]);
export const promotionTypeEnum = pgEnum("promotion_type", ["percentage", "fixed_amount", "free_shipping"]);
export const returnStatusEnum = pgEnum("return_status", ["requested", "approved", "received", "rejected", "resolved"]);
export const refundStatusEnum = pgEnum("refund_status", ["requested", "approved", "processing", "completed", "failed", "cancelled"]);
export const notificationChannelEnum = pgEnum("notification_channel", ["email"]);
export const notificationClassEnum = pgEnum("notification_class", ["transactional", "operational", "marketing"]);
export const notificationEventEnum = pgEnum("notification_event", ["order_confirmed", "payment_failed", "fulfilment_updated", "refund_approved", "staff_alert"]);
export const notificationStatusEnum = pgEnum("notification_status", ["queued", "sandbox_delivered", "failed", "suppressed"]);
export const notificationAttemptOutcomeEnum = pgEnum("notification_attempt_outcome", ["sandbox_delivered", "failed", "suppressed"]);
export const privacyRequestTypeEnum = pgEnum("privacy_request_type", ["access", "erasure", "correction"]);
export const privacyRequestStatusEnum = pgEnum("privacy_request_status", ["requested", "in_review", "completed", "rejected"]);
export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "rejected"]);
export const productionStatusEnum = pgEnum("production_status", ["queued", "in_progress", "quality_review", "ready_to_ship", "cancelled"]);
export const editorialContentTypeEnum = pgEnum("editorial_content_type", ["article", "lookbook"]);
export const editorialStatusEnum = pgEnum("editorial_status", ["draft", "published", "archived"]);

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
    version: integer("version").notNull().default(0),
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

export const customerAddresses = pgTable(
  "customer_address",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 80 }),
    recipientName: text("recipient_name").notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    line1: text("line_1").notNull(),
    line2: text("line_2"),
    city: varchar("city", { length: 120 }).notNull(),
    region: varchar("region", { length: 120 }),
    postalCode: varchar("postal_code", { length: 32 }).notNull(),
    countryCode: varchar("country_code", { length: 2 }).notNull(),
    taxId: varchar("tax_id", { length: 32 }),
    defaultShipping: boolean("default_shipping").notNull().default(false),
    defaultBilling: boolean("default_billing").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("customer_address_user_idx").on(table.userId), index("customer_address_country_idx").on(table.countryCode)],
);

export const carts = pgTable(
  "cart",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    sessionToken: varchar("session_token", { length: 160 }).unique(),
    email: varchar("email", { length: 320 }),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    deliveryCountry: varchar("delivery_country", { length: 2 }),
    status: cartStatusEnum("status").notNull().default("active"),
    promotionCode: varchar("promotion_code", { length: 80 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("cart_user_idx").on(table.userId), index("cart_status_idx").on(table.status)],
);

export const cartItems = pgTable(
  "cart_item",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
    variantId: uuid("variant_id").notNull().references(() => productVariants.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    customisation: jsonb("customisation").notNull().default({}),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("cart_item_quantity_positive", sql`${table.quantity} > 0`), index("cart_item_cart_idx").on(table.cartId), index("cart_item_variant_idx").on(table.variantId)],
);

export const promotions = pgTable(
  "promotion",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 80 }).notNull().unique(),
    type: promotionTypeEnum("type").notNull(),
    value: numeric("value", { precision: 12, scale: 2 }).notNull().default("0"),
    minimumSubtotal: numeric("minimum_subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
    currency: varchar("currency", { length: 3 }),
    active: boolean("active").notNull().default(true),
    stackable: boolean("stackable").notNull().default(false),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("promotion_value_nonnegative", sql`${table.value} >= 0`), index("promotion_active_idx").on(table.active)],
);

export const checkoutAttempts = pgTable(
  "checkout_attempt",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "restrict" }),
    idempotencyKey: varchar("idempotency_key", { length: 128 }).notNull().unique(),
    status: checkoutStatusEnum("status").notNull().default("started"),
    deliveryAddress: jsonb("delivery_address").notNull(),
    billingAddress: jsonb("billing_address"),
    shippingMethod: jsonb("shipping_method").notNull(),
    pricingSnapshot: jsonb("pricing_snapshot").notNull(),
    routingSnapshot: jsonb("routing_snapshot").notNull(),
    selectedProvider: paymentProviderEnum("selected_provider"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("checkout_attempt_cart_idx").on(table.cartId), index("checkout_attempt_status_idx").on(table.status)],
);

export const orders = pgTable(
  "order",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    checkoutAttemptId: uuid("checkout_attempt_id").unique().references(() => checkoutAttempts.id, { onDelete: "set null" }),
    email: varchar("email", { length: 320 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    orderStatus: orderStatusEnum("order_status").notNull().default("pending_confirmation"),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
    fulfilmentStatus: fulfilmentStatusEnum("fulfilment_status").notNull().default("unfulfilled"),
    postPurchaseStatus: postPurchaseStatusEnum("post_purchase_status").notNull().default("none"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    discountTotal: numeric("discount_total", { precision: 12, scale: 2 }).notNull().default("0"),
    shippingTotal: numeric("shipping_total", { precision: 12, scale: 2 }).notNull().default("0"),
    taxTotal: numeric("tax_total", { precision: 12, scale: 2 }).notNull().default("0"),
    grandTotal: numeric("grand_total", { precision: 12, scale: 2 }).notNull(),
    taxSnapshot: jsonb("tax_snapshot").notNull().default({}),
    deliveryAddress: jsonb("delivery_address").notNull(),
    billingAddress: jsonb("billing_address"),
    shippingSnapshot: jsonb("shipping_snapshot").notNull(),
    promotionSnapshot: jsonb("promotion_snapshot").notNull().default({}),
    notes: text("notes"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("order_total_nonnegative", sql`${table.grandTotal} >= 0`), index("order_user_idx").on(table.userId), index("order_status_idx").on(table.orderStatus), index("order_payment_status_idx").on(table.paymentStatus)],
);

export const orderItems = pgTable(
  "order_item",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    productSnapshot: jsonb("product_snapshot").notNull(),
    customisationSnapshot: jsonb("customisation_snapshot").notNull().default({}),
    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    discountTotal: numeric("discount_total", { precision: 12, scale: 2 }).notNull().default("0"),
    taxSnapshot: jsonb("tax_snapshot").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("order_item_quantity_positive", sql`${table.quantity} > 0`), index("order_item_order_idx").on(table.orderId)],
);

export const payments = pgTable(
  "payment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    checkoutAttemptId: uuid("checkout_attempt_id").references(() => checkoutAttempts.id, { onDelete: "set null" }),
    provider: paymentProviderEnum("provider").notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    providerPaymentId: varchar("provider_payment_id", { length: 180 }),
    providerReference: varchar("provider_reference", { length: 180 }),
    idempotencyKey: varchar("idempotency_key", { length: 128 }).notNull().unique(),
    providerPayload: jsonb("provider_payload").notNull().default({}),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    failedAt: timestamp("failed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("payment_amount_nonnegative", sql`${table.amount} >= 0`), index("payment_order_idx").on(table.orderId), index("payment_status_idx").on(table.status)],
);

export const fulfilmentEvents = pgTable(
  "fulfilment_event",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    status: fulfilmentStatusEnum("status").notNull(),
    trackingNumber: varchar("tracking_number", { length: 180 }),
    carrier: varchar("carrier", { length: 120 }),
    note: text("note"),
    actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("fulfilment_event_order_idx").on(table.orderId)],
);

export const returnRequests = pgTable(
  "return_request",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    orderItemId: uuid("order_item_id").references(() => orderItems.id, { onDelete: "set null" }),
    type: postPurchaseStatusEnum("type").notNull(),
    status: returnStatusEnum("status").notNull().default("requested"),
    reason: text("reason").notNull(),
    customerNote: text("customer_note"),
    resolutionNote: text("resolution_note"),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [index("return_request_order_idx").on(table.orderId), index("return_request_status_idx").on(table.status)],
);

export const refunds = pgTable(
  "refund",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    paymentId: uuid("payment_id").notNull().references(() => payments.id, { onDelete: "restrict" }),
    status: refundStatusEnum("status").notNull().default("requested"),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    reason: text("reason").notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 128 }).notNull().unique(),
    providerRefundId: varchar("provider_refund_id", { length: 180 }),
    providerPayload: jsonb("provider_payload").notNull().default({}),
    requestSnapshot: jsonb("request_snapshot").notNull().default({}),
    requestedByUserId: text("requested_by_user_id").references(() => users.id, { onDelete: "set null" }),
    approvedByUserId: text("approved_by_user_id").references(() => users.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("refund_amount_positive", sql`${table.amount} > 0`), index("refund_order_idx").on(table.orderId), index("refund_payment_idx").on(table.paymentId), index("refund_status_idx").on(table.status)],
);

export const notificationPreferences = pgTable(
  "notification_preference",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 320 }).notNull(),
    operationalEmail: boolean("operational_email").notNull().default(true),
    marketingEmail: boolean("marketing_email").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("notification_preference_user_idx").on(table.userId), index("notification_preference_email_idx").on(table.email)],
);

export const notifications = pgTable(
  "notification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    channel: notificationChannelEnum("channel").notNull().default("email"),
    deliveryClass: notificationClassEnum("delivery_class").notNull(),
    event: notificationEventEnum("event").notNull(),
    status: notificationStatusEnum("status").notNull().default("queued"),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    recipientEmail: varchar("recipient_email", { length: 320 }).notNull(),
    maskedRecipient: varchar("masked_recipient", { length: 320 }).notNull(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "set null" }),
    refundId: uuid("refund_id").references(() => refunds.id, { onDelete: "set null" }),
    idempotencyKey: varchar("idempotency_key", { length: 128 }).notNull().unique(),
    payloadSnapshot: jsonb("payload_snapshot").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("notification_status_idx").on(table.status), index("notification_order_idx").on(table.orderId), index("notification_recipient_idx").on(table.recipientEmail)],
);

export const notificationDeliveryAttempts = pgTable(
  "notification_delivery_attempt",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    notificationId: uuid("notification_id").notNull().references(() => notifications.id, { onDelete: "cascade" }),
    outcome: notificationAttemptOutcomeEnum("outcome").notNull(),
    provider: varchar("provider", { length: 48 }).notNull().default("sandbox"),
    providerMessageId: varchar("provider_message_id", { length: 180 }),
    maskedRecipient: varchar("masked_recipient", { length: 320 }).notNull(),
    errorCode: varchar("error_code", { length: 80 }),
    attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("notification_delivery_notification_idx").on(table.notificationId)],
);

export const privacyRequests = pgTable(
  "privacy_request",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: privacyRequestTypeEnum("type").notNull(),
    status: privacyRequestStatusEnum("status").notNull().default("requested"),
    requesterEmailSnapshot: varchar("requester_email_snapshot", { length: 320 }).notNull(),
    details: text("details"),
    idempotencyKey: varchar("idempotency_key", { length: 128 }).notNull().unique(),
    resolutionNote: text("resolution_note"),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [index("privacy_request_user_idx").on(table.userId), index("privacy_request_status_idx").on(table.status)],
);

export const wishlistItems = pgTable(
  "wishlist_item",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    guestToken: varchar("guest_token", { length: 160 }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("wishlist_owner_required", sql`${table.userId} IS NOT NULL OR ${table.guestToken} IS NOT NULL`), index("wishlist_user_idx").on(table.userId), index("wishlist_guest_idx").on(table.guestToken), index("wishlist_product_idx").on(table.productId)],
);

export const productReviews = pgTable(
  "product_review",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    orderItemId: uuid("order_item_id").notNull().unique().references(() => orderItems.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 120 }),
    body: text("body").notNull(),
    status: reviewStatusEnum("status").notNull().default("pending"),
    moderationNote: text("moderation_note"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    moderatedAt: timestamp("moderated_at", { withTimezone: true }),
    moderatedByUserId: text("moderated_by_user_id").references(() => users.id, { onDelete: "set null" }),
  },
  (table) => [check("product_review_rating_range", sql`${table.rating} >= 1 AND ${table.rating} <= 5`), index("product_review_product_status_idx").on(table.productId, table.status), index("product_review_user_idx").on(table.userId)],
);

export const productionJobs = pgTable(
  "production_job",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    orderItemId: uuid("order_item_id").notNull().unique().references(() => orderItems.id, { onDelete: "cascade" }),
    status: productionStatusEnum("status").notNull().default("queued"),
    leadTimeMinDays: integer("lead_time_min_days"),
    leadTimeMaxDays: integer("lead_time_max_days"),
    dueAt: timestamp("due_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    readyAt: timestamp("ready_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("production_job_lead_time_range", sql`${table.leadTimeMinDays} IS NULL OR ${table.leadTimeMaxDays} IS NULL OR ${table.leadTimeMinDays} <= ${table.leadTimeMaxDays}`), index("production_job_status_idx").on(table.status), index("production_job_order_idx").on(table.orderId)],
);

export const trackingUpdates = pgTable(
  "tracking_update",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    carrier: varchar("carrier", { length: 120 }).notNull(),
    trackingNumber: varchar("tracking_number", { length: 180 }).notNull(),
    status: fulfilmentStatusEnum("status").notNull(),
    providerEventId: varchar("provider_event_id", { length: 180 }).notNull().unique(),
    payloadSnapshot: jsonb("payload_snapshot").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("tracking_update_order_idx").on(table.orderId), index("tracking_update_status_idx").on(table.status)],
);

export const editorialPages = pgTable(
  "editorial_page",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: editorialContentTypeEnum("type").notNull(),
    status: editorialStatusEnum("status").notNull().default("draft"),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    title: varchar("title", { length: 180 }).notNull(),
    excerpt: text("excerpt"),
    body: text("body").notNull(),
    seoTitle: varchar("seo_title", { length: 180 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    canonicalPath: varchar("canonical_path", { length: 260 }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("editorial_page_status_idx").on(table.status), index("editorial_page_type_idx").on(table.type)],
);

export const urlRedirects = pgTable(
  "url_redirect",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourcePath: varchar("source_path", { length: 260 }).notNull().unique(),
    targetPath: varchar("target_path", { length: 260 }).notNull(),
    statusCode: integer("status_code").notNull().default(301),
    active: boolean("active").notNull().default(true),
    createdByUserId: text("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("url_redirect_status_code", sql`${table.statusCode} IN (301, 302)`), index("url_redirect_active_idx").on(table.active)],
);

export const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
  twoFactor,
};
