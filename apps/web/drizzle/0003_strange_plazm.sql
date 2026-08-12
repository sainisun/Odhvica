CREATE TYPE "public"."cart_status" AS ENUM('active', 'checkout_started', 'abandoned', 'expired', 'converted');--> statement-breakpoint
CREATE TYPE "public"."checkout_status" AS ENUM('started', 'awaiting_payment', 'payment_processing', 'completed', 'failed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."fulfilment_status" AS ENUM('unfulfilled', 'review_required', 'in_production', 'ready_to_ship', 'partially_fulfilled', 'fulfilled', 'shipped', 'delivered', 'returned');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('draft', 'pending_confirmation', 'confirmed', 'cancelled', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('razorpay', 'stripe', 'paypal');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('not_required', 'pending', 'authorised', 'paid', 'failed', 'cancelled', 'partially_refunded', 'refunded', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."post_purchase_status" AS ENUM('none', 'cancellation_requested', 'return_requested', 'exchange_requested', 'refund_under_review', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."promotion_type" AS ENUM('percentage', 'fixed_amount', 'free_shipping');--> statement-breakpoint
CREATE TYPE "public"."return_status" AS ENUM('requested', 'approved', 'received', 'rejected', 'resolved');--> statement-breakpoint
CREATE TABLE "cart_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"customisation" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_item_quantity_positive" CHECK ("cart_item"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"session_token" varchar(160),
	"email" varchar(320),
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"delivery_country" varchar(2),
	"status" "cart_status" DEFAULT 'active' NOT NULL,
	"promotion_code" varchar(80),
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "checkout_attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"idempotency_key" varchar(128) NOT NULL,
	"status" "checkout_status" DEFAULT 'started' NOT NULL,
	"delivery_address" jsonb NOT NULL,
	"billing_address" jsonb,
	"shipping_method" jsonb NOT NULL,
	"pricing_snapshot" jsonb NOT NULL,
	"routing_snapshot" jsonb NOT NULL,
	"selected_provider" "payment_provider",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "checkout_attempt_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "customer_address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"label" varchar(80),
	"recipient_name" text NOT NULL,
	"phone" varchar(32) NOT NULL,
	"line_1" text NOT NULL,
	"line_2" text,
	"city" varchar(120) NOT NULL,
	"region" varchar(120),
	"postal_code" varchar(32) NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"tax_id" varchar(32),
	"default_shipping" boolean DEFAULT false NOT NULL,
	"default_billing" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fulfilment_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"status" "fulfilment_status" NOT NULL,
	"tracking_number" varchar(180),
	"carrier" varchar(120),
	"note" text,
	"actor_user_id" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid,
	"variant_id" uuid,
	"product_snapshot" jsonb NOT NULL,
	"customisation_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"discount_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_item_quantity_positive" CHECK ("order_item"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(40) NOT NULL,
	"user_id" text,
	"checkout_attempt_id" uuid,
	"email" varchar(320) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"order_status" "order_status" DEFAULT 'pending_confirmation' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"fulfilment_status" "fulfilment_status" DEFAULT 'unfulfilled' NOT NULL,
	"post_purchase_status" "post_purchase_status" DEFAULT 'none' NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"discount_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"shipping_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"grand_total" numeric(12, 2) NOT NULL,
	"tax_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"delivery_address" jsonb NOT NULL,
	"billing_address" jsonb,
	"shipping_snapshot" jsonb NOT NULL,
	"promotion_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	"confirmed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "order_checkout_attempt_id_unique" UNIQUE("checkout_attempt_id"),
	CONSTRAINT "order_total_nonnegative" CHECK ("order"."grand_total" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"checkout_attempt_id" uuid,
	"provider" "payment_provider" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"provider_payment_id" varchar(180),
	"provider_reference" varchar(180),
	"idempotency_key" varchar(128) NOT NULL,
	"provider_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"paid_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_idempotency_key_unique" UNIQUE("idempotency_key"),
	CONSTRAINT "payment_amount_nonnegative" CHECK ("payment"."amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "promotion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(80) NOT NULL,
	"type" "promotion_type" NOT NULL,
	"value" numeric(12, 2) DEFAULT '0' NOT NULL,
	"minimum_subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"currency" varchar(3),
	"active" boolean DEFAULT true NOT NULL,
	"stackable" boolean DEFAULT false NOT NULL,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "promotion_code_unique" UNIQUE("code"),
	CONSTRAINT "promotion_value_nonnegative" CHECK ("promotion"."value" >= 0)
);
--> statement-breakpoint
CREATE TABLE "return_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid,
	"type" "post_purchase_status" NOT NULL,
	"status" "return_status" DEFAULT 'requested' NOT NULL,
	"reason" text NOT NULL,
	"customer_note" text,
	"resolution_note" text,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkout_attempt" ADD CONSTRAINT "checkout_attempt_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfilment_event" ADD CONSTRAINT "fulfilment_event_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfilment_event" ADD CONSTRAINT "fulfilment_event_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_checkout_attempt_id_checkout_attempt_id_fk" FOREIGN KEY ("checkout_attempt_id") REFERENCES "public"."checkout_attempt"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_checkout_attempt_id_checkout_attempt_id_fk" FOREIGN KEY ("checkout_attempt_id") REFERENCES "public"."checkout_attempt"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_request" ADD CONSTRAINT "return_request_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_request" ADD CONSTRAINT "return_request_order_item_id_order_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_item_cart_idx" ON "cart_item" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_item_variant_idx" ON "cart_item" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "cart_user_idx" ON "cart" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_status_idx" ON "cart" USING btree ("status");--> statement-breakpoint
CREATE INDEX "checkout_attempt_cart_idx" ON "checkout_attempt" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "checkout_attempt_status_idx" ON "checkout_attempt" USING btree ("status");--> statement-breakpoint
CREATE INDEX "customer_address_user_idx" ON "customer_address" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "customer_address_country_idx" ON "customer_address" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "fulfilment_event_order_idx" ON "fulfilment_event" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_item_order_idx" ON "order_item" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_user_idx" ON "order" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_status_idx" ON "order" USING btree ("order_status");--> statement-breakpoint
CREATE INDEX "order_payment_status_idx" ON "order" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "payment_order_idx" ON "payment" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "promotion_active_idx" ON "promotion" USING btree ("active");--> statement-breakpoint
CREATE INDEX "return_request_order_idx" ON "return_request" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "return_request_status_idx" ON "return_request" USING btree ("status");