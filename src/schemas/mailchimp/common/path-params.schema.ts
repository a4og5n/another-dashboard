/**
 * Standard Mailchimp API Path Parameters
 * Reusable schemas for resource IDs in URL paths
 *
 * These schemas eliminate duplication across 8+ endpoint parameter files
 * by providing standard path parameter validation for common resource IDs.
 *
 * Related: Issues #222 (folder reorganization), #223 (DRY refactoring)
 */
import { z } from "zod";

/**
 * Campaign ID path parameter
 * Used by all campaign report sub-endpoints
 *
 * @example
 * ```typescript
 * // /reports/{campaign_id}/opens
 * import { campaignIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
 * export const opensPathParamsSchema = campaignIdPathParamsSchema;
 * ```
 */
export const campaignIdPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1, "Campaign ID is required"), // Campaign ID
  })
  .strict(); // Reject unknown properties for input validation

/**
 * List ID path parameter
 * Used by all list sub-endpoints
 *
 * @example
 * ```typescript
 * // /lists/{list_id}/activity
 * import { listIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
 * export const activityPathParamsSchema = listIdPathParamsSchema;
 * ```
 */
export const listIdPathParamsSchema = z
  .object({
    list_id: z.string().min(1, "List ID is required"), // List ID
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Helper function to create custom ID path parameters
 * Use when you need a resource ID that isn't campaign_id or list_id
 *
 * @param idName - Name of the ID field (e.g., "member_id", "segment_id")
 * @param errorMessage - Optional custom error message
 * @returns Zod schema for the path parameter
 *
 * @example
 * ```typescript
 * // /lists/{list_id}/members/{member_id}
 * export const memberPathParamsSchema = createIdPathParams("member_id");
 *
 * // With custom error message
 * export const segmentPathParamsSchema = createIdPathParams(
 *   "segment_id",
 *   "Valid segment ID is required"
 * );
 * ```
 */
export function createIdPathParams(idName: string, errorMessage?: string) {
  return z
    .object({
      [idName]: z.string().min(1, errorMessage || `${idName} is required`),
    })
    .strict();
}
