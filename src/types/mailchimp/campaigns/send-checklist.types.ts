/**
 * Campaign Send Checklist Types
 *
 * Type definitions for the Campaign Send Checklist feature
 * Based on: GET /campaigns/{campaign_id}/send-checklist
 */

import { z } from "zod";
import {
  campaignSendChecklistSuccessSchema,
  checklistItemSchema,
  CHECKLIST_ITEM_TYPES,
} from "@/schemas/mailchimp/campaigns/[campaign_id]/send-checklist/success.schema";
import {
  campaignSendChecklistPathParamsSchema,
  campaignSendChecklistQueryParamsSchema,
} from "@/schemas/mailchimp/campaigns/[campaign_id]/send-checklist/params.schema";

/**
 * Campaign send checklist response type
 */
export type CampaignSendChecklist = z.infer<
  typeof campaignSendChecklistSuccessSchema
>;

/**
 * Individual checklist item type
 */
export type ChecklistItem = z.infer<typeof checklistItemSchema>;

/**
 * Checklist item type literal
 */
export type ChecklistItemType = (typeof CHECKLIST_ITEM_TYPES)[number];

/**
 * Path parameters for Campaign Send Checklist endpoint
 */
export type CampaignSendChecklistPathParams = z.infer<
  typeof campaignSendChecklistPathParamsSchema
>;

/**
 * Query parameters for Campaign Send Checklist endpoint
 */
export type CampaignSendChecklistQueryParams = z.infer<
  typeof campaignSendChecklistQueryParamsSchema
>;
