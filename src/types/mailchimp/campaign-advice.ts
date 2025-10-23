/**
 * Campaign Advice Types
 *
 * TypeScript types inferred from Zod schemas for the Campaign Advice endpoint.
 * These types are used for type-safe data handling in components and pages.
 *
 * @see src/schemas/mailchimp/campaign-advice-params.schema.ts
 * @see src/schemas/mailchimp/campaign-advice-success.schema.ts
 */

import type { z } from "zod";
import type {
  campaignAdvicePathParamsSchema,
  campaignAdviceQueryParamsSchema,
} from "@/schemas/mailchimp/reports/advice/params.schema";
import type {
  adviceItemSchema,
  campaignAdviceSuccessSchema,
  ADVICE_TYPE,
} from "@/schemas/mailchimp/reports/advice/success.schema";

/**
 * Advice type - sentiment of advice item
 */
export type AdviceType = (typeof ADVICE_TYPE)[number];

/**
 * Individual advice item
 */
export type AdviceItem = z.infer<typeof adviceItemSchema>;

/**
 * Campaign advice success response
 */
export type CampaignAdviceResponse = z.infer<
  typeof campaignAdviceSuccessSchema
>;

/**
 * Path parameters for campaign advice endpoint
 */
export type CampaignAdvicePathParams = z.infer<
  typeof campaignAdvicePathParamsSchema
>;

/**
 * Query parameters for campaign advice endpoint
 */
export type CampaignAdviceQueryParams = z.infer<
  typeof campaignAdviceQueryParamsSchema
>;
