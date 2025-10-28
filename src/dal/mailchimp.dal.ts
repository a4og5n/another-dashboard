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
import { automationsQueryParamsSchema } from "@/schemas/mailchimp/automations-params.schema";
import { automationsSuccessSchema } from "@/schemas/mailchimp/automations-success.schema";
import { clickListQueryParamsSchema } from "@/schemas/mailchimp/reports/click-details/params.schema";
import { reportClickListSuccessSchema } from "@/schemas/mailchimp/reports/click-details/success.schema";
import { unsubscribesSuccessSchema } from "@/schemas/mailchimp/reports/unsubscribes/success.schema";
import { emailActivityQueryParamsSchema } from "@/schemas/mailchimp/reports/email-activity/params.schema";
import { emailActivitySuccessSchema } from "@/schemas/mailchimp/reports/email-activity/success.schema";
import { sentToQueryParamsSchema } from "@/schemas/mailchimp/reports/sent-to/params.schema";
import { sentToSuccessSchema } from "@/schemas/mailchimp/reports/sent-to/success.schema";
import { locationActivityQueryParamsSchema } from "@/schemas/mailchimp/reports/location-activity/params.schema";
import { locationActivitySuccessSchema } from "@/schemas/mailchimp/reports/location-activity/success.schema";
import { campaignAdviceQueryParamsSchema } from "@/schemas/mailchimp/reports/advice/params.schema";
import { campaignAdviceSuccessSchema } from "@/schemas/mailchimp/reports/advice/success.schema";
import { domainPerformanceSuccessSchema } from "@/schemas/mailchimp/reports/domain-performance/success.schema";
import { listActivityQueryParamsSchema } from "@/schemas/mailchimp/lists/activity/params.schema";
import { listActivitySuccessSchema } from "@/schemas/mailchimp/lists/activity/success.schema";
import { growthHistoryQueryParamsSchema } from "@/schemas/mailchimp/lists/growth-history/params.schema";
import { growthHistorySuccessSchema } from "@/schemas/mailchimp/lists/growth-history/success.schema";
import { listLocationsQueryParamsSchema } from "@/schemas/mailchimp/lists/locations/params.schema";
import { listLocationsSuccessSchema } from "@/schemas/mailchimp/lists/locations/success.schema";
import { listInterestCategoriesQueryParamsSchema } from "@/schemas/mailchimp/lists/interest-categories/params.schema";
import { listInterestCategoriesSuccessSchema } from "@/schemas/mailchimp/lists/interest-categories/success.schema";
import { listInterestsQueryParamsSchema } from "@/schemas/mailchimp/lists/interest-categories/[interest_category_id]/interests/params.schema";
import { listInterestsSuccessSchema } from "@/schemas/mailchimp/lists/interest-categories/[interest_category_id]/interests/success.schema";
import { interestCategoryInfoQueryParamsSchema } from "@/schemas/mailchimp/lists/interest-categories/[interest_category_id]/params.schema";
import { interestCategoryInfoSuccessSchema } from "@/schemas/mailchimp/lists/interest-categories/[interest_category_id]/success.schema";

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

  /**
   * List Activity
   * GET /lists/{list_id}/activity
   */
  async fetchListActivity(
    listId: string,
    params?: z.infer<typeof listActivityQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof listActivitySuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof listActivitySuccessSchema>>(
        `/lists/${listId}/activity`,
        params,
      ),
    );
  }

  /**
   * List Growth History
   * GET /lists/{list_id}/growth-history
   */
  async fetchListGrowthHistory(
    id: string,
    params?: z.infer<typeof growthHistoryQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof growthHistorySuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof growthHistorySuccessSchema>>(
        `/lists/${id}/growth-history`,
        params as Record<string, unknown>,
      ),
    );
  }

  /**
   * List Locations
   * GET /lists/{list_id}/locations
   *
   * @param id - List ID
   * @param params - Query parameters for field filtering
   * @returns Geographic distribution of subscribers by country
   */
  async fetchListLocations(
    id: string,
    params?: z.infer<typeof listLocationsQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof listLocationsSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof listLocationsSuccessSchema>>(
        `/lists/${id}/locations`,
        params as Record<string, unknown>,
      ),
    );
  }

  /**
   * List Members
   * GET /lists/{list_id}/members
   *
   * @param id - List ID
   * @param params - Query parameters for filtering, sorting, and pagination
   * @returns List members with engagement statistics
   */
  async fetchListMembers(
    id: string,
    params?: z.infer<
      typeof import("@/schemas/mailchimp/lists/members/params.schema").listMembersQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/lists/members/success.schema").listMembersSuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/lists/members/success.schema").listMembersSuccessSchema
        >
      >(`/lists/${id}/members`, params),
    );
  }

  /**
   * Member Profile
   * GET /lists/{list_id}/members/{subscriber_hash}
   */
  async fetchMemberInfo(
    listId: string,
    subscriberHash: string,
    params?: z.infer<
      typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/params.schema").memberInfoQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/success.schema").memberInfoSuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/success.schema").memberInfoSuccessSchema
        >
      >(`/lists/${listId}/members/${subscriberHash}`, params),
    );
  }

  /**
   * Fetch Member Tags
   * GET /lists/{list_id}/members/{subscriber_hash}/tags
   *
   * @param listId - List ID
   * @param subscriberHash - MD5 hash of lowercase email address
   * @param params - Query parameters (fields, exclude_fields, count, offset)
   * @returns Paginated list of tags assigned to the member
   */
  async fetchMemberTags(
    listId: string,
    subscriberHash: string,
    params?: z.infer<
      typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/tags/params.schema").memberTagsQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/tags/success.schema").memberTagsSuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/tags/success.schema").memberTagsSuccessSchema
        >
      >(`/lists/${listId}/members/${subscriberHash}/tags`, params),
    );
  }

  /**
   * Fetch Member Notes
   * GET /lists/{list_id}/members/{subscriber_hash}/notes
   *
   * @param listId - The unique ID for the list
   * @param subscriberHash - MD5 hash of the lowercase version of the list member's email address
   * @param params - Query parameters (count, offset, fields, exclude_fields, sort_field, sort_dir)
   * @returns Paginated list of notes for the member
   */
  async fetchMemberNotes(
    listId: string,
    subscriberHash: string,
    params?: z.infer<
      typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/notes/params.schema").memberNotesQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/notes/success.schema").memberNotesSuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/notes/success.schema").memberNotesSuccessSchema
        >
      >(`/lists/${listId}/members/${subscriberHash}/notes`, params),
    );
  }

  /**
   * Fetch Member Activity Feed
   * GET /lists/{list_id}/members/{subscriber_hash}/activity-feed
   *
   * @param listId - The unique ID for the list
   * @param subscriberHash - MD5 hash of the lowercase version of the list member's email address
   * @param params - Query parameters (fields, exclude_fields, count, offset, activity_filters)
   * @returns Paginated list of activity events for the member
   */
  async fetchMemberActivity(
    listId: string,
    subscriberHash: string,
    params?: z.infer<
      typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/activity/params.schema").memberActivityQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/activity/success.schema").memberActivitySuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/activity/success.schema").memberActivitySuccessSchema
        >
      >(`/lists/${listId}/members/${subscriberHash}/activity-feed`, params),
    );
  }

  /**
   * Fetch Member Goals
   * GET /lists/{list_id}/members/{subscriber_hash}/goals
   *
   * @param listId - The unique ID for the list
   * @param subscriberHash - MD5 hash of the lowercase version of the list member's email address
   * @param params - Query parameters (fields, exclude_fields)
   * @returns Last 50 goal events for the member
   */
  async fetchMemberGoals(
    listId: string,
    subscriberHash: string,
    params?: z.infer<
      typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/goals/params.schema").memberGoalsQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/goals/success.schema").memberGoalsSuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/lists/members/[subscriber_hash]/goals/success.schema").memberGoalsSuccessSchema
        >
      >(`/lists/${listId}/members/${subscriberHash}/goals`, params),
    );
  }

  /**
   * Search Members
   * GET /search-members
   *
   * @param params - Query parameters (query, list_id, fields, exclude_fields)
   * @returns Search results with exact matches and full text search results
   */
  async searchMembers(
    params: z.infer<
      typeof import("@/schemas/mailchimp/search-members-params.schema").searchMembersQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/search-members-success.schema").searchMembersSuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/search-members-success.schema").searchMembersSuccessSchema
        >
      >("/search-members", params),
    );
  }

  /**
   * List Segments
   * GET /lists/{list_id}/segments
   */
  async fetchListSegments(
    listId: string,
    params?: z.infer<
      typeof import("@/schemas/mailchimp/lists/segments/params.schema").listSegmentsQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/lists/segments/success.schema").listSegmentsSuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/lists/segments/success.schema").listSegmentsSuccessSchema
        >
      >(`/lists/${listId}/segments`, params),
    );
  }

  /**
   * List Members in Segment
   * GET /lists/{list_id}/segments/{segment_id}/members
   */
  async fetchSegmentMembers(
    listId: string,
    segmentId: string,
    params?: z.infer<
      typeof import("@/schemas/mailchimp/lists/segments/members/params.schema").segmentMembersQueryParamsSchema
    >,
  ): Promise<
    ApiResponse<
      z.infer<
        typeof import("@/schemas/mailchimp/lists/segments/members/success.schema").segmentMembersSuccessSchema
      >
    >
  > {
    return mailchimpApiCall((client) =>
      client.get<
        z.infer<
          typeof import("@/schemas/mailchimp/lists/segments/members/success.schema").segmentMembersSuccessSchema
        >
      >(`/lists/${listId}/segments/${segmentId}/members`, params),
    );
  }

  /**
   * Interest Categories
   * GET /lists/{list_id}/interest-categories
   */
  async fetchListInterestCategories(
    listId: string,
    params?: z.infer<typeof listInterestCategoriesQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof listInterestCategoriesSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof listInterestCategoriesSuccessSchema>>(
        `/lists/${listId}/interest-categories`,
        params,
      ),
    );
  }

  /**
   * Interest Category Info
   * GET /lists/{list_id}/interest-categories/{interest_category_id}
   */
  async fetchInterestCategoryInfo(
    listId: string,
    categoryId: string,
    params?: z.infer<typeof interestCategoryInfoQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof interestCategoryInfoSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof interestCategoryInfoSuccessSchema>>(
        `/lists/${listId}/interest-categories/${categoryId}`,
        params,
      ),
    );
  }

  /**
   * Interests in Category
   * GET /lists/{list_id}/interest-categories/{interest_category_id}/interests
   */
  async fetchListInterests(
    listId: string,
    categoryId: string,
    params?: z.infer<typeof listInterestsQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof listInterestsSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof listInterestsSuccessSchema>>(
        `/lists/${listId}/interest-categories/${categoryId}/interests`,
        params,
      ),
    );
  }

  /**
   * Fetch Automations
   * GET /automations
   *
   * @param params - Query parameters (fields, exclude_fields, count, offset, status, date filters)
   * @returns Paginated list of automation workflows
   */
  async fetchAutomations(
    params?: z.infer<typeof automationsQueryParamsSchema>,
  ): Promise<ApiResponse<z.infer<typeof automationsSuccessSchema>>> {
    return mailchimpApiCall((client) =>
      client.get<z.infer<typeof automationsSuccessSchema>>(
        "/automations",
        params,
      ),
    );
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const mailchimpDAL = new MailchimpDAL();
