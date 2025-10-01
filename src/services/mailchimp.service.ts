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
  Report,
  ReportListSuccess,
  ReportSuccess,
} from "@/types/mailchimp";
import type {
  ListsPageSearchParams,
  ReportsPageSearchParams,
  Root,
  RootQuery,
  ListsSuccess,
} from "@/types/mailchimp";
import {
  ListsParamsSchema,
  ReportListParamsInternalSchema,
  OpenListQueryParamsSchema,
  RootParamsSchema,
} from "@/schemas/mailchimp";

// Re-export the report type for external use
export type { Report as CampaignReport };

// Using types from @/types/mailchimp instead of inline definitions

export class MailchimpService {
  /**
   * List Operations
   */

  async getLists(
    params: ListsPageSearchParams,
  ): Promise<ApiResponse<ListsSuccess>> {
    // Transform page params to Mailchimp API format, let schema handle defaults
    const transformedParams = transformPaginationParams(
      params.page,
      params.perPage,
    );

    // Validate transformed parameters using schema (applies defaults)
    const validationResult = ListsParamsSchema.safeParse(transformedParams);
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
    params: ReportsPageSearchParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    // Transform page params to Mailchimp API format, let schema handle defaults
    const transformedParams = transformCampaignReportsParams(params);

    // Validate transformed parameters using schema (applies defaults)
    const validationResult =
      ReportListParamsInternalSchema.safeParse(transformedParams);
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
  ): Promise<ApiResponse<ReportSuccess>> {
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
  async getApiRoot(params?: RootQuery): Promise<ApiResponse<Root>> {
    // Validate parameters if provided
    if (params !== undefined) {
      const validationResult = RootParamsSchema.safeParse(params);
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
