/**
 * List Campaigns Query Parameters Schema
 *
 * Mailchimp API: GET /campaigns
 * Documentation: https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { standardQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";
import { sortDirectionSchema } from "@/schemas/mailchimp/common/sorting.schema";
import {
  CAMPAIGN_TYPES,
  CAMPAIGN_STATUS,
  CAMPAIGN_SORT_FIELDS,
} from "@/schemas/mailchimp/common/campaign.schema";

/**
 * Query parameters for List Campaigns endpoint
 * Extends standard pagination and field filtering with campaign-specific filters
 */
export const campaignsParamsSchema = standardQueryParamsSchema.extend({
  // Filter by campaign type
  type: z.enum(CAMPAIGN_TYPES).optional(),

  // Filter by campaign status
  status: z.enum(CAMPAIGN_STATUS).optional(),

  // Filter campaigns sent before this date (ISO 8601)
  before_send_time: z.iso.datetime({ offset: true }).optional(),

  // Filter campaigns sent after this date (ISO 8601)
  since_send_time: z.iso.datetime({ offset: true }).optional(),

  // Filter campaigns created before this date (ISO 8601)
  before_create_time: z.iso.datetime({ offset: true }).optional(),

  // Filter campaigns created after this date (ISO 8601)
  since_create_time: z.iso.datetime({ offset: true }).optional(),

  // Filter by list ID
  list_id: z.string().min(1).optional(),

  // Filter by folder ID
  folder_id: z.string().min(1).optional(),

  // Filter by member ID
  member_id: z.string().min(1).optional(),

  // Field to sort results by
  sort_field: z.enum(CAMPAIGN_SORT_FIELDS).optional(),

  // Sort direction (ASC or DESC)
  sort_dir: sortDirectionSchema,
});
