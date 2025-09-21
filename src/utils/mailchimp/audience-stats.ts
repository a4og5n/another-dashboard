import type { MailchimpList } from "@/services";
import type { AudienceStats } from "@/types/mailchimp/audience";

/**
 * Calculate audience statistics from Mailchimp API response data
 * Handles data extraction and processing from raw API response
 *
 * @param responseData - Raw API response data from getLists
 * @returns Calculated audience statistics with extracted data
 */
export function calculateAudienceStats(responseData: {
  lists?: MailchimpList[];
  total_items?: number;
}): {
  stats: AudienceStats;
  audiences: MailchimpList[];
  totalCount: number;
} {
  // Extract audiences and total count from API response
  const audiences = responseData.lists || [];
  const totalCount = responseData.total_items || audiences.length;

  // Generate basic stats from the audience data
  const totalMembers = audiences.reduce(
    (sum: number, audience: MailchimpList) =>
      sum + (audience.stats?.member_count || 0),
    0,
  );

  const stats: AudienceStats = {
    total_audiences: totalCount,
    total_members: totalMembers,
    audiences_by_visibility: audiences.reduce(
      (counts: { pub: number; prv: number }, audience: MailchimpList) => {
        counts[audience.visibility] = (counts[audience.visibility] || 0) + 1;
        return counts;
      },
      { pub: 0, prv: 0 },
    ),
  };

  return {
    stats,
    audiences,
    totalCount,
  };
}
