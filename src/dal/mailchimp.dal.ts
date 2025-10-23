/**
 * Mailchimp Data Access Layer (Fetch-based)
 * All methods now use modern fetch client with OAuth tokens
 */

import { mailchimpApiCall } from "@/lib/mailchimp-action-wrapper";
import type { ApiResponse } from "@/types/api-errors";
import type {
  Report,
  ReportListSuccess,
  ReportSuccess,
  AbuseReportListSuccess,
  AbuseReportsQueryParams,
} from "@/types/mailchimp";
import type {
  RootSuccess,
  List,
  ListsSuccess,
  ListsParams,
  ReportListParams,
  OpenListQueryParams,
} from "@/types/mailchimp";
import { z } from "zod";
import { clickListQueryParamsSchema } from "@/schemas/mailchimp/report-click-details-params.schema";
import { reportClickListSuccessSchema } from "@/schemas/mailchimp/report-click-details-success.schema";
import { unsubscribesSuccessSchema } from "@/schemas/mailchimp/unsubscribes-success.schema";
import { emailActivityQueryParamsSchema } from "@/schemas/mailchimp/email-activity-params.schema";
import { emailActivitySuccessSchema } from "@/schemas/mailchimp/email-activity-success.schema";
import { sentToQueryParamsSchema } from "@/schemas/mailchimp/sent-to-params.schema";
import { sentToSuccessSchema } from "@/schemas/mailchimp/sent-to-success.schema";
import { locationActivityQueryParamsSchema } from "@/schemas/mailchimp/location-activity-params.schema";
import { locationActivitySuccessSchema } from "@/schemas/mailchimp/location-activity-success.schema";
import { campaignAdviceQueryParamsSchema } from "@/schemas/mailchimp/campaign-advice-params.schema";
import { campaignAdviceSuccessSchema } from "@/schemas/mailchimp/campaign-advice-success.schema";
import { domainPerformanceSuccessSchema } from "@/schemas/mailchimp/domain-performance-success.schema";

// Re-export the report type for external use
export type { Report as CampaignReport };

export class MailchimpDAL {
  /**
   * List Operations
   */
  async fetchLists(params: ListsParams): Promise<ApiResponse<ListsSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ListsSuccess>("/lists", params),
    );
  }

  async fetchList(listId: string): Promise<ApiResponse<List>> {
    return mailchimpApiCall((client) => client.get<List>(`/lists/${listId}`));
  }

  /**
   * Campaign Operations
   */
  async fetchCampaigns(params: unknown): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>("/campaigns", params as Record<string, unknown>),
    );
  }

  async fetchCampaign(campaignId: string): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>(`/campaigns/${campaignId}`),
    );
  }

  /**
   * Campaign Report Operations
   */
  async fetchCampaignReports(
    params: ReportListParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ReportListSuccess>("/reports", params),
    );
  }

  async fetchCampaignReport(
    campaignId: string,
  ): Promise<ApiResponse<ReportSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ReportSuccess>(`/reports/${campaignId}`),
    );
  }

  async fetchCampaignOpenList(
    campaignId: string,
    params?: OpenListQueryParams,
  ): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>(`/reports/${campaignId}/open-details`, params),
    );
  }

  async fetchCampaignAbuseReports(
    campaignId: string,
    params?: AbuseReportsQueryParams,
  ): Promise<ApiResponse<AbuseReportListSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<AbuseReportListSuccess>(
        `/reports/${campaignId}/abuse-reports`,
        params,
      ),
    );
  }

  /**
   * System Operations
   */
  async fetchApiRoot(
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<RootSuccess>> {
    return mailchimpApiCall((client) => client.get<RootSuccess>("/", params));
  }

  async healthCheck(): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) => client.get<unknown>("/ping"));
  }

  /**
   * Campaign Click Details
   * GET /reports/{campaign_id}/click-details
   */
  async fetchCampaignClickDetails(
    id: string,
    params?: z.infer<typeof clickListQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof reportClickListSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof reportClickListSuccessSchema>>(
        `/reports/${id}/click-details`,
        params,
      ),
    );
  }

  /**
   * Campaign Unsubscribes
   * GET /reports/{campaign_id}/unsubscribed
   */
  async fetchCampaignUnsubscribes(
    campaignId: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<z.infer<typeof unsubscribesSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof unsubscribesSuccessSchema>>(
        `/reports/${campaignId}/unsubscribed`,
        params,
      ),
    );
  }

  /**
   * Campaign Email Activity
   * GET /reports/{campaign_id}/email-activity
   */
  async fetchCampaignEmailActivity(
    campaignId: string,
    params?: z.infer<typeof emailActivityQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof emailActivitySuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof emailActivitySuccessSchema>>(
        `/reports/${campaignId}/email-activity`,
        params,
      ),
    );
  }

  /**
   * Campaign Recipients (Sent To)
   * GET /reports/{campaign_id}/sent-to
   */
  async fetchCampaignSentTo(
    id: string,
    params?: z.infer<typeof sentToQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof sentToSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof sentToSuccessSchema>>(
        `/reports/${id}/sent-to`,
        params,
      ),
    );
  }

  /**
   * Campaign Locations
   * GET /reports/{campaign_id}/locations
   */
  async fetchCampaignLocationActivity(
    id: string,
    params?: z.infer<typeof locationActivityQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof locationActivitySuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof locationActivitySuccessSchema>>(
        `/reports/${id}/locations`,
        params,
      ),
    );
  }

  /**
   * Campaign Advice
   * GET /reports/{campaign_id}/advice
   */
  async fetchCampaignAdvice(
    id: string,
    params?: z.infer<typeof campaignAdviceQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof campaignAdviceSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof campaignAdviceSuccessSchema>>(
        `/reports/${id}/advice`,
        params,
      ),
    );
  }

  /**
   * Domain Performance
   * GET /reports/{campaign_id}/domain-performance
   */
  async fetchDomainPerformance(
    campaignId: string,
  ): Promise<ApiResponse<z.infer<typeof domainPerformanceSuccessSchema>>> {
    const result = await mailchimpApiCall((client) =>
      client.get<z.infer<typeof domainPerformanceSuccessSchema>>(
        `/reports/${campaignId}/domain-performance`,
      ),
    );

    // Validate response with schema
    if (result.success && result.data) {
      const parsed = domainPerformanceSuccessSchema.safeParse(result.data);
      if (!parsed.success) {
        return {
          success: false,
          error: "Invalid domain performance data format",
          errorCode: "VALIDATION_ERROR",
        };
      }
      return { ...result, data: parsed.data };
    }

    return result;
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const mailchimpDAL = new MailchimpDAL();
