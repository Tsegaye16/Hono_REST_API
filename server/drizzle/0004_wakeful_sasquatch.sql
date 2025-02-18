ALTER TABLE "positions" DROP CONSTRAINT "positions_parentid_positions_id_fk";
--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_parentid_positions_id_fk" FOREIGN KEY ("parentid") REFERENCES "public"."positions"("id") ON DELETE set null ON UPDATE no action;