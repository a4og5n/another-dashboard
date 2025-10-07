/**
 * Mailchimp Service Layer (OAuth-based)
 * All methods now use user-scoped OAuth tokens
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// SDK interop requires any types for proper functioning

import { mailchimpCall } from "@/lib/mailchimp";
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
    return mailchimpCall((client) => (client as any).lists.getAllLists(params));
  }

  async getList(listId: string): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) => (client as any).lists.getList(listId));
  }

  /**
   * Campaign Operations
   */
  async getCampaigns(params: unknown): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) => (client as any).campaigns.list(params));
  }

  async getCampaign(campaignId: string): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) => (client as any).campaigns.get(campaignId));
  }

  /**
   * Campaign Report Operations
   */
  async getCampaignReports(
    params: ReportListParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    return mailchimpCall((client) =>
      (client as any).reports.getAllCampaignReports(params),
    );
  }

  async getCampaignReport(
    campaignId: string,
  ): Promise<ApiResponse<ReportSuccess>> {
    return mailchimpCall((client) =>
      (client as any).reports.getCampaignReport(campaignId),
    );
  }

  async getCampaignOpenList(
    campaignId: string,
    params?: OpenListQueryParams,
  ): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) =>
      (client as any).reports.getCampaignOpenDetails(campaignId, params),
    );
  }

  /**
   * System Operations
   */
  async getApiRoot(
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<RootSuccess>> {
    return mailchimpCall((client) => (client as any).root.getRoot(params));
  }

  async healthCheck(): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) => (client as any).ping.get());
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const mailchimpService = new MailchimpService();
