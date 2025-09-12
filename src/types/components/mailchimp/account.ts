import type { MailchimpRoot } from "@/types/mailchimp";

/**
 * Props for AccountOverview component
 * Used to display Mailchimp account information from API Root endpoint
 */
export interface AccountOverviewProps {
  account: MailchimpRoot | null;
  loading?: boolean;
  error?: string;
}
