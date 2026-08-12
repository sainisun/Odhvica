CREATE TYPE "public"."privacy_request_status" AS ENUM('requested', 'in_review', 'completed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."privacy_request_type" AS ENUM('access', 'erasure', 'correction');--> statement-breakpoint
CREATE TABLE "privacy_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "privacy_request_type" NOT NULL,
	"status" "privacy_request_status" DEFAULT 'requested' NOT NULL,
	"requester_email_snapshot" varchar(320) NOT NULL,
	"details" text,
	"idempotency_key" varchar(128) NOT NULL,
	"resolution_note" text,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "privacy_request_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
ALTER TABLE "privacy_request" ADD CONSTRAINT "privacy_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "privacy_request_user_idx" ON "privacy_request" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "privacy_request_status_idx" ON "privacy_request" USING btree ("status");