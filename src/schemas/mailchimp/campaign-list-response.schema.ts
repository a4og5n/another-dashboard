import { z } from "zod";
import { MailchimpLinkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Mailchimp campaign type values (enum)
 */
export const MAILCHIMP_CAMPAIGN_TYPES = [
  "regular",
  "plaintext",
  "absplit",
  "rss",
  "automation",
  "variate",
] as const;

/**
 * Mailchimp campaign status values (enum)
 */
export const MAILCHIMP_CAMPAIGN_STATUS = [
  "save",
  "paused",
  "schedule",
  "sending",
  "sent",
] as const;
// import type { CampaignListResponse } from '@/types/mailchimp/CampaignListResponse'; // Not used directly

/**
 * Mailchimp List Campaigns Success Response Schema
 * Reference: https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/
 */
export const MailchimpCampaignListResponseSchema = z.object({
  campaigns: z.array(
    z.object({
      id: z.string(),
      web_id: z.number(),
      type: z.enum(MAILCHIMP_CAMPAIGN_TYPES),
      create_time: z.string(),
      archive_url: z.string(),
      long_archive_url: z.string(),
      status: z.enum(MAILCHIMP_CAMPAIGN_STATUS),
      emails_sent: z.number(),
      send_time: z.string(),
      content_type: z.string(),
      needs_block_refresh: z.boolean(),
      resendable: z.boolean(),
      recipients: z.object({
        list_id: z.string(),
        list_is_active: z.boolean(),
        list_name: z.string(),
        segment_text: z.string(),
        recipient_count: z.number(),
        segment_opts: z.record(z.string(), z.unknown()).optional(),
      }),
      settings: z.object({
        subject_line: z.string(),
        preview_text: z.string(),
        from_name: z.string(),
        reply_to: z.string(),
        use_conversation: z.boolean(),
        to_name: z.string(),
        folder_id: z.string(),
        authenticate: z.boolean(),
        auto_footer: z.boolean(),
        inline_css: z.boolean(),
        auto_tweet: z.boolean(),
        drag_and_drop: z.boolean(),
        fb_comments: z.boolean(),
        timewarp: z.boolean(),
        template_id: z.number(),
      }),
      tracking: z.object({
        opens: z.boolean(),
        html_clicks: z.boolean(),
        text_clicks: z.boolean(),
        goal_tracking: z.boolean(),
        ecomm360: z.boolean(),
        google_analytics: z.string(),
        clicktale: z.string(),
      }),
    }),
  ),
  total_items: z.number(),
  links: z.array(MailchimpLinkSchema).optional(),
});

// Type definition moved to '@/types/mailchimp/CampaignListResponse'
