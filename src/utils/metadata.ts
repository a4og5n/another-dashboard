/**
 * Utility functions for Next.js metadata generation
 *
 * Provides helper functions for creating type-safe generateMetadata implementations.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

import type { GenerateMetadata } from "@/types/components/metadata";

/**
 * Helper function to create type-safe generateMetadata functions
 *
 * Provides type inference and autocomplete for metadata function parameters.
 * Supports custom parameter shapes through generics.
 *
 * @template TParams - Shape of the dynamic route parameters (default: { id: string })
 * @param fn - The metadata generation function
 * @returns Type-safe metadata function
 *
 * @example
 * ```tsx
 * // Simple usage with default { id: string } params
 * export const generateMetadata = createMetadataFunction(async ({ params }) => {
 *   const { id } = await params;
 *   return {
 *     title: `Campaign Report ${id}`,
 *     description: "View campaign analytics"
 *   };
 * });
 *
 * // Custom params shape
 * export const generateMetadata = createMetadataFunction<{ id: string; slug: string }>(
 *   async ({ params }) => {
 *     const { id, slug } = await params;
 *     return {
 *       title: `${slug} - Report ${id}`,
 *     };
 *   }
 * );
 * ```
 */
export function createMetadataFunction<TParams = { id: string }>(
  fn: GenerateMetadata<TParams>,
): GenerateMetadata<TParams> {
  return fn;
}

// Re-export mailchimp metadata helpers for convenience
export {
  generateCampaignMetadata,
  generateCampaignReportMetadata,
  generateCampaignOpensMetadata,
  generateCampaignAbuseReportsMetadata,
  generateListMembersMetadata,
} from "@/utils/mailchimp/metadata";

export { generateClickDetailsMetadata } from "@/utils/mailchimp/metadata";

export { generateCampaignUnsubscribesMetadata } from "@/utils/mailchimp/metadata";

export { generateCampaignEmailActivityMetadata } from "@/utils/mailchimp/metadata";

export { generateCampaignRecipientsMetadata } from "@/utils/mailchimp/metadata";

export { generateCampaignLocationsMetadata } from "@/utils/mailchimp/metadata";

export { generateCampaignAdviceMetadata } from "@/utils/mailchimp/metadata";

export { generateDomainPerformanceMetadata } from "@/utils/mailchimp/metadata";

export { generateListActivityMetadata } from "@/utils/mailchimp/metadata";

export { generateListGrowthHistoryMetadata } from "@/utils/mailchimp/metadata";
