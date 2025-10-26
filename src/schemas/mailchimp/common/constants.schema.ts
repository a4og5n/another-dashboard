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
