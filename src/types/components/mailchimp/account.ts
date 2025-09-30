import type { Root } from "@/types/mailchimp";

/**
 * Props for AccountOverview component
 * Used to display Mailchimp account information from API Root endpoint
 */
export interface AccountOverviewProps {
  account: Root | null;
  error?: string;
}
