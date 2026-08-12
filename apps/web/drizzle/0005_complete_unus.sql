CREATE TYPE "public"."notification_attempt_outcome" AS ENUM('sandbox_delivered', 'failed', 'suppressed');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('email');--> statement-breakpoint
CREATE TYPE "public"."notification_class" AS ENUM('transactional', 'operational', 'marketing');--> statement-breakpoint
CREATE TYPE "public"."notification_event" AS ENUM('order_confirmed', 'payment_failed', 'fulfilment_updated', 'refund_approved', 'staff_alert');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('queued', 'sandbox_delivered', 'failed', 'suppressed');--> statement-breakpoint
CREATE TABLE "notification_delivery_attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"outcome" "notification_attempt_outcome" NOT NULL,
	"provider" varchar(48) DEFAULT 'sandbox' NOT NULL,
	"provider_message_id" varchar(180),
	"masked_recipient" varchar(320) NOT NULL,
	"error_code" varchar(80),
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_preference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"email" varchar(320) NOT NULL,
	"operational_email" boolean DEFAULT true NOT NULL,
	"marketing_email" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel" "notification_channel" DEFAULT 'email' NOT NULL,
	"delivery_class" "notification_class" NOT NULL,
	"event" "notification_event" NOT NULL,
	"status" "notification_status" DEFAULT 'queued' NOT NULL,
	"user_id" text,
	"recipient_email" varchar(320) NOT NULL,
	"masked_recipient" varchar(320) NOT NULL,
	"order_id" uuid,
	"payment_id" uuid,
	"refund_id" uuid,
	"idempotency_key" varchar(128) NOT NULL,
	"payload_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notification_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
ALTER TABLE "notification_delivery_attempt" ADD CONSTRAINT "notification_delivery_attempt_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preference" ADD CONSTRAINT "notification_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_refund_id_refund_id_fk" FOREIGN KEY ("refund_id") REFERENCES "public"."refund"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_delivery_notification_idx" ON "notification_delivery_attempt" USING btree ("notification_id");--> statement-breakpoint
CREATE INDEX "notification_preference_user_idx" ON "notification_preference" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_preference_email_idx" ON "notification_preference" USING btree ("email");--> statement-breakpoint
CREATE INDEX "notification_status_idx" ON "notification" USING btree ("status");--> statement-breakpoint
CREATE INDEX "notification_order_idx" ON "notification" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "notification_recipient_idx" ON "notification" USING btree ("recipient_email");