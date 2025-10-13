/**
 * Mailchimp Service Layer (Fetch-based)
 * All methods now use modern fetch client with OAuth tokens
 */

import { mailchimpApiCall } from "@/lib/mailchimp-action-wrapper";
import type { ApiResponse } from "@/types/api-errors";
import type {
  Report,
  ReportListSuccess,
  ReportSuccess,
} from "@/types/mailchimp";
import type {
  RootSuccess,
  ListsSuccess,
  ListsParams,
  ReportListParams,
  OpenListQueryParams,
} from "@/types/mailchimp";

// Re-export the report type for external use
export type { Report as CampaignReport };

export class MailchimpService {
  /**
   * List Operations
   */
  async getLists(params: ListsParams): Promise<ApiResponse<ListsSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ListsSuccess>("/lists", params),
    );
  }

  async getList(listId: string): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>(`/lists/${listId}`),
    );
  }

  /**
   * Campaign Operations
   */
  async getCampaigns(params: unknown): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>("/campaigns", params as Record<string, unknown>),
    );
  }

  async getCampaign(campaignId: string): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>(`/campaigns/${campaignId}`),
    );
  }

  /**
   * Campaign Report Operations
   */
  async getCampaignReports(
    params: ReportListParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ReportListSuccess>("/reports", params),
    );
  }

  async getCampaignReport(
    campaignId: string,
  ): Promise<ApiResponse<ReportSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ReportSuccess>(`/reports/${campaignId}`),
    );
  }

  async getCampaignOpenList(
    campaignId: string,
    params?: OpenListQueryParams,
  ): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>(`/reports/${campaignId}/open-details`, params),
    );
  }

  /**
   * System Operations
   */
  async getApiRoot(
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<RootSuccess>> {
    return mailchimpApiCall((client) => client.get<RootSuccess>("/", params));
  }

  async healthCheck(): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) => client.get<unknown>("/ping"));
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const mailchimpService = new MailchimpService();
