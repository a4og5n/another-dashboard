/**
 * Ecommerce Card Component
 * Displays the campaign ecommerce performance data in a card format
 *
 * Issue #135: Campaign report detail UI components - Ecommerce Performance
 * Following established patterns from existing dashboard components
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuShoppingCart, LuDollarSign, LuArrowUpRight } from "react-icons/lu";
import type { EcommerceCardProps } from "@/types/components/dashboard/reports";

export function EcommerceCard({ ecommerce, className }: EcommerceCardProps) {
  // Format currency using locale string with the currency code if available
  const formatCurrency = (value: number) => {
    const currencyCode = ecommerce.currency_code || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate average order value
  const averageOrderValue =
    ecommerce.total_orders > 0
      ? ecommerce.total_spent / ecommerce.total_orders
      : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuShoppingCart className="h-5 w-5 text-primary" />
          Ecommerce Performance
        </CardTitle>
        <CardDescription>
          Revenue and order metrics for this campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Total Orders
                </div>
                <LuShoppingCart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {ecommerce.total_orders.toLocaleString()}
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Total Revenue
                </div>
                <LuDollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {formatCurrency(ecommerce.total_revenue)}
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Total Spent</div>
                <LuDollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {formatCurrency(ecommerce.total_spent)}
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Avg. Order Value
                </div>
                <LuArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {formatCurrency(averageOrderValue)}
              </div>
            </div>
          </div>

          {/* Currency Indicator */}
          {ecommerce.currency_code && (
            <div className="text-xs text-muted-foreground flex items-center justify-end mt-2">
              <span>Currency: {ecommerce.currency_code}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
