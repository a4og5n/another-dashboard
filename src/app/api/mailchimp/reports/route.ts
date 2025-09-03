/**
 * Mailchimp Reports API Route
 * Handles fetching campaign reports with pagination and filtering
 *
 * Issue #127: Reports API endpoint following App Router patterns
 * Based on dashboard API route with proper error handling
 */

import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = {
      count: parseInt(
        searchParams.get("limit") || searchParams.get("perPage") || "20",
      ),
      offset: parseInt(searchParams.get("offset") || "0"),
      type: searchParams.get("type") || undefined,
      before_send_time: searchParams.get("before_send_time") || undefined,
      since_send_time: searchParams.get("since_send_time") || undefined,
    };

    // Calculate offset from page if provided
    const page = parseInt(searchParams.get("page") || "1");
    queryParams.offset = (page - 1) * queryParams.count;

    // Get Mailchimp service and fetch reports
    const mailchimp = getMailchimpService();
    const response = await mailchimp.getCampaignReports(queryParams);

    if (!response.success) {
      return NextResponse.json(
        {
          error: response.error || "Failed to fetch campaign reports",
          details: "Mailchimp service error",
        },
        { status: 500 },
      );
    }

    // Return successful response with reports data
    return NextResponse.json({
      reports: response.data?.reports || [],
      total_items: response.data?.total_items || 0,
    });
  } catch (error) {
    console.error("Reports API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
