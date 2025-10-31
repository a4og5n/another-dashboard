/**
 * Campaign Types
 * Types derived from campaigns schemas
 */

import type { z } from "zod";
import type {
  campaignSchema,
  campaignsSuccessSchema,
} from "@/schemas/mailchimp/campaigns/campaigns-success.schema";
import type {
  campaignContentPathParamsSchema,
  campaignContentQueryParamsSchema,
} from "@/schemas/mailchimp/campaigns/[campaign_id]/content/params.schema";
import type {
  campaignContentSuccessSchema,
  variateContentSchema,
} from "@/schemas/mailchimp/campaigns/[campaign_id]/content/success.schema";
import type { campaignContentErrorSchema } from "@/schemas/mailchimp/campaigns/[campaign_id]/content/error.schema";

/**
 * Individual campaign
 */
export type Campaign = z.infer<typeof campaignSchema>;

/**
 * Campaigns list response
 */
export type CampaignsResponse = z.infer<typeof campaignsSuccessSchema>;

/**
 * Campaign Content - Path Parameters
 */
export type CampaignContentPathParams = z.infer<
  typeof campaignContentPathParamsSchema
>;

/**
 * Campaign Content - Query Parameters
 */
export type CampaignContentQueryParams = z.infer<
  typeof campaignContentQueryParamsSchema
>;

/**
 * Campaign Content - Success Response
 */
export type CampaignContentSuccess = z.infer<
  typeof campaignContentSuccessSchema
>;

/**
 * Variate Content (for multivariate campaigns)
 */
export type VariateContent = z.infer<typeof variateContentSchema>;

/**
 * Campaign Content - Error Response
 */
export type CampaignContentError = z.infer<typeof campaignContentErrorSchema>;
