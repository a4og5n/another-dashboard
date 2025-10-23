/**
 * Mailchimp List Activity Types
 * TypeScript types for list activity endpoint
 *
 * Endpoint: GET /lists/{list_id}/activity
 */

import { z } from "zod";
import {
  listActivityPathParamsSchema,
  listActivityQueryParamsSchema,
} from "@/schemas/mailchimp/list-activity-params.schema";
import {
  listActivityItemSchema,
  listActivitySuccessSchema,
} from "@/schemas/mailchimp/list-activity-success.schema";
import { listActivityErrorSchema } from "@/schemas/mailchimp/list-activity-error.schema";

/**
 * Path parameters
 */
export type ListActivityPathParams = z.infer<
  typeof listActivityPathParamsSchema
>;

/**
 * Query parameters
 */
export type ListActivityQueryParams = z.infer<
  typeof listActivityQueryParamsSchema
>;

/**
 * Individual activity item
 */
export type ListActivityItem = z.infer<typeof listActivityItemSchema>;

/**
 * Success response
 */
export type ListActivityResponse = z.infer<typeof listActivitySuccessSchema>;

/**
 * Error response
 */
export type ListActivityError = z.infer<typeof listActivityErrorSchema>;
