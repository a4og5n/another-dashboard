import type { MailchimpList } from "@/services";

/**
 * Props for AudienceOverview component
 */
export interface AudienceOverviewProps {
  responseData: {
    lists?: MailchimpList[];
    total_items?: number;
  } | null;
  currentPage: number;
  pageSize: number;
  error?: string | null;
  className?: string;
}
