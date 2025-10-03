/**
 * Mailchimp API Root TypeScript Types
 * Types inferred from Zod schemas for the API Root endpoint
 *
 * Issue #119: TypeScript types for API Root functionality
 * Based on schemas from: @/schemas/mailchimp/root-*.schema.ts
 */
import type { z } from "zod";
import type {
  rootContactSchema,
  rootIndustryStatsSchema,
  rootSuccessSchema,
} from "@/schemas/mailchimp/root-success.schema";
import type { linkSchema } from "@/schemas/mailchimp/common/link.schema";
import type { rootParamsSchema } from "@/schemas/mailchimp/root-params.schema";
import type { rootErrorSchema } from "@/schemas/mailchimp/root-error.schema";

// Nested object types
export type RootContact = z.infer<typeof rootContactSchema>;
export type RootIndustryStats = z.infer<typeof rootIndustryStatsSchema>;
export type RootLink = z.infer<typeof linkSchema>;

// Main API response type
export type RootSuccess = z.infer<typeof rootSuccessSchema>;

// Query parameter types
export type RootParams = z.infer<typeof rootParamsSchema>;

// Error response type
export type RootError = z.infer<typeof rootErrorSchema>;
