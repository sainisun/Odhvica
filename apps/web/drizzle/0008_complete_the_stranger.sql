CREATE TYPE "public"."editorial_content_type" AS ENUM('article', 'lookbook');--> statement-breakpoint
CREATE TYPE "public"."editorial_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "editorial_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "editorial_content_type" NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(180) NOT NULL,
	"excerpt" text,
	"body" text NOT NULL,
	"seo_title" varchar(180),
	"seo_description" varchar(320),
	"canonical_path" varchar(260),
	"published_at" timestamp with time zone,
	"created_by_user_id" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "editorial_page_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tracking_update" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"carrier" varchar(120) NOT NULL,
	"tracking_number" varchar(180) NOT NULL,
	"status" "fulfilment_status" NOT NULL,
	"provider_event_id" varchar(180) NOT NULL,
	"payload_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tracking_update_provider_event_id_unique" UNIQUE("provider_event_id")
);
--> statement-breakpoint
CREATE TABLE "url_redirect" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_path" varchar(260) NOT NULL,
	"target_path" varchar(260) NOT NULL,
	"status_code" integer DEFAULT 301 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "url_redirect_source_path_unique" UNIQUE("source_path"),
	CONSTRAINT "url_redirect_status_code" CHECK ("url_redirect"."status_code" IN (301, 302))
);
--> statement-breakpoint
ALTER TABLE "editorial_page" ADD CONSTRAINT "editorial_page_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_update" ADD CONSTRAINT "tracking_update_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_redirect" ADD CONSTRAINT "url_redirect_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "editorial_page_status_idx" ON "editorial_page" USING btree ("status");--> statement-breakpoint
CREATE INDEX "editorial_page_type_idx" ON "editorial_page" USING btree ("type");--> statement-breakpoint
CREATE INDEX "tracking_update_order_idx" ON "tracking_update" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "tracking_update_status_idx" ON "tracking_update" USING btree ("status");--> statement-breakpoint
CREATE INDEX "url_redirect_active_idx" ON "url_redirect" USING btree ("active");