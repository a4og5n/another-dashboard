/**
 * Mailchimp Campaign Types
 * Type definitions for Mailchimp campaigns derived from API schemas
 *
 * Following project guidelines:
 * - Defined in /src/types folder
 * - Derived from Zod schemas for consistency
 * - Used for type-safe API handling
 */
import { z } from "zod";
import {
  MAILCHIMP_CAMPAIGN_TYPES,
  MAILCHIMP_CAMPAIGN_STATUS,
  MailchimpCampaignListResponseSchema,
} from "@/schemas/mailchimp/campaign-list-response.schema";

/**
 * Type for Mailchimp campaign
 * Derived from the Zod schema for consistency
 */
export type MailchimpCampaign = z.infer<
  typeof MailchimpCampaignListResponseSchema
>["campaigns"][number];

/**
 * Type for Mailchimp campaign list response
 * Derived from the Zod schema for consistency
 */
export type MailchimpCampaignListResponse = z.infer<
  typeof MailchimpCampaignListResponseSchema
>;

/**
 * Campaign type enum
 */
export type MailchimpCampaignType = (typeof MAILCHIMP_CAMPAIGN_TYPES)[number];

/**
 * Campaign status enum
 */
export type MailchimpCampaignStatus =
  (typeof MAILCHIMP_CAMPAIGN_STATUS)[number];
