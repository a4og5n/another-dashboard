import type { z } from "zod";
import type { MailchimpAudienceSchema } from "@/schemas/mailchimp/audience.schema";

/**
 * TypeScript types for Mailchimp Audience objects
 * Generated from Zod schemas in @/schemas/mailchimp/audience.schema
 */

export type MailchimpAudience = z.infer<typeof MailchimpAudienceSchema>;

export type MailchimpAudienceContact = MailchimpAudience["contact"];
export type MailchimpAudienceCampaignDefaults =
  MailchimpAudience["campaign_defaults"];
export type MailchimpAudienceStats = MailchimpAudience["stats"];
export type MailchimpAudienceMarketingPermission = NonNullable<
  MailchimpAudience["marketing_permissions"]
>[0];

/**
 * Query parameters for fetching audiences
 */
export interface MailchimpAudiencesQuery {
  fields?: string[];
  exclude_fields?: string[];
  count?: number;
  offset?: number;
  before_date_created?: string;
  since_date_created?: string;
  before_campaign_last_sent?: string;
  since_campaign_last_sent?: string;
  email?: string;
  sort_field?: "date_created" | "member_count";
  sort_dir?: "ASC" | "DESC";
}

/**
 * Response structure for audiences list API
 */
export interface MailchimpAudiencesResponse {
  lists: MailchimpAudience[];
  total_items: number;
  constraints: {
    may_create: boolean;
    max_instances: number;
    current_total_instances: number;
  };
}

/**
 * Parameters for creating a new audience
 */
export interface CreateMailchimpAudienceParams {
  name: string;
  contact: MailchimpAudienceContact;
  permission_reminder: string;
  campaign_defaults: MailchimpAudienceCampaignDefaults;
  email_type_option: boolean;
  use_archive_bar?: boolean;
  notify_on_subscribe?: string;
  notify_on_unsubscribe?: string;
  visibility?: "pub" | "prv";
}

/**
 * Parameters for updating an existing audience
 */
export interface UpdateMailchimpAudienceParams
  extends Partial<CreateMailchimpAudienceParams> {
  id: string;
}
