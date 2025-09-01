import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";
import {
  MailchimpAudienceQuerySchema,
  transformQueryParams,
} from "@/schemas/mailchimp";
import { ValidationError } from "@/actions/mailchimp-audiences";

/**
 * Mailchimp Audiences (Lists) API
 *
 * GET /api/mailchimp/audiences - Get all audiences/lists
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters as plain object
    const queryParams = {
      fields: searchParams.get("fields") || undefined,
      exclude_fields: searchParams.get("exclude_fields") || undefined,
      count: searchParams.get("count") || undefined,
      offset: searchParams.get("offset") || undefined,
      before_date_created: searchParams.get("before_date_created") || undefined,
      since_date_created: searchParams.get("since_date_created") || undefined,
      before_campaign_last_sent:
        searchParams.get("before_campaign_last_sent") || undefined,
      since_campaign_last_sent:
        searchParams.get("since_campaign_last_sent") || undefined,
      email: searchParams.get("email") || undefined,
      sort_field: searchParams.get("sort_field") || undefined,
      sort_dir: searchParams.get("sort_dir") || undefined,
    };

    // Remove undefined values to let schema apply defaults
    const cleanedParams = Object.fromEntries(
      Object.entries(queryParams).filter(([, value]) => value !== undefined),
    );

    // Validate query parameters using centralized schema
    const validatedQuery = MailchimpAudienceQuerySchema.parse(cleanedParams);

    // Transform comma-separated fields to arrays for service layer
    const serviceParams = transformQueryParams(validatedQuery);

    const mailchimp = getMailchimpService();

    const response = await mailchimp.getLists(serviceParams);

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
        query: validatedQuery,
        lastUpdated: new Date().toISOString(),
        rateLimit: response.rateLimit,
      },
    });
  } catch (error) {
    console.error("Mailchimp audiences API error:", error);

    // Handle validation errors with clear messages
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: error.message,
          validation_errors: error.details,
        },
        { status: 400 },
      );
    }

    // Handle Zod validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ZodError"
    ) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: "Query parameters failed validation",
          validation_errors: error,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
