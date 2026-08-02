CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text,
	"comment" text NOT NULL,
	"images" text DEFAULT '[]' NOT NULL,
	"amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"bonus_paid" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wheel_spin_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"prize_amount" integer NOT NULL,
	"is_vip" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wheel_spins" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"spins_available" integer DEFAULT 0 NOT NULL,
	"total_spins_used" integer DEFAULT 0 NOT NULL,
	"product_spin_claimed" boolean DEFAULT false NOT NULL,
	"referral_spins_claimed" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wheel_spins_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "daily_earnings" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "total_return" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "staking_products" ALTER COLUMN "price" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "staking_products" ALTER COLUMN "return_amount" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "reward" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "user_stakings" ALTER COLUMN "amount_paid" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "user_stakings" ALTER COLUMN "return_amount" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "balance" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wheel_spin_history" ADD CONSTRAINT "wheel_spin_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wheel_spins" ADD CONSTRAINT "wheel_spins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;