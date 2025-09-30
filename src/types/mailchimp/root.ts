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
import type {
  RootParamsSchema,
  RootParamsInternalSchema,
} from "@/schemas/mailchimp/root-params.schema";
import type { rootErrorSchema } from "@/schemas/mailchimp/root-error.schema";

// Nested object types
export type RootContact = z.infer<typeof RootContactSchema>;
export type RootIndustryStats = z.infer<typeof RootIndustryStatsSchema>;
export type RootLink = z.infer<typeof LinkSchema>;

// Main API response type
export type Root = z.infer<typeof RootSuccessSchema>;

// Query parameter types
export type RootQuery = z.infer<typeof RootParamsSchema>;
export type RootQueryInternal = z.infer<typeof RootParamsInternalSchema>;

// Error response type
export type RootErrorResponse = z.infer<typeof rootErrorSchema>;
