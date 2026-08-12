ALTER TABLE "wishlist_item" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist_item" ADD COLUMN "guest_token" varchar(160);--> statement-breakpoint
CREATE INDEX "wishlist_guest_idx" ON "wishlist_item" USING btree ("guest_token");--> statement-breakpoint
ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_owner_required" CHECK ("wishlist_item"."user_id" IS NOT NULL OR "wishlist_item"."guest_token" IS NOT NULL);