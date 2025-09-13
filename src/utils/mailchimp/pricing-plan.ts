import { PRICING_PLAN_TYPES } from "@/schemas/mailchimp/root-success.schema";

/**
 * Utility functions for Mailchimp pricing plan formatting and handling
 *
 * @example
 * ```tsx
 * // Use utility functions directly:
 * import { formatPricingPlan, getPricingPlanVariant } from "@/utils/mailchimp/pricing-plan";
 *
 * const displayName = formatPricingPlan("pay_as_you_go"); // "Pay As You Go"
 * const variant = getPricingPlanVariant("monthly"); // "default"
 *
 * // Or use the reusable component:
 * import { PricingPlanBadge } from "@/components/ui/pricing-plan-badge";
 *
 * <PricingPlanBadge planType="forever_free" />
 * ```
 */

export type PricingPlanType = (typeof PRICING_PLAN_TYPES)[number];

/**
 * Formats a pricing plan type into a human-readable display name
 *
 * @param planType - The pricing plan type from Mailchimp API
 * @returns Formatted display name for the pricing plan
 *
 * @example
 * ```ts
 * formatPricingPlan("pay_as_you_go") // "Pay As You Go"
 * formatPricingPlan("monthly") // "Monthly"
 * ```
 */
export function formatPricingPlan(planType: string): string {
  switch (planType) {
    case "monthly":
      return "Monthly";
    case "pay_as_you_go":
      return "Pay As You Go";
    case "forever_free":
      return "Forever Free";
    default:
      return planType;
  }
}

/**
 * Gets the appropriate badge variant for a pricing plan type
 *
 * @param planType - The pricing plan type from Mailchimp API
 * @returns Badge variant string for styling
 *
 * @example
 * ```ts
 * getPricingPlanVariant("forever_free") // "secondary"
 * getPricingPlanVariant("monthly") // "default"
 * ```
 */
export function getPricingPlanVariant(
  planType: string,
): "default" | "secondary" | "outline" {
  switch (planType) {
    case "forever_free":
      return "secondary";
    case "pay_as_you_go":
      return "outline";
    case "monthly":
      return "default";
    default:
      return "outline";
  }
}
