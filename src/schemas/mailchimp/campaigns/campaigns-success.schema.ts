/**
 * List Campaigns Success Response Schema
 *
 * Mailchimp API: GET /campaigns
 * Documentation: https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";
import {
  CAMPAIGN_TYPES,
  CAMPAIGN_STATUS_RESPONSE,
  CAMPAIGN_CONTENT_TYPES,
} from "@/schemas/mailchimp/common/campaign.schema";
import {
  segmentConditionSchema,
  SEGMENT_MATCH_TYPE,
} from "@/schemas/mailchimp/lists/segments/success.schema";
import { DELIVERY_STATUS_TYPES } from "@/schemas/mailchimp/common/report.schema";

/**
 * RSS campaign frequency options
 */
export const RSS_FREQUENCY = ["daily", "weekly", "monthly"] as const;

/**
 * Days of the week for RSS scheduling
 */
export const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/**
 * A/B split test types
 */
export const AB_SPLIT_TEST_TYPES = [
  "subject",
  "from_name",
  "schedule",
] as const;

/**
 * A/B test winner selection criteria
 */
export const AB_SPLIT_WINNER_CRITERIA = ["opens", "clicks", "manual"] as const;

/**
 * Time units for A/B test wait time
 */
export const AB_SPLIT_WAIT_UNITS = ["hours", "days"] as const;

/**
 * Resend shortcut types for campaign resends
 */
export const RESEND_SHORTCUT_TYPES = [
  "non_openers",
  "new_subscribers",
  "non_clickers",
  "non_purchasers",
] as const;

/**
 * Winner criteria for multivariate campaigns
 */
export const VARIATE_WINNER_CRITERIA = [
  "opens",
  "clicks",
  "manual",
  "total_revenue",
] as const;

/**
 * Segment options schema for campaign recipients
 */
export const campaignSegmentOptsSchema = z.object({
  saved_segment_id: z.number().optional(),
  prebuilt_segment_id: z.string().optional(),
  match: z.enum(SEGMENT_MATCH_TYPE).optional(),
  conditions: z.array(segmentConditionSchema).optional(),
});

/**
 * Recipients schema for campaign
 */
export const campaignRecipientsSchema = z.object({
  list_id: z.string().min(1),
  list_is_active: z.boolean(),
  list_name: z.string(),
  segment_text: z.string().optional(),
  recipient_count: z.number().int().min(0),
  segment_opts: campaignSegmentOptsSchema.optional(),
});

/**
 * Campaign settings schema
 */
export const campaignSettingsSchema = z.object({
  subject_line: z.string().optional(),
  preview_text: z.string().optional(),
  title: z.string().optional(),
  from_name: z.string().optional(),
  reply_to: z.email().optional(),
  use_conversation: z.boolean().optional(),
  to_name: z.string().optional(),
  folder_id: z.string().optional(),
  authenticate: z.boolean().optional(),
  auto_footer: z.boolean().optional(),
  inline_css: z.boolean().optional(),
  auto_tweet: z.boolean().optional(),
  auto_fb_post: z.array(z.string()).optional(), // An array of Facebook page ids to auto-post to
  fb_comments: z.boolean().optional(),
  timewarp: z.boolean().optional(),
  template_id: z.number().optional(),
  drag_and_drop: z.boolean().optional(),
});

/**
 * Salesforce tracking options schema
 */
export const campaignTrackingSalesforceSchema = z.object({
  campaign: z.boolean().optional(),
  notes: z.boolean().optional(),
});

/**
 * Capsule tracking options schema
 */
export const campaignTrackingCapsuleSchema = z.object({
  notes: z.boolean().optional(),
});

/**
 * Campaign tracking options schema
 */
export const campaignTrackingSchema = z.object({
  opens: z.boolean(),
  html_clicks: z.boolean(),
  text_clicks: z.boolean(),
  goal_tracking: z.boolean().optional(), // Deprecated
  ecomm360: z.boolean().optional(),
  google_analytics: z.string().optional(),
  clicktale: z.string().optional(),
  salesforce: campaignTrackingSalesforceSchema.optional(),
  capsule: campaignTrackingCapsuleSchema.optional(),
});

/**
 * Campaign delivery status schema
 */
