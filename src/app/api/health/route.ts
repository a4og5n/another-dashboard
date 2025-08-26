import { NextResponse } from "next/server";
import { healthCheckAllServices } from "@/services";

/**
 * API Health Check Endpoint
 * Tests connectivity to all configured API services
 *
 * GET /api/health
 */
export async function GET() {
  try {
    const healthResults = await healthCheckAllServices();

    const allHealthy = healthResults.every((result) => result.success);
    const status = allHealthy ? 200 : 503;

    return NextResponse.json(
      {
        status: allHealthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        services: healthResults,
      },
      { status },
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: [],
      },
      { status: 500 },
    );
  }
}
