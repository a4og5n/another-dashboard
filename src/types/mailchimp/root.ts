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
  RootSuccessSchema,
} from "@/schemas/mailchimp/root-success.schema";
import type { LinkSchema } from "@/schemas/mailchimp/common/link.schema";
import type { RootParamsSchema } from "@/schemas/mailchimp/root-params.schema";
import type { RootErrorSchema } from "@/schemas/mailchimp/root-error.schema";

// Nested object types
export type RootContact = z.infer<typeof RootContactSchema>;
export type RootIndustryStats = z.infer<typeof RootIndustryStatsSchema>;
export type RootLink = z.infer<typeof LinkSchema>;

// Main API response type
export type RootSuccess = z.infer<typeof RootSuccessSchema>;

// Query parameter types
export type RootParams = z.infer<typeof RootParamsSchema>;

// Error response type
export type RootError = z.infer<typeof RootErrorSchema>;