export const campaignDeliveryStatusSchema = z.object({
  enabled: z.boolean(),
  can_cancel: z.boolean().optional(),
  status: z.enum(DELIVERY_STATUS_TYPES).optional(),
  emails_sent: z.number().int().min(0).optional(),
  emails_canceled: z.number().int().min(0).optional(),
});

/**
 * Campaign report summary ecommerce schema
 */
export const campaignReportSummaryEcommerceSchema = z.object({
  total_orders: z.number().int().min(0).optional(),
  total_spent: z.number().min(0).optional(),
  total_revenue: z.number().min(0).optional(),
});

/**
 * Campaign report summary schema
 */
export const campaignReportSummarySchema = z.object({
  opens: z.number().int().min(0).optional(),
  unique_opens: z.number().int().min(0).optional(),
  open_rate: z.number().min(0).max(100).optional(),
  clicks: z.number().int().min(0).optional(),
  subscriber_clicks: z.number().int().min(0).optional(),
  click_rate: z.number().min(0).max(100).optional(),
  ecommerce: campaignReportSummaryEcommerceSchema.optional(),
});

/**
 * Daily send schedule schema for RSS campaigns
 * Defines which days of the week to send daily RSS campaigns
 */
export const campaignRssDailySendSchema = z.object({
  sunday: z.boolean().optional(),
  monday: z.boolean().optional(),
  tuesday: z.boolean().optional(),
  wednesday: z.boolean().optional(),
  thursday: z.boolean().optional(),
  friday: z.boolean().optional(),
  saturday: z.boolean().optional(),
});

/**
 * RSS schedule schema for RSS campaign scheduling
 */
export const campaignRssScheduleSchema = z.object({
  hour: z.number().int().min(0).max(23).optional(), // Hour in local time (0-23)
  daily_send: campaignRssDailySendSchema.optional(), // Days of the week to send daily RSS
  weekly_send_day: z.enum(DAYS_OF_WEEK).optional(), // Day for weekly RSS
  monthly_send_date: z.number().min(0).max(31).optional(), // Day of month (0 = last day)
});

/**
 * RSS options schema for RSS campaigns
 */
export const campaignRssOptsSchema = z.object({
  feed_url: z.url(),
  frequency: z.enum(RSS_FREQUENCY),
  schedule: campaignRssScheduleSchema.optional(),
  last_sent: z.iso.datetime({ offset: true }).optional(),
  constrain_rss_img: z.boolean().optional(),
});

/**
 * A/B split options schema for A/B test campaigns
 */
export const campaignAbSplitOptsSchema = z.object({
  split_test: z.enum(AB_SPLIT_TEST_TYPES).optional(),
  pick_winner: z.enum(AB_SPLIT_WINNER_CRITERIA).optional(),
  wait_units: z.enum(AB_SPLIT_WAIT_UNITS).optional(),
  wait_time: z.number().int().min(1).optional(),
  split_size: z.number().int().min(1).max(50).optional(),
  from_name_a: z.string().optional(),
  from_name_b: z.string().optional(),
  reply_email_a: z.email().optional(),
  reply_email_b: z.email().optional(),
  subject_a: z.string().optional(),
  subject_b: z.string().optional(),
  send_time_a: z.iso.datetime({ offset: true }).optional(),
  send_time_b: z.iso.datetime({ offset: true }).optional(),
  send_time_winner: z.iso.datetime({ offset: true }).optional(),
});

/**
 * Social card schema for campaign social sharing
 */
export const campaignSocialCardSchema = z.object({
  image_url: z.url().optional(),
  description: z.string().optional(),
  title: z.string().optional(),
});

/**
 * Resend shortcut eligibility segment schema
 * Used for determining if campaign can be resent to various segments
 */
export const resendShortcutEligibilitySegmentSchema = z.object({
  is_eligible: z.boolean(),
  reason: z.string().optional(),
});

/**
 * Shortcut campaign schema for resent campaigns
 */
export const shortcutCampaignSchema = z.object({
  id: z.string().min(1),
  web_id: z.number().int().min(1),
  shortcut_type: z.enum(RESEND_SHORTCUT_TYPES),
  send_time: z.iso.datetime({ offset: true }),
  status: z.enum(CAMPAIGN_STATUS_RESPONSE),
});

