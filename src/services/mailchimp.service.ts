/**
 * Mailchimp Reports API Service
 * Handles campaign performance data, audience insights, and reporting metrics
 */

import { BaseApiService, ApiResponse } from "@/services/base-api.service";
import { env } from "@/lib/config";
import { CampaignFilters, DateFilter } from "@/types/campaign-filters";
import { format } from "date-fns";
import type {
  MailchimpCampaign,
  MailchimpRoot,
  MailchimpRootQuery,
  ReportListQuery,
  MailchimpList,
  OpenListQueryParams,
  ReportOpenListSuccess,
} from "@/types/mailchimp";
import { MailchimpAudienceQuerySchema } from "@/schemas/mailchimp/audience-query.schema";
import { CampaignsPageQuerySchema } from "@/schemas/mailchimp/campaign-query.schema";
import type { CampaignReport } from "@/schemas/mailchimp/common/campaign-report.schema";

export type MailchimpCampaignReport = CampaignReport;

// Using the ReportListQuery type from types/mailchimp/reports.ts

/**
 * Mailchimp API Service Implementation
 */
export class MailchimpService extends BaseApiService {
  constructor() {
    const baseUrl = env.MAILCHIMP_SERVER_PREFIX
      ? `https://${env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`
      : "https://us1.api.mailchimp.com/3.0"; // Default server

    super("Mailchimp", {
      baseUrl,
      headers: {
        Authorization: `apikey ${env.MAILCHIMP_API_KEY}`,
        "User-Agent": "NextJS Dashboard/1.0",
      },
      timeout: 15000, // Mailchimp can be slow
      retryAttempts: 3,
      retryDelay: 2000,
    });
  }

  protected async authenticate(): Promise<void> {
    // Mailchimp uses API key authentication in headers
    // No additional authentication step needed
    return Promise.resolve();
  }

