/**
 * Mailchimp Reports API Service
 * Handles campaign performance data, audience insights, and reporting metrics
 */

import { BaseApiService, ApiResponse } from "./base-api.service";
import { env } from "@/lib/config";
import { CampaignFilters, DateFilter } from "@/types/campaign-filters";
import { format } from "date-fns";
import type { MailchimpRoot, MailchimpRootQuery } from "@/types/mailchimp";

/**
 * Mailchimp API Types
 */
export interface MailchimpCampaign {
  id: string;
  web_id: number;
  type: string;
  create_time: string;
  archive_url: string;
  long_archive_url: string;
  status: "save" | "paused" | "schedule" | "sending" | "sent";
  emails_sent: number;
  send_time: string;
  content_type: string;
  needs_block_refresh: boolean;
  resendable: boolean;
  recipients: {
    list_id: string;
    list_is_active: boolean;
    list_name: string;
    segment_text: string;
    recipient_count: number;
    segment_opts?: Record<string, unknown>;
  };
  settings: {
    subject_line: string;
    preview_text: string;
    title: string;
    from_name: string;
    reply_to: string;
    use_conversation: boolean;
    to_name: string;
    folder_id: string;
    authenticate: boolean;
    auto_footer: boolean;
    inline_css: boolean;
    auto_tweet: boolean;
    drag_and_drop: boolean;
    fb_comments: boolean;
    timewarp: boolean;
    template_id: number;
  };
  tracking: {
    opens: boolean;
    html_clicks: boolean;
    text_clicks: boolean;
    goal_tracking: boolean;
    ecomm360: boolean;
    google_analytics: string;
    clicktale: string;
  };
}

export interface MailchimpCampaignReport {
  id: string;
  campaign_title: string;
  type: string;
  list_id: string;
  list_is_active: boolean;
  list_name: string;
  subject_line: string;
  preview_text: string;
  emails_sent: number;
  abuse_reports: number;
  unsubscribed: number;
  send_time: string;
  rss_last_send?: string;
  bounces: {
    hard_bounces: number;
    soft_bounces: number;
    syntax_errors: number;
  };
  forwards: {
    forwards_count: number;
    forwards_opens: number;
  };
  opens: {
    opens_total: number;
    unique_opens: number;
    open_rate: number;
    last_open: string;
  };
  clicks: {
    clicks_total: number;
    unique_clicks: number;
    unique_subscriber_clicks: number;
    click_rate: number;
    last_click: string;
  };
  facebook_likes: {
    recipient_likes: number;
    unique_likes: number;
    facebook_likes: number;
  };
  industry_stats: {
    type: string;
    open_rate: number;
    click_rate: number;
    bounce_rate: number;
    unopen_rate: number;
    unsub_rate: number;
    abuse_rate: number;
  };
  list_stats: {
    sub_rate: number;
    unsub_rate: number;
    open_rate: number;
    click_rate: number;
  };
  ab_split?: {
    a: Record<string, unknown>;
    b: Record<string, unknown>;
  };
  timewarp?: Record<string, unknown>[];
  timeseries?: Record<string, unknown>[];
  share_report: {
    share_url: string;
    share_password: string;
  };
  ecommerce: {
    total_orders: number;
    total_spent: number;
    total_revenue: number;
  };
  delivery_status: {
    enabled: boolean;
    can_cancel: boolean;
    status: string;
    emails_sent: number;
    emails_canceled: number;
  };
}

export interface MailchimpList {
  // Core documented fields
  id: string;
  name: string;

  contact: {
    company: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };

  permission_reminder: string;
  use_archive_bar: boolean;
  email_type_option: boolean;
  visibility: "pub" | "prv";
  date_created: string;
  list_rating: number;

  campaign_defaults: {
    from_name: string;
    from_email: string;
    subject: string;
    language: string;
  };

  notify_on_subscribe?: string;
  notify_on_unsubscribe?: string;
  modules?: string[];

  stats: {
    member_count: number;
    unsubscribe_count: number;
    cleaned_count: number;
    total_contacts?: number;
    member_count_since_send?: number;
    unsubscribe_count_since_send?: number;
    cleaned_count_since_send?: number;
    campaign_count?: number;
    campaign_last_sent?: string;
    merge_field_count?: number;
    avg_sub_rate?: number;
    avg_unsub_rate?: number;
    target_sub_rate?: number;
    open_rate?: number;
    click_rate?: number;
    last_sub_date?: string;
    last_unsub_date?: string;
  };

  // Questionable fields - keeping as optional for backward compatibility
  // These are not used in current mapping and may not exist in real API
  web_id?: number;
  subscribe_url_short?: string;
  subscribe_url_long?: string;
  beamer_address?: string;
  double_optin?: boolean;
  has_welcome?: boolean;
  marketing_permissions?: boolean;
}

export interface MailchimpReportsParams {
  fields?: string[];
  exclude_fields?: string[];
  count?: number;
  offset?: number;
  type?: string;
  before_send_time?: string;
  since_send_time?: string;
  folder_id?: string;
  member_id?: string;
  list_id?: string;
  sort_field?: string;
  sort_dir?: "ASC" | "DESC";
}

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
  async getCampaigns(params?: MailchimpReportsParams): Promise<
    ApiResponse<{
      campaigns: MailchimpCampaign[];
      total_items: number;
    }>
  > {
    // Convert MailchimpReportsParams to base service format
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
   */
  async getCampaignReport(
    campaignId: string,
  ): Promise<ApiResponse<MailchimpCampaignReport>> {
    return this.get(`/reports/${campaignId}`);
  }

  /**
   * Get all campaign reports
   */
  async getCampaignReports(params?: MailchimpReportsParams): Promise<
    ApiResponse<{
      reports: MailchimpCampaignReport[];
      total_items: number;
    }>
  > {
    // Convert MailchimpReportsParams to base service format
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

    return this.get("/reports", queryParams);
  }

  /**
   * Get all lists (audiences)
   */
  async getLists(
    params?: Pick<
      MailchimpReportsParams,
      "fields" | "exclude_fields" | "count" | "offset"
    >,
  ): Promise<
    ApiResponse<{
      lists: MailchimpList[];
      total_items: number;
    }>
  > {
    // Convert to base service format
    const queryParams: Record<string, string | number | boolean | string[]> =
      {};
    if (params) {
      if (params.fields) queryParams.fields = params.fields;
      if (params.exclude_fields)
        queryParams.exclude_fields = params.exclude_fields;
      if (params.count) queryParams.count = params.count;
      if (params.offset) queryParams.offset = params.offset;
    }

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

    const params: MailchimpReportsParams = {
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
      params.type = filters.campaignType;
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