/**
 * Original campaign schema for resend shortcut usage
 */
export const originalCampaignSchema = z.object({
  id: z.string().min(1),
  web_id: z.number().int().min(1),
  title: z.string(),
  shortcut_type: z.enum(RESEND_SHORTCUT_TYPES),
});

/**
 * Resend shortcut eligibility schema
 * Determines if campaign qualifies to be resent to various segments
 */
export const campaignResendShortcutEligibilitySchema = z.object({
  to_non_openers: resendShortcutEligibilitySegmentSchema.optional(),
  to_new_subscribers: resendShortcutEligibilitySegmentSchema.optional(),
  to_non_clickers: resendShortcutEligibilitySegmentSchema.optional(),
  to_non_purchasers: resendShortcutEligibilitySegmentSchema.optional(),
});

/**
 * Resend shortcut usage schema
 * Information about campaign resend shortcuts
 */
export const campaignResendShortcutUsageSchema = z.object({
  shortcut_campaigns: z.array(shortcutCampaignSchema).optional(),
  original_campaign: originalCampaignSchema.optional(),
});

/**
 * Variate content description schema
 */
export const campaignVariateContentSchema = z.object({
  content_label: z.string().optional(),
});

/**
 * Variate combination schema
 */
export const campaignVariateCombinationSchema = z.object({
  id: z.string().optional(),
  subject_line: z.number().int().optional(),
  send_time: z.number().int().optional(),
  from_name: z.number().int().optional(),
  reply_to: z.number().int().optional(),
  content_description: z.number().int().optional(),
  recipients: z.number().int().optional(),
});

/**
 * Variate settings schema for multivariate campaigns
 */
export const campaignVariateSettingsSchema = z.object({
  winning_combination_id: z.string().optional(),
  winning_campaign_id: z.string().optional(),
  winner_criteria: z.enum(VARIATE_WINNER_CRITERIA).optional(),
  wait_time: z.number().int().min(1).optional(), // Must be greater than 0 and in whole hours (specified in minutes)
  test_size: z.number().int().min(10).max(100).optional(), // Percentage between 10 and 100
  subject_lines: z.array(z.string()).optional(),
  send_times: z.array(z.iso.datetime({ offset: true })).optional(), // ISO 8601 format
  from_names: z.array(z.string()).optional(),
  reply_to_addresses: z.array(z.email()).optional(),
  contents: z.array(z.string()).optional(),
  combinations: z.array(campaignVariateCombinationSchema).optional(),
});

/**
 * Individual campaign schema
 */
export const campaignSchema = z.object({
  id: z.string().min(1),
  web_id: z.number().int().min(1),
  parent_campaign_id: z.string().optional(),
  type: z.enum(CAMPAIGN_TYPES),
  create_time: z.iso.datetime({ offset: true }), // ISO 8601
  archive_url: z.url().optional(),
  long_archive_url: z.url().optional(),
  status: z.enum(CAMPAIGN_STATUS_RESPONSE),
  emails_sent: z.number().int().min(0),
  send_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601
  content_type: z.enum(CAMPAIGN_CONTENT_TYPES).optional(),
  needs_block_refresh: z.boolean().optional(),
  resendable: z.boolean().optional(),
  recipients: campaignRecipientsSchema,
  settings: campaignSettingsSchema,
  variate_settings: campaignVariateSettingsSchema.optional(),
  tracking: campaignTrackingSchema,
  rss_opts: campaignRssOptsSchema.optional(),
  ab_split_opts: campaignAbSplitOptsSchema.optional(),
  social_card: campaignSocialCardSchema.optional(),
  report_summary: campaignReportSummarySchema.optional(),
  delivery_status: campaignDeliveryStatusSchema.optional(),
  resend_shortcut_eligibility:
    campaignResendShortcutEligibilitySchema.optional(),
  resend_shortcut_usage: campaignResendShortcutUsageSchema.optional(),
  _links: z.array(linkSchema).optional(),
});

/**
 * Success response schema for List Campaigns endpoint
 */
export const campaignsSuccessSchema = z.object({
  campaigns: z.array(campaignSchema),
  total_items: z.number().min(0),
  _links: z.array(linkSchema).optional(),
});
