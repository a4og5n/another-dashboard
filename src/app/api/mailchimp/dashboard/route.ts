import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";
import { CampaignFilters } from "@/types/campaign-filters";
import { validateMailchimpDashboardQuery } from "@/actions/mailchimp-dashboard";

/**
 * Mailchimp Dashboard API
 * Returns summarized data for the dashboard
 *
 * GET /api/mailchimp/dashboard
 */
export async function GET(request: NextRequest) {
  // ...existing code...

  // Centralized validation using searchParams
  const searchParams = request.nextUrl.searchParams;
  const parseResult = validateMailchimpDashboardQuery(searchParams);

  if (!parseResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid query parameters",
        details: parseResult.error.issues,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  const {
    page,
    limit,
    startDate: validStartDate,
    endDate: validEndDate,
    campaignType: validCampaignType,
  } = parseResult.data;

  const filters: CampaignFilters = {
    limit,
    page,
    campaignType: validCampaignType,
  };

  // Add date range filter if provided
  if (validStartDate || validEndDate) {
    filters.dateRange = {
      startDate: validStartDate
        ? new Date(validStartDate + "T00:00:00.000Z")
        : undefined,
      endDate: validEndDate
        ? new Date(validEndDate + "T23:59:59.999Z")
        : undefined,
    };
  }

  const mailchimp = getMailchimpService();

  // Fetch campaign and audience data in parallel
  let campaignSummary, audienceSummary;
  try {
    [campaignSummary, audienceSummary] = await Promise.all([
      mailchimp.getCampaignSummary(filters),
      mailchimp.getAudienceSummary(),
    ]);
  } catch (error) {
    // Only catch truly unexpected errors (e.g., network failures)
    console.error("Mailchimp dashboard API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }

  // Handle expected errors explicitly
  if (!campaignSummary?.success) {
    return NextResponse.json(
      {
        error: campaignSummary?.error || "Failed to fetch campaign data",
      },
      { status: 502 },
    );
  }
  if (!audienceSummary?.success) {
    return NextResponse.json(
      {
        error: audienceSummary?.error || "Failed to fetch audience data",
      },
      { status: 502 },
    );
  }

  // Always return pagination metadata, even for error/mocked data
  const dashboardData = {
    campaigns: campaignSummary?.data?.recentCampaigns ?? [],
    audiences: audienceSummary?.data ?? {},
    pagination: {
      page,
      limit,
      total: campaignSummary?.data?.totalCampaigns ?? 0,
      totalPages: campaignSummary?.data?.totalCampaigns
        ? Math.ceil(campaignSummary.data.totalCampaigns / limit)
        : 1,
    },
    appliedFilters: {
      dateRange: filters.dateRange,
      hasActiveFilters: !!(filters.dateRange || filters.campaignType),
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      rateLimit: campaignSummary?.rateLimit || audienceSummary?.rateLimit,
    },
  };

  return NextResponse.json(dashboardData);
}
