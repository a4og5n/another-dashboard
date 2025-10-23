/**
 * Domain Performance Types
 *
 * TypeScript types inferred from Zod schemas for the Domain Performance endpoint.
 * These types are used for type-safe data handling in components and pages.
 *
 * @see src/schemas/mailchimp/domain-performance-params.schema.ts
 * @see src/schemas/mailchimp/domain-performance-success.schema.ts
 */

import type { z } from "zod";
import type {
  domainPerformancePathParamsSchema,
  domainPerformanceQueryParamsSchema,
} from "@/schemas/mailchimp/reports/domain-performance/params.schema";
import type {
  domainPerformanceItemSchema,
  domainPerformanceSuccessSchema,
} from "@/schemas/mailchimp/reports/domain-performance/success.schema";

/**
 * Individual domain performance data
 */
export type DomainPerformanceItem = z.infer<typeof domainPerformanceItemSchema>;

/**
 * Domain performance success response
 */
export type DomainPerformanceResponse = z.infer<
  typeof domainPerformanceSuccessSchema
>;

/**
 * Path parameters for domain performance endpoint
 */
export type DomainPerformancePathParams = z.infer<
  typeof domainPerformancePathParamsSchema
>;

/**
 * Query parameters for domain performance endpoint
 */
export type DomainPerformanceQueryParams = z.infer<
  typeof domainPerformanceQueryParamsSchema
>;
