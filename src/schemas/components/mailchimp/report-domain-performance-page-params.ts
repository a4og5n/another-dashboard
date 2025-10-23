/**
 * Domain Performance Page Params Schemas
 * Validation schemas for report-domain-performance page params and search params
 */

import { z } from "zod";

/**
 * Schema for domain performance page route params
 * Validates the id from the URL
 */
export const domainPerformancePageParamsSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});

/**
 * Inferred TypeScript types from schemas
 */
export type DomainPerformancePageParams = z.infer<
  typeof domainPerformancePageParamsSchema
>;
