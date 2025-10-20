/**
 * Test Schema: Campaign Subscribers Parameters
 * Used for testing the page generator
 *
 * Endpoint: GET /reports/{campaign_id}/email-activity
 */
import { z } from "zod";

/**
 * Path parameters schema
 */
export const subscribersPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

/**
 * Query parameters schema
 */
export const subscribersQueryParamsSchema = z
  .object({
    count: z.coerce.number().min(1).max(1000).default(10).optional(),
    offset: z.coerce.number().min(0).default(0).optional(),
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strict();
