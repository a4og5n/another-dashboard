/**
 * Mailchimp Campaigns API Route
 *
 * Handles GET requests for Mailchimp campaign reports and details.
 *
 * - Validates query parameters using Zod schemas (see src/schemas/mailchimp-campaigns.ts)
 * - Centralized error handling: returns 400 for validation errors, 500 for internal errors
 * - Uses MailchimpService for external API calls
 * - Response includes campaign data and metadata (query, lastUpdated, rateLimit)
 *
 * ## Usage Example
 *   GET /api/mailchimp/campaigns?fields=id,type&count=10&reports=true
 *
 * ## Response Example
 *   {
 *     "reports": [ ... ],
 *     "metadata": {
 *       "fields": ["id", "type"],
 *       "count": 10,
 *       "lastUpdated": "2025-08-26T20:00:00Z",
 *       "rateLimit": { ... }
 *     }
 *   }
 *
 * @see .github/copilot-instructions.md for documentation standards
 */
import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";
import { ReportListQuery } from "@/types/mailchimp/reports";
import {
  validateMailchimpCampaignsQuery,
  ValidationError,
} from "@/actions/mailchimp-campaigns";
import { REPORT_TYPES } from "@/schemas/mailchimp/report-list-query.schema";
import { MAILCHIMP_CAMPAIGN_TYPES } from "@/schemas/mailchimp/campaign-list-response.schema";

/**
 * Mailchimp Campaigns API
 *
 * GET /api/mailchimp/campaigns - Get all campaigns
 * GET /api/mailchimp/campaigns?reports=true - Get campaign reports
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Convert URLSearchParams to a plain object
    const paramsObj: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      paramsObj[key] = value;
    }

    // Validate query params
    let query;
    try {
      query = validateMailchimpCampaignsQuery(paramsObj);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          {
            error: "Invalid query parameters",
            details: err.details,
          },
          { status: 400 },
        );
      }
      throw err;
    }

    const reports = searchParams.get("reports") === "true";
    const mailchimp = getMailchimpService();

    // Ensure query has properly typed 'type' field if present
    // For reports endpoint we need to filter to only valid report types
    if (query.type && typeof query.type === "string") {
      if (reports) {
        // When requesting reports, we need to use the REPORT_TYPES constant
        // Type guard check to ensure type is valid
        const queryTypeStr = query.type as string;
        const validType = REPORT_TYPES.some((type) => type === queryTypeStr);
        if (!validType) {
          query.type = undefined;
        }
        // Typescript casting to help the type system
        query.type = query.type as (typeof REPORT_TYPES)[number] | undefined;
      } else {
        // For regular campaigns, we can use any valid campaign type
        // Type guard check to ensure type is valid
        const queryTypeStr = query.type as string;
        const validType = MAILCHIMP_CAMPAIGN_TYPES.some(
          (type) => type === queryTypeStr,
        );
        if (!validType) {
          query.type = undefined;
        }
      }
    }

    let response;

    if (reports) {
      // For reports endpoint, create a new query object with the correct typing
      const reportsQuery: ReportListQuery = {
        ...query,
        // We've validated the type above, so this cast is safe
        type: query.type as (typeof REPORT_TYPES)[number] | undefined,
        // Ensure fields and exclude_fields are strings, not arrays
        fields: query.fields
          ? Array.isArray(query.fields)
            ? query.fields.join(",")
            : query.fields
          : undefined,
        exclude_fields: query.exclude_fields
          ? Array.isArray(query.exclude_fields)
            ? query.exclude_fields.join(",")
            : query.exclude_fields
          : undefined,
      };
      response = await mailchimp.getCampaignReports(reportsQuery);
    } else {
      // For campaigns endpoint - convert query to the required format
      // Type assertion to ReportListQuery is safe because we've already validated the fields
      const campaignsQuery: ReportListQuery = {
        ...query,
        // Ensure fields and exclude_fields are strings, not arrays
        fields: query.fields
          ? Array.isArray(query.fields)
            ? query.fields.join(",")
            : query.fields
          : undefined,
        exclude_fields: query.exclude_fields
          ? Array.isArray(query.exclude_fields)
            ? query.exclude_fields.join(",")
            : query.exclude_fields
          : undefined,
        // Ensure type is compatible with the expected report types
        type: query.type as (typeof REPORT_TYPES)[number] | undefined,
      };
      response = await mailchimp.getCampaigns(campaignsQuery);
    }

    if (!response.success) {
      return NextResponse.json(
        {
          error: "Failed to fetch campaigns",
          details: response.error,
        },
        { status: response.statusCode || 500 },
      );
    }

    return NextResponse.json({
      ...response.data,
      metadata: {
        ...query,
        lastUpdated: new Date().toISOString(),
        rateLimit: response.rateLimit,
      },
    });
  } catch (error) {
    console.error("Mailchimp campaigns API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
