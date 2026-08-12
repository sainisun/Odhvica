CREATE TYPE "public"."production_status" AS ENUM('queued', 'in_progress', 'quality_review', 'ready_to_ship', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "product_review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(120),
	"body" text NOT NULL,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"moderation_note" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"moderated_at" timestamp with time zone,
	"moderated_by_user_id" text,
	CONSTRAINT "product_review_order_item_id_unique" UNIQUE("order_item_id"),
	CONSTRAINT "product_review_rating_range" CHECK ("product_review"."rating" >= 1 AND "product_review"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "production_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"status" "production_status" DEFAULT 'queued' NOT NULL,
	"lead_time_min_days" integer,
	"lead_time_max_days" integer,
	"due_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"ready_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "production_job_order_item_id_unique" UNIQUE("order_item_id"),
	CONSTRAINT "production_job_lead_time_range" CHECK ("production_job"."lead_time_min_days" IS NULL OR "production_job"."lead_time_max_days" IS NULL OR "production_job"."lead_time_min_days" <= "production_job"."lead_time_max_days")
);
--> statement-breakpoint
CREATE TABLE "wishlist_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_order_item_id_order_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_moderated_by_user_id_user_id_fk" FOREIGN KEY ("moderated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_job" ADD CONSTRAINT "production_job_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_job" ADD CONSTRAINT "production_job_order_item_id_order_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_item_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_review_product_status_idx" ON "product_review" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX "product_review_user_idx" ON "product_review" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "production_job_status_idx" ON "production_job" USING btree ("status");--> statement-breakpoint
CREATE INDEX "production_job_order_idx" ON "production_job" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "wishlist_user_idx" ON "wishlist_item" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wishlist_product_idx" ON "wishlist_item" USING btree ("product_id");