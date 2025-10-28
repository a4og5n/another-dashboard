/**
 * Common Sorting Schemas for Mailchimp API
 * Reusable sorting patterns to eliminate duplication across endpoint schemas
 *
 * Eliminates duplicate SORT_DIRECTIONS constants across 5+ files:
 * - lists/params.schema.ts
 * - lists/growth-history/params.schema.ts
 * - lists/members/params.schema.ts
 * - lists/members/[subscriber_hash]/notes/params.schema.ts
 * - reports/open-details/params.schema.ts
 *
 * Related: Issue #252 (Filter System Standardization)
 */
import { z } from "zod";

/**
 * Standard sort direction values
 * Shared across all Mailchimp API endpoints that support sorting
 */
export const SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * Basic sort direction schema
 * Use for endpoints that support sort direction
 */
export const sortDirectionSchema = z.enum(SORT_DIRECTIONS).optional();

/**
 * Create a sorting schema with enumerated sort fields
 * Use for endpoints with a fixed set of sortable fields
 *
 * @param sortFields - Array of valid sort field names
 * @returns Zod object schema with sort_field and sort_dir
 *
 * @example
 * ```typescript
 * // List endpoint with name/date sorting
 * const SORT_FIELDS = ["name", "date_created"] as const;
 * export const sortingSchema = createEnumSortingSchema(SORT_FIELDS);
 * ```
 */
export function createEnumSortingSchema<
  T extends readonly [string, ...string[]],
>(sortFields: T) {
  return z.object({
    sort_field: z.enum(sortFields).optional(),
    sort_dir: sortDirectionSchema,
  });
}

/**
 * Flexible sorting schema for any field name
 * Use for endpoints that allow sorting by any field
 */
export const flexibleSortingSchema = z.object({
  sort_field: z.string().optional(), // Any field name
  sort_dir: sortDirectionSchema,
});

/**
 * Standard two-field sorting schema (most common pattern)
 * Supports sorting by two different dimensions
 *
 * @example
 * ```typescript
 * // Campaign reports sorted by opens then clicks
 * const sortingSchema = createDualSortingSchema(
 *   ["opens", "clicks"] as const,
 *   ["opens", "clicks"] as const
 * );
 * ```
 */
export function createDualSortingSchema<
  T1 extends readonly [string, ...string[]],
  T2 extends readonly [string, ...string[]],
>(primaryFields: T1, secondaryFields: T2) {
  return z.object({
    sort_field: z.enum(primaryFields).optional(),
    sort_dir: sortDirectionSchema,
    sort_field2: z.enum(secondaryFields).optional(),
    sort_dir2: sortDirectionSchema,
  });
}
