/**
 * Mailchimp Campaign Report Detail Types
 * TypeScript type definitions for campaign report detail functionality
 *
 * Issue #135: Campaign report detail type definitions
 * Endpoint: GET /reports/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */
import { z } from "zod";
import {
  ReportDetailPathParamsSchema,
  ReportDetailQueryParamsSchema,
} from "@/schemas/mailchimp/report-detail-params.schema";
import { ReportDetailSuccessSchema } from "@/schemas/mailchimp/report-detail-success.schema";
import { ReportDetailErrorSchema } from "@/schemas/mailchimp/report-detail-error.schema";

// Parameter types
export type ReportDetailPathParams = z.infer<
  typeof ReportDetailPathParamsSchema
>;
export type ReportDetailQueryParams = z.infer<
  typeof ReportDetailQueryParamsSchema
>;

// Response types
export type ReportDetailSuccess = z.infer<typeof ReportDetailSuccessSchema>;
export type ReportDetailError = z.infer<typeof ReportDetailErrorSchema>;
