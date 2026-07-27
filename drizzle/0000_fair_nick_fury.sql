CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_code" text NOT NULL,
	"name" text NOT NULL,
	"kana" text NOT NULL,
	"type" text NOT NULL,
	"channel" text NOT NULL,
	"postal_code" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"contact_person" text,
	"registered_at" text NOT NULL,
	CONSTRAINT "customers_customer_code_unique" UNIQUE("customer_code")
);
--> statement-breakpoint
CREATE TABLE "estimates" (
	"id" text PRIMARY KEY NOT NULL,
	"estimate_code" text NOT NULL,
	"project_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"amount" integer NOT NULL,
	"tax_included" boolean DEFAULT true NOT NULL,
	"item_count" integer NOT NULL,
	"status" text NOT NULL,
	"created_at" text NOT NULL,
	"valid_until" text NOT NULL,
	"title" text NOT NULL,
	CONSTRAINT "estimates_estimate_code_unique" UNIQUE("estimate_code")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"project_code" text NOT NULL,
	"name" text NOT NULL,
	"customer_id" text NOT NULL,
	"status" text NOT NULL,
	"construction_type" text NOT NULL,
	"priority" text NOT NULL,
	"structure_type" text NOT NULL,
	"payment_status" text NOT NULL,
	"budget" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"assignee_id" text NOT NULL,
	"contract_date" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"postal_code" text NOT NULL,
	"address" text NOT NULL,
	"floor_area_sqm" double precision NOT NULL,
	"remarks" text,
	"phases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "projects_project_code_unique" UNIQUE("project_code")
);
--> statement-breakpoint
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;