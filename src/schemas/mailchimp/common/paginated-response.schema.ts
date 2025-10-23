/**
 * Standard Mailchimp API Paginated Response Wrapper
 * Generic schema factory for paginated list endpoints
 *
 * This factory function eliminates duplication across 12+ success response files
 * by providing a standardized pattern for paginated API responses.
 *
 * Related: Issues #222 (folder reorganization), #223 (DRY refactoring)
 */
import { z, type ZodType } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Creates a paginated response schema for a specific resource
 *
 * Most Mailchimp list endpoints follow this pattern:
 * - Array of items with a specific key (e.g., "abuse_reports", "emails")
 * - Optional parent resource ID (e.g., "campaign_id", "list_id")
 * - total_items count
 * - _links array for HATEOAS navigation
 *
 * @param itemSchema - Zod schema for individual items in the array
 * @param resourceKey - API property name for the array (e.g., "abuse_reports", "emails")
 * @param idKey - Optional parent resource ID field (e.g., "campaign_id", "list_id")
 * @returns Zod schema for the complete paginated response
 *
 * @example
 * ```typescript
 * // Simple paginated response (no parent ID)
 * const listsResponseSchema = createPaginatedResponse(
 *   listSchema,
 *   "lists"
 * );
 * // Result: { lists: [], total_items: number, _links: [] }
 *
 * // With parent campaign ID
 * const abuseReportsResponseSchema = createPaginatedResponse(
 *   abuseReportSchema,
 *   "abuse_reports",
 *   "campaign_id"
 * );
 * // Result: { abuse_reports: [], campaign_id: string, total_items: number, _links: [] }
 *
 * // With parent list ID
 * const activityResponseSchema = createPaginatedResponse(
 *   activitySchema,
 *   "activity",
 *   "list_id"
 * );
 * // Result: { activity: [], list_id: string, total_items: number, _links: [] }
 * ```
 */
export function createPaginatedResponse<T extends ZodType>(
  itemSchema: T,
  resourceKey: string,
  idKey?: string,
) {
  const baseShape = {
    [resourceKey]: z.array(itemSchema), // Array of resource items
    total_items: z.number().min(0), // Total count
    _links: z.array(linkSchema), // HATEOAS navigation links
  };

  if (idKey) {
    return z.object({
      ...baseShape,
      [idKey]: z.string().min(1), // Parent resource ID
    });
  }

  return z.object(baseShape);
}

/**
 * Standard pagination metadata schema
 * For responses that include pagination info separately from the main data
 *
 * @example
 * ```typescript
 * const responseSchema = z.object({
 *   data: z.array(itemSchema),
 *   ...paginationMetadataSchema.shape,
 * });
 * ```
 */
export const paginationMetadataSchema = z.object({
  total_items: z.number().min(0), // Total count
  _links: z.array(linkSchema), // HATEOAS navigation links
});
