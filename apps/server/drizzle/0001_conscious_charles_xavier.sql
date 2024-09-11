CREATE TABLE IF NOT EXISTS "warehouse" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "district" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "province" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ward" ALTER COLUMN "name" SET NOT NULL;