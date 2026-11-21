ALTER TABLE "document_contents" ALTER COLUMN "markdown" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "document_contents" ADD COLUMN "storage_path" text;