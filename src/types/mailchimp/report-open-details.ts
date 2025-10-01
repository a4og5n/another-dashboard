/**
 * Mailchimp Report Open List Types
 * TypeScript type definitions for report open list functionality
 *
 * Issue #135: Report open list type definitions
 * Endpoint: GET /reports/{campaign_id}/open-details
 * Documentation: https://mailchimp.com/developer/marketing/api/open-reports/list-campaign-open-details/
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */
import { z } from "zod";
import {
  OpenListPathParamsSchema,
  OpenListQueryParamsSchema,
  OPEN_DETAILS_SORT_DIRECTIONS,
} from "@/schemas/mailchimp/report-open-details-params.schema";
import { ReportOpenListSuccessSchema } from "@/schemas/mailchimp/report-open-details-success.schema";
import { OpenListErrorSchema } from "@/schemas/mailchimp/report-open-details-error.schema";
import { ReportListMemberSchema } from "@/schemas/mailchimp/common/report-list-member.schema";

// Parameter types
export type OpenListPathParams = z.infer<typeof OpenListPathParamsSchema>;
export type OpenListQueryParams = z.infer<typeof OpenListQueryParamsSchema>;

// Response types
export type ReportOpenListSuccess = z.infer<typeof ReportOpenListSuccessSchema>;
export type OpenListError = z.infer<typeof OpenListErrorSchema>;
export type ReportOpenListMember = z.infer<typeof ReportListMemberSchema>;

// Enum types
export type SortDirection = (typeof OPEN_DETAILS_SORT_DIRECTIONS)[number];
