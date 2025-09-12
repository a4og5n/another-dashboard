/**
 * Mailchimp Campaign Open List Types
 * TypeScript type definitions for campaign open list functionality
 *
 * Issue #135: Campaign open list type definitions
 * Endpoint: GET /reports/{campaign_id}/open-details
 * Documentation: https://mailchimp.com/developer/marketing/api/open-reports/list-campaign-open-details/
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */
import { z } from "zod";
import {
  OpenListPathParamsSchema,
  OpenListQueryParamsSchema,
  SORT_DIRECTIONS,
} from "@/schemas/mailchimp/report-open-list-params.schema";
import { ReportOpenListSuccessSchema } from "@/schemas/mailchimp/report-open-list-success.schema";
import { OpenListErrorSchema } from "@/schemas/mailchimp/report-open-list-error.schema";
import { CampaignListMemberReportSchema } from "@/schemas/mailchimp/common/report-list-member.schema";

// Parameter types
export type OpenListPathParams = z.infer<typeof OpenListPathParamsSchema>;
export type OpenListQueryParams = z.infer<typeof OpenListQueryParamsSchema>;

// Response types
export type ReportOpenListSuccess = z.infer<typeof ReportOpenListSuccessSchema>;
export type OpenListError = z.infer<typeof OpenListErrorSchema>;
export type ReportOpenListMember = z.infer<
  typeof CampaignListMemberReportSchema
>;

// Enum types
export type SortDirection = (typeof SORT_DIRECTIONS)[number];
