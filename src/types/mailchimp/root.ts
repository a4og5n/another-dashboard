/**
 * Mailchimp API Root TypeScript Types
 * Types inferred from Zod schemas for the API Root endpoint
 *
 * Issue #119: TypeScript types for API Root functionality
 * Based on schemas from: @/schemas/mailchimp/root-*.schema.ts
 */
import type { z } from "zod";
import type {
  RootContactSchema,
  RootIndustryStatsSchema,
  RootLinkSchema,
  MailchimpRootSuccessSchema,
} from "@/schemas/mailchimp/root-success.schema";
import type {
  MailchimpRootQuerySchema,
  MailchimpRootQueryInternalSchema,
} from "@/schemas/mailchimp/root-query.schema";
import type { mailchimpRootErrorResponseSchema } from "@/schemas/mailchimp/root-error-response.schema";

// Nested object types
export type RootContact = z.infer<typeof RootContactSchema>;
export type RootIndustryStats = z.infer<typeof RootIndustryStatsSchema>;
export type RootLink = z.infer<typeof RootLinkSchema>;

// Main API response type
export type MailchimpRoot = z.infer<typeof MailchimpRootSuccessSchema>;

// Query parameter types
export type MailchimpRootQuery = z.infer<typeof MailchimpRootQuerySchema>;
export type MailchimpRootQueryInternal = z.infer<
  typeof MailchimpRootQueryInternalSchema
>;

// Error response type
export type MailchimpRootErrorResponse = z.infer<
  typeof mailchimpRootErrorResponseSchema
>;
