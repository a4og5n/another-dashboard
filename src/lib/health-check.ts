/**
 * Health Check Utilities
 * Centralized health check functionality for API services
 */

import { mailchimpDAL } from "@/dal/mailchimp.dal";

export interface HealthCheckResult {
  service: string;
  success: boolean;
  error?: string;
}

/**
 * Health check all configured services
 * Used by the /api/health endpoint
 *
 * @returns Array of health check results for each service
 */
export async function healthCheckAllServices(): Promise<HealthCheckResult[]> {
  try {
    const result = await mailchimpDAL.healthCheck();
    return [
      {
        service: "mailchimp",
        success: result.success,
        error: result.error,
      },
    ];
  } catch (error) {
    return [
      {
        service: "mailchimp",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    ];
  }
}
