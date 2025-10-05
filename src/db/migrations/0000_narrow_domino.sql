CREATE TABLE "mailchimp_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kinde_user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"server_prefix" text NOT NULL,
	"account_id" text,
	"email" text,
	"username" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_validated_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mailchimp_connections_kinde_user_id_unique" UNIQUE("kinde_user_id")
);
