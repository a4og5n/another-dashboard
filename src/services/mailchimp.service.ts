/**
 * Mailchimp Service Layer
 * Provides a clean interface to Mailchimp SDK operations
 * Handles error formatting and provides consistent API responses
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// SDK interop requires any types for proper functioning

import { mailchimp, mailchimpCall } from "@/lib/mailchimp";
import type { ApiResponse } from "@/types/api-errors";
import { transformCampaignReportsParams } from "@/utils/mailchimp/query-params";
import { transformPaginationParams } from "@/utils/mailchimp/query-params";
import type {
  CampaignReport,
  ReportListSuccess,
  ReportDetailSuccess,
} from "@/types/mailchimp";
import type {
  AudiencesPageSearchParams,
  ListsPageSearchParams,
  ReportsPageSearchParams,
  MailchimpRoot,
  MailchimpRootQuery,
  MailchimpAudienceSuccess,
} from "@/types/mailchimp";
import {
  MailchimpAudienceQuerySchema,
  MailchimpListQuerySchema,
  ReportListQueryInternalSchema,
  OpenListQueryParamsSchema,
  MailchimpRootQuerySchema,
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
  ): Promise<ApiResponse<MailchimpAudienceSuccess>> {
    // Transform page params to Mailchimp API format, let schema handle defaults
    const transformedParams = transformPaginationParams(
      params.page,
      params.limit,
    );

    // Validate transformed parameters using schema (applies defaults)
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

  async getLists(
    params: ListsPageSearchParams,
  ): Promise<ApiResponse<MailchimpAudienceSuccess>> {
    // Transform page params to Mailchimp API format, let schema handle defaults
    const transformedParams = transformPaginationParams(
      params.page,
      params.limit,
    );

    // Validate transformed parameters using schema (applies defaults)
    const validationResult =
      MailchimpListQuerySchema.safeParse(transformedParams);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Invalid list query parameters: ${validationResult.error.message}`,
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
    params: ReportsPageSearchParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    // Transform page params to Mailchimp API format, let schema handle defaults
    const transformedParams = transformCampaignReportsParams(params);

    // Validate transformed parameters using schema (applies defaults)
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
  async getApiRoot(
    params?: MailchimpRootQuery,
  ): Promise<ApiResponse<MailchimpRoot>> {
    // Validate parameters if provided
    if (params !== undefined) {
      const validationResult = MailchimpRootQuerySchema.safeParse(params);
      if (!validationResult.success) {
        return {
          success: false,
          error: `Invalid API root query parameters: ${validationResult.error.message}`,
        };
      }
      return mailchimpCall(() =>
        (mailchimp as any).root.getRoot(validationResult.data),
      );
    }

    return mailchimpCall(() => (mailchimp as any).root.getRoot());
  }

  async healthCheck(): Promise<ApiResponse<unknown>> {
    return mailchimpCall(() => (mailchimp as any).ping.get());
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const mailchimpService = new MailchimpService();
