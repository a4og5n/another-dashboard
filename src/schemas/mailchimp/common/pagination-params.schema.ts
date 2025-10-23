/**
 * Standard Mailchimp API Pagination Query Parameters
 * Reusable schemas for endpoints that support pagination and field filtering
 *
 * These schemas eliminate duplication across 11+ endpoint parameter files
 * by providing standard pagination and field filtering patterns.
 *
 * Related: Issues #222 (folder reorganization), #223 (DRY refactoring)
 */
import { z } from "zod";

/**
 * Standard pagination query parameters
 * Used by most list endpoints (reports, lists, opens, clicks, etc.)
 */
export const paginationQueryParamsSchema = z.object({
  count: z.coerce.number().min(1).max(1000).default(10), // Number of records (1-1000)
  offset: z.coerce.number().min(0).default(0), // Records to skip for pagination
});

/**
 * Field filtering query parameters
 * Used by all Mailchimp endpoints that support field selection
 */
export const fieldFilteringQueryParamsSchema = z.object({
  fields: z.string().optional(), // Comma-separated fields to include
  exclude_fields: z.string().optional(), // Comma-separated fields to exclude
});

/**
 * Combined pagination + field filtering (most common pattern)
 * Use this for endpoints that support both pagination and field filtering
 *
 * @example
 * ```typescript
 * // Simple usage (exact match)
 * export const queryParamsSchema = standardQueryParamsSchema;
 *
 * // With extensions (additional parameters)
 * export const queryParamsSchema = standardQueryParamsSchema.extend({
 *   since: z.iso.datetime({ offset: true }).optional(), // ISO 8601 filter
 * });
 * ```
 */
export const standardQueryParamsSchema = z
  .object({
    ...fieldFilteringQueryParamsSchema.shape,
    ...paginationQueryParamsSchema.shape,
  })
  .strict(); // Reject unknown properties for input validation
