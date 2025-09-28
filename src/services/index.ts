/**
 * Services Index - Simplified for MVP
 * Just re-export the simple mailchimp setup
 */

// Export new service layer
export { MailchimpService, mailchimpService } from "@/services/mailchimp.service";

// Re-export simple Mailchimp SDK setup for backward compatibility
export { mailchimp, mailchimpCall, type ApiResponse } from "@/lib/mailchimp";

// Keep auth service export for compatibility
export { AuthService, authService } from "@/services/auth.service";

// Re-export types for backward compatibility
export type { MailchimpList, MailchimpListsQuery } from "@/types/mailchimp";

// Export campaign report type for backward compatibility
export type { CampaignReport as MailchimpCampaignReport } from "@/types/mailchimp";


/**
 * Health check all services - simplified
 */
export async function healthCheckAllServices() {
  try {
    // Import the service from the export above
    const { mailchimpService: service } = await import("@/services/mailchimp.service");
    const result = await service.healthCheck();
    return [{
      service: "mailchimp",
      success: result.success,
      error: result.error,
    }];
  } catch (error) {
    return [{
      service: "mailchimp", 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }];
  }
}