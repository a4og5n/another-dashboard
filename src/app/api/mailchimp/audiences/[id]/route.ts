import { NextRequest, NextResponse } from "next/server";
import { getMailchimpService } from "@/services";
import {
  validateAudienceId,
  ValidationError,
} from "@/actions/mailchimp-audiences";

/**
 * Mailchimp Single Audience API
 *
 * GET /api/mailchimp/audiences/[id] - Get specific audience/list
 */
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id: listId } = await params;

    // Validate audience ID using centralized validation
    const validatedId = validateAudienceId(listId);

    const mailchimp = getMailchimpService();
    const response = await mailchimp.getList(validatedId);

    if (!response.success) {
      const status = response.statusCode === 404 ? 404 : 500;
      return NextResponse.json(
        {
          error: "Audience not found",
          details: response.error,
        },
        { status },
      );
    }

    return NextResponse.json({
      ...response.data,
      metadata: {
        listId: validatedId,
        lastUpdated: new Date().toISOString(),
        rateLimit: response.rateLimit,
      },
    });
  } catch (error) {
    console.error("Mailchimp audience API error:", error);

    // Handle validation errors for invalid audience ID
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: "Invalid audience ID",
          details: error.message,
          validation_errors: error.details,
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
