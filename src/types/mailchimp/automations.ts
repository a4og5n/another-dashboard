/**
 * TypeScript types for Mailchimp Automations endpoint
 * Inferred from Zod schemas
 *
 * Endpoint: GET /automations
 * Documentation: https://mailchimp.com/developer/marketing/api/automation/list-automations/
 */

import { z } from "zod";
import { automationsQueryParamsSchema } from "@/schemas/mailchimp/automations-params.schema";
import {
  automationsSuccessSchema,
  automationSchema,
  automationSegmentOptionsSchema,
  automationRecipientsSchema,
  automationSettingsSchema,
  runtimeHoursSchema,
  runtimeSchema,
  automationTriggerSettingsSchema,
  salesforceTrackingSchema,
  capsuleTrackingSchema,
  automationTrackingSchema,
  automationReportSummarySchema,
} from "@/schemas/mailchimp/automations-success.schema";
import { automationsErrorSchema } from "@/schemas/mailchimp/automations-error.schema";

/**
 * Query parameters for automations list endpoint
 */
export type AutomationsQueryParams = z.infer<
  typeof automationsQueryParamsSchema
>;

/**
 * Successful response from automations endpoint
 */
export type AutomationsSuccess = z.infer<typeof automationsSuccessSchema>;

/**
 * Individual automation workflow
 */
export type Automation = z.infer<typeof automationSchema>;

/**
 * Automation segment options
 */
export type AutomationSegmentOptions = z.infer<
  typeof automationSegmentOptionsSchema
>;

/**
 * Automation recipients configuration
 */
export type AutomationRecipients = z.infer<typeof automationRecipientsSchema>;

/**
 * Automation settings
 */
export type AutomationSettings = z.infer<typeof automationSettingsSchema>;

/**
 * Runtime hours configuration
 */
export type RuntimeHours = z.infer<typeof runtimeHoursSchema>;

/**
 * Runtime scheduling configuration
 */
export type Runtime = z.infer<typeof runtimeSchema>;

/**
 * Automation trigger settings
 */
export type AutomationTriggerSettings = z.infer<
  typeof automationTriggerSettingsSchema
>;

/**
 * Salesforce tracking configuration (deprecated)
 * @deprecated
 */
export type SalesforceTracking = z.infer<typeof salesforceTrackingSchema>;

/**
 * Capsule tracking configuration (deprecated)
 * @deprecated
 */
export type CapsuleTracking = z.infer<typeof capsuleTrackingSchema>;

/**
 * Automation tracking configuration
 */
export type AutomationTracking = z.infer<typeof automationTrackingSchema>;

/**
 * Automation performance metrics
 */
export type AutomationReportSummary = z.infer<
  typeof automationReportSummarySchema
>;

/**
 * Error response from automations endpoint
 */
export type AutomationsError = z.infer<typeof automationsErrorSchema>;
