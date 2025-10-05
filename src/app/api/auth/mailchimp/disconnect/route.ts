import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/db/repositories/mailchimp-connection";

/**
 * POST /api/auth/mailchimp/disconnect
 * Disconnect Mailchimp account (soft delete - mark inactive)
 */
export async function POST() {
  try {
    // 1. Verify user is authenticated
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 },
      );
    }

    // 2. Deactivate connection (soft delete)
    const deactivated = await mailchimpConnectionRepo.deactivate(user.id);

    if (!deactivated) {
      return NextResponse.json(
        { error: "No active connection found" },
        { status: 404 },
      );
    }

    // 3. Return success
    return NextResponse.json({
      success: true,
      message: "Mailchimp connection disconnected successfully",
    });
  } catch (error) {
    console.error("Disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Mailchimp" },
      { status: 500 },
    );
  }
}
