/**
 * Ecommerce Section Component
 * Displays e-commerce performance analysis for campaigns
 *
 * Issue #135: Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

import { EcommerceCard } from "@/components/dashboard/reports/EcommerceCard";
import type { EcommerceSectionProps } from "@/types/components/dashboard/reports";

export function EcommerceSection({ ecommerce }: EcommerceSectionProps) {
  return (
    <div className="space-y-6 pt-4 border-t">
      <h2 className="text-2xl font-bold">Ecommerce Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <EcommerceCard
            ecommerce={ecommerce}
            className="h-full"
          />
        </div>
        <div className="md:col-span-1 bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">
            Ecommerce Insights
          </h3>
          <div className="prose prose-sm max-w-none">
            <p>
              This campaign generated{" "}
              <strong>
                {ecommerce.total_orders.toLocaleString()}
              </strong>{" "}
              orders with a total revenue of{" "}
              <strong>
                {ecommerce.total_revenue.toLocaleString()}
              </strong>
              {ecommerce.currency_code
                ? ` ${ecommerce.currency_code}`
                : ""}
              .
            </p>
            {ecommerce.total_orders > 0 && (
              <p>
                The average order value was{" "}
                <strong>
                  {(
                    ecommerce.total_spent /
                    ecommerce.total_orders
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  {ecommerce.currency_code
                    ? ` ${ecommerce.currency_code}`
                    : ""}
                </strong>
                .
              </p>
            )}
            <p className="text-muted-foreground text-sm mt-4">
              For detailed product sales information, visit your
              e-commerce platform&apos;s analytics dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
