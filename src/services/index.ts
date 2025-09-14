/**
 * API Services Index
 * Central export point for all API services
 */

export { BaseApiService, ApiServiceFactory } from "@/services/base-api.service";
export type {
  ApiResponse,
  RateLimitInfo,
  HttpClientConfig,
} from "@/services/base-api.service";

export { MailchimpService } from "@/services/mailchimp.service";
export type { MailchimpCampaignReport } from "@/services/mailchimp.service";

export { AuthService, authService } from "@/services/auth.service";

// Re-export these types from their new location for backward compatibility
export type { MailchimpList, MailchimpListsQuery } from "@/types/mailchimp";

// Service factory instances
import { MailchimpService } from "@/services/mailchimp.service";
import { ApiServiceFactory } from "@/services/base-api.service";

/**
 * Get Mailchimp service instance (singleton)
 */
export const getMailchimpService = () => {
  return ApiServiceFactory.getInstance(
    "mailchimp",
    () => new MailchimpService(),
  );
};

/**
 * Service registry for type safety and IDE support
 */
export const services = {
  mailchimp: getMailchimpService,
} as const;

/**
 * Service type helpers
 */
export type ServiceName = keyof typeof services;
export type ServiceInstance<T extends ServiceName> = ReturnType<
  (typeof services)[T]
>;

/**
 * Helper to get any service by name
 */
export function getService<T extends ServiceName>(name: T): ServiceInstance<T> {
  return services[name]() as ServiceInstance<T>;
}

/**
 * Health check all services
 */
export async function healthCheckAllServices() {
  const results = await Promise.allSettled(
    Object.entries(services).map(async ([name, factory]) => {
      const service = factory();
      const result = await service.healthCheck();
      return { name, result };
    }),
  );

  return results.map((result, index) => {
    const serviceName = Object.keys(services)[index];

    if (result.status === "fulfilled") {
      return {
        service: serviceName,
        ...result.value.result,
      };
    } else {
      return {
        service: serviceName,
        success: false,
        error: result.reason?.message || "Unknown error",
      };
    }
  });
}
