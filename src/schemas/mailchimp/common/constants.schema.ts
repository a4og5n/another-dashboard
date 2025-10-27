/**
 * Mailchimp API Constants
 * Shared enums and constant values used across multiple schemas
 */

/**
 * Status values for member subscription status
 */
export const MEMBER_STATUS = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
  "transactional",
  "archived",
] as const;

/**
 * Email type values
 */
export const EMAIL_TYPE = ["html", "text"] as const;

/**
 * The status of an SMS subscription
 */
export const SMS_SUBSCRIPTION_STATUS = [
  "subscribed",
  "unsubscribed",
  "nonsubscribed",
  "pending",
] as const;

/**
 * Status values for automation workflows
 */
export const AUTOMATION_STATUS = ["save", "paused", "sending"] as const;

/**
 * Workflow type values for automation workflows
 */
export const AUTOMATION_WORKFLOW_TYPE = [
  "abandonedBrowse",
  "abandonedCart",
  "api",
  "bestCustomers",
  "categoryFollowup",
  "dateAdded",
  "emailFollowup",
  "emailSeries",
  "groupAdd",
  "groupRemove",
  "mandrill",
  "productFollowup",
  "purchaseFollowup",
  "recurringEvent",
  "specialEvent",
  "visitUrl",
  "welcomeSeries",
] as const;

/**
 * Days of the week for automation scheduling
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
 * Send time types for automation runtime configuration
 */
export const SEND_TIME_TYPE = ["send_asap", "send_between", "send_at"] as const;
