/**
 * TypeScript types for Mailchimp List Growth History API
 * Inferred from Zod schemas
 */
import { z } from "zod";
import {
  growthHistoryPathParamsSchema,
  growthHistoryQueryParamsSchema,
} from "@/schemas/mailchimp/lists/growth-history/params.schema";
import {
  growthHistoryItemSchema,
  growthHistorySuccessSchema,
} from "@/schemas/mailchimp/lists/growth-history/success.schema";
import { growthHistoryErrorSchema } from "@/schemas/mailchimp/lists/growth-history/error.schema";

/**
 * Path parameters for growth history endpoint
 */
export type GrowthHistoryPathParams = z.infer<
  typeof growthHistoryPathParamsSchema
>;

/**
 * Query parameters for growth history endpoint
 */
export type GrowthHistoryQueryParams = z.infer<
  typeof growthHistoryQueryParamsSchema
>;

/**
 * Individual growth history record
 */
export type GrowthHistoryItem = z.infer<typeof growthHistoryItemSchema>;

/**
 * Success response from growth history endpoint
 */
export type GrowthHistoryResponse = z.infer<typeof growthHistorySuccessSchema>;

/**
 * Error response from growth history endpoint
 */
export type GrowthHistoryError = z.infer<typeof growthHistoryErrorSchema>;
