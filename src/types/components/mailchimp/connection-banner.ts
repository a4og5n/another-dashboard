/**
 * Props for MailchimpConnectionBanner component
 * Connection guard that handles OAuth flow status and empty states
 */
export interface MailchimpConnectionBannerProps {
  /** Whether user just completed OAuth successfully */
  connected?: boolean;
  /** Error from OAuth flow or connection validation */
  error?: string | null;
  /** Whether the connection is valid and active */
  isValid: boolean;
  /** Content to show when connected */
  children?: React.ReactNode;
}
