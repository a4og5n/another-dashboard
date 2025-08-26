import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";

/**
 * Mailchimp Single Campaign API
 *
 * GET /api/mailchimp/campaigns/[id] - Get specific campaign
 * GET /api/mailchimp/campaigns/[id]?report=true - Get campaign report
 */
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id: campaignId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const getReport = searchParams.get("report") === "true";

    const mailchimp = getMailchimpService();

    const response = getReport
      ? await mailchimp.getCampaignReport(campaignId)
      : await mailchimp.getCampaign(campaignId);

    if (!response.success) {
      const status = response.statusCode === 404 ? 404 : 500;
      return NextResponse.json(
        {
          error: `Campaign ${getReport ? "report" : "data"} not found`,
          details: response.error,
        },
        { status },
      );
    }

    return NextResponse.json({
      ...response.data,
      metadata: {
        campaignId,
        type: getReport ? "report" : "campaign",
        lastUpdated: new Date().toISOString(),
        rateLimit: response.rateLimit,
      },
    });
  } catch (error) {
    console.error("Mailchimp campaign API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
