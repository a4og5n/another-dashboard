/**
 * Mailchimp Service Layer
 * Provides a clean interface to Mailchimp SDK operations
 * Handles error formatting and provides consistent API responses
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// SDK interop requires any types for proper functioning

import { mailchimp, mailchimpCall, type ApiResponse } from "@/lib/mailchimp";
import type {
  CampaignReport,
  ReportListSuccess,
  ReportDetailSuccess,
} from "@/types/mailchimp";
import type {
  AudiencesPageSearchParams,
  CampaignsPageSearchParams,
  MailchimpRoot,
} from "@/types/mailchimp";
import {
  MailchimpAudienceQuerySchema,
  ReportListQueryInternalSchema,
  OpenListQueryParamsSchema,
} from "@/schemas/mailchimp";

// Re-export the campaign report type for external use
export type { CampaignReport as MailchimpCampaignReport };

// Using types from @/types/mailchimp instead of inline definitions

export class MailchimpService {
  /**
   * Audience/List Operations
   */
  async getAudiences(
    params: AudiencesPageSearchParams,
  ): Promise<ApiResponse<unknown>> {
    // Transform page params to Mailchimp API format
    const transformedParams = {
      count: params.limit ? parseInt(params.limit, 10) : 10,
      offset: params.page
        ? (parseInt(params.page, 10) - 1) *
          (params.limit ? parseInt(params.limit, 10) : 10)
        : 0,
      // Note: Other params like search, visibility, sync_status are not supported by the API
      // They would need to be handled through client-side filtering
    };

    // Validate transformed parameters using schema
    const validationResult =
      MailchimpAudienceQuerySchema.safeParse(transformedParams);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Invalid audience query parameters: ${validationResult.error.message}`,
      };
    }

    return mailchimpCall(() =>
      (mailchimp as any).lists.getAllLists(validationResult.data),
    );
  }

  async getAudience(listId: string): Promise<ApiResponse<unknown>> {
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
    params: CampaignsPageSearchParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    // Transform page params to Mailchimp API format
    const transformedParams = {
      count: params.perPage ? parseInt(params.perPage, 10) : 10,
      offset: params.page
        ? (parseInt(params.page, 10) - 1) *
          (params.perPage ? parseInt(params.perPage, 10) : 10)
        : 0,
      type: params.type as
        | "regular"
        | "plaintext"
        | "absplit"
        | "rss"
        | "variate"
        | undefined,
      before_send_time: params.before_send_time,
      since_send_time: params.since_send_time,
    };

    // Validate transformed parameters using schema
    const validationResult =
      ReportListQueryInternalSchema.safeParse(transformedParams);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Invalid campaign reports query parameters: ${validationResult.error.message}`,
      };
    }

    return mailchimpCall(() =>
      (mailchimp as any).reports.getAllCampaignReports(validationResult.data),
    );
  }

  async getCampaignReport(
    campaignId: string,
  ): Promise<ApiResponse<ReportDetailSuccess>> {
    return mailchimpCall(() =>
      (mailchimp as any).reports.getCampaignReport(campaignId),
    );
  }

  async getCampaignOpenList(
    campaignId: string,
    params?: unknown,
  ): Promise<ApiResponse<unknown>> {
    // Validate parameters if provided
    if (params !== undefined) {
      const validationResult = OpenListQueryParamsSchema.safeParse(params);
      if (!validationResult.success) {
        return {
          success: false,
          error: `Invalid campaign open list query parameters: ${validationResult.error.message}`,
        };
      }
      return mailchimpCall(() =>
        (mailchimp as any).reports.getCampaignOpenDetails(
          campaignId,
          validationResult.data,
        ),
      );
    }

    return mailchimpCall(() =>
      (mailchimp as any).reports.getCampaignOpenDetails(campaignId, params),
    );
  }

  /**
   * System Operations
   */
  async getApiRoot(params?: unknown): Promise<ApiResponse<MailchimpRoot>> {
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
