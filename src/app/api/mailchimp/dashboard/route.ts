import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";
import { CampaignFilters } from "@/types/campaign-filters";
import {
  BadRequestError,
  NotFoundError,
  MailchimpApiError,
  InternalServerError,
} from "@/types/api-errors";

/**
 * Mailchimp Dashboard API
 * Returns summarized data for the dashboard
 *
 * GET /api/mailchimp/dashboard
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const campaignType = searchParams.get("type") || undefined;

  // Validate parameters explicitly
  if (isNaN(limit) || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: "Invalid 'limit' parameter" },
      { status: 400 },
    );
  }
  if (isNaN(page) || page < 1) {
    return NextResponse.json(
      { error: "Invalid 'page' parameter" },
      { status: 400 },
    );
  }

  // Date range parameters (presets are UI-only, not sent to API)
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Validate date format (ISO yyyy-mm-dd)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (startDate && !dateRegex.test(startDate)) {
    return NextResponse.json(
      { error: "Invalid 'startDate' format. Use yyyy-mm-dd." },
      { status: 400 },
    );
  }
  if (endDate && !dateRegex.test(endDate)) {
    return NextResponse.json(
      { error: "Invalid 'endDate' format. Use yyyy-mm-dd." },
      { status: 400 },
    );
  }

  const filters: CampaignFilters = {
    limit,
    page,
    campaignType,
  };

  // Add date range filter if provided
  if (startDate || endDate) {
    filters.dateRange = {
      startDate: startDate ? new Date(startDate + "T00:00:00.000Z") : undefined,
      endDate: endDate ? new Date(endDate + "T23:59:59.999Z") : undefined,
    };
  }

  const mailchimp = getMailchimpService();

  try {
    // Fetch campaign and audience data in parallel
    const [campaignSummary, audienceSummary] = await Promise.all([
      mailchimp.getCampaignSummary(filters),
      mailchimp.getAudienceSummary(),
    ]);

    if (!campaignSummary.success) {
      throw new MailchimpApiError(
        campaignSummary.error || "Failed to fetch campaign data",
      );
    }
    if (!audienceSummary.success) {
      throw new MailchimpApiError(
        audienceSummary.error || "Failed to fetch audience data",
      );
    }

    // Combine data for dashboard
    const dashboardData = {
      campaigns: campaignSummary.data,
      audiences: audienceSummary.data,
      appliedFilters: {
        dateRange: filters.dateRange,
        hasActiveFilters: !!(filters.dateRange || filters.campaignType),
      },
      metadata: {
        lastUpdated: new Date().toISOString(),
        rateLimit: campaignSummary.rateLimit || audienceSummary.rateLimit,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    if (
      error instanceof BadRequestError ||
      error instanceof NotFoundError ||
      error instanceof MailchimpApiError ||
      error instanceof InternalServerError
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("Mailchimp dashboard API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
