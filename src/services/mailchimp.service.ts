/**
 * Mailchimp Service Layer
 * Provides a clean interface to Mailchimp SDK operations
 * Handles error formatting and provides consistent API responses
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// SDK interop requires any types for proper functioning

import { mailchimp, mailchimpCall } from "@/lib/mailchimp";
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

// Using types from @/types/mailchimp instead of inline definitions

export class MailchimpService {
  /**
   * List Operations
   */

  async getLists(params: ListsParams): Promise<ApiResponse<ListsSuccess>> {
    return mailchimpCall(() => (mailchimp as any).lists.getAllLists(params));
  }

  async getList(listId: string): Promise<ApiResponse<unknown>> {
    return mailchimpCall(() => (mailchimp as any).lists.getList(listId));
  }

  /**
   * Campaign Operations
   */
  async getCampaigns(params: unknown): Promise<ApiResponse<unknown>> {
    return mailchimpCall(() => (mailchimp as any).campaigns.list(params));
  }

  async getCampaign(campaignId: string): Promise<ApiResponse<unknown>> {
    return mailchimpCall(() => (mailchimp as any).campaigns.get(campaignId));
  }

  /**
   * Campaign Report Operations
   */
  async getCampaignReports(
    params: ReportListParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    return mailchimpCall(() =>
      (mailchimp as any).reports.getAllCampaignReports(params),
    );
  }

  async getCampaignReport(
    campaignId: string,
  ): Promise<ApiResponse<ReportSuccess>> {
    return mailchimpCall(() =>
      (mailchimp as any).reports.getCampaignReport(campaignId),
    );
  }

  async getCampaignOpenList(
    campaignId: string,
    params?: OpenListQueryParams,
  ): Promise<ApiResponse<unknown>> {
    return mailchimpCall(() =>
      (mailchimp as any).reports.getCampaignOpenDetails(campaignId, params),
    );
  }

  /**
   * System Operations
   */
  async getApiRoot(
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<RootSuccess>> {
    return mailchimpCall(() => (mailchimp as any).root.getRoot(params));
  }

  async healthCheck(): Promise<ApiResponse<unknown>> {
    return mailchimpCall(() => (mailchimp as any).ping.get());
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const mailchimpService = new MailchimpService();
