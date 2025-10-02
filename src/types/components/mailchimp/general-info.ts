import type { RootSuccess } from "@/types/mailchimp";

/**
 * Props for GeneralInfoOverview component
 * Used to display Mailchimp general information from API Root endpoint
 */
export interface GeneralInfoOverviewProps {
  generalInfo: RootSuccess | null;
  error?: string;
}
