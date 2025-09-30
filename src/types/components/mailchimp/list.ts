import type { MailchimpList, DashboardListStats } from "@/types/mailchimp/list";

/**
 * Props for ListOverview component
 */
export interface ListOverviewProps {
  responseData: {
    lists?: MailchimpList[];
    total_items?: number;
  } | null;
  currentPage?: number;
  pageSize?: number;
  error?: string | null;
  className?: string;
}

/**
 * Props for ListStats component
 */
export interface ListStatsProps {
  stats: DashboardListStats;
  className?: string;
}
