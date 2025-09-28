import type { MailchimpList } from "@/services";

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
  loading?: boolean;
  className?: string;
}