  protected handleRateLimit(response: Response): void {
    // Mailchimp rate limiting headers
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const resetTime = response.headers.get("X-RateLimit-Reset");

    if (remaining && resetTime) {
      this.rateLimit = {
        remaining: parseInt(remaining, 10),
        resetTime: new Date(parseInt(resetTime, 10) * 1000),
        limit: 10, // Mailchimp default is 10 requests per second
      };
    }

    // If rate limited, wait until reset
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      if (retryAfter) {
        const delay = parseInt(retryAfter, 10) * 1000;
        throw new Error(`Rate limited. Retry after ${delay}ms`);
      }
    }
  }

  /**
   * Health check for Mailchimp API
   */
  async healthCheck(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    const response = await this.get("/ping");

    if (response.success) {
      return {
        success: true,
        data: {
          status: "healthy",
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      success: false,
      error: "Mailchimp API health check failed",
      statusCode: response.statusCode,
    };
  }

  /**
   * Get all campaigns
   */
  async getCampaigns(params?: ReportListQuery): Promise<
    ApiResponse<{
      campaigns: MailchimpCampaign[];
      total_items: number;
    }>
  > {
    // Convert ReportListQuery to base service format
    const queryParams: Record<string, string | number | boolean | string[]> =
      {};
    if (params) {
      if (params.fields) queryParams.fields = params.fields;
      if (params.exclude_fields)
        queryParams.exclude_fields = params.exclude_fields;
      if (params.count) queryParams.count = params.count;
      if (params.offset) queryParams.offset = params.offset;
      if (params.type) queryParams.type = params.type;
      if (params.before_send_time)
        queryParams.before_send_time = params.before_send_time;
      if (params.since_send_time)
        queryParams.since_send_time = params.since_send_time;
      if (params.folder_id) queryParams.folder_id = params.folder_id;
      if (params.member_id) queryParams.member_id = params.member_id;
      if (params.list_id) queryParams.list_id = params.list_id;
      if (params.sort_field) queryParams.sort_field = params.sort_field;
      if (params.sort_dir) queryParams.sort_dir = params.sort_dir;
    }

    return this.get("/campaigns", queryParams);
  }

  /**
   * Get specific campaign by ID
   */
  async getCampaign(
    campaignId: string,
  ): Promise<ApiResponse<MailchimpCampaign>> {
    return this.get(`/campaigns/${campaignId}`);
  }

  /**
   * Get campaign report (performance metrics)
   * @param campaignId - The campaign ID to get report for
   * @param params - Optional query parameters for field filtering
   */
  async getCampaignReport(
    campaignId: string,
    params?: { fields?: string; exclude_fields?: string },
  ): Promise<ApiResponse<MailchimpCampaignReport>> {
    // Convert to base service format
    const queryParams: Record<string, string | number | boolean | string[]> =
      {};
    if (params) {
      if (params.fields) queryParams.fields = params.fields;
      if (params.exclude_fields)
        queryParams.exclude_fields = params.exclude_fields;
    }

    return this.get(`/reports/${campaignId}`, queryParams);
  }

  /**
   * Get all campaign reports
   */
  async getCampaignReports(rawParams?: {
    page?: string;
    perPage?: string;
    type?: string;
    before_send_time?: string;
    since_send_time?: string;
    fields?: string;
    exclude_fields?: string;
    count?: string | number;
    offset?: string | number;
    folder_id?: string;
    member_id?: string;
    list_id?: string;
    sort_field?: string;
    sort_dir?: string;
  }): Promise<
    ApiResponse<{
      reports: MailchimpCampaignReport[];
      total_items: number;
    }>
  > {
    // Parse and validate parameters using campaign query schema
    const campaignQueryDefaults = CampaignsPageQuerySchema.parse({});
    const currentPage = parseInt(rawParams?.page || "1");
    const pageSize = parseInt(
      rawParams?.perPage || campaignQueryDefaults.perPage.toString(),
    );

    // Convert raw params to API query format
    const queryParams: Record<string, string | number | boolean | string[]> = {
      count: pageSize,
      offset: (currentPage - 1) * pageSize,
    };

    if (rawParams) {
      if (rawParams.fields) queryParams.fields = rawParams.fields;
      if (rawParams.exclude_fields)
        queryParams.exclude_fields = rawParams.exclude_fields;
      if (rawParams.type) queryParams.type = rawParams.type;
      if (rawParams.before_send_time)
        queryParams.before_send_time = rawParams.before_send_time;
      if (rawParams.since_send_time)
        queryParams.since_send_time = rawParams.since_send_time;
      if (rawParams.folder_id) queryParams.folder_id = rawParams.folder_id;
      if (rawParams.member_id) queryParams.member_id = rawParams.member_id;
      if (rawParams.list_id) queryParams.list_id = rawParams.list_id;
      if (rawParams.sort_field) queryParams.sort_field = rawParams.sort_field;
      if (rawParams.sort_dir) queryParams.sort_dir = rawParams.sort_dir;
      // Override defaults if provided
      if (rawParams.count) queryParams.count = rawParams.count;
      if (rawParams.offset) queryParams.offset = rawParams.offset;
    }

    return this.get("/reports", queryParams);
  }

  /**
   * Get campaign open list (who opened the campaign)
   * @param campaignId - The campaign ID to get open list for
   * @param params - Optional query parameters for pagination and filtering
   */
  async getCampaignOpenList(
    campaignId: string,
    params?: OpenListQueryParams,
  ): Promise<ApiResponse<ReportOpenListSuccess>> {
    // Convert OpenListQueryParams to base service format
    const queryParams: Record<string, string | number | boolean | string[]> =
      {};
    if (params) {
      if (params.fields) queryParams.fields = params.fields;
      if (params.exclude_fields)
        queryParams.exclude_fields = params.exclude_fields;
      if (params.count) queryParams.count = params.count;
      if (params.offset) queryParams.offset = params.offset;
      if (params.since) queryParams.since = params.since;
      if (params.sort_field) queryParams.sort_field = params.sort_field;
      if (params.sort_dir) queryParams.sort_dir = params.sort_dir;
    }

    return this.get(`/reports/${campaignId}/open-details`, queryParams);
  }

  /**
   * Get all lists (audiences)
   * Accepts raw search params and handles parsing/validation internally
   */
  async getLists(rawParams?: {
    page?: string;
    limit?: string;
    fields?: string;
    exclude_fields?: string;
    count?: string | number;
    offset?: string | number;
  }): Promise<
    ApiResponse<{
      lists: MailchimpList[];
      total_items: number;
    }>
  > {
    // Parse and validate params using schema defaults
    const queryDefaults = MailchimpAudienceQuerySchema.parse({});

    // Convert page/limit to count/offset format, handling both string and number inputs
    const currentPage = parseInt(rawParams?.page || "1");
    const pageSize = rawParams?.count
      ? typeof rawParams.count === "string"
        ? parseInt(rawParams.count)
        : rawParams.count
      : parseInt(rawParams?.limit || queryDefaults.count.toString());

    // Convert to base service format
    const offset = rawParams?.offset
      ? typeof rawParams.offset === "string"
        ? parseInt(rawParams.offset)
        : rawParams.offset
      : (currentPage - 1) * pageSize;

    const queryParams: Record<string, string | number | boolean | string[]> = {
      count: pageSize,
      offset: offset,
    };

    // Add optional field parameters
    if (rawParams?.fields) queryParams.fields = rawParams.fields;
    if (rawParams?.exclude_fields)
      queryParams.exclude_fields = rawParams.exclude_fields;

    return this.get("/lists", queryParams);
  }

  /**
   * Get specific list by ID
   */
  async getList(listId: string): Promise<ApiResponse<MailchimpList>> {
    return this.get(`/lists/${listId}`);
  }

  /**
   * Get API Root - account information and API links
   */
  async getApiRoot(
    params?: MailchimpRootQuery,
  ): Promise<ApiResponse<MailchimpRoot>> {
    // Convert to base service format
    const queryParams: Record<string, string | number | boolean | string[]> =
      {};
    if (params) {
      if (params.fields) queryParams.fields = params.fields;
      if (params.exclude_fields)
        queryParams.exclude_fields = params.exclude_fields;
    }

    return this.get("/", queryParams);
  }

  /**
   * Convert DateFilter to Mailchimp API date parameters
   */
  private convertDateFilter(dateFilter?: DateFilter): {
    since_send_time?: string;
    before_send_time?: string;
  } {
    if (!dateFilter?.startDate && !dateFilter?.endDate) {
      return {};
    }

    const result: { since_send_time?: string; before_send_time?: string } = {};

    if (dateFilter.startDate) {
      // Mailchimp expects ISO 8601 format
      result.since_send_time = format(
        dateFilter.startDate,
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
      );
    }

    if (dateFilter.endDate) {
      // Add end of day to include all campaigns sent on the end date
      const endOfDay = new Date(dateFilter.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result.before_send_time = format(endOfDay, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    }

    return result;
  }

  /**
   * Get campaign performance summary for dashboard
   */
  async getCampaignSummary(filters?: CampaignFilters): Promise<
    ApiResponse<{
      totalCampaigns: number;
      filteredCount?: number;
      sentCampaigns: number;
      avgOpenRate: number;
      avgClickRate: number;
      totalEmailsSent: number;
      recentCampaigns: Array<{
        id: string;
        title: string;
        status: string;
        emailsSent: number;
        openRate: number;
        clickRate: number;
        sendTime: string;
      }>;
    }>
  > {
    const limit = filters?.limit || 10;
    const page = filters?.page || 1;
    const offset = (page - 1) * limit;

    const params: ReportListQuery = {
      count: limit,
      offset: offset,
      sort_field: "send_time",
      sort_dir: "DESC",
    };

    // Apply date filtering
    if (filters?.dateRange) {
      const dateParams = this.convertDateFilter(filters.dateRange);
      if (dateParams.since_send_time) {
        params.since_send_time = dateParams.since_send_time;
      }
      if (dateParams.before_send_time) {
        params.before_send_time = dateParams.before_send_time;
      }
    }

    // Apply campaign type filtering
    if (filters?.campaignType) {
      // Type assertion to ensure it's a valid campaign type
      if (
        ["regular", "plaintext", "absplit", "rss", "variate"].includes(
          filters.campaignType,
        )
      ) {
        params.type = filters.campaignType as
          | "regular"
          | "plaintext"
          | "absplit"
          | "rss"
          | "variate";
      }
    }

    const reportsResponse = await this.getCampaignReports(params);

    if (!reportsResponse.success || !reportsResponse.data) {
      return {
        success: false,
        error: reportsResponse.error || "Failed to fetch campaign reports",
        statusCode: reportsResponse.statusCode,
      };
    }

    const reports = reportsResponse.data.reports;
    const sentReports = reports.filter((r) => r.emails_sent > 0);

    // Calculate aggregated metrics
    const totalEmailsSent = reports.reduce((sum, r) => sum + r.emails_sent, 0);
    const avgOpenRate =
      sentReports.length > 0
        ? sentReports.reduce((sum, r) => sum + r.opens.open_rate, 0) /
          sentReports.length
        : 0;
    const avgClickRate =
      sentReports.length > 0
        ? sentReports.reduce((sum, r) => sum + r.clicks.click_rate, 0) /
          sentReports.length
        : 0;

    return {
      success: true,
      data: {
        totalCampaigns: reportsResponse.data.total_items,
        filteredCount:
          filters?.dateRange || filters?.campaignType
            ? reports.length
            : undefined,
        sentCampaigns: sentReports.length,
        avgOpenRate: Math.round(avgOpenRate * 10000) / 100, // Convert to percentage with 2 decimals
        avgClickRate: Math.round(avgClickRate * 10000) / 100,
        totalEmailsSent,
        recentCampaigns: reports.map((report) => ({
          id: report.id,
          title: report.campaign_title,
          status: "sent", // Reports are only available for sent campaigns
          emailsSent: report.emails_sent,
          openRate: Math.round(report.opens.open_rate * 10000) / 100,
          clickRate: Math.round(report.clicks.click_rate * 10000) / 100,
          sendTime: report.send_time,
        })),
      },
      rateLimit: this.rateLimit,
    };
  }

  /**
   * Get audience (list) summary for dashboard
   */
  async getAudienceSummary(): Promise<
    ApiResponse<{
      totalLists: number;
      totalSubscribers: number;
      avgGrowthRate: number;
      avgOpenRate: number;
      avgClickRate: number;
      topLists: Array<{
        id: string;
        name: string;
        memberCount: number;
        growthRate: number;
        openRate: number;
        clickRate: number;
      }>;
    }>
  > {
    const listsResponse = await this.getLists({ count: 50 }); // Get up to 50 lists

    if (!listsResponse.success || !listsResponse.data) {
      return {
        success: false,
        error: listsResponse.error || "Failed to fetch audience lists",
        statusCode: listsResponse.statusCode,
      };
    }

    const lists = listsResponse.data.lists;
    const totalSubscribers = lists.reduce(
      (sum, l) => sum + l.stats.member_count,
      0,
    );
    const avgGrowthRate =
      lists.length > 0
        ? lists.reduce((sum, l) => sum + (l.stats.avg_sub_rate || 0), 0) /
          lists.length
        : 0;
    const avgOpenRate =
      lists.length > 0
        ? lists.reduce((sum, l) => sum + (l.stats.open_rate || 0), 0) /
          lists.length
        : 0;
    const avgClickRate =
      lists.length > 0
        ? lists.reduce((sum, l) => sum + (l.stats.click_rate || 0), 0) /
          lists.length
        : 0;

    // Sort lists by member count for top lists
    const sortedLists = [...lists].sort(
      (a, b) => b.stats.member_count - a.stats.member_count,
    );

    return {
      success: true,
      data: {
        totalLists: listsResponse.data.total_items,
        totalSubscribers,
        avgGrowthRate: Math.round(avgGrowthRate * 10000) / 100,
        avgOpenRate: Math.round(avgOpenRate * 10000) / 100,
        avgClickRate: Math.round(avgClickRate * 10000) / 100,
        topLists: sortedLists.slice(0, 5).map((list) => ({
          id: list.id,
          name: list.name,
          memberCount: list.stats.member_count,
          growthRate: Math.round((list.stats.avg_sub_rate || 0) * 10000) / 100,
          openRate: Math.round((list.stats.open_rate || 0) * 10000) / 100,
          clickRate: Math.round((list.stats.click_rate || 0) * 10000) / 100,
        })),
      },
      rateLimit: this.rateLimit,
    };
  }
}
