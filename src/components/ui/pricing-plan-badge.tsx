import { Badge } from "@/components/ui/badge";
import {
  formatPricingPlan,
  getPricingPlanVariant,
} from "@/utils/mailchimp/pricing-plan";
import type { PricingPlanBadgeProps } from "@/types/components/ui/pricing-plan-badge";

/**
 * Displays a styled badge for Mailchimp pricing plans with consistent visual mapping.
 *
 * @param planType - Pricing plan type from Mailchimp API
 * @param className - Optional additional CSS classes
 * @returns A styled Badge component representing the pricing plan
 *
 * @example
 * ```tsx
 * <PricingPlanBadge planType="monthly" />
 * <PricingPlanBadge planType="forever_free" className="ml-2" />
 * ```
 */
export function PricingPlanBadge({
  planType,
  className,
}: PricingPlanBadgeProps) {
  return (
    <Badge variant={getPricingPlanVariant(planType)} className={className}>
      {formatPricingPlan(planType)}
    </Badge>
  );
}
