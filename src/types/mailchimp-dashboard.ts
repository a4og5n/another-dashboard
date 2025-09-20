/**
 * Types for Mailchimp dashboard components
 */

export interface MailchimpDashboardCampaign {
  id: string;
  title: string;
  status: string;
  emailsSent: number;
  sendTime: string;
  // Add more fields as needed
}
