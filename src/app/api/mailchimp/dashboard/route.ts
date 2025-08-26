import { z } from "zod";
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
  // Pagination schema (limit = pageSize for consistency with service)
  const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  });

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit") || searchParams.get("pageSize");
  const campaignType = searchParams.get("type") || undefined;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Validate date format (ISO yyyy-mm-dd) FIRST
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (
    typeof startDate === "string" &&
    startDate.length > 0 &&
    !dateRegex.test(startDate)
  ) {
    return NextResponse.json(
      { error: "Invalid 'startDate' format. Use yyyy-mm-dd." },
      { status: 400 },
    );
  }
  if (
    typeof endDate === "string" &&
    endDate.length > 0 &&
    !dateRegex.test(endDate)
  ) {
    return NextResponse.json(
      { error: "Invalid 'endDate' format. Use yyyy-mm-dd." },
      { status: 400 },
    );
  }

  // Validate pagination params
  const result = paginationSchema.safeParse({
    page: pageParam,
    limit: limitParam,
  });
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid pagination parameters",
        details: result.error.issues,
      },
      { status: 400 },
    );
  }
  const { page, limit } = result.data;

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
