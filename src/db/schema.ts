import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Mailchimp OAuth Connections
 * Links Kinde users to their Mailchimp accounts via OAuth tokens
 */
export const mailchimpConnections = pgTable("mailchimp_connections", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Link to Kinde user
  kindeUserId: text("kinde_user_id").notNull().unique(),

  // OAuth tokens (encrypted at application layer)
  accessToken: text("access_token").notNull(),
  serverPrefix: text("server_prefix").notNull(), // us1, us19, etc.

  // Mailchimp account metadata
  accountId: text("account_id"),
  email: text("email"),
  username: text("username"),

  // Connection status
  isActive: boolean("is_active").default(true).notNull(),

  // Metadata from Mailchimp (store full response for reference)
  metadata: jsonb("metadata").$type<{
    dc: string;
    role?: string;
    accountName?: string;
    login?: { email?: string; login_id?: string };
  }>(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastValidatedAt: timestamp("last_validated_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertMailchimpConnectionSchema = createInsertSchema(
  mailchimpConnections,
  {
    kindeUserId: z.string().min(1, "Kinde user ID is required"),
    accessToken: z.string().min(1, "Access token is required"),
    serverPrefix: z.string().regex(/^[a-z]{2,4}\d*$/, "Invalid server prefix"),
    email: z.email().optional(),
  },
);

export const selectMailchimpConnectionSchema =
  createSelectSchema(mailchimpConnections);

// TypeScript types
export type MailchimpConnection = typeof mailchimpConnections.$inferSelect;
export type NewMailchimpConnection = typeof mailchimpConnections.$inferInsert;

// Future: Add tables for other integrations (Google Analytics, YouTube, etc.)
// export const googleAnalyticsConnections = pgTable(...);
// export const youtubeConnections = pgTable(...);
