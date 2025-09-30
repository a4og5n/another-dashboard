/**
 * Mailchimp Campaign Report Types
 * TypeScript type definitions for campaign report functionality
 *
 * Issue #135: Campaign report type definitions
 * Endpoint: GET /reports/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */
import { z } from "zod";
import {
  ReportPathParamsSchema,
  ReportQueryParamsSchema,
} from "@/schemas/mailchimp/report-params.schema";
import { ReportSuccessSchema } from "@/schemas/mailchimp/report-success.schema";
import { ReportErrorSchema } from "@/schemas/mailchimp/report-error.schema";

// Parameter types
export type ReportPathParams = z.infer<typeof ReportPathParamsSchema>;
export type ReportQueryParams = z.infer<typeof ReportQueryParamsSchema>;

// Response types
export type ReportSuccess = z.infer<typeof ReportSuccessSchema>;
export type ReportError = z.infer<typeof ReportErrorSchema>;

// Alias for CampaignReport (commonly used name)
export type CampaignReport = ReportSuccess;
