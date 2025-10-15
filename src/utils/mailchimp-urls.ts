/**
 * Mailchimp URL Utilities
 * Helper functions for building Mailchimp admin URLs with proper data center routing
 *
 * According to Mailchimp API docs, admin URLs must include the data center (dc) prefix
 * Example: https://us1.admin.mailchimp.com/lists/members/?id=123456
 */

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/db/repositories";

/**
 * Get the server prefix (data center) for the current user's Mailchimp connection
 *
 * @returns Server prefix (e.g., "us1", "us19") or undefined if user not authenticated or no connection
 *
 * @example
 * ```ts
 * const serverPrefix = await getUserServerPrefix();
 * if (serverPrefix) {
 *   const url = buildMailchimpListUrl(serverPrefix, 123456);
 * }
 * ```
 */
export async function getUserServerPrefix(): Promise<string | undefined> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return undefined;
  }

  const connection = await mailchimpConnectionRepo.getDecryptedToken(user.id);
  return connection?.serverPrefix;
}

/**
 * Build a Mailchimp admin URL for a list
 *
 * @param serverPrefix - Data center prefix (e.g., "us1", "us19")
 * @param webId - List web_id from Mailchimp API
 * @returns Full URL to list in Mailchimp admin, or null if serverPrefix is missing
 *
 * @example
 * ```ts
 * const url = buildMailchimpListUrl("us1", 123456);
 * // Returns: "https://us1.admin.mailchimp.com/lists/members/?id=123456"
 * ```
 */
export function buildMailchimpListUrl(
  serverPrefix: string | undefined,
  webId: number,
): string | null {
  if (!serverPrefix) return null;
  return `https://${serverPrefix}.admin.mailchimp.com/lists/members/?id=${webId}`;
}

/**
 * Build a Mailchimp admin URL for a campaign
 *
 * @param serverPrefix - Data center prefix (e.g., "us1", "us19")
 * @param webId - Campaign web_id from Mailchimp API
 * @returns Full URL to campaign in Mailchimp admin, or null if serverPrefix is missing
 *
 * @example
 * ```ts
 * const url = buildMailchimpCampaignUrl("us1", 123456);
 * // Returns: "https://us1.admin.mailchimp.com/campaigns/show/?id=123456"
 * ```
 */
export function buildMailchimpCampaignUrl(
  serverPrefix: string | undefined,
  webId: number,
): string | null {
  if (!serverPrefix) return null;
  return `https://${serverPrefix}.admin.mailchimp.com/campaigns/show/?id=${webId}`;
}

/**
 * Build a Mailchimp admin URL for a report
 *
 * @param serverPrefix - Data center prefix (e.g., "us1", "us19")
 * @param webId - Campaign web_id from Mailchimp API (reports use campaign web_id)
 * @returns Full URL to report in Mailchimp admin, or null if serverPrefix is missing
 *
 * @example
 * ```ts
 * const url = buildMailchimpReportUrl("us1", 123456);
 * // Returns: "https://us1.admin.mailchimp.com/reports/summary?id=123456"
 * ```
 */
export function buildMailchimpReportUrl(
  serverPrefix: string | undefined,
  webId: number,
): string | null {
  if (!serverPrefix) return null;
  return `https://${serverPrefix}.admin.mailchimp.com/reports/summary?id=${webId}`;
}
