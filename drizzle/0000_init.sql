CREATE TYPE "public"."brazilian_region" AS ENUM('North', 'Northeast', 'Central-West', 'Southeast', 'South');--> statement-breakpoint
CREATE TYPE "public"."document_format" AS ENUM('file', 'link');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('notice', 'result', 'answer-key', 'appeal', 'enrollment', 'other');--> statement-breakpoint
CREATE TYPE "public"."exam_status" AS ENUM('open', 'upcoming', 'closed', 'ongoing');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "articles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"exam_id" uuid,
	"legacy_id" text,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "articles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "document_contents" (
	"document_id" bigint PRIMARY KEY NOT NULL,
	"markdown" text NOT NULL,
	"extracted_at" timestamp with time zone NOT NULL,
	"model_version" text NOT NULL,
	"token_count" integer,
	"truncated" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document_contents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "exam_documents" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exam_documents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"exam_id" uuid NOT NULL,
	"legacy_id" text,
	"slug" text,
	"title" text NOT NULL,
	"date" date,
	"url" text NOT NULL,
	"type" "document_type",
	"format" "document_format" DEFAULT 'file' NOT NULL,
	"stored_object_uri" text,
	"stored_at" timestamp with time zone,
	"conversion_error" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exam_documents_exam_id_url_key" UNIQUE("exam_id","url"),
	CONSTRAINT "exam_documents_exam_id_slug_key" UNIQUE("exam_id","slug")
);
--> statement-breakpoint
ALTER TABLE "exam_documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "exam_positions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exam_positions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"exam_id" uuid NOT NULL,
	"legacy_id" text,
	"title" text NOT NULL,
	"level" text,
	"salary" double precision,
	"vacancies" integer,
	"registration_fee" double precision
);
--> statement-breakpoint
ALTER TABLE "exam_positions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" text,
	"slug" text,
	"name" text NOT NULL,
	"examining_board" text NOT NULL,
	"institution" text,
	"state" text NOT NULL,
	"city" text,
	"region" "brazilian_region" NOT NULL,
	"status" "exam_status",
	"exam_date" date,
	"result_date" date,
	"possession_date" date,
	"registration_start" timestamp with time zone,
	"registration_end" timestamp with time zone,
	"registration_url" text,
	"notice_url" text,
	"source_url" text,
	"scraped_at" timestamp with time zone,
	"enriched_at" timestamp with time zone,
	"enrichment_locked_at" timestamp with time zone,
	"conversion_locked_at" timestamp with time zone,
	"published" boolean DEFAULT false NOT NULL,
	"vacancies" integer,
	"salary_lower_bound" double precision,
	"levels" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exams_slug_unique" UNIQUE("slug"),
	CONSTRAINT "exams_published_requires_slug" CHECK (NOT "exams"."published" OR "exams"."slug" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "exams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "position_subjects" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "position_subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"position_id" bigint NOT NULL,
	"legacy_id" text,
	"name" text NOT NULL,
	"topics" text[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "position_subjects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "waitlist_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consented_at" timestamp with time zone NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email"),
	CONSTRAINT "waitlist_email_normalized" CHECK ("waitlist"."email" = lower(btrim("waitlist"."email")))
);
--> statement-breakpoint
ALTER TABLE "waitlist" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_contents" ADD CONSTRAINT "document_contents_document_id_exam_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."exam_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_documents" ADD CONSTRAINT "exam_documents_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_positions" ADD CONSTRAINT "exam_positions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position_subjects" ADD CONSTRAINT "position_subjects_position_id_exam_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."exam_positions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exam_positions_exam_id_idx" ON "exam_positions" USING btree ("exam_id");--> statement-breakpoint
CREATE INDEX "exams_published_idx" ON "exams" USING btree ("published");--> statement-breakpoint
CREATE INDEX "exams_examining_board_idx" ON "exams" USING btree ("examining_board");--> statement-breakpoint
CREATE INDEX "exams_state_idx" ON "exams" USING btree ("state");--> statement-breakpoint
CREATE INDEX "position_subjects_position_id_idx" ON "position_subjects" USING btree ("position_id");