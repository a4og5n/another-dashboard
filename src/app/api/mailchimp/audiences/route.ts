import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";

/**
 * Mailchimp Audiences (Lists) API
 *
 * GET /api/mailchimp/audiences - Get all audiences/lists
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const count = parseInt(searchParams.get("count") || "25", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const fields = searchParams.get("fields") || undefined;
    const excludeFields = searchParams.get("exclude_fields") || undefined;

    const mailchimp = getMailchimpService();

    const params = {
      count,
      offset,
      fields: fields ? fields.split(",") : undefined,
      exclude_fields: excludeFields ? excludeFields.split(",") : undefined,
    };

    const response = await mailchimp.getLists(params);

    if (!response.success) {
      return NextResponse.json(
        {
          error: "Failed to fetch audiences",
          details: response.error,
        },
        { status: response.statusCode || 500 },
      );
    }

    return NextResponse.json({
      ...response.data,
      metadata: {
        count,
        offset,
        fields,
        excludeFields,
        lastUpdated: new Date().toISOString(),
        rateLimit: response.rateLimit,
      },
    });
  } catch (error) {
    console.error("Mailchimp audiences API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
