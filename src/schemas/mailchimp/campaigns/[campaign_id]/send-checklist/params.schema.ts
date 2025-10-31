/**
 * Get Campaign Send Checklist Params Schema
 *
 * Mailchimp API: GET /campaigns/{campaign_id}/send-checklist
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-checklist/get-campaign-send-checklist/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Path parameters for Get Campaign Send Checklist endpoint
 */
export const campaignSendChecklistPathParamsSchema = z
  .object({
    /**
     * The unique ID for the campaign
     */
    campaign_id: z.string().min(1, "Campaign ID is required"),
  })
  .strict();

/**
 * Query parameters for Get Campaign Send Checklist endpoint
 */
export const campaignSendChecklistQueryParamsSchema = z
  .object({
    /**
     * A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation.
     */
    fields: z.string().optional(),
    /**
     * A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation.
     */
    exclude_fields: z.string().optional(),
  })
  .strict();
