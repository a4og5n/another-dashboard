import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";
import { CampaignFilters } from "@/types/campaign-filters";

/**
 * Mailchimp Dashboard API
 * Returns summarized data for the dashboard
 *
 * GET /api/mailchimp/dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const campaignType = searchParams.get("type") || undefined;

    // Date range parameters (presets are UI-only, not sent to API)
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const filters: CampaignFilters = {
      limit,
      page,
      campaignType,
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      filters.dateRange = {
        startDate: startDate
          ? new Date(startDate + "T00:00:00.000Z")
          : undefined,
        endDate: endDate ? new Date(endDate + "T23:59:59.999Z") : undefined,
        // No preset needed - we only care about actual date ranges
      };
    }

    const mailchimp = getMailchimpService();

    // Fetch campaign and audience data in parallel
    const [campaignSummary, audienceSummary] = await Promise.all([
      mailchimp.getCampaignSummary(filters),
      mailchimp.getAudienceSummary(),
    ]);

    if (!campaignSummary.success) {
      return NextResponse.json(
        {
          error: "Failed to fetch campaign data",
          details: campaignSummary.error,
        },
        { status: 500 },
      );
    }

    if (!audienceSummary.success) {
      return NextResponse.json(
        {
          error: "Failed to fetch audience data",
          details: audienceSummary.error,
        },
        { status: 500 },
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
