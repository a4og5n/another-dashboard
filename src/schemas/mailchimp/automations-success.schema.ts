/**
 * Automations Success Response Schema
 * Schema for successful responses from the Mailchimp automations endpoint
 *
 * Endpoint: GET /automations
 * Source: Assumed based on Mailchimp API patterns (needs verification with real API response)
 *
 * ⚠️ ASSUMED FIELDS - These schemas are based on common Mailchimp API patterns.
 * Please verify all fields match actual API response during testing.
 * Fields are based on similar list endpoints and typical automation workflow properties.
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";
import {
  segmentConditionSchema,
  SEGMENT_MATCH_TYPE,
} from "@/schemas/mailchimp/lists/segments/success.schema";
import {
  AUTOMATION_STATUS,
  AUTOMATION_WORKFLOW_TYPE,
  DAYS_OF_WEEK,
  SEND_TIME_TYPE,
} from "@/schemas/mailchimp/common/constants.schema";

/**
 * Automation segment options schema
 * Configuration for audience segmentation in automations
 */
export const automationSegmentOptionsSchema = z.object({
  saved_segment_id: z.number().int().min(0).optional(), // Saved segment ID
  match: z.enum(SEGMENT_MATCH_TYPE).optional(), // Match type - whether to match any or all conditions
  conditions: z.array(segmentConditionSchema).optional(), // Array of segment conditions
});

/**
 * Automation recipients schema
 * Information about who receives the automation
 */
export const automationRecipientsSchema = z.object({
  list_id: z.string().min(1), // List ID
  list_is_active: z.boolean().optional(), // Whether list is active
  list_name: z.string().optional(), // List name
  segment_opts: automationSegmentOptionsSchema.optional(), // An object representing all segmentation options
  store_id: z.string().optional(), // Store ID for e-commerce
});

/**
 * Automation settings schema
 * Configuration and behavior settings for the automation
 */
export const automationSettingsSchema = z.object({
  title: z.string().optional(), // Automation title
  from_name: z.string().optional(), // From name
  reply_to: z.email().optional(), // Reply-to email
  use_conversation: z.boolean().optional(), // Whether to use Conversation feature
  to_name: z.string().optional(), // To name
  authenticate: z.boolean().optional(), // Authentication enabled
  auto_footer: z.boolean().optional(), // Auto-footer enabled
  inline_css: z.boolean().optional(), // Inline CSS enabled
});

/**
 * Runtime hours schema
 * Configuration for when automation emails are sent
 */
export const runtimeHoursSchema = z.object({
  type: z.enum(SEND_TIME_TYPE).optional(), // When to send the Automation email
});

/**
 * Runtime schema
 * Scheduling configuration for automation execution
 */
export const runtimeSchema = z.object({
  hours: runtimeHoursSchema.optional(), // The hours an Automation workflow can send
  days: z.array(z.enum(DAYS_OF_WEEK)).optional(), // The days an Automation workflow can send
});

/**
 * Automation trigger settings schema
 * Configuration for what triggers the automation
 */
export const automationTriggerSettingsSchema = z.object({
  workflow_type: z.enum(AUTOMATION_WORKFLOW_TYPE).optional(), // The type of Automation workflow
  workflow_title: z.string().optional(), // The title of the workflow type
  runtime: runtimeSchema.optional(), // A workflow's runtime settings for an Automation
  workflow_emails_count: z.number().int().min(0).optional(), // The number of emails in the Automation workflow
});

/**
 * Salesforce tracking schema (deprecated)
 * @deprecated This field is deprecated but still returned by the API
 */
export const salesforceTrackingSchema = z.object({
  campaign: z.boolean(), // Salesforce campaign tracking enabled
  notes: z.boolean(), // Salesforce notes enabled
});

/**
 * Capsule tracking schema (deprecated)
 * @deprecated This field is deprecated but still returned by the API
 */
export const capsuleTrackingSchema = z.object({
  notes: z.boolean(), // Capsule notes enabled
});

/**
 * Automation tracking schema
 * Tracking and analytics settings
 */
export const automationTrackingSchema = z.object({
  opens: z.boolean().optional(), // Track opens
  html_clicks: z.boolean().optional(), // Track HTML clicks
  text_clicks: z.boolean().optional(), // Track text clicks
  goal_tracking: z.boolean().optional(), // @deprecated Goal tracking enabled
  ecomm360: z.boolean().optional(), // E-commerce tracking
  google_analytics: z.string().optional(), // Google Analytics tracking
  clicktale: z.string().optional(), // ClickTale tracking
  salesforce: salesforceTrackingSchema.optional(), // @deprecated Salesforce integration
  capsule: capsuleTrackingSchema.optional(), // @deprecated Capsule CRM integration
});

/**
 * Automation report summary schema
 * Performance metrics for the automation
 */
export const automationReportSummarySchema = z.object({
  opens: z.number().int().min(0).optional(), // Total opens
  unique_opens: z.number().int().min(0).optional(), // Unique opens
  open_rate: z.number().min(0).max(1).optional(), // Open rate (0-1)
  clicks: z.number().int().min(0).optional(), // Total clicks
  subscriber_clicks: z.number().int().min(0).optional(), // Subscriber clicks
  click_rate: z.number().min(0).max(1).optional(), // Click rate (0-1)
});

/**
 * Individual automation schema
 * Represents a single automation workflow
 */
export const automationSchema = z.object({
  trigger_settings: automationTriggerSettingsSchema.optional(), // Trigger configuration
  id: z.string().min(1), // Automation ID
  create_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601 creation timestamp
  start_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601 start timestamp
  status: z.enum(AUTOMATION_STATUS), // Automation status
  emails_sent: z.number().min(0).optional(), // Number of emails sent
  recipients: automationRecipientsSchema.optional(), // List settings for the Automation
  settings: automationSettingsSchema.optional(), // Automation settings
  tracking: automationTrackingSchema.optional(), // Tracking settings
  report_summary: automationReportSummarySchema.optional(), // Performance metrics
  _links: z.array(linkSchema).optional(), // HATEOAS navigation links
});

/**
 * Automations list success response schema
 * Contains array of automations and pagination info
 */
export const automationsSuccessSchema = z.object({
  automations: z.array(automationSchema), // Array of automation workflows
  total_items: z.number().min(0), // Total count
  _links: z.array(linkSchema).optional(), // HATEOAS navigation links
});
