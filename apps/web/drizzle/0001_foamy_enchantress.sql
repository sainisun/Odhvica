CREATE TYPE "public"."customisation_field_type" AS ENUM('short_text', 'long_text', 'select', 'measurement', 'file', 'gift_message');--> statement-breakpoint
CREATE TYPE "public"."inventory_mode" AS ENUM('tracked', 'one_of_a_kind', 'made_to_order', 'pre_order');--> statement-breakpoint
CREATE TYPE "public"."inventory_movement_type" AS ENUM('initial', 'adjustment', 'reservation', 'release', 'sale', 'return', 'restock', 'damage');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'review_required', 'active', 'scheduled', 'sold_out', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('standard', 'variant', 'one_of_a_kind', 'made_to_order', 'personalised', 'measurement_based', 'pre_order', 'gift');--> statement-breakpoint
CREATE TABLE "collection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(160) NOT NULL,
	"description" text,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collection_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "inventory_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"mode" "inventory_mode" NOT NULL,
	"on_hand" integer DEFAULT 0 NOT NULL,
	"reserved" integer DEFAULT 0 NOT NULL,
	"low_stock_threshold" integer DEFAULT 2 NOT NULL,
	"allow_backorder" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_item_variant_id_unique" UNIQUE("variant_id"),
	CONSTRAINT "inventory_on_hand_nonnegative" CHECK ("inventory_item"."on_hand" >= 0),
	CONSTRAINT "inventory_reserved_nonnegative" CHECK ("inventory_item"."reserved" >= 0),
	CONSTRAINT "inventory_reservation_limit" CHECK ("inventory_item"."allow_backorder" OR "inventory_item"."reserved" <= "inventory_item"."on_hand"),
	CONSTRAINT "inventory_one_of_a_kind_limit" CHECK ("inventory_item"."mode" <> 'one_of_a_kind' OR "inventory_item"."on_hand" <= 1),
	CONSTRAINT "inventory_threshold_nonnegative" CHECK ("inventory_item"."low_stock_threshold" >= 0)
);
--> statement-breakpoint
CREATE TABLE "inventory_movement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_item_id" uuid NOT NULL,
	"type" "inventory_movement_type" NOT NULL,
	"quantity_delta" integer NOT NULL,
	"reason" text NOT NULL,
	"reference_type" text,
	"reference_id" text,
	"actor_user_id" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_attribute" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"key" varchar(80) NOT NULL,
	"value" text NOT NULL,
	"filterable" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_collection" (
	"product_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "product_collection_product_id_collection_id_pk" PRIMARY KEY("product_id","collection_id")
);
--> statement-breakpoint
CREATE TABLE "product_customisation_field" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"type" "customisation_field_type" NOT NULL,
	"label" text NOT NULL,
	"instructions" text,
	"required" boolean DEFAULT false NOT NULL,
	"validation" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"price_adjustment" numeric(12, 2) DEFAULT '0' NOT NULL,
	"lead_time_adjustment_days" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"kind" "media_kind" DEFAULT 'image' NOT NULL,
	"storage_key" text NOT NULL,
	"alt_text" text,
	"focal_point" jsonb,
	"width" integer,
	"height" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_option_value" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"option_id" uuid NOT NULL,
	"value" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_option" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variant_option_value" (
	"variant_id" uuid NOT NULL,
	"option_value_id" uuid NOT NULL,
	CONSTRAINT "product_variant_option_value_variant_id_option_value_id_pk" PRIMARY KEY("variant_id","option_value_id")
);
--> statement-breakpoint
CREATE TABLE "product_variant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" varchar(96) NOT NULL,
	"title" text NOT NULL,
	"option_signature" text NOT NULL,
	"price_adjustment" numeric(12, 2) DEFAULT '0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"weight_grams" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variant_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(180) NOT NULL,
	"product_type" "product_type" NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"short_description" text,
	"description" text,
	"material_summary" text,
	"care_instructions" text,
	"variation_notice" text,
	"base_price" numeric(12, 2) NOT NULL,
	"compare_at_price" numeric(12, 2),
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"inventory_mode" "inventory_mode" DEFAULT 'tracked' NOT NULL,
	"lead_time_min_days" integer,
	"lead_time_max_days" integer,
	"low_stock_threshold" integer DEFAULT 2 NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_slug_unique" UNIQUE("slug"),
	CONSTRAINT "product_base_price_nonnegative" CHECK ("product"."base_price" >= 0),
	CONSTRAINT "product_compare_price_nonnegative" CHECK ("product"."compare_at_price" IS NULL OR "product"."compare_at_price" >= 0),
	CONSTRAINT "product_lead_time_range" CHECK ("product"."lead_time_min_days" IS NULL OR "product"."lead_time_max_days" IS NULL OR "product"."lead_time_min_days" <= "product"."lead_time_max_days")
);
--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_inventory_item_id_inventory_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute" ADD CONSTRAINT "product_attribute_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_collection" ADD CONSTRAINT "product_collection_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_collection" ADD CONSTRAINT "product_collection_collection_id_collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_customisation_field" ADD CONSTRAINT "product_customisation_field_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_customisation_field" ADD CONSTRAINT "product_customisation_field_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_option_value" ADD CONSTRAINT "product_option_value_option_id_product_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."product_option"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_option" ADD CONSTRAINT "product_option_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_option_value" ADD CONSTRAINT "product_variant_option_value_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_option_value" ADD CONSTRAINT "product_variant_option_value_option_value_id_product_option_value_id_fk" FOREIGN KEY ("option_value_id") REFERENCES "public"."product_option_value"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collection_status_idx" ON "collection" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inventory_mode_idx" ON "inventory_item" USING btree ("mode");--> statement-breakpoint
CREATE INDEX "inventory_movement_item_idx" ON "inventory_movement" USING btree ("inventory_item_id");--> statement-breakpoint
CREATE INDEX "inventory_movement_actor_idx" ON "inventory_movement" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "product_attribute_product_idx" ON "product_attribute" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_attribute_filter_idx" ON "product_attribute" USING btree ("key","value");--> statement-breakpoint
CREATE INDEX "product_collection_product_idx" ON "product_collection" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_collection_collection_idx" ON "product_collection" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "customisation_product_idx" ON "product_customisation_field" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "customisation_variant_idx" ON "product_customisation_field" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "product_media_product_idx" ON "product_media" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_media_variant_idx" ON "product_media" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "product_option_value_option_idx" ON "product_option_value" USING btree ("option_id");--> statement-breakpoint
CREATE INDEX "product_option_product_idx" ON "product_option" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "variant_option_variant_idx" ON "product_variant_option_value" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "variant_option_value_idx" ON "product_variant_option_value" USING btree ("option_value_id");--> statement-breakpoint
CREATE INDEX "product_variant_product_idx" ON "product_variant" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_status_idx" ON "product" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_type_idx" ON "product" USING btree ("product_type");