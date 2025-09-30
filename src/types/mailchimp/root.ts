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
  MailchimpRootSuccessSchema,
} from "@/schemas/mailchimp/root-success.schema";
import type { MailchimpLinkSchema } from "@/schemas/mailchimp/common/link.schema";
import type {
  MailchimpRootParamsSchema,
  MailchimpRootParamsInternalSchema,
} from "@/schemas/mailchimp/root-params.schema";
import type { mailchimpRootErrorResponseSchema } from "@/schemas/mailchimp/root-error-response.schema";

// Nested object types
export type RootContact = z.infer<typeof RootContactSchema>;
export type RootIndustryStats = z.infer<typeof RootIndustryStatsSchema>;
export type RootLink = z.infer<typeof MailchimpLinkSchema>;

// Main API response type
export type MailchimpRoot = z.infer<typeof MailchimpRootSuccessSchema>;

// Query parameter types
export type MailchimpRootQuery = z.infer<typeof MailchimpRootParamsSchema>;
export type MailchimpRootQueryInternal = z.infer<
  typeof MailchimpRootParamsInternalSchema
>;

// Error response type
export type MailchimpRootErrorResponse = z.infer<
  typeof mailchimpRootErrorResponseSchema
>;
