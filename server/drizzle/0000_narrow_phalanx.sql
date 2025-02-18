CREATE TABLE "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parentid" integer NOT NULL 
);
--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_parentid_positions_id_fk" FOREIGN KEY ("parentid") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;