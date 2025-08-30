/**
 * Types for Mailchimp dashboard API
 */

export interface MailchimpDashboardPaginationParams {
  page: number;
  limit: number;
}

export interface MailchimpDashboardCampaign {
  id: string;
  title: string;
  status: string;
  emailsSent: number;
  sendTime: string;
  // Add more fields as needed
}

export interface MailchimpDashboardResponse {
  campaigns: MailchimpDashboardCampaign[];
  total: number;
  page: number;
  limit: number;
}
