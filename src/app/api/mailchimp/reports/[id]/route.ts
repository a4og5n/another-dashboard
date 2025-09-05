/**
 * Mailchimp Campaign Report Detail API Route
 * Handles fetching individual campaign report data
 *
 * Issue #135: Campaign report detail API route
 * Following Next.js App Router patterns and existing route structure
 */

import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // Parse optional query parameters
    const queryParams = {
      fields: searchParams.get("fields") || undefined,
      exclude_fields: searchParams.get("exclude_fields") || undefined,
    };

    // Get Mailchimp service and fetch campaign report
    const mailchimp = getMailchimpService();
    const response = await mailchimp.getCampaignReport(id, queryParams);

    if (!response.success) {
      // Handle specific error cases
      if (response.statusCode === 404) {
        return NextResponse.json(
          {
            error: "Campaign report not found",
            details: `No campaign report found with ID: ${id}`,
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: response.error || "Failed to fetch campaign report",
          details: "Mailchimp service error",
        },
        { status: response.statusCode || 500 },
      );
    }

    if (!response.data) {
      return NextResponse.json(
        {
          error: "Invalid response format",
          details: "No data received from Mailchimp service",
        },
        { status: 500 },
      );
    }

    // Return successful response with campaign report data
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Campaign report API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
