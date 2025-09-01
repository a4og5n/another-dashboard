import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";
import { MailchimpAudienceQuerySchema } from "@/schemas/mailchimp";
import { transformQueryParams } from "@/utils/mailchimp/query-params";
import { ValidationError } from "@/actions/mailchimp-audiences";

/**
 * Mailchimp Audiences (Lists) API
 *
 * GET /api/mailchimp/audiences - Get all audiences/lists
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Convert all search params to object for validation
    // This allows the schema to reject unsupported parameters (Issues #95, #96)
    const allParams = Object.fromEntries(searchParams.entries());

    // Only pass non-empty values for validation
    const cleanedParams = Object.fromEntries(
      Object.entries(allParams).filter(([, value]) => value !== ""),
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
