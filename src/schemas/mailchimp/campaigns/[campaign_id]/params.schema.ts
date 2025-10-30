/**
 * Get Campaign Request Parameters Schema
 *
 * Mailchimp API: GET /campaigns/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/campaigns/get-campaign-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Path parameters for Get Campaign endpoint
 */
export const campaignPathParamsSchema = z
  .object({
    /**
     * The unique ID for the campaign
     */
    campaign_id: z.string().min(1, "Campaign ID is required"),
  })
  .strict();

/**
 * Query parameters for Get Campaign endpoint
 */
export const campaignQueryParamsSchema = z
  .object({
    /**
     * A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation.
     */
    fields: z.string().optional(),
    /**
     * A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation.
     */
    exclude_fields: z.string().optional(),
    /**
     * Include resend shortcut eligibility information in the response
     */
    include_resend_shortcut_eligibility: z.boolean().optional(),
    /**
     * Include resend shortcut usage information in the response
     */
    include_resend_shortcut_usage: z.boolean().optional(),
  })
  .strict();
