/**
 * Mailchimp Campaigns API Route
 * Handles GET requests for Mailchimp campaign reports and details.
 *
 * - Validates query parameters using Zod schemas
 * - Centralizes error handling and response formatting
 * - Uses MailchimpService for external API calls
 *
 * @see src/schemas/mailchimp-campaigns.ts for validation schema
 * @see src/actions/mailchimp-campaigns.ts for validation and error handling
 * @see src/services/mailchimp.service.ts for Mailchimp API integration
 */
import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";
import {
  validateMailchimpCampaignsQuery,
  ValidationError,
} from "@/actions/mailchimp-campaigns";

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
    const response = reports
      ? await mailchimp.getCampaignReports(query)
      : await mailchimp.getCampaigns(query);

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
