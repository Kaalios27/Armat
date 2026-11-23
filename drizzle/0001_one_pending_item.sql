UPDATE "session_items" SET "status" = 'skipped' WHERE "status" = 'pending' AND "id" NOT IN (SELECT DISTINCT ON ("session_id") "id" FROM "session_items" WHERE "status" = 'pending' ORDER BY "session_id", "seq" DESC);--> statement-breakpoint
CREATE UNIQUE INDEX "session_items_one_pending_idx" ON "session_items" USING btree ("session_id") WHERE status = 'pending';
