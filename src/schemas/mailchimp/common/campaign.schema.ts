/**
 * Common Campaign Schema Constants
 * Shared enums and constants for campaign-related endpoints
 *
 * These constants are used across multiple endpoints:
 * - GET /campaigns (list campaigns)
 * - GET /campaigns/{campaign_id} (get campaign)
 * - Reports endpoints
 */

/**
 * Campaign type enum values
 * Used in both campaign and report endpoints
 */
export const CAMPAIGN_TYPES = [
  "regular",
  "plaintext",
  "absplit",
  "rss",
  "variate",
] as const;

/**
 * Campaign status enum values (for filtering in list endpoints)
 * Per API docs: https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/
 */
export const CAMPAIGN_STATUS = [
  "save",
  "paused",
  "schedule",
  "sending",
  "sent",
] as const;

/**
 * Campaign status enum values (all possible values in response)
 * Includes additional statuses that appear in responses but not in filters
 */
export const CAMPAIGN_STATUS_RESPONSE = [
  "save",
  "paused",
  "schedule",
  "sending",
  "sent",
  "canceled",
  "canceling",
  "archived",
] as const;

/**
 * Campaign content type enum values
 */
export const CAMPAIGN_CONTENT_TYPES = [
  "template",
  "html",
  "url",
  "multichannel",
] as const;

/**
 * Sort field options for campaigns
 */
export const CAMPAIGN_SORT_FIELDS = ["create_time", "send_time"] as const;
